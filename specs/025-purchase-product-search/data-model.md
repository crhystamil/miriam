# Data Model: Busqueda de productos en modal de compras

**Date**: 2026-06-08 | **Feature**: 025-purchase-product-search

## Resumen

No hay cambios en el modelo de datos. Esta feature es puramente de UI y reutiliza las entidades existentes.

## Entidades Existentes (sin cambios)

### Product

Entidad existente en el backend, consumida via API. La busqueda filtra por `name` y `sku`.

| Campo        | Tipo     | Descripcion                           |
|-------------|----------|---------------------------------------|
| id          | number   | Identificador unico                   |
| name        | string   | Nombre del producto                   |
| sku         | string   | Codigo SKU                            |
| stock       | number   | Stock actual                          |
| is_active   | boolean  | Estado activo/inactivo                |
| description | string   | Descripcion del producto              |

### Purchase

Entidad existente. No se modifica.

## Estado Front-end (nuevo)

### Nuevos estados en `PurchasesPage.tsx`

| Estado          | Tipo     | Descripcion                                              |
|----------------|----------|----------------------------------------------------------|
| productQuery   | string   | Texto actual en el campo de busqueda (input del usuario) |
| productSearch  | string   | Termino de busqueda enviado al servidor (post-debounce)  |

### Estados existentes afectados

| Estado    | Cambio                                                    |
|-----------|-----------------------------------------------------------|
| products  | Se actualiza via `getProducts({ page: 1, search: productSearch })` cuando cambia `productSearch` |
| newProduct| Se auto-selecciona el primer producto si el seleccionado ya no esta en los resultados |

## Relaciones

```
productQuery --[debounce 300ms]--> productSearch --[getProducts({search})]--> products
products --> <select> dropdown (muestra productos disponibles)
newProduct --> producto seleccionado del dropdown
```
