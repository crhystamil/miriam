# Tasks: Corregir imagenes en registrar venta

**Input**: Design documents from `/specs/006-fix-sales-images/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio; se incluyen validaciones funcionales y tecnicas del flujo.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear contrato de imagen en ventas y tipos frontend para consumir fotos reales de producto.

- [X] T001 Revisar alineacion entre `specs/006-fix-sales-images/spec.md` y `specs/006-fix-sales-images/contracts/sales-product-image-contract.md`
- [X] T002 [P] Confirmar estructura de datos de producto con `images[]` en `frontend/src/api/types.ts`
- [X] T003 [P] Identificar y documentar uso actual de imagenes estaticas en `frontend/src/pages/SalesPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar fuentes de datos y utilidades base para resolver imagen representativa en modal de venta.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Asegurar que consulta de productos usada por ventas expone `images` ordenadas en `frontend/src/api/products.ts`
- [X] T005 Crear helper de seleccion de imagen representativa (primera por `position`) en `frontend/src/pages/SalesPage.tsx`
- [X] T006 [P] Definir recurso visual fallback reutilizable para ventas en `frontend/src/pages/SalesPage.tsx`
- [X] T007 [P] Agregar estilos base para bloque de imagen de producto y fallback en `frontend/src/styles.css`

**Checkpoint**: Fuente dinamica y regla de seleccion de imagen disponibles para historias.

---

## Phase 3: User Story 1 - Mostrar imagen real del producto (Priority: P1) 🎯 MVP

**Goal**: Mostrar en registrar venta la imagen real del producto seleccionado y eliminar imagenes estaticas.

**Independent Test**: Seleccionar productos con fotos en registrar venta y verificar que el modal muestra imagen real correspondiente al producto activo.

### Implementation for User Story 1

- [X] T008 [US1] Reemplazar mapeo estatico por uso de fotos del producto seleccionado en `frontend/src/pages/SalesPage.tsx`
- [X] T009 [US1] Aplicar regla de imagen representativa (primera por posicion) al render del modal en `frontend/src/pages/SalesPage.tsx`
- [X] T010 [US1] Actualizar la imagen al cambiar producto en selector de venta en `frontend/src/pages/SalesPage.tsx`
- [X] T011 [US1] Eliminar referencias obsoletas de imagenes estaticas en `frontend/src/pages/SalesPage.tsx`
- [X] T012 [US1] Verificar consistencia de tipado al consumir `images[]` en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Fallback claro cuando no hay fotos (Priority: P2)

**Goal**: Mostrar estado visual fallback claro cuando no exista imagen o falle su carga, sin bloquear registro de venta.

**Independent Test**: Seleccionar producto sin fotos y confirmar fallback; simular error de carga y confirmar continuidad del formulario.

### Implementation for User Story 2

- [X] T013 [US2] Implementar estado `sin_imagen` para productos sin fotos en `frontend/src/pages/SalesPage.tsx`
- [X] T014 [US2] Implementar estado `error_imagen` mediante manejo de fallo de carga (`onError`) en `frontend/src/pages/SalesPage.tsx`
- [X] T015 [US2] Garantizar que fallback no bloquea acciones del formulario de venta en `frontend/src/pages/SalesPage.tsx`
- [X] T016 [US2] Ajustar copy visual de fallback para ausencia/error de imagen en `frontend/src/pages/SalesPage.tsx`
- [X] T017 [US2] Ajustar estilos de fallback y legibilidad responsive en `frontend/src/styles.css`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Consistencia visual entre catalogo y ventas (Priority: P3)

**Goal**: Mantener correspondencia entre fotos vigentes del catalogo y la imagen mostrada en registrar venta.

**Independent Test**: Cambiar fotos de un producto en gestion, abrir registrar venta y verificar que el modal refleja la imagen vigente correcta.

### Implementation for User Story 3

- [X] T018 [US3] Confirmar que ventas reutiliza la misma fuente de datos de productos usada en gestion en `frontend/src/api/products.ts`
- [X] T019 [US3] Normalizar seleccion de imagen para evitar desfasajes entre cambios rapidos de producto en `frontend/src/pages/SalesPage.tsx`
- [X] T020 [US3] Ajustar render de imagen para evitar mostrar imagen previa al cambiar producto en `frontend/src/pages/SalesPage.tsx`
- [X] T021 [US3] Actualizar documentacion de contrato visual en `specs/006-fix-sales-images/contracts/sales-product-image-contract.md`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia documental y validaciones finales.

- [X] T022 [P] Actualizar escenario de validacion final en `specs/006-fix-sales-images/quickstart.md`
- [X] T023 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T024 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T025 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T026 Validar flujo end-to-end del modal segun `specs/006-fix-sales-images/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de US1 para contar con fuente de imagen dinamica operativa.
- US3 depende de US1-US2 para asegurar consistencia y fallback estables.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P2)**: Requiere render dinamico de imagen de US1.
- **US3 (P3)**: Requiere US1-US2 para validar coherencia entre modulos.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 y T007.
- Phase 6: T022 y T024.

---

## Parallel Example: User Story 2

```bash
Task: "T014 [US2] Implementar estado error_imagen con onError en frontend/src/pages/SalesPage.tsx"
Task: "T017 [US2] Ajustar estilos de fallback en frontend/src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (imagen real por producto, sin estaticas).
3. Validar de forma independiente.

### Incremental Delivery

1. US1: Imagen real y regla primera foto por `position`.
2. US2: Fallback claro sin bloqueo.
3. US3: Consistencia catalogo-ventas bajo cambios de seleccion.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
