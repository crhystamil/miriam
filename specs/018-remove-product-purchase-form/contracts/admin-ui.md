# Contract: UI administrativa de productos y compras

## Products Administration Screen

### Expected Visible Controls

- Boton o accion para crear un nuevo producto.
- Filtros de busqueda/estado de productos.
- Tabla/listado de productos.
- Acciones de producto como editar y desactivar, segun permisos.
- Modal/formulario para crear o editar productos.

### Controls That Must Not Exist

- Encabezado, seccion o formulario con texto equivalente a "Registrar compra".
- Selector de producto para compra dentro de productos.
- Campo de cantidad de compra dentro de productos.
- Campo de costo unitario de compra dentro de productos.
- Boton de envio para registrar compra dentro de productos.
- Mensajes de exito/error exclusivos de compra desde productos.

### Acceptance Checks

- Entrar a productos como administrador no muestra controles de compra.
- Crear/editar/desactivar productos sigue disponible.
- La pantalla no queda con bloques vacios o textos que sugieran compra desde productos.

## Purchases Administration Screen

### Expected Visible Controls

- Boton o accion para abrir nueva compra.
- Formulario/modal de compra para usuarios autorizados.
- Seleccion de producto.
- Cantidad.
- Costo unitario.
- Descripcion de compra.
- Tabla/listado de compras.

### Acceptance Checks

- Entrar a compras como administrador permite registrar una compra.
- Registrar una compra desde compras mantiene los mensajes y recarga esperada de la lista.
- Retirar el formulario de productos no elimina ni degrada este flujo.
