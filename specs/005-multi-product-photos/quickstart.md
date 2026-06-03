# Quickstart - Carga de multiples fotos por producto

## Prerequisitos
- Backend y frontend activos.
- Usuario con permisos administrativos de catalogo.
- Vista de productos accesible.

## Flujo de validacion
1. Abrir vista de productos.
2. Abrir modal de "Nuevo producto".
3. Completar datos obligatorios.
4. Seleccionar multiples fotos validas desde el equipo local.
5. Confirmar que el lote contiene entre 1 y 5 fotos.
6. Guardar y verificar alta exitosa.
7. Confirmar que la gestion de productos muestra galeria/miniaturas asociadas.

## Casos negativos
1. Guardar sin fotos -> debe bloquear y mostrar error.
2. Cargar mas de 5 fotos -> debe rechazar con mensaje claro.
3. Incluir archivo no permitido dentro del lote -> debe rechazar el lote completo.
4. Incluir archivo que excede tamano maximo -> debe rechazar el lote completo.
5. Simular fallo de almacenamiento en una foto -> no debe persistir alta parcial.

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
