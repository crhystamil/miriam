# Tasks: Refrescar descripcion de producto en modal de venta

**Input**: Design documents from `/specs/015-sale-modal-refresh/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

## Phase 1: User Story 1 - Descripcion de producto se actualiza tras cada venta (P1)

**Goal**: Al registrar una venta exitosa, el modal permanece abierto y la descripcion del producto (stock, costo FIFO) se actualiza automaticamente.

**Independent Test**: Abrir modal, registrar venta, verificar que la descripcion muestra stock reducido y costo FIFO actualizado sin cerrar el modal.

### Implementation

- [X] T001 [US1] En `frontend/src/pages/SalesPage.tsx`: extraer la logica de recarga de productos a una funcion `loadProducts()` reutilizable (actualmente inline en el `useEffect` de carga inicial). La funcion debe hacer `getProducts({ page: 1 })` y llamar `setProducts(productList.results)`.
- [X] T002 [US1] En `frontend/src/pages/SalesPage.tsx`: reemplazar el bloque de exito en `submitCreateSale()` — eliminar `closeSaleModal()`, agregar `setNewPrice("")`, `setNewNotes("")`, y llamar a la nueva `loadProducts()` para recargar la descripcion del producto.
- [X] T003 [US1] En `frontend/src/pages/SalesPage.tsx`: actualizar el `useEffect` de carga inicial de productos para usar la nueva funcion `loadProducts()` en vez del codigo inline duplicado.

**Checkpoint**: Registrar multiples ventas consecutivas del mismo producto sin cerrar el modal, verificando que el stock y costo FIFO se actualizan tras cada venta.

---

## Phase 2: Polish

- [ ] T004 Verificar manualmente el flujo completo: abrir modal, registrar 3+ ventas consecutivas, verificar stock decrementa y costo FIFO cambia al agotar un lote.

---

## Dependencies & Execution Order

### Task Dependencies

- T001 no tiene dependencias
- T002 depende de T001 (usa `loadProducts()`)
- T003 depende de T001 (usa `loadProducts()`)
- T004 depende de T002, T003

### Parallel Opportunities

- T002 y T003 pueden ejecutarse en paralelo despues de T001

---

## Implementation Strategy

### MVP (solo US1)

1. T001: Extraer `loadProducts()`
2. T002 + T003: Modificar `submitCreateSale()` y el `useEffect`
3. T004: Validacion manual

---

## Notes

- Un solo archivo modificado: `frontend/src/pages/SalesPage.tsx`
- Sin cambios de backend
- Sin tests automatizados (validacion manual visual)
