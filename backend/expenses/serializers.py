from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers

from expenses.models import Expense
from expenses.services import register_expense


class ExpenseSerializer(serializers.ModelSerializer):
    vendor_username = serializers.CharField(source="vendor.username", read_only=True)

    class Meta:
        model = Expense
        fields = ["id", "scope", "vendor", "vendor_username", "concept", "amount", "spent_at", "notes"]
        read_only_fields = ["id", "spent_at"]

    def create(self, validated_data):
        spent_at = validated_data.get("spent_at") or timezone.now()
        try:
            return register_expense(
                scope=validated_data["scope"],
                vendor=validated_data.get("vendor"),
                concept=validated_data["concept"],
                amount=validated_data["amount"],
                spent_at=spent_at,
                notes=validated_data.get("notes", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)
