# Data Model - Mejorar tabla de productos y SKU autogenerado

## 1) ProductoTabla
- Purpose: Registro de producto presentado en la tabla para consulta por admin y vendedor.
- Fields relevantes:
  - `id`
  - `sku`
  - `name`
  - `description`
  - `cost_price`
  - `wholesale_price`
  - `public_price`
  - `stock`
  - `is_active` (estado)
  - `representative_image_url`
- Validation rules:
  - Debe exponer todos los campos requeridos en cada fila para ambos roles.
  - `sku` siempre visible y no vacio.

## 2) SKUAutogenerado
- Purpose: Identificador unico generado por sistema al crear producto.
- Fields relevantes:
  - `value` (cadena SKU)
  - `generated_at`
- Validation rules:
  - Unicidad global en catalogo de productos.
  - No depende de entrada manual del cliente para creacion estandar.

## 3) ImagenRepresentativaProducto
- Purpose: Imagen unica usada en tabla para identificacion visual del producto.
- Source:
  - Primera imagen de `ProductImage` ordenada por `position`.
  - Fallback cuando no hay imagen o falla su carga.
- Validation rules:
  - Solo una imagen visible por fila.
  - El fallback no debe romper estructura de tabla.

## 4) AccionProductoTabla
- Purpose: Acciones operativas de gestion expuestas en cada fila.
- Types:
  - `editar`
  - `eliminar`
  - otras acciones administrativas existentes
- Validation rules:
  - Solo visibles/ejecutables para rol administrador.
  - Rol vendedor solo consulta datos.

## Relationships
- `ProductoTabla` incluye `SKUAutogenerado` como identificador mostrado.
- `ProductoTabla` referencia una sola `ImagenRepresentativaProducto` para render en tabla.
- `AccionProductoTabla` aplica sobre `ProductoTabla` y esta condicionada por rol.
