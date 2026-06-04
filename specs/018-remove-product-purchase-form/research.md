# Research: Quitar compra desde productos

## Decision: Eliminar el flujo duplicado solo desde la pantalla de productos

**Rationale**: El requerimiento pide quitar el formulario de registrar compra dentro de productos porque ya existe una seccion dedicada. Limitar el cambio a la pantalla de productos reduce riesgo y preserva el flujo correcto de compras.

**Alternatives considered**:

- Deshabilitar el formulario sin eliminarlo: seguiria ocupando espacio y manteniendo confusion.
- Redirigir desde productos hacia compras: agrega otro flujo y no cumple tan claramente con retirar el formulario duplicado.
- Cambiar backend de compras: innecesario porque el problema es de interfaz duplicada.

## Decision: Mantener la seccion de compras sin cambios funcionales

**Rationale**: La seccion de compras ya contiene el formulario esperado para registrar compras, incluyendo seleccion de producto, cantidad, costo unitario y descripcion. Mantenerla evita regresiones en el proceso operativo.

**Alternatives considered**:

- Mover logica desde productos hacia compras: no necesario porque compras ya implementa el flujo.
- Crear una nueva entrada de navegacion: innecesario si la seccion ya existe.

## Decision: Retirar estados, importaciones y mensajes asociados a compra en productos

**Rationale**: Si solo se oculta el JSX, quedarian codigo muerto y estados que pueden generar confusion futura. Eliminar importaciones, handlers, estados y mensajes asociados reduce mantenimiento.

**Alternatives considered**:

- Dejar codigo muerto para posible reutilizacion: aumenta deuda tecnica y contradice la intencion de tener un unico flujo.
- Extraer el formulario a componente compartido: innecesario porque no se quiere compartir el flujo en productos.

## Decision: Validar con build frontend y revision manual de flujos

**Rationale**: El cambio esperado es puramente de frontend. El build valida tipos/importaciones; la revision manual confirma que productos no permite compras y compras si permite registrarlas.

**Alternatives considered**:

- Pruebas backend: no aportan valor si no se modifica backend.
- Pruebas E2E automatizadas: valiosas, pero no hay infraestructura E2E existente y el cambio es acotado.
