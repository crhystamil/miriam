# Feature Specification: Corregir imagenes en registrar venta

**Feature Branch**: `[006-fix-sales-images]`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "el modal en registrar venta, no carga las imagenes que tiene cada producto, carga imagenes estaticas."

## Clarifications

### Session 2026-05-11

- Q: Cuando un producto tiene varias fotos, ¿cual se muestra en el modal de registrar venta? → A: Mostrar siempre la primera foto del producto (ordenada por posicion).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mostrar imagen real del producto (Priority: P1)

Como vendedor, quiero ver en el modal de registrar venta la imagen real del producto seleccionado para confirmar visualmente que estoy vendiendo el articulo correcto.

**Why this priority**: Evita errores de seleccion durante la venta y resuelve el problema principal reportado por el usuario.

**Independent Test**: Abrir el modal de registrar venta, elegir un producto con fotos cargadas y confirmar que la imagen mostrada coincide con las fotos guardadas del producto.

**Acceptance Scenarios**:

1. **Given** que un producto tiene fotos asociadas en el catalogo, **When** el usuario lo selecciona en registrar venta, **Then** el modal muestra una foto real de ese producto y no una imagen estatica de referencia.
2. **Given** que el usuario cambia de producto dentro del modal, **When** se actualiza la seleccion, **Then** la imagen mostrada cambia a la del nuevo producto seleccionado.

---

### User Story 2 - Fallback claro cuando no hay fotos (Priority: P2)

Como vendedor, quiero un estado visual claro cuando un producto no tenga fotos para no confundir ese caso con un error del sistema.

**Why this priority**: Reduce ambiguedad operativa y mantiene una experiencia consistente aun con datos incompletos.

**Independent Test**: Seleccionar un producto sin fotos y verificar que el modal muestra un placeholder/mensaje explicito en lugar de imagen estatica incorrecta.

**Acceptance Scenarios**:

1. **Given** que un producto no tiene fotos asociadas, **When** el usuario lo selecciona en registrar venta, **Then** el modal muestra un estado fallback claro (placeholder o mensaje) indicando ausencia de fotos.

---

### User Story 3 - Consistencia visual durante todo el flujo de venta (Priority: P3)

Como administrador del catalogo, quiero que el modal de registrar venta respete siempre el contenido visual actual de cada producto para mantener coherencia entre gestion de productos y proceso de venta.

**Why this priority**: Asegura trazabilidad visual entre modulos y evita discrepancias entre lo que se administra y lo que se vende.

**Independent Test**: Actualizar fotos de un producto en gestion, luego abrir registrar venta y comprobar que el modal refleja la version vigente sin contenido estatico obsoleto.

**Acceptance Scenarios**:

1. **Given** que se actualizaron fotos de un producto en catalogo, **When** el usuario abre registrar venta y selecciona ese producto, **Then** el modal muestra las fotos vigentes del producto.

---

### Edge Cases

- Que ocurre cuando un producto tiene multiples fotos: se debe mostrar siempre la primera foto segun orden de posicion.
- Que ocurre si la foto del producto no se puede cargar por error temporal: el modal debe mostrar fallback claro sin bloquear el resto del formulario.
- Que ocurre si el usuario navega rapidamente entre productos: la imagen visible debe corresponder siempre a la seleccion actual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en registrar venta una imagen proveniente de las fotos asociadas al producto seleccionado.
- **FR-002**: El sistema MUST dejar de usar imagenes estaticas de referencia para representar productos en el modal de registrar venta.
- **FR-003**: El sistema MUST actualizar la imagen visible cada vez que cambie el producto seleccionado en el modal.
- **FR-004**: El sistema MUST manejar productos sin fotos con un estado fallback claro y no ambiguo.
- **FR-005**: El sistema MUST mantener coherencia visual entre las fotos visibles en gestion de productos y las mostradas en registrar venta.
- **FR-006**: El sistema MUST continuar permitiendo registrar la venta aun cuando la imagen no pueda cargarse temporalmente.
- **FR-007**: El sistema MUST mostrar como imagen representativa la primera foto del producto segun el orden de posicion.

### Key Entities *(include if feature involves data)*

- **Producto de venta**: Producto seleccionable en el modal de registrar venta, identificado por SKU/nombre y con relacion a fotos del catalogo.
- **Foto de producto**: Recurso visual asociado al producto, usado para representacion en flujos de gestion y venta.
- **Vista de registro de venta**: Interfaz donde el usuario elige producto y confirma la venta, incluyendo la imagen contextual del producto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En validacion funcional, el 100% de productos con fotos muestran imagen real del catalogo en el modal de registrar venta.
- **SC-002**: En validacion funcional, el 100% de cambios de producto en el modal actualizan la imagen al producto correcto en menos de 1 segundo percibido.
- **SC-003**: En pruebas de negocio, el 95% de usuarios confirma que la imagen ayuda a identificar el producto correcto en el primer intento.
- **SC-004**: En validacion de casos sin fotos o con fallo de carga, el 100% de los casos muestra fallback claro sin impedir completar la venta.

## Assumptions

- El modal de registrar venta ya consume una lista de productos activos.
- Cada producto puede tener cero o mas fotos disponibles en catalogo al momento de vender.
- Cuando hay multiples fotos, basta con mostrar una representativa para confirmar identidad visual en este alcance.
- No se modifica el flujo de calculo de precios, stock ni reglas de autorizacion de venta; el alcance es visual/consistencia de datos de imagen.
