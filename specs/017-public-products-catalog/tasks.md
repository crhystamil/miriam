# Tasks: Catalogo publico con productos reales

**Input**: Design documents from `/specs/017-public-products-catalog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/public-products.md, quickstart.md

**Tests**: Include backend API coverage and frontend build/manual validation tasks because the plan identifies `manage.py test products`, `npm run build`, and guest catalog validation as required checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or does not depend on incomplete tasks.
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4).
- Each task includes exact file paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current product API and frontend public catalog boundaries before story work.

- [X] T001 Review current `/api/products/` read behavior and active-product filtering in `backend/products/views.py`
- [X] T002 [P] Review existing product response fields and image URL fields in `backend/products/serializers.py`
- [X] T003 [P] Review current static public catalog usage in `frontend/src/data/publicCatalog.ts`, `frontend/src/pages/CatalogPage.tsx`, `frontend/src/pages/ProductDetailPage.tsx`, and `frontend/src/pages/LandingPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared product client capabilities and API safety checks required by all public catalog stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Add or update unauthenticated product API tests for list pagination, active-only list behavior, and retrieve behavior in `backend/products/tests_api.py`
- [X] T005 Add a single-product fetch helper for `/api/products/{id}/` in `frontend/src/api/products.ts`
- [X] T006 Add public-facing product image fallback handling plan as constants or local helpers in `frontend/src/components/PublicProductCard.tsx`
- [X] T007 Confirm product/image TypeScript fields support public catalog usage in `frontend/src/api/types.ts`
- [X] T008 Run backend product API tests after foundational changes using `backend/manage.py`

**Checkpoint**: Product API access and frontend client primitives are ready for public pages.

---

## Phase 3: User Story 1 - Ver catalogo real como invitado (Priority: P1) MVP

**Goal**: A guest opens `/catalog` and sees active registered products with progressive browsing instead of static sample products.

**Independent Test**: Visit `/catalog` without logging in, verify real active products appear, verify no sample product names from `publicCatalog.ts` appear, and verify additional products can be loaded when available.

### Tests for User Story 1

- [X] T009 [US1] Extend unauthenticated list coverage for first page and active-only results in `backend/products/tests_api.py`

### Implementation for User Story 1

- [X] T010 [US1] Replace static catalog state with API-backed loading state in `frontend/src/pages/CatalogPage.tsx`
- [X] T011 [US1] Implement progressive "Cargar mas" behavior using paginated `next` state in `frontend/src/pages/CatalogPage.tsx`
- [X] T012 [US1] Render loading, error, empty catalog, and loaded product states in `frontend/src/pages/CatalogPage.tsx`
- [X] T013 [US1] Update `PublicProductCard` to accept real `Product` data and render only public-facing fields in `frontend/src/components/PublicProductCard.tsx`
- [X] T014 [US1] Remove catalog dependency on product samples from `frontend/src/pages/CatalogPage.tsx`
- [X] T015 [US1] Manually validate guest catalog MVP using `specs/017-public-products-catalog/quickstart.md`

**Checkpoint**: User Story 1 is fully functional and independently testable as MVP.

---

## Phase 4: User Story 2 - Buscar productos reales (Priority: P2)

**Goal**: A guest searches registered products from `/catalog`, with results coming from the product API rather than local static filtering.

**Independent Test**: Register or identify a known active product, search for its name as a guest, verify it appears, then search for a nonexistent term and verify the no-results state.

### Tests for User Story 2

- [X] T016 [US2] Extend unauthenticated search coverage for matching and non-matching terms in `backend/products/tests_api.py`

### Implementation for User Story 2

- [X] T017 [US2] Wire the catalog search input to API search requests in `frontend/src/pages/CatalogPage.tsx`
- [X] T018 [US2] Reset accumulated catalog results and pagination when search text changes in `frontend/src/pages/CatalogPage.tsx`
- [X] T019 [US2] Render distinct no-results and clear-search behavior for searches in `frontend/src/pages/CatalogPage.tsx`
- [X] T020 [US2] Manually validate guest search behavior using `specs/017-public-products-catalog/quickstart.md`

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - Ver detalle de producto real (Priority: P3)

**Goal**: A guest opens a product detail page backed by a real registered product and sees public product information, images, and contact action.

**Independent Test**: Open a product from the API-backed catalog, verify detail data matches the registered product, verify gallery/fallback behavior, and verify invalid or inactive product access shows a safe not-found state.

### Tests for User Story 3

- [X] T021 [US3] Add unauthenticated retrieve coverage for active product detail and inactive/not-found behavior in `backend/products/tests_api.py`

### Implementation for User Story 3

- [X] T022 [US3] Replace static product lookup with API-backed product detail loading in `frontend/src/pages/ProductDetailPage.tsx`
- [X] T023 [US3] Render loading, error, not-found, and product detail states in `frontend/src/pages/ProductDetailPage.tsx`
- [X] T024 [US3] Render representative image, gallery images, and image fallback from real product data in `frontend/src/pages/ProductDetailPage.tsx`
- [X] T025 [US3] Ensure detail view and WhatsApp message do not render internal product fields in `frontend/src/pages/ProductDetailPage.tsx`
- [X] T026 [US3] Manually validate real product detail behavior using `specs/017-public-products-catalog/quickstart.md`

**Checkpoint**: User Story 3 is independently functional and integrated with catalog navigation.

---

## Phase 6: User Story 4 - Ver productos destacados reales en inicio (Priority: P4)

**Goal**: A guest sees real active products in the home page featured section, or no fake products when none are available.

**Independent Test**: Visit `/` as a guest, verify featured products exist in the real catalog, and verify static sample products are not shown as inventory.

### Implementation for User Story 4

- [X] T027 [US4] Replace static featured product source with first-page product API data in `frontend/src/pages/LandingPage.tsx`
- [X] T028 [US4] Render featured loading, empty, and product states without showing fake inventory in `frontend/src/pages/LandingPage.tsx`
- [X] T029 [US4] Manually validate home featured products using `specs/017-public-products-catalog/quickstart.md`

**Checkpoint**: Public home page and catalog use the same real product source.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and safeguards across all public product surfaces.

- [X] T030 [P] Remove unused product sample exports or stale imports from `frontend/src/data/publicCatalog.ts`
- [X] T031 [P] Audit public product screens for accidental rendering of `cost_price`, `fifo_cost_price`, `wholesale_reference_price`, `stock`, or `sku` in `frontend/src/pages/CatalogPage.tsx`, `frontend/src/pages/ProductDetailPage.tsx`, `frontend/src/pages/LandingPage.tsx`, and `frontend/src/components/PublicProductCard.tsx`
- [X] T032 Run frontend production build validation with `frontend/package.json`
- [X] T033 Run backend product test validation with `backend/manage.py`
- [X] T034 Execute full quickstart validation and record any deviations in `specs/017-public-products-catalog/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational; can be implemented after or alongside US1 but integrates into `CatalogPage`.
- **User Story 3 (Phase 5)**: Depends on Foundational; benefits from US1 navigation but can be tested directly by URL.
- **User Story 4 (Phase 6)**: Depends on Foundational; can be implemented independently of US2/US3.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Required MVP; no dependency on other stories after Foundational.
- **US2 (P2)**: Uses the catalog page changed in US1; safest after US1, but independently testable by search behavior.
- **US3 (P3)**: Uses product fetch helper from Foundational; can be tested directly with a known product ID.
- **US4 (P4)**: Uses product list client from Foundational; independent of detail/search.

### Parallel Opportunities

- T002 and T003 can run in parallel during Setup.
- US3 and US4 can start after Foundational if different developers avoid editing shared product-card code concurrently.
- T030 and T031 can run in parallel during Polish if coordinated after story work.

---

## Parallel Example: User Story 3

```text
Task: "Add unauthenticated retrieve coverage for active product detail and inactive/not-found behavior in backend/products/tests_api.py"
Task: "Replace static product lookup with API-backed product detail loading in frontend/src/pages/ProductDetailPage.tsx"
```

## Parallel Example: User Story 4

```text
Task: "Replace static featured product source with first-page product API data in frontend/src/pages/LandingPage.tsx"
Task: "Audit public product screens for accidental rendering of internal fields in frontend public files"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate `/catalog` as a guest before adding search/detail/home changes.

### Incremental Delivery

1. Deliver US1 so the catalog shows real active products.
2. Add US2 so guests can search real products.
3. Add US3 so product detail pages use real data.
4. Add US4 so home featured products use real data.
5. Run final build, backend tests, and quickstart validation.

### Notes

- Keep `/api/products/` as the product data source for this feature.
- Do not add database migrations for this feature.
- Do not show internal pricing or inventory-management fields in public UI.
- Keep each story independently verifiable using the criteria above.
