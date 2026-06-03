# Data Model - Perfil de mayorista en ventas

## 1) Mayorista
- Purpose: Identificar cliente mayorista para asociar compras de productos.
- Fields:
  - `id` (identificador unico)
  - `name` (string, requerido)
  - `phone_raw` (string, informativo)
  - `phone_normalized` (string, derivado para unicidad)
  - `is_active` (boolean)
  - `created_at` / `updated_at` (timestamps)
- Validation rules:
  - `name` no vacio y legible.
  - Unicidad por (`name`, `phone_normalized`).

## 2) Venta (extension)
- Purpose: Registrar transaccion de producto con referencia al mayorista comprador.
- New/updated fields:
  - `wholesaler_id` (referencia obligatoria a Mayorista)
  - campos actuales de venta se mantienen (producto, cantidad, precio, notas, vendedor, etc.)
- Validation rules:
  - No se permite guardar venta sin `wholesaler_id` valido.

## 3) FiltroConsultaMayorista
- Purpose: Restringir/consultar ventas por mayorista en vistas/reportes.
- Fields:
  - `wholesaler_id` (opcional para filtrar)
  - `wholesaler_name` (opcional para busqueda por texto)

## Relationships
- `Venta.wholesaler_id` -> `Mayorista.id` (N:1)
- Un mayorista puede tener multiples ventas.
