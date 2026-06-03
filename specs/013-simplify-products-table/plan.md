# Implementation Plan: Simplificar tabla y filtros de productos

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-13 | **Spec**: `specs/013-simplify-products-table/spec.md`
**Input**: Feature specification from `/specs/013-simplify-products-table/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se simplificara la interfaz de productos removiendo las columnas SKU y descripcion del listado y eliminando el checkbox de filtro "solo stock bajo". Tambien se definira compatibilidad con estado legado para ignorar `low_stock_only` cuando llegue por URL o estado previo, manteniendo operativos los demas filtros existentes sin cambios de datos.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: N/A (cambio de presentacion y filtros en UI, sin cambios de persistencia)  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Mantener tiempos de carga y render del listado de productos iguales o mejores al estado previo para volumen habitual  
**Constraints**: No modificar modelo de datos de productos; no eliminar SKU/descripcion del dominio; quitar solo visualizacion en tabla y control de filtro `solo stock bajo`; ignorar `low_stock_only` legado  
**Scale/Scope**: Cambios acotados a pantalla de productos, estado de filtros cliente y uso de parametros en consulta de listado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado manteniendo comportamiento funcional de filtros restantes y sin cambios de datos.

## Project Structure

### Documentation (this feature)

```text
specs/013-simplify-products-table/
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
├── products/
└── core/

frontend/
└── src/
    ├── pages/
    ├── api/
    ├── components/
    └── styles.css

specs/013-simplify-products-table/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene la arquitectura actual y se concentra el trabajo en `frontend/src/pages/ProductsPage.tsx` y, de ser necesario, en `frontend/src/api/products.ts` para normalizar filtros enviados. No se esperan cambios de modelo ni migraciones backend.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
