# Feature Specification: Catalogo publico con productos reales

**Feature Branch**: `main`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "hacer que el catálogo público muestre los productos reales registrados en la base de datos, no la lista estática de ejemplo., con el objetivo de poder consumir /api/products/"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver catalogo real como invitado (Priority: P1)

Un visitante no autenticado entra al catalogo publico y ve productos reales registrados en el sistema, en lugar de productos de muestra. Puede explorar mas alla del primer grupo visible para descubrir el inventario publico disponible.

**Why this priority**: Es el valor central del cambio: convertir el catalogo publico en una vitrina real del negocio y evitar que los clientes vean datos ficticios o incompletos.

**Independent Test**: Se puede probar entrando al catalogo publico sin iniciar sesion y verificando que los productos mostrados coincidan con productos activos registrados por administracion.

**Acceptance Scenarios**:

1. **Given** que existen productos activos registrados, **When** un invitado visita el catalogo publico, **Then** ve una lista de productos reales con nombre, imagen principal disponible y descripcion comercial.
2. **Given** que existen mas productos activos que los visibles inicialmente, **When** el invitado solicita ver mas resultados, **Then** el catalogo muestra productos adicionales sin requerir autenticacion.
3. **Given** que no existen productos activos registrados, **When** un invitado visita el catalogo, **Then** ve un mensaje claro indicando que no hay productos disponibles temporalmente.

---

### User Story 2 - Buscar productos reales (Priority: P2)

Un visitante no autenticado busca un repuesto por texto y recibe resultados basados en los productos reales registrados, no sobre una lista estatica.

**Why this priority**: La busqueda ayuda a que clientes encuentren repuestos especificos rapidamente y reduce consultas manuales innecesarias.

**Independent Test**: Se puede probar registrando un producto activo con un nombre conocido, buscandolo desde el catalogo publico y verificando que aparezca en los resultados.

**Acceptance Scenarios**:

1. **Given** que existe un producto activo cuyo nombre coincide con la busqueda, **When** el invitado escribe ese termino, **Then** el producto aparece en los resultados.
2. **Given** que no existen productos activos que coincidan con la busqueda, **When** el invitado busca ese termino, **Then** ve un mensaje de "sin resultados" y puede limpiar la busqueda.
3. **Given** que el invitado cambia el termino de busqueda, **When** el nuevo termino se aplica, **Then** los resultados reflejan el nuevo criterio y no quedan mezclados con resultados anteriores.

---

### User Story 3 - Ver detalle de producto real (Priority: P3)

Un visitante no autenticado abre el detalle de un producto real desde el catalogo y ve informacion comercial actualizada, imagenes disponibles y una accion de contacto.

**Why this priority**: El detalle permite convertir interes en consulta directa y evita paginas de producto no encontradas para productos que si existen en el inventario.

**Independent Test**: Se puede probar abriendo el detalle de un producto activo desde el catalogo y verificando que los datos correspondan al producto registrado.

**Acceptance Scenarios**:

1. **Given** que el invitado selecciona un producto activo desde el catalogo, **When** abre su detalle, **Then** ve nombre, descripcion, imagen principal, galeria si existe y llamada a contacto.
2. **Given** que el producto solicitado no existe o no esta activo, **When** un invitado intenta abrir su detalle, **Then** ve un mensaje de producto no encontrado o una salida segura al catalogo.
3. **Given** que un producto tiene varias imagenes, **When** el invitado visualiza el detalle, **Then** puede distinguir la imagen principal y las imagenes adicionales disponibles.

---

### User Story 4 - Ver productos destacados reales en inicio (Priority: P4)

Un visitante no autenticado entra a la pagina principal y ve un bloque de productos destacados tomado de productos reales activos.

**Why this priority**: Mantiene coherencia entre la pagina principal y el catalogo, aunque no es indispensable para que el catalogo publico funcione.

**Independent Test**: Se puede probar entrando a la pagina principal y verificando que los productos destacados existan tambien en el catalogo real.

**Acceptance Scenarios**:

1. **Given** que existen productos activos registrados, **When** un invitado visita la pagina principal, **Then** ve hasta cuatro productos destacados reales.
2. **Given** que no existen productos activos, **When** un invitado visita la pagina principal, **Then** el bloque de destacados no muestra productos ficticios.

### Edge Cases

- Si un producto activo no tiene imagen disponible, el catalogo debe mostrar una alternativa visual consistente sin romper la tarjeta ni el detalle.
- Si se pierde temporalmente el acceso a los datos de productos, el invitado debe ver un mensaje amigable y la pagina publica debe seguir navegable.
- Si un producto se desactiva mientras un invitado navega, no debe seguir apareciendo en nuevas cargas del catalogo ni mostrarse como detalle disponible.
- Si hay muchos productos activos, el catalogo debe permitir navegar progresivamente los resultados sin cargar una lista excesiva de una sola vez.
- Si la busqueda contiene espacios extra, mayusculas o minusculas mezcladas, el sistema debe aplicar una busqueda tolerante y consistente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The public catalog MUST display products from the registered product inventory rather than from a hardcoded sample list.
- **FR-002**: The public catalog MUST be accessible to unauthenticated visitors.
- **FR-003**: The public catalog MUST display only products that are available for public viewing.
- **FR-004**: Each public product card MUST show at minimum the product name and a primary visual representation or fallback visual.
- **FR-005**: Each public product card SHOULD show a short commercial description when available.
- **FR-006**: Visitors MUST be able to search public products by text.
- **FR-007**: Search results MUST be based on registered products and MUST not use static sample products.
- **FR-008**: The catalog MUST support browsing beyond the first visible group of products when more matching products exist.
- **FR-009**: Visitors MUST be able to open a detail view for a public product from the catalog.
- **FR-010**: The product detail view MUST show current registered product information, including name, description, main image or fallback, available gallery images, and contact action.
- **FR-011**: The product detail view MUST handle nonexistent or non-public products with a clear not-found state.
- **FR-012**: The public home page SHOULD use registered public products for featured product previews and MUST NOT show sample products as if they were real inventory.
- **FR-013**: The public catalog and detail views MUST avoid showing internal business-only product data such as cost values, wholesale reference values, or internal inventory-management-only fields.
- **FR-014**: The public catalog MUST provide clear empty states for no available products and no matching search results.
- **FR-015**: The public catalog MUST remain usable on desktop and mobile screen sizes.

### Key Entities *(include if feature involves data)*

- **Public Product**: A product available for public browsing. Key public attributes include identifier, name, description, public-facing image information, and contact intent.
- **Product Image**: A visual asset associated with a product. One image may be used as the main representation, and additional images may appear in detail.
- **Catalog Search**: A visitor-entered text query used to narrow visible public products.
- **Catalog Result Page**: A bounded set of product results shown at one time, with a way to continue browsing when more results exist.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of products shown in the public catalog correspond to registered products that are available for public viewing.
- **SC-002**: A guest user can find a known active product from the public catalog in under 30 seconds using browsing or search.
- **SC-003**: When at least 50 public products exist, a guest can access products beyond the first visible group without logging in.
- **SC-004**: 0 sample or placeholder products are presented as real inventory in the public catalog, product detail, or featured product section.
- **SC-005**: At least 95% of public product searches with an exact product-name term return the expected product in the visible results.
- **SC-006**: Product detail pages for public products load enough information for a contact decision in under 3 seconds under normal network conditions.
- **SC-007**: Internal-only product data is not visible to guests in the public catalog or public detail screens.

## Assumptions

- Only products marked as active or otherwise available for public viewing should appear to guests.
- Product prices are considered public only if the existing business process already treats them as customer-facing.
- Guests should not need an account to browse the catalog, search products, or view product details.
- Existing registered product records are the source of truth for public catalog content.
- The current static sample product list is not considered authoritative inventory and should not be displayed as real stock.
- Public catalog browsing should favor progressive loading or pagination rather than requiring all products to appear at once.
