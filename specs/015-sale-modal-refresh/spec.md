# Feature Specification: Refrescar descripcion de producto en modal de venta

**Feature Branch**: `[015-sale-modal-refresh]`
**Created**: 2026-06-03
**Status**: Draft
**Input**: User description: "cuando se registra una nueva venta, debemos recargar el modal, donde se ve el formulario y la descripcion del producto, ya que si registro de manera constante ventas, y ya estoy registrando ventas de otro lote no se actualiza la descripcion del producto."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descripcion de producto se actualiza tras cada venta (Priority: P1)

Como vendedor, quiero que al registrar una venta y mantener el modal abierto, la descripcion del producto se actualice automaticamente para reflejar el nuevo stock y costo FIFO correcto del proximo lote a consumir.

**Why this priority**: Sin esto, el vendedor ve informacion desactualizada (stock y costo FIFO erroneos) al registrar ventas consecutivas, lo que genera confusion sobre el estado real del inventario.

**Independent Test**: Abrir el modal de venta, registrar una venta, y verificar que la descripcion del producto muestra el stock reducido y el costo FIFO actualizado sin cerrar el modal.

**Acceptance Scenarios**:

1. **Given** que el modal de venta esta abierto con un producto seleccionado que tiene stock=10 y costo FIFO=Bs. 50, **When** se registra una venta exitosa, **Then** la descripcion del producto se actualiza automaticamente mostrando stock=9 y el costo FIFO correspondiente al lote mas antiguo con unidades restantes.
2. **Given** que se registra una venta que agota el lote FIFO actual, **When** la venta se completa, **Then** la descripcion del producto muestra el costo FIFO del siguiente lote disponible.
3. **Given** que se registra una venta que agota todo el stock del producto, **When** la venta se completa, **Then** la descripcion del producto muestra stock=0 y el costo FIFO refleja que no hay lotes disponibles.

---

### Edge Cases

- Que ocurre si la peticion de recarga del producto falla por error de red.
- Que ocurre si el producto queda sin stock y el vendedor intenta registrar otra venta sin cambiar de producto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST recargar los datos del producto seleccionado desde el servidor inmediatamente despues de cada venta exitosa registrada desde el modal.
- **FR-002**: El sistema MUST actualizar la descripcion del producto (stock, costo FIFO, precios) en el panel lateral del modal tras la recarga.
- **FR-003**: El sistema MUST mantener el modal abierto y el producto seleccionado despues de una venta exitosa para permitir ventas consecutivas rapidas.
- **FR-004**: El sistema MUST mantener el campo de precio de venta vacio (o el valor por defecto) tras cada venta para evitar errores de precio en la siguiente venta.

### Key Entities

- **Producto seleccionado**: El producto actualmente visible en el modal de venta. Su informacion (stock, costo FIFO, precios) debe refrescarse desde el servidor tras cada venta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las veces que se registra una venta exitosa, la descripcion del producto se actualiza en menos de 2 segundos mostrando el stock y costo FIFO correctos.
- **SC-002**: Un vendedor puede registrar 10 ventas consecutivas del mismo producto sin cerrar el modal, viendo el stock decrementar correctamente en cada iteracion.
- **SC-003**: Al agotarse un lote FIFO y cambiar al siguiente, el costo FIFO mostrado cambia automaticamente al nuevo costo del lote.

## Assumptions

- El modal de venta ya existe y ya muestra la descripcion del producto con el campo `fifo_cost_price`.
- La lista de productos ya se carga desde el servidor al abrir la pagina.
- La accion de recarga consiste en volver a obtener la lista de productos y actualizar el estado del producto seleccionado.
- El comportamiento de cierre automatico del modal tras venta (si existe) debe cambiarse a mantener abierto para permitir ventas consecutivas.
