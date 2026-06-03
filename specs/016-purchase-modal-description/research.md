# Research: Modal de nueva compra con descripcion

## Decision 1: Reutilizar `Purchase.notes` como descripcion de compra

**Decision**: Usar el campo existente `notes` de `Purchase` para almacenar la descripcion ingresada en el modal.

**Rationale**: El backend ya expone `notes` en `PurchaseSerializer` y `createPurchase` ya permite enviar `notes`. Esto satisface el requerimiento sin migraciones ni cambios de contrato adicionales.

**Alternatives considered**: Crear un campo nuevo `description`. Rechazado porque duplica semantica existente y requiere migracion innecesaria.

## Decision 2: Modal en frontend, sin endpoint nuevo

**Decision**: Reemplazar el formulario inline actual de `PurchasesPage.tsx` por un boton "Nueva compra" que abre un modal con el mismo formulario y un textarea de descripcion.

**Rationale**: La necesidad es de experiencia de usuario. Los datos requeridos ya existen y el flujo de API actual registra compras correctamente.

**Alternatives considered**: Crear una pagina separada de nueva compra. Rechazado porque el usuario pidio especificamente un modal en la seccion de compras.

## Decision 3: Ordenar en backend por fecha descendente

**Decision**: Ordenar `PurchaseViewSet` por `-purchased_at, -id` para que todos los consumidores vean las compras mas recientes primero.

**Rationale**: El orden debe ser consistente y no depender solo de la tabla frontend. `-id` estabiliza el orden cuando varias compras comparten fecha muy cercana.

**Alternatives considered**: Ordenar solo en frontend. Rechazado porque paginacion puede ocultar compras recientes si el backend entrega paginas en orden ascendente o indefinido.

## Decision 4: Actualizar tabla tras compra exitosa

**Decision**: Despues de crear la compra, resetear el formulario, cerrar el modal, mover la tabla a la pagina 1, y recargar compras para mostrar la compra nueva.

**Rationale**: La compra mas reciente debe aparecer inmediatamente. Cerrar el modal evita registros duplicados accidentales y coincide con la especificacion.

**Alternatives considered**: Mantener modal abierto para compras consecutivas. Rechazado por ahora porque el requerimiento prioriza ver la compra registrada en tabla y evitar duplicados.
