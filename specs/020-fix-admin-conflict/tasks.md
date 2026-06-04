# Tasks: Resolver conflicto de acceso admin

**Input**: Design documents from `/specs/020-fix-admin-conflict/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-route-ui.md, quickstart.md

**Tests**: No automated test tasks are generated because TDD or new automated tests were not explicitly requested. Verification is covered by build/check commands and manual route checks from quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or only reads/verifies state.
- **[Story]**: Maps a task to the user story that it delivers.
- Every task includes exact file paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current routing surfaces before changing behavior.

- [x] T001 Review backend admin registration in `backend/config/urls.py` and confirm `/admin/` is reserved for the backend administrative panel
- [x] T002 [P] Review frontend route declarations in `frontend/src/router/routes.tsx` and identify the current portal route using `/admin`
- [x] T003 [P] Review portal auth redirects in `frontend/src/router/guards.tsx` and confirm unauthenticated portal users go to `/login`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the non-conflicting route choice that all user stories use.

**Critical**: No user story work should begin until this route boundary is clear.

- [x] T004 Choose `/portal-admin` as the replacement portal administration route and document that choice in `frontend/src/router/routes.tsx`
- [x] T005 Confirm no backend route changes are required for the feature in `backend/config/urls.py`

**Checkpoint**: The route boundary is clear: backend owns `/admin/`, portal owns `/login` and `/portal-admin`.

---

## Phase 3: User Story 1 - Acceder al panel administrativo interno (Priority: P1) MVP

**Goal**: Administrators can visit the internal administrative panel without being redirected to the portal login.

**Independent Test**: Visit `/admin/` directly and verify the backend administrative login or panel appears instead of the portal login.

### Implementation for User Story 1

- [x] T006 [US1] Rename the protected frontend route from `/admin` to `/portal-admin` in `frontend/src/router/routes.tsx`
- [x] T007 [US1] Ensure the wildcard fallback in `frontend/src/router/routes.tsx` does not intentionally redirect `/admin/` to the portal login
- [x] T008 [US1] Run `python manage.py check` from `backend/` and resolve any admin routing errors reported for `backend/config/urls.py`

**Checkpoint**: User Story 1 is independently functional when `/admin/` no longer lands on the portal login.

---

## Phase 4: User Story 2 - Mantener login del portal de repuestos (Priority: P2)

**Goal**: Portal users still reach the portal login from `/login` and from protected portal routes.

**Independent Test**: Visit `/login` and a protected portal route without a portal session; both should show or redirect to the portal login.

### Implementation for User Story 2

- [x] T009 [US2] Verify the `/login` route remains unchanged in `frontend/src/router/routes.tsx`
- [x] T010 [US2] Verify `RequireAuth` and `RequireRole` continue redirecting unauthenticated portal users to `/login` in `frontend/src/router/guards.tsx`
- [x] T011 [US2] Run `npm run build` from `frontend/` and resolve any route or type errors reported for `frontend/src/router/routes.tsx` or `frontend/src/router/guards.tsx`

**Checkpoint**: User Story 2 is independently functional when the portal login flow still works after the admin route rename.

---

## Phase 5: User Story 3 - Evitar rutas ambiguas de administracion (Priority: P3)

**Goal**: Support and maintainers can distinguish internal administration routes from portal administration routes.

**Independent Test**: Check `/admin/`, `/login`, and `/portal-admin` and verify each route belongs to the expected audience and login flow.

### Implementation for User Story 3

- [x] T012 [US3] Update the inline route naming or component label for the portal admin placeholder in `frontend/src/router/routes.tsx` so it no longer suggests ownership of `/admin/`
- [x] T013 [US3] Verify `/portal-admin` remains protected by the admin role guard in `frontend/src/router/routes.tsx`
- [x] T014 [US3] Manually validate the route behavior described in `specs/020-fix-admin-conflict/contracts/admin-route-ui.md`

**Checkpoint**: All user stories are independently functional and the route ownership is no longer ambiguous.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across the feature.

- [x] T015 [P] Run the backend verification command from `specs/020-fix-admin-conflict/quickstart.md` and record any failures in `specs/020-fix-admin-conflict/quickstart.md`
- [x] T016 [P] Run the frontend verification command from `specs/020-fix-admin-conflict/quickstart.md` and record any failures in `specs/020-fix-admin-conflict/quickstart.md`
- [x] T017 Perform the manual browser checks for `/admin/`, `/login`, protected portal routes, and `/portal-admin` from `specs/020-fix-admin-conflict/quickstart.md`
- [x] T018 Review changed files `frontend/src/router/routes.tsx`, `frontend/src/router/guards.tsx`, and `backend/config/urls.py` to ensure no unrelated behavior was modified

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks user story implementation.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and can be validated after or alongside User Story 1.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and benefits from the route rename in User Story 1.
- **Polish (Phase 6)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on US2 or US3.
- **US2 (P2)**: Can start after Phase 2; verifies the existing portal login remains intact.
- **US3 (P3)**: Can start after Phase 2; final naming clarity depends on the non-conflicting portal route selected in Phase 2.

### Parallel Opportunities

- T002 and T003 can run in parallel during setup.
- T009 and T010 can run in parallel after the route rename is available.
- T015 and T016 can run in parallel during final verification.
- US2 validation can proceed in parallel with US3 cleanup once US1 has renamed the conflicting route.

---

## Parallel Example: User Story 2

```bash
Task: "Verify the /login route remains unchanged in frontend/src/router/routes.tsx"
Task: "Verify RequireAuth and RequireRole redirect to /login in frontend/src/router/guards.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Rename the frontend portal admin route from `/admin` to `/portal-admin`.
3. Verify `/admin/` reaches the backend administrative panel instead of the portal login.
4. Stop and validate the MVP before polishing route labels or broader manual checks.

### Incremental Delivery

1. Deliver US1 to unblock internal administrators.
2. Deliver US2 to confirm the portal login was not regressed.
3. Deliver US3 to remove naming ambiguity and complete route ownership validation.
4. Complete Phase 6 verification before considering the feature done.

### Parallel Team Strategy

1. One developer handles the route rename in `frontend/src/router/routes.tsx`.
2. Another developer validates portal redirects in `frontend/src/router/guards.tsx`.
3. A third reviewer runs backend/frontend verification and manual quickstart checks.

---

## Notes

- The primary code change is expected in `frontend/src/router/routes.tsx`.
- `backend/config/urls.py` should remain stable unless verification exposes an unexpected admin registration issue.
- Keep `/login` reserved for the portal and `/admin/` reserved for the backend administrative panel.
