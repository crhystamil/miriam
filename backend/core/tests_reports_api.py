from decimal import Decimal
from datetime import datetime

from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone

from core.models import User
from expenses.models import Expense
from products.models import Product
from sales.models import Wholesaler
from sales.services import register_purchase, register_sale


def _create_n_sales(product_id, vendor_id, wholesaler_id, unit_sale_price, count):
    for _ in range(count):
        register_sale(
            product_id=product_id,
            vendor_id=vendor_id,
            wholesaler_id=wholesaler_id,
            unit_sale_price=unit_sale_price,
        )


class DashboardReportApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminrep", password="secret123", role=User.Role.ADMIN)
        self.vendor_a = User.objects.create_user(username="vendora", password="secret123", role=User.Role.VENDOR)
        self.vendor_b = User.objects.create_user(username="vendorb", password="secret123", role=User.Role.VENDOR)

        self.product = Product.objects.create(
            sku="REP-001",
            name="Radiador",
            cost_price=Decimal("100.00"),
            wholesale_reference_price=Decimal("130.00"),
            public_price=Decimal("150.00"),
            stock=0,
        )
        self.low_stock = Product.objects.create(
            sku="REP-002",
            name="Correa",
            cost_price=Decimal("20.00"),
            wholesale_reference_price=Decimal("25.00"),
            public_price=Decimal("30.00"),
            stock=3,
        )

        register_purchase(product_id=self.product.id, quantity=20, unit_cost=Decimal("100.00"))
        wholesaler = Wholesaler.objects.create(name="Mayorista Reportes", phone="73000000")
        _create_n_sales(self.product.id, self.vendor_a.id, wholesaler.id, Decimal("145.00"), 4)
        sales_b = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor_b.id,
            wholesaler_id=wholesaler.id,
            unit_sale_price=Decimal("140.00"),
        )
        sales_b.sold_at = timezone.make_aware(datetime(2026, 4, 10, 12, 0, 0))
        sales_b.save(update_fields=["sold_at"])
        _create_n_sales(self.product.id, self.vendor_b.id, wholesaler.id, Decimal("140.00"), 1)

        Expense.objects.create(scope=Expense.Scope.STORE, concept="Luz", amount=Decimal("50.00"))
        vendor_expense = Expense.objects.create(
            scope=Expense.Scope.VENDOR,
            vendor=self.vendor_a,
            concept="Transporte",
            amount=Decimal("10.00"),
        )
        vendor_expense.spent_at = timezone.make_aware(datetime(2026, 4, 12, 10, 0, 0))
        vendor_expense.save(update_fields=["spent_at"])

    def test_admin_sees_global_dashboard_totals(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/dashboard/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 6)
        self.assertEqual(response.data["units_sold"], 6)
        self.assertEqual(response.data["store_profit"], Decimal("180.00"))
        self.assertEqual(response.data["vendor_profit"], Decimal("80.00"))
        self.assertEqual(response.data["total_expenses"], Decimal("60.00"))
        self.assertTrue(any(p["sku"] == "REP-002" for p in response.data["low_stock_products"]))

    def test_vendor_sees_only_own_sales_and_expenses(self) -> None:
        self.client.force_authenticate(user=self.vendor_a)
        response = self.client.get("/api/reports/dashboard/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 4)
        self.assertEqual(response.data["units_sold"], 4)
        self.assertEqual(response.data["store_profit"], Decimal("120.00"))
        self.assertEqual(response.data["vendor_profit"], Decimal("60.00"))
        self.assertEqual(response.data["total_expenses"], Decimal("10.00"))

    def test_dashboard_accepts_date_range_filters(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/dashboard/?from=2026-06-01&to=2026-06-30")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 5)
        self.assertEqual(response.data["units_sold"], 5)
        self.assertEqual(response.data["total_expenses"], Decimal("50.00"))

    def test_dashboard_accepts_month_filter(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/dashboard/?month=2026-04")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 1)
        self.assertEqual(response.data["units_sold"], 1)
        self.assertEqual(response.data["total_expenses"], Decimal("10.00"))

    def test_dashboard_rejects_invalid_filter_format(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/dashboard/?from=2026-99-01")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "invalid_query_params")

    def test_dashboard_profit_uses_historical_sale_values_after_later_changes(self) -> None:
        product = Product.objects.create(
            sku="REP-HIST",
            name="Historico",
            cost_price=Decimal("10.00"),
            wholesale_reference_price=Decimal("15.00"),
            public_price=Decimal("20.00"),
            stock=0,
        )
        register_purchase(product_id=product.id, quantity=1, unit_cost=Decimal("10.00"))
        register_purchase(product_id=product.id, quantity=1, unit_cost=Decimal("20.00"))
        wholesaler = Wholesaler.objects.create(name="Mayorista Historico", phone="75000000")
        sale = register_sale(
            product_id=product.id,
            vendor_id=self.vendor_a.id,
            wholesaler_id=wholesaler.id,
            unit_sale_price=Decimal("25.00"),
            quantity=2,
        )
        sale.sold_at = timezone.make_aware(datetime(2026, 7, 10, 12, 0, 0))
        sale.save(update_fields=["sold_at"])

        register_purchase(product_id=product.id, quantity=5, unit_cost=Decimal("99.00"))
        product.cost_price = Decimal("88.00")
        product.wholesale_reference_price = Decimal("77.00")
        product.public_price = Decimal("99.00")
        product.save(update_fields=["cost_price", "wholesale_reference_price", "public_price"])

        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/dashboard/?from=2026-07-01&to=2026-07-31")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 1)
        self.assertEqual(response.data["units_sold"], 2)
        self.assertEqual(response.data["store_profit"], Decimal("0.00"))
        self.assertEqual(response.data["vendor_profit"], Decimal("20.00"))


class MonthlyReportApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminmonthly", password="secret123", role=User.Role.ADMIN)
        self.vendor = User.objects.create_user(username="vendormonthly", password="secret123", role=User.Role.VENDOR)
        self.other_vendor = User.objects.create_user(username="vendorother", password="secret123", role=User.Role.VENDOR)

        product = Product.objects.create(
            sku="MON-001",
            name="Amortiguador",
            cost_price=Decimal("50.00"),
            wholesale_reference_price=Decimal("65.00"),
            public_price=Decimal("80.00"),
            stock=0,
        )
        register_purchase(product_id=product.id, quantity=30, unit_cost=Decimal("50.00"))
        wholesaler = Wholesaler.objects.create(name="Mayorista Mensual", phone="74000000")

        for _ in range(3):
            sale_vendor = register_sale(
                product_id=product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=wholesaler.id,
                unit_sale_price=Decimal("75.00"),
            )
            sale_vendor.sold_at = timezone.make_aware(datetime(2026, 5, 10, 11, 0, 0))
            sale_vendor.save(update_fields=["sold_at"])

        for _ in range(2):
            sale_other = register_sale(
                product_id=product.id,
                vendor_id=self.other_vendor.id,
                wholesaler_id=wholesaler.id,
                unit_sale_price=Decimal("74.00"),
            )
            sale_other.sold_at = timezone.make_aware(datetime(2026, 5, 11, 11, 0, 0))
            sale_other.save(update_fields=["sold_at"])

        expense_store = Expense.objects.create(scope=Expense.Scope.STORE, concept="Alquiler", amount=Decimal("120.00"))
        expense_store.spent_at = timezone.make_aware(datetime(2026, 5, 5, 10, 0, 0))
        expense_store.save(update_fields=["spent_at"])
        expense_vendor = Expense.objects.create(
            scope=Expense.Scope.VENDOR,
            vendor=self.vendor,
            concept="Taxi",
            amount=Decimal("15.00"),
        )
        expense_vendor.spent_at = timezone.make_aware(datetime(2026, 5, 6, 10, 0, 0))
        expense_vendor.save(update_fields=["spent_at"])

    def test_monthly_report_requires_month_param(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/monthly/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "invalid_query_params")

    def test_admin_monthly_report_totals(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/monthly/?month=2026-05")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 5)
        self.assertEqual(response.data["units_sold"], 5)
        self.assertEqual(response.data["store_profit"], Decimal("75.00"))
        self.assertEqual(response.data["vendor_profit"], Decimal("48.00"))
        self.assertEqual(response.data["total_expenses"], Decimal("135.00"))

    def test_vendor_monthly_report_visibility(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/reports/monthly/?month=2026-05")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sales_count"], 3)
        self.assertEqual(response.data["units_sold"], 3)
        self.assertEqual(response.data["store_profit"], Decimal("45.00"))
        self.assertEqual(response.data["vendor_profit"], Decimal("30.00"))
        self.assertEqual(response.data["total_expenses"], Decimal("15.00"))


class InventoryCapitalApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="admincap", password="secret123", role=User.Role.ADMIN)
        self.product_a = Product.objects.create(
            sku="CAP-001", name="Producto A",
            cost_price=Decimal("50.00"),
            wholesale_reference_price=Decimal("65.00"),
            public_price=Decimal("80.00"),
            stock=0,
        )
        self.product_b = Product.objects.create(
            sku="CAP-002", name="Producto B",
            cost_price=Decimal("30.00"),
            wholesale_reference_price=Decimal("40.00"),
            public_price=Decimal("50.00"),
            stock=0,
        )

    def test_capital_single_product_multiple_lots(self) -> None:
        register_purchase(product_id=self.product_a.id, quantity=3, unit_cost=Decimal("50.00"))
        register_purchase(product_id=self.product_a.id, quantity=2, unit_cost=Decimal("70.00"))

        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/inventory-capital/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data["total_capital"]), Decimal("290.00"))
        self.assertEqual(len(response.data["by_product"]), 1)
        self.assertEqual(response.data["by_product"][0]["total_units"], 5)
        self.assertEqual(Decimal(response.data["by_product"][0]["capital"]), Decimal("290.00"))

    def test_capital_multiple_products(self) -> None:
        register_purchase(product_id=self.product_a.id, quantity=4, unit_cost=Decimal("50.00"))
        register_purchase(product_id=self.product_b.id, quantity=6, unit_cost=Decimal("30.00"))

        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/inventory-capital/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data["total_capital"]), Decimal("380.00"))
        self.assertEqual(len(response.data["by_product"]), 2)

    def test_inventory_mismatch_report_flags_stock_lot_differences(self) -> None:
        register_purchase(product_id=self.product_a.id, quantity=3, unit_cost=Decimal("50.00"))
        self.product_a.refresh_from_db()
        self.product_a.stock = 5
        self.product_a.save(update_fields=["stock"])

        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/reports/inventory-mismatches/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["product_id"], self.product_a.id)
        self.assertEqual(response.data["results"][0]["product_stock"], 5)
        self.assertEqual(response.data["results"][0]["lot_remaining_total"], 3)
        self.assertEqual(response.data["results"][0]["difference"], 2)
