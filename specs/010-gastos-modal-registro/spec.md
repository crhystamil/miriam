# Feature Specification: Registro de gastos en modal y simplificacion de vista

**Feature Branch**: `[010-gastos-modal-registro]`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "en la vista de gastos, cuando se tiene un nuevo gasto, crea un boton para que abra un modal encima la tabla y se pueda registrar un nuevo gasto, revisa los campos que se deben registrar y quita el filtro que esta encima la tabla de gastos."

## Clarifications

### Session 2026-05-13

- Q: El registro de gasto debe capturar fecha manual o usar fecha automatica? → A: No pedir fecha; usar fecha/hora automatica al guardar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar nuevo gasto desde modal (Priority: P1)

Como usuario que registra egresos, quiero un boton de "Nuevo gasto" que abra un modal sobre la tabla para capturar rapidamente un gasto sin salir de la vista de gastos.

**Why this priority**: El registro de gastos es la accion principal del modulo y debe ser directa para no frenar la operacion diaria.

**Independent Test**: Desde la vista de gastos, abrir el modal con el boton, completar campos validos y confirmar que el gasto se guarda y aparece en la tabla.

**Acceptance Scenarios**:

1. **Given** que el usuario esta en la vista de gastos, **When** presiona "Nuevo gasto", **Then** se abre un modal encima de la tabla con el formulario de registro.
2. **Given** que el usuario completa el formulario con datos validos, **When** confirma el registro, **Then** el sistema crea el gasto y refresca la tabla mostrando el nuevo registro.
3. **Given** que el usuario cierra o cancela el modal, **When** vuelve a abrirlo, **Then** el formulario se muestra en estado limpio para un nuevo registro.

---

### User Story 2 - Capturar campos correctos de gasto (Priority: P1)

Como usuario, quiero que el modal muestre los campos necesarios para registrar un gasto valido, evitando omisiones o datos incompletos, manteniendo la fecha/hora automatica del sistema al guardar.

**Why this priority**: Sin los campos correctos, el registro no es confiable para control financiero.

**Independent Test**: Abrir modal y verificar que permite capturar ambito, concepto y monto como requeridos, notas como opcional y que no solicita fecha manual.

**Acceptance Scenarios**:

1. **Given** que el usuario abre el modal de nuevo gasto, **When** revisa el formulario, **Then** encuentra los campos ambito, concepto y monto como obligatorios y no encuentra campo de fecha editable.
2. **Given** que el usuario deja vacio un campo obligatorio o usa monto invalido, **When** intenta guardar, **Then** el sistema muestra validaciones claras y no registra el gasto.
3. **Given** que el usuario agrega notas opcionales, **When** guarda el gasto, **Then** el registro conserva esa informacion en el detalle del gasto.

---

### User Story 3 - Eliminar filtros superiores de la tabla de gastos (Priority: P2)

Como usuario, quiero que se quite el bloque de filtros encima de la tabla de gastos para tener una vista mas simple y enfocada en registrar y consultar.

**Why this priority**: Reduce complejidad visual y mantiene foco en el flujo principal de carga de gastos.

**Independent Test**: Abrir la vista de gastos y verificar que el bloque de filtros sobre la tabla ya no se muestra, manteniendo tabla paginada funcional.

**Acceptance Scenarios**:

1. **Given** que el usuario accede a la vista de gastos, **When** revisa la zona superior de la tabla, **Then** no existe el formulario de filtros por fecha o ambito.
2. **Given** que no hay filtros manuales en pantalla, **When** el usuario navega entre paginas, **Then** la tabla mantiene su comportamiento normal de listado y paginacion.

---

### Edge Cases

- Que ocurre si el usuario intenta enviar el formulario varias veces rapidamente.
- Que ocurre si el registro falla por error operativo temporal.
- Que ocurre si el usuario cierra el modal con cambios sin guardar.
- Que ocurre cuando la tabla esta vacia despues de abrir/cerrar el modal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en la vista de gastos un boton visible de "Nuevo gasto" para abrir el formulario en modal.
- **FR-002**: El sistema MUST abrir un modal sobre la tabla de gastos al activar el boton de nuevo gasto.
- **FR-003**: El sistema MUST permitir registrar un gasto desde el modal usando los campos ambito, concepto y monto como obligatorios.
- **FR-004**: El sistema MUST permitir registrar notas como campo opcional en el mismo modal.
- **FR-004B**: El sistema MUST asignar automaticamente fecha y hora del gasto al momento de guardar, sin solicitar ingreso manual de fecha en el modal.
- **FR-005**: El sistema MUST validar que concepto no este vacio y que monto sea mayor a cero antes de guardar.
- **FR-006**: El sistema MUST mostrar mensajes de error claros cuando la validacion falle y evitar el registro incompleto.
- **FR-007**: El sistema MUST cerrar o limpiar el formulario de modal de forma consistente al cancelar o completar un registro exitoso.
- **FR-008**: El sistema MUST reflejar el nuevo gasto en la tabla de gastos inmediatamente despues de un registro exitoso.
- **FR-009**: El sistema MUST eliminar de la vista el bloque de filtros ubicado encima de la tabla de gastos.
- **FR-010**: El sistema MUST mantener la tabla de gastos funcional para consulta y paginacion despues de eliminar filtros visibles.

### Key Entities *(include if feature involves data)*

- **Gasto**: Registro de egreso con ambito, concepto, monto, fecha y notas opcionales.
- **Formulario de gasto**: Conjunto de campos y validaciones usado dentro del modal para crear un gasto.
- **Modal de nuevo gasto**: Contenedor emergente que encapsula el formulario y acciones de confirmar/cancelar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de usuarios puede abrir el modal de nuevo gasto desde la vista de gastos en un solo clic.
- **SC-002**: El 100% de intentos con datos validos registra el gasto y lo refleja en la tabla sin recargar manualmente la pagina.
- **SC-003**: El 100% de intentos con datos invalidos muestra errores entendibles y evita registros incompletos.
- **SC-004**: En validacion visual, la vista de gastos no muestra el bloque de filtros superior y conserva navegacion de tabla sin errores.
- **SC-005**: El 100% de gastos registrados desde el modal queda con fecha/hora asignada automaticamente por el sistema sin capturas manuales de fecha.

## Assumptions

- El flujo actual de creacion de gastos y sus reglas de negocio se mantiene sin cambios de permisos.
- Los campos obligatorios para registrar gasto son ambito, concepto y monto; notas permanece opcional.
- La fecha del gasto se mantiene con asignacion automatica al guardar y no forma parte de los campos editables del modal.
- La eliminacion de filtros aplica solo al bloque visible sobre la tabla de gastos de esta vista.
