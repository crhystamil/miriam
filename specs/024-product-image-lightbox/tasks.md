---

description: "Task list for feature 024-product-image-lightbox"
---

# Tasks: Visor de imagen ampliada en el detalle de producto

**Input**: Design documents from `/specs/024-product-image-lightbox/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/no-new-contracts.md, quickstart.md

**Tests**: NO automatizados. El frontend del proyecto no tiene runner de tests JS (ver `frontend/package.json`). La verificacion es **manual** segun `quickstart.md` + gate de build `npm run build` (tsc + vite), igual que el spec 023. No se generan tareas de test.

**Organization**: Tareas agrupadas por user story (US1=P1/abrir-cerrar, US2=P2/navegacion) para entrega incremental e independiente. Feature puramente frontend: 1 componente nuevo (`Lightbox`) + integracion en `ProductDetailPage` + CSS.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (distinto archivo, sin dependencias de tareas incompletas)
- **[Story]**: User story a la que pertenece (US1, US2)
- Rutas relativas al repo; cambios en `frontend/src/`

## Path Conventions

- **Web app**: `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/styles.css`
- No hay cambios en `backend/` (feature frontend-only; reusa variantes del spec 023)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar baseline verde y que no se requieren dependencias nuevas

- [X] T001 Verificar baseline: correr `npm run build` en `frontend/` y confirmar build verde sin errores antes de empezar (registrar el estado previo)
- [X] T002 [P] Confirmar en `frontend/package.json` que NO se anaden dependencias (el visor es custom, ver research.md R-001); documentar en el commit que se reusa react/react-dom/react-router-dom existentes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Esqueleto del modal compartido por US1 (abrir/cerrar) y US2 (navegar). Debe completarse antes de cualquier user story.

**⚠️ CRITICAL**: Las user stories dependen de este componente existir y renderizarse via portal.

- [X] T003 Exportar el tipo `GalleryImage` desde `frontend/src/pages/ProductDetailPage.tsx` (actualmente es un `type` local) para que pueda ser importado por el componente Lightbox, sin alterar la logica existente del `useMemo` que construye el array `gallery`
- [X] T004 Crear componente `Lightbox` en `frontend/src/components/Lightbox.tsx`: scaffold del archivo, `LightboxProps` (`images: GalleryImage[]`, `startIndex: number`, `alt: string`, `onClose: () => void`), render `null` cuando `images` esta vacio, y contenedor overlay renderizado via `createPortal(..., document.body)` con `role="dialog"` + `aria-modal="true"` + `aria-label` descriptivo (investigar R-002, R-003)
- [X] T005 [P] Anadir CSS base del visor en `frontend/src/styles.css`: clases `.lightbox-overlay` (fondo oscuro full-screen, fixed, z-index alto, flex center), `.lightbox-dialog` (contenedor de la imagen), `.lightbox-close` (boton cerrar visible arriba a la derecha), usando las variables CSS del proyecto (`--line`, `--shadow-sm`, etc.) y respetando el estilo de las clases `public-*` existentes

**Checkpoint**: El componente `Lightbox` existe, se renderiza via portal con rol de dialogo, y tiene estilos base. Aun sin comportamiento.

---

## Phase 3: User Story 1 - Abrir y cerrar el visor (Priority: P1) 🎯 MVP

**Goal**: Al hacer click en la imagen principal del detalle de producto se abre un visor a pantalla completa con la imagen ampliada (variante `large` del spec 023), cerrable por boton / backdrop / Escape, con bloqueo de scroll del fondo.

**Independent Test**: Abrir el detalle de un producto con imagen, hacer click en la imagen principal → se abre el visor con la imagen grande ajustada a la pantalla. Cerrar con X, click fuera y Escape funciona. El scroll del fondo queda bloqueado mientras esta abierto. (Cubre quickstart.md pasos 2, 6, 7.)

### Implementation for User Story 1

- [X] T006 [US1] Implementar bloqueo de scroll del fondo en `frontend/src/components/Lightbox.tsx`: `useEffect` que setea `document.body.style.overflow = 'hidden'` al montar y restaura el valor previo al desmontar (cleanup) para evitar fugas (FR-009, research.md R-004)
- [X] T007 [US1] Implementar mecanismos de cierre en `frontend/src/components/Lightbox.tsx`: handler `Escape` (keydown global en `useEffect`), `onClick` del boton cerrar, y `onClick` del overlay que cierra solo si el target es el overlay (no la imagen/dialogo). Ademas manejo de foco: al montar enfocar el boton cerrar, al desmontar restaurar el foco al elemento disparador (FR-002, FR-008; research.md R-003)
- [X] T008 [US1] Renderar la imagen actual en `frontend/src/components/Lightbox.tsx`: `<img>` con `src={images[startIndex].large}`, `alt={alt}`, `object-fit: contain`, dimensiones que respeten `max-width:100vw` / `max-height:100vh` (sin recortes relevantes, sin zoom/pan). Incluir `onError` que degrade el `src` por la cadena `large -> medium -> image_url -> FALLBACK_PRODUCT_IMAGE` y, si todo falla, muestre mensaje "No se pudo cargar la imagen" (FR-003, FR-004, edge caso imagen rota; research.md R-005, R-010)
- [X] T009 [US1] Integrar el visor en `frontend/src/pages/ProductDetailPage.tsx`: anadir estado `isLightboxOpen: boolean`, handler `onClick` en la `<img>` principal que abre el visor en el indice de la imagen activa (`activeImage`), render condicional `<Lightbox images={gallery} startIndex={...} alt={product.name} onClose={...} />`. Guard FR-010: si `gallery` esta vacio la imagen principal NO debe ser clicable (no se ofrece el visor sobre placeholder) (FR-001, FR-010)

**Checkpoint**: User Story 1 funcional y testeable de forma independiente. Click en imagen principal → visor abre, muestra imagen `large` ajustada, cierra con X/backdrop/Escape, scroll bloqueado, foco gestionado. Producto sin imagen no abre el visor.

---

## Phase 4: User Story 2 - Navegar entre imagenes dentro del visor (Priority: P2)

**Goal**: Con el visor abierto y varias imagenes, el usuario avanza/retrocede con botones (escritorio), flechas del teclado y swipe (movil); indicador de posicion; navegacion no circular; con una sola imagen no se muestran controles.

**Independent Test**: Abrir visor en un producto con varias imagenes → avanzar/retroceder con botones, flechas y swipe; indicador "X de Y" se actualiza; en los extremos el boton se deshabilita. Repetir en un producto con una sola imagen → no hay controles de navegacion. (Cubre quickstart.md pasos 3, 4, 8.)

### Implementation for User Story 2

- [X] T010 [US2] Anadir estado de navegacion en `frontend/src/components/Lightbox.tsx`: `currentIndex` (inicializado desde `startIndex`) con setters `prev`/`next` que hagan **clamp** no circular (no pasa de 0 ni de `length-1`). Actualizar la imagen renderizada (T008) para usar `images[currentIndex]` en vez de `images[startIndex]`, y resetear el fallback de error al cambiar de indice (FR-005; research.md R-007)
- [X] T011 [US2] Anadir botones prev/next en `frontend/src/components/Lightbox.tsx`: visibles en escritorio, con `disabled` en los extremos (no circular), `aria-label` ("Imagen anterior"/"Imagen siguiente"), y `onClick` que llame prev/next. Ocultar ambos botones cuando `images.length === 1` (FR-005, FR-006; research.md R-007, R-008)
- [X] T012 [P] [US2] Anadir CSS para botones de navegacion e indicador en `frontend/src/styles.css`: clases `.lightbox-nav`, `.lightbox-prev`, `.lightbox-next` (posicionados a izquierda/derecha, alcanzables con pulgar en movil), `.lightbox-counter` (indicador de posicion discreto abajo), estado `disabled` estilizado
- [X] T013 [US2] Anadir navegacion por teclado en `frontend/src/components/Lightbox.tsx`: extender el `useEffect` de keydown (T007) para que `ArrowLeft` llame `prev` y `ArrowRight` llame `next`, ignorando cuando `images.length === 1` (FR-008, SC-005)
- [X] T014 [US2] Anadir deteccion de swipe en `frontend/src/components/Lightbox.tsx`: handlers `onTouchStart` (registrar `clientX`/`clientY` iniciales) y `onTouchEnd` (calcular `deltaX`/`deltaY`; si `|deltaX| > 50` y `|deltaX| > |deltaY|`, avanzar si deltaX<0 o retroceder si deltaX>0). Ignorar cuando `images.length === 1` (FR-005 movil; research.md R-006)
- [X] T015 [US2] Anadir indicador de posicion en `frontend/src/components/Lightbox.tsx`: texto "X de Y" con `aria-live="polite"` que se actualiza al cambiar `currentIndex`. Ocultar cuando `images.length === 1` (FR-006, FR-007)

**Checkpoint**: US1 y US2 ambos funcionales. Navegacion completa por botones, teclado y swipe; indicador actualizado; no circular; una sola imagen sin controles.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validacion integral, responsive y gate de build

- [ ] T016 Recorrer manualmente los pasos 2-8 de `specs/024-product-image-lightbox/quickstart.md` en escritorio (abrir/cerrar, navegacion, teclado, una imagen, sin imagen, imagen rota) y documentar cualquier desviacion
- [ ] T017 Validacion responsive en movil (DevTools o dispositivo real): confirmar que la imagen cabe completa sin recortes relevantes (vertical alta y horizontal ancha), swipe no se confunde con scroll vertical, y botones cerrar/prev/next son alcanzables. Ajustar CSS en `frontend/src/styles.css` si hace falta
- [X] T018 Correr gate de build `npm run build` en `frontend/` y corregir cualquier error de tipos (tsc) o de bundle (vite); confirmar que no quedan warnings nuevos
- [ ] T019 Rechequeo de accesibilidad por teclado (SC-005): Tab → Enter abre visor, flechas navegan, Escape cierra, foco vuelve a la imagen principal al cerrar. Verificar con lector de pantalla (opcional) el anuncio "Imagen X de Y"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias. T001 primero (baseline); T002 en paralelo.
- **Foundational (Phase 2)**: Depende de T001. T003 (export tipo) antes de T004; T005 (CSS) paralelo a T004. **BLOCKS** todas las user stories.
- **US1 (Phase 3)**: Depende de Phase 2. T006 → T007 → T008 secuenciales (mismo archivo `Lightbox.tsx`); T009 (`ProductDetailPage.tsx`) depende de T004 (y se prueba con T008).
- **US2 (Phase 4)**: Depende de **US1 completo** (construye sobre el visor ya abierto y mostrando imagen). T010 → T011 → T013 → T014 → T015 secuenciales en `Lightbox.tsx`; T012 (CSS) paralelo.
- **Polish (Phase 5)**: Depende de US1 + US2 completos.

### User Story Dependencies

- **US1 (P1)**: Tras Foundational. Sin dependencias de otras stories. **MVP independiente**.
- **US2 (P2)**: Depende de US1 (el visor y la imagen ya estan; US2 anade navegacion sobre eso). No es bloqueante para el valor de US1.

### Parallel Opportunities

- T002 y T005 marcadas [P] (distinto archivo, sin depenencias).
- T012 [P] dentro de US2 (CSS vs logica en `Lightbox.tsx`).
- Dentro de cada archivo (`Lightbox.tsx`, `ProductDetailPage.tsx`, `styles.css`) las tareas son secuenciales para evitar conflictos de edicion.

---

## Parallel Example: Foundational + US2

```bash
# Foundational (distintos archivos, en paralelo tras T001):
Task T003: "Exportar GalleryImage en frontend/src/pages/ProductDetailPage.tsx"
Task T005: "CSS base del visor en frontend/src/styles.css"

# US2 (CSS paralelo a la logica de Lightbox.tsx):
Task T012: "CSS de botones/indicador en frontend/src/styles.css"
# ...mientras se trabaja T010-T011-T013-T014-T015 en Lightbox.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. **Phase 1**: Confirmar baseline build verde (T001).
2. **Phase 2**: Foundational — crear `Lightbox.tsx` + CSS base (T003-T005).
3. **Phase 3**: US1 — abrir/cerrar/imagen/scroll-lock/integracion (T006-T009).
4. **STOP y VALIDAR**: Probar quickstart.md pasos 2, 6, 7. Ya hay valor entregado (inspeccionar la imagen ampliada).

### Incremental Delivery

1. Setup + Foundational → componente existe y se renderiza via portal.
2. + US1 → visor funcional abrir/cerrar **(MVP desplegable)**.
3. + US2 → navegacion entre imagenes.
4. + Polish → validacion responsive, a11y, build gate.

### Notas

- **Sin tests automatizados** (el proyecto no tiene runner JS; verificacion manual + `npm run build`). Si en el futuro se anade Vitest/Playwright, generar tareas de test por separado.
- **Sin cambios de backend** (feature frontend-only; reusa `thumbnail_url`/`medium_url`/`large_url` del spec 023).
- Confirmar commit por tarea o grupo logico; respetar el estilo del repo (CSS plano, componentes funcionales, sin acentos en textos UI segun spec 023).
