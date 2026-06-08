# Feature Specification: Visor de imagen ampliada en el detalle de producto

**Feature Branch**: `[024-product-image-lightbox]`  
**Created**: 2026-06-07  
**Status**: Draft  
**Input**: User description: "al visualizar el detalle de un producto al hacer click en la imagen principal, debemos poder crear un popup o modal para poder ver la imagen completa y de un mayor tamano, para asi permitir al usuario poder visualizar mejor la imagen del producto."

## Clarifications

### Session 2026-06-07

- Q: Las miniaturas de la galeria tambien abren el visor, o solo la imagen principal? → A: Solo la imagen principal abre el visor; las miniaturas conservan su comportamiento actual (cambiar la imagen principal) y no abren el visor.
- Q: En movil, la navegacion entre imagenes es solo con botones o tambien con gestos de deslizamiento (swipe)? → A: Ambos: botones siguiente/anterior en escritorio, y ademas swipe (deslizar izquierda/derecha) en movil como apoyo.
- Q: El visor permite zoom adicional (acercarse mas y desplazarse/panear dentro de la imagen)? → A: No. El visor muestra unicamente la imagen ampliada ajustada a la pantalla, sin zoom+pan adicional.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir la imagen ampliada al hacer click (Priority: P1)

Como visitante en el detalle de un producto, quiero hacer click en la imagen principal para que se abra un visor ampliado con la imagen completa y mas grande, para apreciar los detalles del repuesto que no se distinguen en la miniatura.

**Why this priority**: Es la necesidad central del cambio: permitir inspeccionar la imagen con mayor detalle desde el lugar donde el usuario ya esta mirando el producto.

**Independent Test**: Abrir el detalle de un producto, hacer click en la imagen principal y verificar que se abre un visor con la imagen en mayor tamano y una forma clara de cerrarlo.

**Acceptance Scenarios**:

1. **Given** que un visitante esta en el detalle de un producto con imagen, **When** hace click en la imagen principal, **Then** se abre un visor (popup/modal) mostrando la imagen en tamano ampliado.
2. **Given** que el visor esta abierto, **When** el visitante hace click en el boton de cerrar, en el area exterior a la imagen, o presiona la tecla Escape, **Then** el visor se cierra y vuelve a la vista de detalle.
3. **Given** que el visor esta abierto, **When** se muestra la imagen, **Then** se visualiza de forma completa y legible, adaptada al tamano disponible de la pantalla sin recortes que oculten parte relevante.

---

### User Story 2 - Navegar entre las imagenes del producto dentro del visor (Priority: P2)

Como visitante con el visor abierto, quiero pasar a la imagen anterior o siguiente del mismo producto sin cerrar el visor, para revisar todas las fotos disponibles comodamente.

**Why this priority**: Mejora la experiencia cuando un producto tiene varias imagenes, pero no es indispensable si solo hay una; el flujo basico de abrir y cerrar ya entrega valor.

**Independent Test**: Abrir el detalle de un producto con varias imagenes, abrir el visor y verificar que se puede avanzar y retroceder entre las imagenes sin cerrarlo.

**Acceptance Scenarios**:

1. **Given** que un producto tiene varias imagenes, **When** el visitante abre el visor y usa los controles de siguiente/anterior, **Then** la imagen mostrada cambia sin cerrar el visor.
2. **Given** que el visitante esta en la primera imagen, **When** intenta ir a la anterior, **Then** el control lo refleja (deshabilitado o vuelve a la ultima) de forma predecible.
3. **Given** que un producto tiene una sola imagen, **When** se abre el visor, **Then** los controles de navegacion no se muestran o aparecen deshabilitados, sin confundir al usuario.

---

### Edge Cases

- Que ocurre cuando el producto no tiene ninguna imagen disponible.
- Que sucede si la imagen ampliada no carga (url rota o conexion inestable) mientras el visor esta abierto.
- Como se comporta el visor en pantallas pequenas (moviles) y con imagenes verticales altas u horizontales muy anchas.
- Que pasa si el visitante abre el visor y luego navega a otra pagina o usa el boton atras del navegador.
- Si el visitante abre el visor y la misma imagen ya esta seleccionada como principal en la galeria inferior.
- Comportamiento cuando el visitante hace click repetidamente o rapidamente en los controles de navegacion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST abrir un visor (modal/popup) al hacer click en la imagen principal del detalle de producto, mostrando la imagen en tamano ampliado. Unicamente la imagen principal abre el visor; las miniaturas de la galeria conservan su comportamiento existente (cambiar la imagen principal mostrada) y no abren el visor.
- **FR-002**: El visor MUST poder cerrarse mediante un boton de cerrar visible, al hacer click en el area exterior a la imagen y al presionar la tecla Escape.
- **FR-003**: La imagen mostrada en el visor MUST presentarse de forma completa y legible, adaptandose al espacio disponible de la pantalla sin recortes que oculten partes relevantes del producto.
- **FR-004**: El visor MUST usar la version de mayor calidad disponible de la imagen (la de mayor tamano) para que el detalle se aprecie correctamente al ampliar. El visor mostrara la imagen ajustada al tamano de pantalla (sin recortes relevantes) y NO incluira funcionalidad de zoom adicional ni desplazamiento (pan) dentro de la imagen.
- **FR-005**: Si el producto tiene varias imagenes, el visor MUST permitir avanzar y retroceder entre ellas sin cerrarse. En escritorio mediante botones siguiente/anterior; en dispositivos moviles MUST ademas soportar navegacion por gestos de deslizamiento (swipe horizontal) ademas de los botones.
- **FR-006**: Si el producto tiene una sola imagen, el visor MUST omitir o deshabilitar los controles de navegacion para no confundir al usuario.
- **FR-007**: El visor MUST conservar un indicador claro de la imagen que se esta viendo dentro del conjunto (por ejemplo, posicion actual).
- **FR-008**: El visor MUST indicar de forma accesible su proposito y permitir operarlo con teclado (abrir, navegar y cerrar).
- **FR-009**: El visor MUST bloquear el desplazamiento del fondo de la pagina mientras este abierto, para enfocar la atencion en la imagen.
- **FR-010**: Si el producto no tiene imagen, el sistema MUST no ofrecer la apertura del visor desde la imagen principal.

### Key Entities *(include if feature involves data)*

- **Visor de imagen (lightbox)**: Componente superpuesto que muestra la imagen del producto ampliada, con controles para cerrar y, si aplica, navegar entre imagenes.
- **Galeria del producto**: Conjunto ordenado de imagenes asociadas al producto, sobre el cual el visor navega cuando hay mas de una.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los productos con imagen permiten abrir el visor haciendo click en la imagen principal del detalle.
- **SC-002**: El visor se cierra correctamente con el boton cerrar, el click en el area exterior y la tecla Escape en el 100% de los casos probados.
- **SC-003**: Al menos el 95% de usuarios de prueba logran ver la imagen completa sin recortes relevantes en escritorio y en movil.
- **SC-004**: En productos con varias imagenes, el usuario puede revisar todas las imagenes disponibles sin cerrar el visor.
- **SC-005**: El visor se opera completamente con teclado (abrir, siguiente, anterior, cerrar) sin necesidad del mouse.

## Assumptions

- Esta funcionalidad aplica unicamente a la vista publica de detalle de producto, donde ya existe la imagen principal y la galeria inferior.
- Se aprovecha la imagen de mayor tamano ya disponible en el sistema (proveniente del trabajo de variantes del spec 023) para mostrar el maximo detalle en el visor.
- El visor es una capa de presentacion del frontend; no requiere cambios en el backend ni nuevos datos.
- El comportamiento estandar de los visores web (cerrar con Escape y con click fuera, bloquear el scroll del fondo) se asume como expectativa del usuario.
- La accesibilidad por teclado y el buen comportamiento en moviles se tratan como parte del alcance por defecto.
