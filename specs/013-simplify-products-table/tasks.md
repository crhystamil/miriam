# Tasks: Simplificar tabla y filtros de productos

**Input**: Design documents from `/specs/013-simplify-products-table/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Se incluyen tareas de validacion tecnica y de regresion funcional porque la especificacion define criterios medibles y escenarios de compatibilidad.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear artefactos de feature y checklist de verificacion antes de tocar codigo.

- [X] T001 Validar alcance final y supuestos en `specs/013-simplify-products-table/spec.md`
- [X] T002 Alinear reglas de contrato funcional en `specs/013-simplify-products-table/contracts/products-list-view-contract.md`
- [X] T003 [P] Revisar flujo de validacion manual en `specs/013-simplify-products-table/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar base de tipos/consulta para que ambas historias se implementen sin conflictos.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Identificar columnas actuales y estado de filtros en `frontend/src/pages/ProductsPage.tsx`
- [X] T005 [P] Revisar contrato de consulta de productos para filtros soportados en `frontend/src/api/products.ts`
- [X] T006 [P] Ajustar normalizacion de query para ignorar `low_stock_only` legado en `frontend/src/api/products.ts`

**Checkpoint**: Base de consulta y alcance de UI confirmados; historias pueden ejecutarse.

---

## Phase 3: User Story 1 - Limpiar columnas visibles en productos (Priority: P1) 🎯 MVP

**Goal**: Remover SKU y descripcion del listado para simplificar la tabla de productos.

**Independent Test**: Abrir la pagina de productos y confirmar que encabezados y celdas ya no incluyen SKU ni descripcion.

### Implementation for User Story 1

- [X] T007 [US1] Remover columna SKU del encabezado y filas en `frontend/src/pages/ProductsPage.tsx`
- [X] T008 [US1] Remover columna descripcion del encabezado y filas en `frontend/src/pages/ProductsPage.tsx`
- [X] T009 [P] [US1] Ajustar anchos/orden visual de columnas remanentes en `frontend/src/pages/ProductsPage.tsx`
- [X] T010 [US1] Verificar que acciones por producto se mantienen funcionales tras simplificacion en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US1 funcional e independientemente verificable.

---

## Phase 4: User Story 2 - Simplificar filtros de productos (Priority: P1)

**Goal**: Quitar checkbox de "solo stock bajo" y mantener operativos los filtros restantes.

**Independent Test**: Revisar panel de filtros, confirmar ausencia del checkbox y validar que busqueda con filtros restantes funciona.

### Implementation for User Story 2

- [X] T011 [US2] Eliminar control visual de checkbox "solo stock bajo" en `frontend/src/pages/ProductsPage.tsx`
- [X] T012 [US2] Eliminar estado local asociado a "solo stock bajo" en `frontend/src/pages/ProductsPage.tsx`
- [X] T013 [US2] Ajustar envio de filtros para no depender de `low_stock_only` en `frontend/src/pages/ProductsPage.tsx`
- [X] T014 [P] [US2] Ignorar parametro `low_stock_only` en normalizacion de consulta en `frontend/src/api/products.ts`
- [X] T015 [US2] Validar que filtros restantes preservan comportamiento previo en `frontend/src/pages/ProductsPage.tsx`
- [X] T016 [US2] Validar carga estable con estado/URL legado que contenga `low_stock_only` en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US1 y US2 operan sin dependencia del filtro removido.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar validaciones funcionales y tecnicas de la feature.

- [X] T017 [P] Actualizar pasos finales de QA en `specs/013-simplify-products-table/quickstart.md`
- [X] T018 Ejecutar build frontend para validar compilacion en `frontend/`
- [X] T019 Ejecutar chequeo Django para validar entorno backend en `backend/`
- [X] T020 Ejecutar suite de tests backend para detectar regresiones en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias externas.
- **Foundational (Phase 2)**: Depende de Setup y bloquea historias.
- **US1 y US2 (Phases 3-4)**: Inician despues de Foundational.
- **Polish (Phase 5)**: Requiere historias completadas.

### User Story Dependencies

- **US1 (P1)**: Puede entregarse como MVP despues de Foundational.
- **US2 (P1)**: Requiere base de filtros de Foundational; es independiente de cambios visuales de US1 salvo coexistencia en el mismo archivo.

### Parallel Opportunities

- Setup: T003 en paralelo con T001/T002.
- Foundational: T005 y T006 en paralelo tras T004.
- US1: T009 en paralelo con ajustes funcionales principales una vez removidas columnas.
- US2: T014 en paralelo con T011-T013.
- Polish: T018, T019 y T020 pueden ejecutarse en paralelo por area.

---

## Parallel Example: User Story 2

```bash
# Trabajos paralelos para US2
Task: "Ignorar parametro low_stock_only en frontend/src/api/products.ts"
Task: "Eliminar control visual de solo stock bajo en frontend/src/pages/ProductsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar US1 (Phase 3).
3. Validar simplificacion visual de tabla.
4. Entregar MVP de lectura simplificada.

### Incremental Delivery

1. Setup + Foundational.
2. US1 (columnas).
3. US2 (filtros y compatibilidad legacy).
4. Polish con validaciones tecnicas.

### Parallel Team Strategy

1. Persona A: cambios de tabla en `frontend/src/pages/ProductsPage.tsx`.
2. Persona B: compatibilidad de filtros en `frontend/src/api/products.ts`.
3. Cierre conjunto con validaciones de build/check/test.

---

## Notes

- Todas las tareas cumplen formato checklist con ID secuencial y ruta de archivo.
- Tareas [P] marcadas solo cuando no requieren el mismo punto de edicion bloqueante.
- Cada historia queda comprobable con su criterio independiente definido en la spec.
