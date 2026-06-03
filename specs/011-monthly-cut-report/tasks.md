# Tasks: Corte mensual con resumen y reinicio operativo

**Input**: Design documents from `/specs/011-monthly-cut-report/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito enfoque TDD obligatorio; se incluyen validaciones tecnicas y funcionales al cierre.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear alcance de corte mensual, snapshot, unicidad y vistas de reporte.

- [X] T001 Revisar consistencia entre `specs/011-monthly-cut-report/spec.md` y `specs/011-monthly-cut-report/contracts/monthly-cut-report-contract.md`
- [X] T002 [P] Revisar flujo actual de ventas activas/inactivas y ganancias en `backend/sales/models.py`, `backend/sales/services.py` y `backend/sales/views.py`
- [X] T003 [P] Revisar flujo actual de gastos y serializacion en `backend/expenses/models.py`, `backend/expenses/serializers.py` y `backend/expenses/views.py`
- [X] T004 [P] Revisar capacidades actuales de reportes y rutas en `backend/core/` y `frontend/src/pages/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar base de datos y servicios de corte para soportar cierre por marcado, snapshot y unicidad.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T005 Definir modelo de `CorteMensual` con unicidad por periodo/fecha en `backend/core/models.py`
- [X] T006 [P] Agregar campos de estado de cierre por corte en ventas y gastos en `backend/sales/models.py` y `backend/expenses/models.py`
- [X] T007 Crear migraciones de `CorteMensual` y campos de cierre en `backend/core/migrations/`, `backend/sales/migrations/` y `backend/expenses/migrations/`
- [X] T008 Implementar servicio base de snapshot y cierre atomico en `backend/core/services_monthly_cut.py`
- [X] T009 [P] Definir serializer/DTO base de corte mensual en `backend/core/serializers.py`

**Checkpoint**: Estructura de datos y servicio base listos para historias de usuario.

---

## Phase 3: User Story 1 - Ejecutar corte mensual operativo (Priority: P1) 🎯 MVP

**Goal**: Permitir ejecutar corte mensual por admin con snapshot, marcado de cierre y bloqueo de duplicados.

**Independent Test**: Ejecutar corte con fecha limite, verificar bloqueo de segundo corte y ocultamiento de historiales activos del periodo.

### Implementation for User Story 1

- [X] T010 [US1] Implementar endpoint de ejecucion de corte mensual (admin-only) en `backend/core/views.py`
- [X] T011 [US1] Aplicar snapshot al inicio y exclusion de registros concurrentes en `backend/core/services_monthly_cut.py`
- [X] T012 [US1] Marcar ventas/gastos del snapshot como cerrados por corte en `backend/core/services_monthly_cut.py`
- [X] T013 [US1] Impedir corte duplicado para mismo periodo/fecha con error claro en `backend/core/services_monthly_cut.py` y `backend/core/serializers.py`
- [X] T014 [US1] Ajustar listados operativos para ocultar registros cerrados por corte en `backend/sales/views.py` y `backend/expenses/views.py`
- [X] T015 [US1] Exponer accion de corte en cliente API en `frontend/src/api/reports.ts`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Ver resumen financiero del corte mensual (Priority: P1)

**Goal**: Mostrar nueva vista de corte con indicadores globales calculados solo sobre ventas habilitadas.

**Independent Test**: Abrir vista de corte ejecutado y validar indicadores requeridos con base de ventas habilitadas y gastos del snapshot.

### Implementation for User Story 2

- [X] T016 [US2] Implementar agregaciones de resumen financiero del corte en `backend/core/services_monthly_cut.py`
- [X] T017 [US2] Crear endpoint de detalle de corte con resumen global en `backend/core/views.py` y `backend/core/serializers.py`
- [X] T018 [US2] Definir tipos de respuesta de corte mensual en `frontend/src/api/types.ts`
- [X] T019 [US2] Implementar cliente de consulta de reporte de corte en `frontend/src/api/reports.ts`
- [X] T020 [US2] Crear nueva pagina de corte mensual con tarjetas de indicadores en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T021 [US2] Registrar ruta/navegacion a la nueva vista en `frontend/src/App.tsx` y componente de navegacion correspondiente

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Analizar desempeno por mayorista y detalle de ventas (Priority: P2)

**Goal**: Mostrar tablas por mayorista, detalle habilitado ordenado por mayorista y tabla separada de deshabilitadas.

**Independent Test**: Validar columnas y orden de tablas de desempeno/detalle, incluyendo separacion informativa de deshabilitadas.

### Implementation for User Story 3

- [X] T022 [US3] Implementar agregado por mayorista para ventas habilitadas en `backend/core/services_monthly_cut.py`
- [X] T023 [US3] Implementar detalle de ventas habilitadas ordenado por mayorista en `backend/core/services_monthly_cut.py`
- [X] T024 [US3] Implementar detalle separado de ventas deshabilitadas (sin impacto en totales) en `backend/core/services_monthly_cut.py`
- [X] T025 [US3] Exponer tablas de desempeno y detalle en serializer de respuesta de corte en `backend/core/serializers.py`
- [X] T026 [US3] Renderizar tabla de desempeno por mayorista en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T027 [US3] Renderizar tabla de detalle de ventas habilitadas con orden por mayorista en `frontend/src/pages/MonthlyCutPage.tsx`
- [X] T028 [US3] Renderizar tabla separada de ventas deshabilitadas en `frontend/src/pages/MonthlyCutPage.tsx`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar validaciones, documentacion y verificacion manual integral del flujo de corte.

- [X] T029 [P] Actualizar flujo final de validacion en `specs/011-monthly-cut-report/quickstart.md`
- [X] T030 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T031 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T032 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T033 Validar flujo end-to-end segun `specs/011-monthly-cut-report/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de US1 porque requiere cortes ejecutados y persistidos para mostrar resumen.
- US3 depende de US2 para reutilizar respuesta de corte y presentacion consolidada.

### User Story Dependencies

- **US1 (P1)**: Base funcional del MVP de cierre mensual.
- **US2 (P1)**: Requiere infraestructura y ejecucion de corte de US1.
- **US3 (P2)**: Requiere endpoints de corte consolidados de US1-US2.

### Parallel Opportunities

- Phase 1: T002, T003 y T004.
- Phase 2: T006 y T009.
- Phase 6: T029 y T031.

---

## Parallel Example: User Story 3

```bash
Task: "T026 [US3] Renderizar tabla de desempeno por mayorista en frontend/src/pages/MonthlyCutPage.tsx"
Task: "T024 [US3] Implementar detalle separado de ventas deshabilitadas en backend/core/services_monthly_cut.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (ejecucion de corte mensual con snapshot, unicidad y marcado de cierre).
3. Validar US1 de forma independiente.

### Incremental Delivery

1. US1: Motor de corte mensual confiable.
2. US2: Vista de resumen financiero global del corte.
3. US3: Tablas analiticas por mayorista y detalle habilitado/deshabilitado.
4. Polish final con validaciones tecnicas y manuales.

### Suggested MVP Scope

- MVP sugerido: **US1**.
