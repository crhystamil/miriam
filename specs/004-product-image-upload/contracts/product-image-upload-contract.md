# Product Image Upload Contract

## New Product Modal Contract
- El modal de "Nuevo producto" incluye control de carga de archivo de imagen.
- No se permite ingresar URL de imagen en este flujo.
- El formulario bloquea guardado si no hay archivo cargado.

## File Validation Contract
- El sistema valida archivo por tipo permitido, tamano maximo y presencia obligatoria.
- Si falla validacion, retorna errores claros por campo y mensaje general.

## Product Creation Contract
- Crear producto requiere exactamente una imagen valida.
- Si creacion falla en cualquier paso, no debe quedar producto sin imagen asociada.

## Product Visualization Contract
- Tras alta exitosa, la gestion de productos permite visualizar imagen asociada.
- La visualizacion no depende de captura manual de URL.

## Error Contract
- Error de validacion de archivo: respuesta de negocio clara y no persistencia parcial.
- Error de almacenamiento: mensaje operativo y rollback del alta.
