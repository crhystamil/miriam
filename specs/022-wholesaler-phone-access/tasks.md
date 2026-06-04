# Tasks: Acceso por celular para mayoristas

**Input**: Design documents from `/specs/022-wholesaler-phone-access/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/wholesaler-phone-access-ui.md, quickstart.md

**Tests**: No automated test tasks are generated because TDD or new automated tests were not explicitly requested. Verification is covered by `npm run build` and manual acceptance checks from quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or only reads/verifies state.
- **[Story]**: Maps a task to the user story that it delivers.
- Every task includes exact file paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the target mayorista route and existing frontend structure before adding access control.

- [x] T001 Review existing public and protected routes in `frontend/src/router/routes.tsx` to identify where the mayorista products view should be mounted
- [x] T002 [P] Review current route guard patterns in `frontend/src/router/guards.tsx` for consistency with the new mayorista access guard
- [x] T003 [P] Review existing frontend state patterns in `frontend/src/state/auth.tsx` before adding `frontend/src/state/wholesalerAccess.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared phone access state and validation used by every mayorista route.

**Critical**: No user story work should begin until temporary access state and validation rules are available.

- [x] T004 Create `frontend/src/state/wholesalerAccess.tsx` with session-based state for phone number, access enabled status, and clear access action
- [x] T005 Add phone normalization and validation helpers for empty, incomplete, invalid, and valid numbers in `frontend/src/state/wholesalerAccess.tsx`
- [x] T006 Export a provider and access hook from `frontend/src/state/wholesalerAccess.tsx` for use by routes and access UI
- [x] T007 Wrap application routes with the wholesaler access provider in `frontend/src/main.tsx`

**Checkpoint**: Shared access state exists and can be consumed by guards and pages.

---

## Phase 3: User Story 1 - Ingresar con numero de celular (Priority: P1) MVP

**Goal**: A mayorista can enter a valid phone number and immediately see the mayorista products view without username or password.

**Independent Test**: Open the mayorista route, enter a valid phone number, and verify the mayorista products view is shown during the same session.

### Implementation for User Story 1

- [x] T008 [US1] Create `frontend/src/pages/WholesalerAccessPage.tsx` with phone input, submit action, and success path to mayorista content
- [x] T009 [US1] Create `frontend/src/router/guards.tsx` guard component for mayorista routes that shows `WholesalerAccessPage` until access is enabled
- [x] T010 [US1] Add the mayorista products route wrapper in `frontend/src/router/routes.tsx` so mayorista content is behind the phone access guard
- [x] T011 [US1] Ensure valid phone access persists across page refresh during the same browser session using `frontend/src/state/wholesalerAccess.tsx`

**Checkpoint**: User Story 1 is independently functional when valid phone entry unlocks the mayorista view without credentials.

---

## Phase 4: User Story 2 - Bloquear acceso sin numero valido (Priority: P2)

**Goal**: Mayorista information remains hidden when no valid phone number has been entered.

**Independent Test**: Try empty, incomplete, invalid, and direct internal mayorista access; verify content remains hidden and messages are clear.

### Implementation for User Story 2

- [x] T012 [US2] Display empty-number, incomplete-number, and invalid-format messages in `frontend/src/pages/WholesalerAccessPage.tsx`
- [x] T013 [US2] Prevent mayorista content rendering without enabled access in `frontend/src/router/guards.tsx`
- [x] T014 [US2] Ensure direct mayorista route entry is guarded in `frontend/src/router/routes.tsx`
- [x] T015 [US2] Add a visible abandon or back option that keeps mayorista content hidden in `frontend/src/pages/WholesalerAccessPage.tsx`

**Checkpoint**: User Story 2 is independently functional when invalid or missing phone numbers never reveal mayorista content.

---

## Phase 5: User Story 3 - Informar uso del numero (Priority: P3)

**Goal**: Mayoristas understand why the phone number is requested and that no username or password is needed.

**Independent Test**: Review the access screen and verify the explanatory copy is visible before submitting the phone number.

### Implementation for User Story 3

- [x] T016 [US3] Add copy explaining that the phone number enables mayorista access in `frontend/src/pages/WholesalerAccessPage.tsx`
- [x] T017 [US3] Add copy stating no username or password is required in `frontend/src/pages/WholesalerAccessPage.tsx`
- [x] T018 [US3] Ensure access-screen copy remains readable on desktop and mobile in `frontend/src/styles.css`

**Checkpoint**: All user stories are independently functional and the access request is understandable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final build, manual validation, and cleanup across the feature.

- [x] T019 [P] Run `npm run build` from `frontend/` and resolve any errors in `frontend/src/state/wholesalerAccess.tsx`, `frontend/src/pages/WholesalerAccessPage.tsx`, `frontend/src/router/guards.tsx`, or `frontend/src/router/routes.tsx`
- [x] T020 Perform the manual validation steps from `specs/022-wholesaler-phone-access/quickstart.md`
- [x] T021 Review changed files `frontend/src/state/wholesalerAccess.tsx`, `frontend/src/pages/WholesalerAccessPage.tsx`, `frontend/src/router/guards.tsx`, `frontend/src/router/routes.tsx`, `frontend/src/main.tsx`, and `frontend/src/styles.css` for unrelated changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks user story implementation.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can start after the guard route exists.
- **User Story 3 (Phase 5)**: Depends on the access page from US1.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on US2 or US3.
- **US2 (P2)**: Can start after Phase 2, but final validation depends on the route guard introduced by US1.
- **US3 (P3)**: Can start once `frontend/src/pages/WholesalerAccessPage.tsx` exists.

### Parallel Opportunities

- T002 and T003 can run in parallel during setup.
- T004 and T005 should be sequential because they touch the same state file.
- T012 and T014 can be worked on in parallel after T009 and T010.
- T016 and T018 can be parallelized after the access page exists because they touch different files.
- T019 can run while T020 is prepared, but final completion requires both.

---

## Parallel Example: User Story 3

```bash
Task: "Add copy stating no username or password is required in frontend/src/pages/WholesalerAccessPage.tsx"
Task: "Ensure access-screen copy remains readable on desktop and mobile in frontend/src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Create the phone access page and mayorista route guard.
3. Mount the mayorista route behind the guard.
4. Validate that a valid phone number unlocks the mayorista view without credentials.

### Incremental Delivery

1. Deliver US1 to enable simple access by phone.
2. Deliver US2 to harden invalid and direct-access cases.
3. Deliver US3 to improve user trust and clarity.
4. Complete Phase 6 verification before considering the feature done.

### Parallel Team Strategy

1. One developer implements access state in `frontend/src/state/wholesalerAccess.tsx`.
2. Another developer builds the access page in `frontend/src/pages/WholesalerAccessPage.tsx` after state helpers are available.
3. A reviewer validates routing and quickstart behavior after integration.

---

## Notes

- This is intentionally a light access barrier, not strong authentication.
- Do not add accounts, passwords, SMS verification, or backend persistence unless a later specification requires it.
- Keep all mayorista product content behind the same access guard.
