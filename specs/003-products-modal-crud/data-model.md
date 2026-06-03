# Data Model - Gestion de productos con modal e imagenes

## 1) Producto
- Purpose: Representa un articulo comercial disponible para catalogo y ventas.
- Fields:
  - `id` (identificador unico)
  - `sku` (string, unico, requerido)
  - `name` (string, requerido)
  - `description` (string, opcional)
  - `cost_price` (decimal, requerido)
  - `wholesale_reference_price` (decimal, requerido)
  - `public_price` (decimal, requerido)
  - `stock` (entero no negativo)
  - `is_active` (boolean, default true)
  - `created_at` / `updated_at` (timestamps)
- Validation rules:
  - SKU unico en catalogo.
  - Precios no negativos y consistentes segun reglas de negocio vigentes.
  - Debe existir al menos una imagen asociada al guardar en alta/edicion.
  - Eliminacion funcional se modela como transicion a inactivo (`is_active=false`).

## 2) ImagenProducto
- Purpose: Almacena referencias visuales de un producto para identificacion operativa.
- Fields:
  - `id` (identificador unico)
  - `product_id` (FK obligatoria a Producto)
  - `image_url` o `image_file` (requerido, segun almacenamiento vigente)
  - `position` (entero opcional para orden de visualizacion)
  - `created_at` (timestamp)
- Validation rules:
  - Cada imagen pertenece a un producto existente.
  - Un producto debe tener una o mas imagenes activas.

## 3) EstadoCatalogoProducto
- Purpose: Define comportamiento operativo en tabla de productos.
- States:
  - `activo`: visible en tabla operativa y elegible para flujos de negocio.
  - `inactivo`: oculto de tabla operativa por defecto, historial preservado.
- Transitions:
  - `activo -> inactivo`: accion "eliminar" con confirmacion.
  - `inactivo -> activo`: reactivacion administrativa (si el flujo se habilita en fases posteriores).

## Relationships
- `Producto 1:N ImagenProducto`.
- `Producto` puede tener referencias historicas en ventas/movimientos, por eso no se borra fisicamente en esta feature.
