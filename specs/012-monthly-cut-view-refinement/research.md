# Research - Refinar vista y calculos de corte mensual

## Decision 1: Formula oficial de neto real
- Decision: `neto real = ganancia tienda - gastos`.
- Rationale: La ganancia de mayorista corresponde a pago a terceros y no representa liquidez utilizable de la tienda.
- Alternatives considered:
  - `ganancia tienda + ganancia mayorista - gastos`: sobreestima utilidad disponible.
  - Mantener formula previa por compatibilidad visual: contradice regla de negocio aclarada.

## Decision 2: Historial de cortes inmutable
- Decision: Los cortes mensuales se conservan historicamente y no se exponen flujos de eliminacion.
- Rationale: Es un artefacto contable de cierre y su permanencia garantiza trazabilidad de auditoria.
- Alternatives considered:
  - Permitir borrado logico desde UI: incrementa riesgo operativo y rompe continuidad historica.
  - Permitir borrado hard-delete: incompatible con necesidad de auditoria.

## Decision 3: Separacion de navegacion listado/detalle
- Decision: Vista principal para listado de cortes y vista dedicada para detalle por corte.
- Rationale: Reduce sobrecarga de informacion y hace mas claro el flujo de consulta historica.
- Alternatives considered:
  - Mantener listado y detalle en la misma pantalla: mayor complejidad visual.
  - Modal de detalle en listado: limita legibilidad de tablas amplias.

## Decision 4: Punto unico de ejecucion de corte
- Decision: La accion "Ejecutar corte" existe solo en la vista principal de listado, con confirmacion obligatoria.
- Rationale: Evita duplicidad de puntos sensibles y simplifica validacion operativa.
- Alternatives considered:
  - Ejecutar desde detalle: requiere cargar un corte previo para iniciar nueva ejecucion.
  - Ejecutar desde ambas vistas: duplica rutas de error y criterios de prueba.

## Decision 5: Contrato minimo de tabla de gastos
- Decision: La tabla de gastos del detalle debe incluir columnas `fecha`, `concepto`, `monto`.
- Rationale: Cubre trazabilidad minima para reconciliar el neto real sin sobrecargar la interfaz.
- Alternatives considered:
  - Solo concepto y monto: pierde contexto temporal.
  - Agregar muchas columnas no solicitadas: amplifica alcance sin beneficio validado.

## Decision 6: Orden del listado de cortes
- Decision: Orden descendente por fecha de corte (mas reciente primero).
- Rationale: Prioriza consultas operativas recientes y acelera acceso al ultimo cierre.
- Alternatives considered:
  - Orden ascendente: obliga mayor desplazamiento para casos frecuentes.
  - Orden indefinido por backend: resultados inconsistentes entre sesiones.
