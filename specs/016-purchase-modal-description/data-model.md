# Data Model: Modal de nueva compra con descripcion

## Compra (Purchase)

Entidad existente. No requiere migracion.

| Campo | Uso en esta feature | Validacion |
|-------|---------------------|------------|
| `product` | Producto seleccionado en el modal | Obligatorio |
| `quantity` | Cantidad comprada | Mayor a 0 |
| `unit_cost` | Costo unitario del lote | Mayor a 0 |
| `notes` | Descripcion opcional de la compra | Opcional |
| `purchased_at` | Fecha usada para ordenar la tabla | Generada al registrar |

## Producto (Product)

Entidad existente usada para poblar el selector del modal.

| Campo | Uso en esta feature |
|-------|---------------------|
| `id` | Valor seleccionado |
| `sku` | Identificacion visible |
| `name` | Nombre visible |

## Estados de UI

| Estado | Descripcion |
|--------|-------------|
| Modal cerrado | La seccion muestra boton "Nueva compra" y tabla de compras |
| Modal abierto | Formulario muestra producto, cantidad, costo unitario y descripcion |
| Enviando | Boton deshabilitado con mensaje de carga |
| Error de validacion | Modal permanece abierto y muestra errores |
| Exito | Modal se cierra, formulario se limpia, tabla recarga pagina 1 |

## Orden de tabla

La tabla debe presentar compras en orden descendente por `purchased_at`, con desempate por `id` descendente.
