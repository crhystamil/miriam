# Sales Product Image Contract

## Sales Modal Image Source Contract
- El modal de registrar venta obtiene la imagen desde las fotos asociadas al producto seleccionado.
- No se usan imagenes estaticas de referencia para el producto en este flujo.

## Representative Image Selection Contract
- Si el producto tiene fotos, la imagen mostrada es siempre la primera segun orden de `position`.
- Al cambiar producto seleccionado, la imagen se actualiza al producto actual.
- El modal no debe conservar la imagen del producto previo cuando cambia la seleccion.

## Fallback Contract
- Si el producto no tiene fotos, se muestra estado fallback claro (placeholder o mensaje).
- Si falla la carga de imagen, se muestra fallback claro sin bloquear el registro de venta.

## Consistency Contract
- La imagen mostrada en registrar venta debe corresponder al conjunto de fotos vigente del producto en catalogo.
