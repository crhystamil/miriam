# Tasks: Carga de imagen en nuevo producto

**Input**: Design documents from `/specs/004-product-image-upload/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio; se incluyen validaciones tecnicas y funcionales del flujo.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear especificacion/contrato y preparar tipos base de producto con imagen de archivo.

- [X] T001 Revisar alineacion entre `specs/004-product-image-upload/spec.md` y `specs/004-product-image-upload/contracts/product-image-upload-contract.md`
- [X] T002 [P] Extender tipos frontend para producto con imagen subida en `frontend/src/api/types.ts`
- [X] T003 [P] Preparar contrato de serializacion de imagen de archivo en `backend/products/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establecer base de datos, almacenamiento y reglas nucleares para carga de archivo.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Crear/ajustar entidad `ImagenProducto` con campo de archivo en `backend/products/models.py`
- [X] T005 Crear migracion para campo de archivo y metadatos en `backend/products/migrations/`
- [X] T006 [P] Registrar soporte de imagen de archivo en admin en `backend/products/admin.py`
- [X] T007 Implementar servicio atomico de creacion de producto con imagen unica en `backend/products/services.py`
- [X] T008 Implementar politica de exactamente 1 imagen obligatoria en `backend/products/serializers.py`
- [X] T009 Asegurar configuracion de media para servir imagenes en entorno local en `backend/config/settings.py` y `backend/config/urls.py`

**Checkpoint**: Base de archivo de imagen y regla obligatoria disponibles para historias.

---

## Phase 3: User Story 1 - Subir imagen al crear producto (Priority: P1) 🎯 MVP

**Goal**: Permitir crear un producto desde modal subiendo una imagen de archivo (sin URL).

**Independent Test**: Abrir modal, cargar un archivo de imagen valido, guardar y ver producto creado con imagen asociada.

### Implementation for User Story 1

- [X] T010 [US1] Exponer endpoint de creacion de producto con carga de archivo en `backend/products/views.py`
- [X] T011 [US1] Soportar `multipart/form-data` para alta de producto en `backend/products/views.py`
- [X] T012 [US1] Implementar envio de archivo en cliente API de productos en `frontend/src/api/products.ts`
- [X] T013 [US1] Reemplazar campo URL por input de archivo en modal de nuevo producto en `frontend/src/pages/ProductsPage.tsx`
- [X] T014 [US1] Bloquear guardado en UI cuando no hay imagen cargada en `frontend/src/pages/ProductsPage.tsx`
- [X] T015 [US1] Refrescar tabla y cerrar modal tras alta exitosa en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Validar archivo de imagen (Priority: P1)

**Goal**: Validar tipo/tamano de archivo y comunicar errores claros en backend y frontend.

**Independent Test**: Intentar cargar archivo invalido (tipo o tamano) y verificar rechazo con mensaje claro.

### Implementation for User Story 2

- [X] T016 [US2] Implementar validacion de tipo permitido de archivo en `backend/products/serializers.py`
- [X] T017 [US2] Implementar validacion de tamano maximo de archivo en `backend/products/serializers.py`
- [X] T018 [US2] Estandarizar mensajes de error de carga en `backend/products/serializers.py`
- [X] T019 [US2] Mapear errores de validacion de archivo en cliente frontend en `frontend/src/api/client.ts`
- [X] T020 [US2] Mostrar errores por campo/mensaje general en modal de producto en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Visualizar imagen cargada en gestion de productos (Priority: P2)

**Goal**: Mostrar la imagen asociada al producto en la gestion para verificacion visual post-alta.

**Independent Test**: Crear producto con imagen y confirmar que la tabla o panel de producto muestra miniatura/indicador visual correcto.

### Implementation for User Story 3

- [X] T021 [US3] Exponer referencia utilizable de imagen en serializador de producto en `backend/products/serializers.py`
- [X] T022 [US3] Ajustar listado de productos para incluir datos de imagen en `backend/products/views.py`
- [X] T023 [US3] Extender tipos frontend para visualizacion de imagen en `frontend/src/api/types.ts`
- [X] T024 [US3] Mostrar miniatura/indicador de imagen en tabla de productos en `frontend/src/pages/ProductsPage.tsx`
- [X] T025 [US3] Ajustar estilos de visualizacion de imagen en `frontend/src/styles.css`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar consistencia, calidad y validacion final.

- [X] T026 [P] Normalizar copy del flujo "subir imagen" en `frontend/src/pages/ProductsPage.tsx` y `specs/004-product-image-upload/spec.md`
- [X] T027 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T028 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T029 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T030 Validar flujo end-to-end segun `specs/004-product-image-upload/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende del flujo de archivo operativo de US1.
- US3 depende de creacion/serializacion de imagen resueltas en US1-US2.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P1)**: Requiere carga de archivo habilitada en backend/frontend.
- **US3 (P2)**: Requiere que producto ya almacene/exponga imagen asociada.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 puede ejecutarse en paralelo con T007-T008 tras T004.
- Phase 6: T026 y T028.

---

## Parallel Example: User Story 2

```bash
Task: "T016 [US2] Implementar validacion de tipo permitido en backend/products/serializers.py"
Task: "T019 [US2] Mapear errores de validacion en frontend/src/api/client.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (alta con archivo de imagen, sin URL).
3. Validar de forma independiente.

### Incremental Delivery

1. US1: Carga de archivo obligatoria en alta.
2. US2: Validaciones y manejo de errores.
3. US3: Visualizacion de imagen en gestion.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
