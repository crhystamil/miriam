# Contracts: Busqueda de productos en modal de compras

**Feature**: 025-purchase-product-search | **Date**: 2026-06-08

## No hay contratos nuevos

Esta feature no introduce nuevas interfaces, endpoints, ni contratos. Reutiliza el endpoint existente:

- `GET /api/products/?search=<query>` — ya soportado por `ProductViewSet` en `backend/products/views.py:25-29`
- El tipo `ProductFilters` ya incluye `search?: string` en `frontend/src/api/products.ts:6`

No se requieren cambios en la API ni en los tipos del frontend.
