# Tasks: Refinar vista y calculos de corte mensual

**Input**: Design documents from `/specs/012-monthly-cut-view-refinement/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Se generan tareas de validacion tecnica y funcional porque la especificacion define criterios medibles e independent tests por historia.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar artefactos de soporte para el refinamiento sin cambiar comportamiento aun.

- [X] T001 Documentar alcance tecnico de 012 en `specs/012-monthly-cut-view-refinement/plan.md`
- [X] T002 Alinear contratos funcionales de la feature en `specs/012-monthly-cut-view-refinement/contracts/monthly-cut-view-refinement-contract.md`
- [X] T003 [P] Definir flujo de validacion funcional en `specs/012-monthly-cut-view-refinement/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ajustar contratos de datos y rutas base que desbloquean todas las historias.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Ajustar tipos de resumen financiero para neto real refinado en `frontend/src/api/types.ts`
- [ ] T005 [P] Ajustar cliente de reportes para endpoints listado/detalle en `frontend/src/api/reports.ts`
- [ ] T006 [P] Exponer campos requeridos de gastos en respuesta de detalle en `backend/cuts/serializers.py`
- [X] T007 Actualizar construccion de reporte para `real_net = store_profit - expenses` en `backend/cuts/services.py`
- [X] T008 Definir rutas separadas de listado y detalle de cortes en `frontend/src/router/routes.tsx`

**Checkpoint**: Fundacion lista - historias de usuario pueden implementarse y validarse de forma independiente.

---

## Phase 3: User Story 1 - Corregir resumen financiero del corte (Priority: P1) 🎯 MVP

**Goal**: Mostrar calculos financieros correctos del corte y eliminar duplicidad visual de capital invertido.

**Independent Test**: Abrir detalle de un corte y verificar que neto real usa `ganancia tienda - gastos` y que no existe campo visual separado de capital invertido.

### Implementation for User Story 1

- [X] T009 [US1] Actualizar logica de agregados de resumen financiero en `backend/cuts/services.py`
- [ ] T010 [P] [US1] Ajustar contrato de salida del resumen de corte en `backend/cuts/serializers.py`
- [X] T011 [P] [US1] Actualizar tipos de resumen financiero consumidos por UI en `frontend/src/api/types.ts`
- [X] T012 [US1] Ajustar render del resumen en vista de detalle para ocultar capital invertido duplicado en `frontend/src/pages/MonthlyCutDetailPage.tsx`
- [X] T013 [US1] Cubrir formula de neto real y exclusion de ganancia mayorista en `backend/cuts/tests.py`

**Checkpoint**: User Story 1 funcional y verificable de forma aislada.

---

## Phase 4: User Story 2 - Separar lista de cortes y detalle de corte (Priority: P1)

**Goal**: Implementar navegacion clara con vista principal de listado y vista dedicada de detalle por corte.

**Independent Test**: Entrar a listado de cortes, usar accion Ver y confirmar navegacion a detalle dedicado con toda la informacion del corte.

### Implementation for User Story 2

- [X] T014 [US2] Refactorizar `MonthlyCutPage` para funcionar como listado principal en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T015 [P] [US2] Crear pagina dedicada de detalle de corte en `frontend/src/pages/MonthlyCutDetailPage.tsx`
- [X] T016 [US2] Implementar navegacion desde accion Ver hacia detalle en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T017 [US2] Registrar ruta de detalle por id de corte en `frontend/src/router/routes.tsx`
- [ ] T018 [P] [US2] Actualizar acceso de navegacion lateral al listado principal de cortes en `frontend/src/components/AppShell.tsx`
- [X] T019 [US2] Validar respuesta estable para corte no encontrado en `frontend/src/pages/MonthlyCutDetailPage.tsx`

**Checkpoint**: User Story 1 y User Story 2 funcionan independientemente.

---

## Phase 5: User Story 3 - Agregar tabla de gastos y advertencia antes de ejecutar corte (Priority: P2)

**Goal**: Exponer tabla de gastos en detalle y proteger ejecucion del corte con confirmacion previa desde listado.

**Independent Test**: Validar tabla de gastos con columnas fecha/concepto/monto y confirmar que cancelar advertencia evita ejecutar corte.

### Implementation for User Story 3

- [X] T020 [P] [US3] Incluir dataset de gastos del corte (fecha, concepto, monto) en `backend/cuts/services.py`
- [ ] T021 [US3] Exponer dataset de gastos en serializer de detalle en `backend/cuts/serializers.py`
- [X] T022 [US3] Renderizar tabla de gastos en detalle con estado vacio en `frontend/src/pages/MonthlyCutDetailPage.tsx`
- [X] T023 [US3] Implementar advertencia de confirmacion antes de ejecutar corte en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T024 [US3] Restringir accion "Ejecutar corte" solo a vista principal en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T025 [US3] Cubrir cancelacion de advertencia y manejo de duplicidad de corte en `frontend/src/pages/MonthlyCutPage.tsx`

**Checkpoint**: Todas las historias definidas en la feature son funcionales y comprobables.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad transversal y validaciones finales.

- [ ] T026 [P] Actualizar guia de verificacion final de feature en `specs/012-monthly-cut-view-refinement/quickstart.md`
- [X] T027 Ejecutar build frontend para validar integridad de cambios en `frontend/`
- [X] T028 Ejecutar chequeo Django para validar configuracion backend en `backend/`
- [X] T029 Ejecutar suite de tests backend para validar regresiones en `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias externas.
- **Foundational (Phase 2)**: Depende de Phase 1 y bloquea historias.
- **User Stories (Phase 3+)**: Empiezan despues de completar Phase 2.
- **Polish (Phase 6)**: Depende de completar las historias objetivo.

### User Story Dependencies

- **US1 (P1)**: Inicia tras Foundational; no depende de otras historias.
- **US2 (P1)**: Inicia tras Foundational; se apoya en contratos ajustados pero se prueba de forma independiente.
- **US3 (P2)**: Inicia tras Foundational; integra listado y detalle ya refinados.

### Parallel Opportunities

- En **Foundational**: T005 y T006 pueden ejecutarse en paralelo despues de T004.
- En **US1**: T010 y T011 pueden ejecutarse en paralelo despues de T009.
- En **US2**: T015 y T018 pueden ejecutarse en paralelo tras definir ruta base.
- En **US3**: T020 puede correr en paralelo con T023.
- En **Polish**: T027, T028 y T029 son paralelizables por area.

---

## Parallel Example: User Story 2

```bash
# Trabajos paralelos para US2
Task: "Crear pagina dedicada de detalle de corte en frontend/src/pages/MonthlyCutDetailPage.tsx"
Task: "Actualizar acceso de navegacion lateral al listado principal de cortes en frontend/src/components/AppShell.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 y Phase 2.
2. Completar Phase 3 (US1).
3. Validar calculo de neto real y visual de capital.
4. Hacer demo interna del ajuste financiero.

### Incremental Delivery

1. Fundacion (Phases 1-2).
2. US1 (MVP financiero).
3. US2 (separacion listado/detalle).
4. US3 (tabla de gastos + confirmacion de ejecucion).
5. Polish con validaciones tecnicas finales.

### Parallel Team Strategy

1. Equipo A: backend contratos y calculos (T007, T009, T020, T021).
2. Equipo B: frontend navegacion y vistas (T014-T019, T022-T025).
3. Cierre conjunto en tareas de validacion (T027-T029).

---

## Notes

- Todas las tareas mantienen formato checklist obligatorio con ID y ruta de archivo.
- Las tareas [P] fueron marcadas solo cuando no compiten por el mismo archivo de forma bloqueante.
- Cada historia tiene criterio de prueba independiente para permitir despliegue incremental.
