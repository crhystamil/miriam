from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from core.models import User
from products.models import Product
from sales.models import Purchase, Sale, Wholesaler
from sales.services import deactivate_sale, register_purchase, register_sale


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
        self.assertEqual(self.product.cost_price, Decimal("50.00"))

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
        self.assertEqual(self.product.cost_price, Decimal("70.00"))

    def test_purchase_invalid_quantity_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            register_purchase(product_id=self.product.id, quantity=0, unit_cost=Decimal("50.00"))

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
        self.assertEqual(self.product.cost_price, Decimal("60.00"))


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

    def test_sale_rejects_non_vendor_user(self) -> None:
        register_purchase(product_id=self.product.id, quantity=2, unit_cost=Decimal("20.00"))
        with self.assertRaises(ValidationError):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.admin.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("34.00"),
            )


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
