# Implementation Plan: Corte mensual con resumen y reinicio operativo

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-13 | **Spec**: `specs/011-monthly-cut-report/spec.md`
**Input**: Feature specification from `/specs/011-monthly-cut-report/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se implementara un cierre mensual que consolida ventas y gastos hasta una fecha de corte, marca esos registros como cerrados para ocultarlos del historial operativo activo y habilita una nueva vista de resultados del corte. La vista mostrara indicadores financieros globales basados en ventas habilitadas, una tabla de desempeno por mayorista, una tabla de detalle de ventas habilitadas ordenada por mayorista y una tabla separada para ventas deshabilitadas con caracter informativo.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para ventas/gastos/cortes; sin cambios de motor de persistencia  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Ejecucion de corte y visualizacion inicial de resultados en menos de 3 segundos percibidos para volumen operativo mensual habitual  
**Constraints**: Solo admin puede ejecutar corte; un corte por periodo/fecha; snapshot al inicio; totales globales solo con ventas habilitadas; deshabilitadas en tabla separada informativa  
**Scale/Scope**: Cambios en modulos de ventas/gastos/reportes para consolidacion mensual y nueva vista de corte con tablas de resumen y detalle

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado manteniendo coherencia con reglas de roles, trazabilidad y contratos actuales.

## Project Structure

### Documentation (this feature)

```text
specs/011-monthly-cut-report/
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
├── expenses/
├── core/
└── config/

frontend/
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   └── styles.css

specs/011-monthly-cut-report/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene la estructura web existente. Implementacion concentrada en `backend/sales/` y `backend/expenses/` para logica de corte/snapshot/estado de cierre, `backend/core/` o modulo equivalente para endpoints de reporte de corte, y `frontend/src/pages/` + `frontend/src/api/` para nueva vista de corte y tablas de resultados.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
