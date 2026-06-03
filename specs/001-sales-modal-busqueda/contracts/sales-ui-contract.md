# Sales UI Contract - Registro de venta en modal

## Trigger Contract
- Action label: `Registrar Venta`
- Result: abre modal centrado con formulario de venta.

## Form Contract
- Required fields:
  - Producto
  - Cantidad
  - Precio de venta
- Read-only context field:
  - Precio mayorista referencial
- Optional field:
  - Nota de venta

## Product Search Contract
- Input behavior:
  - Filtro incremental por texto
  - Campos de coincidencia: SKU y nombre
- Empty result behavior:
  - Mensaje explicito de "sin coincidencias"
  - No bloquea cierre/cancelacion de modal

## Draft Lifecycle Contract
- While modal is open: conservar borrador.
- On cancel/close: limpiar borrador.
- On successful save: limpiar borrador y cerrar modal (o reiniciar segun UX final acordada), luego refrescar listado.

## Product Preview Contract
- Ubicacion: columna secundaria en desktop, bloque inferior en mobile.
- Contenido minimo:
  - Imagen referencial pequena
  - SKU, nombre, stock, precios, estado, descripcion

## Error Contract
- Mostrar mensajes de validacion por campo y mensaje general de negocio cuando aplique.
- Mantener datos del borrador en errores de envio para permitir correccion inmediata.
