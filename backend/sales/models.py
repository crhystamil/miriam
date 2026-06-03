from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


def normalize_phone(value: str) -> str:
    return "".join(ch for ch in value if ch.isdigit())


class Wholesaler(models.Model):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40, blank=True)
    phone_normalized = models.CharField(max_length=24, editable=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name", "id")
        constraints = [
            models.UniqueConstraint(fields=["name", "phone_normalized"], name="uniq_wholesaler_name_phone_norm")
        ]

    def clean(self) -> None:
        self.phone_normalized = normalize_phone(self.phone or "")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Purchase(models.Model):
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT, related_name="purchases")
    quantity = models.PositiveIntegerField()
    remaining = models.PositiveIntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)

    def clean(self) -> None:
        if self.quantity <= 0:
            raise ValidationError("La cantidad de compra debe ser positiva.")

    def __str__(self) -> str:
        return f"Compra #{self.pk or 'new'} - {self.product}"

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Sale(models.Model):
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT, related_name="sales")
    vendor = models.ForeignKey("core.User", on_delete=models.PROTECT, related_name="sales")
    wholesaler = models.ForeignKey("sales.Wholesaler", on_delete=models.PROTECT, related_name="sales", null=True, blank=True)
    purchase = models.ForeignKey("sales.Purchase", on_delete=models.PROTECT, null=True, blank=True, related_name="sale_allocations")
    quantity = models.PositiveIntegerField()
    unit_sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_wholesale_reference_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    sold_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_closed_by_cut = models.BooleanField(default=False)
    closed_by_cut = models.ForeignKey("cuts.MonthlyCut", on_delete=models.SET_NULL, null=True, blank=True, related_name="closed_sales")
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("-sold_at",)

    def clean(self) -> None:
        if self.quantity <= 0:
            raise ValidationError("La cantidad de venta debe ser positiva.")

        if self.vendor_id and self.vendor.role != "vendor":
            raise ValidationError("La venta debe pertenecer a un vendedor.")

    @property
    def store_profit(self) -> Decimal:
        return (self.unit_wholesale_reference_price - self.unit_cost_price) * self.quantity

    @property
    def vendor_profit(self) -> Decimal:
        return (self.unit_sale_price - self.unit_wholesale_reference_price) * self.quantity

    def __str__(self) -> str:
        return f"Venta #{self.pk or 'new'} - {self.product}"

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
