# Tasks: Quitar compra desde productos

**Input**: Design documents from `/specs/018-remove-product-purchase-form/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-ui.md, quickstart.md

**Tests**: Automated tests are not required by the spec. Include frontend build validation and manual checks from quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or does not depend on incomplete tasks.
- **[Story]**: Which user story this task belongs to (US1, US2).
- Each task includes exact file paths.

## Phase 1: Setup (Shared Understanding)

**Purpose**: Confirm the duplicated purchase UI and the dedicated purchases flow before edits.

- [X] T001 Review duplicated purchase form state, handler, import, and JSX in `frontend/src/pages/ProductsPage.tsx`
- [X] T002 [P] Review dedicated purchase creation flow remains present in `frontend/src/pages/PurchasesPage.tsx`
- [X] T003 [P] Review UI acceptance contract in `specs/018-remove-product-purchase-form/contracts/admin-ui.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Identify exact removal boundaries so product management and purchases remain separate.

**CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 Identify all `createPurchase` usage and purchase-only state in `frontend/src/pages/ProductsPage.tsx`
- [X] T005 Confirm `createPurchase` remains used by the dedicated purchases screen in `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: It is clear which code belongs to the duplicate products-page purchase flow and which code belongs to the valid purchases page.

---

## Phase 3: User Story 1 - Administrar productos sin formulario de compra duplicado (Priority: P1) MVP

**Goal**: Administrators can manage products without seeing or using purchase registration controls inside the products section.

**Independent Test**: Open products as an administrator and verify there is no purchase form, no purchase product selector, no purchase quantity/cost fields, no purchase submit button, and product CRUD still works.

### Implementation for User Story 1

- [X] T006 [US1] Remove `createPurchase` import from `frontend/src/pages/ProductsPage.tsx`
- [X] T007 [US1] Remove purchase-specific state variables from `frontend/src/pages/ProductsPage.tsx`
- [X] T008 [US1] Remove purchase product preselection logic from `loadProducts` in `frontend/src/pages/ProductsPage.tsx`
- [X] T009 [US1] Remove `submitPurchase` handler from `frontend/src/pages/ProductsPage.tsx`
- [X] T010 [US1] Remove the "Registrar compra" heading and purchase form JSX from `frontend/src/pages/ProductsPage.tsx`
- [X] T011 [US1] Adjust products page subtitle/copy so it does not imply purchase registration in `frontend/src/pages/ProductsPage.tsx`
- [X] T012 [US1] Verify product creation/editing modal, filters, table, and product actions still render in `frontend/src/pages/ProductsPage.tsx`

**Checkpoint**: Products administration no longer exposes purchase registration and still supports product management.

---

## Phase 4: User Story 2 - Registrar compras solo desde el area de compras (Priority: P2)

**Goal**: The dedicated purchases section remains the only place to register purchases.

**Independent Test**: Open purchases as an administrator, verify "Nueva compra" still opens the purchase modal, and verify product, quantity, cost, and description fields remain available.

### Implementation for User Story 2

- [X] T013 [US2] Confirm `createPurchase` import and submit flow remain intact in `frontend/src/pages/PurchasesPage.tsx`
- [X] T014 [US2] Confirm product selection, quantity, unit cost, description, and submit button remain present in `frontend/src/pages/PurchasesPage.tsx`
- [X] T015 [US2] Confirm no permissions or navigation changes are needed for purchases in `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: Purchases remain registrable only from the purchases section.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup.

- [X] T016 Audit products page for remaining purchase-only labels or variables in `frontend/src/pages/ProductsPage.tsx`
- [X] T017 [P] Run frontend production build validation using `frontend/package.json`
- [X] T018 Execute manual products and purchases checks from `specs/018-remove-product-purchase-form/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks implementation.
- **US1 (Phase 3)**: Depends on Foundational; this is the MVP.
- **US2 (Phase 4)**: Depends on Foundational; can be verified after US1 removal.
- **Polish (Phase 5)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Required MVP; removes the duplicate products-page purchase form.
- **US2 (P2)**: Validates the dedicated purchases flow remains available; depends on no code changes unless regression is found.

### Parallel Opportunities

- T002 and T003 can run in parallel with T001.
- T017 can run after implementation while T018 manual checks are prepared.

---

## Parallel Example: Setup

```text
Task: "Review dedicated purchase creation flow remains present in frontend/src/pages/PurchasesPage.tsx"
Task: "Review UI acceptance contract in specs/018-remove-product-purchase-form/contracts/admin-ui.md"
```

## Parallel Example: Polish

```text
Task: "Run frontend production build validation using frontend/package.json"
Task: "Execute manual products and purchases checks from specs/018-remove-product-purchase-form/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete US1 by removing all purchase registration UI/code from products.
3. Validate products page still manages products.

### Incremental Delivery

1. Remove duplicate purchase controls from products.
2. Verify purchases page remains the only purchase registration flow.
3. Run frontend build and manual quickstart checks.

### Notes

- Do not modify backend purchase behavior for this feature.
- Do not remove the purchases page or its modal.
- Do not change product or purchase data models.
