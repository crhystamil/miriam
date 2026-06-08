# Quickstart: Visor de imagen ampliada

**Feature**: 024-product-image-lightbox  
**Date**: 2026-06-07

Verificacion manual del visor en el detalle de producto. Requiere backend corriendo (con las variantes WebP del spec 023 ya generadas) y frontend en dev.

## 1. Requisitos previos

```bash
# Backend: variantes generadas (solo la primera vez o tras deploy)
cd backend
.venv/bin/python manage.py generate_image_variants
.venv/bin/python manage.py runserver
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

Abrir el site publico (por defecto `http://localhost:5173`).

## 2. Caso base: abrir y cerrar (US1)

1. Navegar al **Catalogo** y abrir el detalle de cualquier producto **con imagen**.
2. Hacer **click en la imagen principal** (la grande).
3. Verificar que se abre un **visor a pantalla completa** con la imagen en mayor tamano.
4. Probar las 3 formas de cerrar (una por vez):
   - Click en el boton **cerrar (X)**.
   - Click en el **area oscura fuera** de la imagen.
   - Tecla **Escape**.
5. En cada caso verificar que se vuelve a la vista de detalle y el **scroll del fondo se reactiva**.

**Esperado**: abre al click; cierra con los 3 mecanismos; sin scroll del fondo mientras abierto (FR-001, FR-002, FR-009).

## 3. Navegacion entre varias imagenes (US2)

1. Abrir el detalle de un producto **con 2+ imagenes**.
2. Click en la imagen principal -> abre el visor.
3. Verificar el **indicador de posicion** ("X de Y") y los botones **siguiente / anterior**.
4. Avanzar/retroceder con:
   - **Botones** (escritorio).
   - **Flechas del teclado** `←` / `→` (teclado).
   - **Swipe horizontal** en movil (deslizar izquierda = siguiente, derecha = anterior).
5. Llegar al primer/ultimo y verificar que el boton correspondiente se **deshabilita** (no circular).

**Esperado**: cambia de imagen sin cerrar; en extremos se deshabilita; indicador se actualiza (FR-005, FR-006, FR-007).

## 4. Producto con una sola imagen

1. Abrir el detalle de un producto con **una sola imagen**.
2. Click en la imagen -> abre el visor.
3. Verificar que **NO aparecen** los botones siguiente/anterior ni el indicador numerico.

**Esperado**: visor limpio, solo imagen + cerrar (FR-006).

## 5. Producto sin imagen / placeholder (edge)

1. Abrir el detalle de un producto **sin imagen** (muestra el placeholder SVG).
2. Verificar que la imagen principal **NO es clicable** (cursor por defecto, no abre visor).

**Esperado**: no se ofrece el visor sobre placeholder (FR-010).

## 6. Imagen rota / conexion lenta (edge)

1. Con el visor abierto, simular imagen rota: en DevTools -> Network -> bloquear la URL de la variante `large` (o poner la red en Offline).
2. Verificar que el visor **no se rompe**: cae al siguiente fallback (`medium` -> `image_url` -> placeholder) o muestra mensaje "No se pudo cargar la imagen", siempre con el boton cerrar usable.

**Esperado**: degradacion elegante, cierre siempre posible.

## 7. Accesibilidad por teclado (SC-005)

1. Con teclado: `Tab` hasta la imagen principal del detalle, `Enter`/`Space` abre el visor.
2. `←` / `→` navegan entre imagenes.
3. `Escape` cierra.
4. Al cerrar, el **foco vuelve** a la imagen principal.
5. Verificar con lector de pantalla (opcional) que el dialogo anuncia "Imagen X de Y".

**Esperado**: flujo completo sin mouse (FR-008, SC-005).

## 8. Responsive (movil)

Repetir los pasos 2-3 en viewport movil (DevTools toggle o dispositivo real), confirmando:
- Swipe funciona y no se confunde con scroll vertical.
- Botones son alcanzables con el pulgar.
- La imagen cabe completa sin recortes relevantes en vertical y horizontal (FR-003).

## 9. Gate de build

```bash
cd frontend && npm run build
```

**Esperado**: `tsc -b` y `vite build` sin errores (sin type errors, sin warnings nuevos).

## Criterio de aceptacion global

La feature se considera lista cuando los pasos 2-7 pasan en escritorio y movil (paso 8), y `npm run build` (paso 9) es verde.
