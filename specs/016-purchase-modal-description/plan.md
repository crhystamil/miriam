# Implementation Plan: Modal de nueva compra con descripcion

**Branch**: `001-iam-repuestos-system` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-purchase-modal-description/spec.md`

## Summary

Mejorar la seccion administrativa de compras moviendo el formulario inline actual a un modal abierto por el boton "Nueva compra", agregando un campo visible de descripcion/notas, refrescando la tabla despues del registro exitoso, y mostrando las compras mas recientes primero. El backend ya acepta `notes` en compras; se requiere ordenar el queryset de compras por `purchased_at` descendente y ajustar la experiencia frontend.

## Technical Context

**Language/Version**: Python 3.13 (Django backend), TypeScript (React frontend)
**Primary Dependencies**: Django REST Framework, React 19, React Router, Vite
**Storage**: Base de datos relacional usada por Django; modelo existente `Purchase`
**Testing**: Django `manage.py test`; frontend `npm run build`; validacion manual del modal
**Target Platform**: Web app local/browser + Django API
**Project Type**: Web application (Django REST backend + React SPA frontend)
**Performance Goals**: Tabla actualizada despues de compra en menos de 2 segundos en condiciones normales
**Constraints**: Reutilizar modelo y endpoint existentes; `notes` ya existe en `Purchase`; permisos de compras siguen siendo solo admin
**Scale/Scope**: 1 endpoint/queryset backend, 1 pagina frontend, tipos ya compatibles con `notes`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto sigue siendo placeholder y no define gates activos. No hay violaciones.

## Project Structure

### Documentation (this feature)

```text
specs/016-purchase-modal-description/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
└── sales/
    └── views.py                 # Ordenar compras por fecha descendente

frontend/
└── src/
    ├── pages/
    │   └── PurchasesPage.tsx    # Boton, modal, descripcion, recarga tabla
    └── api/
        ├── sales.ts             # createPurchase ya acepta notes
        └── types.ts             # Purchase ya incluye notes
```

**Structure Decision**: Cambio pequeño en la pagina de compras del frontend y en el queryset de compras del backend. No se agrega modelo ni endpoint nuevo.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad adicional relevante.
