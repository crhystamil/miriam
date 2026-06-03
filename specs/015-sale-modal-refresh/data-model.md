# Data Model: Refrescar descripcion de producto en modal de venta

## Sin cambios de modelo

Esta feature no agrega ni modifica modelos de datos. Utiliza la infraestructura existente:

- **Product** (ya existe): Contiene `stock`, `fifo_cost_price`, `wholesale_reference_price`, `public_price`, etc.
- **ProductSerializer** (ya existe): Ya expone `fifo_cost_price` como campo calculado.
- **getProducts()** (ya existe): Funcion frontend que obtiene lista de productos desde `/api/products/`.

## Flujo de datos modificado

```text
Antes:
  submitCreateSale() → createSale() → closeSaleModal() → loadSales()
                                             ↑ cierra modal

Despues:
  submitCreateSale() → createSale() → reloadProducts() → resetPriceAndNotes() → loadSales()
                                             ↑ mantiene modal abierto
                                             ↑ actualiza descripcion del producto
```

## Estado del componente afectado

| Estado | Antes | Despues |
|--------|-------|---------|
| `newPrice` | Reseteado via `resetSaleDraft()` | Reseteado directamente a `""` |
| `newNotes` | Reseteado via `resetSaleDraft()` | Reseteado directamente a `""` |
| `newProduct` | Reseteado via `closeSaleModal()` | **Sin cambio** (mantiene seleccion) |
| `newWholesaler` | Reseteado via `resetSaleDraft()` | **Sin cambio** (mantiene seleccion) |
| `isSaleModalOpen` | Cerrado via `closeSaleModal()` | **Sin cambio** (mantiene abierto) |
| `products` | Sin recarga | **Recargado desde servidor** |
