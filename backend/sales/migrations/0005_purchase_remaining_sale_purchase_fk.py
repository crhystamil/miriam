from django.db import migrations, models
import django.db.models.deletion
from django.db.models import F


def populate_remaining_and_assign_purchases(apps, schema_editor):
    Purchase = apps.get_model("sales", "Purchase")
    Sale = apps.get_model("sales", "Sale")
    Product = apps.get_model("products", "Product")

    Purchase.objects.update(remaining=F("quantity"))

    for product in Product.objects.filter(stock__gt=0):
        if not Purchase.objects.filter(product=product).exists():
            Purchase.objects.create(
                product=product,
                quantity=product.stock,
                remaining=product.stock,
                unit_cost=product.cost_price,
                notes="Lote sintetico creado por migracion FIFO 014",
            )

    for sale in Sale.objects.filter(purchase__isnull=True).select_related("product"):
        oldest = (
            Purchase.objects.filter(product=sale.product, remaining__gt=0)
            .order_by("purchased_at")
            .first()
        )
        if oldest:
            sale.purchase = oldest
            oldest.remaining = F("remaining") - 1
            oldest.save(update_fields=["remaining"])
            sale.save(update_fields=["purchase"])


def reverse_fifo_data(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0004_sale_closed_at_sale_closed_by_cut_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="purchase",
            name="remaining",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="sale",
            name="purchase",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="sale_allocations",
                to="sales.purchase",
            ),
        ),
        migrations.RunPython(populate_remaining_and_assign_purchases, reverse_fifo_data),
    ]
