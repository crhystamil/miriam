# Tasks: Costeo FIFO de inventario por lotes de compra

**Input**: Design documents from `/specs/014-fifo-inventory-costing/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

**Tests**: Incluidos. El proyecto usa `backend/.venv/bin/python manage.py test`.

**Organization**: Tasks grouped by user story. US1 (lotes), US2 (ventas FIFO), US3 (reversion), US4 (capital).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Agregar campos al schema y migracion de datos existentes

- [x] T001 Agregar campo `remaining = PositiveIntegerField(default=0)` al modelo `Purchase` en `backend/sales/models.py`
- [x] T002 Agregar campo `purchase = ForeignKey("sales.Purchase", on_delete=PROTECT, null=True, blank=True, related_name="sale_allocations")` al modelo `Sale` en `backend/sales/models.py`
- [x] T003 Generar migracion vacia con `python manage.py makemigrations sales --empty --name purchase_remaining_sale_purchase_fk` en `backend/sales/migrations/`
- [x] T004 Implementar migracion de datos en el archivo generado: (1) `Purchase.objects.update(remaining=F("quantity"))`, (2) crear lotes sinteticos para productos con stock > 0 sin compras, (3) asignar FK `purchase` a ventas existentes al lote mas antiguo disponible — en `backend/sales/migrations/0005_purchase_remaining_sale_purchase_fk.py`
- [x] T005 Ejecutar `python manage.py migrate` y verificar que no hay errores
- [ ] T005b Test post-migracion: verificar que todas las compras existentes tienen `remaining = quantity`, que productos con stock > 0 sin compras tienen lote sintetico, y que ventas existentes tienen FK `purchase` asignado — en `backend/sales/tests.py`

**Checkpoint**: Migracion aplicada y verificada. Compras tienen `remaining`, ventas tienen FK `purchase`, productos sin compras tienen lote sintetico.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Actualizar serializer de Purchase y logica de `register_purchase` para que los lotes funcionen

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Actualizar `PurchaseSerializer` para incluir campo `remaining` en fields y read_only_fields en `backend/sales/serializers.py`
- [x] T007 Actualizar servicio `register_purchase` para que (1) cree Purchase con `remaining=quantity`, (2) actualice `product.cost_price` al `unit_cost` del nuevo lote, (3) mantenga `product.stock += quantity` existente — en `backend/sales/services.py`
- [x] T008 [P] Actualizar tipo `Purchase` en `frontend/src/api/types.ts` para incluir campo `remaining`

**Checkpoint**: Compras crean lotes con `remaining` y actualizan `product.cost_price`. Serializer expone `remaining`.

---

## Phase 3: User Story 1 - Registrar compra como lote FIFO (Priority: P1)

**Goal**: Cada compra genera un lote con `remaining` rastreable y costo propio

**Independent Test**: Registrar compra via API y verificar `remaining == quantity` en respuesta y stock incrementado

### Implementation for User Story 1

- [ ] T009 [US1] Test: verificar que `register_purchase` crea Purchase con `remaining=quantity` y actualiza `product.stock` y `product.cost_price` — en `backend/sales/tests.py`
- [ ] T010 [US1] Test: verificar que dos compras del mismo producto a distinto costo crean dos lotes independientes — en `backend/sales/tests.py`
- [ ] T011 [US1] Test: verificar que compra con cantidad invalida es rechazada — en `backend/sales/tests.py`
- [ ] T011b [US1] Test: verificar que registrar compra sobre un producto con todos los lotes agotados (`remaining=0`) crea un nuevo lote activo y restaura el stock correctamente — en `backend/sales/tests.py`

**Checkpoint**: User Story 1 completo. Compras generan lotes FIFO con `remaining` y `cost_price` actualizado.

---

## Phase 4: User Story 2 - Vender unidad consumiendo lote FIFO (Priority: P1) 🎯 MVP

**Goal**: Ventas unitarias consumen del lote mas antiguo, `unit_cost_price = purchase.unit_cost` exacto

**Independent Test**: Comprar en dos lotes (10u@50, 5u@70), vender 1 unidad → `unit_cost_price=50`. Vender 10 veces → la venta 11 da `unit_cost_price=70`.

### Implementation for User Story 2

- [ ] T012 [US2] Test: verificar que venta unitaria consume del lote mas antiguo y asigna `unit_cost_price = purchase.unit_cost` — en `backend/sales/tests.py`
- [ ] T013 [US2] Test: verificar que al agotar lote A, la siguiente venta consume del lote B con su costo — en `backend/sales/tests.py`
- [ ] T014 [US2] Test: verificar que venta con todos los lotes agotados es rechazada con error — en `backend/sales/tests.py`
- [ ] T015 [US2] Test: verificar que enviar quantity != 1 es rechazado o forzado a 1 — en `backend/sales/tests.py`
- [ ] T015b [US2] Test: verificar que dos ventas secuenciales sobre un lote con `remaining=1` resultan en la primera exitosa y la segunda rechazada por stock insuficiente (validacion SC-003 concurrencia) — en `backend/sales/tests.py`
- [ ] T016 [US2] Reescribir servicio `register_sale` en `backend/sales/services.py`: forzar quantity=1, buscar lote mas antiguo con `remaining > 0` via `select_for_update`, asignar `sale.purchase = lote`, asignar `sale.unit_cost_price = lote.unit_cost`, decrementar `lote.remaining`, mantener `product.stock -= 1`
- [ ] T017 [US2] Actualizar `SaleSerializer` en `backend/sales/serializers.py`: forzar `quantity=1` en `create()`, el campo `purchase` ya se asigna en el servicio (read_only)
- [ ] T018 [P] [US2] Ajustar formulario de ventas en `frontend/src/pages/SalesPage.tsx`: eliminar campo de cantidad o fijarlo a 1 y ocultarlo

**Checkpoint**: User Story 2 completo. Ventas unitarias consumen lotes FIFO con costo exacto. MVP funcional.

---

## Phase 5: User Story 3 - Revertir venta y restaurar lote FIFO (Priority: P1)

**Goal**: Desactivar venta restaura 1 unidad al lote original via FK `sale.purchase`

**Independent Test**: Vender 1 unidad (lote A `remaining` baja a N-1), desactivar venta → lote A `remaining` vuelve a N, `product.stock` se restaura.

### Implementation for User Story 3

- [ ] T019 [US3] Test: verificar que desactivar venta restaura `remaining += 1` al lote asociado via `sale.purchase` — en `backend/sales/tests.py`
- [ ] T020 [US3] Test: verificar que desactivar venta ya desactivada no produce cambios — en `backend/sales/tests.py`
- [ ] T021 [US3] Test: verificar que despues de desactivar, `product.stock` coincide con suma de `remaining` de lotes — en `backend/sales/tests.py`
- [ ] T022 [US3] Reescribir servicio `deactivate_sale` en `backend/sales/services.py`: obtener lote via `sale.purchase` con `select_for_update`, incrementar `purchase.remaining += 1`, mantener `product.stock += 1` existente
- [ ] T023 [US3] Verificar que el endpoint `POST /api/sales/{id}/deactivate/` en `backend/sales/views.py` funciona sin cambios (ya llama a `deactivate_sale`)

**Checkpoint**: User Story 3 completo. Desactivar ventas restaura lotes correctamente. Inventario consistente.

---

## Phase 6: User Story 4 - Calcular capital inmovilizado (Priority: P2)

**Goal**: Endpoint que calcula `SUM(remaining × unit_cost)` de todos los lotes activos

**Independent Test**: Crear lotes con `remaining` conocido, consultar endpoint, verificar capital coincide con calculo manual.

### Implementation for User Story 4

- [ ] T024 [US4] Test: verificar que endpoint retorna capital correcto para un producto con multiples lotes — en `backend/core/tests_reports_api.py`
- [ ] T025 [US4] Test: verificar que endpoint agrega correctamente multiples productos — en `backend/core/tests_reports_api.py`
- [ ] T026 [US4] Implementar vista `InventoryCapitalView` (GET) en `backend/core/views.py`: permiso `IsAdminOrVendor`, calcular `total_capital` con `Sum(F("remaining") * F("unit_cost"), filter=Q(remaining__gt=0))` agrupado por producto, retornar `total_capital` y `by_product` con `product_id`, `product_name`, `product_sku`, `total_units`, `capital`
- [ ] T027 [US4] Registrar ruta `path("api/reports/inventory-capital/", InventoryCapitalView.as_view())` en `backend/config/urls.py`

**Checkpoint**: User Story 4 completo. Capital inmovilizado consultable via API.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verificacion integral y ajustes finales

- [ ] T028 Ejecutar `python manage.py check` y verificar sin errores en `backend/`
- [ ] T029 Ejecutar suite completa `python manage.py test` y verificar que todos los tests pasan (incluidos tests existentes de sales, core, cuts, products, expenses) en `backend/`
- [ ] T030 [P] Verificar que dashboard (`DashboardSummaryView`), reporte mensual (`MonthlyReportView`) y cortes (`build_monthly_cut_report`) funcionan correctamente con `unit_cost_price` FIFO — sin cambios de codigo, solo verificacion funcional en `backend/core/views.py` y `backend/cuts/services.py`
- [ ] T031 Ejecutar validacion completa del quickstart: registrar compra, verificar `remaining`, registrar venta, verificar `unit_cost_price` FIFO, desactivar venta, verificar restauracion, consultar capital — segun `specs/014-fifo-inventory-costing/quickstart.md`
- [ ] T032 [P] Actualizar `frontend/src/api/types.ts` si el tipo `Sale` necesita campo `purchase` adicional para uso futuro

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — agregar campos y migracion
- **Foundational (Phase 2)**: Depends on Setup — actualizar serializer y servicio de compras
- **User Story 1 (Phase 3)**: Depends on Foundational — tests de lotes de compra
- **User Story 2 (Phase 4)**: Depends on Foundational — motor FIFO de ventas
- **User Story 3 (Phase 5)**: Depends on US2 completado (necesita que `sale.purchase` FK exista y funcione)
- **User Story 4 (Phase 6)**: Depends on US1 completado (necesita `Purchase.remaining` poblado)
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) — no depende de otros stories
- **US2 (P1)**: Can start after Foundational (Phase 2) — no depende de US1
- **US3 (P1)**: Depends on US2 — necesita que `sale.purchase` FK funcione para revertir
- **US4 (P2)**: Depends on US1 — necesita `Purchase.remaining` para calcular capital

### Within Each User Story

- Tests first, then implementation
- Service changes before serializer/view changes
- Backend before frontend

### Parallel Opportunities

- T009, T010, T011, T011b (US1 tests) can run in parallel
- T012, T013, T014, T015, T015b (US2 tests) can run in parallel
- T019, T020, T021 (US3 tests) can run in parallel
- T024, T025 (US4 tests) can run in parallel
- T018 (frontend SalesPage) can run in parallel with T016 (backend register_sale)
- T032 (frontend types) can run in parallel with T030 (verification)

---

## Parallel Example: User Story 2

```bash
# Launch all US2 tests together:
Task T012: "Test venta unitaria consume lote mas antiguo"
Task T013: "Test agotar lote A pasa a lote B"
Task T014: "Test venta con lotes agotados rechazada"
Task T015: "Test quantity != 1 rechazado"
Task T015b: "Test segunda venta sobre lote con remaining=1 rechazada"

# Then implement (sequential):
Task T016: "Reescribir register_sale service"
Task T017: "Actualizar SaleSerializer"

# In parallel with backend:
Task T018: "Ajustar SalesPage.tsx frontend"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (migracion)
2. Complete Phase 2: Foundational (serializer + servicio de compras)
3. Complete Phase 3: US1 (tests de lotes)
4. Complete Phase 4: US2 (motor FIFO ventas) → **MVP funcional**
5. **STOP and VALIDATE**: Registrar compra, vender, verificar costo FIFO

### Incremental Delivery

1. Setup + Foundational → Lotes operativos
2. Add US1 → Tests de compras FIFO → Validar
3. Add US2 → Motor FIFO de ventas → **MVP!** → Validar
4. Add US3 → Reversion de ventas → Validar inventario consistente
5. Add US4 → Capital inmovilizado → Validar reportes
6. Polish → Verificacion integral

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1 and US2 can be developed in parallel after Foundational
- US3 depends on US2 (needs sale.purchase FK working)
- US4 depends on US1 (needs Purchase.remaining populated)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
