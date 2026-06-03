# Research - Corte mensual con resumen y reinicio operativo

## Decision 1: Cierre por marcado, no eliminacion fisica
- Decision: Al ejecutar corte, ventas y gastos del periodo se marcan como cerrados por corte y se ocultan del historial operativo activo.
- Rationale: Preserva trazabilidad historica y evita perdida irreversible de informacion.
- Alternatives considered:
  - Eliminacion fisica: alto riesgo operativo y baja auditabilidad.
  - Exportar y borrar: complejidad extra para consistencia y recuperacion.

## Decision 2: Unicidad de corte por periodo/fecha
- Decision: No se permite mas de un corte para el mismo periodo/fecha de cierre.
- Rationale: Evita duplicidad de consolidaciones y discrepancias contables.
- Alternatives considered:
  - Multiples cortes independientes: riesgo de doble contabilizacion.
  - Reintentos sin regla de unicidad: historiales ambiguos.

## Decision 3: Snapshot al inicio del corte
- Decision: El corte toma snapshot de registros elegibles al iniciar; registros creados durante ejecucion quedan fuera.
- Rationale: Garantiza consistencia transaccional del conjunto procesado.
- Alternatives considered:
  - Incluir registros concurrentes: resultados no deterministas.
  - Bloqueo total de operacion: impacto alto en continuidad de negocio.

## Decision 4: Totales globales basados solo en ventas habilitadas
- Decision: Los indicadores globales del corte se calculan solo con ventas habilitadas; ventas deshabilitadas se muestran en tabla separada informativa.
- Rationale: Alinea calculo principal con regla operativa de ventas validas.
- Alternatives considered:
  - Mezclar habilitadas y deshabilitadas: distorsiona rentabilidad real.
  - Dos totales oficiales: mayor complejidad interpretativa para usuarios.

## Decision 5: Orden de detalle por mayorista
- Decision: El detalle de ventas habilitadas se ordena por mayorista como orden canonico de lectura.
- Rationale: Facilita auditoria comercial solicitada y comparabilidad entre filas.
- Alternatives considered:
  - Orden por fecha: dificulta lectura agrupada por cliente.
  - Orden configurable inicial: mayor alcance que el requerido.
