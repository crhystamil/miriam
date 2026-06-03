# Research: Refrescar descripcion de producto en modal de venta

## R1: Como mantener el modal abierto tras venta exitosa

**Decision**: Eliminar la llamada a `closeSaleModal()` en el bloque de exito de `submitCreateSale()` y reemplazarla con una recarga de productos.

**Rationale**: El codigo actual en `SalesPage.tsx:191` llama `closeSaleModal()` tras venta exitosa, lo cual cierra el modal, resetea el formulario, y cambia el producto seleccionado. Para permitir ventas consecutivas, solo necesitamos: (1) recargar productos del servidor, (2) resetear el precio de venta, (3) mantener el modal abierto con el mismo producto seleccionado.

**Alternatives considered**:
- Crear un estado separado `isRefreshing` para mostrar loading en el panel de descripcion — innecesario, el `submittingSale` ya cubre el periodo de espera.

## R2: Estrategia de recarga de datos del producto

**Decision**: Reutilizar la funcion `getProducts()` existente para recargar toda la lista de productos tras cada venta.

**Rationale**: La lista de productos es pequena (decenas de items). Recargar toda la lista es mas simple que crear un endpoint individual, y asegura que todos los datos (stock, fifo_cost_price, precios) esten sincronizados. La funcion `getProducts({ page: 1 })` ya existe y funciona.

**Alternatives considered**:
- Crear endpoint `GET /api/products/:id/` para recargar solo el producto seleccionado — sobre-ingenieria para este caso.
- Mutar el estado local del producto restando stock manualmente — fragil, no refleja el costo FIFO real del servidor ni cambios por otros usuarios.

## R3: Que campos resetear tras venta exitosa

**Decision**: Resetear solo `newPrice` y `newNotes`. Mantener producto seleccionado, mayorista, y busqueda.

**Rationale**: El vendedor normalmente registra multiples ventas del mismo producto al mismo mayorista. Solo el precio de venta y notas cambian entre ventas. El campo `newQuantity` ya esta fijo en "1" y no necesita cambios.

**Alternatives considered**:
- Resetear todo incluyendo producto y mayorista — requiere mas clicks por parte del vendedor, reduciendo velocidad.
- No resetear nada — riesgo de enviar el mismo precio dos veces por error.
