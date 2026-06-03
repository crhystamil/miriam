# Data Model - Corregir imagenes en registrar venta

## 1) ProductoVenta
- Purpose: Producto elegido en el modal de registrar venta.
- Fields relevantes:
  - `id`
  - `sku`
  - `name`
  - `images[]` (coleccion de fotos asociadas)
- Validation rules:
  - Si existen fotos, deben venir ordenadas para seleccionar la representativa.
  - Si no existen fotos, el flujo de venta sigue operativo con fallback visual.

## 2) FotoProducto
- Purpose: Imagen asociada a un producto del catalogo.
- Fields:
  - `id`
  - `image_url`
  - `position`
  - `content_type`
  - `size_bytes`
- Validation rules:
  - La foto representativa para venta es la de menor `position`.

## 3) EstadoVisualVenta
- Purpose: Estado de visualizacion de imagen en el modal de venta.
- States:
  - `con_imagen` (se renderiza foto representativa)
  - `sin_imagen` (producto sin fotos)
  - `error_imagen` (fallo de carga de recurso)

## Relationships
- `ProductoVenta 1:N FotoProducto`.
- `EstadoVisualVenta` se determina a partir de disponibilidad y carga de `FotoProducto`.
