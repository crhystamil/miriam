# Feature Specification: Perfil de mayorista en ventas

**Feature Branch**: `[002-wholesaler-sales-profile]`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "el sistema se tiene un perfil de *mayorista* los datos del mayorista es el nombre y telefono, en nuestro formulario de ventas debemos tener este dato para saber que productos compro un mayorista."

## Clarifications

### Session 2026-05-11

- Q: ¿Cómo se define la unicidad del perfil de mayorista? → A: Por nombre + teléfono normalizado.
- Q: ¿Se permite crear mayorista nuevo dentro del formulario de venta? → A: No, solo se permite seleccionar mayorista existente; el alta ocurre en módulo separado.
- Q: ¿Qué regla de validación aplica para teléfono de mayorista? → A: Formato flexible con mínimo 8 dígitos tras normalización.
- Q: En la vista de ventas, ¿qué dato del mayorista debe mostrarse en la captura? → A: Solo nombre.
- Q: ¿Dónde debe validarse el teléfono del mayorista? → A: No se valida en ningún flujo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Asociar venta a mayorista (Priority: P1)

Como vendedor, quiero asociar un mayorista existente en el formulario de ventas y visualizar su nombre para identificar con precision que productos compro cada mayorista.

**Why this priority**: Es clave para trazabilidad comercial y seguimiento de clientes mayoristas dentro del flujo principal de ventas.

**Independent Test**: Desde el formulario de ventas, crear una venta con datos de mayorista y verificar que la venta queda asociada al mayorista correcto en el historial.

**Acceptance Scenarios**:

1. **Given** que el usuario abre el formulario de ventas, **When** selecciona un mayorista existente por nombre junto con los datos de venta, **Then** la venta se guarda vinculada al mayorista.
2. **Given** una venta registrada con mayorista, **When** se consulta el listado/detalle de ventas, **Then** se visualiza la informacion del mayorista asociado.

---

### User Story 2 - Reutilizar perfil de mayorista existente (Priority: P2)

Como vendedor, quiero poder seleccionar un mayorista existente para no reescribir sus datos en cada compra.

**Why this priority**: Reduce tiempo de captura y evita inconsistencias de nombres/telefonos repetidos.

**Independent Test**: Registrar una venta con un mayorista existente y confirmar que no se duplica el perfil cuando ya existe coincidencia valida.

**Acceptance Scenarios**:

1. **Given** que existe un perfil de mayorista, **When** el usuario lo selecciona en el formulario de ventas, **Then** la venta se asocia a ese perfil sin crear un duplicado.

---

### User Story 3 - Consultar compras por mayorista (Priority: P2)

Como administrador o vendedor, quiero consultar las ventas por mayorista para revisar que productos compro cada uno.

**Why this priority**: Facilita seguimiento comercial, reposicion y analisis de comportamiento de compra.

**Independent Test**: Filtrar o visualizar ventas de un mayorista especifico y comprobar que los productos mostrados corresponden a sus compras registradas.

**Acceptance Scenarios**:

1. **Given** que existen ventas de distintos mayoristas, **When** el usuario consulta por un mayorista especifico, **Then** solo se muestran sus ventas y productos asociados.

---

### Edge Cases

- Que ocurre cuando se intenta guardar una venta sin mayorista seleccionado.
- Como se manejan perfiles de mayorista con telefono vacio o con formatos heterogeneos heredados.
- Que sucede cuando existen mayoristas con nombres similares y telefono distinto.
- Como responde el sistema si se intenta registrar dos veces el mismo mayorista (mismo nombre y telefono normalizado).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST registrar en cada venta la referencia a un perfil de mayorista con nombre y telefono.
- **FR-002**: El formulario de ventas MUST permitir seleccionar un mayorista existente mostrando solo su nombre en la captura.
- **FR-003**: El sistema MUST permitir seleccionar un mayorista existente para asociarlo directamente a la venta.
- **FR-009**: El sistema MUST bloquear el registro de venta cuando no exista mayorista seleccionado y redirigir al flujo de alta en modulo separado.
- **FR-004**: El sistema MUST evitar duplicados de perfil de mayorista cuando coincidan nombre y telefono normalizado.
- **FR-008**: El sistema MUST permitir almacenar el telefono del mayorista sin aplicar validaciones de formato o longitud.
- **FR-005**: El sistema MUST mostrar informacion del mayorista asociado en las vistas de ventas relevantes.
- **FR-006**: El sistema MUST permitir consultar/filtrar ventas por mayorista para ver productos comprados.
- **FR-007**: El sistema MUST validar que exista mayorista seleccionado antes de guardar la venta.
- **FR-010**: El sistema MUST mantener disponible el telefono del mayorista como dato informativo del perfil, sin reglas de validacion de formato o longitud.
- **FR-011**: En la vista de ventas, la interfaz MUST mostrar solo el nombre del mayorista durante la captura; el telefono queda disponible fuera de la captura operativa.

### Key Entities *(include if feature involves data)*

- **Mayorista**: Representa un cliente mayorista identificado por nombre y telefono.
- **Venta**: Transaccion de producto que incluye vinculacion al mayorista que realiza la compra.
- **Consulta de ventas por mayorista**: Vista o filtro que relaciona mayorista con lista de ventas y productos comprados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de ventas nuevas registradas incluye un mayorista existente asociado.
- **SC-002**: El 95% de usuarios completa la captura de mayorista dentro del flujo de venta sin errores en el primer intento.
- **SC-003**: Las consultas por mayorista muestran resultados correctos en al menos 95% de validaciones de muestra.
- **SC-004**: La duplicacion involuntaria de mayoristas con mismo nombre+telefono se reduce a 0 casos en validaciones funcionales.

## Assumptions

- El modulo de ventas actual puede extenderse para almacenar y mostrar referencia a mayorista.
- El telefono del mayorista se maneja como dato de contacto primario y unico junto al nombre para evitar duplicados.
- La unicidad de mayorista se valida por combinacion de nombre + telefono normalizado.
- El control de acceso actual de ventas (admin/vendor) se mantiene sin nuevos roles.
- La consulta por mayorista se implementa dentro de vistas/reportes de ventas existentes, sin requerir un modulo separado.
- El alta de mayoristas ocurre fuera del formulario de ventas, en un flujo/modulo dedicado.
- El telefono de mayorista se almacena sin validacion de formato o longitud.
