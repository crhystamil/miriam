# Implementation Plan: Completar tabla de ventas y acciones

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-12 | **Spec**: `specs/008-sales-table-actions/spec.md`
**Input**: Feature specification from `/specs/008-sales-table-actions/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se ampliara la tabla de ventas para mostrar todos los campos operativos requeridos (fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido) para administrador y vendedor. Tambien se agregaran acciones de deshabilitar y eliminar venta con control de permisos, consistencia de estado y regla de reversa de stock al deshabilitar.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para datos de ventas y stock; sin nuevos motores de datos  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Acciones de tabla (deshabilitar/eliminar) reflejadas en interfaz en menos de 2 segundos percibidos  
**Constraints**: Mantener roles actuales (admin/vendor), reversar stock al deshabilitar, eliminar restringido a admin, preservar trazabilidad visual  
**Scale/Scope**: Cambios acotados a listado de ventas, API de ventas y reglas de estado de venta/stock asociadas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack y permisos vigentes.

## Project Structure

### Documentation (this feature)

```text
specs/008-sales-table-actions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/
├── sales/
├── products/
└── config/

frontend/
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   └── styles.css

specs/008-sales-table-actions/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion concentrada en `frontend/src/pages/SalesPage.tsx` (columnas y acciones), `backend/sales/` (servicios/serializadores/vistas) y pruebas API en `backend/sales/tests_api.py` para permisos y consistencia de stock/estado.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
