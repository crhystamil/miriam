# Feature Specification: Carga de multiples fotos por producto

**Feature Branch**: `[005-multi-product-photos]`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "podrias agregar la opcion de subir varias fotos para los productos."

## Clarifications

### Session 2026-05-11

- Q: ¿Cual debe ser el maximo de fotos permitidas por producto en una sola carga? → A: Maximo 5 fotos.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Subir varias fotos al crear producto (Priority: P1)

Como administrador, quiero subir varias fotos al crear un producto para registrar mejor sus caracteristicas visuales en el catalogo.

**Why this priority**: Es la necesidad principal del negocio para mejorar la identificacion del producto y reemplaza la restriccion actual de una sola imagen.

**Independent Test**: Abrir el modal de nuevo producto, seleccionar multiples archivos validos y guardar; el producto debe crearse con todas las fotos asociadas.

**Acceptance Scenarios**:

1. **Given** que el administrador abre el modal de nuevo producto, **When** selecciona varias fotos validas y guarda, **Then** el producto se crea con todas las fotos asociadas.
2. **Given** que el formulario requiere fotos, **When** el usuario intenta guardar sin archivos, **Then** el sistema bloquea el guardado y muestra un mensaje claro.

---

### User Story 2 - Validar lote de fotos cargadas (Priority: P1)

Como administrador, quiero que cada foto del lote se valide para evitar registros con archivos no permitidos o incorrectos.

**Why this priority**: Mantiene calidad del catalogo y evita datos inutiles o inconsistentes.

**Independent Test**: Cargar un lote con al menos un archivo invalido y verificar que el sistema rechaza la operacion con detalle de error.

**Acceptance Scenarios**:

1. **Given** que el usuario carga varias fotos y una no cumple reglas, **When** confirma el alta, **Then** el sistema rechaza el guardado y reporta el problema.

---

### User Story 3 - Visualizar galeria de fotos en gestion de productos (Priority: P2)

Como administrador, quiero visualizar las fotos asociadas de cada producto para confirmar que el catalogo tiene el material visual correcto.

**Why this priority**: Asegura control visual post-alta y reduce confusiones entre productos similares.

**Independent Test**: Crear producto con varias fotos y comprobar que la gestion de productos muestra su galeria asociada.

**Acceptance Scenarios**:

1. **Given** un producto con varias fotos guardadas, **When** el usuario revisa la gestion de productos, **Then** puede ver su conjunto de fotos asociadas.

---

### Edge Cases

- Que ocurre si el usuario intenta guardar producto sin fotos.
- Que sucede si el lote incluye fotos con formato no permitido.
- Que pasa si una foto del lote supera el tamano maximo permitido.
- Que ocurre cuando el usuario intenta cargar mas de 5 fotos en un solo lote.
- Como responde el sistema si falla la carga parcial de una foto durante el guardado.
- Que ocurre cuando se intenta subir fotos duplicadas en el mismo lote.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir seleccionar y subir varias fotos en el modal de nuevo producto.
- **FR-002**: El sistema MUST exigir al menos una foto cargada para crear el producto.
- **FR-009**: El sistema MUST permitir cargar entre 1 y 5 fotos por producto en una sola operacion de alta.
- **FR-003**: El sistema MUST mantener soporte de carga de archivos locales y no depender de URL manual.
- **FR-004**: El sistema MUST validar cada foto cargada contra politicas de formato y tamano permitidas.
- **FR-005**: El sistema MUST rechazar el alta cuando alguna foto del lote no cumpla validaciones.
- **FR-006**: El sistema MUST asociar todas las fotos validas del lote al producto creado en una sola operacion coherente.
- **FR-007**: El sistema MUST mostrar mensajes de error claros cuando falle la validacion o carga de cualquier foto.
- **FR-008**: El sistema MUST permitir visualizar las fotos asociadas en la gestion de productos.

### Key Entities *(include if feature involves data)*

- **Producto**: Articulo del catalogo que puede tener una o mas fotos asociadas.
- **Foto de producto**: Archivo de imagen individual asociado a un producto.
- **Lote de carga de fotos**: Conjunto de archivos subidos en una misma accion de alta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 95% de altas de producto con multiples fotos se completa exitosamente en el primer intento.
- **SC-002**: El 100% de productos creados por este flujo quedan con una o mas fotos asociadas.
- **SC-003**: El 100% de lotes con archivos invalidos son rechazados con mensaje claro.
- **SC-004**: En validacion funcional, el 95% de usuarios confirma visualmente todas las fotos esperadas tras el alta.

## Assumptions

- El cambio aplica al flujo de "Nuevo producto" de gestion interna.
- Los permisos actuales de administracion de catalogo se mantienen.
- La galeria de fotos se muestra dentro de las vistas existentes de gestion de productos.
- Las reglas de formato y tamano por archivo se mantienen consistentes con politicas operativas vigentes.
