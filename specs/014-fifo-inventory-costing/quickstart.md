# Quickstart: Costeo FIFO de inventario por lotes de compra

**Feature**: `014-fifo-inventory-costing` | **Date**: 2026-06-03

## Prerequisitos

- Branch `001-iam-repuestos-system` activo
- Backend con migraciones aplicadas (`python manage.py migrate`)
- Al menos un producto creado

## Cambios que se aplican

1. **Migracion**: Agrega `remaining` a `Purchase`, FK `purchase` en `Sale`, genera lotes sinteticos, asigna ventas existentes a lotes.
2. **Servicio `register_purchase`**: Inicializa `remaining = quantity`, actualiza `product.cost_price` al costo del lote nuevo.
3. **Servicio `register_sale`**: Fuerza `quantity=1`, busca lote mas antiguo con `remaining > 0`, consume 1 unidad, asigna `unit_cost_price = purchase.unit_cost`.
4. **Servicio `deactivate_sale`**: Restaura `remaining` del lote asociado via FK `sale.purchase`.
5. **Frontend `SalesPage.tsx`**: Oculta o fija campo quantity a 1.
6. **Nuevo endpoint**: `GET /api/reports/inventory-capital/` para capital inmovilizado.

## Verificacion rapida

### 1. Aplicar migracion

```bash
cd backend
.venv/bin/python manage.py migrate
```

Verificar que las compras existentes tienen `remaining = quantity`:
```bash
.venv/bin/python manage.py shell -c "
from sales.models import Purchase
for p in Purchase.objects.all()[:5]:
    print(f'Purchase #{p.id}: qty={p.quantity} remaining={p.remaining}')
"
```

### 2. Registrar compra (lote FIFO)

```bash
curl -X POST http://localhost:8000/api/purchases/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"product": 1, "quantity": 10, "unit_cost": "50.00"}'
```

Verificar que `remaining == quantity` en la respuesta.

### 3. Registrar segunda compra a precio distinto

```bash
curl -X POST http://localhost:8000/api/purchases/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"product": 1, "quantity": 5, "unit_cost": "70.00"}'
```

### 4. Vender 1 unidad (consume lote mas antiguo)

```bash
curl -X POST http://localhost:8000/api/sales/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"product": 1, "vendor": 2, "wholesaler": 1, "quantity": 1, "unit_sale_price": "80.00"}'
```

Verificar que `unit_cost_price == "50.00"` (del primer lote).

### 5. Vender 10 veces mas (agotar primer lote)

Despues de 10 ventas, la venta 11 debe mostrar `unit_cost_price == "70.00"` (del segundo lote).

### 6. Consultar capital inmovilizado

```bash
curl http://localhost:8000/api/reports/inventory-capital/ -b cookies.txt
```

Verificar que `total_capital` refleja el stock restante con su costo real.

### 7. Ejecutar tests

```bash
cd backend
.venv/bin/python manage.py test sales -v 2
```

## Comportamiento esperado

| Operacion | Efecto en lotes | Efecto en `product.cost_price` |
|-----------|-----------------|-------------------------------|
| Crear producto | Sin lotes hasta primera compra | Se define manualmente |
| Registrar compra | Nuevo lote `remaining=quantity` | Se actualiza al `unit_cost` del lote |
| Vender (1 unidad) | Consume del lote mas viejo, `remaining -= 1` | Sin cambio |
| Desactivar venta | `sale.purchase.remaining += 1` | Sin cambio |
| Consultar capital | Agregacion de `remaining × unit_cost` | N/A |
