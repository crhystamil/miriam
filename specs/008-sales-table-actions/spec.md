# Feature Specification: Completar tabla de ventas y acciones

**Feature Branch**: `[008-sales-table-actions]`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "la tabla de ventas para el administrador y el vendedor debe tener todos los datos la fecha,mayorista,producto,cantidad,costo,precio mayorista, precio vendido y debe tener la opcion de eliminar o deshabilitar la venta."

## Clarifications

### Session 2026-05-12

- Q: ¿Que debe ocurrir al deshabilitar una venta respecto al inventario? → A: Marcar inactiva y revertir stock; la venta deja de contar operativamente.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver tabla completa de ventas (Priority: P1)

Como administrador o vendedor, quiero ver en la tabla de ventas todos los campos clave para auditar cada operacion sin abrir vistas adicionales.

**Why this priority**: La tabla incompleta impide control operativo y validacion rapida de ventas registradas.

**Independent Test**: Abrir modulo de ventas con sesiones de administrador y vendedor y confirmar que cada fila muestra fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido.

**Acceptance Scenarios**:

1. **Given** que existen ventas registradas, **When** el usuario abre la tabla de ventas, **Then** cada fila muestra fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido.
2. **Given** que el usuario cambia de pagina o aplica filtros, **When** se renderizan nuevas filas, **Then** los mismos campos completos se mantienen visibles y consistentes.

---

### User Story 2 - Deshabilitar venta desde la tabla (Priority: P1)

Como administrador o vendedor, quiero deshabilitar una venta desde la tabla para anular su vigencia operativa sin perder trazabilidad historica.

**Why this priority**: Permite corregir operaciones sin borrar evidencia de la transaccion.

**Independent Test**: Seleccionar una venta activa, ejecutar deshabilitar y verificar que ya no aparece como activa en el flujo de gestion correspondiente.

**Acceptance Scenarios**:

1. **Given** que una venta esta activa, **When** el usuario ejecuta la accion de deshabilitar, **Then** la venta cambia a estado inactivo y la tabla refleja el nuevo estado.
2. **Given** que la venta ya esta deshabilitada, **When** el usuario intenta deshabilitar nuevamente, **Then** el sistema evita duplicar la accion y mantiene estado consistente.

---

### User Story 3 - Eliminar venta con control de permisos (Priority: P2)

Como administrador, quiero eliminar una venta desde la tabla cuando sea necesario para limpieza excepcional, con control de permisos para evitar eliminaciones indebidas.

**Why this priority**: Cubre casos excepcionales de depuracion de datos sin exponer riesgo operativo a perfiles no autorizados.

**Independent Test**: Iniciar sesion como administrador y eliminar una venta; iniciar sesion como vendedor y confirmar que no puede eliminar.

**Acceptance Scenarios**:

1. **Given** que el usuario es administrador, **When** confirma eliminar una venta, **Then** la venta se elimina y deja de listarse.
2. **Given** que el usuario es vendedor, **When** intenta eliminar una venta, **Then** el sistema bloquea la operacion por permisos.

---

### Edge Cases

- Que ocurre si no hay ventas registradas y la tabla esta vacia.
- Que ocurre si un usuario intenta eliminar o deshabilitar una venta que ya no existe.
- Que ocurre si dos usuarios intentan deshabilitar/eliminar la misma venta al mismo tiempo.
- Que ocurre si falla la accion por error temporal de red o servidor.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en la tabla de ventas los campos fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido.
- **FR-002**: El sistema MUST mantener esos campos visibles para los perfiles administrador y vendedor, respetando la visibilidad de datos permitida por rol.
- **FR-003**: El sistema MUST permitir deshabilitar una venta desde la tabla para administrador y vendedor.
- **FR-004**: El sistema MUST reflejar inmediatamente en la tabla el resultado de deshabilitar una venta.
- **FR-009**: El sistema MUST, al deshabilitar una venta, marcarla inactiva y revertir el stock asociado de forma consistente.
- **FR-005**: El sistema MUST permitir eliminar una venta solo a usuarios con permisos administrativos.
- **FR-006**: El sistema MUST bloquear la eliminacion de ventas para usuarios sin permisos administrativos con mensaje claro.
- **FR-007**: El sistema MUST manejar errores de acciones (deshabilitar/eliminar) con mensajes claros sin romper la tabla.
- **FR-008**: El sistema MUST preservar consistencia de datos cuando una venta ya no exista o cambie de estado antes de ejecutar la accion.

### Key Entities *(include if feature involves data)*

- **Venta en tabla**: Registro de venta mostrado en lista con datos comerciales y de estado.
- **Estado de venta**: Condicion operativa de la venta (activa/deshabilitada).
- **Accion de venta**: Operacion ejecutable desde la tabla (deshabilitar o eliminar) sujeta a permisos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En validacion funcional, el 100% de filas de ventas visibles para admin y vendedor incluye los campos requeridos.
- **SC-002**: En pruebas de flujo, el 100% de acciones de deshabilitar exitosas actualiza la tabla sin recarga manual.
- **SC-003**: En pruebas de permisos, el 100% de intentos de eliminar por usuarios no administradores es bloqueado.
- **SC-004**: En validacion operativa, el 100% de errores de accion muestra mensajes claros y la tabla permanece utilizable.

## Assumptions

- El modulo de ventas ya cuenta con autenticacion y roles de administrador y vendedor.
- El campo costo y precio mayorista estan disponibles en la informacion de venta o pueden exponerse en el listado existente.
- Deshabilitar una venta implica conservar su registro historico con estado inactivo.
- Al deshabilitar una venta, el inventario debe revertir la cantidad vendida asociada a esa operacion.
- Eliminar una venta se considera operacion excepcional restringida a administradores.
