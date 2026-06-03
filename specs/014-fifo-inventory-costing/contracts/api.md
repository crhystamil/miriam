# API Contracts: Costeo FIFO de inventario por lotes de compra

**Feature**: `014-fifo-inventory-costing` | **Date**: 2026-06-03

## Contratos modificados

### POST /api/purchases/ (compras)

**Cambios**: El campo `remaining` se agrega a la respuesta. No cambia el request.

**Request** (sin cambios):
```json
{
  "product": 1,
  "quantity": 10,
  "unit_cost": "50.00",
  "notes": ""
}
```

**Response 201** (campo nuevo `remaining`):
```json
{
  "id": 15,
  "product": 1,
  "product_name": "Filtro de aceite",
  "quantity": 10,
  "remaining": 10,
  "unit_cost": "50.00",
  "purchased_at": "2026-06-03T10:00:00-04:00",
  "notes": ""
}
```

### POST /api/sales/ (ventas)

**Cambios**: `unit_cost_price` ahora viene del lote FIFO (no de `product.cost_price`). `quantity` se fuerza a 1. Nuevo campo `purchase` en respuesta.

**Request** (quantity ignorado, se fuerza a 1):
```json
{
  "product": 1,
  "vendor": 2,
  "wholesaler": 1,
  "quantity": 1,
  "unit_sale_price": "80.00",
  "notes": ""
}
```

**Response 201** (`unit_cost_price` ahora es `purchase.unit_cost` exacto):
```json
{
  "id": 42,
  "product": 1,
  "product_name": "Filtro de aceite",
  "vendor": 2,
  "vendor_username": "vendedor1",
  "wholesaler": 1,
  "wholesaler_name": "Mayorista ABC",
  "wholesaler_phone": "70012345",
  "quantity": 1,
  "unit_sale_price": "80.00",
  "unit_wholesale_reference_price": "65.00",
  "unit_cost_price": "50.00",
  "sold_at": "2026-06-03T10:05:00-04:00",
  "is_active": true,
  "notes": "",
  "store_profit": "15.00",
  "vendor_profit": "15.00"
}
```

### POST /api/sales/{id}/deactivate/ (desactivar venta)

**Cambios**: Internamente restaura 1 unidad al lote via FK `sale.purchase`. La respuesta no cambia.

**Response 200** (sin cambios):
```json
{
  "id": 42,
  "is_active": false,
  "...": "..."
}
```

## Nuevo contrato

### GET /api/reports/inventory-capital/

**Descripcion**: Calcula el capital total invertido en inventario activo.

**Permisos**: IsAdminOrVendor

**Query params**: ninguno

**Response 200**:
```json
{
  "total_capital": "1450.00",
  "by_product": [
    {
      "product_id": 1,
      "product_name": "Filtro de aceite",
      "product_sku": "PRD260603-0042",
      "total_units": 8,
      "capital": "450.00"
    },
    {
      "product_id": 2,
      "product_name": "Bujia NGK",
      "product_sku": "PRD260603-0031",
      "total_units": 20,
      "capital": "1000.00"
    }
  ]
}
```

## Contratos sin cambios

Los siguientes endpoints no modifican su contrato:

- `GET /api/products/` — `cost_price` sigue presente pero ahora es un valor de referencia (ultimo lote)
- `GET /api/purchases/` — listado incluye campo `remaining` nuevo
- `GET /api/sales/` — `unit_cost_price` refleja el costo FIFO congelado al momento de la venta
- `GET /api/reports/dashboard/` — usa `unit_cost_price` de ventas (ya FIFO)
- `GET /api/reports/monthly/` — usa `unit_cost_price` de ventas (ya FIFO)
- `GET /api/cuts/{id}/report/` — usa `unit_cost_price` de ventas (ya FIFO)
