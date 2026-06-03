# Tasks: Mejora de registro de ventas

**Input**: Design documents from `/specs/001-sales-modal-busqueda/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicitaron tareas TDD obligatorias en la especificacion; se incluye validacion funcional/manual y validacion tecnica de build/check.

**Organization**: Tasks grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in each task

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de tipos, estilos y estructura UI para el flujo de venta en modal.

- [X] T001 Revisar y alinear contrato de flujo de ventas en `specs/001-sales-modal-busqueda/contracts/sales-ui-contract.md` contra `frontend/src/pages/SalesPage.tsx`
- [X] T002 [P] Agregar/ajustar tipos de estado del modal y borrador en `frontend/src/api/types.ts`
- [X] T003 [P] Definir clases base de modal accesible y layout 2-columnas en `frontend/src/styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar infraestructura bloqueante del modal y ciclo de estado antes de historias.

**⚠️ CRITICAL**: No iniciar historias hasta completar esta fase.

- [X] T004 Implementar estado de apertura/cierre del modal en `frontend/src/pages/SalesPage.tsx`
- [X] T005 Implementar ciclo de borrador (conservar abierto, limpiar al cerrar/cancelar/success) en `frontend/src/pages/SalesPage.tsx`
- [X] T006 [P] Implementar contenedor visual del modal con overlay y cierre controlado en `frontend/src/styles.css`
- [X] T007 [P] Integrar boton principal `Registrar Venta` y punto de entrada del modal en `frontend/src/pages/SalesPage.tsx`

**Checkpoint**: Modal y ciclo base listos para historias de usuario.

---

## Phase 3: User Story 1 - Registrar venta desde accion principal (Priority: P1) 🎯 MVP

**Goal**: Registrar ventas desde un modal centrado con campos requeridos y feedback claro.

**Independent Test**: Desde `Ventas`, abrir modal con `Registrar Venta`, completar campos obligatorios, guardar y ver exito + refresco de lista.

### Implementation for User Story 1

- [X] T008 [US1] Reestructurar formulario de nueva venta dentro del modal en `frontend/src/pages/SalesPage.tsx`
- [X] T009 [US1] Asegurar campos requeridos (producto, cantidad, precio venta) y campo referencial mayorista read-only en `frontend/src/pages/SalesPage.tsx`
- [X] T010 [US1] Conectar submit de venta con `notes` y manejo de errores de negocio en `frontend/src/pages/SalesPage.tsx`
- [X] T011 [US1] Aplicar estilos de formulario/modal para desktop y mobile en `frontend/src/styles.css`
- [ ] T012 [US1] Ajustar mensajes de exito/error y comportamiento post-guardado en `frontend/src/components/StatusMessages.tsx`

**Checkpoint**: US1 funcional e independientemente validable.

---

## Phase 4: User Story 2 - Buscar producto rapidamente en listas grandes (Priority: P1)

**Goal**: Permitir busqueda incremental por SKU y nombre para seleccionar producto en listas extensas.

**Independent Test**: Con lista grande, escribir texto en buscador y verificar filtrado incremental por SKU/nombre; limpiar y recuperar lista completa.

### Implementation for User Story 2

- [X] T013 [US2] Implementar estado de texto de busqueda para productos en `frontend/src/pages/SalesPage.tsx`
- [X] T014 [US2] Implementar filtrado parcial case-insensitive por SKU y nombre en `frontend/src/pages/SalesPage.tsx`
- [X] T015 [US2] Integrar buscador visual dentro del selector/listado de productos en `frontend/src/pages/SalesPage.tsx`
- [X] T016 [US2] Mostrar estado sin coincidencias sin bloquear cierre/cancelacion en `frontend/src/pages/SalesPage.tsx`
- [X] T017 [US2] Ajustar estilos del buscador y lista de opciones para usabilidad en `frontend/src/styles.css`

**Checkpoint**: US2 funcional e independientemente validable.

---

## Phase 5: User Story 3 - Revisar resumen visual del producto antes de vender (Priority: P2)

**Goal**: Mostrar panel lateral de descripcion con imagen pequena referencial y datos clave del producto seleccionado.

**Independent Test**: Cambiar producto y verificar actualizacion inmediata del panel (datos + imagen pequena) sin afectar captura.

### Implementation for User Story 3

- [X] T018 [US3] Consolidar panel de detalle de producto vinculado a seleccion activa en `frontend/src/pages/SalesPage.tsx`
- [X] T019 [US3] Ajustar tamano de imagen referencial para no dominar el layout en `frontend/src/styles.css`
- [X] T020 [US3] Implementar fallback legible cuando falten datos descriptivos en `frontend/src/pages/SalesPage.tsx`
- [X] T021 [US3] Asegurar layout 2 columnas en desktop y apilado en mobile para formulario+detalle en `frontend/src/styles.css`

**Checkpoint**: US3 funcional e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de calidad, consistencia y validacion final.

- [ ] T022 [P] Revisar consistencia de copy/terminologia de ventas en `frontend/src/pages/SalesPage.tsx` y `specs/001-sales-modal-busqueda/spec.md`
- [X] T023 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T024 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [ ] T025 Validar flujo manual completo contra `specs/001-sales-modal-busqueda/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia inmediatamente.
- **Phase 2 (Foundational)**: depende de Phase 1; bloquea historias.
- **Phase 3 (US1)**: depende de Phase 2.
- **Phase 4 (US2)**: depende de Phase 2; puede desarrollarse en paralelo con US1 si hay capacidad.
- **Phase 5 (US3)**: depende de Phase 2; puede avanzar en paralelo con US1/US2, pero idealmente despues de tener selector estabilizado.
- **Phase 6 (Polish)**: depende de historias objetivo completadas.

### User Story Dependencies

- **US1**: independiente tras fundacion.
- **US2**: independiente tras fundacion; se integra con formulario de US1.
- **US3**: independiente tras fundacion; consume producto seleccionado del flujo de captura.

### Within Each User Story

- Estado/UI base antes de detalles visuales.
- Integracion funcional antes de polish.
- Validacion manual de historia antes de cerrar fase.

### Parallel Opportunities

- Phase 1: T002 y T003.
- Phase 2: T006 y T007.
- Phase 6: T022 y T024.
- Historias US1/US2/US3 pueden ejecutarse en paralelo despues de fundacion con coordinacion de cambios en `SalesPage.tsx`.

---

## Parallel Example: User Story 2

```bash
# En paralelo (si hay mas de una persona):
Task: "T014 [US2] Implementar filtrado parcial case-insensitive en frontend/src/pages/SalesPage.tsx"
Task: "T017 [US2] Ajustar estilos del buscador y lista en frontend/src/styles.css"
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Phase 1 y Phase 2.
2. Entregar US1 (modal + registro exitoso).
3. Validar flujo base de negocio y estabilidad.

### Incremental Delivery

1. US1: registro en modal funcional.
2. US2: buscador de productos escalable.
3. US3: panel de detalle con imagen pequena.
4. Polish final con build/check y quickstart.

### Suggested MVP Scope

- MVP sugerido: **solo User Story 1** (apertura modal + registro correcto con validaciones).
