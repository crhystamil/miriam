# Contract: API de productos — variantes de imagen y vista mayorista paginada

**Feature**: 023-catalog-loading-optimization | **Date**: 2026-06-07
**Base URL**: la del backend Django (ej. `http://127.0.0.1:8000`). El frontend usa `apiFetch` (`frontend/src/api/client.ts`).

Este contrato describe los cambios en `GET /api/products/` (lista) y `GET /api/products/{id}/` (detalle) y el comportamiento esperado de la vista mayorista. No se agregan endpoints nuevos ni se cambia la autenticacion; la paginacion DRF existente (`PAGE_SIZE=10`) se mantiene.

## 1. Recurso Producto (lista y detalle)

### `GET /api/products/`

Lista paginada de productos activos (filtrado por defecto a `is_active=true` en la accion `list`; los admins pueden pasar `is_active=false`).

**Query params soportados** (sin cambios):
- `page` (int) — numero de pagina (default 1).
- `search` (string) — filtra por `name`/`sku` icontains, o `id` exacto si es numerico.
- `is_active` (`"true"` | `"false"`).
- `low_stock` (`"true"`).

**Respuesta 200** (estructura existente, con campos nuevos en cada producto):

```json
{
  "count": 189,
  "next": "http://host/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 12,
      "sku": "PRD260607-0042",
      "name": "Cruceta lavadora Samsung DC97-14370H",
      "description": "...",
      "cost_price": "40.00",
      "fifo_cost_price": "40.00",
      "wholesale_reference_price": "55.00",
      "public_price": "80.00",
      "stock": 7,
      "is_active": true,
      "created_at": "2026-06-07T12:00:00Z",
      "updated_at": "2026-06-07T12:00:00Z",
      "representative_image_url": "http://host/media/products/cruceta.jpg",
      "representative_thumbnail_url": "http://host/media/products/variants/cruceta-thumb.webp",
      "images": [
        {
          "id": 101,
          "image_url": "http://host/media/products/cruceta.jpg",
          "thumbnail_url": "http://host/media/products/variants/cruceta-thumb.webp",
          "medium_url": "http://host/media/products/variants/cruceta-med.webp",
          "large_url": "http://host/media/products/variants/cruceta-large.webp",
          "content_type": "image/jpeg",
          "size_bytes": 184320,
          "position": 1
        }
      ]
    }
  ]
}
```

### Campos nuevos en cada `Product`

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `representative_thumbnail_url` | string (URL absoluta) | Variante miniatura (<=400px) de la primera imagen. Fallback: `representative_image_url` si no hay thumbnail. |

`representative_image_url` (existente) sigue apuntando al **original**.

### Campos nuevos en cada `ProductImage`

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `thumbnail_url` | string (URL absoluta) | Variante WebP <=400px. Fallback: `image_url` si la variante no existe. |
| `medium_url` | string (URL absoluta) | Variante WebP <=800px. Fallback: `image_url`. |
| `large_url` | string (URL absoluta) | Variante WebP <=1200px. Fallback: `image_url`. |

**Regla de fallback**: cualquier `*_url` de variante devuelve la URL del original cuando el campo correspondiente este vacio (variante aun no generada o fallo en migracion). Garantiza que el frontend siempre reciba una URL utilizable.

### `GET /api/products/{id}/`

Mismo recurso individual, mismo shape que un elemento de `results`. Incluye todas las imagenes con sus URLs de variantes.

## 2. Comportamiento de la vista mayorista (frontend)

No es un contrato de red nuevo; es el uso esperado de la API existente para cumplir FR-007/FR-008/FR-009/FR-010:

- **Primera carga**: `GET /api/products/?is_active=true&page=1`. Mostrar el primer grupo sin esperar mas.
- **Cargar mas**: al pulsar el boton, `GET /api/products/?is_active=true&page=N&search=<termino>`. Acumular resultados sin duplicados; ocultar el boton cuando `next == null`.
- **Buscador inmediato**: al escribir (con debounce de 250 ms), resetear a `page=1` y `GET /api/products/?is_active=true&page=1&search=<nuevo termino>`. La busqueda anterior se descarta (flag `active`) para evitar resultados cruzados.
- **Vacio / error**: si `results` es vacio, mostrar estado "sin resultados"; si la peticion falla, mostrar estado de reintentar (FR-014).

## 3. Uso de variantes por vista (consumo frontend)

| Vista | Imagen a usar | Atributos `<img>` |
|-------|---------------|-------------------|
| CatalogPage (tarjeta, `PublicProductCard`) | `representative_thumbnail_url` | `loading="lazy"`, `width`/`height` (o aspect-ratio CSS), `srcset` (thumbnail + medium) |
| WholesalerProductsPage (tabla) | `representative_thumbnail_url` | `loading="lazy"`, dimensiones |
| ProductDetailPage (imagen principal) | `large_url` (fallback `image_url`) | `loading="lazy"`, dimensiones |
| ProductDetailPage (miniaturas galeria) | `thumbnail_url` | `loading="lazy"`, dimensiones |

## 4. Errores

Sin cambios en el manejador de errores (`core.api_errors.custom_exception_handler`). Los errores siguen el shape `ApiError` (`code`, `detail`, `field_errors`). El frontend trata 4xx/5xx via `HttpError` como hoy.

## 5. Compatibilidad / versionado

- Cambio **aditivo** en la respuesta (campos nuevos). Clientes existentes (admin) siguen funcionando sin cambios.
- No hay nuevo versionado de URL; los campos nuevos conviven con los actuales.
