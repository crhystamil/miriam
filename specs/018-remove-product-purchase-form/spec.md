# Feature Specification: Quitar compra desde productos

**Feature Branch**: `main`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "del panel de administracion en la seccion de productos se tiene el formulario de registrar compra, quitemos eso, ya se tiene un area para compras no se necesita otro."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrar productos sin formulario de compra duplicado (Priority: P1)

Un administrador entra a la seccion de productos para consultar, crear, editar o desactivar productos y ya no ve el formulario de registrar compra en esa pantalla.

**Why this priority**: El formulario duplicado confunde el flujo operativo y puede llevar a registrar compras desde un lugar incorrecto cuando ya existe una seccion dedicada para compras.

**Independent Test**: Se puede probar entrando al panel administrativo de productos y verificando que no exista ningun formulario, selector, boton o accion para registrar compras desde esa seccion, mientras las acciones propias de productos siguen disponibles.

**Acceptance Scenarios**:

1. **Given** que un administrador esta autenticado, **When** abre la seccion de productos, **Then** no ve el formulario de registrar compra en esa pantalla.
2. **Given** que un administrador esta en productos, **When** revisa las acciones disponibles, **Then** solo encuentra acciones relacionadas con productos, como crear, editar, buscar, filtrar o desactivar productos.
3. **Given** que el formulario de compra fue retirado de productos, **When** el administrador necesita registrar una compra, **Then** debe usar la seccion dedicada de compras.

---

### User Story 2 - Registrar compras solo desde el area de compras (Priority: P2)

Un administrador usa la seccion de compras como unico lugar para registrar nuevas compras, evitando caminos duplicados para la misma operacion.

**Why this priority**: Centralizar compras reduce errores, simplifica capacitacion y mantiene el registro de inventario en un flujo claro.

**Independent Test**: Se puede probar que la seccion de compras conserva la posibilidad de registrar compras despues de retirar el formulario duplicado en productos.

**Acceptance Scenarios**:

1. **Given** que un administrador necesita registrar una compra, **When** abre la seccion de compras, **Then** puede registrar la compra desde esa area.
2. **Given** que el administrador ya no puede registrar compras desde productos, **When** completa una compra desde compras, **Then** el sistema mantiene el comportamiento esperado de actualizacion de compras e inventario.

### Edge Cases

- Si un usuario tenia abierta la pantalla de productos antes del cambio, al recargar ya no debe aparecer el formulario de compra duplicado.
- Si existen mensajes, estados o errores ligados exclusivamente al formulario de compra en productos, no deben mostrarse despues de retirar ese formulario.
- Si la pantalla de productos queda con espacios vacios o textos que mencionan registro de compras, deben retirarse o ajustarse para evitar confusion.
- Si la seccion de compras no esta disponible para un rol determinado, retirar el formulario de productos no debe ampliar permisos ni crear accesos alternativos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The products administration section MUST NOT display a purchase registration form.
- **FR-002**: The products administration section MUST NOT provide a direct purchase registration action, button, selector, or submit flow.
- **FR-003**: Removing the purchase form from products MUST NOT remove or degrade product management capabilities such as product listing, searching, filtering, creation, editing, image management, or deactivation.
- **FR-004**: Purchase registration MUST remain available from the dedicated purchases section for authorized users.
- **FR-005**: Any validation messages, success messages, loading states, or form fields that only supported purchase registration inside products MUST be removed from the products section.
- **FR-006**: Navigation and labels in the products section MUST avoid implying that purchases can be registered from that section.
- **FR-007**: Existing purchase records and product inventory data MUST remain unchanged by this UI removal.

### Key Entities *(include if feature involves data)*

- **Product Administration Section**: The administrative area used to manage product records and product images.
- **Purchase Registration Flow**: The business operation for recording a product purchase; after this change, it belongs only to the dedicated purchases section.
- **Purchase Section**: The administrative area responsible for registering and viewing purchases.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of purchase-registration controls are absent from the products administration section.
- **SC-002**: An administrator can still complete core product management tasks from the products section after the removal.
- **SC-003**: An administrator can still register a purchase from the dedicated purchases section after the removal.
- **SC-004**: No existing product or purchase data is modified solely by viewing or using the updated products section.
- **SC-005**: During validation, users can identify the correct purchase registration location within 10 seconds by using the dedicated purchases section.

## Assumptions

- The dedicated purchases section already exists and remains the intended place for registering purchases.
- This change removes only the duplicate purchase registration UI from products; it does not remove purchase functionality from the application.
- Existing roles and permissions for products and purchases remain unchanged.
- Product creation and editing remain separate from purchase registration.
