# Implementation Plan: Resolver conflicto de acceso admin

**Branch**: `main` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-fix-admin-conflict/spec.md`

## Summary

Separar el acceso administrativo interno del login del portal de repuestos para que visitar el panel administrativo del backend no sea interceptado por la ruta protegida del frontend. El enfoque tecnico es reservar `/admin/` exclusivamente para el panel administrativo del backend y mover la ruta administrativa actual del portal a una ruta propia no conflictiva, manteniendo `/login` como login del portal.

## Technical Context

**Language/Version**: Python 3.13 with Django 5.2 backend; TypeScript with React 19 frontend  
**Primary Dependencies**: Django admin, Django REST Framework, React Router, Vite  
**Storage**: Existing SQLite database; no schema or data changes expected  
**Testing**: Backend Django tests/checks where relevant; frontend `npm run build`; manual navigation checks for `/admin/`, `/login`, and the renamed portal admin route  
**Target Platform**: Web application in browser with Django backend  
**Project Type**: Web application (React SPA + Django REST backend)  
**Performance Goals**: Route resolution and redirects remain immediate for normal navigation; no additional network calls or blocking startup work  
**Constraints**: Preserve Django admin at `/admin/`; preserve portal login at `/login`; avoid changing authentication model, permissions, database, or public catalog routes  
**Scale/Scope**: Small routing change limited to frontend route definitions/guards and verification of backend admin availability

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto no define principios, restricciones ni gates aplicables. No hay violaciones constitucionales identificadas.

## Project Structure

### Documentation (this feature)

```text
specs/020-fix-admin-conflict/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── admin-route-ui.md
└── tasks.md
```

### Source Code (repository root)
```text
backend/
└── config/
    ├── urls.py        # Django admin remains registered at /admin/
    └── settings.py    # Existing auth/session configuration

frontend/
└── src/
    ├── router/
    │   ├── routes.tsx # Move portal admin route away from /admin
    │   └── guards.tsx # Keep portal auth redirects to /login
    └── pages/
        └── LoginPage.tsx # Portal login remains at /login
```

**Structure Decision**: Web application structure. The fix should be implemented at the routing boundary: backend keeps `/admin/` for Django admin, frontend stops claiming `/admin` for the portal.

## Phase 0: Research

Ver [research.md](./research.md).

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/admin-route-ui.md](./contracts/admin-route-ui.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta mantiene el alcance pequeno, no introduce cambios de datos ni nuevos sistemas, y no viola gates constitucionales activos.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional.
