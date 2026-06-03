# Data Model - Mejora de registro de ventas

## 1) VentaEnCaptura (UI)
- Purpose: Representar el estado temporal del formulario en el modal de registro.
- Fields:
  - `productId` (number, requerido)
  - `quantity` (number entero > 0, requerido)
  - `unitSalePrice` (string/decimal > 0, requerido)
  - `wholesaleReferencePrice` (string/decimal, solo lectura)
  - `notes` (string, opcional)
- Validation rules:
  - `productId` debe existir en la lista activa de productos.
  - `quantity` > 0.
  - `unitSalePrice` > 0.
- Lifecycle:
  - `empty` -> `draft` (usuario modifica campos)
  - `draft` -> `submitting` (confirmacion)
  - `submitting` -> `success` (registro creado)
  - `submitting` -> `error` (mensaje de validacion/negocio)
  - `draft|error|success` -> `empty` (cerrar/cancelar o reset post-success)

## 2) ProductoSeleccionable (lectura)
- Purpose: Opcion utilizable en el selector con buscador.
- Fields:
  - `id` (number)
  - `sku` (string)
  - `name` (string)
  - `description` (string)
  - `costPrice` (decimal)
  - `wholesaleReferencePrice` (decimal)
  - `publicPrice` (decimal)
  - `stock` (number)
  - `isActive` (boolean)
- Search behavior:
  - Coincidencia parcial por `sku` y `name` (case-insensitive).

## 3) VistaPreviaProducto (UI)
- Purpose: Resumen paralelo al formulario para validacion visual.
- Fields derivados de `ProductoSeleccionable`:
  - `sku`, `name`, `stock`, `costPrice`, `wholesaleReferencePrice`, `publicPrice`, `isActive`, `description`
  - `imageReference` (string URL referencial pequena)
- Rules:
  - Se actualiza inmediatamente al cambiar `productId`.
  - Si faltan datos descriptivos, mostrar fallback legible.

## Relationships
- `VentaEnCaptura.productId` -> `ProductoSeleccionable.id` (1:1 durante la captura)
- `VistaPreviaProducto` depende de `ProductoSeleccionable` seleccionado.
