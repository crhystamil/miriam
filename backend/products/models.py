from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models


class Product(models.Model):
    sku = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    wholesale_reference_price = models.DecimalField(max_digits=10, decimal_places=2)
    public_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)

    def clean(self) -> None:
        prices = (
            self.cost_price,
            self.wholesale_reference_price,
            self.public_price,
        )
        if any(price is not None and price < Decimal("0.00") for price in prices):
            raise ValidationError("Los precios no pueden ser negativos.")

    def __str__(self) -> str:
        return f"{self.name} ({self.sku})"


class ProductImage(models.Model):
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="images")
    image_file = models.FileField(upload_to="products/", null=True, blank=True)
    content_type = models.CharField(max_length=100, default="")
    size_bytes = models.PositiveIntegerField(default=0)
    position = models.PositiveSmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("position", "id")

    def __str__(self) -> str:
        return f"Imagen {self.id} - {self.product.sku}"
