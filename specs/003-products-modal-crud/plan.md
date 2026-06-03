# Implementation Plan: Gestion de productos con modal e imagenes

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/003-products-modal-crud/spec.md`
**Input**: Feature specification from `/specs/003-products-modal-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se implementara gestion de productos centrada en la vista de productos: alta mediante modal superpuesto, edicion y desactivacion desde la tabla, y soporte de una o mas imagenes por producto. La eliminacion se define como logica (producto inactivo), preservando historial. La experiencia debe reflejar cambios en la tabla operativa sin navegacion adicional.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite actual con modelos Django (extensiones en entidad de producto e imagenes relacionadas)  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Actualizacion visible de tabla de productos en menos de 5 segundos percibidos tras alta/edicion/desactivacion  
**Constraints**: Mantener arquitectura, roles y rutas actuales; eliminacion de producto solo logica; minimo una imagen por producto en alta/edicion  
**Scale/Scope**: Cambios acotados al modulo de productos y contratos relacionados de listado/edicion/imagenes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado si se mantiene consistencia con arquitectura y roles vigentes.

## Project Structure

### Documentation (this feature)

```text
specs/003-products-modal-crud/
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
└── config/

frontend/
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   └── styles.css

specs/003-products-modal-crud/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene la estructura web existente. Los cambios se concentran en `backend/products`, contratos API de productos e imagenes, y `frontend/src/pages/ProductsPage.tsx` con modal de alta + acciones de edicion/desactivacion en tabla.

## Complexity Tracking

No se registran violaciones de constitucion que requieran justificacion.
