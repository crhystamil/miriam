# Feature Specification: Costeo FIFO de inventario por lotes de compra

**Feature Branch**: `[014-fifo-inventory-costing]`
**Created**: 2026-06-02
**Status**: Draft
**Input**: User description: "implementar costeo FIFO (First In, First Out) para el inventario de productos, donde cada compra genera un lote con costo unitario propio y las ventas son unitarias consumiendo del lote mas antiguo primero, reflejando el costo real exacto del lote en cada venta y permitiendo calculo exacto de capital inmovilizado en inventario."

## Clarifications

### Session 2026-06-02

- Q: Cada venta puede consumir de multiples lotes a la vez? → A: No. Las ventas son unitarias (quantity=1), cada venta consume exactamente de un lote. No existe consumo multi-lote ni costo ponderado.
- Q: Que pasa con el campo `product.cost_price` actual? → A: Se mantiene por compatibilidad pero deja de ser la fuente de verdad para el costo; la fuente pasa a ser el lote FIFO.
- Q: Se necesita una tabla o vista nueva para ver lotes? → A: No es parte de esta especificacion; los lotes son internos del motor de costeo pero pueden exponerse en futuras iteraciones.
- Q: Las compras existentes (pre-FIFO) como se tratan? → A: Se requiere una migracion que convierta las compras existentes en lotes FIFO asignando `remaining = quantity`.
- Q: Se puede seguir vendiendo con quantity > 1? → A: No. La restriccion es parte del cambio: quantity en ventas siempre es 1, lo que simplifica todo el motor FIFO a un FK directo de Sale a Purchase.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar compra como lote FIFO (Priority: P1)

Como administrador, quiero que cada compra registre un lote con costo unitario propio para que el sistema sepa exactamente cuanto costo cada grupo de unidades ingresadas.

**Why this priority**: Sin lotes no existe FIFO. Es la base sobre la que funciona todo lo demas.

**Independent Test**: Registrar una compra de producto y verificar que el registro de compra tiene `remaining` igual a `quantity` y que el stock del producto incremento correctamente.

**Acceptance Scenarios**:

1. **Given** que el administrador registra una compra de 10 unidades a Bs. 50, **When** se guarda la compra, **Then** se crea un lote con `quantity=10`, `remaining=10`, `unit_cost=50.00` y el `product.stock` aumenta en 10.
2. **Given** que el administrador registra una segunda compra del mismo producto a Bs. 70, **When** se guarda, **Then** el producto tiene dos lotes activos con costos distintos y el stock refleja la suma de ambas cantidades.
3. **Given** que se registra una compra con cantidad o costo invalidos, **When** se intenta guardar, **Then** el sistema rechaza la operacion con error de validacion.

---

### User Story 2 - Vender unidad consumiendo lote FIFO (Priority: P1)

Como administrador/vendedor, quiero que al registrar una venta unitaria el sistema consuma una unidad del lote mas antiguo para que el costo reflejado en la venta sea el exacto de ese lote.

**Why this priority**: Es el comportamiento central de FIFO. Sin esto los lotes no tienen efecto en el calculo de ganancias.

**Independent Test**: Comprar un producto en dos lotes (10u a Bs. 50, 5u a Bs. 70), luego vender 1 unidad y verificar que la venta registra `unit_cost_price=50.00` (del primer lote). Vender 10 veces y verificar que la venta 11 registra `unit_cost_price=70.00` (del segundo lote).

**Acceptance Scenarios**:

1. **Given** un producto con un solo lote de 10u a Bs. 50, **When** se vende 1 unidad, **Then** la venta registra `unit_cost_price=50.00`, el lote queda con `remaining=9` y `product.stock` disminuye en 1.
2. **Given** un producto con lote A (remaining=1, cost=50) y lote B (remaining=5, cost=70), **When** se vende 1 unidad, **Then** la venta consume del lote A, `unit_cost_price=50.00`, lote A queda en `remaining=0`. La siguiente venta consume del lote B con `unit_cost_price=70.00`.
3. **Given** un producto con stock insuficiente (todos los lotes agotados), **When** se intenta registrar una venta, **Then** el sistema rechaza con error de stock insuficiente.
4. **Given** que se intenta registrar una venta con quantity distinto de 1, **When** se envia el request, **Then** el sistema rechaza con error de validacion indicando que las ventas son unitarias.

---

### User Story 3 - Revertir venta y restaurar lote FIFO (Priority: P1)

Como administrador, quiero que al desactivar una venta la unidad vuelva a su lote original para mantener consistencia en el inventario.

**Why this priority**: Sin reversion correcta, desactivar ventas corrompe el inventario. Misma prioridad que la venta porque son dos caras de la misma moneda.

**Independent Test**: Vender una unidad consumiendo un lote, desactivar la venta y verificar que el lote recupera su `remaining` y el stock del producto se restaura.

**Acceptance Scenarios**:

1. **Given** una venta que consumo 1 unidad del lote A (cost=50), **When** se desactiva la venta, **Then** el lote A recupera +1 en `remaining` y `product.stock` aumenta en 1.
2. **Given** una venta ya desactivada, **When** se intenta desactivar nuevamente, **Then** el sistema no realiza cambios.

---

### User Story 4 - Calcular capital inmovilizado en inventario (Priority: P2)

Como administrador, quiero poder consultar el capital total invertido en el inventario actual para saber cuanto dinero tengo inmovilizado en stock.

**Why this priority**: El FIFO permite calcular esto con precision (suma de remaining × unit_cost por lote). Es un beneficio directo de tener lotes pero no bloquea la operacion diaria.

**Independent Test**: Tener lotes con stock remanente, consultar el endpoint y verificar que el capital coincide con la suma manual de cada lote.

**Acceptance Scenarios**:

1. **Given** un producto con lote A (remaining=3, cost=50) y lote B (remaining=2, cost=70), **When** se consulta el capital de inventario, **Then** el resultado es Bs. 290.00 (3×50 + 2×70).
2. **Given** multiples productos con lotes activos, **When** se consulta el capital total, **Then** el sistema agrega todos los lotes activos de todos los productos.

---

### Edge Cases

- Que ocurre si se intenta vender cuando todos los lotes del producto estan agotados (remaining=0).
- Que ocurre si se desactiva una venta cuyo lote original fue eliminado (Purchase con PROTECT lo impide).
- Que pasa si dos ventas concurrentes intentan consumir la ultima unidad del mismo lote simultaneamente.
- Como se comporta el sistema con productos creados antes de FIFO que tienen `cost_price` pero no tienen compras registradas.
- Que ocurre si se intenta registrar una venta con quantity > 1.
- Que pasa cuando todos los lotes de un producto estan agotados y se registra una nueva compra.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST agregar un campo `remaining` al modelo `Purchase` que rastrea las unidades no vendidas de cada lote.
- **FR-002**: El sistema MUST inicializar `remaining = quantity` al crear cada compra nueva.
- **FR-003**: El sistema MUST agregar un campo `purchase` (FK) al modelo `Sale` que indica de que lote se consumo la unidad vendida.
- **FR-004**: El sistema MUST forzar `quantity = 1` en todas las ventas nuevas registradas via el motor FIFO.
- **FR-005**: El sistema MUST consumir la unidad del lote mas antiguo con `remaining > 0` (ordenado por `purchased_at` ascendente) al registrar una venta.
- **FR-006**: El sistema MUST asignar `unit_cost_price = purchase.unit_cost` directamente (sin calculo ponderado) al registrar una venta.
- **FR-007**: El sistema MUST decrementar `remaining` del lote consumido en 1 al registrar una venta, dentro de una transaccion atomica con `select_for_update`.
- **FR-008**: El sistema MUST restaurar `remaining` del lote asociado en 1 al desactivar una venta, dentro de una transaccion atomica.
- **FR-009**: El sistema MUST rechazar ventas cuando no existan lotes con `remaining > 0` para el producto.
- **FR-010**: El sistema MUST mantener `product.stock` sincronizado con la suma de `remaining` de todos los lotes activos del producto.
- **FR-011**: El sistema MUST incluir una migracion de datos que asigne `remaining = quantity` a todas las compras existentes y asigne `purchase` a las ventas existentes al lote mas antiguo del producto.
- **FR-012**: El sistema MUST mantener el campo `product.cost_price` existente por compatibilidad de lectura pero actualizarlo al costo del lote mas reciente para referencia.
- **FR-013**: El sistema MUST proveer un endpoint de capital inmovilizado como la suma de `remaining × unit_cost` de todos los lotes activos.
- **FR-014**: El sistema MUST garantizar consistencia atomica en todas las operaciones de consumo y restauracion de lotes usando transacciones de base de datos.
- **FR-015**: El sistema MUST impedir condiciones de carrera en el consumo de lotes usando bloqueo de fila (`select_for_update`).

### Key Entities *(include if feature involves data)*

- **Lote de compra (Purchase)**: Registro de ingreso de stock con `quantity` (total original), `remaining` (unidades no vendidas), `unit_cost` (costo unitario del lote) y `purchased_at` (fecha para orden FIFO).
- **Venta (Sale)**: Ahora incluye FK `purchase` que indica de que lote se consumo. `unit_cost_price` se copia directamente de `purchase.unit_cost`.
- **Capital inmovilizado**: Calculo derivado de la suma de `remaining × unit_cost` de todos los lotes con stock remanente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de ventas registradas consume del lote mas antiguo con `remaining > 0` y refleja `unit_cost_price = purchase.unit_cost` exacto.
- **SC-002**: El 100% de desactivaciones de venta restaura correctamente 1 unidad al lote asociado.
- **SC-003**: En validacion de concurrencia, el 100% de ventas simultaneas sobre el mismo lote se resuelven sin inconsistencias.
- **SC-004**: El 100% de compras existentes (pre-FIFO) queda con `remaining = quantity` tras la migracion.
- **SC-005**: El capital inmovilizado calculado coincide al 100% con la suma manual de `remaining × unit_cost` de todos los lotes activos.
- **SC-006**: El 100% de las ganancias de tienda (`store_profit`) reportadas en dashboard, cortes mensuales y reportes usa el costo FIFO real de la venta.
- **SC-007**: El `product.stock` coincide al 100% con la suma de `remaining` de sus lotes activos tras cada operacion.

## Assumptions

- El modelo `Purchase` ya existe y ya registra `quantity`, `unit_cost` y `purchased_at`; solo se agrega `remaining`.
- El modelo `Sale` ya existe y ya registra `unit_cost_price`; se agrega FK `purchase` y se forza `quantity = 1`.
- Los productos creados antes de esta feature que tienen `cost_price` pero no compras registradas necesitan tratamiento especial en la migracion (crear un lote sintetico con el stock actual al costo registrado).
- El campo `product.cost_price` se mantiene como campo de referencia visual pero ya no es la fuente de verdad para calculos de ganancia.
- La desactivacion de ventas usa el FK `purchase` de la venta para saber a que lote devolver la unidad — no se necesita modelo intermedio.
- Los permisos existentes (admin para compras, admin+vendor para ventas) se mantienen sin cambios.
- El frontend necesita ajuste menor: el formulario de ventas debe enviar `quantity=1` fijo o el backend debe ignorar el valor enviado.
- El corte mensual existente no requiere cambios ya que utiliza `unit_cost_price` ya registrado en cada venta.
