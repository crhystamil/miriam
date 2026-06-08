# Tasks: Busqueda de productos en modal de compras

**Input**: Design documents from `/specs/025-purchase-product-search/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No solicitados en la especificacion. Solo verificacion manual + gate de build.

**Organization**: Tasks grouped by user story. Single file change (`PurchasesPage.tsx`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No se requiere setup nuevo. El proyecto ya tiene todas las dependencias necesarias.

> Sin tareas de setup. El endpoint de busqueda ya existe en el backend y el tipo `ProductFilters` ya incluye `search`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura base que debe estar lista antes de las user stories.

> Sin tareas foundacionales. La infraestructura existente (API, tipos, componentes) es suficiente. Todo el trabajo es dentro de `PurchasesPage.tsx`.

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Search product when creating a purchase (Priority: P1) MVP

**Goal**: Permitir al usuario buscar productos por nombre o SKU en todo el catalogo desde el modal de nueva compra

**Independent Test**: Abrir el modal de nueva compra, escribir un termino de busqueda, verificar que la lista se actualiza con resultados del servidor, seleccionar un producto y completar una compra

### Implementation for User Story 1

- [x] T001 [US1] Anadir estados `productQuery` y `productSearch` en `frontend/src/pages/PurchasesPage.tsx` (nuevos `useState<string>("")` para cada uno)
- [x] T002 [US1] Anadir efecto de debounce en `frontend/src/pages/PurchasesPage.tsx`: `useEffect` con `setTimeout`/`clearTimeout` de 300ms que copia `productQuery` a `productSearch`, y limpieza del timer en el retorno
- [x] T003 [US1] Modificar efecto existente `loadProducts` en `frontend/src/pages/PurchasesPage.tsx` para que use `getProducts({ page: 1, search: productSearch || undefined })` y se re-ejecute cuando cambie `productSearch`
- [x] T004 [US1] Anadir efecto que auto-seleccione el primer producto si el producto seleccionado ya no esta en los resultados de busqueda en `frontend/src/pages/PurchasesPage.tsx` (similar a `SalesPage.tsx:107-115`)
- [x] T005 [US1] Anadir campo de input "Buscar producto" antes del `<select>` de productos en el modal en `frontend/src/pages/PurchasesPage.tsx`, con `value={productQuery}`, `onChange` que actualice `productQuery`, `placeholder="Buscar por SKU o nombre"`, y `aria-label="Buscar producto"`
- [x] T006 [US1] Anadir mensaje "No se encontraron productos." cuando `products.length === 0` y `productQuery` no esta vacio en `frontend/src/pages/PurchasesPage.tsx`
- [x] T007 [US1] Resetear `productQuery` en `resetPurchaseDraft` y en `closePurchaseModal` en `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: User Story 1 completa — el usuario puede buscar, ver resultados, seleccionar un producto y registrar una compra

---

## Phase 4: User Story 2 - Clear search and return to initial list (Priority: P2)

**Goal**: Permitir al usuario volver a la lista inicial de 10 productos al borrar el campo de busqueda, manteniendo la seleccion

**Independent Test**: Realizar una busqueda, borrar el campo, verificar que vuelve a la lista inicial y el producto seleccionado se mantiene

### Implementation for User Story 2

- [x] T008 [US2] Verificar que al borrar `productQuery` (queda vacio), el debounce establece `productSearch` a `""`, lo que causa que el efecto de carga llame `getProducts({ page: 1 })` sin search, restaurando los primeros 10 productos en `frontend/src/pages/PurchasesPage.tsx`
- [x] T009 [US2] Verificar que el efecto de auto-seleccion (T004) preserva el producto seleccionado cuando sigue existiendo en la lista restaurada en `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: User Story 2 completa — borrar busqueda restaura lista inicial y mantiene seleccion

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validacion final y gate de build

- [x] T010 Ejecutar `npm run build` en `frontend/` para verificar que no hay errores de TypeScript ni de build
- [ ] T011 Validar quickstart.md: abrir modal, buscar producto fuera de los primeros 10, seleccionarlo, registrar compra, borrar busqueda, verificar lista inicial

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin tareas
- **Foundational (Phase 2)**: Sin tareas
- **User Story 1 (Phase 3)**: T001-T007, secuenciales dentro del mismo archivo
- **User Story 2 (Phase 4)**: Depende de US1 (verifica comportamiento del codigo implementado en US1)
- **Polish (Phase 5)**: Depende de US1 y US2 completados

### Within Each User Story

- T001 (estados) → T002 (debounce) → T003 (carga con search) → T004 (auto-seleccion)
- T005 (input UI) puede hacerse junto con T001-T004
- T006 (mensaje vacio) depende de T005 (input visible)
- T007 (reset) depende de T001 (estados creados)

### User Story Dependencies

- **US1 (P1)**: Independiente — puede implementarse solo
- **US2 (P2)**: Depende de US1 — verifica comportamiento del mecanismo de US1

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Implementar T001-T007 (US1)
2. **STOP and VALIDATE**: Buscar un producto, seleccionarlo, registrar compra
3. Deploy si esta listo

### Incremental Delivery

1. Completar US1 → Test → MVP listo
2. Completar US2 → Test → Comportamiento completo de clear
3. Polish → Build gate → Listo para produccion

---

## Notes

- Todas las tareas tocan un solo archivo: `frontend/src/pages/PurchasesPage.tsx`
- No se agregan dependencias nuevas
- No se modifica el backend
- No se modifica CSS (se reutilizan clases existentes del proyecto)
- T008 y T009 son tareas de verificacion (el comportamiento ya esta cubierto por T001-T007, pero se validan explicitamente)
- Patron de referencia: `SalesPage.tsx` para busqueda client-side (adaptado a server-side) y `ProductsPage.tsx` para separacion de estados
