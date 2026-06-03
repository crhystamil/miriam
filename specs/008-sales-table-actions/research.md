# Research - Completar tabla de ventas y acciones

## Decision 1: Extender listado de ventas con campos operativos completos
- Decision: Mostrar en la tabla de ventas fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido para admin y vendedor.
- Rationale: Cumple el requerimiento de auditoria operativa sin depender de vistas secundarias.
- Alternatives considered:
  - Mostrar subset minimo: no satisface control comercial solicitado.
  - Mostrar detalles en modal aparte: agrega friccion y no resuelve visibilidad directa.

## Decision 2: Deshabilitar venta como anulacion operativa con reversa de stock
- Decision: La accion de deshabilitar marca venta inactiva y revierte la cantidad al inventario.
- Rationale: Mantiene trazabilidad historica y consistencia de inventario frente a anulaciones.
- Alternatives considered:
  - Deshabilitar sin tocar stock: produce descuadre operativo.
  - Eliminacion directa como unica opcion: pierde historial de correccion.

## Decision 3: Eliminar venta restringido a administrador
- Decision: Solo usuarios administradores pueden eliminar ventas; vendedores pueden deshabilitar.
- Rationale: Reduce riesgo de perdida de datos por perfiles operativos y respeta principio de menor privilegio.
- Alternatives considered:
  - Permitir eliminar a vendedor: mayor riesgo de borrado indebido.
  - Bloquear eliminar para todos: no cubre necesidad de limpieza excepcional.

## Decision 4: Manejo de concurrencia y errores de accion
- Decision: Si venta no existe o cambia de estado antes de accionar, devolver mensaje claro y mantener tabla utilizable.
- Rationale: Evita fallos silenciosos y reduce confusiones en operaciones concurrentes.
- Alternatives considered:
  - Error generico sin contexto: dificulta recuperacion.
  - Reintento automatico opaco: puede ocultar causa real.
