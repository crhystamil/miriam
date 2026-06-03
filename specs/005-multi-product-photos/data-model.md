# Data Model - Carga de multiples fotos por producto

## 1) Producto
- Purpose: Articulo del catalogo administrado en flujo de alta.
- Fields relevantes:
  - `id` (identificador unico)
  - `sku` (string, unico)
  - `name` (string, requerido)
  - `is_active` (boolean)
  - timestamps de control
- Validation rules:
  - Debe existir entre 1 y 5 fotos asociadas en el alta.

## 2) FotoProducto
- Purpose: Archivo individual de imagen asociado a un producto.
- Fields:
  - `id` (identificador unico)
  - `product_id` (FK obligatoria a Producto)
  - `image_file` (archivo requerido)
  - `content_type` (metadato)
  - `size_bytes` (metadato)
  - `position` (orden de visualizacion)
  - `created_at` (timestamp)
- Validation rules:
  - Cada foto debe cumplir formato/tamano permitidos.
  - Maximo 5 fotos por producto en un mismo lote de alta.
  - El lote de alta no admite fotos invalidas.

## 3) LoteCargaFotos
- Purpose: Conjunto de archivos enviados en un solo alta.
- States:
  - `recibido`
  - `validado`
  - `persistido`
  - `rechazado`

## Relationships
- `Producto 1:N FotoProducto`.
- Un `LoteCargaFotos` exitoso crea una coleccion de `FotoProducto` para el mismo `Producto`.
