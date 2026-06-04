# Implementation Plan: Actualizar contacto y WhatsApp

**Branch**: `main` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-contact-whatsapp-update/spec.md`

## Summary

Actualizar la informacion publica de contacto con el WhatsApp `+59161617345`, direccion principal, Facebook y mapa provistos, y convertir el formulario de contacto en un enlace de WhatsApp con mensaje prellenado. El enfoque tecnico es centralizar constantes publicas de contacto en el frontend, actualizar las superficies publicas que contienen enlaces de WhatsApp y modificar la pagina de contacto para validar campos y abrir WhatsApp con los datos ingresados.

## Technical Context

**Language/Version**: TypeScript (React 19 frontend), Python 3.13 backend sin cambios esperados  
**Primary Dependencies**: React, React Router, Vite; navegador abre enlaces externos de WhatsApp/Google/Facebook  
**Storage**: N/A; no se guardan mensajes de contacto en backend ni base de datos  
**Testing**: Frontend `npm run build`; validacion manual de pagina de contacto, enlaces WhatsApp y mapa  
**Target Platform**: Paginas publicas web en navegador desktop/mobile  
**Project Type**: Web application (React SPA + Django REST backend)  
**Performance Goals**: Formulario genera enlace de WhatsApp inmediatamente tras validacion; pagina de contacto sigue cargando sin depender del iframe para mostrar direccion textual  
**Constraints**: No agregar backend ni persistencia para formularios; mantener enlaces externos seguros con nueva pestaña cuando aplique; usar numero internacional para enlaces de WhatsApp; actualizar enlaces publicos existentes para evitar inconsistencias  
**Scale/Scope**: Cambio acotado a superficies publicas de contacto: `ContactPage`, layout publico y enlaces WhatsApp de productos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto contiene placeholders y no define principios, restricciones ni gates aplicables. No hay violaciones constitucionales identificadas.

## Project Structure

### Documentation (this feature)

```text
specs/019-contact-whatsapp-update/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── public-contact-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── components/
    │   ├── PublicLayout.tsx        # CTA/footer de WhatsApp y contacto
    │   └── PublicProductCard.tsx   # Link WhatsApp de productos
    └── pages/
        ├── ContactPage.tsx         # Datos de contacto, mapa y formulario a WhatsApp
        └── ProductDetailPage.tsx   # Link WhatsApp de detalle de producto
```

**Structure Decision**: Cambio frontend sin backend. Se recomienda una fuente unica de datos de contacto compartida por paginas/componentes publicos si evita duplicacion, manteniendo el alcance pequeno.

## Phase 0: Research

Ver [research.md](./research.md).

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/public-contact-ui.md](./contracts/public-contact-ui.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta no introduce backend ni persistencia, mantiene cambios acotados al frontend publico y no viola gates constitucionales activos.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional.
