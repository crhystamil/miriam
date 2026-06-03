# Tasks: Gestion de productos con modal e imagenes

**Input**: Design documents from `/specs/003-products-modal-crud/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio en la especificacion; se incluyen validaciones tecnicas y funcionales.

**Organization**: Tareas agrupadas por historia de usuario para implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar contratos y base de tipos para modal CRUD con imagenes.

- [X] T001 Revisar alineacion entre `specs/003-products-modal-crud/spec.md` y `specs/003-products-modal-crud/contracts/products-modal-crud-contract.md`
- [X] T002 [P] Extender tipos frontend de producto/imagen para alta-edicion en `frontend/src/api/types.ts`
- [X] T003 [P] Definir estructuras de serializacion de producto con imagenes en `backend/products/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar base de datos y reglas nucleares comunes a todas las historias.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Crear entidad de imagen de producto y relacion 1:N en `backend/products/models.py`
- [X] T005 Implementar validacion de minimo una imagen por producto en `backend/products/serializers.py`
- [X] T006 [P] Registrar modelo de imagen y administracion de producto en `backend/products/admin.py`
- [X] T007 [P] Crear migraciones para imagenes y ajustes de producto en `backend/products/migrations/`
- [X] T008 Implementar desactivacion logica de producto (`is_active=false`) en `backend/products/services.py`
- [X] T009 Asegurar listado por defecto de productos activos en `backend/products/views.py`

**Checkpoint**: Fundacion lista (modelo de imagenes + desactivacion logica + listado activo).

---

## Phase 3: User Story 1 - Crear producto en modal (Priority: P1) 🎯 MVP

**Goal**: Crear productos desde un modal en la vista de productos y reflejar el alta en la tabla activa.

**Independent Test**: Abrir modal de nuevo producto, guardar datos validos y verificar aparicion inmediata en tabla.

### Implementation for User Story 1

- [X] T010 [US1] Exponer endpoint de creacion de producto con imagenes en `backend/products/views.py`
- [X] T011 [US1] Gestionar creacion atomica producto+imagenes en `backend/products/services.py`
- [X] T012 [US1] Agregar funcion de alta con imagenes en `frontend/src/api/products.ts`
- [X] T013 [US1] Agregar boton "Nuevo producto" y estado de modal en `frontend/src/pages/ProductsPage.tsx`
- [X] T014 [US1] Implementar formulario modal de alta con campos de producto en `frontend/src/pages/ProductsPage.tsx`
- [X] T015 [US1] Refrescar tabla tras alta exitosa y cerrar modal en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Gestionar imagenes del producto (Priority: P1)

**Goal**: Permitir asociar una o mas imagenes y conservar consistencia visual en alta y edicion.

**Independent Test**: Crear/editar producto con multiples imagenes y verificar persistencia de todas las imagenes.

### Implementation for User Story 2

- [X] T016 [US2] Soportar operaciones de imagenes (agregar/quitar/listar) en `backend/products/serializers.py`
- [X] T017 [US2] Exponer imagenes en detalle/listado de producto en `backend/products/serializers.py`
- [X] T018 [US2] Extender cliente API para enviar multiples imagenes en `frontend/src/api/products.ts`
- [X] T019 [US2] Implementar control UI para 1+ imagenes en modal de producto en `frontend/src/pages/ProductsPage.tsx`
- [X] T020 [US2] Mostrar errores de validacion cuando no hay imagenes en `frontend/src/pages/ProductsPage.tsx`
- [X] T021 [US2] Verificar persistencia visual de imagenes al reabrir edicion en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Editar y eliminar desde la tabla (Priority: P2)

**Goal**: Editar productos y desactivarlos desde la tabla, preservando historial y actualizando vista operativa.

**Independent Test**: Editar una fila y desactivar otra; confirmar cambios y ocultamiento de inactivos en tabla activa.

### Implementation for User Story 3

- [X] T022 [US3] Implementar endpoint de actualizacion de producto en `backend/products/views.py`
- [X] T023 [US3] Implementar endpoint de desactivacion logica de producto en `backend/products/views.py`
- [X] T024 [US3] Agregar funciones frontend para editar/desactivar en `frontend/src/api/products.ts`
- [X] T025 [US3] Incorporar accion "Editar" por fila y modal de edicion en `frontend/src/pages/ProductsPage.tsx`
- [X] T026 [US3] Incorporar accion "Eliminar" (desactivar) con confirmacion en `frontend/src/pages/ProductsPage.tsx`
- [X] T027 [US3] Refrescar tabla y ocultar inactivos tras desactivacion en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia, calidad y validacion final.

- [X] T028 [P] Normalizar copy de acciones "Nuevo/Editar/Eliminar" en `frontend/src/pages/ProductsPage.tsx` y `specs/003-products-modal-crud/spec.md`
- [X] T029 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T030 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T031 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T032 Validar flujo end-to-end segun `specs/003-products-modal-crud/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de base de imagenes de Phase 2 y flujo modal de US1.
- US3 depende de acciones CRUD base y contratos de tabla ya disponibles.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP de alta modal).
- **US2 (P1)**: Requiere alta modal y modelo de imagenes operativos.
- **US3 (P2)**: Requiere listado y APIs de producto estabilizados.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 y T007.
- Phase 6: T028 y T030.

---

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] Extender cliente API para enviar multiples imagenes en frontend/src/api/products.ts"
Task: "T017 [US2] Exponer imagenes en serializadores backend en backend/products/serializers.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (alta por modal y refresco de tabla).
3. Validar de forma independiente antes de avanzar.

### Incremental Delivery

1. US1: Alta de producto en modal.
2. US2: Gestion de imagenes multiples con regla minima.
3. US3: Edicion y desactivacion logica desde tabla.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
