# Quickstart - Corregir error al registrar venta

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos para registrar ventas.
- Productos y mayoristas disponibles para el flujo base.

## Flujo de validacion
1. Abrir modulo de ventas.
2. Abrir modal de registrar venta.
3. Seleccionar producto y mayorista, ingresar cantidad y precio validos.
4. Confirmar registro y verificar mensaje de exito.
5. Verificar que el modal se cierra y la venta aparece en el listado.

## Casos negativos
1. Enviar con cantidad o precio invalidos y verificar mensaje de error claro.
2. Forzar stock insuficiente y verificar rechazo sin crear venta parcial.
3. Simular fallo temporal de red y verificar mensaje operativo con opcion de reintento.
4. Abrir modal sin mayoristas disponibles y verificar bloqueo informativo del envio.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
