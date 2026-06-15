from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0006_salecostallocation"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="InventoryAdjustment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "direction",
                    models.CharField(
                        choices=[
                            ("increase", "Incremento"),
                            ("decrease", "Disminucion"),
                            ("reversal", "Reversa"),
                        ],
                        max_length=16,
                    ),
                ),
                ("quantity", models.PositiveIntegerField()),
                ("unit_cost", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("reason", models.TextField()),
                ("adjusted_at", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "actor",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="inventory_adjustments",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="inventory_adjustments",
                        to="products.product",
                    ),
                ),
                (
                    "source_sale",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="reversal_adjustments",
                        to="sales.sale",
                    ),
                ),
            ],
            options={"ordering": ("-adjusted_at", "-id")},
        ),
        migrations.CreateModel(
            name="InventoryAdjustmentLot",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField()),
                ("unit_cost", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "adjustment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="affected_lots",
                        to="sales.inventoryadjustment",
                    ),
                ),
                (
                    "purchase",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="inventory_adjustment_lots",
                        to="sales.purchase",
                    ),
                ),
            ],
            options={"ordering": ("id",)},
        ),
    ]
