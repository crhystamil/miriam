# Quickstart - Perfil de mayorista en ventas

## Prerequisitos
- Backend activo.
- Frontend activo.
- Mayoristas previamente creados en su flujo/modulo dedicado.
- Usuario con permisos para registrar ventas.

## Flujo de validacion
1. Abrir formulario de ventas.
2. Confirmar que se exige seleccion de mayorista existente.
3. Seleccionar mayorista y registrar venta valida.
4. Verificar en listado de ventas que se muestra nombre/telefono de mayorista.
5. Filtrar ventas por mayorista y validar productos comprados.

## Casos negativos
1. Intentar guardar venta sin mayorista seleccionado -> debe bloquear y mostrar error.
2. Intentar guardar venta sin mayorista seleccionado -> debe bloquear y mostrar mensaje para usar el modulo dedicado de mayoristas.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/` (recomendado)
