# Quickstart - Mejora de registro de ventas

## Prerequisitos
- Backend corriendo en `http://localhost:8000` (o `127.0.0.1:8000`).
- Frontend corriendo en `http://localhost:5173`.
- Usuario con permisos para registrar ventas (`admin` o `vendor`).

## Flujo de validacion manual
1. Iniciar sesion y abrir `Ventas`.
2. Verificar boton principal `Registrar Venta`.
3. Pulsar boton y confirmar apertura de modal centrado.
4. En buscador de producto, escribir parte de `SKU` y luego parte de `nombre`.
5. Seleccionar producto y verificar panel de descripcion (incluye imagen pequena referencial).
6. Completar `cantidad` y `precio de venta`; opcionalmente agregar nota.
7. Guardar y confirmar:
   - mensaje de exito,
   - refresco de tabla de ventas,
   - limpieza de formulario.
8. Reabrir modal, capturar borrador parcial, cerrar/cancelar y confirmar que el borrador se limpia.

## Validaciones tecnicas
- Frontend:
  - `npm run build` en `frontend/`
- Backend:
  - `.venv/bin/python manage.py check` en `backend/`
  - `.venv/bin/python manage.py test` en `backend/` (opcional recomendado)

## Criterios de aceptacion rapidos
- Registro inicia siempre desde `Registrar Venta`.
- Modal enfocado y usable en desktop/mobile.
- Busqueda por SKU/nombre responde en lista extensa.
- Imagen de referencia no domina el layout.
