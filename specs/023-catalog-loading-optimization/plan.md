# Implementation Plan: Optimizacion de carga del catalogo y vista mayorista

**Branch**: `main` | **Date**: 2026-06-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/023-catalog-loading-optimization/spec.md`

## Summary

Mejorar el tiempo de carga del catalogo publico y la vista mayorista en conexiones lentas mediante tres frentes coordinados: (1) el backend genera variantes de imagen optimizadas (miniatura, mediana y grande en formato WebP calidad ~80) al subir cada imagen y mediante un comando de migracion para las ~205 imagenes existentes, exponiendo las URLs de cada variante en la API de productos; (2) la vista mayorista pasa a ser paginada con un boton "cargar mas" y su buscador consulta al backend de inmediato sin necesidad de haber cargado toda la lista; y (3) las vistas publicas (catalogo, mayorista y detalle) aplican carga diferida (lazy loading), dimensiones para evitar layout shift y srcset responsivo que usa la variante adecuada segun la vista. Se conserva el archivo original como fuente maestra y el panel administrativo queda fuera de alcance.

## Technical Context

**Language/Version**: Backend Python 3.13 con Django 5.2 y Django REST Framework 3.17; Frontend TypeScript con React 19 + Vite
**Primary Dependencies**: Django REST Framework; Pillow (NUEVA, a agregar a `backend/requirements.txt`); React Router. Reutiliza la session de navegador del spec 022 para el acceso mayorista.
**Storage**: SQLite (`backend/db.sqlite3`); archivos bajo `MEDIA_ROOT` (`backend/media/products/`); las variantes optimizadas se almacenan junto al original, que se conserva intacto como fuente maestra.
**Testing**: Backend con `backend/.venv` ejecutando pruebas estilo Django TestCase (`products/tests_api.py`, `products/tests.py`); Frontend `npm run build` (Vite) mas chequeos manuales de aceptacion (buscador inmediato, paginacion, lazy load en Network).
**Target Platform**: Aplicacion web (SPA React + REST Django) en navegadores de escritorio y moviles; servidor Apache (la configuracion de cache de Apache queda fuera de este alcance).
**Project Type**: Web application (React SPA + Django REST backend)
**Performance Goals**: Reduccion >= 80% del peso promedio de imagenes servidas en el catalogo; primer grupo de productos mayorista + ejecucion de busqueda en < 5 s sobre una conexion lenta (perfil 3G); 0 descargas de imagenes que esten fuera de la pantalla visible.
**Constraints**: Conservar el original como maestro (no reemplazarlo); mantener el limite de upload en 5 MB (sin reduccion); panel administrativo fuera de alcance; no requiere cambios de autenticacion ni de la barrera de acceso por celular (spec 022); la configuracion de cache de Apache se aborda en un spec complementario.
**Scale/Scope**: ~189 productos activos y 205 imagenes existentes a migrar (~58 MB reales en disco); 3 vistas frontend a modificar (`CatalogPage`, `WholesalerProductsPage`, `ProductDetailPage`) + 1 componente (`PublicProductCard`); 1 comando de migracion nuevo; 1 app Django afectada (`products`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

La constitucion del proyecto (`/home/crhyst/Projects/miriam/.specify/memory/constitution.md`) es una plantilla sin principios, restricciones ni gates definidos. No se identifican violaciones constitucionales.

## Project Structure

### Documentation (this feature)

```text
specs/023-catalog-loading-optimization/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── product-image-variants-api.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── products/
│   ├── models.py                       # Add variant fields to ProductImage
│   ├── serializers.py                  # Expose variant URLs in ProductImage & Product
│   ├── services.py                     # Generate variants on create/update with Pillow
│   ├── image_variants.py               # NEW: Pillow variant generation helper
│   ├── management/
│   │   └── commands/
│   │       └── generate_image_variants.py   # NEW: one-shot migration command
│   └── migrations/
│       └── 0XXX_productimage_variants.py    # NEW: schema migration
├── requirements.txt                    # Add Pillow
└── media/products/                     # Existing originals + generated variant files

frontend/
└── src/
    ├── api/
    │   ├── products.ts                 # No signature change (uses new fields from types)
    │   └── types.ts                    # Add variant URL fields to Product & ProductImage
    ├── components/
    │   └── PublicProductCard.tsx       # lazy + width/height + srcset (thumbnail)
    └── pages/
        ├── CatalogPage.tsx             # Already paginated; card changes propagate
        ├── WholesalerProductsPage.tsx  # Replace load-all loop with pagination + immediate search
        └── ProductDetailPage.tsx       # large for main image, thumbnail for gallery, lazy
```

**Structure Decision**: Aplicacion web existente (backend Django + frontend React). El cambio se concentra en la app `products` del backend (modelo, serializador, servicios, nuevo helper de Pillow y nuevo comando de migracion) y en tres vistas publicas del frontend mas el componente de tarjeta. No se crean nuevos modulos de primer nivel ni nuevas apps; se aprovecha la paginacion DRF ya configurada (`PAGE_SIZE=10`).

## Phase 0: Research

Ver [research.md](./research.md). Cubre: integracion de Pillow en Django, almacenamiento de variantes, comando de migracion idempotente, formato WebP y soporte de navegadores, srcset/sizes y lazy loading, y diseno del buscador mayorista inmediato sobre paginacion existente.

## Phase 1: Design & Contracts

Ver [data-model.md](./data-model.md), [contracts/product-image-variants-api.md](./contracts/product-image-variants-api.md) y [quickstart.md](./quickstart.md).

## Constitution Check (Post-Design)

La solucion propuesta mantiene el alcance acotado a las vistas publicas y la app `products`, no introduce nuevos mecanismos de autenticacion ni altera el limite de upload acordado (5 MB), y conserva el original como fuente maestra. No viola gates constitucionales activos (la constitucion no define ninguno).

## Complexity Tracking

No aplica; no hay violaciones constitucionales ni complejidad excepcional que justificar.
