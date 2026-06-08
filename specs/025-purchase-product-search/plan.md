# Implementation Plan: Busqueda de productos en modal de compras

**Branch**: `main` | **Date**: 2026-06-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/025-purchase-product-search/spec.md`

## Summary

Anadir un campo de busqueda con debounce en el modal de nueva compra (`PurchasesPage.tsx`) que consulte el endpoint existente `GET /api/products/?search=<query>` para permitir al usuario encontrar productos que no estan en la lista inicial de 10. El backend ya soporta busqueda por nombre y SKU; el tipo `ProductFilters` ya incluye `search`. Cambio **puramente frontend**: un nuevo estado + efecto con debounce + input de texto en el modal.

## Technical Context

**Language/Version**: TypeScript 5.8 + React 19 + Vite 8
**Primary Dependencies**: `react`, `react-dom` (ya en el proyecto; **sin dependencias nuevas**)
**Storage**: N/A (frontend; consume API existente)
**Testing**: Verificacion manual en navegador; gate de build `npm run build` (tsc + vite); backend sin cambios
**Target Platform**: Navegadores web modernos (escritorio + movil)
**Project Type**: web-app (porcion frontend)
**Performance Goals**: Resultados de busqueda en < 2s tras dejar de escribir; debounce de 300ms
**Constraints**: Sin cambios de backend; sin dependencias nuevas; seguir patron existente del proyecto
**Scale/Scope**: 1 pagina modificada (`PurchasesPage.tsx`), ~30 lineas nuevas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` es un template sin llenar (placeholders sin contenido real). No existen principios ni gates formalmente ratificados que aplicar.

**Resultado del gate**: PASS (sin constitution operativa). No se registran violaciones. Se siguen los patrones del repositorio: estado con `useState`, efectos con `useEffect`, llamada a API existente via `getProducts`, CSS plano con clases existentes.

## Project Structure

### Documentation (this feature)

```text
specs/025-purchase-product-search/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── no-new-contracts.md
└── tasks.md             # (Phase 2 - /speckit.tasks, no creado aqui)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── pages/
│   │   └── PurchasesPage.tsx    # MODIFICADO: anadir busqueda con debounce
│   ├── api/
│   │   ├── products.ts          # (sin cambios; ya tiene search en ProductFilters)
│   │   └── types.ts             # (sin cambios)
│   └── styles.css               # (posiblemente sin cambios; reusa clases existentes)
└── package.json                 # (sin cambios)
```

**Structure Decision**: Porcion frontend del monorepo `backend/` + `frontend/` existente. El cambio se limita a `PurchasesPage.tsx`. El patron de busqueda servidor-side con debounce ya se usa en `CatalogPage.tsx` y `WholesalerProductsPage.tsx`; la implementacion sigue el mismo enfoque.

## Complexity Tracking

> Sin violaciones de constitution que justificar. (Tabla vacia a proposito.)

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
