# Research: Busqueda de productos en modal de compras

**Date**: 2026-06-08 | **Feature**: 025-purchase-product-search

## Decision 1: Patron de busqueda (server-side vs client-side)

**Decision**: Server-side con debounce

**Rationale**: El modal actualmente solo carga 10 productos (pagina 1). La busqueda client-side (como en `SalesPage.tsx`) solo filtraria sobre esos 10 productos, lo cual no resuelve el problema. La busqueda server-side permite acceder a todo el catalogo. El endpoint `GET /api/products/?search=<query>` ya filtra por `name__icontains` y `sku__icontains` (`backend/products/views.py:25-29`).

**Alternatives considered**:
- Busqueda client-side (como `SalesPage.tsx:48-56`): Rechazada porque solo filtra los 10 productos ya cargados, no resuelve el problema principal
- Cargar todos los productos al abrir el modal: Rechazada porque no escala si el catalogo crece (actualmente ya hay mas de 10 productos)
- Paginacion infinita dentro del modal: Rechazada por complejidad innecesaria; la busqueda devuelve pocos resultados y es suficiente

## Decision 2: Implementacion del debounce

**Decision**: `useEffect` con `setTimeout`/`clearTimeout` (300ms), consistente con el patron de `CatalogPage.tsx`

**Rationale**: El proyecto no usa librerias externas para debounce (como lodash). El patron nativo con `setTimeout` + `clearTimeout` en un `useEffect` es simple, sin dependencias, y ya se usa en otras paginas del proyecto.

**Alternatives considered**:
- Libreria `lodash.debounce`: Rechazada para no agregar dependencias
- `useDeferredValue` de React 19: Considerada pero el debounce explicito da mas control sobre el timing y es consistente con el resto del proyecto

## Decision 3: Umbral minimo de caracteres para buscar

**Decision**: No requerir un minimo de caracteres; enviar la busqueda al servidor con cualquier termino

**Rationale**: El endpoint del servidor ya maneja busquedas cortas eficientemente. Anadir un umbral de 2 caracteres agrega complejidad innecesaria y podria frustrar al usuario que busca por SKU corto (ej. "A1"). El debounce de 300ms ya protege contra solicitudes excesivas.

**Alternatives considered**:
- Requerir minimo 2 caracteres: Rechazada porque podria bloquear busquedas validas por SKU corto

## Decision 4: Manejo del estado de busqueda

**Decision**: Dos estados: `productQuery` (texto del input) y `productSearch` (termino enviado al servidor). Efecto de debounce conecta ambos.

**Rationale**: Separar el input del termino de busqueda permite un UX fluido: el usuario escribe sin interrupciones mientras el debounce controla cuando se envia la peticion. Cuando `productSearch` esta vacio, se mantiene la lista inicial de 10 productos. Este patron ya existe en `ProductsPage.tsx` (lineas 16/18).

**Alternatives considered**:
- Estado unico con busqueda en cada keystroke: Rechazada por exceso de peticiones al servidor
- Estado unico con debounce en el handler del onChange: Funciona pero es menos legible que separar estados

## Decision 5: Preservar seleccion del producto al buscar

**Decision**: Si el usuario ya selecciono un producto y luego busca, mantener la seleccion a menos que el producto seleccionado ya no este en los resultados filtrados (en cuyo caso seleccionar el primer resultado)

**Rationale**: Consistente con el comportamiento existente en `SalesPage.tsx:107-115` donde se auto-selecciona el primer producto si la seleccion actual ya no existe en los resultados filtrados.

**Alternatives considered**:
- Resetear siempre la seleccion al buscar: Rechazada porque frustra al usuario que ya habia elegido un producto
