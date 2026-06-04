# Quickstart: Quitar compra desde productos

## 1. Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

## 2. Ejecutar backend

```bash
cd backend
python3 manage.py runserver
```

Si usas entorno virtual:

```bash
cd backend
. .venv/bin/activate
python manage.py runserver
```

## 3. Validar productos

Abrir la seccion de productos como administrador.

Comprobar:

- No aparece el titulo "Registrar compra".
- No aparece selector de producto para compra.
- No aparecen campos de cantidad/costo unitario de compra.
- No aparece boton "Registrar compra" en productos.
- El boton "Nuevo producto" sigue disponible.
- El modal de producto permite crear/editar producto.
- La tabla de productos, filtros y acciones siguen visibles.

## 4. Validar compras

Abrir la seccion de compras como administrador.

Comprobar:

- El boton "Nueva compra" sigue disponible.
- El modal/formulario de compra se abre correctamente.
- Se puede seleccionar producto, cantidad, costo unitario y descripcion.
- Registrar compra sigue mostrando exito y actualizando la lista.

## 5. Ejecutar verificaciones

```bash
cd frontend
npm run build
```

Si se modifica backend accidentalmente, ejecutar tambien:

```bash
cd backend
python3 manage.py test
```

## Validation Notes

- 2026-06-03: `npm run build` completed successfully.
- 2026-06-03: `frontend/src/pages/ProductsPage.tsx` has no remaining references to `createPurchase`, purchase-specific state, `submitPurchase`, or the "Registrar compra" controls.
- 2026-06-03: `frontend/src/pages/PurchasesPage.tsx` still contains the dedicated `createPurchase` flow, product selector, quantity, unit cost, description, and submit button.
