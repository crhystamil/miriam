from decimal import Decimal
from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from products.models import Product
from sales.models import Wholesaler
from sales.services import register_purchase, register_sale


User = get_user_model()


class SalesApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminapi", password="secret123", role="admin")
        self.vendor = User.objects.create_user(username="vendorapi", password="secret123", role="vendor")
        self.product = Product.objects.create(
            sku="API-001",
            name="Bujia",
            cost_price=Decimal("10.00"),
            wholesale_reference_price=Decimal("14.00"),
            public_price=Decimal("18.00"),
            stock=0,
        )
        register_purchase(product_id=self.product.id, quantity=20, unit_cost=Decimal("10.00"))
        self.wholesaler = Wholesaler.objects.create(name="Mayorista API", phone="72000000")

    def test_vendor_can_create_sale_for_self(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(
            "/api/sales/",
            {
                "product": self.product.id,
                "vendor": self.admin.id,
                "wholesaler": self.wholesaler.id,
                "unit_sale_price": "17.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["vendor"], self.vendor.id)

    def test_vendor_can_create_sale_without_vendor_field(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(
            "/api/sales/",
            {
                "product": self.product.id,
                "wholesaler": self.wholesaler.id,
                "unit_sale_price": "17.00",
                "notes": "venta desde modal",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["vendor"], self.vendor.id)

    def test_admin_cannot_create_sale_without_vendor(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/sales/",
            {
                "product": self.product.id,
                "wholesaler": self.wholesaler.id,
                "unit_sale_price": "17.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["code"], "validation_error")
        self.assertIn("vendor", response.data["field_errors"])

    def test_vendor_cannot_create_purchase(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(
            "/api/purchases/",
            {
                "product": self.product.id,
                "quantity": 1,
                "unit_cost": "10.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_vendor_can_deactivate_own_sale_and_restore_stock(self) -> None:
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 19)

        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(f"/api/sales/{sale.id}/deactivate/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_active"])

        sale.refresh_from_db()
        self.product.refresh_from_db()
        self.assertFalse(sale.is_active)
        self.assertEqual(self.product.stock, 20)

    def test_vendor_cannot_delete_sale(self) -> None:
        sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        self.client.force_authenticate(user=self.vendor)
        response = self.client.delete(f"/api/sales/{sale.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_sales_list_is_paginated(self) -> None:
        for _ in range(12):
            register_sale(
                product_id=self.product.id,
                vendor_id=self.vendor.id,
                wholesaler_id=self.wholesaler.id,
                unit_sale_price=Decimal("17.00"),
            )
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/sales/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertEqual(len(response.data["results"]), 10)

    def test_sales_list_filters_by_date_range(self) -> None:
        old_sale = register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        old_sale.sold_at = timezone.make_aware(datetime(2026, 1, 10, 10, 0, 0))
        old_sale.save(update_fields=["sold_at"])

        register_sale(
            product_id=self.product.id,
            vendor_id=self.vendor.id,
            wholesaler_id=self.wholesaler.id,
            unit_sale_price=Decimal("17.00"),
        )
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/sales/?from=2026-02-01")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_vendor_can_create_sale_even_if_period_has_previous_cut(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(
            "/api/sales/",
            {
                "product": self.product.id,
                "vendor": self.vendor.id,
                "wholesaler": self.wholesaler.id,
                "unit_sale_price": "17.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
