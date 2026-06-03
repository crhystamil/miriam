# Implementation Plan: Costeo FIFO de inventario por lotes de compra

**Branch**: `001-iam-repuestos-system` | **Date**: 2026-06-03 | **Spec**: `specs/014-fifo-inventory-costing/spec.md`
**Input**: Feature specification from `/specs/014-fifo-inventory-costing/spec.md`

## Summary

Implementar motor de costeo FIFO (First In, First Out) para el inventario de productos. Cada compra genera un lote con `remaining` rastreable; las ventas son unitarias (quantity=1) y consumen del lote mas antiguo, asignando el costo exacto del lote a `unit_cost_price` sin calculo ponderado. Se agrega FK `purchase` en `Sale` para rastrear de que lote se consumo, permitiendo reversion directa al desactivar. Se incluye migracion para compras y ventas existentes y productos sin compras.

## Technical Context

**Language/Version**: Python 3.12 (backend), TypeScript (frontend ajuste menor)
**Primary Dependencies**: Django 5.2, Django REST Framework, React 19, React Router 7
**Storage**: SQLite (desarrollo), campo `remaining` en `Purchase`, FK `purchase` en `Sale`
**Testing**: `.venv/bin/python manage.py test`, `.venv/bin/python manage.py check`
**Target Platform**: Aplicacion web responsive (backend API + frontend menor)
**Project Type**: Web app full-stack (cambio principal backend, ajuste menor frontend)
**Performance Goals**: Operaciones FIFO en <50ms por venta unitaria; `select_for_update` para concurrencia
**Constraints**: No crear modelos intermedios adicionales; mantener retrocompatibilidad con `product.cost_price`; ventas siempre unitarias
**Scale/Scope**: ~500 productos, ~50 compras/dia, ~100 ventas/dia; lotes tipicos de 1-50 unidades

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder (`[PRINCIPLE_X_NAME]`), sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado — cambios en modelos y servicios del backend + ajuste menor en formulario de ventas frontend.

## Project Structure

### Documentation (this feature)

```text
specs/014-fifo-inventory-costing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── sales/
│   ├── models.py          # Purchase.remaining + Sale.purchase FK
│   ├── services.py        # register_sale FIFO, deactivate_sale con lote
│   ├── serializers.py     # PurchaseSerializer incluye remaining, quantity forzado a 1
│   ├── views.py           # Sin cambios
│   ├── migrations/
│   │   └── 0005_purchase_remaining_sale_purchase_fk.py
│   └── tests.py           # Tests FIFO unitarios
├── core/
│   └── views.py           # Nuevo endpoint: inventory capital
└── products/
    └── services.py        # Sin cambios

frontend/src/
├── pages/
│   └── SalesPage.tsx      # Ajuste: quantity fijo a 1
└── api/
    └── types.ts           # Ajuste: tipo Sale incluye purchase
```

**Structure Decision**: Se mantiene la arquitectura existente. El trabajo principal esta en `backend/sales/` (modelos, servicios, migracion, tests) y `backend/core/views.py` (nuevo endpoint). El frontend requiere ajuste menor en `SalesPage.tsx` para forzar `quantity=1`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
