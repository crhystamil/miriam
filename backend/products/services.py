from __future__ import annotations

import logging
import secrets
from datetime import datetime

from django.core.files.uploadedfile import UploadedFile

from django.core.exceptions import ValidationError
from django.db import transaction

from products.image_variants import generate_variant_files
from products.models import Product, ProductImage

logger = logging.getLogger(__name__)


def generate_unique_sku(*, max_attempts: int = 10) -> str:
    prefix = datetime.now().strftime("PRD%y%m%d")
    for _ in range(max_attempts):
        candidate = f"{prefix}-{secrets.randbelow(10000):04d}"
        if not Product.objects.filter(sku=candidate).exists():
            return candidate
    raise ValidationError({"sku": ["No se pudo generar un SKU unico. Intente nuevamente."]})


def _attach_variants(image: ProductImage) -> None:
    """Genera y guarda las variantes WebP para una ProductImage.

    Si la imagen esta corrupta o falla, se registra y se dejan las variantes
    vacias: la API sirve el original como fallback para esa variante.
    """
    if not image.image_file:
        return
    try:
        variants = generate_variant_files(image.image_file)
    except Exception:
        logger.exception("No se pudieron generar variantes para ProductImage %s", image.pk)
        return
    for name, content in variants.items():
        field_file = getattr(image, name)
        field_file.save(f"{image.pk}-{name}.webp", content, save=False)
    image.save(update_fields=["thumbnail", "medium", "large"])


def _generate_variants_for_product(product: Product) -> None:
    for image in product.images.all():
        _attach_variants(image)


@transaction.atomic
def create_product_with_images(*, product_data: dict, image_files: list[UploadedFile]) -> Product:
    if not image_files:
        raise ValidationError({"image_files": ["Debe agregar al menos una imagen."]})

    if not product_data.get("sku"):
        product_data["sku"] = generate_unique_sku()

    product = Product.objects.create(**product_data)
    ProductImage.objects.bulk_create(
        [
            ProductImage(
                product=product,
                image_file=image_file,
                content_type=image_file.content_type or "application/octet-stream",
                size_bytes=image_file.size,
                position=index,
            )
            for index, image_file in enumerate(image_files, start=1)
        ]
    )
    _generate_variants_for_product(product)
    return Product.objects.prefetch_related("images").get(pk=product.pk)


@transaction.atomic
def update_product_with_images(*, product: Product, product_data: dict, image_files: list[UploadedFile] | None) -> Product:

    for field, value in product_data.items():
        setattr(product, field, value)
    product.full_clean()
    product.save()

    if image_files is not None:
        product.images.all().delete()
        ProductImage.objects.bulk_create(
            [
                ProductImage(
                    product=product,
                    image_file=image_file,
                    content_type=image_file.content_type or "application/octet-stream",
                    size_bytes=image_file.size,
                    position=index,
                )
                for index, image_file in enumerate(image_files, start=1)
            ]
        )
        _generate_variants_for_product(product)

    if not product.images.exists():
        raise ValidationError({"image_files": ["Debe agregar al menos una imagen."]})
    return Product.objects.prefetch_related("images").get(pk=product.pk)


@transaction.atomic
def deactivate_product(*, product: Product) -> Product:
    if not product.is_active:
        return product
    product.is_active = False
    product.save(update_fields=["is_active", "updated_at"])
    return product
