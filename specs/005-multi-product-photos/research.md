# Research - Carga de multiples fotos por producto

## Decision 1: Habilitar carga multiple por lote
- Decision: El modal de nuevo producto acepta multiples archivos de imagen en una sola accion.
- Rationale: Cumple la necesidad de negocio de registrar varias vistas del producto sin pasos repetitivos.
- Alternatives considered:
  - Mantener una sola imagen: no cumple requerimiento actual.
  - Carga secuencial una por una: mayor friccion operativa.

## Decision 2: Limite de 1 a 5 fotos por producto
- Decision: Cada alta de producto admite entre 1 y 5 fotos.
- Rationale: La aclaracion de negocio fija un maximo de 5 y conserva flexibilidad operativa.
- Alternatives considered:
  - Sin limite explicito: mayor riesgo de cargas pesadas y UX degradada.
  - Limite menor (1-3): reduce cobertura visual para catalogacion.

## Decision 3: Validacion archivo por archivo y rechazo atomico del lote
- Decision: Validar cada archivo por tipo/tamano y rechazar toda la operacion si cualquier archivo falla.
- Rationale: Evita estados parciales y mantiene integridad del alta.
- Alternatives considered:
  - Aceptar parciales: genera inconsistencias y confusion de usuario.
  - Validar solo frontend: no asegura integridad del backend.

## Decision 4: Modelo de fotos 1:N respecto a producto
- Decision: Representar fotos en entidad relacionada para soportar galeria por producto.
- Rationale: Escalable para listar, ordenar y editar fotos en futuras iteraciones.
- Alternatives considered:
  - Guardar una sola referencia compuesta: baja mantenibilidad.
  - Base64 en BD: costos de almacenamiento/consulta elevados.

## Decision 5: Visualizacion de galeria en gestion de productos
- Decision: Mostrar miniaturas asociadas en la gestion para confirmar rapidamente el conjunto cargado.
- Rationale: Reduce errores de catalogacion y mejora control post-alta.
- Alternatives considered:
  - Mostrar solo contador de fotos: menor valor para verificacion visual.
