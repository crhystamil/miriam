# Feature Specification: Refinar vista y calculos de corte mensual

**Feature Branch**: `[012-monthly-cut-view-refinement]`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "debemos corregir en corte mensual la tabla de resumen financiero, el neto real es la ganancia de la tienda menos los gastos. las ganancias de los mayoristas se paga a cada mayorista y no debemos usar ese dinero, tambien quitar *capital invertido* ya que es igual a capital. debemos agregar una tabla de los gatos. lo mejor seria tener otra vista para ver cada corte, tener la vista principal donde se vera una lista de todos los cortes y al darle click en la accion ver, enviar a otra pagina donde se vera toda la informacion del corte que se realizo. y por ultimo debemos agregar una advertencia cuando se de click en el boton de ejecutar corte."

## Clarifications

### Session 2026-05-13

- Q: Que hacer si se intenta abrir el detalle de un corte inexistente? → A: Los cortes no se deben borrar; deben conservar historial mensual completo.
- Q: En que vista debe existir la accion Ejecutar corte? → A: Solo en la vista principal de listado de cortes.
- Q: Que columnas debe incluir la tabla de gastos del detalle? → A: Fecha, concepto y monto.
- Q: En que orden debe mostrarse el listado de cortes? → A: Por fecha de corte descendente (mas reciente primero).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Corregir resumen financiero del corte (Priority: P1)

Como administrador, quiero que el resumen financiero del corte use reglas correctas para neto real y capital para evitar decisiones basadas en calculos equivocados.

**Why this priority**: Los indicadores globales son la base del cierre mensual y cualquier error afecta control financiero.

**Independent Test**: Abrir detalle de un corte y verificar que neto real se calcula como ganancia tienda menos gastos y que no aparece capital invertido separado de capital.

**Acceptance Scenarios**:

1. **Given** que existe un corte con datos de ventas y gastos, **When** se visualiza el resumen financiero, **Then** neto real corresponde a ganancia tienda menos gastos.
2. **Given** que las ganancias de mayorista son valores de pago externo, **When** se muestra el resumen global, **Then** esas ganancias no se usan para calcular neto real.
3. **Given** que capital invertido y capital son equivalentes, **When** se muestra el resumen, **Then** se presenta solo capital y se elimina capital invertido como campo separado.

---

### User Story 2 - Separar lista de cortes y detalle de corte (Priority: P1)

Como administrador, quiero una vista principal con la lista de cortes y una vista separada para ver el detalle completo de un corte para navegar y consultar de forma mas clara.

**Why this priority**: Mejora la navegacion y evita sobrecarga visual al combinar listado y detalle en una sola pantalla.

**Independent Test**: Entrar a vista principal de cortes, usar accion Ver y validar que redirige a una vista de detalle con toda la informacion del corte.

**Acceptance Scenarios**:

1. **Given** que hay cortes registrados, **When** el usuario abre la vista principal de cortes, **Then** ve un listado con acciones por fila.
2. **Given** que el usuario presiona Ver en un corte, **When** se ejecuta la accion, **Then** el sistema navega a una vista dedicada de detalle de ese corte.
3. **Given** que se abre el detalle de corte, **When** la vista carga, **Then** muestra resumen financiero, desempeno por mayorista, tabla de gastos y detalle de ventas.

---

### User Story 3 - Agregar tabla de gastos y advertencia antes de ejecutar corte (Priority: P2)

Como administrador, quiero ver una tabla de gastos del corte y recibir advertencia antes de ejecutar un nuevo corte para prevenir errores operativos.

**Why this priority**: Aumenta control y reduce ejecuciones accidentales de una accion sensible.

**Independent Test**: Verificar que el detalle muestra tabla de gastos del corte y que al ejecutar corte aparece advertencia previa obligatoria.

**Acceptance Scenarios**:

1. **Given** que existe un corte, **When** se abre su detalle, **Then** se muestra tabla de gastos incluidos en el corte.
2. **Given** que el usuario intenta ejecutar un corte, **When** presiona el boton de ejecutar, **Then** el sistema muestra advertencia de confirmacion antes de continuar.
3. **Given** que el usuario cancela la advertencia, **When** cierra el cuadro de confirmacion, **Then** el corte no se ejecuta.

---

### Edge Cases

- Que ocurre si un corte no tiene gastos y se debe mostrar tabla vacia de gastos.
- Que ocurre si el usuario accede con URL invalida a un corte no encontrado; el sistema debe tratarlo como referencia invalida, ya que los cortes no se borran.
- Que ocurre si el usuario confirma advertencia pero la ejecucion falla por regla de corte duplicado.
- Que ocurre si hay montos negativos o cero en gastos por correcciones historicas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST calcular neto real del corte como ganancia de la tienda menos gastos del corte.
- **FR-002**: El sistema MUST excluir ganancias de mayorista del calculo de neto real.
- **FR-003**: El sistema MUST eliminar el campo visual separado de capital invertido cuando represente el mismo valor que capital.
- **FR-004**: El sistema MUST mantener el campo capital como indicador unico en resumen financiero.
- **FR-005**: El sistema MUST mostrar una vista principal de cortes con listado de todos los cortes.
- **FR-006**: El sistema MUST permitir navegar desde la accion Ver del listado a una vista dedicada de detalle de corte.
- **FR-007**: El sistema MUST mostrar en la vista de detalle toda la informacion del corte (resumen, desempeno por mayorista, detalle de ventas y ventas deshabilitadas).
- **FR-008**: El sistema MUST agregar una tabla de gastos del corte en la vista de detalle.
- **FR-009**: El sistema MUST mostrar advertencia de confirmacion antes de ejecutar un nuevo corte mensual.
- **FR-010**: El sistema MUST cancelar la ejecucion del corte cuando el usuario rechaza la advertencia.
- **FR-011**: El sistema MUST conservar los cortes mensuales como historial y no permitir su eliminacion desde los flujos funcionales del sistema.
- **FR-012**: El sistema MUST exponer la accion de ejecutar corte unicamente en la vista principal de listado de cortes.
- **FR-013**: El sistema MUST mostrar en la tabla de gastos del detalle las columnas fecha, concepto y monto por cada gasto incluido en el corte.
- **FR-014**: El sistema MUST mostrar el listado de cortes ordenado por fecha de corte descendente (mas reciente primero).

### Key Entities *(include if feature involves data)*

- **Resumen financiero de corte refinado**: Vista de indicadores globales con neto real corregido y capital unificado.
- **Listado de cortes mensuales**: Vista principal con filas de cortes y accion de navegacion a detalle.
- **Detalle de corte mensual**: Vista dedicada con tablas y metricas completas de un corte especifico.
- **Gasto del corte**: Registro de gasto incluido en el corte mostrado en tabla de gastos.
- **Advertencia de ejecucion de corte**: Confirmacion previa obligatoria para una accion de cierre mensual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En validacion funcional, el 100% de netos reales mostrados coincide con la formula ganancia tienda menos gastos.
- **SC-002**: En validacion visual, el 100% de pantallas de resumen financiero muestra capital sin duplicar capital invertido.
- **SC-003**: En pruebas de navegacion, el 100% de acciones Ver desde listado abre correctamente la vista de detalle correspondiente.
- **SC-004**: En pruebas de seguridad operativa, el 100% de ejecuciones de corte requiere confirmacion previa y no se ejecuta al cancelar.

## Assumptions

- La ejecucion de corte mensual sigue restringida a usuarios administradores.
- Las reglas de cierre, snapshot y unicidad de corte ya existentes se mantienen.
- La tabla de gastos del corte usa los registros ya marcados como cerrados por el corte.
- La nueva separacion de vistas (listado y detalle) no altera los permisos actuales de acceso.
- Los cortes mensuales se conservan como registros historicos y no forman parte de operaciones de borrado funcional.
