# Quickstart: Catalogo publico con productos reales

## 1. Preparar datos

Verificar que existan productos activos con imagenes en la base local. Si se uso la migracion desde `oldSite`, deben existir productos con SKU `OLD-*`.

## 2. Ejecutar backend

```bash
cd backend
python3 manage.py runserver
```

Si se usa entorno virtual:

```bash
cd backend
. .venv/bin/activate
python manage.py runserver
```

## 3. Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

## 4. Validar API publica de productos

Sin iniciar sesion, verificar:

```bash
curl http://127.0.0.1:8000/api/products/
curl "http://127.0.0.1:8000/api/products/?search=filtro"
```

Resultado esperado:

- Status `200`.
- Respuesta paginada con `count`, `next`, `previous`, `results`.
- Productos inactivos no aparecen en listado sin filtro administrativo.

## 5. Validar catalogo invitado

Abrir:

```text
http://localhost:5173/catalog
```

Comprobar:

- No se requiere login.
- Se muestran productos reales registrados.
- No aparecen productos de muestra de `publicCatalog.ts`.
- Si hay mas de 10 resultados, se puede cargar mas.
- Buscar un producto conocido muestra coincidencias reales.
- Buscar un termino inexistente muestra estado sin resultados.

## 6. Validar detalle publico

Desde el catalogo, abrir un producto.

Comprobar:

- Los datos corresponden al producto registrado.
- La imagen principal y galeria se muestran si existen.
- Hay estado amigable para producto inexistente o no publico.
- No se muestran costo interno, precio mayorista ni stock exacto.

## 7. Validar pagina principal

Abrir:

```text
http://localhost:5173/
```

Comprobar:

- El bloque de destacados usa productos reales activos.
- Si no hay productos activos, no muestra productos ficticios.

## 8. Ejecutar verificaciones

```bash
cd backend
python3 manage.py test products
```

```bash
cd frontend
npm run build
```

## Validation Notes

- 2026-06-03: `npm run build` completed successfully.
- 2026-06-03: `python manage.py test products` completed successfully in a temporary virtual environment at `/tmp/opencode/miriam-test-venv` because the local system Python was missing project dependencies.
- 2026-06-03: Guest `GET /api/products/` returned HTTP 200 on a temporary Django server at `127.0.0.1:8010`.
- Browser-based visual validation should still be repeated before production deployment.
