# Quickstart - Gestion de productos con modal e imagenes

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos administrativos de catalogo.
- Vista de productos accesible.

## Flujo de validacion
1. Abrir vista de productos.
2. Verificar boton "Nuevo producto" y abrir modal.
3. Completar formulario con datos validos y agregar una o mas imagenes.
4. Guardar y confirmar que el producto aparece en la tabla de activos.
5. Editar el producto desde la fila y verificar actualizacion en tabla.
6. Ejecutar "Eliminar" en una fila, confirmar accion y verificar que el producto queda fuera de la tabla operativa.

## Casos negativos
1. Intentar guardar sin imagenes -> debe bloquear y mostrar error de validacion.
2. Intentar guardar con SKU ya existente -> debe bloquear y mostrar conflicto de datos.
3. Cancelar cierre del modal con cambios no guardados -> debe preservar o confirmar descarte segun flujo definido.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
