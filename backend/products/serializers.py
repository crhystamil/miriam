from decimal import Decimal

from rest_framework import serializers

from products.models import Product, ProductImage
from products.services import create_product_with_images, update_product_with_images
from sales.models import Purchase


class MultiFileListField(serializers.ListField):
    def get_value(self, dictionary):
        if hasattr(dictionary, "getlist"):
            values = dictionary.getlist(self.field_name)
            if values:
                return values
        return super().get_value(dictionary)


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    medium_url = serializers.SerializerMethodField()
    large_url = serializers.SerializerMethodField()

    def _build_url(self, obj, field_name):
        variant = getattr(obj, field_name)
        source = variant or obj.image_file
        if not source:
            return ""
        return source.url
    
    def get_image_url(self, obj):
        return self._build_url(obj, "image_file")

    def get_thumbnail_url(self, obj):
        return self._build_url(obj, "thumbnail")

    def get_medium_url(self, obj):
        return self._build_url(obj, "medium")

    def get_large_url(self, obj):
        return self._build_url(obj, "large")

    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "thumbnail_url", "medium_url", "large_url", "content_type", "size_bytes", "position"]
        read_only_fields = ["id", "image_url", "thumbnail_url", "medium_url", "large_url", "content_type", "size_bytes", "position"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(read_only=True, many=True)
    representative_image_url = serializers.SerializerMethodField()
    representative_thumbnail_url = serializers.SerializerMethodField()
    fifo_cost_price = serializers.SerializerMethodField()
    image_files = MultiFileListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
        allow_empty=False,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "sku",
            "name",
            "description",
            "cost_price",
            "fifo_cost_price",
            "wholesale_reference_price",
            "public_price",
            "stock",
            "is_active",
            "images",
            "representative_image_url",
            "representative_thumbnail_url",
            "image_files",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "sku", "created_at", "updated_at"]

    def get_fifo_cost_price(self, obj):
        lot = (
            Purchase.objects.filter(product=obj, remaining__gt=0)
            .order_by("purchased_at")
            .values_list("unit_cost", flat=True)
            .first()
        )
        return lot if lot is not None else obj.cost_price

    def get_representative_image_url(self, obj):    
        image = obj.images.order_by("position", "id").first()
        if not image or not image.image_file:
            return ""
        return image.image_file.url
  
    def get_representative_thumbnail_url(self, obj):
        image = obj.images.order_by("position", "id").first()
        if not image:
            return ""
        source = image.thumbnail or image.image_file
        if not source:
            return ""
        return source.url

    def validate(self, attrs):
        image_files = attrs.get("image_files")
        stock = attrs.get("stock")
        cost_price = attrs.get("cost_price", getattr(self.instance, "cost_price", None))

        if self.instance is None and stock and stock > 0 and cost_price is not None and cost_price <= Decimal("0.00"):
            raise serializers.ValidationError({"cost_price": ["Debe ser mayor a cero para crear stock inicial."]})

        if self.instance is not None and "stock" in attrs and attrs["stock"] != self.instance.stock:
            raise serializers.ValidationError(
                {"stock": ["El stock solo puede modificarse mediante compras o ajustes de inventario."]}
            )

        if self.instance is None and not image_files:
            raise serializers.ValidationError({"image_files": ["Debe agregar al menos una imagen."]})

        if image_files is None:
            if self.instance is not None and self.instance.images.exists():
                return attrs
            if self.instance is not None and not self.instance.images.exists():
                raise serializers.ValidationError({"image_files": ["Debe agregar al menos una imagen."]})
            return attrs

        if len(image_files) < 1 or len(image_files) > 5:
            raise serializers.ValidationError({"image_files": ["Debe cargar entre 1 y 5 imagenes."]})

        allowed_types = {"image/jpeg", "image/png", "image/webp"}
        max_size_bytes = 5 * 1024 * 1024

        for image_file in image_files:
            if image_file.content_type not in allowed_types:
                raise serializers.ValidationError({"image_files": ["Formato no permitido. Use JPG, PNG o WEBP."]})
            if image_file.size > max_size_bytes:
                raise serializers.ValidationError({"image_files": ["La imagen excede el tamano maximo de 5MB."]})
        return attrs

    def create(self, validated_data):
        image_files = validated_data.pop("image_files", [])
        validated_data.pop("sku", None)
        return create_product_with_images(product_data=validated_data, image_files=image_files)

    def update(self, instance, validated_data):
        image_files = validated_data.pop("image_files", None)
        return update_product_with_images(product=instance, product_data=validated_data, image_files=image_files)
