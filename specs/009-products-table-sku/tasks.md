# Tasks: Mejorar tabla de productos y SKU autogenerado

**Input**: Design documents from `/specs/009-products-table-sku/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No se solicito enfoque TDD; se incluyen validaciones tecnicas y funcionales al cierre.

**Organization**: Tareas agrupadas por historia de usuario para permitir implementacion y validacion independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencia directa)
- **[Story]**: Etiqueta de historia (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear contratos, decisiones y alcance tecnico de la feature 009.

- [X] T001 Revisar consistencia entre `specs/009-products-table-sku/spec.md` y `specs/009-products-table-sku/contracts/products-table-sku-contract.md`
- [X] T002 [P] Revisar estructura actual de tabla y acciones en `frontend/src/pages/ProductsPage.tsx`
- [X] T003 [P] Revisar flujo de creacion y serializacion de producto en `backend/products/serializers.py`
- [X] T004 [P] Revisar modelo y servicios actuales de producto en `backend/products/models.py` y `backend/products/services.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar bases compartidas para columnas completas, SKU autogenerado e imagen representativa.

**CRITICAL**: Ninguna historia inicia hasta completar esta fase.

- [X] T005 Definir generador reutilizable de SKU unico en `backend/products/services.py`
- [X] T006 Integrar generacion automatica de SKU en alta de producto en `backend/products/serializers.py`
- [X] T007 [P] Ajustar validaciones de creacion para evitar SKU duplicado en `backend/products/serializers.py`
- [X] T008 [P] Exponer campo de imagen representativa en listado de productos en `backend/products/serializers.py`
- [X] T009 [P] Extender contrato de tipos de producto para nuevos campos en `frontend/src/api/types.ts`

**Checkpoint**: API y tipos base listos para implementar historias de usuario.

---

## Phase 3: User Story 1 - Ver tabla completa de productos (Priority: P1) 🎯 MVP

**Goal**: Mostrar en tabla todos los campos operativos requeridos para admin y vendedor.

**Independent Test**: Abrir tabla con ambos roles y verificar columnas completas por fila, incluyendo paginacion/filtros.

### Implementation for User Story 1

- [X] T010 [US1] Ajustar mapeo de respuesta de productos con campos completos en `frontend/src/api/products.ts`
- [X] T011 [US1] Renderizar columnas SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock y estado en `frontend/src/pages/ProductsPage.tsx`
- [X] T012 [US1] Ajustar formatos de montos/estado para legibilidad operativa en `frontend/src/pages/ProductsPage.tsx`
- [X] T013 [US1] Mantener consistencia de columnas al paginar o filtrar en `frontend/src/pages/ProductsPage.tsx`
- [X] T014 [US1] Ajustar estilos de tabla para ancho y overflow de columnas en `frontend/src/styles.css`

**Checkpoint**: US1 completa e independientemente validable.

---

## Phase 4: User Story 2 - SKU autogenerado al crear producto (Priority: P1)

**Goal**: Crear productos sin ingreso manual de SKU y persistir SKU unico autogenerado.

**Independent Test**: Crear multiples productos consecutivos sin SKU manual y verificar unicidad y visibilidad en tabla.

### Implementation for User Story 2

- [X] T015 [US2] Remover dependencia de ingreso manual de SKU en formulario de alta en `frontend/src/pages/ProductsPage.tsx`
- [X] T016 [US2] Aplicar generador de SKU en flujo create del serializer en `backend/products/serializers.py`
- [X] T017 [US2] Implementar manejo de colision/reintento de SKU autogenerado en `backend/products/services.py`
- [X] T018 [US2] Asegurar restriccion de unicidad de SKU a nivel modelo/migracion en `backend/products/models.py` y `backend/products/migrations/`
- [X] T019 [US2] Verificar que SKU autogenerado se devuelve en list/create response en `backend/products/serializers.py`

**Checkpoint**: US2 completa e independientemente validable.

---

## Phase 5: User Story 3 - Imagen unica en tabla y acciones de admin (Priority: P2)

**Goal**: Mostrar una sola imagen representativa por producto y conservar acciones de gestion solo para admin.

**Independent Test**: Validar imagen unica por fila (con fallback) y visibilidad de acciones segun rol (admin si, vendedor no).

### Implementation for User Story 3

- [X] T020 [US3] Seleccionar primera imagen por `position` como `representative_image_url` en `backend/products/serializers.py`
- [X] T021 [US3] Renderizar una sola imagen representativa por fila con fallback visual en `frontend/src/pages/ProductsPage.tsx`
- [X] T022 [US3] Manejar error de carga de imagen sin romper tabla en `frontend/src/pages/ProductsPage.tsx`
- [X] T023 [US3] Mantener acciones administrativas existentes solo para admin en `frontend/src/pages/ProductsPage.tsx`
- [X] T024 [US3] Ocultar acciones administrativas para vendedor en `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: US3 completa e independientemente validable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar validaciones tecnicas, documentacion y prueba manual integrada.

- [X] T025 [P] Actualizar flujo final de validacion en `specs/009-products-table-sku/quickstart.md`
- [X] T026 Ejecutar validacion tecnica frontend con `npm run build` en `frontend/`
- [X] T027 [P] Ejecutar validacion backend con `.venv/bin/python manage.py check` en `backend/`
- [X] T028 Ejecutar pruebas backend con `.venv/bin/python manage.py test` en `backend/`
- [ ] T029 Validar flujo end-to-end segun `specs/009-products-table-sku/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> Phase 2 -> US1 -> US2 -> US3 -> Phase 6
- US2 depende de base de creacion/listado consolidada en US1.
- US3 depende de datos y render de tabla definidos en US1 y de contrato de SKU estable de US2.

### User Story Dependencies

- **US1 (P1)**: Base funcional del MVP, sin dependencias de otras historias.
- **US2 (P1)**: Requiere estructura de creacion/listado ya estabilizada en US1.
- **US3 (P2)**: Requiere tabla completa activa y datos de imagen/SKU consistentes.

### Parallel Opportunities

- Phase 1: T002, T003 y T004.
- Phase 2: T007, T008 y T009.
- Phase 6: T025 y T027.

---

## Parallel Example: User Story 3

```bash
Task: "T021 [US3] Renderizar imagen representativa unica con fallback en frontend/src/pages/ProductsPage.tsx"
Task: "T020 [US3] Seleccionar representative_image_url en backend/products/serializers.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational.
2. Entregar US1 (tabla completa con campos operativos).
3. Validar US1 de forma independiente con admin y vendedor.

### Incremental Delivery

1. US1: Tabla completa y consistente en consulta.
2. US2: SKU autogenerado unico en altas.
3. US3: Imagen representativa unica y acciones por rol.
4. Polish final con validaciones tecnicas y E2E manual.

### Suggested MVP Scope

- MVP sugerido: **US1**.
