# Quickstart: Optimizacion de carga del catalogo y vista mayorista

## Prerequisites

- Backend dependencies installed in `backend/.venv` (incluyendo Pillow tras agregarlo a `requirements.txt`).
- Frontend dependencies installed in `frontend/`.
- Base de datos con productos e imagenes existentes (`backend/db.sqlite3`).

## Verification Steps

### Backend — generacion de variantes

1. Instalar la nueva dependencia desde `backend/`:

   ```bash
   .venv/bin/pip install Pillow
   ```

2. Aplicar la migracion de esquema (campos de variantes en `ProductImage`):

   ```bash
   .venv/bin/python manage.py migrate products
   ```

3. Ejecutar el comando de migracion de imagenes para generar variantes existentes:

   ```bash
   .venv/bin/python manage.py generate_image_variants
   ```

   Expected result: el comando procesa las ~205 imagenes y reporta cuantas genero y cuantas fallo; es idempotente (re-ejecutable).

4. Verificar la API devuelve URLs de variantes:

   ```bash
   .venv/bin/python manage.py runserver
   ```

   Abrir `http://127.0.0.1:8000/api/products/?page=1` y confirmar que cada producto incluye `representative_thumbnail_url` y cada imagen incluye `thumbnail_url`, `medium_url` y `large_url`.

### Backend — pruebas

5. Ejecutar las pruebas de la app `products`:

   ```bash
   .venv/bin/python manage.py test products
   ```

   Expected result: pruebas existentes y nuevas (creacion con variantes, fallback de URL, comando de migracion) pasan.

### Frontend — carga optimizada

6. Construir el frontend desde `frontend/`:

   ```bash
   npm run build
   ```

   Expected result: build exitoso sin errores de tipos.

7. Iniciar el frontend con el comando de desarrollo habitual y abrir el catalogo publico.

8. Abrir las DevTools (pestana Network, perfil "Slow 3G") y cargar el catalogo.

   Expected result: las imagenes visibles descargan archivos `.webp` pequenos (~decenas de KB); las imagenes fuera de pantalla no se descargan hasta hacer scroll; no hay saltos de layout (CLS bajo).

### Frontend — vista mayorista

9. Abrir la ruta mayorista, completar el acceso por celular (spec 022) y, antes de que cargue toda la lista, escribir un termino en el buscador.

   Expected result: aparecen resultados coincidentes de inmediato, sin necesidad de cargar el resto de la lista.

10. Limpiar la busqueda y pulsar "Cargar mas".

    Expected result: se agregan mas productos sin perder ni duplicar los mostrados; el boton desaparece al llegar al final.

### Frontend — detalle

11. Abrir el detalle de un producto.

    Expected result: la imagen principal usa la variante grande; las miniaturas de la galeria usan la variante miniatura; todas cargan de forma diferida.

## Success Criteria Mapping

- **SC-001** (>=80% de reduccion de peso): comparar en Network el peso de las imagenes del catalogo antes/despues (paso 8).
- **SC-002** (<5s primer grupo + busqueda en 3G): medir en paso 9 con perfil Slow 3G.
- **SC-003** (buscar sin cargar toda la lista): validar en paso 9.
- **SC-004** (no descargar fuera de pantalla): validar en paso 8 con Network filtrando imagenes.
- **SC-005** (100% de imagenes migradas): validar con el reporte del comando en paso 3.
- **SC-006** (sin saltos de layout): validar CLS en paso 8.
- **SC-007** (calidad visual): inspeccion visual en pasos 8 y 11.
