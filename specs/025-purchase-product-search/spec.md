# Feature Specification: Purchase Product Search

**Feature Branch**: `025-purchase-product-search`
**Created**: 2026-06-08
**Status**: Draft
**Input**: User description: "En la sección de compras cuando le hacemos click en el botón de nueva compra y muestra el modal, este da una lista de productos, pero no se listan todos solo se listan 10, debería tener la opción de buscar un producto para registrar la compra si es que no se encuentra el producto en la lista inicial."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search product when creating a purchase (Priority: P1)

Un usuario administrador abre el modal de nueva compra y necesita registrar la compra de un producto que no aparece en la lista inicial de 10 productos. Utiliza el campo de búsqueda para encontrar el producto deseado por nombre o SKU, lo selecciona, y completa el registro de compra.

**Why this priority**: This is the core problem — users cannot register purchases for products beyond the initial 10 shown. Without search, the purchase registration workflow is broken for any product not in the first page of results.

**Independent Test**: Can be fully tested by opening the new purchase modal, typing a product name or SKU in the search field, verifying the results update dynamically, selecting a product, and completing a purchase registration.

**Acceptance Scenarios**:

1. **Given** el modal de nueva compra está abierto con la lista inicial de 10 productos cargada, **When** el usuario escribe un término de búsqueda en el campo de búsqueda, **Then** la lista de productos se actualiza mostrando solo los productos que coinciden con el término (nombre o SKU) obtenidos del servidor
2. **Given** el usuario ha escrito un término de búsqueda válido, **When** los resultados se cargan desde el servidor, **Then** el usuario puede seleccionar un producto de los resultados filtrados y el formulario se llena con los datos del producto seleccionado
3. **Given** el usuario ha escrito un término de búsqueda que no coincide con ningún producto, **When** el servidor devuelve resultados vacíos, **Then** se muestra un mensaje indicando que no se encontraron productos
4. **Given** el modal de nueva compra está abierto, **When** el campo de búsqueda está vacío, **Then** se muestra la lista inicial de productos (primeros 10)

---

### User Story 2 - Clear search and return to initial list (Priority: P2)

El usuario ha realizado una búsqueda, vio los resultados, pero decide que quiere ver la lista inicial nuevamente. Borra el campo de búsqueda y la lista vuelve a mostrar los productos iniciales.

**Why this priority**: Complementary flow — users need a way to return to the default state after searching. Without this, the search field could trap users in a filtered view.

**Independent Test**: Can be tested by performing a search, then clearing the search field and verifying the initial product list reappears.

**Acceptance Scenarios**:

1. **Given** el usuario ha buscado un producto y ve resultados filtrados, **When** el usuario borra todo el texto del campo de búsqueda, **Then** la lista de productos vuelve a mostrar los primeros 10 productos iniciales
2. **Given** el usuario ha seleccionado un producto de los resultados de búsqueda, **When** el usuario borra el campo de búsqueda, **Then** el producto seleccionado se mantiene seleccionado y la lista vuelve a la vista inicial

---

### Edge Cases

- What happens when the user types very quickly (debounce)? The search should wait a brief moment after the user stops typing before sending the request to avoid overwhelming the server.
- What happens when there is a network error during search? An error message should be shown to the user and the initial list should remain visible.
- What happens when the search term is only 1 character? The search should still work but could be deferred until at least 2 characters are typed to avoid excessive requests.
- What happens if a product was previously selected and the user searches again? The selection should be preserved unless the user explicitly changes it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El modal de nueva compra MUST mostrar un campo de búsqueda de texto para filtrar productos
- **FR-002**: La búsqueda MUST realizar una consulta al servidor usando el término ingresado, filtrando por nombre y SKU del producto
- **FR-003**: La búsqueda MUST ejecutarse automáticamente después de que el usuario deje de escribir (con un debounce de al menos 300ms) sin necesidad de presionar un botón
- **FR-004**: Cuando el campo de búsqueda esté vacío, la lista MUST mostrar los primeros 10 productos (comportamiento actual)
- **FR-005**: Cuando la búsqueda no devuelva resultados, el sistema MUST mostrar un mensaje claro indicando que no se encontraron productos
- **FR-006**: El usuario MUST poder seleccionar un producto de los resultados de búsqueda para registrar la compra
- **FR-007**: Si el usuario ya tenía un producto seleccionado y realiza una nueva búsqueda, la selección previa MUST mantenerse a menos que el usuario seleccione un producto diferente
- **FR-008**: Durante la carga de resultados de búsqueda, el sistema MUST mostrar un indicador visual de carga

### Key Entities

- **Producto**: Entidad existente con atributos `id`, `name`, `sku`, `price`, `stock`. La búsqueda filtra por `name` y `sku`.
- **Compra (Purchase)**: Registro de compra que se asocia a un producto seleccionado del modal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede encontrar y seleccionar cualquier producto activo del catálogo desde el modal de compra, independientemente de su posición en la lista paginada
- **SC-002**: Los resultados de búsqueda se muestran en menos de 2 segundos después de que el usuario deja de escribir
- **SC-003**: El usuario puede completar el registro de una compra con un producto buscado en el mismo tiempo o menos que antes (sin incremento perceptible en el tiempo de la tarea)
- **SC-004**: El 100% de los productos activos son accesibles desde el modal de compra mediante búsqueda

## Assumptions

- El endpoint de búsqueda de productos ya existe en el backend (`GET /api/products/?search=<query>`) y filtra por nombre y SKU — no se requiere trabajo en el backend
- El tipo `ProductFilters` en el frontend ya incluye el parámetro `search` — solo falta utilizarlo en el modal de compras
- La paginación del servidor es de 10 productos por página (`PAGE_SIZE = 10`) y no se modificará
- Solo se buscan productos activos (`is_active = true`), que ya es el filtro por defecto del endpoint
- Se utilizará un patrón de búsqueda en tiempo real con debounce, consistente con otras páginas del sistema (Catálogo, Products admin)
- Se asume que no se requiere paginación infinita dentro del modal — los resultados de búsqueda (típicamente pocos) son suficientes para el caso de uso
