# Quickstart - Mejorar tabla de productos y SKU autogenerado

## Prerequisitos
- Backend y frontend activos.
- Usuarios de prueba con rol administrador y vendedor.
- Productos de prueba con y sin imagen, incluyendo al menos uno con multiples imagenes.

## Flujo de validacion
1. Iniciar sesion como administrador y abrir modulo de productos.
2. Verificar columnas de tabla: SKU, nombre, descripcion, costo, precio mayorista, precio publico, stock, estado e imagen representativa.
3. Crear producto nuevo sin ingresar SKU manual (campo solo lectura/autogenerado) y confirmar que se genera SKU unico visible en tabla.
4. Validar en un producto con multiples imagenes que la tabla muestra solo una imagen representativa.
5. Validar en producto sin imagen (o con error de carga) que aparece fallback claro sin romper la fila.
6. Confirmar que administrador mantiene acciones de gestion existentes en la tabla.
7. Iniciar sesion como vendedor y confirmar que ve columnas completas, pero no acciones administrativas.

## Casos negativos
1. Simular colision de SKU autogenerado y validar reintento/resultado sin duplicados persistidos.
2. Ejecutar listado con red lenta o error parcial de imagen y validar estabilidad visual de tabla.
3. Verificar comportamiento cuando no existen productos (estado vacio claro).

## Validaciones tecnicas
- `npm run build` en `frontend/`
- `.venv/bin/python manage.py check` en `backend/`
- `.venv/bin/python manage.py test` en `backend/`
