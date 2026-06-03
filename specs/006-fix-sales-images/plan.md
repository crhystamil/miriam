# Implementation Plan: Corregir imagenes en registrar venta

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-11 | **Spec**: `specs/006-fix-sales-images/spec.md`
**Input**: Feature specification from `/specs/006-fix-sales-images/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se reemplazara en el modal de registrar venta la logica de imagenes estaticas por imagenes reales del producto seleccionado. Cuando el producto tenga multiples fotos, se mostrara siempre la primera segun orden de posicion. Si el producto no tiene fotos o falla la carga, se mostrara un fallback claro sin bloquear el flujo de venta.

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
**Performance Goals**: Cambio de producto en modal refleja imagen correcta en menos de 1 segundo percibido  
**Constraints**: Mantener arquitectura y permisos actuales; usar foto real del catalogo; usar primera foto por `position`; fallback claro sin bloquear venta  
**Scale/Scope**: Cambios acotados al flujo de registrar venta y consumo de datos de imagen de producto

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack y permisos existentes.

## Project Structure

### Documentation (this feature)

```text
specs/006-fix-sales-images/
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
├── sales/
└── config/

frontend/
├── src/
│   ├── api/
│   ├── pages/
│   ├── components/
│   └── styles.css

specs/006-fix-sales-images/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion centrada en `frontend/src/pages/SalesPage.tsx` y `frontend/src/api/products.ts` para consumir imagen real del producto. En backend se reutiliza contrato existente de productos con coleccion de fotos ordenadas.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
