# Tasks: Carga de multiples fotos por producto

**Input**: Design documents from `/specs/005-multi-product-photos/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio; se incluyen validaciones tecnicas y funcionales del flujo.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear especificacion/contrato y preparar tipos base para multiples fotos por producto.

- [X] T001 Revisar alineacion entre `specs/005-multi-product-photos/spec.md` y `specs/005-multi-product-photos/contracts/multi-product-photos-contract.md`
- [X] T002 [P] Extender tipos frontend para galeria de fotos de producto en `frontend/src/api/types.ts`
- [X] T003 [P] Preparar contrato de serializacion de fotos multiples en `backend/products/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer base de datos, almacenamiento y reglas nucleares para carga multiple por lote.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Ajustar entidad `ProductImage` a relacion 1:N con `Product` y orden (`position`) en `backend/products/models.py`
- [X] T005 Crear migracion para relacion 1:N y orden de galeria en `backend/products/migrations/`
- [X] T006 [P] Actualizar admin para multiples fotos por producto en `backend/products/admin.py`
- [X] T007 Implementar servicio atomico de creacion de producto con lote de fotos (1..5) en `backend/products/services.py`
- [X] T008 Implementar politicas de cantidad (1..5) y validacion por archivo en `backend/products/serializers.py`
- [X] T009 Ajustar estrategia de prefetch y serializacion de galeria en `backend/products/views.py`

**Checkpoint**: Base de multiples fotos y regla 1..5 disponibles para historias.

---

## Phase 3: User Story 1 - Subir varias fotos al crear producto (Priority: P1) 🎯 MVP

**Goal**: Permitir crear un producto desde modal subiendo entre 1 y 5 fotos de archivo (sin URL).

**Independent Test**: Abrir modal, cargar multiples archivos validos, guardar y ver producto creado con todas las fotos asociadas.

### Implementation for User Story 1

- [X] T010 [US1] Exponer endpoint de creacion con lote de fotos en `backend/products/views.py`
- [X] T011 [US1] Soportar `multipart/form-data` con campo multiple de archivos en `backend/products/views.py`
- [X] T012 [US1] Implementar envio de multiples archivos en cliente API de productos en `frontend/src/api/products.ts`
- [X] T013 [US1] Reemplazar input singular por selector multiple en modal de nuevo producto en `frontend/src/pages/ProductsPage.tsx`
- [X] T014 [US1] Bloquear guardado en UI cuando no hay fotos o cuando supera 5 archivos en `frontend/src/pages/ProductsPage.tsx`
- [X] T015 [US1] Refrescar tabla y cerrar modal tras alta exitosa con galeria en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Validar lote de fotos cargadas (Priority: P1)

**Goal**: Validar cada archivo del lote y rechazar la operacion completa con errores claros.

**Independent Test**: Cargar lote con al menos un archivo invalido y verificar rechazo atomico con detalle del error.

### Implementation for User Story 2

- [X] T016 [US2] Implementar validacion de tipo permitido por archivo en `backend/products/serializers.py`
- [X] T017 [US2] Implementar validacion de tamano maximo por archivo en `backend/products/serializers.py`
- [X] T018 [US2] Estandarizar mensajes de error por lote/archivo en `backend/products/serializers.py`
- [X] T019 [US2] Mapear errores de validacion de lote en cliente frontend en `frontend/src/api/client.ts`
- [X] T020 [US2] Mostrar errores por archivo/mensaje general en modal de producto en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Visualizar galeria de fotos en gestion de productos (Priority: P2)

**Goal**: Mostrar galeria/miniaturas asociadas por producto para verificacion visual post-alta.

**Independent Test**: Crear producto con varias fotos y confirmar que la gestion muestra el conjunto esperado.

### Implementation for User Story 3

- [X] T021 [US3] Exponer coleccion ordenada de fotos en serializador de producto en `backend/products/serializers.py`
- [X] T022 [US3] Ajustar listado de productos para incluir galeria (prefetch) en `backend/products/views.py`
- [X] T023 [US3] Extender tipos frontend para galeria multiple en `frontend/src/api/types.ts`
- [X] T024 [US3] Mostrar galeria/miniaturas multiples en tabla de productos en `frontend/src/pages/ProductsPage.tsx`
- [X] T025 [US3] Ajustar estilos de galeria multiple en `frontend/src/styles.css`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia, calidad y validacion final.

- [X] T026 [P] Corregir numeracion duplicada en `specs/005-multi-product-photos/quickstart.md`
- [X] T027 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T028 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T029 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T030 Validar flujo end-to-end segun `specs/005-multi-product-photos/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende del flujo de carga multiple operativo de US1.
- US3 depende de persistencia/serializacion multiple resueltas en US1-US2.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P1)**: Requiere carga multiple habilitada en backend/frontend.
- **US3 (P2)**: Requiere producto con fotos multiples persistidas y expuestas.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 puede ejecutarse en paralelo con T007-T008 tras T004.
- Phase 6: T026 y T028.

---

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Implementar validacion de tipo permitido por archivo en backend/products/serializers.py"
Task: "T019 [US2] Mapear errores de validacion de lote en frontend/src/api/client.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (alta con 1..5 fotos por archivo).
3. Validar de forma independiente.

### Incremental Delivery

1. US1: Carga multiple obligatoria (1..5).
2. US2: Validaciones por archivo y rechazo atomico.
3. US3: Galeria visual en gestion.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
