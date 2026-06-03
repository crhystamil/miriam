# Research - Registro de gastos en modal y simplificacion de vista

## Decision 1: Reemplazar formulario inline por modal accionado por boton
- Decision: Mostrar un boton "Nuevo gasto" en la vista de gastos y abrir formulario en modal sobre la tabla.
- Rationale: Reduce ruido visual permanente y prioriza lectura de tabla sin perder rapidez de alta.
- Alternatives considered:
  - Mantener formulario inline: ocupa espacio continuo y compite visualmente con la tabla.
  - Navegar a pantalla separada: agrega friccion para una accion frecuente.

## Decision 2: Mantener campos requeridos existentes con notas opcionales
- Decision: Conservar `scope`, `concept` y `amount` como requeridos; `notes` opcional.
- Rationale: Alinea con reglas de negocio actuales y evita cambios innecesarios en backend.
- Alternatives considered:
  - Reducir campos solo a concepto+monto: pierde clasificacion operativa por ambito.
  - Forzar notas obligatorias: agrega friccion sin valor universal.

## Decision 3: Fecha/hora automatica en registro
- Decision: No solicitar fecha manual en modal; usar asignacion automatica al guardar.
- Rationale: Fue aclarado explicitamente en etapa de clarificacion y mantiene consistencia de captura.
- Alternatives considered:
  - Fecha obligatoria manual: mayor carga operativa y riesgo de error humano.
  - Fecha opcional editable: agrega complejidad sin necesidad actual.

## Decision 4: Eliminar bloque de filtros superior y conservar paginacion
- Decision: Retirar filtros de fecha/ambito encima de tabla y mantener listado paginado funcional.
- Rationale: Cumple objetivo de simplificacion visual de la vista sin romper consulta base.
- Alternatives considered:
  - Ocultar filtros tras acordeon: mantiene complejidad de estado y controles.
  - Mantener filtros para admin solamente: inconsistencia de UX entre roles sin requerimiento.
