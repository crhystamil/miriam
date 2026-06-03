# Feature Specification: Mejorar tabla de productos y SKU autogenerado

**Feature Branch**: `[009-products-table-sku]`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "la tabla de productos para administrador y vendedor, puede tener todos los detalles de un producto. y el sku puede ser autogenerado, que solo muestre 1 imagen del producto, y para administrador que mantenga las acciones"

## Clarifications

### Session 2026-05-12

- Q: ¿Que campos exactos debe mostrar la tabla de productos para admin y vendedor? → A: SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver tabla completa de productos (Priority: P1)

Como administrador o vendedor, quiero ver en la tabla de productos todos los detalles relevantes para consultar inventario y precios sin abrir vistas adicionales.

**Why this priority**: La tabla es la vista principal de consulta operativa y debe entregar contexto completo para decisiones rapidas.

**Independent Test**: Abrir la tabla de productos con perfil administrador y vendedor y verificar que cada fila muestra los detalles completos definidos para producto.

**Acceptance Scenarios**:

1. **Given** que existen productos registrados, **When** el usuario abre la tabla de productos, **Then** cada fila muestra los detalles completos del producto.
2. **Given** que el usuario pagina o filtra resultados, **When** se actualiza la tabla, **Then** se mantiene la misma estructura completa de datos por fila.

---

### User Story 2 - SKU autogenerado al crear producto (Priority: P1)

Como administrador, quiero que el SKU se genere automaticamente al crear un producto para evitar errores manuales y mantener identificadores consistentes.

**Why this priority**: El SKU es clave para trazabilidad de catalogo y su generacion automatica reduce inconsistencias humanas.

**Independent Test**: Crear un producto nuevo sin ingresar SKU manual y verificar que el producto se guarda con SKU unico generado por el sistema.

**Acceptance Scenarios**:

1. **Given** que el administrador inicia alta de producto, **When** completa los datos requeridos y guarda, **Then** el sistema genera un SKU unico automaticamente.
2. **Given** que se crean multiples productos consecutivos, **When** se revisa la tabla, **Then** todos los SKUs autogenerados son unicos y visibles.

---

### User Story 3 - Imagen unica en tabla y acciones de admin (Priority: P2)

Como usuario del modulo de productos, quiero ver solo una imagen representativa por producto en la tabla y, como administrador, mantener las acciones de gestion existentes.

**Why this priority**: Mejora legibilidad de la tabla y conserva capacidad operativa del perfil administrador.

**Independent Test**: Verificar que cada fila muestra una sola imagen representativa y que el administrador conserva acciones de gestion mientras vendedor solo consulta.

**Acceptance Scenarios**:

1. **Given** un producto con multiples imagenes, **When** se renderiza la tabla, **Then** se muestra solo una imagen representativa por fila.
2. **Given** que el usuario es administrador, **When** visualiza la tabla, **Then** mantiene disponibles las acciones de gestion de producto ya definidas.
3. **Given** que el usuario es vendedor, **When** visualiza la tabla, **Then** no ve acciones administrativas y solo consulta los detalles.

---

### Edge Cases

- Que ocurre si un producto no tiene imagen disponible al listar.
- Que ocurre si falla temporalmente la carga de la imagen representativa.
- Que ocurre si el generador de SKU detecta colision con un SKU existente.
- Que ocurre si la tabla no tiene productos para mostrar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en la tabla de productos todos los detalles definidos para consulta operativa de administrador y vendedor.
- **FR-009**: El sistema MUST mostrar en la tabla de productos los campos: SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa.
- **FR-002**: El sistema MUST generar automaticamente el SKU al crear un producto nuevo.
- **FR-003**: El sistema MUST garantizar que cada SKU autogenerado sea unico.
- **FR-004**: El sistema MUST hacer visible el SKU autogenerado en la tabla de productos.
- **FR-005**: El sistema MUST mostrar solo una imagen representativa por producto en la tabla.
- **FR-006**: El sistema MUST manejar ausencia o error de imagen con un estado visual claro sin romper la tabla.
- **FR-007**: El sistema MUST mantener para administrador las acciones de gestion de producto existentes.
- **FR-008**: El sistema MUST ocultar acciones administrativas para vendedor, manteniendo acceso de consulta.

### Key Entities *(include if feature involves data)*

- **Producto en tabla**: Registro de producto mostrado con detalles de inventario/precios y SKU visible.
- **SKU autogenerado**: Identificador unico asignado por el sistema al crear producto.
- **Imagen representativa de producto**: Unica imagen mostrada por fila para identificar visualmente el producto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En validacion funcional, el 100% de filas de productos muestran los detalles requeridos para admin y vendedor.
- **SC-002**: En pruebas de alta, el 100% de productos nuevos obtiene SKU autogenerado unico.
- **SC-003**: En validacion visual, el 100% de productos en tabla muestra una sola imagen representativa o fallback claro.
- **SC-004**: En pruebas de permisos, el 100% de acciones administrativas permanece visible para admin y oculta para vendedor.

## Assumptions

- El modulo de productos ya cuenta con autenticacion por roles administrador y vendedor.
- Las acciones administrativas actuales de producto ya existen y deben conservarse para perfil administrador.
- Los detalles completos de producto corresponden a los campos operativos vigentes del catalogo.
- La imagen representativa puede provenir de las imagenes ya asociadas al producto.
