# Research - Corregir error al registrar venta

## Decision 1: Trazar y corregir el flujo completo frontend + backend
- Decision: La correccion debe abarcar envio del modal en frontend y validacion/persistencia/respuesta en backend.
- Rationale: El error reportado puede originarse en serializacion de datos, validaciones de negocio o manejo de respuestas; revisar solo un lado deja riesgo de fallo persistente.
- Alternatives considered:
  - Corregir solo frontend: podria ocultar sintomas sin resolver causa real.
  - Corregir solo backend: no garantiza que el cliente envie datos correctos ni maneje estados coherentes.

## Decision 2: Mantener contrato de errores de negocio claro y recuperable
- Decision: El flujo devuelve mensajes accionables por campo o por regla global, manteniendo formulario editable para reintento.
- Rationale: Mejora recuperacion operativa y evita bloqueos de usuario tras un intento fallido.
- Alternatives considered:
  - Mensajes genericos unicos: dificulta correccion rapida.
  - Reiniciar formulario tras error: empeora experiencia y aumenta friccion.

## Decision 3: Garantizar consistencia post-envio (exito/error)
- Decision: En exito, cerrar modal y refrescar listado; en error, conservar modal con estado de correccion sin insertar registros parciales.
- Rationale: Previene estados ambiguos y asegura trazabilidad entre accion del usuario y datos visibles.
- Alternatives considered:
  - Mantener modal abierto tambien en exito: mayor riesgo de dobles envios.
  - Refresco diferido manual: puede mostrar informacion desactualizada.

## Decision 4: Validar casos de borde de disponibilidad y stock
- Decision: Cubrir explicitamente casos de mayoristas no disponibles, valores invalidos, stock cambiante y fallos temporales de red.
- Rationale: Son escenarios observables en operacion y explican gran parte de errores de registro percibidos por usuario.
- Alternatives considered:
  - Limitar validacion a caso feliz: no reduce riesgo de recurrencia del incidente.
