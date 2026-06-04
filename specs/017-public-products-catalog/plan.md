# Implementation Plan: Catalogo publico con productos reales

**Branch**: `main` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-public-products-catalog/spec.md`

## Summary

Conectar las paginas publicas de catalogo, detalle de producto e inicio con productos reales registrados, reemplazando el arreglo estatico de ejemplo. El enfoque tecnico es consumir el endpoint existente de productos para lecturas publicas, conservar el filtrado de productos activos, soportar busqueda y paginacion progresiva, y evitar mostrar campos internos en la interfaz publica.

## Technical Context

**Language/Version**: Python 3.13 (Django backend), TypeScript (React 19 frontend)  
**Primary Dependencies**: Django REST Framework, django-cors-headers, React Router, Vite  
**Storage**: SQLite via Django ORM; productos e imagenes existentes en `products_product` y `products_productimage`  
**Testing**: Django `manage.py test products`; frontend `npm run build`; validacion manual de catalogo invitado  
**Target Platform**: Web app servida en navegador, con backend Django detras de servidor web  
**Project Type**: Web application (Django REST backend + React SPA frontend)  
**Performance Goals**: Catalogo publico muestra el primer grupo de productos en menos de 3 segundos bajo condiciones normales; busquedas exactas devuelven resultados visibles sin recargar la pagina completa  
**Constraints**: No agregar migraciones de base de datos; no romper el CRUD administrativo de productos; usar productos activos como inventario publico; no renderizar datos internos de costo/stock mayorista en pantallas publicas  
**Scale/Scope**: Catalogo publico para cientos de productos, usando la paginacion existente de 10 resultados por pagina y carga progresiva para navegar mas resultados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto contiene placeholders y no define principios, restricciones ni gates aplicables. No hay violaciones constitucionales identificadas.

## Project Structure

### Documentation (this feature)

```text
specs/017-public-products-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── public-products.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── config/
│   └── urls.py                 # Router existente /api/products/
└── products/
    ├── views.py                # Queryset publico: activos, search, paginacion DRF
    ├── serializers.py          # Campos disponibles para productos e imagenes
    └── tests_api.py            # Cobertura de lectura publica y filtros

frontend/
└── src/
    ├── api/
    │   ├── products.ts         # Cliente de productos con filtros/page/search
    │   └── types.ts            # Tipos Product, ProductImage, PaginatedResponse
    ├── components/
    │   └── PublicProductCard.tsx
    └── pages/
        ├── CatalogPage.tsx
        ├── ProductDetailPage.tsx
        └── LandingPage.tsx
```

**Structure Decision**: Mantener el endpoint de productos existente y cambiar las paginas publicas para consumirlo. La separacion se mantiene entre API compartida (`frontend/src/api/products.ts`) y pantallas publicas (`frontend/src/pages/*`, `frontend/src/components/PublicProductCard.tsx`). No se requiere nuevo modelo ni migracion.

## Phase 0: Research

Ver [research.md](./research.md).

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/public-products.md](./contracts/public-products.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta mantiene cambios acotados en frontend y pruebas/API existentes. No hay gates constitucionales activos ni violaciones que justificar.

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional.
