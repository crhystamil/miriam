# Tasks: Perfil de mayorista en ventas

**Input**: Design documents from `/specs/002-wholesaler-sales-profile/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito enfoque TDD obligatorio en la especificacion; se incluyen validaciones tecnicas y funcionales.

**Organization**: Tareas agrupadas por historia de usuario para implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar contratos, tipos y estructura base para soportar mayorista en ventas.

- [X] T001 Revisar alineacion entre `specs/002-wholesaler-sales-profile/spec.md` y `specs/002-wholesaler-sales-profile/contracts/wholesaler-sales-contract.md`
- [X] T002 [P] Extender tipos de frontend para mayorista y venta en `frontend/src/api/types.ts`
- [X] T003 [P] Preparar contratos de serializacion de mayorista en `backend/sales/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar base de datos y reglas nucleares antes de historias.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Crear modelo de mayorista con campos requeridos en `backend/sales/models.py`
- [X] T005 Implementar normalizacion de telefono para unicidad en `backend/sales/models.py`
- [X] T006 [P] Registrar entidad mayorista en admin en `backend/sales/admin.py`
- [X] T007 [P] Crear migraciones para mayorista y referencia en venta en `backend/sales/migrations/`
- [X] T008 Enlazar `Sale` con `Wholesaler` y validar obligatoriedad en `backend/sales/serializers.py`

**Checkpoint**: Entidad mayorista y relacion con venta disponibles.

---

## Phase 3: User Story 1 - Asociar venta a mayorista (Priority: P1) 🎯 MVP

**Goal**: Registrar ventas solo con mayorista existente y mostrarlo en los resultados de ventas.

**Independent Test**: Crear venta con mayorista seleccionado y verificar que listado/detalle muestra nombre y telefono del mayorista.

### Implementation for User Story 1

- [X] T009 [US1] Requerir seleccion de mayorista en flujo de creacion de venta en `backend/sales/serializers.py`
- [X] T010 [US1] Persistir referencia de mayorista en servicio de ventas en `backend/sales/services.py`
- [X] T011 [US1] Exponer nombre/telefono de mayorista en respuestas de ventas en `backend/sales/serializers.py`
- [X] T012 [US1] Consumir catalogo de mayoristas y enviar `wholesaler` en alta de venta en `frontend/src/api/sales.ts`
- [X] T013 [US1] Agregar selector de mayorista obligatorio en formulario de ventas en `frontend/src/pages/SalesPage.tsx`
- [X] T014 [US1] Mostrar error de validacion cuando no se selecciona mayorista en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: US1 completo e independientemente validable.

---

## Phase 4: User Story 2 - Reutilizar perfil de mayorista existente (Priority: P2)

**Goal**: Permitir seleccionar mayorista existente y bloquear alta inline dentro del formulario de ventas.

**Independent Test**: Registrar dos ventas con el mismo mayorista existente sin generar nuevos perfiles ni capturas redundantes.

### Implementation for User Story 2

- [X] T015 [US2] Implementar endpoint/listado de mayoristas activos para seleccion en `backend/sales/views.py`
- [X] T016 [US2] Agregar ruta de mayoristas en `backend/config/urls.py`
- [X] T017 [US2] Mostrar mensaje de redireccion a alta dedicada cuando no exista mayorista en `frontend/src/pages/SalesPage.tsx`
- [X] T018 [US2] Bloquear alta inline de mayorista en formulario de ventas en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: US2 completo e independientemente validable.

---

## Phase 5: User Story 3 - Consultar compras por mayorista (Priority: P2)

**Goal**: Filtrar ventas por mayorista para ver productos comprados por cada cliente mayorista.

**Independent Test**: Aplicar filtro por mayorista y confirmar que solo aparecen ventas/productos de ese mayorista.

### Implementation for User Story 3

- [X] T019 [US3] Agregar filtro por mayorista en listado de ventas backend en `backend/sales/views.py`
- [X] T020 [US3] Soportar filtro de mayorista en cliente API de ventas en `frontend/src/api/sales.ts`
- [X] T021 [US3] Incorporar control de filtro por mayorista en UI de ventas en `frontend/src/pages/SalesPage.tsx`
- [X] T022 [US3] Verificar render de productos comprados por mayorista en tabla de ventas en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: US3 completo e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de consistencia, calidad y validacion final.

- [X] T023 [P] Normalizar copy y terminologia de mayorista en `frontend/src/pages/SalesPage.tsx` y `specs/002-wholesaler-sales-profile/spec.md`
- [X] T024 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T025 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T026 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T027 Validar flujo end-to-end segun `specs/002-wholesaler-sales-profile/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2/US3 -> Phase 6
- US2 y US3 dependen de la base creada en Phase 2 y del contrato de venta de US1.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P2)**: Requiere entidad y seleccion de mayorista ya disponibles.
- **US3 (P2)**: Requiere referencia de mayorista ya presente en ventas.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 y T007.
- Phase 6: T023 y T025.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Consumir catalogo de mayoristas en frontend/src/api/sales.ts"
Task: "T011 [US1] Exponer mayorista en backend/sales/serializers.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (venta con mayorista obligatorio).
3. Validar y estabilizar.

### Incremental Delivery

1. US1: Asociacion obligatoria venta-mayorista.
2. US2: Reutilizacion de mayorista existente y bloqueo de alta inline.
3. US3: Consulta/filtrado por mayorista.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
