# Data Model - Registro de gastos en modal y simplificacion de vista

## 1) Gasto
- Purpose: Registro persistido de egreso mostrado en la tabla de gastos.
- Fields relevantes:
  - `id`
  - `scope` (`store` | `vendor`)
  - `vendor` (nullable cuando aplica)
  - `vendor_username` (solo lectura)
  - `concept`
  - `amount`
  - `spent_at` (asignado automaticamente)
  - `notes` (opcional)
- Validation rules:
  - `concept` obligatorio y no vacio.
  - `amount` obligatorio y mayor a cero.
  - `spent_at` no editable desde modal; se asigna al registrar.

## 2) FormularioNuevoGasto
- Purpose: Estado de captura del modal para crear gasto.
- Fields:
  - `scope` (requerido)
  - `concept` (requerido)
  - `amount` (requerido)
  - `notes` (opcional)
- Validation rules:
  - No permite submit con campos requeridos invalidos.
  - Debe bloquear doble submit mientras la solicitud esta en curso.
  - Al exito, limpia estado y cierra modal.

## 3) ModalNuevoGasto
- Purpose: Contenedor de interaccion superpuesto a la tabla.
- States:
  - `closed`
  - `open_idle`
  - `open_submitting`
  - `open_error`
- Transitions:
  - `closed -> open_idle` al presionar "Nuevo gasto".
  - `open_idle -> open_submitting` al enviar formulario valido.
  - `open_submitting -> closed` en registro exitoso.
  - `open_submitting -> open_error` si falla validacion/operacion.
  - `open_error -> open_idle` al corregir campos o reintentar.

## Relationships
- `FormularioNuevoGasto` genera un `Gasto` al confirmarse el modal.
- `ModalNuevoGasto` encapsula `FormularioNuevoGasto` y gobierna su ciclo de vida.
