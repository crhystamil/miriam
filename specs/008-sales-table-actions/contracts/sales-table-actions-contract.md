# Sales Table Actions Contract

## Sales Table Data Contract
- La tabla de ventas para admin y vendedor expone por fila: fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido.
- Los datos deben mantenerse consistentes al paginar o filtrar.

## Disable Sale Contract
- La accion de deshabilitar marca la venta como inactiva.
- Al deshabilitar, se revierte el stock correspondiente a la cantidad de la venta.
- La tabla debe reflejar el nuevo estado de forma inmediata.

## Delete Sale Contract
- La accion de eliminar esta permitida solo para administrador.
- Si el usuario no tiene permisos, se responde con bloqueo claro de la operacion.

## Failure Handling Contract
- Si la venta no existe o ya cambio de estado, el sistema devuelve mensaje claro y no rompe la tabla.
- Errores operativos temporales deben permitir reintento manual del usuario.
