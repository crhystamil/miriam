# Data Model: Visor de imagen ampliada en el detalle de producto

**Feature**: 024-product-image-lightbox  
**Date**: 2026-06-07  
**Status**: Complete

## Resumen

**No hay cambios de datos.** Esta feature es puramente de presentacion (frontend). No se anaden modelos, campos, migraciones ni endpoints. Reutiliza la estructura ya entregada por el spec 023.

## Entidades de dominio (sin cambios)

### Product (frontend, `frontend/src/api/types.ts`)

Reutilizado tal cual. Campos relevantes consumidos por el visor:

| Campo | Tipo | Uso en el visor |
| ----- | ---- | --------------- |
| `id` | number | Identificador (sin cambio) |
| `name` | string | `alt` de la imagen y `aria-label` del dialogo |
| `images[]` | `ProductImage[]` | Fuente de la galeria del visor |
| `representative_image_url` | string (nullable) | Imagen representativa (incluida en `gallery` por la logica existente) |
| `representative_thumbnail_url` | string (nullable) | Miniatura de la representativa |

### ProductImage (frontend, `frontend/src/api/types.ts`)

| Campo | Tipo | Uso en el visor |
| ----- | ---- | --------------- |
| `id` | number | Key de la entrada |
| `image_url` | string | Ultimo peldano del fallback |
| `thumbnail_url` | string (nullable) | Miniatura (galeria inferior, sin cambio) |
| `medium_url` | string (nullable) | Fallback intermedio del visor |
| `large_url` | string (nullable) | **Fuente principal del visor** (variante 1200px WebP del spec 023) |

## Entidad de presentacion (frontend-only, ya existente)

### GalleryImage (`frontend/src/pages/ProductDetailPage.tsx:12`)

Tipo local ya definido en spec 023, reutilizado sin modificacion:

```ts
type GalleryImage = {
  key: string
  thumbnail: string
  large: string   // cadena large -> medium -> image_url
}
```

El array `gallery: GalleryImage[]` ya se construye con `useMemo` en `ProductDetailPage`. El visor lo consume tal cual: recibe la lista y un indice inicial.

## Estado de presentacion (NUEVO, solo cliente, sin persistencia)

El componente `Lightbox` mantiene estado local efimero (React `useState`); no se persiste en ningun lado.

| Estado | Tipo | Proposito |
| ------ | ---- | --------- |
| `currentIndex` | number | Indice de la imagen mostrada dentro de `gallery` |
| `failedLevels` | Set<number> (por indice) | Registra que niveles de fallback ya fallaron para ese indice (para `onError`) |
| (derivado) `current` | GalleryImage | `gallery[currentIndex]` |

El flag de abierto/cerrado (`isLightboxOpen: boolean`) vive en `ProductDetailPage` (estado del padre que dispara el modal), no dentro del Lightbox.

## Reglas de validacion (presentacion, derivadas de la spec)

- Si `gallery.length === 0` -> no se ofrece abrir el visor (FR-010).
- Si `gallery.length === 1` -> no se renderizan controles de navegacion ni indicador (FR-006).
- `currentIndex` acotado a `[0, gallery.length - 1]`; navegacion no circular: en los extremos el boton respectivo se deshabilita (R-007).
- Cierre permitido por: boton cerrar, click en backdrop, tecla `Escape` (FR-002).
- Navegacion permitida por: botones (escritorio y movil), `ArrowLeft`/`ArrowRight`, swipe horizontal en movil (FR-005, R-006).
- Mientras el visor esta abierto, `body { overflow: hidden }` (FR-009, R-004).

## Transiciones de estado (cliente)

```
closed  --[click imagen principal]-->  open(currentIndex = indice activo)
open    --[prev / next / swipe / flechas]-->  open(currentIndex +/- 1, clamped)
open    --[cerrar / backdrop / Escape / desmontar]-->  closed
```

No hay transiciones a persistir; al cerrar/desmontar se descarta todo el estado efimero.

## Sin contratos de API nuevos

Ver [`contracts/no-new-contracts.md`](./contracts/no-new-contracts.md): la feature no expone ni consume nuevos endpoints; usa los mismos campos de variante entregados por el spec 023.
