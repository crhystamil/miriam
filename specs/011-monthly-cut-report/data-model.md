# Data Model - Corte mensual con resumen y reinicio operativo

## 1) CorteMensual
- Purpose: Registro de cierre de periodo con referencia de consolidacion y estado final.
- Fields relevantes:
  - `id`
  - `cutoff_date`
  - `started_at`
  - `finished_at`
  - `created_by`
  - `status` (`running`, `completed`, `failed`)
- Validation rules:
  - Unicidad por periodo/fecha de cierre.
  - Solo usuarios administradores pueden crearlo.

## 2) EstadoCierreRegistro
- Purpose: Marca aplicada a ventas/gastos incluidos en corte para ocultarlos del historial activo.
- Fields relevantes:
  - `is_closed_by_cut` (boolean)
  - `closed_by_cut_id` (referencia a `CorteMensual`)
  - `closed_at`
- Validation rules:
  - Se aplica solo a registros del snapshot del corte.
  - No elimina datos historicos.

## 3) ResumenFinancieroCorte
- Purpose: Indicadores globales del corte mensual.
- Fields relevantes:
  - `total_income`
  - `invested_capital`
  - `store_profit`
  - `vendor_profit`
  - `capital`
  - `expenses`
  - `real_net`
- Validation rules:
  - Se calcula unicamente con ventas habilitadas del periodo.
  - Debe corresponder al mismo snapshot del `CorteMensual`.

## 4) DesempenoMayoristaCorte
- Purpose: Agregado por mayorista para analisis comercial.
- Fields relevantes:
  - `wholesaler_name`
  - `sales_count`
  - `income`
  - `capital`
  - `store_profit`
  - `wholesaler_profit`
- Validation rules:
  - Solo incluye ventas habilitadas del corte.

## 5) DetalleVentaHabilitadaCorte
- Purpose: Fila de detalle principal de ventas activas del corte.
- Fields relevantes:
  - `sold_at`
  - `wholesaler_name`
  - `product_name`
  - `quantity`
  - `unit_cost_price`
  - `unit_wholesale_reference_price`
  - `unit_sale_price`
  - `store_profit`
  - `vendor_profit`
  - `sale_total`
- Validation rules:
  - Ordenado por `wholesaler_name`.

## 6) DetalleVentaDeshabilitadaCorte
- Purpose: Fila informativa de ventas deshabilitadas separadas del detalle principal.
- Fields relevantes:
  - mismos campos base de detalle de venta
  - `is_active = false`
- Validation rules:
  - No impacta en `ResumenFinancieroCorte`.

## Relationships
- `CorteMensual` referencia conjuntos snapshot de ventas y gastos.
- `EstadoCierreRegistro` se aplica a ventas/gastos incluidos en `CorteMensual`.
- `ResumenFinancieroCorte`, `DesempenoMayoristaCorte`, `DetalleVentaHabilitadaCorte` y `DetalleVentaDeshabilitadaCorte` pertenecen a un `CorteMensual`.
