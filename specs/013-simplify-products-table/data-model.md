# Data Model - Simplificar tabla y filtros de productos

## 1) ProductListRowView (proyeccion de lectura)
- Purpose: Fila visible de la tabla de productos para uso operativo diario.
- Campos visibles esperados:
  - `name`
  - `representative_image_url`
  - `cost_price`
  - `wholesale_reference_price`
  - `public_price`
  - `stock`
  - `is_active`
- Validation rules:
  - No mostrar `sku` ni `description` en la tabla.
  - Mantener acciones operativas existentes sobre la fila.

## 2) ProductFilterPanelState (estado de UI)
- Purpose: Estado de controles de filtrado aplicables al listado.
- Campos relevantes:
  - Filtros de texto/categoria/estado ya existentes en la pantalla (sin cambios semanticos).
  - `low_stock_only` removido del estado activo del formulario.
- Validation rules:
  - La UI no renderiza el control `solo stock bajo`.
  - Filtros restantes continúan funcionando sin degradación.

## 3) LegacyFilterInputCompatibility
- Purpose: Manejo de parametros heredados para preservar estabilidad de enlaces/estado previo.
- Campos relevantes:
  - `low_stock_only` (entrada legacy opcional)
- Validation rules:
  - Si aparece en URL/estado previo, se ignora sin error.
  - No bloquea la carga del listado.

## Relationships
- `ProductFilterPanelState` controla la consulta usada por `ProductListRowView`.
- `LegacyFilterInputCompatibility` se aplica antes de materializar `ProductFilterPanelState`.

## State Transitions
- Carga inicial de pagina -> normalizacion de filtros -> consulta de listado -> render de tabla simplificada.
- Cuando existe `low_stock_only` legacy, transición: entrada legacy -> descarte silencioso -> flujo normal.
