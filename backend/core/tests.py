from django.test import TestCase

from core.models import User


class UserModelTests(TestCase):
    def test_default_role_is_vendor(self) -> None:
        user = User.objects.create_user(username="u1", password="secret123")
        self.assertEqual(user.role, User.Role.VENDOR)
