from datetime import datetime
from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from core.models import User
from expenses.models import Expense
from products.models import Product
from sales.models import Wholesaler
from sales.services import register_purchase, register_sale


class MonthlyCutApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="admincut", password="secret123", role=User.Role.ADMIN)
        self.vendor = User.objects.create_user(username="vendorcut", password="secret123", role=User.Role.VENDOR)

        product = Product.objects.create(
            sku="CUT-001",
            name="Filtro",
            cost_price=Decimal("10.00"),
            wholesale_reference_price=Decimal("14.00"),
            public_price=Decimal("18.00"),
            stock=0,
        )
        register_purchase(product_id=product.id, quantity=20, unit_cost=Decimal("10.00"))
        wholesaler = Wholesaler.objects.create(name="Mayorista Corte", phone="70000000")

        sale_enabled = register_sale(
            product_id=product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        sale_enabled.sold_at = timezone.make_aware(datetime(2026, 5, 10, 10, 0, 0))
        sale_enabled.save(update_fields=["sold_at"])

        sale_enabled_2 = register_sale(
            product_id=product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        sale_enabled_2.sold_at = timezone.make_aware(datetime(2026, 5, 10, 12, 0, 0))
        sale_enabled_2.save(update_fields=["sold_at"])

        sale_disabled = register_sale(
            product_id=product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=wholesaler.id,
            unit_sale_price=Decimal("16.00"),
        )
        sale_disabled.sold_at = timezone.make_aware(datetime(2026, 5, 11, 11, 0, 0))
        sale_disabled.is_active = False
        sale_disabled.save(update_fields=["sold_at", "is_active"])

        expense = Expense.objects.create(scope=Expense.Scope.STORE, concept="Luz", amount=Decimal("10.00"))
        expense.spent_at = timezone.make_aware(datetime(2026, 5, 12, 12, 0, 0))
        expense.save(update_fields=["spent_at"])

    def test_admin_can_execute_monthly_cut_and_get_report(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/cuts/",
            {"cutoff_date": "2026-05-15", "notes": "Corte mayo"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "completed")
        self.assertEqual(response.data["period"], "2026-05")
        self.assertIn("report", response.data)
        self.assertEqual(response.data["report"]["summary"]["total_income"], Decimal("34.00"))
        self.assertEqual(response.data["report"]["summary"]["real_net"], Decimal("-2.00"))
        self.assertEqual(response.data["report"]["expenses_detail"][0]["concept"], "Luz")

    def test_cannot_execute_duplicate_cut_for_same_period_and_cutoff(self) -> None:
        self.client.force_authenticate(user=self.admin)
        payload = {"cutoff_date": "2026-05-15", "notes": "Corte mayo"}
        first = self.client.post("/api/cuts/", payload, format="json")
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        second = self.client.post("/api/cuts/", payload, format="json")
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(second.data["code"], "validation_error")

    def test_cut_marks_sales_and_expenses_as_closed(self) -> None:
        self.client.force_authenticate(user=self.admin)
        self.client.post("/api/cuts/", {"cutoff_date": "2026-05-15"}, format="json")
        sales_response = self.client.get("/api/sales/")
        expenses_response = self.client.get("/api/expenses/")
        self.assertEqual(sales_response.status_code, status.HTTP_200_OK)
        self.assertEqual(expenses_response.status_code, status.HTTP_200_OK)
        self.assertEqual(sales_response.data["count"], 0)
        self.assertEqual(expenses_response.data["count"], 0)
