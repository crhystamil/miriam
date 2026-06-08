# Quickstart: Busqueda de productos en modal de compras

**Feature**: 025-purchase-product-search | **Date**: 2026-06-08

## Que hace esta feature

Anade un campo de busqueda en el modal de nueva compra que permite al usuario buscar productos por nombre o SKU en todo el catalogo, no solo en los primeros 10 resultados.

## Archivos a modificar

| Archivo | Accion |
|---------|--------|
| `frontend/src/pages/PurchasesPage.tsx` | MODIFICAR - anadir estados, efecto de debounce, input de busqueda |

## No se modifican

- Backend (endpoint de busqueda ya existe: `GET /api/products/?search=<query>`)
- `frontend/src/api/products.ts` (ya tiene `search` en `ProductFilters`)
- `frontend/src/api/types.ts` (sin cambios)
- CSS (reutiliza clases existentes del proyecto)

## Como probar

1. Ir a la seccion de Compras
2. Click en "Nueva compra"
3. Verificar que aparece un campo "Buscar producto" encima del dropdown de productos
4. Escribir un nombre o SKU de un producto que no este en los primeros 10
5. Verificar que la lista se actualiza con resultados del servidor tras ~300ms de dejar de escribir
6. Seleccionar un producto de los resultados y completar el registro de compra
7. Borrar el texto de busqueda y verificar que vuelve a la lista inicial de 10 productos
