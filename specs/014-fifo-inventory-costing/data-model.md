# Data Model: Costeo FIFO de inventario por lotes de compra

**Feature**: `014-fifo-inventory-costing` | **Date**: 2026-06-03

## Cambios en modelos existentes

### Purchase (modificacion)

```text
Model: sales.Purchase
Cambios: agregar campo `remaining`
```

| Campo | Tipo | Cambio | Descripcion |
|-------|------|--------|-------------|
| `remaining` | PositiveIntegerField | NUEVO | Unidades no vendidas del lote. Inicializado igual a `quantity` al crear. Decrementado en 1 al vender, restaurado en 1 al desactivar venta. |

Validaciones:
- `remaining >= 0` (nunca negativo)
- `remaining <= quantity` (nunca excede el original)

### Sale (modificacion)

```text
Model: sales.Sale
Cambios: agregar FK `purchase`, forzar `quantity = 1`
```

| Campo | Tipo | Cambio | Descripcion |
|-------|------|--------|-------------|
| `purchase` | ForeignKey → Purchase | NUEVO | Lote del que se consumo la unidad vendida. `on_delete=PROTECT` impide eliminar lotes con ventas. `related_name="sale_allocations"`. |
| `quantity` | PositiveIntegerField | SIN CAMBIO de schema | Valor forzado a 1 por el servicio `register_sale`. |

El campo `unit_cost_price` ya existe y es `read_only`. Con FIFO, el servicio asigna `unit_cost_price = purchase.unit_cost` directamente.

## Sin modelos nuevos

No se crean modelos intermedios. Las ventas unitarias hacen innecesario un modelo `SaleLot` — el FK directo en `Sale` resuelve el rastreo.

## Relaciones

```text
Product 1──N Purchase (lotes de compra, cada uno con remaining)
Product 1──N Sale (ventas, cada una unitaria)
Sale     N──1 Purchase (FK directo: de que lote se consumo)
```

```text
                    Purchase (lote)
                   /  remaining=10
                  /   unit_cost=50
    Product ──────
                  \   Purchase (lote)
                   \  remaining=5
                      unit_cost=70

    Sale #1 → purchase=lote_A, unit_cost_price=50, quantity=1
    Sale #2 → purchase=lote_A, unit_cost_price=50, quantity=1
    ...
    Sale #11 → purchase=lote_B, unit_cost_price=70, quantity=1
```

## Diagrama de estado de lotes

```text
Purchase lifecycle:

  [ creado ]
      │
      ▼
  remaining = quantity (lote lleno)
      │
      ▼
  ┌─ register_sale() ─────┐
  │  remaining -= 1        │
  │  sale.purchase = self  │
  │  sale.unit_cost_price  │
  │    = self.unit_cost    │
  └────────────────────────┘
      │
      ▼
  remaining == 0 (lote agotado, no se elimina)
      │
      ▼
  ┌─ deactivate_sale() ────┐
  │  sale.purchase.remaining│
  │    += 1                 │
  └─────────────────────────┘
```

## Migracion de datos

### Paso 1: Agregar campos nuevos

```text
Operacion: AddField
Modelo: sales.Purchase
Campo: remaining = PositiveIntegerField(default=0)

Operacion: AddField
Modelo: sales.Sale
Campo: purchase = ForeignKey(Purchase, null=True, on_delete=PROTECT)
```

### Paso 2: Poblar `remaining` para compras existentes

```python
Purchase.objects.update(remaining=F("quantity"))
```

### Paso 3: Crear lotes sinteticos para productos con stock pero sin compras

```python
for product in Product.objects.filter(stock__gt=0):
    if not Purchase.objects.filter(product=product).exists():
        Purchase.objects.create(
            product=product,
            quantity=product.stock,
            remaining=product.stock,
            unit_cost=product.cost_price,
            notes="Lote sintetico creado por migracion FIFO 014",
        )
```

### Paso 4: Asignar FK `purchase` a ventas existentes

```python
for sale in Sale.objects.filter(purchase__isnull=True):
    oldest_purchase = Purchase.objects.filter(
        product=sale.product, remaining__gt=0
    ).order_by("purchased_at").first()
    if oldest_purchase:
        sale.purchase = oldest_purchase
        oldest_purchase.remaining = F("remaining") - 1
        oldest_purchase.save(update_fields=["remaining"])
        sale.save(update_fields=["purchase"])
```

## Calculo de capital inmovilizado

```text
Formula: SUM(Purchase.remaining × Purchase.unit_cost) WHERE remaining > 0
Endpoint: GET /api/reports/inventory-capital/
Permiso: IsAdminOrVendor
```

No requiere campo denormalizado — se calcula on-demand via agregacion Django ORM.
