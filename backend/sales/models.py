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
        if self.unit_cost <= Decimal("0.00"):
            raise ValidationError("El costo unitario de compra debe ser mayor a cero.")

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
        allocations = list(self.cost_allocations.all()) if self.pk else []
        if allocations:
            total_cost = sum(allocation.unit_cost * allocation.quantity for allocation in allocations)
            return (self.unit_wholesale_reference_price * self.quantity) - total_cost
        return (self.unit_wholesale_reference_price - self.unit_cost_price) * self.quantity

    @property
    def vendor_profit(self) -> Decimal:
        return (self.unit_sale_price - self.unit_wholesale_reference_price) * self.quantity

    def __str__(self) -> str:
        return f"Venta #{self.pk or 'new'} - {self.product}"

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class SaleCostAllocation(models.Model):
    sale = models.ForeignKey("sales.Sale", on_delete=models.CASCADE, related_name="cost_allocations")
    purchase = models.ForeignKey("sales.Purchase", on_delete=models.PROTECT, related_name="cost_allocations")
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ("id",)

    def clean(self) -> None:
        if self.quantity <= 0:
            raise ValidationError("La cantidad asignada debe ser positiva.")
        if self.unit_cost <= Decimal("0.00"):
            raise ValidationError("El costo asignado debe ser mayor a cero.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class InventoryAdjustment(models.Model):
    class Direction(models.TextChoices):
        INCREASE = "increase", "Incremento"
        DECREASE = "decrease", "Disminucion"
        REVERSAL = "reversal", "Reversa"

    product = models.ForeignKey("products.Product", on_delete=models.PROTECT, related_name="inventory_adjustments")
    direction = models.CharField(max_length=16, choices=Direction.choices)
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    reason = models.TextField()
    actor = models.ForeignKey("core.User", on_delete=models.PROTECT, related_name="inventory_adjustments")
    source_sale = models.ForeignKey("sales.Sale", on_delete=models.PROTECT, null=True, blank=True, related_name="reversal_adjustments")
    adjusted_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-adjusted_at", "-id")

    def clean(self) -> None:
        if self.quantity <= 0:
            raise ValidationError("La cantidad ajustada debe ser positiva.")
        if not self.reason.strip():
            raise ValidationError("El motivo del ajuste es obligatorio.")
        if self.direction == self.Direction.INCREASE and (self.unit_cost is None or self.unit_cost <= Decimal("0.00")):
            raise ValidationError("El costo unitario es obligatorio para incrementos de inventario.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class InventoryAdjustmentLot(models.Model):
    adjustment = models.ForeignKey("sales.InventoryAdjustment", on_delete=models.CASCADE, related_name="affected_lots")
    purchase = models.ForeignKey("sales.Purchase", on_delete=models.PROTECT, related_name="inventory_adjustment_lots")
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ("id",)

    def clean(self) -> None:
        if self.quantity <= 0:
            raise ValidationError("La cantidad afectada debe ser positiva.")
        if self.unit_cost <= Decimal("0.00"):
            raise ValidationError("El costo del lote afectado debe ser mayor a cero.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
