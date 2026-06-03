# Implementation Plan: Corregir error al registrar venta

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/007-fix-sale-submit-error/spec.md`
**Input**: Feature specification from `/specs/007-fix-sale-submit-error/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se corregira el flujo de registro de venta en la vista de ventas para eliminar el error que impide crear ventas. El alcance incluye frontend y backend para asegurar envio valido, respuesta clara de error/exito, consistencia de estado del modal y actualizacion correcta del listado despues de cada intento.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para datos operativos y `MEDIA_ROOT` para archivos de producto  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Registro exitoso o error validado visible al usuario en menos de 2 segundos percibidos  
**Constraints**: Mantener reglas de negocio actuales de ventas/stock; corregir flujo end-to-end (frontend+backend) sin ampliar alcance funcional  
**Scale/Scope**: Cambios acotados a modal de ventas, endpoint de creacion de venta y manejo de estado/errores asociados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack, permisos y flujos actuales.

## Project Structure

### Documentation (this feature)

```text
specs/007-fix-sale-submit-error/
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

specs/007-fix-sale-submit-error/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion centrada en `frontend/src/pages/SalesPage.tsx` para envio/estado del modal y en capa de ventas backend (`backend/sales/`) para validar/normalizar creacion de venta y respuestas de error coherentes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
