# Implementation Plan: Refrescar descripcion de producto en modal de venta

**Branch**: `001-iam-repuestos-system` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-sale-modal-refresh/spec.md`

## Summary

Al registrar una venta exitosa desde el modal, el modal se cierra (`closeSaleModal()` en `SalesPage.tsx:191`). El fix consiste en mantener el modal abierto, recargar los datos del producto seleccionado desde el servidor (para obtener stock y costo FIFO actualizados), y resetear solo el campo de precio de venta. Cambio 100% frontend en un unico archivo.

## Technical Context

**Language/Version**: TypeScript con React (Vite)
**Primary Dependencies**: React 19, React Router
**Storage**: N/A (frontend only)
**Testing**: N/A (manual visual verification)
**Target Platform**: Web browser
**Project Type**: Web application (Django REST + React SPA)
**Performance Goals**: Recarga de producto < 2s
**Constraints**: Sin cambios de backend
**Scale/Scope**: 1 archivo componente

## Constitution Check

Constitucion es placeholder — sin gates activos. No hay violaciones.

## Project Structure

### Documentation (this feature)

```text
specs/015-sale-modal-refresh/
├── plan.md
├── research.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/src/
├── api/
│   └── products.ts         # Ya existe getProducts()
├── pages/
│   └── SalesPage.tsx       # UNICO archivo a modificar
└── api/types.ts            # Sin cambios (fifo_cost_price ya existe)
```

**Structure Decision**: Cambio en un solo archivo frontend existente.

## Research

See [research.md](./research.md).

## Design

See [data-model.md](./data-model.md) — sin cambios de modelo. Ver [quickstart.md](./quickstart.md) para pasos de implementacion.
