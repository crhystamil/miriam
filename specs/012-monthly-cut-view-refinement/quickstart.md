# Quickstart - Refinar vista y calculos de corte mensual

## Prerequisitos
- Backend y frontend activos.
- Usuario administrador autenticado.
- Al menos dos cortes mensuales existentes para validar orden y navegacion.
- Datos de ventas/gastos que incluyan casos con y sin gastos.

## Flujo de validacion funcional
1. Abrir vista principal de cortes y validar que el listado aparece ordenado por fecha de corte descendente.
2. Verificar que la accion `Ejecutar corte` existe en la vista principal y no en la vista de detalle.
3. Presionar `Ejecutar corte` y confirmar que aparece advertencia obligatoria.
4. Cancelar advertencia y validar que no se ejecuta corte.
5. Confirmar advertencia y validar ejecucion normal (o mensaje claro si hay duplicidad por periodo/fecha).
6. Desde el listado, usar accion `Ver` y validar navegacion a vista dedicada de detalle del corte.
7. En detalle, validar resumen financiero:
   - `real_net = store_profit - expenses`.
   - `wholesaler_profit` no afecta `real_net`.
   - Se muestra `capital` sin duplicar `capital invertido`.
8. Validar tabla de gastos del detalle con columnas `fecha`, `concepto`, `monto`.
9. Validar estado vacio estable cuando el corte no tiene gastos.
10. Validar que cortes historicos no tienen accion de eliminacion en los flujos funcionales.

## Casos negativos
1. Acceder a URL de detalle con id invalido y validar respuesta estable de no encontrado.
2. Ejecutar corte confirmado para un periodo ya cerrado y validar error de duplicidad sin cambios parciales.
3. Validar detalle con gastos de monto `0` o negativo sin fallo de render.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
