# Research: Visor de imagen ampliada en el detalle de producto

**Feature**: 024-product-image-lightbox  
**Date**: 2026-06-07  
**Status**: Complete

## R-001: Componente custom vs libreria de lightbox

**Decision**: Implementar un componente `Lightbox` propio en `frontend/src/components/Lightbox.tsx`.

**Rationale**:
- El `package.json` actual no incluye ninguna libreria modal/lightbox ni gesture library; anadir una (react-photoswipe, yet-another-react-lightbox, fslightbox) aumentaria el bundle para una funcionalidad acotada.
- Los requisitos son simples (mostrar 1 imagen grande, 2 botones de navegacion, cierre, swipe basico, accesibilidad). Cubren con ~150 lineas de React + CSS.
- Mantiene la filosofia del spec 023 (no inflar dependencias) y el estilo del repo (componentes funcionales, CSS plano).

**Alternatives considered**:
- `yet-another-react-lightbox`: muy completo y modular, pero arrastra deps y plugins (zoom, captions) fuera de alcance.
- `react-photoswipe`: potente, pero API orientada a galerias grandes; sobredimensionado para 1-N imagenes por producto.
- `basic-react-lightbox`: demasiado minimal, sin swipe ni navegacion nativa.

## R-002: Render via Portal

**Decision**: Renderizar el modal con `ReactDOM.createPortal(..., document.body)`.

**Rationale**:
- Evita problemas de z-index/stacking context del `public-detail-card` (que tiene `border-radius` y `overflow` controlados).
- Garantiza que el overlay cubra toda la ventana y capture eventos fuera de cualquier contenedor ancestro.

**Alternatives considered**: Render inline en `ProductDetailPage`. Descartada por riesgo de stacking/overflow heredados.

## R-003: Patron de accesibilidad (WAI-ARIA dialog)

**Decision**: Aplicar el patron modal dialog:
- `role="dialog"`, `aria-modal="true"`, `aria-label` descriptivo.
- Focus trap: al abrir, mover el foco al boton cerrar; al cerrar, devolver el foco al elemento disparador (la imagen principal).
- Cierre con `Escape` (FR-002).
- Navegacion con `ArrowLeft` / `ArrowRight` (FR-005/FR-008).
- Indicador de posicion con `aria-live="polite"` ("Imagen X de Y") para FR-007.
- Botones con `aria-label` ("Cerrar", "Imagen anterior", "Imagen siguiente").

**Rationale**: Cumple FR-008 y SC-005 (operable por teclado) sin libreria de a11y.

**Alternatives considered**: Patron " disclosure" sin focus trap. Descartada porque el modal es focus-stealing por naturaleza.

## R-004: Bloqueo del scroll del fondo

**Decision**: Al abrir, setear `document.body.style.overflow = 'hidden'`; al cerrar, restaurar el valor previo (cleanup en `useEffect` para evitar fugas si el componente se desmonta).

**Rationale**: Cumple FR-009 (bloquear scroll del fondo).

**Alternatives considered**: Libreria `body-scroll-lock`. Descartada: una linea de CSS basta para este caso (sin scroll anidado dentro del modal).

## R-005: Fuente de imagen (variante a mostrar)

**Decision**: Usar la variante **`large_url`** del spec 023 como fuente del visor, con fallback `large_url -> medium_url -> image_url` (cadena ya materializada como `GalleryImage.large` en `ProductDetailPage.tsx:71`).

**Rationale**:
- `large` (WebP 1200px, q80, ~22KB promedio) es la mayor calidad generada y se ve nitida a pantalla completa en mayoria de dispositivos.
- Evita descargar el original (hasta 5MB) solo para el visor: mejor rendimiento en conexiones lentas (alineado con el objetivo del spec 023).
- Reutiliza el array `gallery` ya construido en `ProductDetailPage` (no hay que tocar el data-flow).

**Alternatives considered**: Cargar el `image_url` original (maximo detalle). Descartada: penaliza conexiones lentas y anula la optimizacion del spec 023.

## R-006: Deteccion de swipe sin libreria de gestos

**Decision**: Manejar `onTouchStart` (registrar `clientX`/`clientY` inicial) y `onTouchEnd` (calcular `deltaX`); si `|deltaX| > 50` y mayor que `|deltaY|` (swipe horizontal claro), avanzar/retroceder segun signo. Umbral y comparacion con delta vertical evitan falsos positivos al hacer scroll vertical incidental.

**Rationale**: Cumple FR-005 (swipe en movil) sin anadir hammerjs/use-gesture. ~10 lineas de logica.

**Alternatives considered**: `react-swipeable`. Descartada: dep innecesaria para 2 direcciones.

## R-007: Navegacion circular vs limitada

**Decision**: Navegacion **no circular**. En el extremo, el boton correspondiente se deshabilita (`disabled` + `aria-disabled`) y la flecha del teclado no hace nada. El indicador refleja "1 de N" / "N de N".

**Rationale**:
- Es predecible (US2 acceptance 2 pide "deshabilitado o vuelve a la ultima ... de forma predecible").
- Mas simple accesiblemente que saltar al otro extremo.

**Alternatives considered**: Navegacion circular (al siguiente de la ultima va a la primera). Descartada por acuerdo del acceptance scenario.

## R-008: Visor con una sola imagen

**Decision**: Si `gallery.length === 1`, no renderizar botones prev/next ni indicador numerico; solo la imagen + boton cerrar. Cumple FR-006.

**Rationale**: Evita confundir al usuario (US2 acceptance 3) y reduce peso visual.

## R-009: Edge — producto sin imagen / visor sin apertura

**Decision**: Si `gallery` esta vacio, `ProductDetailPage` ya muestra el `FALLBACK_PRODUCT_IMAGE`. En ese caso la `<img>` principal NO sera clicable (sin handler onClick que abra el visor), cumpliendo FR-010. Si solo existe el fallback (sin galeria real), tampoco se ofrece el visor.

**Rationale**: Un visor sobre un placeholder SVG no aporta valor; FR-010 lo proibe.

## R-010: Edge — imagen rota / no carga dentro del visor

**Decision**: Anadir `onError` al `<img>` del visor que intercambia el `src` al siguiente escalon del fallback (`large -> medium -> image -> FALLBACK_PRODUCT_IMAGE`) y, si todos fallan, muestra un mensaje "No se pudo cargar la imagen" con boton cerrar visible.

**Rationale**: Cumple el edge case "imagen rota o conexion inestable" de forma resiliente sin rompar el modal.

## R-011: Interaccion con la navegacion del navegador ( boton atras )

**Decision**: El visor es estado efimero (no integra history API). Si el usuario presiona "atras" estando el visor abierto, cambia de ruta y se desmonta `ProductDetailPage`, llevandose el portal consigo. No se anade entrada al historial.

**Rationale**: Fuera de alcance anadir deep-link/hash del visor; el flujo natural (atras = salir del producto) es intuitivo y no requiere codigo extra.

**Alternatives considered**: Push de hash `#imagen` + popstate para cerrar. Descartada: complejidad innecesaria para el valor actual.
