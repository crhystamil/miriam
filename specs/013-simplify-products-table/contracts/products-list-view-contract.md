# Products List View Contract - Simplification

## Products Table Contract
- La tabla de productos no muestra columnas `SKU` ni `Descripcion`.
- Se mantienen las columnas operativas restantes del listado.
- Las acciones por fila continúan disponibles según permisos existentes.

## Filters Panel Contract
- El control `solo stock bajo` no se renderiza en la seccion de filtros.
- Los demás filtros mantienen comportamiento funcional previo.

## Legacy Parameter Compatibility Contract
- Si el estado inicial o la URL contiene `low_stock_only`, el sistema lo ignora.
- El listado de productos carga normalmente sin error ni bloqueo.

## Scope Boundary Contract
- No se modifica el esquema de datos de productos.
- No se elimina `sku` ni `description` del dominio backend.
