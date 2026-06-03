# Tasks: Modal de nueva compra con descripcion

**Input**: Design documents from `/specs/016-purchase-modal-description/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests were explicitly requested. Include technical validation with backend tests and frontend build in Polish.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- All descriptions include exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current surfaces and existing support for purchase notes.

- [X] T001 Inspect existing purchase serializer fields and note support in `backend/sales/serializers.py`
- [X] T002 Inspect existing purchase API helpers and `CreatePurchaseInput` in `frontend/src/api/sales.ts`
- [X] T003 Inspect existing `Purchase` frontend type including `notes` in `frontend/src/api/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No schema or API contract migration is required; existing `Purchase.notes` is reused.

- [X] T004 Confirm no migration is needed for purchase description because `Purchase.notes` already exists in `backend/sales/models.py`

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Registrar compra desde modal (Priority: P1) MVP

**Goal**: Admin can open a "Nueva compra" modal, enter product, quantity, unit cost, and optional description, then submit successfully.

**Independent Test**: In the purchases section, click "Nueva compra", complete all fields including description, save, and verify purchase registration succeeds.

### Implementation for User Story 1

- [X] T005 [US1] Add purchase modal state (`isPurchaseModalOpen`) and purchase notes state (`newNotes`) in `frontend/src/pages/PurchasesPage.tsx`
- [X] T006 [US1] Add open/close/reset helper functions for the purchase modal in `frontend/src/pages/PurchasesPage.tsx`
- [X] T007 [US1] Replace the inline purchase form with a "Nueva compra" button for admin users in `frontend/src/pages/PurchasesPage.tsx`
- [X] T008 [US1] Render a modal containing product, quantity, unit cost, description, cancel, and submit controls in `frontend/src/pages/PurchasesPage.tsx`
- [X] T009 [US1] Include `notes: newNotes` in the `createPurchase` payload inside `submitCreatePurchase` in `frontend/src/pages/PurchasesPage.tsx`
- [X] T010 [US1] Keep the modal open and preserve validation feedback on failed purchase submit in `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: US1 is independently testable with purchase creation through modal.

---

## Phase 4: User Story 2 - Ver compra nueva en la tabla actualizada (Priority: P1)

**Goal**: After a successful purchase, the table refreshes automatically and shows the new purchase and description.

**Independent Test**: Register a purchase from the modal and verify it appears in the table without manual page refresh.

### Implementation for User Story 2

- [X] T011 [US2] After successful `createPurchase`, reset purchase form fields, close the modal, set page to 1, and reload purchases in `frontend/src/pages/PurchasesPage.tsx`
- [X] T012 [US2] Add a "Descripcion" column that displays `row.notes` or a fallback in the purchases table in `frontend/src/pages/PurchasesPage.tsx`
- [X] T013 [US2] Ensure success and field error messages remain visible outside the modal after purchase submission in `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: US2 is independently testable by observing the refreshed table after a successful purchase.

---

## Phase 5: User Story 3 - Ordenar compras de mas recientes a mas antiguas (Priority: P2)

**Goal**: Purchases are listed newest-first, including after a new purchase is registered.

**Independent Test**: Register two purchases and verify the newest purchase appears before the earlier one.

### Implementation for User Story 3

- [X] T014 [US3] Order `PurchaseViewSet.queryset` by `-purchased_at` and `-id` in `backend/sales/views.py`
- [X] T015 [US3] Verify frontend table uses backend result order without client-side reordering in `frontend/src/pages/PurchasesPage.tsx`

**Checkpoint**: US3 is independently testable by loading purchases and verifying newest-first ordering.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate implementation and keep documentation/task state aligned.

- [X] T016 Run frontend build with `npm run build` from `frontend/`
- [X] T017 Run backend sales API tests with `.venv/bin/python manage.py test sales -v 2` from `backend/`
- [ ] T018 Manually verify quickstart flow in `specs/016-purchase-modal-description/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1 completion
- **US1 (Phase 3)**: Depends on Phase 2 completion; MVP
- **US2 (Phase 4)**: Depends on US1 because it updates the modal submit success flow
- **US3 (Phase 5)**: Can start after Phase 2, but final validation is best after US2
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies after foundation
- **US2 (P1)**: Depends on US1 submit flow
- **US3 (P2)**: Independent backend ordering, but validates best with US2 table refresh

### Parallel Opportunities

- T001, T002, and T003 can be reviewed in parallel during setup
- T014 can be implemented independently of frontend modal tasks after T004
- T016 and T017 can run independently after implementation is complete

---

## Parallel Example: User Story 3

```bash
# Backend ordering can be implemented while frontend modal work continues:
Task: "Order PurchaseViewSet.queryset by -purchased_at and -id in backend/sales/views.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundation (T001-T004)
2. Complete US1 modal creation (T005-T010)
3. Stop and validate: admin can register a purchase from the modal

### Incremental Delivery

1. US1: Modal purchase registration works
2. US2: Table refreshes and shows description
3. US3: Backend returns purchases newest-first
4. Polish: Build/test/manual verification

### Notes

- No model migration expected
- `Purchase.notes` is the canonical description field
- Keep permissions unchanged: purchase creation remains admin-only
