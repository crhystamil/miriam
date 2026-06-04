# Implementation Plan: Quitar compra desde productos

**Branch**: `main` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-remove-product-purchase-form/spec.md`

## Summary

Retirar de la seccion administrativa de productos el formulario duplicado para registrar compras, dejando la seccion de compras como unico flujo de registro de compras. El enfoque tecnico es eliminar del frontend de productos los estados, importaciones, handler, mensajes y controles asociados a registrar compra, sin modificar la API de compras ni la pagina dedicada de compras.

## Technical Context

**Language/Version**: TypeScript (React 19 frontend), Python 3.13 (Django backend sin cambios esperados)  
**Primary Dependencies**: React, React Router, Vite; Django REST Framework existente para compras/productos  
**Storage**: SQLite via Django ORM; sin cambios de datos ni migraciones  
**Testing**: Frontend `npm run build`; validacion manual de productos y compras; backend tests no requeridos si no se toca backend  
**Target Platform**: Web app administrativa en navegador  
**Project Type**: Web application (React SPA + Django REST backend)  
**Performance Goals**: La pagina de productos debe cargar igual o mas simple que antes; no se agregan llamadas de red nuevas  
**Constraints**: No eliminar la funcionalidad de compras dedicada; no cambiar permisos existentes; no alterar datos de productos/compras; mantener CRUD de productos intacto  
**Scale/Scope**: Cambio acotado a una pantalla administrativa y a validacion de que la pantalla de compras siga operativa

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto contiene placeholders y no define principios, restricciones ni gates aplicables. No hay violaciones constitucionales identificadas.

## Project Structure

### Documentation (this feature)

```text
specs/018-remove-product-purchase-form/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── pages/
    │   ├── ProductsPage.tsx     # Retirar registro de compras duplicado
    │   └── PurchasesPage.tsx    # Confirmar que compras sigue siendo el flujo unico
    └── api/
        └── sales.ts             # createPurchase queda usado por PurchasesPage

backend/
└── sales/                       # Sin cambios esperados
```

**Structure Decision**: Cambio frontend minimo en `ProductsPage.tsx`, con verificacion de `PurchasesPage.tsx`. No se requiere nuevo endpoint, modelo, migracion ni serializer.

## Phase 0: Research

Ver [research.md](./research.md).

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/admin-ui.md](./contracts/admin-ui.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta reduce superficie de UI duplicada y mantiene el flujo dedicado de compras. No hay gates constitucionales activos ni violaciones que justificar.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional.
