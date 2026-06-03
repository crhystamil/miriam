# Data Model - Corregir error al registrar venta

## 1) Venta
- Purpose: Registro comercial persistido al confirmar una operacion de venta.
- Fields relevantes:
  - `id`
  - `product`
  - `wholesaler`
  - `quantity`
  - `unit_sale_price`
  - `notes`
  - `sold_at`
- Validation rules:
  - Cantidad y precio deben ser mayores a cero.
  - Debe existir stock suficiente al momento de confirmar.
  - Producto y mayorista deben existir y estar disponibles para el flujo.

## 2) BorradorVenta
- Purpose: Estado temporal del formulario en modal antes de enviar.
- Fields:
  - `product` (seleccionado)
  - `wholesaler` (seleccionado)
  - `quantity`
  - `unit_sale_price`
  - `notes`
- Validation rules:
  - Debe ser editable despues de error para reintento.

## 3) ResultadoEnvioVenta
- Purpose: Resultado visible al usuario tras un intento de registro.
- States:
  - `exito` (venta creada y listado actualizado)
  - `error_validacion` (datos de negocio invalidos)
  - `error_operativo` (fallo temporal/red)

## Relationships
- `BorradorVenta` intenta crear una `Venta`.
- `ResultadoEnvioVenta` condiciona el estado de modal y refresco de listado.
