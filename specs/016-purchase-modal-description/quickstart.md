# Quickstart: Modal de nueva compra con descripcion

## Implementacion esperada

1. En `backend/sales/views.py`, ordenar `PurchaseViewSet.queryset` por `-purchased_at`, `-id`.
2. En `frontend/src/pages/PurchasesPage.tsx`, agregar estado `isPurchaseModalOpen`.
3. Reemplazar el formulario inline por un boton "Nueva compra".
4. Renderizar el formulario dentro de un modal cuando `isPurchaseModalOpen` sea verdadero.
5. Agregar estado `newNotes` y un textarea "Descripcion de compra".
6. Enviar `notes: newNotes` dentro de `createPurchase`.
7. Tras compra exitosa, cerrar modal, limpiar campos, ir a pagina 1 y recargar compras.
8. Agregar columna "Descripcion" a la tabla de compras.

## Verificacion manual

1. Entrar como administrador.
2. Abrir la seccion Compras.
3. Verificar que aparece el boton "Nueva compra".
4. Presionar el boton y verificar que se abre un modal.
5. Completar producto, cantidad, costo unitario y descripcion.
6. Registrar compra.
7. Verificar que el modal se cierra y la tabla muestra la compra nueva.
8. Verificar que la descripcion aparece en la tabla.
9. Registrar una segunda compra y verificar que aparece antes que la anterior.

## Validacion tecnica

- Ejecutar `npm run build` en `frontend/`.
- Ejecutar pruebas backend relevantes si se toca queryset o serializer de compras.
