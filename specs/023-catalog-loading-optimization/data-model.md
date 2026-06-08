# Data Model — Optimizacion de carga del catalogo y vista mayorista

**Feature**: 023-catalog-loading-optimization | **Date**: 2026-06-07

Describe los cambios de datos sobre los modelos existentes en `backend/products/models.py`. No se crean nuevas tablas; solo se anaden campos a `ProductImage` y se exponen URLs derivadas en los serializadores.

## Entidades afectadas

### ProductImage (modificada)

Imagen asociada a un producto. Se conserva el original (`image_file`) como fuente maestra y se anaden tres variantes optimizadas generadas con Pillow en formato WebP.

**Campos existentes (sin cambios)**:
- `id` (BigAutoField, PK)
- `product` (FK → Product, `related_name="images"`, on_delete=CASCADE)
- `image_file` (FileField, `upload_to="products/"`) — **original, fuente maestra, no se modifica**
- `content_type` (CharField, max 100)
- `size_bytes` (PositiveIntegerField) — tamano del original (a corregir su registro en la implementacion)
- `position` (PositiveSmallIntegerField, default 1)
- `created_at` (DateTimeField, auto_now_add)

**Campos nuevos**:
- `thumbnail` (ImageField, `upload_to="products/variants/"`, null=True, blank=True) — variante WebP, lado mayor <= 400px
- `medium` (ImageField, `upload_to="products/variants/"`, null=True, blank=True) — variante WebP, lado mayor <= 800px
- `large` (ImageField, `upload_to="products/variants/"`, null=True, blank=True) — variante WebP, lado mayor <= 1200px

**Reglas de validacion / invariantes**:
- Si `image_file` esta presente, las tres variantes deben existir tras el create/update (generadas por el servicio). Si la generacion falla para una variante, el campo queda vacio y la API devuelve el original como fallback para esa variante.
- Las variantes se regeneran a partir del original; nunca se modifica `image_file`.
- `Meta.ordering = ("position", "id")` se mantiene.

**Ciclo de vida**:
1. **Upload**: el servicio guarda el original → genera `thumbnail`, `medium`, `large` con Pillow → persiste.
2. **Migracion**: el comando `generate_image_variants` completa variantes faltantes para registros existentes; idempotente.
3. **Borrado**: al eliminar el `ProductImage` (CASCADE del producto o reemplazo en update), Django elimina los archivos asociados (original + variantes).

### Product (sin cambios de esquema)

No requiere cambios de modelo. El serializador expone URLs derivadas (ver contrato de API). El campo virtual `representative_thumbnail_url` se calcula a partir de la primera imagen (mismo criterio que el `representative_image_url` actual: `images.order_by("position","id").first()`).

## Serializadores (cambios derivados)

### ProductImageSerializer
- Anade `thumbnail_url`, `medium_url`, `large_url` (`SerializerMethodField`). Cada uno devuelve `request.build_absolute_uri(...)` de la variante correspondiente; si la variante esta vacia, devuelve la URL del original (`image_url`) como fallback.

### ProductSerializer
- Anade `representative_thumbnail_url` (`SerializerMethodField`): thumbnail de la primera imagen (fallback a `representative_image_url` si no hay thumbnail).
- `representative_image_url` existente sigue apuntando al original (se usara como fuente grande/de cabecera donde proceda; el detalle puede preferir `large`).

## Migracion de esquema

- **Nueva migracion**: `products/migrations/0XXX_productimage_variants.py` (`AddField` x3 a `ProductImage`). Es aditiva y reversible (`RemoveField`).
- **Migracion de datos**: NO es necesaria como migracion Django; las variantes se generan via el comando de administracion `generate_image_variants` (post-deploy), que es idempotente.

## Volumen / escala

- ~190 productos, ~205 `ProductImage` a procesar en la migracion (~58 MB de originales). Tras generar variantes (estimado ~2-4 MB totales en WebP), el almacenamiento se incrementa marginalmente (los originales se conservan). El beneficio principal es en ancho de banda servido, no en disco.
