# Monthly Cut View Refinement Contract

## List View Contract
- El sistema expone una vista principal con todos los cortes mensuales.
- El orden del listado es por `cutoff_date` descendente (mas reciente primero).
- Cada fila ofrece accion `Ver` hacia la vista de detalle del corte.
- La accion `Ejecutar corte` se expone unicamente en esta vista.

## Execute Cut Confirmation Contract
- Antes de ejecutar un corte, el sistema muestra advertencia de confirmacion obligatoria.
- Si el usuario cancela la advertencia, no se ejecuta la accion.
- Si el usuario confirma y existe regla de duplicidad, el sistema responde con error claro sin estado inconsistente.

## Detail View Contract
- La vista de detalle representa un solo corte y muestra:
  - Resumen financiero refinado.
  - Tabla de desempeno por mayorista.
  - Tabla de gastos del corte.
  - Tablas de ventas habilitadas y deshabilitadas.

## Financial Summary Contract
- `real_net` se calcula como `store_profit - expenses`.
- `wholesaler_profit` no participa en el calculo de `real_net`.
- `capital` se muestra como indicador unico; `invested_capital` no aparece como campo visual separado cuando es equivalente.

## Expenses Table Contract
- Columnas requeridas: `fecha`, `concepto`, `monto`.
- Si no hay gastos para el corte, se muestra estado vacio sin romper la vista.

## Historical Retention Contract
- Los cortes mensuales se preservan como historial y no se eliminan en flujos funcionales.
