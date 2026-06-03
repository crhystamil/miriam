# Implementation Plan: Mejora de registro de ventas

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/001-sales-modal-busqueda/spec.md`
**Input**: Feature specification from `/specs/001-sales-modal-busqueda/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se implementara un flujo de registro de ventas mediante modal centrado con accion principal `Registrar Venta`, incorporando busqueda de productos por SKU/nombre con coincidencia parcial para catalogos de al menos 200 items. El formulario conservara borrador mientras el modal permanezca abierto, mostrara panel de detalle del producto en paralelo (desktop) con imagen referencial pequena, y limpiara estado al cancelar/cerrar o al guardar exitosamente.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite (actual), modelos `Product` y `Sale` existentes  
**Testing**: `npm run build` (frontend), `manage.py test` y `manage.py check` (backend)  
**Target Platform**: Web responsive (desktop y mobile)
**Project Type**: Aplicacion web (frontend + backend)  
**Performance Goals**: Seleccion de producto en <15s con 200 items; apertura de modal <1s percibido  
**Constraints**: Mantener rutas/roles actuales; no romper flujo de venta existente; imagen referencial pequena no dominante  
**Scale/Scope**: Cambio acotado al modulo `SalesPage` y contratos de datos ya existentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Constitucion en `.specify/memory/constitution.md` contiene placeholders sin reglas ejecutables.
- Gate pre-Phase0: PASS (sin principios obligatorios definidos para bloquear).
- Gate post-Phase1: PASS (sin violaciones verificables; se mantiene alineacion con arquitectura actual).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
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
├── products/
├── sales/
├── expenses/
├── cuts/
└── config/

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── router/
│   ├── state/
│   └── styles.css

specs/001-sales-modal-busqueda/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/

tests/ (existentes por modulo)
```

**Structure Decision**: Se mantiene estructura de aplicacion web existente. Los cambios funcionales se concentran en `frontend/src/pages/SalesPage.tsx`, `frontend/src/styles.css` y tipos/API relacionados, con backend reutilizado sin nuevas apps.

## Complexity Tracking

No se requieren excepciones de complejidad contra constitucion (no hay reglas activas definidas).
