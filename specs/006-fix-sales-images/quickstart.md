# Quickstart - Corregir imagenes en registrar venta

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos para registrar ventas.
- Productos con y sin fotos cargadas en catalogo.

## Flujo de validacion
1. Abrir modulo de ventas.
2. Abrir modal de registrar venta.
3. Seleccionar un producto con fotos y verificar que se muestra la primera foto por `position`.
4. Cambiar a otro producto con fotos y verificar actualizacion inmediata de imagen.
5. Seleccionar un producto sin fotos y verificar fallback visual claro.
6. Completar datos de venta y confirmar que el registro sigue operativo en todos los casos.

## Casos negativos
1. Forzar error de carga de imagen y validar fallback sin bloqueo del formulario.
2. Navegar rapidamente entre productos y verificar correspondencia correcta imagen-producto.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
