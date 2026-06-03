# Quickstart - Simplificar tabla y filtros de productos

## Prerequisitos
- Frontend y backend activos.
- Usuario autenticado con acceso a la pagina de productos.
- Datos de productos de prueba cargados.

## Flujo de validacion funcional
1. Abrir la pagina de productos.
2. Confirmar que la tabla no muestra columnas `SKU` ni `Descripcion`.
3. Confirmar que el panel de filtros no muestra checkbox `solo stock bajo`.
4. Aplicar filtros restantes y validar que el listado responde normalmente.
5. Limpiar y reaplicar filtros para confirmar estabilidad del flujo.

## Casos de compatibilidad y negativos
1. Abrir con estado/URL que incluya `low_stock_only` y validar que se ignora sin error.
2. Probar escenario con cero resultados y validar estado vacio estable.
3. Verificar que acciones de tabla siguen funcionando tras simplificacion de columnas.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
