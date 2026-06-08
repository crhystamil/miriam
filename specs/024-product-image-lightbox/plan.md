# Implementation Plan: Visor de imagen ampliada en el detalle de producto

**Branch**: `main` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/024-product-image-lightbox/spec.md`

## Summary

Anadir un visor (lightbox) en la vista publica de detalle de producto: al hacer click en la imagen principal se abre un modal a pantalla completa que muestra la imagen en mayor tamano (variante `large` del spec 023), con cierre por boton / click fuera / Escape, navegacion entre imagenes (botones en escritorio + swipe en movil) e indicador de posicion. Es un cambio **puramente frontend** (un componente nuevo + integracion en `ProductDetailPage` + CSS); no toca backend ni agrega datos.

## Technical Context

**Language/Version**: TypeScript 5.8 + React 19 + Vite 8  
**Primary Dependencies**: `react`, `react-dom`, `react-router-dom` 7 (ya en el proyecto; **sin dependencias nuevas**)  
**Storage**: N/A (frontend; consume la API publica existente y las variantes WebP del spec 023)  
**Testing**: Verificacion manual en navegador (no hay runner de tests JS configurado); gate de build `npm run build` (tsc + vite); backend sin cambios  
**Target Platform**: Navegadores web modernos (site publico responsivo, escritorio + movil)  
**Project Type**: web-app (porcion frontend)  
**Performance Goals**: Apertura del visor < 300ms percibido; sin layout shift; la imagen ya llega optimizada (WebP 1200px del spec 023, ~22KB promedio)  
**Constraints**: No agregar dependencias JS (mantener bundle ligero); accesibilidad por teclado (WAI-ARIA dialog); sin cambios de backend; funcionar en pantallas pequenas  
**Scale/Scope**: 1 componente nuevo (`Lightbox`), edicion de `ProductDetailPage.tsx`, anadir CSS en `styles.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` es un template sin llenar (placeholders `[PRINCIPLE_N_NAME]` / `[GOVERNANCE_RULES]` sin contenido real). No existen principios ni gates formalmente ratificados que aplicar.

**Resultado del gate**: PASS (sin constitution operativa). No se registran violaciones. Se reutilizan los acuerdos del spec 023: no agregar dependencias innecesarias, seguir los patrones del repositorio (CSS plano, componentes funcionales, sin acentos en textos).

## Project Structure

### Documentation (this feature)

```text
specs/024-product-image-lightbox/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── no-new-contracts.md   # Phase 1 output (feature sin nueva API)
└── tasks.md             # (Phase 2 - /speckit.tasks, no creado aqui)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── pages/
│   │   └── ProductDetailPage.tsx   # MODIFICADO: integrar Lightbox
│   ├── components/
│   │   └── Lightbox.tsx            # NUEVO: visor modal accesible
│   ├── api/
│   │   └── types.ts                # (sin cambios; reusa variant URL del spec 023)
│   └── styles.css                  # MODIFICADO: clases .lightbox-*
└── package.json                    # (sin cambios)
```

**Structure Decision**: Porcion frontend del monorepo `backend/` + `frontend/` existente. El cambio se limita al frontend, dentro de los patrones actuales (componente funcional en `components/`, CSS plano con clases `public-*` / prefijo nuevo `lightbox-*`).

## Complexity Tracking

> Sin violaciones de constitution que justificar. (Tabla vacia a propositito.)
