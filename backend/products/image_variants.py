from __future__ import annotations

import io
from typing import Protocol

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

VARIANT_SIZES: dict[str, int] = {
    "thumbnail": 400,
    "medium": 800,
    "large": 1200,
}
WEBP_QUALITY = 80


class _FileLike(Protocol):
    def open(self, mode: str = ...) -> object: ...


def _normalize_mode(img: Image.Image) -> Image.Image:
    if img.mode == "P":
        if "transparency" in img.info:
            return img.convert("RGBA")
        return img.convert("RGB")
    if img.mode not in ("RGB", "RGBA"):
        return img.convert("RGB")
    return img


def generate_variant_files(source) -> dict[str, ContentFile]:
    """Genera variantes WebP (thumbnail/medium/large) a partir de una imagen.

    ``source`` puede ser un ImageField/FieldFile de Django o un path/objeto archivo
    abierto por Pillow. Devuelve un dict {nombre: ContentFile} listo para asignar
    a los campos del modelo. Lanza excepciones si la imagen esta corrupta.
    """
    with Image.open(source) as img:
        img = ImageOps.exif_transpose(img)
        img.load()
        img = _normalize_mode(img)

        variants: dict[str, ContentFile] = {}
        for name, max_side in VARIANT_SIZES.items():
            copy = img.copy()
            copy.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            copy.save(buffer, format="WEBP", quality=WEBP_QUALITY)
            variants[name] = ContentFile(buffer.getvalue(), name=f"{name}.webp")
    return variants
