# Implementation Plan: Refinar vista y calculos de corte mensual

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-13 | **Spec**: `specs/012-monthly-cut-view-refinement/spec.md`
**Input**: Feature specification from `/specs/012-monthly-cut-view-refinement/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se refinara la experiencia de corte mensual separando la vista de listado y la vista de detalle, ajustando el resumen financiero para que `neto real = ganancia tienda - gastos`, eliminando la duplicidad visual de capital invertido, agregando tabla de gastos y forzando advertencia previa antes de ejecutar corte desde la vista principal. El cambio reutiliza el modelo y servicio de cortes ya implementados en 011, concentrando ajustes en contrato de respuesta, presentacion de datos y navegacion.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite (sin cambios de motor; se reutilizan tablas de cortes/ventas/gastos)  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Carga de listado y detalle de corte en menos de 2 segundos percibidos para volumen mensual habitual  
**Constraints**: Solo admin ejecuta corte; cortes no se eliminan; ejecutar corte solo en listado; confirmacion previa obligatoria; neto real excluye ganancia mayorista  
**Scale/Scope**: Refinamiento de vistas y contrato de reporte de corte mensual en modulos `frontend/src/pages`, `frontend/src/api`, `backend/cuts`, `backend/core`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado manteniendo permisos admin y trazabilidad historica de cortes.

## Project Structure

### Documentation (this feature)

```text
specs/012-monthly-cut-view-refinement/
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
├── core/
├── cuts/
├── sales/
└── expenses/

frontend/
└── src/
    ├── api/
    ├── components/
    ├── pages/
    ├── router/
    └── styles.css

specs/012-monthly-cut-view-refinement/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene la arquitectura web existente. Los cambios se concentraran en `frontend/src/pages/MonthlyCutPage.tsx` y nueva pagina de detalle, `frontend/src/router/routes.tsx`, `frontend/src/api/reports.ts`, y en backend en `backend/cuts/services.py` + serializacion de detalle para ajustar formulas y exponer gastos para la vista dedicada.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
