# Tasks: Actualizar contacto y WhatsApp

**Input**: Design documents from `/specs/019-contact-whatsapp-update/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests were explicitly requested. Validation tasks use the quickstart manual checks and `npm run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks
- **[Story]**: Which user story this task belongs to, for example [US1], [US2], [US3]
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm current frontend contact surfaces before implementation.

- [X] T001 Inspect existing public contact and WhatsApp usages in frontend/src/pages/ContactPage.tsx, frontend/src/components/PublicLayout.tsx, frontend/src/components/PublicProductCard.tsx, and frontend/src/pages/ProductDetailPage.tsx
- [X] T002 [P] Confirm the Google Maps iframe source and contact values from specs/019-contact-whatsapp-update/spec.md before editing frontend/src/pages/ContactPage.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared contact source used by all public pages and components.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 Create shared contact constants with whatsappDisplay, whatsappLinkNumber, facebookUrl, address, and mapEmbedSrc in frontend/src/data/publicContact.ts
- [X] T004 Add a shared WhatsApp URL builder that encodes optional message text in frontend/src/data/publicContact.ts

**Checkpoint**: Shared contact data and WhatsApp URL creation are ready for public UI integration.

---

## Phase 3: User Story 1 - Ver datos de contacto actualizados (Priority: P1) [MVP]

**Goal**: Visitors see the updated WhatsApp number, address, Facebook URL, and Google Maps location on the contact page.

**Independent Test**: Open `/contact` and verify the visible phone, address, Facebook link, map iframe, and fallback textual address match the provided contact data.

### Implementation for User Story 1

- [X] T005 [US1] Import shared contact constants in frontend/src/pages/ContactPage.tsx
- [X] T006 [US1] Replace hardcoded contact phone, address, and Facebook values with shared constants in frontend/src/pages/ContactPage.tsx
- [X] T007 [US1] Replace the map iframe with the provided Google Maps embed source, accessible title, lazy loading, and referrer policy in frontend/src/pages/ContactPage.tsx
- [X] T008 [US1] Verify the textual address remains visible outside the iframe in frontend/src/pages/ContactPage.tsx
- [X] T009 [US1] Manually validate User Story 1 using specs/019-contact-whatsapp-update/quickstart.md against frontend/src/pages/ContactPage.tsx

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Enviar formulario de contacto por WhatsApp (Priority: P2)

**Goal**: Visitors can submit the contact form and open WhatsApp with a readable prefilled message containing their entered information.

**Independent Test**: Fill the contact form, click the submit button, and verify WhatsApp opens for `59161617345` with the entered fields; submit with missing required fields and verify a clear validation prompt appears instead.

### Implementation for User Story 2

- [X] T010 [US2] Convert the contact form fields to controlled React state in frontend/src/pages/ContactPage.tsx
- [X] T011 [US2] Add required-field validation and a visible validation message in frontend/src/pages/ContactPage.tsx
- [X] T012 [US2] Build a readable WhatsApp message containing all provided form values in frontend/src/pages/ContactPage.tsx
- [X] T013 [US2] Wire the form submit action to open the shared WhatsApp URL for `59161617345` without backend submission in frontend/src/pages/ContactPage.tsx
- [X] T014 [US2] Manually validate User Story 2 using specs/019-contact-whatsapp-update/quickstart.md against frontend/src/pages/ContactPage.tsx

**Checkpoint**: User Stories 1 and 2 work independently without backend storage or email delivery.

---

## Phase 5: User Story 3 - Usar accesos de contacto desde otras partes publicas (Priority: P3)

**Goal**: Public WhatsApp entry points outside the contact page use the same updated number.

**Independent Test**: Inspect the public layout, product cards, and product detail page and verify every WhatsApp link points to `https://wa.me/59161617345` with any product message preserved.

### Implementation for User Story 3

- [X] T015 [P] [US3] Update the public layout direct WhatsApp CTA and visible footer phone to shared contact constants in frontend/src/components/PublicLayout.tsx
- [X] T016 [P] [US3] Update product card WhatsApp links to use the shared WhatsApp URL builder while preserving product-specific text in frontend/src/components/PublicProductCard.tsx
- [X] T017 [P] [US3] Update product detail WhatsApp links to use the shared WhatsApp URL builder while preserving product-specific text in frontend/src/pages/ProductDetailPage.tsx
- [X] T018 [US3] Search for remaining old WhatsApp numbers and update any public customer-facing matches in frontend/src
- [X] T019 [US3] Manually validate User Story 3 using specs/019-contact-whatsapp-update/quickstart.md against frontend/src/components/PublicLayout.tsx, frontend/src/components/PublicProductCard.tsx, and frontend/src/pages/ProductDetailPage.tsx

**Checkpoint**: All public WhatsApp contact surfaces use the updated number consistently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all stories.

- [X] T020 [P] Review contact copy and external link attributes for clarity and safe new-tab behavior in frontend/src/pages/ContactPage.tsx and frontend/src/components/PublicLayout.tsx
- [X] T021 Run frontend production build with `npm run build` from frontend/package.json
- [X] T022 Confirm quickstart acceptance checks are complete and document any residual manual validation notes in specs/019-contact-whatsapp-update/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and modifies the same contact page as US1, so implement after US1 for the lowest merge risk.
- **User Story 3 (Phase 5)**: Depends on Foundational and can proceed in parallel with US1/US2 if file ownership is coordinated.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on US2 or US3.
- **User Story 2 (P2)**: Starts after Foundational; independent behavior, but same file as US1.
- **User Story 3 (P3)**: Starts after Foundational; independent files except shared constants.

### Within Each User Story

- Shared constants before any component integration.
- Contact page display updates before contact form behavior when working sequentially.
- Core implementation before manual validation.
- Story complete before moving to the next priority in a single-developer workflow.

### Parallel Opportunities

- T002 can run in parallel with T001.
- T015, T016, and T017 can run in parallel after T003 and T004 because they touch different files.
- US3 can be implemented while US1/US2 continue if only the shared constants contract is already stable.
- T020 can run in parallel with documentation validation once all implementation tasks are complete.

---

## Parallel Example: User Story 3

```bash
Task: "Update the public layout direct WhatsApp CTA and visible footer phone to shared contact constants in frontend/src/components/PublicLayout.tsx"
Task: "Update product card WhatsApp links to use the shared WhatsApp URL builder while preserving product-specific text in frontend/src/components/PublicProductCard.tsx"
Task: "Update product detail WhatsApp links to use the shared WhatsApp URL builder while preserving product-specific text in frontend/src/pages/ProductDetailPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational shared contact constants.
3. Complete Phase 3: User Story 1 contact page display.
4. Stop and validate `/contact` manually against the provided phone, address, Facebook URL, and map.

### Incremental Delivery

1. Deliver US1 so public contact data is correct.
2. Deliver US2 so the form opens WhatsApp with a readable message.
3. Deliver US3 so product and layout WhatsApp links use the same updated number.
4. Run final build and quickstart validation.

### Parallel Team Strategy

1. Complete T003 and T004 first.
2. Assign ContactPage display tasks to one developer.
3. Assign product/layout WhatsApp link tasks to another developer.
4. Coordinate final validation and build after all files are updated.

---

## Notes

- [P] tasks touch different files or can be completed independently after prerequisites.
- No backend tasks are included because FR-010 forbids requiring backend storage or email delivery for contact submissions.
- Preserve existing public visual style unless a small change is required for validation feedback or accessibility.
