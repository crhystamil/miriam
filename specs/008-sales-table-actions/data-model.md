# Data Model - Completar tabla de ventas y acciones

## 1) VentaTabla
- Purpose: Registro de venta mostrado en la tabla para consulta y acciones.
- Fields relevantes:
  - `id`
  - `sold_at` (fecha)
  - `wholesaler_name`
  - `product_name`
  - `quantity`
  - `unit_cost_price` (costo)
  - `unit_wholesale_reference_price` (precio mayorista)
  - `unit_sale_price` (precio vendido)
  - `is_active` (estado operativo)
- Validation rules:
  - Debe exponer todos los campos requeridos por fila para ambos roles.

## 2) AccionVenta
- Purpose: Operacion ejecutable sobre venta desde la tabla.
- Types:
  - `deshabilitar`
  - `eliminar`
- Validation rules:
  - `deshabilitar` disponible para admin y vendedor.
  - `eliminar` disponible solo para admin.

## 3) ResultadoAccionVenta
- Purpose: Resultado visible tras ejecutar accion de tabla.
- States:
  - `exito_deshabilitar` (venta inactiva + stock revertido)
  - `exito_eliminar` (venta eliminada)
  - `error_permiso`
  - `error_estado`
  - `error_operativo`

## Relationships
- `VentaTabla` puede recibir una `AccionVenta`.
- `ResultadoAccionVenta` determina refresco de tabla y mensajes de usuario.
