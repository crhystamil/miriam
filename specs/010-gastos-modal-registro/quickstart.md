# Quickstart - Registro de gastos en modal y simplificacion de vista

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos para registrar y consultar gastos.
- Datos de gastos existentes para validar tabla y paginacion.

## Flujo de validacion
1. Abrir la vista de gastos y confirmar que existe el boton "Nuevo gasto".
2. Confirmar que el bloque de filtros superior no se muestra.
3. Presionar "Nuevo gasto" y verificar apertura de modal sobre la tabla.
4. Verificar campos del modal: ambito, concepto y monto requeridos; notas opcional; sin campo de fecha editable.
5. Registrar gasto valido y confirmar cierre/limpieza de modal.
6. Verificar que el nuevo gasto aparece en la tabla sin recargar manualmente la pagina.
7. Reabrir modal, enviar con datos invalidos (concepto vacio o monto <= 0) y verificar mensajes de error.
8. Cerrar modal con "Cancelar" y confirmar que al reabrir no conserva valores previos.

## Casos negativos
1. Intentar doble submit rapido y validar que no se duplique registro.
2. Forzar error temporal de red y validar que el modal conserva contexto para reintento.
3. Cerrar modal con cambios sin guardar y verificar reset esperado al reabrir.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
