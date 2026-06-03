from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from products.models import Product


class ProductModelTests(TestCase):
    def test_rejects_negative_prices(self) -> None:
        product = Product(
            sku="NEG-001",
            name="Producto invalido",
            cost_price=Decimal("-1.00"),
            wholesale_reference_price=Decimal("5.00"),
            public_price=Decimal("8.00"),
        )

        with self.assertRaises(ValidationError):
            product.full_clean()
