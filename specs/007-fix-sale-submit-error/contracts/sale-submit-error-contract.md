# Sale Submit Error Contract

## Sale Creation Flow Contract
- El modal de registrar venta debe enviar un payload valido con producto, mayorista, cantidad y precio.
- El backend debe responder de forma consistente para exito y error de negocio.

## Success Response Contract
- Cuando la venta se crea, la interfaz muestra mensaje de exito.
- El modal se cierra y el listado de ventas refleja el nuevo registro.

## Error Response Contract
- Cuando falle validacion de negocio, la interfaz muestra mensajes claros por campo o regla global.
- El formulario permanece editable para correccion y reintento.
- No debe generarse venta parcial ni duplicada por un intento fallido.

## Operational Failure Contract
- Ante fallo temporal (ej. red), la interfaz informa error operativo claro.
- El usuario puede reintentar sin perder control del flujo.
