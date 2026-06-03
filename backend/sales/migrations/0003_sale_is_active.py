from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0002_wholesaler_sale_wholesaler"),
    ]

    operations = [
        migrations.AddField(
            model_name="sale",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]
