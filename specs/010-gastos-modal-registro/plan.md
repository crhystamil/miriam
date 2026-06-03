# Implementation Plan: Registro de gastos en modal y simplificacion de vista

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-13 | **Spec**: `specs/010-gastos-modal-registro/spec.md`
**Input**: Feature specification from `/specs/010-gastos-modal-registro/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se reemplazara el formulario inline de alta de gastos por un flujo con boton "Nuevo gasto" que abre un modal sobre la tabla para registrar egresos. El modal conservara campos operativos requeridos (ambito, concepto, monto y notas opcionales), mantendra fecha/hora automatica al guardar y eliminara el bloque de filtros superior de la vista para simplificar la experiencia sin perder tabla paginada.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para datos de gastos; sin cambios de motor de persistencia  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Apertura/cierre de modal y refresco de tabla tras alta en menos de 2 segundos percibidos  
**Constraints**: Mantener reglas actuales de gastos y permisos; fecha/hora automatica en alta; remover filtros visuales superiores; no romper paginacion  
**Scale/Scope**: Cambios acotados a `ExpensesPage`, cliente API de gastos y validaciones asociadas a formulario/modal

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado manteniendo stack, permisos y reglas actuales de negocio.

## Project Structure

### Documentation (this feature)

```text
specs/010-gastos-modal-registro/
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
├── expenses/
├── core/
└── config/

frontend/
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   └── styles.css

specs/010-gastos-modal-registro/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene la estructura web existente. La implementacion se concentra en `frontend/src/pages/ExpensesPage.tsx` (modal, boton y remocion de filtros), `frontend/src/api/expenses.ts` (payload de alta) y validaciones/serializacion en `backend/expenses/` para sostener contrato funcional.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
