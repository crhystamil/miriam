from django.db import migrations, models
import django.db.models.deletion


def create_existing_sale_allocations(apps, schema_editor):
    Sale = apps.get_model("sales", "Sale")
    SaleCostAllocation = apps.get_model("sales", "SaleCostAllocation")

    allocations = []
    for sale in Sale.objects.filter(purchase__isnull=False):
        allocations.append(
            SaleCostAllocation(
                sale_id=sale.id,
                purchase_id=sale.purchase_id,
                quantity=sale.quantity,
                unit_cost=sale.unit_cost_price,
            )
        )
    SaleCostAllocation.objects.bulk_create(allocations)


def reverse_existing_sale_allocations(apps, schema_editor):
    SaleCostAllocation = apps.get_model("sales", "SaleCostAllocation")
    SaleCostAllocation.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0005_purchase_remaining_sale_purchase_fk"),
    ]

    operations = [
        migrations.CreateModel(
            name="SaleCostAllocation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField()),
                ("unit_cost", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "purchase",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="cost_allocations",
                        to="sales.purchase",
                    ),
                ),
                (
                    "sale",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cost_allocations",
                        to="sales.sale",
                    ),
                ),
            ],
            options={"ordering": ("id",)},
        ),
        migrations.RunPython(create_existing_sale_allocations, reverse_existing_sale_allocations),
    ]
