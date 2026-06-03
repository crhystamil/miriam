# Research - Mejorar tabla de productos y SKU autogenerado

## Decision 1: Mostrar tabla de productos con campos operativos completos
- Decision: Exponer para admin y vendedor las columnas SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa.
- Rationale: Evita navegacion adicional y centraliza consulta operativa en una sola vista.
- Alternatives considered:
  - Mantener columnas minimas actuales: no cubre necesidad de consulta completa.
  - Mover detalles a modal por fila: incrementa friccion en tareas repetitivas.

## Decision 2: Autogenerar SKU en backend al crear producto
- Decision: Generar SKU de forma automatica en el backend durante el alta de producto y asegurar unicidad antes de persistir.
- Rationale: Garantiza consistencia de identificadores y elimina errores de carga manual.
- Alternatives considered:
  - Generar SKU en frontend: vulnerable a colisiones y manipulacion de cliente.
  - Exigir SKU manual: mayor probabilidad de duplicados/inconsistencias.

## Decision 3: Usar imagen representativa unica por fila
- Decision: Renderizar solo la primera imagen ordenada por `position` como imagen representativa; si no hay imagen o falla carga, mostrar fallback visual estable.
- Rationale: Mejora legibilidad de tabla y reutiliza el criterio existente de orden de imagenes.
- Alternatives considered:
  - Mostrar carrusel o multiples miniaturas: ruido visual y mayor costo de render.
  - Mostrar ultima imagen cargada: criterio menos estable para usuario.

## Decision 4: Mantener acciones de gestion solo para administrador
- Decision: Conservar acciones existentes de gestion de producto para admin y ocultarlas para vendedor en la tabla.
- Rationale: Respeta modelo de permisos y evita operaciones sensibles por perfiles de consulta.
- Alternatives considered:
  - Mostrar acciones deshabilitadas a vendedor: agrega ruido y no aporta valor operativo.
  - Compartir mismas acciones entre roles: rompe principio de menor privilegio.
