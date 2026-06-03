# Monthly Cut Report Contract

## Monthly Cut Execution Contract
- El sistema permite ejecutar corte mensual hasta una fecha de cierre.
- Debe existir una sola ejecucion valida por periodo/fecha.
- El corte usa snapshot al inicio de ejecucion.
- Registros creados durante ejecucion quedan fuera del corte actual.
- Ventas/gastos incluidos quedan marcados como cerrados por corte y ocultos del historial operativo activo.

## Global Summary Contract
- La vista de corte muestra: ingresos totales, capital invertido, ganancias tienda, ganancias vendedor, capital, gastos y neto real.
- Totales globales se calculan solo con ventas habilitadas del periodo.

## Wholesaler Performance Table Contract
- Tabla incluye: nombre mayorista, numero de ventas, ingresos, capital, ganancias tienda, ganancias mayorista.
- Datos derivados solo de ventas habilitadas del corte.

## Enabled Sales Detail Contract
- Tabla incluye: fecha, mayorista, producto, cantidad, costo, precio mayorista, precio vendido, ganancia tienda, ganancia vendedor y venta total.
- Tabla ordenada por mayorista.

## Disabled Sales Informative Table Contract
- Ventas deshabilitadas se muestran en tabla separada.
- Esta tabla no afecta los indicadores globales del corte.
