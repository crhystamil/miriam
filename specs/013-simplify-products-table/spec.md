# Feature Specification: Simplificar tabla y filtros de productos

**Feature Branch**: `[013-simplify-products-table]`  
**Created**: 2026-05-13  
**Status**: Draft  
**Input**: User description: "en la tabla de productos, quitar el sku y la descripcion. en la seccion de filtros, quitar el checkbox de solo stock bajo."

## Clarifications

### Session 2026-05-13

- Q: Que hacer si llega `low_stock_only` en URL o estado previo? → A: Ignorarlo y cargar listado normal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Limpiar columnas visibles en productos (Priority: P1)

Como administrador o vendedor, quiero ver una tabla de productos mas simple sin columnas de SKU y descripcion para enfocarme en los datos operativos mas utiles.

**Why this priority**: La tabla de productos se usa de forma frecuente y reducir ruido visual mejora lectura y velocidad de consulta.

**Independent Test**: Abrir la pagina de productos y verificar que las columnas SKU y descripcion ya no aparecen en el encabezado ni en las filas.

**Acceptance Scenarios**:

1. **Given** que el usuario abre la tabla de productos, **When** la tabla se renderiza, **Then** no se muestran las columnas SKU ni descripcion.
2. **Given** que existen productos con SKU y descripcion cargados, **When** se visualiza el listado, **Then** esos campos no se presentan en la tabla.

---

### User Story 2 - Simplificar filtros de productos (Priority: P1)

Como administrador o vendedor, quiero que la seccion de filtros no muestre el checkbox "solo stock bajo" para mantener el formulario de filtrado mas simple.

**Why this priority**: El pedido es una simplificacion explicita del flujo y evita controles no deseados en la interfaz.

**Independent Test**: Entrar a la seccion de filtros de productos y confirmar que el checkbox "solo stock bajo" no existe.

**Acceptance Scenarios**:

1. **Given** que el usuario abre la pagina de productos, **When** revisa la seccion de filtros, **Then** no aparece el checkbox "solo stock bajo".
2. **Given** que el usuario aplica otros filtros disponibles, **When** ejecuta la busqueda, **Then** el flujo sigue funcionando sin dependencia del checkbox removido.

---

### Edge Cases

- Que ocurre si el usuario tenia una URL o estado previo con "solo stock bajo" activo.
- Que ocurre si no hay productos para mostrar despues de aplicar filtros restantes.
- Que ocurre si el usuario limpia y vuelve a aplicar filtros multiples tras remover el checkbox.
- Si llega `low_stock_only` desde URL/estado legado, el sistema lo ignora y mantiene carga normal del listado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST ocultar la columna SKU en la tabla de productos.
- **FR-002**: El sistema MUST ocultar la columna descripcion en la tabla de productos.
- **FR-003**: El sistema MUST remover el checkbox "solo stock bajo" de la seccion de filtros de productos.
- **FR-004**: El sistema MUST permitir que los demas filtros de productos sigan operando sin degradacion funcional.
- **FR-005**: El sistema MUST mantener acceso al detalle operativo principal de cada producto en la tabla resultante.
- **FR-006**: El sistema MUST ignorar el filtro legado `low_stock_only` cuando llegue en URL o estado previo, sin bloquear la visualizacion del listado.

### Key Entities *(include if feature involves data)*

- **Tabla de productos**: Vista de listado con columnas visibles para consulta operativa.
- **Panel de filtros de productos**: Controles de filtrado disponibles para acotar el listado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En validacion visual, el 100% de vistas de la tabla de productos no muestran columnas SKU ni descripcion.
- **SC-002**: En validacion funcional, el 100% de interacciones con la seccion de filtros se completan sin mostrar el checkbox "solo stock bajo".
- **SC-003**: En pruebas de regresion de filtros existentes, al menos 95% de escenarios de filtrado actuales se mantienen sin errores.
- **SC-004**: En validacion de uso, la consulta de productos se realiza sin pasos adicionales respecto al flujo previo.

## Assumptions

- El cambio es solo de presentacion en tabla y controles de filtro, sin modificar datos almacenados de productos.
- El SKU y la descripcion pueden seguir existiendo en el sistema para otros usos fuera de esta tabla.
- No se solicita agregar nuevos filtros en reemplazo del checkbox removido.
- Los permisos de acceso a la pagina de productos se mantienen sin cambios.
