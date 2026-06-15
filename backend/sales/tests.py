from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from core.models import User
from products.models import Product
from sales.models import InventoryAdjustment, Purchase, Sale, SaleCostAllocation, Wholesaler
from sales.services import (
    deactivate_sale,
    get_active_lot_remaining_total,
    get_stock_lot_mismatch,
    reconcile_product_stock_lots,
    register_inventory_adjustment,
    register_purchase,
    register_sale,
)


class MigrationDataTests(TestCase):
    def test_existing_purchases_have_remaining_equal_quantity(self) -> None:
        vendor = User.objects.create_user(username="v_mig", password="secret123", role=User.Role.VENDOR)
        product = Product.objects.create(
            sku="MIG-001", name="Producto migracion",
            cost_price=Decimal("10.00"),
            wholesale_reference_price=Decimal("15.00"),
            public_price=Decimal("20.00"),
            stock=5,
        )
        wholesaler = Wholesaler.objects.create(name="Mig Wholesaler", phone="70000001")

        for purchase in Purchase.objects.filter(product=product):
            self.assertEqual(purchase.remaining, purchase.quantity)

    def test_product_with_stock_has_synthetic_lot(self) -> None:
        vendor = User.objects.create_user(username="v_mig2", password="secret123", role=User.Role.VENDOR)
        product = Product.objects.create(
            sku="MIG-002", name="Producto sin compras",
            cost_price=Decimal("10.00"),
            wholesale_reference_price=Decimal("15.00"),
            public_price=Decimal("20.00"),
            stock=8,
        )
        register_purchase(product_id=product.id, quantity=8, unit_cost=Decimal("10.00"))
        purchases = Purchase.objects.filter(product=product)
        self.assertEqual(purchases.count(), 1)
        self.assertEqual(purchases.first().remaining, 8)
        self.assertEqual(purchases.first().unit_cost, Decimal("10.00"))


class PurchaseFifoTests(TestCase):
    def setUp(self) -> None:
        self.vendor = User.objects.create_user(username="vendor1", password="secret123", role=User.Role.VENDOR)
        self.admin = User.objects.create_user(username="admin1", password="secret123", role=User.Role.ADMIN)
        self.product = Product.objects.create(
            sku="FILTRO-001", name="Filtro de aceite",
            cost_price=Decimal("20.00"),
            wholesale_reference_price=Decimal("28.00"),
            public_price=Decimal("35.00"),
            stock=0,
        )
        self.wholesaler = Wholesaler.objects.create(name="Mayorista Test", phone="70000000")

    def test_register_purchase_creates_lot_with_remaining(self) -> None:
        purchase = register_purchase(product_id=self.product.id, quantity=10, unit_cost=Decimal("50.00"))
        self.assertEqual(purchase.remaining, 10)
        self.assertEqual(purchase.quantity, 10)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)
        self.assertEqual(self.product.cost_price, Decimal("20.00"))

    def test_two_purchases_create_independent_lots(self) -> None:
        register_purchase(product_id=self.product.id, quantity=10, unit_cost=Decimal("50.00"))
        register_purchase(product_id=self.product.id, quantity=5, unit_cost=Decimal("70.00"))
        purchases = Purchase.objects.filter(product=self.product).order_by("purchased_at")
        self.assertEqual(purchases.count(), 2)
        self.assertEqual(purchases[0].remaining, 10)
        self.assertEqual(purchases[0].unit_cost, Decimal("50.00"))
        self.assertEqual(purchases[1].remaining, 5)
        self.assertEqual(purchases[1].unit_cost, Decimal("70.00"))
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 15)
        self.assertEqual(self.product.cost_price, Decimal("20.00"))

    def test_later_purchase_does_not_mutate_existing_lot_costs(self) -> None:
        first_purchase = register_purchase(product_id=self.product.id, quantity=10, unit_cost=Decimal("50.00"))

        register_purchase(product_id=self.product.id, quantity=5, unit_cost=Decimal("70.00"))

        first_purchase.refresh_from_db()
        self.assertEqual(first_purchase.unit_cost, Decimal("50.00"))
        self.assertEqual(first_purchase.remaining, 10)

    def test_purchase_invalid_quantity_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            register_purchase(product_id=self.product.id, quantity=0, unit_cost=Decimal("50.00"))

    def test_purchase_invalid_unit_cost_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            register_purchase(product_id=self.product.id, quantity=1, unit_cost=Decimal("0.00"))

    def test_purchase_after_exhausted_lots_creates_new_lot(self) -> None:
        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("50.00"))
        lot = Purchase.objects.filter(product=self.product, remaining__gt=0).order_by("purchased_at").first()
        lot.remaining = 0
        lot.save(update_fields=["remaining"])
        self.product.stock = 0
        self.product.save(update_fields=["stock"])

        new_purchase = register_purchase(product_id=self.product.id, quantity=8, unit_cost=Decimal("60.00"))
        self.assertEqual(new_purchase.remaining, 8)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)
        self.assertEqual(self.product.cost_price, Decimal("20.00"))


class ProductStockLotSyncTests(TestCase):
    def setUp(self) -> None:
        self.product = Product.objects.create(
            sku="SYNC-001",
            name="Producto Sync",
            cost_price=Decimal("25.00"),
            wholesale_reference_price=Decimal("30.00"),
            public_price=Decimal("40.00"),
            stock=0,
        )

    def test_active_lot_total_sums_remaining_inventory(self) -> None:
        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("25.00"))
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("30.00"))
        first_lot = Purchase.objects.filter(product=self.product).order_by("purchased_at").first()
        first_lot.remaining = 1
        first_lot.save(update_fields=["remaining"])

        self.assertEqual(get_active_lot_remaining_total(product=self.product), 3)

    def test_stock_lot_mismatch_reports_difference(self) -> None:
        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("25.00"))
        self.product.refresh_from_db()
        self.product.stock = 5
        self.product.save(update_fields=["stock"])

        mismatch = get_stock_lot_mismatch(product=self.product)

        self.assertEqual(mismatch["product_id"], self.product.id)
        self.assertEqual(mismatch["product_stock"], 5)
        self.assertEqual(mismatch["lot_remaining_total"], 3)
        self.assertEqual(mismatch["difference"], 2)

    def test_reconcile_existing_product_stock_without_matching_lot_creates_initial_lot(self) -> None:
        self.product.stock = 8
        self.product.save(update_fields=["stock"])

        lot = reconcile_product_stock_lots(product_id=self.product.id)

        self.assertIsNotNone(lot)
        self.assertEqual(lot.quantity, 8)
        self.assertEqual(lot.remaining, 8)
        self.assertEqual(lot.unit_cost, Decimal("25.00"))
        self.product.refresh_from_db()
        self.assertIsNone(get_stock_lot_mismatch(product=self.product))


class SaleFifoTests(TestCase):
    def setUp(self) -> None:
        self.vendor = User.objects.create_user(username="vendor2", password="secret123", role=User.Role.VENDOR)
        self.admin = User.objects.create_user(username="admin2", password="secret123", role=User.Role.ADMIN)
        self.product = Product.objects.create(
            sku="BUJIA-001", name="Bujia NGK",
            cost_price=Decimal("20.00"),
            wholesale_reference_price=Decimal("30.00"),
            public_price=Decimal("40.00"),
            stock=0,
        )
        self.wholesaler = Wholesaler.objects.create(name="Mayorista FIFO", phone="70000001")

    def _create_two_lots(self) -> Purchase:
        register_purchase(product_id=self.product.id, quantity=10, unit_cost=Decimal("50.00"))
        register_purchase(product_id=self.product.id, quantity=5, unit_cost=Decimal("70.00"))
        return Purchase.objects.filter(product=self.product).order_by("purchased_at").first()

    def test_sale_consumes_oldest_lot(self) -> None:
        self._create_two_lots()
        self.product.cost_price = Decimal("99.00")
        self.product.save(update_fields=["cost_price"])
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        self.assertEqual(sale.unit_cost_price, Decimal("50.00"))
        self.assertEqual(sale.quantity, 1)
        self.assertEqual(sale.purchase.unit_cost, Decimal("50.00"))
        lot_a = Purchase.objects.filter(product=self.product).order_by("purchased_at")[0]
        self.assertEqual(lot_a.remaining, 9)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 14)
        total_remaining = sum(p.remaining for p in Purchase.objects.filter(product=self.product))
        self.assertEqual(self.product.stock, total_remaining)
        allocation = SaleCostAllocation.objects.get(sale=sale)
        self.assertEqual(allocation.purchase_id, sale.purchase_id)
        self.assertEqual(allocation.quantity, 1)
        self.assertEqual(allocation.unit_cost, Decimal("50.00"))

    def test_sale_exhausts_lot_a_then_consumes_lot_b(self) -> None:
        self._create_two_lots()
        for _ in range(10):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("80.00"),
            )
        lot_a = Purchase.objects.filter(product=self.product).order_by("purchased_at")[0]
        lot_b = Purchase.objects.filter(product=self.product).order_by("purchased_at")[1]
        self.assertEqual(lot_a.remaining, 0)

        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        self.assertEqual(sale.unit_cost_price, Decimal("70.00"))
        self.assertEqual(sale.purchase_id, lot_b.id)
        lot_b.refresh_from_db()
        self.assertEqual(lot_b.remaining, 4)
        self.product.refresh_from_db()
        total_remaining = sum(p.remaining for p in Purchase.objects.filter(product=self.product))
        self.assertEqual(self.product.stock, total_remaining)

    def test_sale_rejects_when_all_lots_exhausted(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("50.00"))
        register_sale(product_id=self.product.id, vendor_id=self.vendor.id, wholesaler_id=self.wholesaler.id, unit_sale_price=Decimal("80.00"))
        register_sale(product_id=self.product.id, vendor_id=self.vendor.id, wholesaler_id=self.wholesaler.id, unit_sale_price=Decimal("80.00"))

        with self.assertRaises(ValidationError) as ctx:
            register_sale(
                product_id=self.product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("80.00"),
            )
        self.assertIn("stock", str(ctx.exception).lower())

    def test_sale_forces_quantity_one(self) -> None:
        register_purchase(product_id=self.product.id, quantity=5, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        self.assertEqual(sale.quantity, 1)

    def test_second_sale_on_last_unit_rejected(self) -> None:
        register_purchase(product_id=self.product.id, quantity=1, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        self.assertEqual(sale.quantity, 1)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 0)

        with self.assertRaises(ValidationError):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("80.00"),
            )

    def test_multi_lot_sale_records_each_fifo_allocation(self) -> None:
        register_purchase(product_id=self.product.id, quantity=1, unit_cost=Decimal("50.00"))
        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("70.00"))

        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("90.00"),
            quantity=2,
        )

        allocations = list(sale.cost_allocations.order_by("id"))
        self.assertEqual(len(allocations), 2)
        self.assertEqual(allocations[0].quantity, 1)
        self.assertEqual(allocations[0].unit_cost, Decimal("50.00"))
        self.assertEqual(allocations[1].quantity, 1)
        self.assertEqual(allocations[1].unit_cost, Decimal("70.00"))
        self.assertEqual(sale.quantity, 2)
        self.assertEqual(sale.unit_cost_price, Decimal("60.00"))
        lots = list(Purchase.objects.filter(product=self.product).order_by("purchased_at"))
        self.assertEqual(lots[0].remaining, 0)
        self.assertEqual(lots[1].remaining, 2)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 2)

    def test_multi_unit_sale_rejects_when_lot_stock_is_insufficient(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("50.00"))

        with self.assertRaises(ValidationError):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("80.00"),
                quantity=3,
            )

        self.product.refresh_from_db()
        lot = Purchase.objects.get(product=self.product)
        self.assertEqual(self.product.stock, 2)
        self.assertEqual(lot.remaining, 2)
        self.assertEqual(Sale.objects.filter(product=self.product).count(), 0)

    def test_sale_rejects_non_vendor_user(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("20.00"))
        with self.assertRaises(ValidationError):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.admin.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("34.00"),
            )

    def test_later_purchase_does_not_change_existing_sale_values(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )

        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("70.00"))

        sale.refresh_from_db()
        self.assertEqual(sale.unit_cost_price, Decimal("50.00"))
        self.assertEqual(sale.unit_sale_price, Decimal("80.00"))

    def test_product_price_change_does_not_change_existing_sale_values(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )

        self.product.cost_price = Decimal("90.00")
        self.product.wholesale_reference_price = Decimal("95.00")
        self.product.public_price = Decimal("110.00")
        self.product.save(update_fields=["cost_price", "wholesale_reference_price", "public_price"])

        sale.refresh_from_db()
        self.assertEqual(sale.unit_cost_price, Decimal("50.00"))
        self.assertEqual(sale.unit_wholesale_reference_price, Decimal("30.00"))
        self.assertEqual(sale.unit_sale_price, Decimal("80.00"))

    def test_later_purchase_and_stock_adjustment_do_not_change_existing_sale_values(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        allocation = sale.cost_allocations.get()

        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("70.00"))
        register_inventory_adjustment(
            product_id=self.product.id,
            actor=self.admin,
            direction=InventoryAdjustment.Direction.INCREASE,
            quantity=1,
            unit_cost=Decimal("90.00"),
            reason="conteo posterior",
        )

        sale.refresh_from_db()
        allocation.refresh_from_db()
        self.assertEqual(sale.unit_cost_price, Decimal("50.00"))
        self.assertEqual(sale.unit_wholesale_reference_price, Decimal("30.00"))
        self.assertEqual(sale.unit_sale_price, Decimal("80.00"))
        self.assertEqual(allocation.unit_cost, Decimal("50.00"))
        self.assertEqual(allocation.quantity, 1)


class DeactivateSaleFifoTests(TestCase):
    def setUp(self) -> None:
        self.vendor = User.objects.create_user(username="vendor3", password="secret123", role=User.Role.VENDOR)
        self.admin = User.objects.create_user(username="admin3", password="secret123", role=User.Role.ADMIN)
        self.product = Product.objects.create(
            sku="DISCO-001", name="Disco de freno",
            cost_price=Decimal("20.00"),
            wholesale_reference_price=Decimal("30.00"),
            public_price=Decimal("40.00"),
            stock=0,
        )
        self.wholesaler = Wholesaler.objects.create(name="Mayorista Deact", phone="70000002")

    def test_deactivate_restores_remaining_to_lot(self) -> None:
        register_purchase(product_id=self.product.id, quantity=10, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        lot = Purchase.objects.get(pk=sale.purchase_id)
        self.assertEqual(lot.remaining, 9)

        deactivate_sale(sale=sale, actor=self.admin)
        lot.refresh_from_db()
        self.assertEqual(lot.remaining, 10)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)
        adjustment = InventoryAdjustment.objects.get(source_sale=sale)
        self.assertEqual(adjustment.direction, InventoryAdjustment.Direction.REVERSAL)
        self.assertEqual(adjustment.quantity, 1)
        self.assertEqual(adjustment.reason, "Venta deshabilitada")
        self.assertEqual(adjustment.affected_lots.count(), 1)

    def test_deactivate_already_inactive_does_nothing(self) -> None:
        register_purchase(product_id=self.product.id, quantity=5, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        deactivate_sale(sale=sale, actor=self.admin)
        self.assertFalse(sale.is_active)

        lot = Purchase.objects.get(pk=sale.purchase_id)
        remaining_before = lot.remaining

        result = deactivate_sale(sale=sale, actor=self.admin)
        self.assertFalse(result.is_active)
        lot.refresh_from_db()
        self.assertEqual(lot.remaining, remaining_before)

    def test_stock_matches_remaining_sum_after_deactivate(self) -> None:
        register_purchase(product_id=self.product.id, quantity=8, unit_cost=Decimal("50.00"))
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("80.00"),
        )
        deactivate_sale(sale=sale, actor=self.admin)
        self.product.refresh_from_db()
        total_remaining = sum(p.remaining for p in Purchase.objects.filter(product=self.product))
        self.assertEqual(self.product.stock, total_remaining)


class InventoryAdjustmentTests(TestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminadj", password="secret123", role=User.Role.ADMIN)
        self.vendor = User.objects.create_user(username="vendoradj", password="secret123", role=User.Role.VENDOR)
        self.product = Product.objects.create(
            sku="ADJ-001",
            name="Producto Ajuste",
            cost_price=Decimal("20.00"),
            wholesale_reference_price=Decimal("30.00"),
            public_price=Decimal("40.00"),
            stock=0,
        )

    def test_positive_inventory_adjustment_requires_reason_and_cost_basis(self) -> None:
        adjustment = register_inventory_adjustment(
            product_id=self.product.id,
            actor=self.admin,
            direction=InventoryAdjustment.Direction.INCREASE,
            quantity=4,
            unit_cost=Decimal("22.00"),
            reason="conteo inicial",
        )

        self.product.refresh_from_db()
        lot = Purchase.objects.get(product=self.product)
        self.assertEqual(self.product.stock, 4)
        self.assertEqual(lot.remaining, 4)
        self.assertEqual(lot.unit_cost, Decimal("22.00"))
        self.assertEqual(adjustment.affected_lots.count(), 1)

    def test_negative_inventory_adjustment_identifies_affected_fifo_lots(self) -> None:
        register_purchase(product_id=self.product.id, quantity=1, unit_cost=Decimal("20.00"))
        register_purchase(product_id=self.product.id, quantity=3, unit_cost=Decimal("30.00"))

        adjustment = register_inventory_adjustment(
            product_id=self.product.id,
            actor=self.admin,
            direction=InventoryAdjustment.Direction.DECREASE,
            quantity=2,
            reason="merma",
        )

        affected = list(adjustment.affected_lots.order_by("id"))
        self.assertEqual(len(affected), 2)
        self.assertEqual(affected[0].quantity, 1)
        self.assertEqual(affected[0].unit_cost, Decimal("20.00"))
        self.assertEqual(affected[1].quantity, 1)
        self.assertEqual(affected[1].unit_cost, Decimal("30.00"))
        lots = list(Purchase.objects.filter(product=self.product).order_by("purchased_at"))
        self.assertEqual(lots[0].remaining, 0)
        self.assertEqual(lots[1].remaining, 2)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 2)

    def test_inventory_adjustment_rejects_missing_reason(self) -> None:
        with self.assertRaises(ValidationError):
            register_inventory_adjustment(
                product_id=self.product.id,
                actor=self.admin,
                direction=InventoryAdjustment.Direction.INCREASE,
                quantity=1,
                unit_cost=Decimal("22.00"),
                reason="",
            )

    def test_vendor_cannot_adjust_inventory(self) -> None:
        with self.assertRaises(ValidationError):
            register_inventory_adjustment(
                product_id=self.product.id,
                actor=self.vendor,
                direction=InventoryAdjustment.Direction.INCREASE,
                quantity=1,
                unit_cost=Decimal("22.00"),
                reason="conteo",
            )
