from rest_framework import status
from rest_framework.test import APITestCase

from core.models import User


class AuthApiTests(APITestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username="vendorauth",
            password="secret123",
            role=User.Role.VENDOR,
            first_name="Juan",
            last_name="Perez",
        )

    def test_login_success_returns_user_profile(self) -> None:
        response = self.client.post(
            "/api/auth/login/",
            {"username": "vendorauth", "password": "secret123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "vendorauth")
        self.assertEqual(response.data["role"], User.Role.VENDOR)

    def test_login_with_invalid_credentials_fails(self) -> None:
        response = self.client.post(
            "/api/auth/login/",
            {"username": "vendorauth", "password": "bad-pass"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], "authentication_failed")
        self.assertIn("detail", response.data)
        self.assertIn("field_errors", response.data)

    def test_me_requires_authentication(self) -> None:
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data["code"], "permission_denied")

    def test_me_returns_authenticated_user(self) -> None:
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "vendorauth")

    def test_logout_requires_authentication(self) -> None:
        response = self.client.post("/api/auth/logout/", {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SystemApiTests(APITestCase):
    def test_health_endpoint_is_public(self) -> None:
        response = self.client.get("/api/system/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")

    def test_version_endpoint_is_public(self) -> None:
        response = self.client.get("/api/system/version/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "iam-repuestos-api")
        self.assertIn("version", response.data)

    def test_bootstrap_endpoint_returns_frontend_metadata(self) -> None:
        response = self.client.get("/api/system/bootstrap/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["app"]["name"], "iam-repuestos-api")
        self.assertIn("version", response.data["app"])
        self.assertEqual(response.data["currency"]["symbol"], "Bs.")
        self.assertEqual(response.data["pagination"]["page_size"], 10)
        self.assertEqual(response.data["routes"]["sales"], "/api/sales/")
