# Tasks: Corregir error al registrar venta

**Input**: Design documents from `/specs/007-fix-sale-submit-error/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio; se incluyen validaciones funcionales y tecnicas del flujo.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear alcance de error de registro y contratos de respuesta en ventas.

- [X] T001 Revisar alineacion entre `specs/007-fix-sale-submit-error/spec.md` y `specs/007-fix-sale-submit-error/contracts/sale-submit-error-contract.md`
- [X] T002 [P] Revisar flujo de envio y estado del modal en `frontend/src/pages/SalesPage.tsx`
- [X] T003 [P] Revisar contrato de creacion de venta y validaciones actuales en `backend/sales/services.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar base comun de validacion y manejo de errores para registro de venta end-to-end.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Normalizar payload de creacion de venta en cliente API en `frontend/src/api/sales.ts`
- [X] T005 Ajustar parseo y mapeo uniforme de errores de venta en `frontend/src/api/client.ts`
- [X] T006 [P] Consolidar validaciones de negocio de venta en `backend/sales/services.py`
- [X] T007 [P] Unificar serializacion/mensajes de error de venta en `backend/sales/serializers.py`
- [X] T008 Asegurar respuestas coherentes del endpoint de ventas en `backend/sales/views.py`

**Checkpoint**: Flujo base de envio y contrato de errores consistente entre frontend y backend.

---

## Phase 3: User Story 1 - Registrar venta sin error (Priority: P1) 🎯 MVP

**Goal**: Permitir registrar una venta valida desde el modal sin error inesperado y reflejarla en el listado.

**Independent Test**: Completar venta con datos validos, recibir exito, cerrar modal y ver la venta en tabla.

### Implementation for User Story 1

- [X] T009 [US1] Corregir envio del formulario de venta con datos requeridos en `frontend/src/pages/SalesPage.tsx`
- [X] T010 [US1] Garantizar bloqueo de doble envio durante submit en `frontend/src/pages/SalesPage.tsx`
- [X] T011 [US1] Asegurar creacion valida de venta en backend con reglas actuales en `backend/sales/services.py`
- [X] T012 [US1] Cerrar modal y refrescar listado tras exito en `frontend/src/pages/SalesPage.tsx`
- [X] T013 [US1] Verificar actualizacion de estado de stock/venta en respuesta de API en `backend/sales/serializers.py`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Mostrar error de negocio claro (Priority: P2)

**Goal**: Mostrar errores claros de validacion de negocio y permitir correccion/reintento inmediato.

**Independent Test**: Forzar error de negocio (ej. stock insuficiente) y validar mensaje claro con formulario editable.

### Implementation for User Story 2

- [X] T014 [US2] Mapear errores de validacion por campo y globales en `frontend/src/pages/SalesPage.tsx`
- [X] T015 [US2] Mostrar mensajes accionables de error sin limpiar el borrador en `frontend/src/pages/SalesPage.tsx`
- [X] T016 [US2] Ajustar mensajes de validacion de backend para negocio de ventas en `backend/sales/services.py`
- [X] T017 [US2] Homologar formato de respuesta de error de ventas en `backend/sales/serializers.py`
- [X] T018 [US2] Validar bloqueo informativo cuando no hay mayoristas en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Mantener estado consistente post-envio (Priority: P3)

**Goal**: Mantener consistencia de modal y tabla en escenarios de exito/error sin ventas parciales.

**Independent Test**: Probar exito y error consecutivos, verificando que no hay registros parciales ni estado visual incoherente.

### Implementation for User Story 3

- [X] T019 [US3] Preservar estado del borrador tras error y permitir reenvio en `frontend/src/pages/SalesPage.tsx`
- [X] T020 [US3] Evitar insercion parcial/duplicada bajo fallo transitorio en `backend/sales/services.py`
- [X] T021 [US3] Sincronizar refresco de listado con resultado de envio en `frontend/src/pages/SalesPage.tsx`
- [X] T022 [US3] Ajustar contrato documental de consistencia post-envio en `specs/007-fix-sale-submit-error/contracts/sale-submit-error-contract.md`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar validacion integral y documentacion final.

- [X] T023 [P] Actualizar escenarios de quickstart segun flujo corregido en `specs/007-fix-sale-submit-error/quickstart.md`
- [X] T024 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T025 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T026 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T027 Validar flujo end-to-end del modal segun `specs/007-fix-sale-submit-error/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de US1 para tener flujo base exitoso operativo.
- US3 depende de US1-US2 para validar consistencia de estados y no parcialidad.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P2)**: Requiere flujo base de envio/respuesta operativo de US1.
- **US3 (P3)**: Requiere estabilidad de US1-US2 para coherencia post-envio.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 y T007.
- Phase 6: T023 y T025.

---

## Parallel Example: User Story 2

```bash
Task: "T015 [US2] Mostrar mensajes accionables sin limpiar borrador en frontend/src/pages/SalesPage.tsx"
Task: "T017 [US2] Homologar formato de error en backend/sales/serializers.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (registro valido sin error inesperado).
3. Validar de forma independiente.

### Incremental Delivery

1. US1: Registro exitoso y refresco correcto.
2. US2: Mensajeria de error clara y recuperable.
3. US3: Consistencia de estado y no parcialidad.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
