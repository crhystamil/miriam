# Feature Specification: Corte mensual con resumen y reinicio operativo

**Feature Branch**: `[011-monthly-cut-report]`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "ahora vamos a realizar el corte mensual, donde realizamos un corte de todas las ventas realizadas hasta el dia que se hace el corte, el historial de ventas queda vacia, se hace el corte de los gastos, se crea una nueva vista donde se podra ver ingresos totales, capital invertido, las ganancias para la tienda, ganancias por vendedor, capital, gastos, neto real. una tabla del desempeno por mayorista donde tendremos el nombre del mayorista, el numero de ventas, los ingresos, el capital, ganancias para la tienda, ganancias del mayorista. y debajo otra tabla donde se vera el detalle de ventas que se tendra una tabla con la fecha, mayorista, producto, cantidad, costo, precio mayorista, precio vendido, ganancia tienda, ganancia vendedor y venta total. debe estar ordenado por mayorista. agreguemos solo las ventas habilitadas y las ventas deshabilitadas pueden estar agregadas en otra tabla."

## Clarifications

### Session 2026-05-13

- Q: Como se debe "vaciar" el historial operativo al ejecutar el corte? → A: Marcar ventas/gastos del periodo como cerrados por corte y ocultarlos del historial operativo activo.
- Q: Se permiten multiples cortes para el mismo periodo/fecha de cierre? → A: No, solo se permite un corte por periodo/fecha de cierre.
- Q: Como manejar registros nuevos creados mientras el corte esta en ejecucion? → A: Usar snapshot al iniciar el corte; lo nuevo durante ejecucion queda fuera.
- Q: Los totales globales del corte incluyen ventas deshabilitadas? → A: No, los totales globales usan solo ventas habilitadas; deshabilitadas van en tabla separada informativa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ejecutar corte mensual operativo (Priority: P1)

Como administrador, quiero ejecutar un corte mensual hasta una fecha determinada para cerrar el periodo y reiniciar los historiales operativos de ventas y gastos.

**Why this priority**: Sin el corte no existe cierre contable del periodo ni limpieza operativa para el siguiente ciclo mensual.

**Independent Test**: Ejecutar corte con fecha objetivo y verificar que solo se incluyen registros hasta esa fecha y que los historiales operativos quedan vacios luego del cierre.

**Acceptance Scenarios**:

1. **Given** que existen ventas y gastos registrados, **When** el administrador ejecuta el corte mensual con fecha limite, **Then** el sistema consolida los datos del periodo hasta esa fecha.
2. **Given** que el corte finaliza correctamente, **When** se revisan los historiales operativos, **Then** ventas y gastos del periodo cerrado quedan marcados como cerrados por corte y no aparecen en el historial activo.
3. **Given** que hay registros posteriores a la fecha de corte, **When** se ejecuta el cierre, **Then** esos registros posteriores quedan fuera del corte y permanecen para el siguiente periodo.

---

### User Story 2 - Ver resumen financiero del corte mensual (Priority: P1)

Como administrador, quiero una nueva vista del corte mensual para ver los indicadores globales del periodo y evaluar resultados reales del negocio.

**Why this priority**: El valor principal del corte es convertir datos operativos en una lectura financiera clara y util para decisiones.

**Independent Test**: Abrir la vista de corte y verificar que muestra ingresos totales, capital invertido, ganancias tienda, ganancias vendedor, capital, gastos y neto real del periodo.

**Acceptance Scenarios**:

1. **Given** que existe un corte mensual ejecutado, **When** el usuario abre la vista de corte, **Then** ve todos los indicadores financieros requeridos del periodo.
2. **Given** que no existe corte para un periodo consultado, **When** el usuario abre la vista, **Then** recibe un estado claro sin datos, sin romper la pantalla.

---

### User Story 3 - Analizar desempeno por mayorista y detalle de ventas (Priority: P2)

Como administrador, quiero ver tablas por mayorista y detalle de ventas ordenadas por mayorista para auditar desempeno comercial del periodo.

**Why this priority**: El resumen global no basta para entender variaciones por cliente mayorista ni validar cada venta del corte.

**Independent Test**: Revisar la vista y validar tabla de desempeno por mayorista, tabla de detalle de ventas habilitadas ordenada por mayorista y tabla separada para ventas deshabilitadas.

**Acceptance Scenarios**:

1. **Given** que hay ventas habilitadas en el periodo, **When** se muestra la tabla de desempeno por mayorista, **Then** cada fila incluye nombre, numero de ventas, ingresos, capital, ganancias tienda y ganancias mayorista.
2. **Given** que hay ventas habilitadas, **When** se muestra el detalle de ventas, **Then** la tabla incluye fecha, mayorista, producto, cantidad, costo, precio mayorista, precio vendido, ganancia tienda, ganancia vendedor y venta total, ordenada por mayorista.
3. **Given** que hay ventas deshabilitadas, **When** se consulta la vista de corte, **Then** dichas ventas se muestran en una tabla separada del detalle principal.

---

### Edge Cases

- Que ocurre si se intenta ejecutar un corte sin ventas ni gastos en el periodo.
- Que ocurre si se intenta ejecutar dos cortes para el mismo periodo.
- Que ocurre si existen ventas deshabilitadas sin contraparte habilitada en el periodo.
- Que ocurre si durante el corte hay registros concurrentes de nuevas ventas o gastos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir ejecutar un corte mensual hasta una fecha de cierre definida por el administrador.
- **FR-002**: El sistema MUST incluir en el corte solo ventas y gastos con fecha menor o igual a la fecha de cierre.
- **FR-003**: El sistema MUST marcar las ventas del periodo cortado como cerradas por corte y ocultarlas del historial operativo activo despues del cierre.
- **FR-004**: El sistema MUST marcar los gastos del periodo cortado como cerrados por corte y ocultarlos del historial operativo activo despues del cierre.
- **FR-005**: El sistema MUST generar una nueva vista de corte mensual con los indicadores: ingresos totales, capital invertido, ganancias para la tienda, ganancias por vendedor, capital, gastos y neto real.
- **FR-006**: El sistema MUST mostrar una tabla de desempeno por mayorista con: nombre del mayorista, numero de ventas, ingresos, capital, ganancias para la tienda y ganancias del mayorista.
- **FR-007**: El sistema MUST mostrar una tabla de detalle de ventas habilitadas con: fecha, mayorista, producto, cantidad, costo, precio mayorista, precio vendido, ganancia tienda, ganancia vendedor y venta total.
- **FR-008**: El sistema MUST ordenar la tabla de detalle de ventas habilitadas por mayorista.
- **FR-009**: El sistema MUST excluir ventas deshabilitadas de la tabla principal de detalle habilitado.
- **FR-010**: El sistema MUST mostrar las ventas deshabilitadas en una tabla separada dentro de la vista de corte mensual.
- **FR-011**: El sistema MUST mantener trazabilidad del corte mensual para consulta posterior del periodo cerrado.
- **FR-012**: El sistema MUST impedir ejecutar mas de un corte para el mismo periodo/fecha de cierre.
- **FR-013**: El sistema MUST informar con mensaje claro cuando se intente registrar un corte duplicado del mismo periodo/fecha.
- **FR-014**: El sistema MUST tomar un snapshot de registros elegibles al iniciar el corte para fijar el conjunto exacto de ventas y gastos a procesar.
- **FR-015**: El sistema MUST excluir del corte en curso cualquier venta o gasto creado despues del inicio de ejecucion, incluso si cumple la fecha limite.
- **FR-016**: El sistema MUST calcular los indicadores globales del corte mensual usando unicamente ventas habilitadas del periodo.
- **FR-017**: El sistema MUST tratar la tabla de ventas deshabilitadas como informativa separada y sin impacto en los totales globales del corte.

### Key Entities *(include if feature involves data)*

- **Corte mensual**: Cierre de periodo con fecha limite, resultados consolidados y referencia de los registros incluidos.
- **Estado de cierre por corte**: Marca aplicada a ventas y gastos del periodo para excluirlos del historial activo sin eliminarlos.
- **Resumen financiero de corte**: Totales agregados del periodo (ingresos, capital, ganancias, gastos, neto real).
- **Desempeno por mayorista**: Agregado por mayorista con ventas, ingresos, capital y ganancias del periodo.
- **Detalle de venta habilitada**: Registro individual de venta activa incluido en el detalle principal del corte.
- **Detalle de venta deshabilitada**: Registro individual de venta inactiva mostrado en tabla separada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de cortes ejecutados incluye unicamente registros de ventas y gastos hasta la fecha de cierre indicada.
- **SC-002**: En validacion operativa, el 100% de historiales activos de ventas y gastos del periodo cortado queda limpio tras el cierre.
- **SC-005**: En el 100% de cierres exitosos, las ventas y gastos incluidos quedan trazables con estado de cerrado por corte para consulta historica.
- **SC-003**: El 100% de vistas de corte muestra todos los indicadores financieros requeridos sin campos faltantes.
- **SC-004**: En verificacion funcional, el 100% de ventas habilitadas aparece en la tabla principal ordenada por mayorista y el 100% de ventas deshabilitadas aparece en tabla separada.
- **SC-006**: En validacion de reglas, el 100% de intentos de corte duplicado para el mismo periodo/fecha es bloqueado con mensaje explicito.
- **SC-007**: En pruebas de concurrencia, el 100% de registros creados durante la ejecucion del corte queda fuera del resultado de ese corte.
- **SC-008**: En validacion de calculos, el 100% de indicadores globales coincide con agregaciones basadas solo en ventas habilitadas del periodo.

## Assumptions

- El corte mensual es una accion restringida a usuarios administradores.
- Los datos del periodo cerrado se conservan para consulta historica en la nueva vista de corte.
- Los calculos de ganancias de tienda y vendedor usan las mismas reglas de negocio ya vigentes en ventas.
- El reinicio de historiales aplica al conjunto incluido en el corte hasta la fecha seleccionada mediante marcado de cierre y ocultamiento del historial activo, sin eliminar registros posteriores.
- Solo existe un corte valido por periodo/fecha de cierre.
- El corte usa snapshot al inicio y no incorpora registros creados durante su ejecucion.
- Los indicadores globales del corte consideran solo ventas habilitadas; las deshabilitadas se reportan aparte sin afectar totales.
