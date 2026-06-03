from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Administrador"
        VENDOR = "vendor", "Vendedor"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VENDOR)

    def __str__(self) -> str:
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
