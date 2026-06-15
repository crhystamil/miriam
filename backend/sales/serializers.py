from decimal import Decimal

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from sales.models import InventoryAdjustment, InventoryAdjustmentLot, Purchase, Sale, SaleCostAllocation, Wholesaler
from sales.services import register_inventory_adjustment, register_purchase, register_sale


class PurchaseSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Purchase
        fields = ["id", "product", "product_name", "quantity", "remaining", "unit_cost", "purchased_at", "notes"]
        read_only_fields = ["id", "remaining", "purchased_at"]

    def create(self, validated_data):
        try:
            return register_purchase(
                product_id=validated_data["product"].id,
                quantity=validated_data["quantity"],
                unit_cost=validated_data["unit_cost"],
                notes=validated_data.get("notes", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)


class SaleCostAllocationSerializer(serializers.ModelSerializer):
    purchase_id = serializers.IntegerField(source="purchase.id", read_only=True)

    class Meta:
        model = SaleCostAllocation
        fields = ["id", "purchase_id", "quantity", "unit_cost"]
        read_only_fields = ["id", "purchase_id", "quantity", "unit_cost"]


class SaleSerializer(serializers.ModelSerializer):
    store_profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    vendor_profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    vendor_username = serializers.CharField(source="vendor.username", read_only=True)
    wholesaler_name = serializers.CharField(source="wholesaler.name", read_only=True)
    wholesaler_phone = serializers.CharField(source="wholesaler.phone", read_only=True)
    cost_allocations = SaleCostAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = [
            "id",
            "product",
            "vendor",
            "vendor_username",
            "wholesaler",
            "wholesaler_name",
            "wholesaler_phone",
            "quantity",
            "unit_sale_price",
            "unit_wholesale_reference_price",
            "unit_cost_price",
            "sold_at",
            "is_active",
            "notes",
            "store_profit",
            "vendor_profit",
            "product_name",
            "cost_allocations",
        ]
        read_only_fields = [
            "id",
            "unit_wholesale_reference_price",
            "unit_cost_price",
            "sold_at",
            "is_active",
            "store_profit",
            "vendor_profit",
        ]
        extra_kwargs = {
            "vendor": {"required": False, "allow_null": True},
            "quantity": {"required": False},
        }

    def create(self, validated_data):
        request = self.context["request"]
        vendor = validated_data.get("vendor")
        wholesaler = validated_data.get("wholesaler")
        if request.user.role == "vendor":
            vendor = request.user
        if vendor is None:
            raise serializers.ValidationError({"vendor": ["Debe seleccionar un vendedor."]})
        if wholesaler is None:
            raise serializers.ValidationError({"wholesaler": ["Debe seleccionar un mayorista existente."]})
        try:
            return register_sale(
                product_id=validated_data["product"].id,
                vendor_id=vendor.id,
                wholesaler_id=wholesaler.id,
                unit_sale_price=Decimal(validated_data["unit_sale_price"]),
                quantity=validated_data.get("quantity", 1),
                notes=validated_data.get("notes", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)


class WholesalerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wholesaler
        fields = ["id", "name", "phone"]


class InventoryAdjustmentLotSerializer(serializers.ModelSerializer):
    purchase_id = serializers.IntegerField(source="purchase.id", read_only=True)

    class Meta:
        model = InventoryAdjustmentLot
        fields = ["id", "purchase_id", "quantity", "unit_cost"]
        read_only_fields = ["id", "purchase_id", "quantity", "unit_cost"]


class InventoryAdjustmentSerializer(serializers.ModelSerializer):
    affected_lots = InventoryAdjustmentLotSerializer(many=True, read_only=True)

    class Meta:
        model = InventoryAdjustment
        fields = [
            "id",
            "product",
            "direction",
            "quantity",
            "unit_cost",
            "reason",
            "actor",
            "source_sale",
            "adjusted_at",
            "affected_lots",
        ]
        read_only_fields = ["id", "actor", "source_sale", "adjusted_at", "affected_lots"]

    def create(self, validated_data):
        request = self.context["request"]
        try:
            return register_inventory_adjustment(
                product_id=validated_data["product"].id,
                actor=request.user,
                direction=validated_data["direction"],
                quantity=validated_data["quantity"],
                unit_cost=validated_data.get("unit_cost"),
                reason=validated_data.get("reason", ""),
            )
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages)
