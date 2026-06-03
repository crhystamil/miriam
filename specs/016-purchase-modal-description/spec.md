# Feature Specification: Modal de nueva compra con descripcion

**Feature Branch**: `[016-purchase-modal-description]`
**Created**: 2026-06-03
**Status**: Draft
**Input**: User description: "en el panel de administracion en la seccion de compras cuando se realiza una nueva compra, creemos un boton para una nueva compra, para luego tener un modal que muestre los detalles de una nueva compra, y agreguemos un campo para agregar una descripcion de una nueva compra, una vez que se registra una nueva compra debemos actualizar la tabla para poder ver la compra realizada, la tabla donde se muestan las nuevas compras debemos ordenarlas de manera descendente donde se muestre desde las compras mas recientes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar compra desde modal (Priority: P1)

Como administrador, quiero abrir un modal desde la seccion de compras para registrar una nueva compra con sus detalles y descripcion, para que el ingreso de inventario sea mas claro y no ocupe espacio permanente en la pantalla principal.

**Why this priority**: Es el flujo principal solicitado. Sin el modal y el campo de descripcion no se cumple la mejora de usabilidad ni el registro completo de la compra.

**Independent Test**: En la seccion de compras, presionar el boton "Nueva compra", completar producto, cantidad, costo unitario y descripcion, guardar, y verificar que la compra se registra correctamente.

**Acceptance Scenarios**:

1. **Given** que un administrador esta en la seccion de compras, **When** presiona el boton "Nueva compra", **Then** se abre un modal con los campos necesarios para registrar una compra.
2. **Given** que el modal de nueva compra esta abierto, **When** el administrador completa producto, cantidad, costo unitario y descripcion, **Then** puede registrar la compra exitosamente.
3. **Given** que el administrador intenta registrar una compra con cantidad o costo invalido, **When** envia el formulario, **Then** el sistema muestra un error de validacion y mantiene el modal abierto para corregir los datos.

---

### User Story 2 - Ver compra nueva en la tabla actualizada (Priority: P1)

Como administrador, quiero que despues de registrar una compra la tabla se actualice automaticamente, para confirmar inmediatamente que la compra fue registrada.

**Why this priority**: Sin actualizacion automatica, el usuario puede pensar que la compra fallo o registrar duplicados.

**Independent Test**: Registrar una compra desde el modal y verificar que aparece en la tabla sin recargar manualmente la pagina.

**Acceptance Scenarios**:

1. **Given** que una compra se registra exitosamente desde el modal, **When** se completa la operacion, **Then** la tabla de compras se actualiza y muestra la compra nueva.
2. **Given** que la compra nueva aparece en la tabla, **When** el administrador revisa sus detalles, **Then** puede ver la descripcion ingresada junto al resto de datos de la compra.

---

### User Story 3 - Ordenar compras de mas recientes a mas antiguas (Priority: P2)

Como administrador, quiero que la tabla de compras muestre primero las compras mas recientes, para revisar rapidamente los ultimos ingresos de inventario.

**Why this priority**: Mejora la visibilidad operativa, pero depende de que el registro y actualizacion de compras funcionen correctamente.

**Independent Test**: Registrar dos compras en momentos distintos y verificar que la mas reciente aparece antes que la anterior.

**Acceptance Scenarios**:

1. **Given** que existen multiples compras, **When** el administrador abre la seccion de compras, **Then** la tabla muestra primero las compras mas recientes.
2. **Given** que se registra una nueva compra, **When** la tabla se actualiza, **Then** la compra nueva aparece antes que las compras anteriores.

---

### Edge Cases

- Que ocurre si la lista de productos esta vacia al abrir el modal de nueva compra.
- Que ocurre si la compra falla por validacion de cantidad o costo.
- Que ocurre si la compra se registra correctamente pero falla la recarga de la tabla.
- Que ocurre si la descripcion de compra se deja vacia.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar un boton "Nueva compra" en la seccion de compras del panel de administracion.
- **FR-002**: El sistema MUST abrir un modal de registro de compra al presionar el boton "Nueva compra".
- **FR-003**: El modal MUST permitir seleccionar producto, ingresar cantidad, ingresar costo unitario e ingresar una descripcion opcional de la compra.
- **FR-004**: El sistema MUST registrar la descripcion ingresada junto con la compra.
- **FR-005**: El sistema MUST mantener el modal abierto y mostrar errores si la compra falla por validacion.
- **FR-006**: El sistema MUST cerrar el modal o limpiar el formulario despues de una compra exitosa para evitar registros duplicados accidentales.
- **FR-007**: El sistema MUST actualizar automaticamente la tabla de compras despues de registrar una compra exitosa.
- **FR-008**: La tabla de compras MUST mostrar las compras ordenadas de forma descendente por fecha de compra, con la compra mas reciente primero.
- **FR-009**: La tabla de compras MUST mostrar la descripcion de cada compra cuando exista.

### Key Entities *(include if feature involves data)*

- **Compra**: Registro de ingreso de inventario con producto, cantidad, costo unitario, fecha de compra y descripcion opcional.
- **Producto**: Item de inventario seleccionado en el modal de compra.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de compras registradas exitosamente desde el modal aparece en la tabla sin recarga manual de la pagina.
- **SC-002**: El 100% de compras con descripcion ingresada muestran esa descripcion al revisar la tabla de compras.
- **SC-003**: El 100% de vistas de la tabla de compras muestran primero la compra mas reciente.
- **SC-004**: Un administrador puede completar el registro de una compra desde el modal en menos de 1 minuto.

## Assumptions

- Solo usuarios administradores pueden registrar compras, manteniendo los permisos existentes.
- La descripcion de compra es opcional; una compra sin descripcion sigue siendo valida.
- El flujo de compra existente ya registra producto, cantidad y costo unitario; esta feature cambia la presentacion a modal y agrega visibilidad de descripcion.
- La fecha que define el orden descendente es la fecha de registro de compra.
