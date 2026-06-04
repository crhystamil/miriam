# Contract: Productos publicos desde `/api/products/`

## GET `/api/products/`

Lista productos activos disponibles para lectura publica.

### Query Parameters

| Name | Required | Description |
|------|----------|-------------|
| `page` | No | Numero de pagina de resultados. Si se omite, devuelve la primera pagina. |
| `search` | No | Texto para buscar productos registrados. |

### Successful Response

Status: `200 OK`

```json
{
  "count": 189,
  "next": "http://example.com/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "sku": "OLD-123",
      "name": "Filtro de bomba de drenaje Samsung",
      "description": "Filtro pelusas de bomba de desague.",
      "cost_price": "40.00",
      "fifo_cost_price": "40.00",
      "wholesale_reference_price": "65.00",
      "public_price": "100.00",
      "stock": 5,
      "is_active": true,
      "representative_image_url": "http://example.com/media/products/filtro.png",
      "images": [
        {
          "id": 1,
          "image_url": "http://example.com/media/products/filtro.png",
          "content_type": "image/png",
          "size_bytes": 0,
          "position": 1
        }
      ]
    }
  ]
}
```

### Public UI Consumption Rules

- Render `name`, `description`, `representative_image_url`, `images` and optional `public_price` only.
- Do not render `cost_price`, `fifo_cost_price`, `wholesale_reference_price`, or `stock` in public screens.
- Treat `next !== null` as availability of more products.
- Treat `count === 0` as empty catalog/search state.

## GET `/api/products/{id}/`

Retrieves a single product for public detail view.

### Path Parameters

| Name | Required | Description |
|------|----------|-------------|
| `id` | Yes | Product identifier selected from catalog. |

### Successful Response

Status: `200 OK`

```json
{
  "id": 123,
  "sku": "OLD-123",
  "name": "Filtro de bomba de drenaje Samsung",
  "description": "Filtro pelusas de bomba de desague.",
  "cost_price": "40.00",
  "fifo_cost_price": "40.00",
  "wholesale_reference_price": "65.00",
  "public_price": "100.00",
  "stock": 5,
  "is_active": true,
  "representative_image_url": "http://example.com/media/products/filtro.png",
  "images": []
}
```

### Error Responses

| Status | Meaning | Public UI Behavior |
|--------|---------|--------------------|
| `404 Not Found` | Product does not exist or should not be shown publicly | Show product-not-found state and link back to catalog. |
| `500`/network error | Product data cannot be loaded | Show friendly error and keep navigation available. |

### Public UI Consumption Rules

- Show product detail only when the product is public/active.
- Use `representative_image_url` as main image when available.
- Use `images` as gallery ordered by `position` then `id`.
- Do not render internal cost or inventory-management fields.
