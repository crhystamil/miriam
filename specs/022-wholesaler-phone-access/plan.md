# Implementation Plan: Acceso por celular para mayoristas

**Branch**: `main` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-wholesaler-phone-access/spec.md`

## Summary

Agregar una barrera simple para la vista de productos mayorista: antes de mostrar informacion mayorista, el visitante ingresa un numero de celular valido y obtiene acceso temporal sin usuario, contrasena ni cuenta. El enfoque tecnico es implementar una compuerta frontend reutilizable para la ruta mayorista, validar formato de celular, guardar solo una sesion temporal del navegador y mantener la experiencia facil de completar.

## Technical Context

**Language/Version**: TypeScript with React 19 frontend; Python 3.13 with Django 5.2 backend not expected to change for this feature  
**Primary Dependencies**: React, React Router, Vite; browser session storage for temporary access state  
**Storage**: Temporary browser session only; no database schema changes and no account credentials  
**Testing**: Frontend `npm run build`; manual acceptance checks for phone validation, refresh behavior, direct route access, and session expiry behavior  
**Target Platform**: Web application in desktop/mobile browsers  
**Project Type**: Web application (React SPA + Django REST backend)  
**Performance Goals**: Access form submits immediately after local validation; no added network dependency before showing the mayorista view  
**Constraints**: No username/password flow; do not create accounts; collect only phone number; keep access friction low; treat the barrier as light protection, not strong authentication  
**Scale/Scope**: Small frontend access gate around the mayorista products view and any related mayorista routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto no define principios, restricciones ni gates aplicables. No hay violaciones constitucionales identificadas.

## Project Structure

### Documentation (this feature)

```text
specs/022-wholesaler-phone-access/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── wholesaler-phone-access-ui.md
└── tasks.md
```

### Source Code (repository root)
```text
frontend/
└── src/
    ├── router/
    │   ├── routes.tsx        # Add protected mayorista route wrapper
    │   └── guards.tsx        # Add lightweight mayorista access guard if shared
    ├── pages/
    │   └── WholesalerProductsPage.tsx # Target mayorista products view
    └── state/
        └── wholesalerAccess.tsx       # Temporary browser-session access state if needed
```

**Structure Decision**: Frontend-only access gate. The backend remains unchanged unless a later feature requires server-side allowlisting or audit storage.

## Phase 0: Research

Ver [research.md](./research.md).

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/wholesaler-phone-access-ui.md](./contracts/wholesaler-phone-access-ui.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta mantiene el alcance acotado, no introduce cuentas ni persistencia sensible, y no viola gates constitucionales activos.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional.
