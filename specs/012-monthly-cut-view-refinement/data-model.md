# Data Model - Refinar vista y calculos de corte mensual

## 1) MonthlyCut (existente, reglas reafirmadas)
- Purpose: Registro historico de cierre mensual consultable en listado y detalle.
- Fields relevantes:
  - `id`
  - `cutoff_date`
  - `started_at`
  - `finished_at`
  - `status`
  - `created_by`
- Validation rules:
  - Unicidad por periodo/fecha vigente desde feature 011.
  - No se elimina desde flujos funcionales.
  - El listado se presenta por `cutoff_date` descendente.

## 2) MonthlyCutFinancialSummary (proyeccion de lectura)
- Purpose: Resumen financiero mostrado en detalle de corte con reglas corregidas.
- Fields relevantes:
  - `total_income`
  - `capital`
  - `store_profit`
  - `wholesaler_profit` (informativo, excluido del neto real)
  - `expenses`
  - `real_net`
- Validation rules:
  - `real_net = store_profit - expenses`.
  - No exponer `invested_capital` como campo visual separado cuando es equivalente a `capital`.

## 3) MonthlyCutExpenseRow (proyeccion de lectura)
- Purpose: Fila de tabla de gastos del detalle del corte.
- Fields relevantes:
  - `date`
  - `concept`
  - `amount`
  - `expense_id` (opcional tecnico para trazabilidad interna)
- Validation rules:
  - Incluye solo gastos cerrados por el corte consultado.
  - Debe soportar monto `0` o negativo por correcciones historicas.
  - Si no hay gastos, la vista debe renderizar estado vacio estable.

## 4) MonthlyCutListRow (proyeccion de lectura)
- Purpose: Fila de la vista principal de cortes.
- Fields relevantes:
  - `id`
  - `cutoff_date`
  - `status`
  - `created_at`/`finished_at`
  - `summary_preview` (opcional, segun contrato actual)
- Validation rules:
  - Orden descendente por fecha de corte.
  - Accion `Ver` navega a detalle de ese `id`.

## Relationships
- `MonthlyCut` 1:N `Sale` y `Expense` cerrados por ese corte (existente).
- `MonthlyCutFinancialSummary`, `MonthlyCutExpenseRow` y tablas de ventas/desempeno pertenecen a un `MonthlyCut` consultado.

## State Transitions
- `MonthlyCut.status`: `running` -> `completed` o `failed` (sin cambios).
- Disponibilidad de detalle: solo cortes existentes en historial; URLs invalidas se tratan como referencia no encontrada.
