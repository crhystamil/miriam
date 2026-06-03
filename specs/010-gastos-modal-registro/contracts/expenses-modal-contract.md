# Expenses Modal Registration Contract

## New Expense Trigger Contract
- La vista de gastos expone un boton visible "Nuevo gasto".
- Al activarlo, se abre un modal sobre la tabla con formulario de alta.

## Expense Create Form Contract
- Campos requeridos del modal: ambito (`scope`), concepto (`concept`) y monto (`amount`).
- Campo opcional: notas (`notes`).
- El formulario no solicita fecha manual.

## Expense Create Submission Contract
- En envio valido, el sistema registra gasto con fecha/hora automatica.
- En envio invalido, el sistema muestra errores claros por campo y no persiste registro.
- En exito, el modal se cierra/limpia y la tabla refleja el nuevo gasto.

## Expenses Table Visibility Contract
- El bloque de filtros superior de la vista de gastos no se muestra.
- La tabla conserva comportamiento de listado y paginacion sin errores.
