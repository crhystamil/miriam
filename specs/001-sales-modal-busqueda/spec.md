# Feature Specification: Mejora de registro de ventas

**Feature Branch**: `[001-sales-modal-busqueda]`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "en la vista de ventas, la seccion de *nueva venta* podemos agregar un boton que tenga el nombre *Registrar Venta* y que este formulario se pueda desglosar o se tenga un modal para poder registrar una venta. en la seccion de nueva venta, la seleccion de producto al tener una lista de 200 productos no es amigable poder buscar entre todos los productos, podrias agregar un buscador en el select para hacer facil la busqueda del producto. y en la descripcion del producto, la imagen no debe ser grande podemos hacerlo mas pequeno solo es referencial la imagen. para asi tener"

## Clarifications

### Session 2026-05-11

- Q: ¿Cómo debe abrirse el flujo de `Registrar Venta`? → A: Debe abrirse en un modal centrado sobre la vista de Ventas.
- Q: ¿Cómo debe comportarse el borrador del formulario dentro del modal? → A: Debe mantenerse mientras el modal esté abierto y limpiarse al cerrar/cancelar o tras guardar exitosamente.
- Q: ¿Qué campos deben usarse para la búsqueda de producto en listas grandes? → A: Búsqueda por SKU y nombre con coincidencia parcial.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar venta desde accion principal (Priority: P1)

Como vendedor, quiero abrir el formulario de venta desde un boton claro llamado "Registrar Venta" para iniciar el registro sin distraerme con otros elementos de la pantalla.

**Why this priority**: Es el flujo principal del modulo; si no existe una entrada clara, el proceso de ventas se vuelve lento y confuso.

**Independent Test**: Puede probarse validando que un usuario ingrese a Ventas, pulse "Registrar Venta", complete campos obligatorios y guarde una venta exitosa.

**Acceptance Scenarios**:

1. **Given** que el usuario esta en la vista de Ventas, **When** pulsa el boton "Registrar Venta", **Then** se muestra el formulario de nueva venta en un panel desglosable o modal.
2. **Given** que el formulario esta abierto, **When** el usuario completa producto, cantidad y precio de venta y confirma, **Then** la venta se registra y el usuario recibe confirmacion.

---

### User Story 2 - Buscar producto rapidamente en listas grandes (Priority: P1)

Como vendedor, quiero buscar productos por texto dentro del selector para encontrar rapidamente el producto correcto aunque existan 200 o mas productos.

**Why this priority**: Con listas largas, el tiempo de registro aumenta y se incrementan errores de seleccion.

**Independent Test**: Puede probarse cargando una lista extensa, escribiendo texto en el buscador y verificando que los resultados filtrados permitan seleccionar el producto correcto.

**Acceptance Scenarios**:

1. **Given** una lista de productos extensa, **When** el usuario escribe nombre, SKU u otro identificador visible en el buscador, **Then** el listado de opciones se filtra en tiempo real.
2. **Given** un filtro aplicado, **When** el usuario limpia el texto de busqueda, **Then** se restablece el listado completo de productos disponibles.

---

### User Story 3 - Revisar resumen visual del producto antes de vender (Priority: P2)

Como vendedor, quiero ver un panel de descripcion con imagen referencial pequena y datos clave del producto para confirmar que estoy vendiendo el item correcto.

**Why this priority**: Reduce errores operativos al verificar informacion antes de confirmar la venta.

**Independent Test**: Puede probarse seleccionando distintos productos y verificando que cambien tanto datos descriptivos como imagen pequena referencial.

**Acceptance Scenarios**:

1. **Given** un producto seleccionado en el formulario, **When** se muestra el panel de descripcion, **Then** aparece una imagen pequena referencial y no dominante dentro del layout.
2. **Given** que el usuario cambia de producto, **When** la nueva seleccion queda activa, **Then** el panel actualiza datos e imagen del producto de forma inmediata.

---

### Edge Cases

- Que ocurre cuando la busqueda no encuentra coincidencias de productos (mensaje claro y sin bloquear el formulario).
- Como se comporta el formulario cuando el usuario cierra el modal/panel sin guardar (sin crear venta parcial).
- Que sucede si el producto seleccionado queda sin stock entre la seleccion y el envio (error claro y recuperable).
- Como se muestra el panel descriptivo cuando un producto no tiene descripcion completa (fallback legible).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La vista de Ventas MUST mostrar una accion principal visible llamada `Registrar Venta` para iniciar el flujo de nueva venta.
- **FR-002**: Al activar `Registrar Venta`, el sistema MUST abrir el formulario en un modal centrado sin perder el contexto de la pantalla.
- **FR-003**: El formulario de nueva venta MUST incluir como minimo: producto, precio mayorista referencial, cantidad, precio de venta y notas/descripcion operativa de la venta.
- **FR-004**: El sistema MUST permitir buscar productos por texto dentro del selector usando coincidencia parcial sobre SKU y nombre visibles.
- **FR-005**: El buscador de productos MUST soportar listas de al menos 200 productos manteniendo usabilidad fluida en interaccion normal.
- **FR-006**: Al seleccionar un producto, la interfaz MUST mostrar un panel de descripcion del producto en paralelo al formulario (2 columnas en escritorio, apilado en movil).
- **FR-007**: El panel de descripcion MUST incluir imagen referencial pequena del producto y datos clave (SKU, nombre, stock, precios y descripcion).
- **FR-008**: La imagen del panel descriptivo MUST ocupar un tamano reducido y no debe desplazar ni dominar visualmente el formulario.
- **FR-009**: El sistema MUST validar campos obligatorios antes de guardar y mostrar mensajes claros ante errores de validacion o negocio.
- **FR-010**: Tras registrar una venta correctamente, el sistema MUST confirmar el resultado, actualizar la lista de ventas y limpiar o reiniciar el formulario segun el patron de uso definido.
- **FR-011**: Mientras el modal permanezca abierto, el sistema MUST conservar el borrador del formulario para evitar perdida accidental de datos.
- **FR-012**: El sistema MUST limpiar el formulario al cerrar/cancelar el modal y al completar un registro exitoso.

### Key Entities *(include if feature involves data)*

- **Venta en captura**: Representa la transaccion en proceso de registro; contiene producto seleccionado, cantidad, precio de venta, precio mayorista referencial y notas.
- **Producto seleccionable**: Representa cada opcion del catalogo para venta; incluye identificadores visibles (SKU, nombre), stock, precios y descripcion.
- **Panel de vista previa del producto**: Representa el resumen informativo ligado al producto seleccionado, incluyendo imagen pequena referencial y atributos clave.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 95% de usuarios puede abrir el flujo de nueva venta desde `Registrar Venta` en menos de 5 segundos desde que entra a la vista de Ventas.
- **SC-002**: Con un catalogo de 200 productos, los usuarios encuentran y seleccionan el producto objetivo en menos de 15 segundos en al menos 90% de pruebas de uso.
- **SC-003**: Al menos 95% de ventas enviadas con datos validos se registran exitosamente en el primer intento sin reingreso de campos.
- **SC-004**: En validacion UX, al menos 90% de usuarios reporta que el panel de descripcion con imagen pequena ayuda a confirmar el producto correcto antes de guardar.

## Assumptions

- Se reutiliza el flujo actual de autenticacion y permisos del modulo de Ventas.
- La informacion de producto necesaria para el panel descriptivo ya esta disponible o puede derivarse del listado actual consumido por la vista.
- El formulario de registro seguira dentro de la misma pagina de Ventas (no se requiere nueva ruta independiente).
- El formulario se presentara como modal centrado y no como panel desplegable.
- El comportamiento esperado en desktop es dos columnas (formulario + descripcion) y en movil disposicion vertical.
- No se requiere persistencia del borrador entre aperturas separadas del modal.
