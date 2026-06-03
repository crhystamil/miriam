# Products Modal CRUD Contract

## Products Table Contract
- La vista de productos lista por defecto solo productos activos.
- Cada fila expone acciones de `editar` y `eliminar` (eliminar = desactivar).
- Tras crear, editar o desactivar, la tabla refleja el cambio sin navegar a otra pantalla.

## Product Creation Modal Contract
- Existe un boton visible "Nuevo producto" que abre un modal sobre la tabla.
- El modal permite registrar datos de producto y una o mas imagenes.
- Si faltan datos obligatorios o no hay imagenes, el sistema bloquea guardado y muestra errores claros.

## Product Images Contract
- Un producto se guarda solo si tiene al menos una imagen asociada.
- El sistema permite mantener multiples imagenes por producto.
- Al editar, las imagenes existentes permanecen disponibles salvo cambios explicitos del usuario.

## Edit Contract
- Editar producto actualiza campos y mantiene consistencia de imagenes.
- Los cambios exitosos deben ser visibles en la tabla operativa actual.

## Deactivation Contract
- Accion "Eliminar" solicita confirmacion explicita.
- Al confirmar, el producto cambia a inactivo y deja de mostrarse en la tabla operativa activa.
- La desactivacion preserva historial relacionado del producto.

## Error Contract
- Error de validacion de formulario: se muestran mensajes por campo y mensaje general.
- Error por conflicto de datos (ej. SKU duplicado): se informa motivo y no se persiste el cambio.
- Error operativo al desactivar: el producto conserva estado previo y se informa al usuario.
