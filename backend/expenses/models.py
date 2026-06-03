from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Expense(models.Model):
    class Scope(models.TextChoices):
        STORE = "store", "Tienda"
        VENDOR = "vendor", "Vendedor"

    scope = models.CharField(max_length=20, choices=Scope.choices, default=Scope.STORE)
    vendor = models.ForeignKey(
        "core.User",
        on_delete=models.PROTECT,
        related_name="expenses",
        null=True,
        blank=True,
    )
    concept = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    spent_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    is_closed_by_cut = models.BooleanField(default=False)
    closed_by_cut = models.ForeignKey("cuts.MonthlyCut", on_delete=models.SET_NULL, null=True, blank=True, related_name="closed_expenses")
    closed_at = models.DateTimeField(null=True, blank=True)

    def clean(self) -> None:
        if self.amount <= 0:
            raise ValidationError("El monto del gasto debe ser mayor a cero.")
        if self.scope == self.Scope.VENDOR and not self.vendor_id:
            raise ValidationError("Un gasto de vendedor requiere vendedor asociado.")

    def __str__(self) -> str:
        return f"{self.concept} - Bs. {self.amount}"

# Create your models here.
