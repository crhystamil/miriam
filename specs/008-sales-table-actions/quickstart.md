# Quickstart - Completar tabla de ventas y acciones

## Prerequisitos
- Backend y frontend activos.
- Usuarios de prueba con rol administrador y vendedor.
- Ventas existentes para validar tabla y acciones.

## Flujo de validacion
1. Iniciar sesion como administrador y abrir modulo de ventas.
2. Verificar columnas: fecha, mayorista, producto, cantidad, costo, precio mayorista y precio vendido.
3. Deshabilitar una venta y verificar estado inactivo + reversa de stock.
4. Eliminar una venta como administrador y verificar que deja de listarse.
5. Iniciar sesion como vendedor y verificar que ve columnas completas.
6. Como vendedor, deshabilitar venta y verificar actualizacion correcta.
7. Como vendedor, confirmar que eliminar venta esta bloqueado por permisos.

## Casos negativos
1. Intentar deshabilitar/eliminar una venta inexistente y validar mensaje claro.
2. Ejecutar accion con fallo temporal de red y validar recuperacion sin romper tabla.
3. Ejecutar acciones concurrentes sobre la misma venta y validar consistencia final.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
