# Research - Corregir imagenes en registrar venta

## Decision 1: Usar imagen de producto desde datos reales del catalogo
- Decision: El modal de registrar venta mostrara imagenes obtenidas del producto seleccionado en lugar de imagenes estaticas locales.
- Rationale: El requerimiento principal es eliminar discrepancias visuales y usar la fuente de verdad del catalogo.
- Alternatives considered:
  - Mantener imagenes estaticas por SKU: no representa cambios reales del catalogo.
  - Mezcla estatica + dinamica: incrementa complejidad y riesgo de inconsistencias.

## Decision 2: Seleccionar la primera foto ordenada por posicion
- Decision: Cuando existan multiples fotos, se mostrara siempre la primera segun `position`.
- Rationale: Regla deterministica que facilita validacion funcional y evita cambios visuales inesperados.
- Alternatives considered:
  - Mostrar foto aleatoria: comportamiento inconsistente.
  - Mostrar la mas reciente: no garantiza representatividad operativa.
  - Mini-galeria en modal de venta: fuera del alcance minimo de correccion.

## Decision 3: Fallback no bloqueante en ausencia o error de imagen
- Decision: Si no hay fotos o falla carga, se muestra placeholder/mensaje claro sin bloquear registro de venta.
- Rationale: Preserva continuidad operativa y cumple requerimiento de no interrumpir el flujo comercial.
- Alternatives considered:
  - Bloquear venta sin imagen: afecta operacion innecesariamente.
  - Ocultar seccion visual sin mensaje: genera confusion del usuario.

## Decision 4: Mantener cambios acotados al flujo de venta
- Decision: Se limita implementacion al consumo/renderizado en modal de venta y ajustes minimos de tipos de datos en frontend.
- Rationale: Reduce riesgo de regresiones en otros modulos y acelera entrega de la correccion puntual.
- Alternatives considered:
  - Redisenar todo el flujo visual de productos/ventas: sobre-alcance para incidencia reportada.
