from decimal import Decimal

from django.core.management.base import BaseCommand

from core.models import User
from products.models import Product


class Command(BaseCommand):
    help = "Create demo users and products for local development"

    def handle(self, *args, **options):
        admin_user, admin_created = User.objects.get_or_create(
            username="admin",
            defaults={
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "first_name": "Admin",
                "last_name": "Demo",
            },
        )
        if admin_created:
            admin_user.set_password("admin12345")
            admin_user.save()

        vendor_user, vendor_created = User.objects.get_or_create(
            username="vendor_demo",
            defaults={
                "role": User.Role.VENDOR,
                "first_name": "Vendedor",
                "last_name": "Demo",
            },
        )
        if vendor_created:
            vendor_user.set_password("vendor12345")
            vendor_user.save()

        products = [
            {
                "sku": "DEMO-001",
                "name": "Filtro de aceite",
                "cost_price": Decimal("20.00"),
                "wholesale_reference_price": Decimal("28.00"),
                "public_price": Decimal("35.00"),
                "stock": 25,
            },
            {
                "sku": "DEMO-002",
                "name": "Bujia iridio",
                "cost_price": Decimal("30.00"),
                "wholesale_reference_price": Decimal("38.00"),
                "public_price": Decimal("45.00"),
                "stock": 15,
            },
            {
                "sku": "DEMO-003",
                "name": "Pastillas de freno",
                "cost_price": Decimal("55.00"),
                "wholesale_reference_price": Decimal("70.00"),
                "public_price": Decimal("82.00"),
                "stock": 8,
            },
        ]

        created_count = 0
        for payload in products:
            _, created = Product.objects.get_or_create(sku=payload["sku"], defaults=payload)
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS("Seed demo data ready."))
        self.stdout.write(f"Admin created: {admin_created}")
        self.stdout.write(f"Vendor created: {vendor_created}")
        self.stdout.write(f"Products created: {created_count}")
