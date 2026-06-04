# Data Model: Quitar compra desde productos

## Product Administration Section

**Purpose**: Pantalla administrativa para gestionar productos.

**Relevant UI Capabilities**:

- Listar productos.
- Buscar y filtrar productos.
- Crear productos.
- Editar productos.
- Gestionar imagenes de producto.
- Desactivar productos.

**Validation Rules**:

- No debe mostrar controles de registro de compra.
- No debe mantener estados visibles, mensajes o acciones exclusivas de registrar compras.
- Debe conservar todas las acciones propias de productos.

## Purchase Registration Flow

**Purpose**: Operacion para registrar reposicion de inventario mediante una compra.

**Fields**:

- Producto.
- Cantidad.
- Costo unitario.
- Descripcion/notas cuando aplique.

**State Transition**:

- Antes: accesible desde productos y desde compras.
- Despues: accesible solo desde la seccion de compras.

## Purchase Section

**Purpose**: Pantalla administrativa dedicada al registro y consulta de compras.

**Relevant UI Capabilities**:

- Abrir formulario de nueva compra.
- Seleccionar producto.
- Registrar cantidad y costo unitario.
- Agregar descripcion.
- Ver tabla/listado de compras.

**Validation Rules**:

- Debe seguir permitiendo registrar compras a usuarios autorizados.
- Debe seguir actualizando el comportamiento esperado de compras/inventario.
