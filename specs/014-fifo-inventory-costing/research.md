# Research: Costeo FIFO de inventario por lotes de compra

**Feature**: `014-fifo-inventory-costing` | **Date**: 2026-06-03

## R1. Rastreo de lote consumido por venta

**Decision**: Agregar FK `purchase` directamente en `Sale`. No se necesita modelo intermedio.

**Rationale**: Las ventas son unitarias (quantity=1), por lo tanto cada venta consume exactamente de un lote. Un FK directo en `Sale` apuntando al `Purchase` del que se tomo la unidad es suficiente. Al desactivar, se lee el FK y se restaura `remaining` del lote. No hay necesidad de `SaleLot`, JSON, ni modelo M2M.

**Alternatives considered**:
- **Modelo intermedio SaleLot**: Necesario solo si una venta consume multiples lotes. Con ventas unitarias, es over-engineering.
- **Campo JSON en Sale**: Sin integridad referencial. Innecesario para un solo FK.
- **No rastrear, recalcular al revertir**: Imposible garantizar reversion correcta si hubo ventas intermedias.

## R2. Comportamiento de `product.cost_price` con FIFO

**Decision**: Mantener `product.cost_price` pero actualizarlo al costo del lote mas reciente al registrar una compra (FR-012). Las ventas dejan de usarlo como fuente de verdad para `unit_cost_price` — ese valor ahora viene del FK `purchase.unit_cost`.

**Rationale**: El campo `cost_price` ya esta expuesto en el frontend (tabla de productos, formulario de edicion). Eliminarlo romperia la UI. Actualizarlo al costo del ultimo lote mantiene un valor de referencia coherente para el admin.

**Alternatives considered**:
- **Eliminar `cost_price`**: Romperia frontend y serializers existentes.
- **No actualizar `cost_price` nunca**: El valor quedaria congelado, generando confusion.

## R3. Migracion de datos existentes (pre-FIFO)

**Decision**: Migracion en tres fases: (1) agregar `remaining` a Purchase y poblar con `remaining = quantity`, (2) para productos con stock > 0 pero sin compras, crear un lote sintetico, (3) para ventas existentes, asignar el FK `purchase` al lote mas antiguo del producto.

**Rationale**: Las ventas existentes ya tienen `unit_cost_price` congelado. Asignarles un FK `purchase` al lote mas antiguo del producto es la mejor aproximacion posible. Para productos sin compras, el lote sintetico garantiza operatividad.

**Alternatives considered**:
- **Dejar ventas existentes sin FK purchase**: `purchase` seria nullable. Al desactivar ventas viejas no se podria restaurar el lote.
- **Lote sintetico global por producto**: Pierde trazabilidad del costo original.

## R4. Concurrencia y atomicidad

**Decision**: Usar `transaction.atomic` + `select_for_update` en el lote consumido durante una venta. Una sola venta = un solo lote = un solo lock por fila.

**Rationale**: Ya es el patron usado en el sistema actual (`sales/services.py:48`). Con ventas unitarias, el lock es sobre una unica fila de Purchase, minimizando contencion. No hay riesgo de deadlock porque cada venta bloquea un solo lote.

**Alternatives considered**:
- **Bloqueo optimista (version field)**: Mas complejo, requiere reintentos. Innecesario para el volumen actual.
- **Sin bloqueo**: Condicion de carrera donde dos ventas consumen la ultima unidad del mismo lote.

## R5. Endpoint de capital inmovilizado

**Decision**: Agregar endpoint `GET /api/reports/inventory-capital/` en `core/views.py` que calcula `Sum(remaining × unit_cost)` de todos los lotes activos, agrupado por producto.

**Rationale**: Reutiliza la infraestructura existente de reportes (mismo archivo, mismo patron de permisos `IsAdminOrVendor`). Es una agregacion directa sobre `Purchase`.

**Alternatives considered**:
- **Campo denormalizado en Product**: Requiere sincronizacion con cada compra/venta.
- **Calcular en el frontend**: Ineficiente, expone datos internos.

## R6. Forzar ventas unitarias

**Decision**: El servicio `register_sale` fuerza `quantity=1` internamente. El serializer ignora el valor enviado. El frontend ajusta el formulario para no mostrar campo de cantidad (o enviar siempre 1).

**Rationale**: La restriccion de ventas unitarias es un requerimiento del negocio (repuestos por unidad). Forzar en el servicio garantiza consistencia sin importar el cliente. El ajuste frontend es cosmético.

**Alternatives considered**:
- **Validar en serializer solamente**: El servicio podria recibir quantity > 1 si se llama directamente.
- **Restringir en el modelo**: Validacion en `Sale.clean()`. Complementario, pero el servicio es la linea principal de defensa.
