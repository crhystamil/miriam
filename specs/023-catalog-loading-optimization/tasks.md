# Tasks: Optimizacion de carga del catalogo y vista mayorista

**Input**: Design documents from `/specs/023-catalog-loading-optimization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se generan tareas de prueba dedicadas (no fueron solicitadas explicitamente en el spec). Las verificaciones usan las pruebas existentes (`products/tests_api.py`, `products/tests.py`) y el `npm run build` segun la convencion del proyecto.

**Organization**: Tareas agrupadas por user story para permitir implementacion y prueba independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Ejecutable en paralelo (distintos archivos, sin dependencias)
- **[Story]**: User story a la que pertenece (US1, US2, US3)
- Cada tarea incluye la ruta exacta del archivo

## Path Conventions

- **Web app**: `backend/` (Django + DRF) y `frontend/` (React + Vite)
- Backend: `backend/products/...`; Frontend: `frontend/src/...`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencia compartida para el procesamiento de imagenes

- [X] T001 Add Pillow dependency to `backend/requirements.txt` and install into `backend/.venv` (`Pillow>=11,<12`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de datos y helper de generacion que US2 (produce) y US3 (consume) requieren. US1 es independiente de esta fase.

**⚠️ NOTA**: US1 puede arrancar en paralelo con esta fase (no depende de ella). US2 y US3 requieren que esta fase termine.

- [X] T002 [P] Add `thumbnail`, `medium`, `large` ImageField (`upload_to="products/variants/"`, `null=True`, `blank=True`) to ProductImage in `backend/products/models.py`
- [X] T003 Create schema migration adding variant fields to ProductImage in `backend/products/migrations/` (depends T002)
- [X] T004 [P] Create Pillow variant generation helper (thumbnail 400px / medium 800px / large 1200px lado mayor, WebP calidad 80) in `backend/products/image_variants.py`

**Checkpoint**: Base de datos y helper listos. US2 puede implementar generacion/serializacion; US3 puede consumir las variantes una vez expuestas.

---

## Phase 3: User Story 1 - Buscador y paginacion mayorista (Priority: P1) 🎯 MVP

**Goal**: El mayorista ve el primer grupo de productos al instante y puede buscar de inmediato sin cargar toda la lista.

**Independent Test**: Abrir la vista mayorista, escribir en el buscador antes de que cargue toda la lista y verificar que aparecen resultados coincidentes consultando al backend.

### Implementation for User Story 1

- [X] T005 [US1] Replace `loadAllProducts` loop with paginated load (`page`, `hasMore`, `loadingMore` state) and "Cargar mas" button in `frontend/src/pages/WholesalerProductsPage.tsx`
- [X] T006 [US1] Wire debounced search to reset to `page=1` and query backend directly with in-flight cancellation (flag `active`) in `frontend/src/pages/WholesalerProductsPage.tsx` (depends T005, same file)

**Checkpoint**: La vista mayorista es paginada y el buscador responde de inmediato. Historia entregable y testeable de forma aislada (MVP).

---

## Phase 4: User Story 2 - Imagenes en tamano optimizado (Priority: P1)

**Goal**: El backend genera variantes optimizadas (miniatura/mediana/grande en WebP) al subir y migrar las existentes, exponiendo sus URLs en la API.

**Independent Test**: Tras crear un producto, `GET /api/products/{id}/` devuelve `thumbnail_url`, `medium_url`, `large_url`; tras ejecutar el comando, las ~205 imagenes existentes tienen variantes.

### Implementation for User Story 2

- [X] T007 [US2] Generate variants on create: call helper after image bulk_create in `create_product_with_images` in `backend/products/services.py` (depends T004)
- [X] T008 [US2] Regenerate variants when images are replaced in `update_product_with_images` in `backend/products/services.py` (depends T007, same file)
- [X] T009 [US2] Expose `thumbnail_url`, `medium_url`, `large_url` (SerializerMethodField with fallback to `image_url` when variant empty) in ProductImageSerializer in `backend/products/serializers.py`
- [X] T010 [US2] Add `representative_thumbnail_url` (with fallback to `representative_image_url`) to ProductSerializer in `backend/products/serializers.py` (depends T009, same file)
- [X] T011 [P] [US2] Create idempotent management command `generate_image_variants` (iterate ProductImage, fill missing variants, report failures and continue) in `backend/products/management/commands/generate_image_variants.py`

**Checkpoint**: El backend sirve variantes optimizadas via API y el comando migra las existentes. Testeable via API de forma aislada.

---

## Phase 5: User Story 3 - Carga diferida y responsiva (Priority: P2)

**Goal**: Las vistas publicas cargan solo las imagenes visibles, sin layout shift, usando la variante de tamano correcta.

**Independent Test**: En DevTools (Network, Slow 3G), las imagenes fuera de pantalla no se descargan hasta hacer scroll; las visibles sirven `.webp` pequenos; no hay saltos de layout.

### Implementation for User Story 3

- [X] T012 [US3] Add variant URL fields to `Product` (`representative_thumbnail_url`) and `ProductImage` (`thumbnail_url`, `medium_url`, `large_url`) in `frontend/src/api/types.ts` (depends on US2 API exposure)
- [X] T013 [P] [US3] Add `loading="lazy"`, width/height (or CSS `aspect-ratio`), and `srcset` using `representative_thumbnail_url` (fallback `representative_image_url`) in `frontend/src/components/PublicProductCard.tsx` (depends T012)
- [X] T014 [US3] Use `representative_thumbnail_url` + `loading="lazy"` for wholesaler table image in `frontend/src/pages/WholesalerProductsPage.tsx` (depends T005/T006 from US1 done, T012)
- [X] T015 [P] [US3] Use `large_url` for main image and `thumbnail_url` for gallery thumbnails, all with `loading="lazy"` and dimensions, in `frontend/src/pages/ProductDetailPage.tsx` (depends T012)

**Checkpoint**: Catalogo, mayorista y detalle cargan imagenes de forma diferida y responsiva.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificacion integral y validacion de criterios de exito

- [X] T016 [P] Run existing backend tests in `backend/` (`.venv/bin/python manage.py test products`)
- [X] T017 [P] Run frontend build in `frontend/` (`npm run build`)
- [X] T018 Run end-to-end validation per `specs/023-catalog-loading-optimization/quickstart.md` and confirm SC-001..SC-007

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — arranca de inmediato.
- **Foundational (Phase 2)**: Depende de T001 (Pillow). Bloquea a US2 y US3. **NO bloquea a US1**.
- **US1 (Phase 3)**: Sin dependencias de Foundational — puede arrancar en paralelo con Phase 2.
- **US2 (Phase 4)**: Depende de Foundational (T002-T004).
- **US3 (Phase 5)**: Depende de US2 (necesita las URLs de variantes en la API); T014 depende ademas de US1 (mismo archivo `WholesalerProductsPage.tsx`).
- **Polish (Phase 6)**: Depende de todas las historias deseadas completas.

### User Story Dependencies

- **US1 (P1)**: Independiente. MVP recomendado.
- **US2 (P1)**: Depende de Foundational. Independiente de US1.
- **US3 (P2)**: Depende de US2 (API de variantes) y de US1 para T014 (archivo compartido).

### Within Each User Story

- Helper/modelo antes de servicios; servicios antes de serializadores; API antes del consumo frontend; core antes de integracion.

### Parallel Opportunities

- T002 y T004 en paralelo (distintos archivos: `models.py` vs `image_variants.py`).
- T011 (comando) en paralelo con T007-T010 (distinto archivo).
- US1 entero en paralelo con Foundational/US2.
- T013 (`PublicProductCard.tsx`) y T015 (`ProductDetailPage.tsx`) en paralelo dentro de US3.
- T016 y T017 (polish) en paralelo.

---

## Parallel Example: User Story 2

```bash
# Tras Foundational, lanzar en paralelo los trabajos en archivos distintos:
Task: "Create idempotent management command generate_image_variants in backend/products/management/commands/generate_image_variants.py"
Task: "(Foundational paralelo) Create Pillow variant generation helper in backend/products/image_variants.py"
```

## Parallel Example: User Story 3

```bash
# Una vez definido types.ts (T012), lanzar en paralelo los componentes distintos:
Task: "Add lazy/srcset to PublicProductCard in frontend/src/components/PublicProductCard.tsx"
Task: "Use large/thumbnail variants + lazy in ProductDetailPage in frontend/src/pages/ProductDetailPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup) — opcional para MVP, US1 no lo necesita.
2. Completar Phase 3 (US1) — paginacion + buscador mayorista inmediato.
3. **STOP y VALIDAR**: probar buscador y paginacion de forma aislada.
4. Desplegar/demostrar si corresponde.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. Agregar US1 → testear → demo (MVP, mejora inmediata en mayorista).
3. Agregar US2 → testear via API → ejecutar comando de migracion → demo (imagenes optimizadas servidas).
4. Agregar US3 → testear → demo (lazy + responsivo en todas las vistas publicas).
5. Polish (build + tests + quickstart) → validacion de SC-001..SC-007.

### Parallel Team Strategy

Con varios desarrolladores:
1. Equipo completa Setup + Foundational.
2. En paralelo: Dev A → US1 (frontend), Dev B → US2 (backend).
3. Una vez US2 expone la API, Dev C → US3 (frontend).

---

## Notes

- [P] = distintos archivos, sin dependencias entre tareas incompletas.
- [Story] mapea la tarea a la user story para trazabilidad.
- Cada user story debe ser completable y testeable de forma independiente.
- Confirmar que el frontend `npm run build` y las pruebas backend pasan tras cada checkpoint.
- Commit por tarea o grupo logico.
- Evitar: tareas vagas, conflictos de mismo archivo en paralelo, dependencias cruzadas que rompan independencia.
