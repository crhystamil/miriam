# Tasks: Registro de gastos en modal y simplificacion de vista

**Input**: Design documents from `/specs/010-gastos-modal-registro/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito enfoque TDD; se incluyen validaciones tecnicas y funcionales al cierre.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear alcance de modal, campos y simplificacion de la vista de gastos.

- [X] T001 Revisar alineacion entre `specs/010-gastos-modal-registro/spec.md` y `specs/010-gastos-modal-registro/contracts/expenses-modal-contract.md`
- [X] T002 [P] Revisar estructura actual de formulario/filtros en `frontend/src/pages/ExpensesPage.tsx`
- [X] T003 [P] Revisar contrato actual de creacion de gastos en `frontend/src/api/expenses.ts` y `backend/expenses/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar estado compartido y flujo base para modal de registro de gastos.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Crear estado base de apertura/cierre de modal en `frontend/src/pages/ExpensesPage.tsx`
- [X] T005 [P] Definir utilidades de reset y errores del formulario modal en `frontend/src/pages/ExpensesPage.tsx`
- [X] T006 [P] Ajustar payload de alta para incluir `notes` opcional de forma consistente en `frontend/src/api/expenses.ts`
- [X] T007 Confirmar en serializer de gastos que `spent_at` se asigna automaticamente y no se exige campo manual en `backend/expenses/serializers.py`

**Checkpoint**: Base de modal y contrato de alta listos para historias de usuario.

---

## Phase 3: User Story 1 - Registrar nuevo gasto desde modal (Priority: P1) 🎯 MVP

**Goal**: Permitir crear gasto desde un modal abierto por boton "Nuevo gasto" sobre la tabla.

**Independent Test**: Desde gastos, abrir modal, registrar gasto valido y verificar refresco de tabla sin recarga manual.

### Implementation for User Story 1

- [X] T008 [US1] Agregar boton "Nuevo gasto" en cabecera/seccion de gastos en `frontend/src/pages/ExpensesPage.tsx`
- [X] T009 [US1] Implementar modal superpuesto con formulario de nuevo gasto en `frontend/src/pages/ExpensesPage.tsx`
- [X] T010 [US1] Conectar submit del modal con `createExpense` y recarga de listado en `frontend/src/pages/ExpensesPage.tsx`
- [X] T011 [US1] Implementar cierre/cancelacion de modal con limpieza de estado en `frontend/src/pages/ExpensesPage.tsx`
- [X] T012 [US1] Ajustar estilos de modal para superposicion y usabilidad en `frontend/src/styles.css`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Capturar campos correctos de gasto (Priority: P1)

**Goal**: Garantizar campos requeridos correctos en modal, validaciones claras y fecha/hora automatica.

**Independent Test**: Verificar campos requeridos/ opcionales, errores de validacion y ausencia de campo fecha manual.

### Implementation for User Story 2

- [X] T013 [US2] Renderizar campos `scope`, `concept`, `amount` y `notes` (opcional) en modal de `frontend/src/pages/ExpensesPage.tsx`
- [X] T014 [US2] Eliminar cualquier campo de fecha editable del formulario de gasto en `frontend/src/pages/ExpensesPage.tsx`
- [X] T015 [US2] Aplicar validaciones de cliente para concepto vacio y monto <= 0 en `frontend/src/pages/ExpensesPage.tsx`
- [X] T016 [US2] Asegurar que backend mantiene fecha/hora automatica y mensajes de error consistentes en `backend/expenses/serializers.py`
- [X] T017 [US2] Verificar manejo de doble submit y estado `submitting` en `frontend/src/pages/ExpensesPage.tsx`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Eliminar filtros superiores de la tabla de gastos (Priority: P2)

**Goal**: Quitar bloque de filtros superior y mantener tabla de gastos funcional con paginacion.

**Independent Test**: Confirmar que no se muestran filtros sobre tabla y que listado/paginacion siguen operativos.

### Implementation for User Story 3

- [X] T018 [US3] Remover controles de filtro (fecha/ambito) de la vista en `frontend/src/pages/ExpensesPage.tsx`
- [X] T019 [US3] Simplificar estado local eliminando variables/handlers de filtros no usados en `frontend/src/pages/ExpensesPage.tsx`
- [X] T020 [US3] Ajustar carga de datos para listado base paginado sin parametros de filtros UI en `frontend/src/pages/ExpensesPage.tsx`
- [X] T021 [US3] Ajustar textos de apoyo y mensajes de estado para la vista simplificada en `frontend/src/pages/ExpensesPage.tsx`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar documentacion, validacion tecnica y verificacion manual integrada.

- [X] T022 [P] Actualizar flujo final en `specs/010-gastos-modal-registro/quickstart.md`
- [X] T023 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T024 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T025 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T026 Validar flujo end-to-end segun `specs/010-gastos-modal-registro/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende del modal operativo entregado en US1.
- US3 depende de la vista estabilizada tras US1-US2 para simplificar sin romper tabla.

### User Story Dependencies

- **US1 (P1)**: Base funcional del MVP, sin dependencias de otras historias.
- **US2 (P1)**: Requiere infraestructura de modal y submit de US1.
- **US3 (P2)**: Requiere comportamiento base de registro/listado estabilizado.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T005 y T006.
- Phase 6: T022 y T024.

---

## Parallel Example: User Story 2

```bash
Task: "T015 [US2] Aplicar validaciones de cliente en frontend/src/pages/ExpensesPage.tsx"
Task: "T016 [US2] Asegurar fecha/hora automatica y errores en backend/expenses/serializers.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (registro de gastos por modal).
3. Validar US1 de forma independiente.

### Incremental Delivery

1. US1: Alta de gasto via modal.
2. US2: Campos/validaciones correctas y fecha automatica.
3. US3: Vista simplificada sin filtros superiores.
4. Polish final y verificacion tecnica/manual.

### Suggested MVP Scope

- MVP sugerido: **US1**.
