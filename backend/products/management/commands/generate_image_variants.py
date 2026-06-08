from django.core.management.base import BaseCommand

from products.models import ProductImage
from products.services import _attach_variants


class Command(BaseCommand):
    help = (
        "Genera variantes optimizadas (thumbnail/medium/large en WebP) para las "
        "imagenes de productos existentes. Es idempotente: omite las que ya tienen "
        "las tres variantes salvo que se use --force."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Regenera las variantes incluso si ya existen las tres.",
        )

    def handle(self, *args, **options):
        force = options["force"]
        images = ProductImage.objects.exclude(image_file="").select_related("product")
        total = images.count()
        generated = 0
        skipped = 0
        failed: list[int] = []

        for image in images.iterator():
            has_all = bool(image.thumbnail and image.medium and image.large)
            if has_all and not force:
                skipped += 1
                continue
            try:
                _attach_variants(image)
                image.refresh_from_db()
            except Exception as exc:
                failed.append(image.pk)
                self.stderr.write(f"Fallo ProductImage {image.pk}: {exc}")
                continue
            if image.thumbnail and image.medium and image.large:
                generated += 1
            else:
                failed.append(image.pk)

        self.stdout.write(
            self.style.SUCCESS(
                f"Procesadas: {total} | generadas: {generated} | omitidas: {skipped} | fallidas: {len(failed)}"
            )
        )
        if failed:
            self.stderr.write(self.style.WARNING(f"ProductImage con fallo (pk): {failed}"))
