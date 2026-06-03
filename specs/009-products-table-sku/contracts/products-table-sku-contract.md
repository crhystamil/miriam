# Products Table and SKU Contract

## Products Table Data Contract
- La tabla de productos para admin y vendedor expone por fila: SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa.
- La estructura de columnas se mantiene consistente al paginar o filtrar.

## SKU Autogeneration Contract
- Al crear producto, el sistema genera SKU automaticamente sin requerir ingreso manual en flujo estandar.
- Cada SKU generado debe ser unico dentro del catalogo.
- El SKU generado debe quedar visible en la tabla de productos.

## Representative Image Contract
- Cada fila de producto muestra solo una imagen representativa.
- La imagen representativa corresponde a la primera imagen disponible segun orden operativo definido.
- Si no hay imagen o la carga falla, se muestra fallback visual claro sin romper la tabla.

## Role-based Actions Contract
- Las acciones de gestion de producto existentes permanecen disponibles para administrador.
- El rol vendedor no visualiza ni ejecuta acciones administrativas y mantiene acceso de consulta.

## Failure Handling Contract
- Fallos temporales de carga de imagen no deben bloquear render general de tabla.
- Si ocurre colision en generacion de SKU, el sistema debe evitar persistir duplicados y responder con estado consistente.
