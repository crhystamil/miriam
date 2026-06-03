# Data Model - Carga de imagen en nuevo producto

## 1) Producto
- Purpose: Representa articulo del catalogo gestionado por administracion.
- Fields relevantes para esta feature:
  - `id` (identificador unico)
  - `sku` (string, unico)
  - `name` (string, requerido)
  - `is_active` (boolean)
  - timestamps de control
- Validation rules:
  - Debe tener exactamente una imagen asociada al momento de alta en este flujo.

## 2) ImagenProducto
- Purpose: Representa archivo de imagen subido para un producto.
- Fields:
  - `id` (identificador unico)
  - `product_id` (FK obligatoria a Producto)
  - `image_file` (archivo requerido)
  - `content_type` (metadato)
  - `size_bytes` (metadato)
  - `created_at` (timestamp)
- Validation rules:
  - Debe existir exactamente una imagen por producto creado desde este flujo.
  - Solo formatos permitidos por politica operativa.
  - Tamano maximo dentro del limite operativo definido.

## 3) CargaImagenProducto
- Purpose: Flujo de seleccion, validacion y asociacion de archivo durante el alta.
- States:
  - `seleccionado`
  - `validado`
  - `persistido`
  - `fallido`

## Relationships
- `Producto 1:1 ImagenProducto` en el alcance de esta iteracion.
