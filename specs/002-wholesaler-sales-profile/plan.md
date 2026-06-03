# Implementation Plan: Perfil de mayorista en ventas

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/002-wholesaler-sales-profile/spec.md`
**Input**: Feature specification from `/specs/002-wholesaler-sales-profile/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se agregara soporte de perfil de mayorista al flujo de ventas para asociar cada venta a un cliente mayorista identificado por nombre y telefono normalizado. El registro de venta solo permitira seleccionar mayoristas existentes (alta fuera del formulario de ventas), se reforzara la validacion de telefono con minimo de 8 digitos tras normalizacion y se habilitara consulta/filtrado de ventas por mayorista para rastrear productos comprados.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite actual con modelos Django (extender `Sale` y nuevo `Wholesaler` si aplica)  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Registro de venta con mayorista sin degradar tiempos actuales; filtrado por mayorista usable en listas operativas  
**Constraints**: Mantener roles/rutas actuales; no permitir alta de mayorista dentro del formulario de ventas; normalizacion telefonica obligatoria  
**Scale/Scope**: Cambios en modulo ventas, modelo/permisos de datos de mayorista y listados/reportes relacionados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion actual contiene placeholders sin principios ejecutables.
- Gate pre-Phase0: PASS (sin reglas normativas activas que bloqueen).
- Gate post-Phase1: PASS (diseno consistente con arquitectura existente y sin violaciones verificables).

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

specs/002-wholesaler-sales-profile/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web actual del repositorio. Implementacion focalizada en `backend/sales`, posible app/modelo en `backend/core` o `backend/sales` para mayorista, y ajuste de `frontend/src/pages/SalesPage.tsx` con soporte de seleccion/consulta de mayorista.

## Complexity Tracking

No se requieren excepciones de complejidad para esta feature.
