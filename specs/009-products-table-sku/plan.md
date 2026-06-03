# Implementation Plan: Mejorar tabla de productos y SKU autogenerado

**Branch**: `[001-iam-repuestos-system]` | **Date**: 2026-05-12 | **Spec**: `specs/009-products-table-sku/spec.md`
**Input**: Feature specification from `/specs/009-products-table-sku/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Se mejorara la tabla de productos para admin y vendedor mostrando el conjunto completo de campos operativos definidos (SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa). Ademas, el SKU sera autogenerado al crear productos, se mostrara una sola imagen por fila y se conservaran acciones de gestion unicamente para administrador.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (frontend), Python 3.12 (backend existente)  
**Primary Dependencies**: React 19, React Router 7, Vite 8, Django 5.2, DRF  
**Storage**: SQLite para metadatos de catalogo/stock y almacenamiento local de imagenes en `MEDIA_ROOT`  
**Testing**: `npm run build`, `.venv/bin/python manage.py check`, `.venv/bin/python manage.py test`  
**Target Platform**: Aplicacion web responsive (desktop/mobile)
**Project Type**: Web app full-stack (frontend + backend)  
**Performance Goals**: Tabla de productos renderiza filas completas y acciones en menos de 2 segundos percibidos  
**Constraints**: Mantener permisos actuales por rol; autogenerar SKU unico en alta; mostrar solo una imagen por producto en tabla; conservar acciones de admin  
**Scale/Scope**: Cambios acotados a flujo de listado/alta de productos y serializacion de datos de producto

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Archivo de constitucion en estado placeholder, sin principios normativos ejecutables.
- Gate pre-Phase0: PASS (sin restricciones obligatorias activas).
- Gate post-Phase1: PASS esperado al mantener coherencia con stack y roles existentes.

## Project Structure

### Documentation (this feature)

```text
specs/009-products-table-sku/
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

specs/009-products-table-sku/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Se mantiene estructura web existente. Implementacion centrada en `frontend/src/pages/ProductsPage.tsx` para columnas/acciones por rol y en `backend/products/` para autogeneracion de SKU y exposicion de datos de imagen representativa.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No se registran violaciones de constitucion que requieran justificacion.
