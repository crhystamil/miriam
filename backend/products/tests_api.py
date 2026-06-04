from decimal import Decimal

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from core.models import User
from products.models import Product, ProductImage


class ProductsApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminprod", password="secret123", role=User.Role.ADMIN)
        self.vendor = User.objects.create_user(username="vendorprod", password="secret123", role=User.Role.VENDOR)

        for index in range(12):
            Product.objects.create(
                sku=f"PR-{index:03}",
                name=f"Producto {index}",
                cost_price=Decimal("10.00"),
                wholesale_reference_price=Decimal("12.00"),
                public_price=Decimal("15.00"),
                stock=3 if index == 0 else 20,
                is_active=index % 2 == 0,
            )
        for product in Product.objects.all():
            image = SimpleUploadedFile(
                name=f"{product.sku}.jpg",
                content=b"fake-image-content",
                content_type="image/jpeg",
            )
            ProductImage.objects.create(
                product=product,
                image_file=image,
                content_type="image/jpeg",
                size_bytes=len(b"fake-image-content"),
                position=1,
            )

    def test_products_list_is_paginated(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 6)
        self.assertEqual(len(response.data["results"]), 6)

    def test_guest_can_list_only_active_products(self) -> None:
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 6)
        self.assertTrue(all(item["is_active"] for item in response.data["results"]))
        self.assertNotIn("PR-001", {item["sku"] for item in response.data["results"]})

    def test_guest_can_search_active_products(self) -> None:
        response = self.client.get("/api/products/?search=PR-000")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["sku"], "PR-000")

    def test_guest_search_without_matches_returns_empty_page(self) -> None:
        response = self.client.get("/api/products/?search=no-existe")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["results"], [])

    def test_guest_can_retrieve_active_product(self) -> None:
        product = Product.objects.get(sku="PR-000")
        response = self.client.get(f"/api/products/{product.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["sku"], "PR-000")
        self.assertTrue(response.data["is_active"])

    def test_guest_retrieve_inactive_product_returns_not_found(self) -> None:
        product = Product.objects.get(sku="PR-001")
        response = self.client.get(f"/api/products/{product.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_products_filter_by_search_and_low_stock(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/products/?search=PR-000&low_stock=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["sku"], "PR-000")

    def test_admin_can_create_product_with_images(self) -> None:
        self.client.force_authenticate(user=self.admin)
        image_1 = SimpleUploadedFile(name="new-1.jpg", content=b"image-bytes-1", content_type="image/jpeg")
        image_2 = SimpleUploadedFile(name="new-2.jpg", content=b"image-bytes-2", content_type="image/jpeg")
        response = self.client.post(
            "/api/products/",
            {
                "name": "Nuevo",
                "cost_price": "10.00",
                "wholesale_reference_price": "12.00",
                "public_price": "15.00",
                "stock": 4,
                "image_files": [image_1, image_2],
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["sku"].startswith("PRD"))
        self.assertIn("images", response.data)
        self.assertEqual(len(response.data["images"]), 2)

    def test_admin_cannot_create_product_without_images(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/products/",
            {
                "name": "Nuevo sin imagen",
                "cost_price": "10.00",
                "wholesale_reference_price": "12.00",
                "public_price": "15.00",
                "stock": 4,
                "image_files": [],
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_create_product_with_more_than_five_images(self) -> None:
        self.client.force_authenticate(user=self.admin)
        images = [
            SimpleUploadedFile(name=f"img-{index}.jpg", content=b"img-bytes", content_type="image/jpeg")
            for index in range(6)
        ]
        response = self.client.post(
            "/api/products/",
            {
                "name": "Nuevo con exceso",
                "cost_price": "10.00",
                "wholesale_reference_price": "12.00",
                "public_price": "15.00",
                "stock": 4,
                "image_files": images,
            },
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_product_deactivates_instead_of_removing(self) -> None:
        self.client.force_authenticate(user=self.admin)
        product = Product.objects.get(sku="PR-000")
        response = self.client.delete(f"/api/products/{product.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        product.refresh_from_db()
        self.assertFalse(product.is_active)

    def test_list_returns_representative_image_url(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        first = response.data["results"][0]
        self.assertIn("representative_image_url", first)
        self.assertTrue(first["representative_image_url"])
