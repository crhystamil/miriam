# Contracts: Visor de imagen ampliada

**Feature**: 024-product-image-lightbox  
**Date**: 2026-06-07

## Conclusion: Sin contratos nuevos

Esta feature es **puramente frontend** (presentacion). No introduce:

- Nuevos endpoints de API.
- Nuevos campos en respuestas (consume los campos `thumbnail_url`, `medium_url`, `large_url`, `representative_image_url`, `representative_thumbnail_url` ya entregados por el **spec 023** — ver [`../specs/023-catalog-loading-optimization/contracts/product-image-variants-api.md`](../../023-catalog-loading-optimization/contracts/product-image-variants-api.md)).
- Nuevos modelos, migraciones ni cambios en el serializador.

## Interfaz interna consumida

El unico "contrato" relevante es el **componente interno** `Lightbox` (React), con esta superficie (a confirmar en `/speckit.tasks`):

| Prop | Tipo | Notas |
| ---- | ---- | ----- |
| `images` | `GalleryImage[]` | Lista ya materializada por `ProductDetailPage` |
| `startIndex` | number | Indice inicial (el de la imagen principal activa) |
| `alt` | string | Texto base para `alt`/`aria-label` (nombre del producto) |
| `onClose` | `() => void` | Callback de cierre |

No es un contrato publico; es detalle de implementacion del frontend.
