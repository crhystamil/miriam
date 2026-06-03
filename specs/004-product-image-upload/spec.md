# Feature Specification: Carga de imagen en nuevo producto

**Feature Branch**: `[004-product-image-upload]`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "en el menu de agregar un nuevo producto, debe permitir poder subir una imagen. no una url."

## Clarifications

### Session 2026-05-11

- Q: Para este flujo de "Nuevo producto", ¿cuantas imagenes debe permitir cada producto? → A: Exactamente 1 imagen obligatoria.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Subir imagen al crear producto (Priority: P1)

Como administrador, quiero subir un archivo de imagen al crear un producto para registrar el catalogo sin depender de enlaces externos.

**Why this priority**: Es un requisito directo de operacion y reemplaza el flujo actual basado en URL, que ya no es aceptado por negocio.

**Independent Test**: Abrir el modal de nuevo producto, adjuntar una imagen local valida y guardar; el producto debe crearse con su imagen asociada.

**Acceptance Scenarios**:

1. **Given** que el administrador abre el modal de nuevo producto, **When** selecciona un archivo de imagen valido y guarda, **Then** el producto se crea correctamente con la imagen asociada.
2. **Given** que el formulario requiere imagen, **When** el usuario intenta guardar sin archivo, **Then** el sistema bloquea el guardado y muestra un mensaje claro.

---

### User Story 2 - Validar archivo de imagen (Priority: P1)

Como administrador, quiero que el sistema valide el archivo cargado para evitar errores por formato no permitido o archivo invalido.

**Why this priority**: Previene registros defectuosos y asegura calidad minima de imagen en el catalogo.

**Independent Test**: Intentar cargar un archivo no permitido y verificar que el sistema rechaza el guardado con mensaje de validacion.

**Acceptance Scenarios**:

1. **Given** que el usuario selecciona un archivo no valido, **When** confirma el alta, **Then** el sistema rechaza la operacion y comunica el motivo.

---

### User Story 3 - Visualizar imagen cargada en gestion de productos (Priority: P2)

Como administrador, quiero ver la imagen cargada en la gestion de productos para confirmar que el archivo correcto quedo asociado.

**Why this priority**: Facilita control visual del catalogo despues del alta.

**Independent Test**: Crear un producto con imagen y verificar que la gestion de productos permite visualizarla sin usar URL manual.

**Acceptance Scenarios**:

1. **Given** un producto creado con imagen, **When** el usuario consulta la gestion de productos, **Then** puede visualizar la imagen asociada correctamente.

---

### Edge Cases

- Que ocurre si el usuario intenta guardar un producto sin seleccionar archivo de imagen.
- Que pasa si el archivo excede el limite permitido.
- Que sucede si el archivo no corresponde a un formato de imagen permitido.
- Como responde el sistema si falla la carga del archivo durante el guardado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir seleccionar y subir un archivo de imagen desde el modal de nuevo producto.
- **FR-002**: El sistema MUST reemplazar la captura por URL de imagen por carga de archivo en el flujo de nuevo producto.
- **FR-003**: El sistema MUST exigir exactamente una imagen cargada antes de crear el producto.
- **FR-004**: El sistema MUST validar que el archivo cumpla politicas de formato y tamano permitidas.
- **FR-005**: El sistema MUST mostrar errores claros cuando la carga o validacion de imagen falle.
- **FR-006**: El sistema MUST asociar la imagen subida al producto creado.
- **FR-007**: El sistema MUST permitir visualizar la imagen asociada en la gestion de productos tras el alta.

### Key Entities *(include if feature involves data)*

- **Producto**: Articulo del catalogo que requiere exactamente una imagen al momento de alta.
- **Imagen de producto**: Archivo cargado por el usuario y asociado a un producto.
- **Carga de imagen**: Accion de seleccionar, validar y persistir archivo en el flujo de nuevo producto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 95% de altas de producto con imagen se completa exitosamente en el primer intento.
- **SC-002**: El 100% de productos nuevos creados por este flujo quedan con exactamente una imagen asociada.
- **SC-003**: El 100% de intentos de crear producto con archivo no valido son rechazados con mensaje claro.
- **SC-004**: En validacion funcional, el 95% de usuarios confirma visualmente la imagen correcta despues del alta.

## Assumptions

- El cambio aplica al flujo de "Nuevo producto" en gestion interna de catalogo.
- El acceso al flujo se mantiene restringido a usuarios administrativos actuales.
- La visualizacion de imagen asociada reutiliza vistas de gestion de productos ya existentes.
- Las politicas exactas de formato y tamano se definen segun estandar operativo vigente del proyecto.
- En esta iteracion, cada producto nuevo registra una sola imagen obligatoria.
