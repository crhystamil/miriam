# Implementation Plan: Carga de multiples fotos por producto

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/005-multi-product-photos/spec.md`
**Input**: Feature specification from `/specs/005-multi-product-photos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se ampliara el flujo de "Nuevo producto" para soportar carga de multiples fotos por archivo local, con un rango permitido de 1 a 5 fotos por producto. El sistema validara cada archivo del lote y rechazara la operacion completa ante cualquier archivo invalido, mostrando errores claros y permitiendo visualizar la galeria resultante en la gestion de productos.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para metadatos y almacenamiento local de archivos en `MEDIA_ROOT`  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Alta con lote de fotos reflejada en gestion en menos de 5 segundos percibidos  
**Constraints**: Mantener arquitectura y roles actuales; soporte exclusivo de archivos locales; permitir entre 1 y 5 fotos por producto; rechazo atomico del lote si algun archivo falla  
**Scale/Scope**: Cambios acotados al modulo de productos (alta, validacion por archivo y galeria visual)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack, seguridad y permisos existentes.

## Project Structure

### Documentation (this feature)

```text
specs/005-multi-product-photos/
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

specs/005-multi-product-photos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion centrada en `backend/products` para modelo/servicio/serializacion de multiples fotos y en `frontend/src/pages/ProductsPage.tsx` para carga multiple y visualizacion de galeria en gestion.

## Complexity Tracking

No se registran violaciones de constitucion que requieran justificacion.
