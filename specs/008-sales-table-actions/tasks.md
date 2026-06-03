# Tasks: Completar tabla de ventas y acciones

**Input**: Design documents from `/specs/008-sales-table-actions/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito TDD obligatorio; se incluyen validaciones funcionales y tecnicas del flujo.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear alcance funcional de columnas y acciones de tabla de ventas.

- [X] T001 Revisar alineacion entre `specs/008-sales-table-actions/spec.md` y `specs/008-sales-table-actions/contracts/sales-table-actions-contract.md`
- [X] T002 [P] Revisar estructura actual de columnas en `frontend/src/pages/SalesPage.tsx`
- [X] T003 [P] Revisar datos disponibles de venta en `backend/sales/serializers.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar base de datos de respuesta y reglas de accion para deshabilitar/eliminar venta.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T004 Exponer `is_active` y campos operativos completos en serializacion de venta en `backend/sales/serializers.py`
- [X] T005 [P] Ajustar `SaleViewSet` para incluir ventas activas/inactivas segun filtros en `backend/sales/views.py`
- [X] T006 Implementar servicio de deshabilitar venta con reversa de stock en `backend/sales/services.py`
- [X] T007 [P] Implementar restriccion de eliminacion por rol admin en `backend/sales/views.py`
- [X] T008 Definir cliente API para acciones de deshabilitar/eliminar venta en `frontend/src/api/sales.ts`

**Checkpoint**: API y reglas base listas para implementar historias de usuario.

---

## Phase 3: User Story 1 - Ver tabla completa de ventas (Priority: P1) 🎯 MVP

**Goal**: Mostrar tabla de ventas con fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido para admin y vendedor.

**Independent Test**: Iniciar sesion como admin y vendedor y verificar columnas completas en todas las filas paginadas.

### Implementation for User Story 1

- [X] T009 [US1] Extender tipos de venta con campos faltantes en `frontend/src/api/types.ts`
- [X] T010 [US1] Actualizar columnas de tabla de ventas con datos completos en `frontend/src/pages/SalesPage.tsx`
- [X] T011 [US1] Ajustar formato de fecha y montos para legibilidad en `frontend/src/pages/SalesPage.tsx`
- [X] T012 [US1] Verificar consistencia de datos al paginar/filtrar en `frontend/src/pages/SalesPage.tsx`
- [X] T013 [US1] Ajustar estilo de tabla para columnas ampliadas en `frontend/src/styles.css`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - Deshabilitar venta desde la tabla (Priority: P1)

**Goal**: Permitir deshabilitar venta para admin/vendedor y revertir stock de forma consistente.

**Independent Test**: Deshabilitar venta activa y verificar estado inactivo + reversa de stock + refresco de tabla.

### Implementation for User Story 2

- [X] T014 [US2] Agregar accion de deshabilitar por fila en tabla de ventas en `frontend/src/pages/SalesPage.tsx`
- [X] T015 [US2] Invocar endpoint de deshabilitar y refrescar listado tras exito en `frontend/src/pages/SalesPage.tsx`
- [X] T016 [US2] Implementar endpoint/accion de deshabilitar venta en `backend/sales/views.py`
- [X] T017 [US2] Aplicar reversa de stock y cambio a inactiva en `backend/sales/services.py`
- [X] T018 [US2] Cubrir casos de venta ya inactiva/no existente con mensaje claro en `backend/sales/serializers.py`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Eliminar venta con control de permisos (Priority: P2)

**Goal**: Permitir eliminar venta solo a admin y bloquear intento de vendedor.

**Independent Test**: Admin elimina venta exitosamente; vendedor recibe bloqueo por permisos.

### Implementation for User Story 3

- [X] T019 [US3] Agregar accion de eliminar por fila visible solo para admin en `frontend/src/pages/SalesPage.tsx`
- [X] T020 [US3] Mostrar bloqueo/mensaje claro si vendedor intenta eliminar en `frontend/src/pages/SalesPage.tsx`
- [X] T021 [US3] Implementar restriccion de permisos para eliminar venta en `backend/sales/views.py`
- [X] T022 [US3] Ajustar respuesta de error de permisos para eliminar venta en `backend/sales/serializers.py`
- [X] T023 [US3] Agregar pruebas API de permisos y eliminacion en `backend/sales/tests_api.py`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar calidad, pruebas y consistencia documental.

- [X] T024 [P] Actualizar `quickstart` con flujo final de acciones en `specs/008-sales-table-actions/quickstart.md`
- [X] T025 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T026 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T027 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T028 Validar flujo end-to-end de tabla y acciones segun `specs/008-sales-table-actions/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de US1 para operar sobre tabla completa y datos visibles.
- US3 depende de US1-US2 para mantener acciones coherentes por rol y estado.

### User Story Dependencies

- **US1 (P1)**: Base funcional obligatoria (MVP).
- **US2 (P1)**: Requiere estructura de tabla y datos de US1.
- **US3 (P2)**: Requiere base de acciones y estado de US1-US2.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T005 y T007.
- Phase 6: T024 y T026.

---

## Parallel Example: User Story 2

```bash
Task: "T015 [US2] Invocar endpoint de deshabilitar y refrescar listado en frontend/src/pages/SalesPage.tsx"
Task: "T017 [US2] Aplicar reversa de stock y estado inactivo en backend/sales/services.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (tabla completa con campos requeridos).
3. Validar de forma independiente.

### Incremental Delivery

1. US1: Visibilidad completa de datos en tabla.
2. US2: Deshabilitar con reversa de stock y consistencia.
3. US3: Eliminar restringido por permisos de admin.
4. Polish final y validaciones tecnicas.

### Suggested MVP Scope

- MVP sugerido: **US1**.
