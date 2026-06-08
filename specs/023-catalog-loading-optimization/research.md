# Phase 0: Research — Optimizacion de carga del catalogo y vista mayorista

**Feature**: 023-catalog-loading-optimization | **Date**: 2026-06-07

Este documento consolida las decisiones tecnicas derivadas del analisis del codigo actual y de buenas practicas, resolviendo las incognitas del Technical Context del plan.

## Contexto medido en el sistema actual

Antes de disenar, se inspecciono el estado real del proyecto:

- **Volumen**: 189 productos activos (190 totales) y 205 imagenes referenciadas en la BD.
- **Peso real**: las 205 imagenes referenciadas ocupan **~58 MB en disco** (promedio ~284 KB; varias de 1 a 4 MB), pese a que el campo `size_bytes` registra solo ~1.17 MB (bug de registro). El catalogo sirve estas imagenes al tamano original.
- **Vista mayorista**: `frontend/src/pages/WholesalerProductsPage.tsx` (`loadAllProducts`) recorre **toda la paginacion en un bucle** (PAGE_SIZE=10 => ~19 requests secuenciales) y luego renderiza los 189 productos con sus imagenes de golpe.
- **Frontend**: ningun `<img>` usa `loading="lazy"`, `width/height` ni `srcset` (`PublicProductCard.tsx`, `WholesalerProductsPage.tsx`, `ProductDetailPage.tsx`).
- **Paginacion**: ya existe `PageNumberPagination` con `PAGE_SIZE=10` (`config/settings.py`); el catalogo ya la usa (`CatalogPage.tsx`). La vista mayorista la evita.
- **Pillow NO esta instalado** (`requirements.txt` no lo incluye; el venv no tiene `PIL`).

## Decisiones

### D1: Libreria de procesamiento de imagenes = Pillow

- **Decision**: Agregar `Pillow>=11,<12` a `backend/requirements.txt` y generar variantes con `Image.open(...)`, `Image.thumbnail(...)` (mantiene proporcion) y `img.save(buf, "WEBP", quality=80)`.
- **Rationale**: Estandar de facto en el ecosistema Django/Python; soporta lectura de JPEG/PNG/WEBP y escritura WEBP; ligera y sin dependencias externas del sistema.
- **Alternativas consideradas**: `django-imagekit` / `easy-thumbnails` (mas magia/configuracion y modelos acoplados); redimension en el cliente (no controla el peso servido al primer render). Se prefiere un helper propio minimo en `products/image_variants.py`.

### D2: Formato de salida = WebP unica (sin fallback JPG)

- **Decision**: Servir las tres variantes en WebP (quality ~80). No generar duplicados JPG.
- **Rationale**: Todos los navegadores objetivo (Chrome/Edge 32+, Firefox 65+, Safari 14+,移动 browsers) soportan WebP; WebP calidad 80 reduce el peso ~25-35% vs JPEG y mucho mas vs PNG a calidad visual equivalente.
- **Alternativas consideradas**: generar JPG + WEBP con `<picture>` (mas complejidad, mas almacenamiento); AVIF (soporte movil irregular, codificacion lenta). YAGNI: WebP unico basta para el escenario (conexiones lentas, navegadores modernos).

### D3: Tamanos de variante = miniatura 400 / mediana 800 / grande 1200 (lado mayor)

- **Decision**: `thumbnail` (max 400px lado mayor), `medium` (max 800px), `large` (max 1200px). Redimension preservando proporcion; no recortar.
- **Rationale**: 400px cubre tarjetas de catalogo y miniaturas de tabla/galeria; 800-1200px cubre detalle en retina movil/escritorio. Evita servir 4 MB originales para mostrar 150px.
- **Alternativas consideradas**: solo 2 variantes (insuficiente para detalle); generar bajo demanda (lenti/lazy en servidor). Se generan todas al subir/migrar para servir archivos estaticos cacheables.

### D4: Almacenamiento = campos FileField dedicados por variante, junto al original

- **Decision**: Anadir a `ProductImage` tres `ImageField`: `thumbnail`, `medium`, `large`, almacenados en `products/variants/` con nombre derivado del original + sufijo (`-thumb.webp`, `-med.webp`, `-large.webp`). El `image_file` original se conserva intacto como maestro (decision del spec: conservar original).
- **Rationale**: URLs estables y cacheables; consulta directa sin reconstruccion; separacion clara maestro/variantes; los nombres con sufijo son inmutables (aprovechables por cache Apache futura). Mantiene el modelo simple (3 campos) sin tablas extra.
- **Alternativas consideradas**: variantes en subdirectorio con convencion sin campos (requiere construir URL a mano, menos aprovechable por DRF); tabla `ProductImageVariant` (sobre-ingenieria para 3 tamanos fijos); `JSONField` de URLs (menos tipado/validable).

### D5: Generacion sincrona al crear/actualizar + comando de migracion idempotente

- **Decision**: 
  1. En `services.create_product_with_images` / `update_product_with_images`, tras `bulk_create`/guardar el `ProductImage`, generar las 3 variantes con Pillow y persistirlas.
  2. Nuevo comando `python manage.py generate_image_variants` que itera `ProductImage`, genera variantes faltantes (idempotente: saltea las que ya existen), e imprime/reporta las que fallo (corruptas/ilegibles) continuando el proceso.
- **Rationale**: El upload es evento natural para generar; la migracion cubre los 205 existentes. La generacion sincrona es aceptable (3 variantes por imagen, ~189 productos, carga administrativa esporadica). Idempotencia permite re-ejecutar tras fallos parciales.
- **Alternativas consideradas**: Celery/task queue (infraestructura innecesaria para este volumen); generacion lazy al primer request (primer visitante paga la latencia, complejidad de cache). Para el volumen actual, sincrono + migracion basta.
- **Manejo de fallos**: si una variante falla, el comando la registra, conserva el original y deja el campo de variante vacio; el serializador devuelve el original como fallback para esa variante (vacio => el frontend usa el original via `image_url`). Evita bloquear la migracion.

### D6: Exposicion en la API = campos URL por variante en serializador

- **Decision**: 
  - `ProductImageSerializer` anade `thumbnail_url`, `medium_url`, `large_url` (`SerializerMethodField`, `build_absolute_uri`), con fallback al original si la variante no existe.
  - `ProductSerializer` anade `representative_thumbnail_url` (y reutiliza `representative_image_url` existente para la version grande/original de cabecera).
- **Rationale**: Coherente con el patron actual (`image_url`, `representative_image_url`); el frontend recibe URLs absolutas listas para `srcset`. Sin cambios en el contrato de paginacion ni en autenticacion.
- **Alternativas consideradas**: endpoint separado de variantes (over-engineering); URL unica con query `?size=` (no cacheable como estatico). Campos planos en el serializador existente es lo mas simple.

### D7: Frontend mayorista = paginacion reutilizando CatalogPage + buscador que resetea a pagina 1

- **Decision**: Reescribir `WholesalerProductsPage` para eliminar `loadAllProducts`. Usar estado `page`, `hasMore`, `loadingMore` (como `CatalogPage`), boton "Cargar mas". El buscador con debounce existente (250 ms) resetea a `page=1` y consulta al backend (`GET /api/products/?search=...&is_active=true&page=1`); al escribir, se cancela/reemplaza la busqueda anterior (flag `active`, como ya hace hoy).
- **Rationale**: Reutiliza el patron probado del catalogo; el backend ya filtra por `search` e `is_active` (`products/views.py`). Permite buscar sin cargar toda la lista (cumple FR-007/FR-009/FR-010).
- **Alternativas consideradas**: scroll infinito (mal en conexiones inestables y dificil de testear); mantener carga total solo con lazy (no resuelve las ~19 rondas de red). Paginacion + boton es robusto y testeable.

### D8: Frontend imagenes = lazy + aspect-ratio + srcset con variantes

- **Decision**: 
  - `PublicProductCard`: `loading="lazy"`, `width`/`height` (o `aspect-ratio` via CSS para evitar CLS), `srcset` con `representative_thumbnail_url` (1x) y opcionalmente la mediana para densidad alta; `src` = thumbnail (fallback).
  - `WholesalerProductsPage` (tabla): `loading="lazy"` + `representative_thumbnail_url`.
  - `ProductDetailPage`: imagen principal usa `large_url` (o mediana), miniaturas de galeria usan `thumbnail_url`, todas con `loading="lazy"` y dimensiones.
- **Rationale**: `loading="lazy"` evita descargar fuera de pantalla; `width`/`height` elimina layout shift (FR-012); `srcset` sirve la variante correcta (FR-013). Soporte universal en navegadores objetivo.
- **Alternativas consideradas**: `IntersectionObserver` manual (innecesario, `loading=lazy` es nativo); LQIP blur-up (mas codigo, mejora percepcional menor). Se prioriza simplicidad.

### D9: Fuera de alcance confirmado

- **Decision**: No tocar el panel administrativo (`ProductsPage`, modal CRUD) para lazy/variantes; no cambiar el limite de upload (5 MB); no configurar cache Apache aqui.
- **Rationale**: Decision del spec 023 (clarificacion Q2/Q3 y Assumption). La cache Apache se tratara en spec complementario `024`. El admin opera en red local rapida.

## Incognitas resueltas

| Incognita (Technical Context) | Resolucion |
|---|---|
| Procesamiento de imagenes | Pillow, helper propio en `products/image_variants.py` (D1) |
| Formato y soporte navegador | WebP unico, sin fallback (D2) |
| Tamanos de variante | 400/800/1200px lado mayor (D3) |
| Almacenamiento | 3 `ImageField` por `ProductImage`, original conservado (D4) |
| Cuando generar | Al crear/actualizar + comando migracion idempotente (D5) |
| Contrato API | Campos URL por variante en serializador (D6) |
| Buscador mayorista | Paginacion + search resetea a pagina 1 (D7) |
| Optimizacion frontend | lazy + aspect-ratio + srcset (D8) |

## Riesgos y mitigaciones

- **R5.1 WebP en navegador muy antiguo**: aceptado; publico objetivo son moviles/escritorio modernos. Edge case documentado en el spec.
- **R5.2 Migracion sobre imagen corrupta**: comando la reporta y continua; la API sirve el original como fallback (D5).
- **R5.3 Regeneracion si cambian tamanos**: como el original se conserva, basta vaciar los campos y re-ejecutar el comando.
- **R5.4 Rendimiento del upload sincrono**: volumen bajo (administracion esporadica); aceptable. Si crece, diferir a tarea asincrona en otro spec.
