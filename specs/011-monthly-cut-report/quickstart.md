# Quickstart - Corte mensual con resumen y reinicio operativo

## Prerequisitos
- Backend y frontend activos.
- Usuario administrador autenticado.
- Ventas y gastos de prueba con fechas anteriores y posteriores a la fecha de corte.
- Datos con ventas habilitadas y deshabilitadas.

## Flujo de validacion
1. Ejecutar corte mensual con fecha de cierre definida.
2. Verificar que solo se incluyen ventas/gastos con fecha menor o igual al cierre.
3. Confirmar que ventas/gastos incluidos quedan marcados como cerrados por corte y no aparecen en historial operativo activo.
4. Confirmar que registros creados durante ejecucion del corte no se incluyen (regla snapshot).
5. Abrir vista de corte y validar indicadores globales: ingresos, capital invertido, ganancias tienda, ganancias vendedor, capital, gastos y neto real.
6. Verificar que indicadores globales se calculan solo con ventas habilitadas.
6.1 Verificar formula esperada de resumen: `capital = capital invertido` y `neto real = (ganancia tienda + ganancia vendedor) - gastos`.
7. Validar tabla de desempeno por mayorista con columnas requeridas.
8. Validar tabla de detalle de ventas habilitadas ordenada por mayorista y con columnas requeridas.
9. Validar tabla separada de ventas deshabilitadas y confirmar que es informativa sin impacto en totales.
10. Intentar ejecutar un segundo corte para misma fecha/periodo y validar bloqueo con mensaje claro.

## Casos negativos
1. Ejecutar corte sin ventas ni gastos del periodo y validar respuesta estable.
2. Ejecutar corte con fallo operativo intermedio y validar que no deja estado inconsistente.
3. Consultar vista de corte para periodo inexistente y validar estado sin datos.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
