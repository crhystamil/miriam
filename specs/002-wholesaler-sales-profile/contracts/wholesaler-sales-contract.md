# Wholesaler Sales Contract

## Sales Form Contract
- Venta requiere seleccion de mayorista existente.
- Campo visible durante captura: solo nombre del mayorista.
- No existe alta inline de mayorista en el formulario de ventas.

## Wholesaler Identity Contract
- Duplicados se validan por `name + phone_normalized`.
- El telefono se almacena como dato informativo sin reglas de formato o longitud.

## Sales Listing / Reporting Contract
- Las vistas de ventas deben incluir referencia del mayorista asociado.
- Debe existir capacidad de filtrar ventas por mayorista para listar productos comprados.

## Error Contract
- Si no se selecciona mayorista valido, la venta no se registra y se muestra mensaje de validacion.
- Si se detecta inconsistencia de identificacion de mayorista, se retorna error de negocio claro.
