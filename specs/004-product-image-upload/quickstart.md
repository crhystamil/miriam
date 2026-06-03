# Quickstart - Carga de imagen en nuevo producto

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos de administracion de catalogo.
- Vista de productos accesible.

## Flujo de validacion
1. Abrir vista de productos.
2. Abrir modal de "Nuevo producto".
3. Completar campos obligatorios del producto.
4. Seleccionar un archivo de imagen valido desde el equipo local.
5. Guardar y verificar alta exitosa.
6. Confirmar que la gestion de productos muestra imagen asociada.

## Casos negativos
1. Guardar sin imagen -> debe bloquear y mostrar error.
2. Cargar archivo no permitido -> debe rechazar con mensaje claro.
3. Cargar archivo que exceda limite -> debe rechazar con mensaje claro.
4. Simular error de almacenamiento -> no debe persistir producto incompleto.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
