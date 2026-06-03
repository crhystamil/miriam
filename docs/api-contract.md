# API Contract (Backend v1)

Base URL: `/api/`

## System

### `GET /api/system/health/`
- Public endpoint.
- Success `200`:
```json
{
  "status": "ok"
}
```

### `GET /api/system/version/`
- Public endpoint.
- Success `200`:
```json
{
  "name": "iam-repuestos-api",
  "version": "0.1.0"
}
```

### `GET /api/system/bootstrap/`
- Public endpoint for frontend initialization metadata.
- Success `200` includes app metadata, auth routes, page size, currency, and key API routes.

## Authentication

### `POST /api/auth/login/`
- Public endpoint.
- Body:
```json
{
  "username": "vendorauth",
  "password": "secret123"
}
```
- Success `200`:
```json
{
  "id": 2,
  "username": "vendorauth",
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "",
  "role": "vendor",
  "is_staff": false
}
```

### `POST /api/auth/logout/`
- Auth required.
- Success `204` with empty body.

### `GET /api/auth/me/`
- Auth required.
- Success `200`: same schema as login success.

## Products

### `GET /api/products/`
- Auth required.
- Pagination: `count`, `next`, `previous`, `results`.
- Filters:
  - `search` (name or sku)
  - `is_active=true|false`
  - `low_stock=true` (stock <= 5)

### `POST /api/products/`
- Admin only.

## Purchases

### `GET /api/purchases/`
- Admin only.

### `POST /api/purchases/`
- Admin only.
- Body:
```json
{
  "product": 1,
  "quantity": 10,
  "unit_cost": "50.00",
  "notes": "Compra mayorista"
}
```

## Sales

### `GET /api/sales/`
- Admin: sees all.
- Vendor: sees only own sales.
- Filters:
  - `from=YYYY-MM-DD`
  - `to=YYYY-MM-DD`
  - `product=<product_id>`

### `POST /api/sales/`
- Admin/Vendor.
- Vendor cannot create for another vendor (server enforces current user).
- Body:
```json
{
  "product": 1,
  "vendor": 2,
  "quantity": 2,
  "unit_sale_price": "75.00",
  "notes": "Venta mostrador"
}
```

## Expenses

### `GET /api/expenses/`
- Admin: sees all.
- Vendor: sees only own expenses.
- Filters:
  - `from=YYYY-MM-DD`
  - `to=YYYY-MM-DD`
  - `scope=store|vendor`

### `POST /api/expenses/`
- Admin/Vendor.
- Vendor requests are forced to `scope=vendor` and `vendor=request.user`.

## Monthly Cuts

### `GET /api/cuts/`
- Admin only.

### `POST /api/cuts/`
- Admin only.
- Body:
```json
{
  "period": "2026-05",
  "closed_by": 1,
  "notes": "Cierre mensual"
}
```
- Behavior: irreversible (cannot update/delete).

## Reports

### `GET /api/reports/dashboard/`
- Admin/Vendor.
- Filters:
  - `from=YYYY-MM-DD&to=YYYY-MM-DD`
  - `month=YYYY-MM` (alternative)
- Response fields:
  - `role`, `sales_count`, `units_sold`, `gross_sales`, `store_profit`, `vendor_profit`, `total_expenses`, `low_stock_products`, `filters`

### `GET /api/reports/monthly/?month=YYYY-MM`
- Admin/Vendor.
- `month` is required.
- Response fields:
  - `role`, `month`, `period`, `sales_count`, `units_sold`, `gross_sales`, `store_profit`, `vendor_profit`, `total_expenses`

## Closed Period Rules

- If a `MonthlyCut` exists for a period:
  - New sales in that period are blocked.
  - New expenses in that period are blocked.

## Standard Error Schema

All API errors use:
```json
{
  "code": "validation_error",
  "detail": "Error de validacion.",
  "field_errors": {}
}
```

Common `code` values:
- `authentication_failed`
- `permission_denied`
- `not_found`
- `validation_error`
- `invalid_query_params`

Validation example:
```json
{
  "code": "validation_error",
  "detail": "Error de validacion.",
  "field_errors": {
    "non_field_errors": [
      "El periodo mensual esta cerrado y no admite nuevas ventas."
    ]
  }
}
```
