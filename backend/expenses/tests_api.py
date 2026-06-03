from decimal import Decimal
from datetime import datetime

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from core.models import User
from expenses.models import Expense


class ExpensesApiTests(APITestCase):
    def setUp(self) -> None:
        self.admin = User.objects.create_user(username="adminexp", password="secret123", role=User.Role.ADMIN)
        self.vendor = User.objects.create_user(username="vendorexp", password="secret123", role=User.Role.VENDOR)

        Expense.objects.create(scope=Expense.Scope.STORE, concept="Internet", amount=Decimal("50.00"))
        vendor_expense = Expense.objects.create(
            scope=Expense.Scope.VENDOR,
            vendor=self.vendor,
            concept="Movilidad",
            amount=Decimal("20.00"),
        )
        vendor_expense.spent_at = timezone.make_aware(datetime(2026, 3, 15, 9, 0, 0))
        vendor_expense.save(update_fields=["spent_at"])

    def test_vendor_sees_only_own_expenses(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.get("/api/expenses/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["concept"], "Movilidad")

    def test_admin_can_filter_expenses_by_scope_and_date(self) -> None:
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/expenses/?scope=vendor&from=2026-03-01&to=2026-03-31")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["scope"], "vendor")

    def test_vendor_can_create_expense_with_open_operation_flow(self) -> None:
        self.client.force_authenticate(user=self.vendor)
        response = self.client.post(
            "/api/expenses/",
            {
                "scope": "vendor",
                "concept": "Peaje",
                "amount": "7.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
