# Quickstart: Refrescar descripcion de producto en modal de venta

## Prerequisitos

- FIFO implementado (spec 014) con `fifo_cost_price` en ProductSerializer
- `getProducts()` disponible en `frontend/src/api/products.ts`

## Pasos de implementacion

### Paso 1: Modificar `submitCreateSale()` en `SalesPage.tsx`

Ubicar el bloque de exito en `submitCreateSale()` (linea ~190):

**Antes:**
```typescript
setSuccess("Venta creada correctamente.")
closeSaleModal()
setPage(1)
await loadSales()
```

**Despues:**
```typescript
setSuccess("Venta creada correctamente.")
setNewPrice("")
setNewNotes("")
const productList = await getProducts({ page: 1 })
setProducts(productList.results)
setPage(1)
await loadSales()
```

### Paso 2: Verificar

1. Abrir el modal de venta
2. Seleccionar un producto con stock
3. Registrar una venta
4. Verificar que:
   - El modal permanece abierto
   - El stock en la descripcion se redujo en 1
   - El costo FIFO se actualizo si corresponde
   - El campo de precio esta vacio
   - El producto y mayorista siguen seleccionados
5. Registrar otra venta del mismo producto sin cerrar el modal
6. Verificar que el stock se redujo nuevamente

## Archivos modificados

- `frontend/src/pages/SalesPage.tsx` — unico archivo
