from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class MonthlyCut(models.Model):
    class Status(models.TextChoices):
        RUNNING = "running", "En ejecucion"
        COMPLETED = "completed", "Completado"
        FAILED = "failed", "Fallido"

    period = models.CharField(max_length=7, help_text="Formato YYYY-MM")
    cutoff_date = models.DateField(default=timezone.localdate)
    closed_at = models.DateTimeField(default=timezone.now)
    closed_by = models.ForeignKey("core.User", on_delete=models.PROTECT, related_name="monthly_cuts")
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    started_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ("-cutoff_date", "-id")
        constraints = [
            models.UniqueConstraint(fields=["period", "cutoff_date"], name="uniq_cut_period_cutoff_date"),
        ]

    def clean(self) -> None:
        if len(self.period) != 7 or self.period[4] != "-":
            raise ValidationError("El periodo debe tener formato YYYY-MM.")
        expected_period = self.cutoff_date.strftime("%Y-%m") if self.cutoff_date else ""
        if expected_period and self.period != expected_period:
            raise ValidationError("El periodo debe corresponder a la fecha de corte.")

    def __str__(self) -> str:
        return f"Corte {self.period} ({self.cutoff_date})"

# Create your models here.
