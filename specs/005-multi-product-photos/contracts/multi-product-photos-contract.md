# Multi Product Photos Contract

## New Product Modal Contract
- El modal de "Nuevo producto" permite seleccionar multiples archivos de imagen.
- El formulario exige entre 1 y 5 fotos para habilitar guardado.
- No se utiliza ingreso manual por URL para fotos.

## Batch Validation Contract
- Cada archivo del lote se valida por tipo y tamano permitidos.
- Si al menos un archivo falla, el sistema rechaza la operacion completa.
- Los errores deben identificar claramente la causa para correccion del usuario.

## Product Creation Contract
- El alta persiste producto y todas sus fotos en una operacion coherente.
- No debe existir persistencia parcial de fotos en fallos de lote.
- El alta rechaza solicitudes con mas de 5 fotos.

## Product Gallery Contract
- La gestion de productos muestra galeria o miniaturas de fotos asociadas.
- El usuario puede verificar visualmente el conjunto de fotos cargadas.

## Error Contract
- Error de validacion de archivos: respuesta de negocio clara por lote/archivo.
- Error de almacenamiento: rollback de alta y mensaje operativo.
