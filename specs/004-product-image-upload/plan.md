# Implementation Plan: Carga de imagen en nuevo producto

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/004-product-image-upload/spec.md`
**Input**: Feature specification from `/specs/004-product-image-upload/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se reemplazara la captura de URL por carga de archivo en el modal de "Nuevo producto". El flujo exigira exactamente una imagen obligatoria por producto, validara archivo segun politicas operativas y permitira visualizar la imagen asociada en la gestion de productos.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite actual con almacenamiento de metadatos de imagen en modelos Django; archivos en almacenamiento local del proyecto  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Alta de producto con imagen completada y visible en la gestion en menos de 5 segundos percibidos  
**Constraints**: Mantener arquitectura y roles actuales; eliminar ingreso por URL; exigir exactamente 1 imagen obligatoria en alta  
**Scale/Scope**: Cambios acotados al flujo de nuevo producto, validacion de archivo y visualizacion asociada

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack y control de acceso vigente.

## Project Structure

### Documentation (this feature)

```text
specs/004-product-image-upload/
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

specs/004-product-image-upload/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion focalizada en `backend/products` para recepcion/validacion de archivo y en `frontend/src/pages/ProductsPage.tsx` para control de carga de imagen en modal.

## Complexity Tracking

No se registran violaciones de constitucion que requieran justificacion.
