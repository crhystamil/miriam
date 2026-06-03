# Research - Perfil de mayorista en ventas

## Decision 1: Alta de mayorista fuera del formulario de ventas
- Decision: El formulario de ventas solo permite seleccionar mayoristas existentes; no crea nuevos perfiles en el momento.
- Rationale: Evita ampliar alcance del flujo de caja/venta y mantiene control de calidad de datos en un flujo dedicado.
- Alternatives considered:
  - Alta inline durante venta: mas rapido, pero incrementa complejidad y riesgo de duplicados.
  - Modal secundario de alta rapida: reduce friccion pero sigue mezclando responsabilidades.

## Decision 2: Unicidad de mayorista por nombre + telefono normalizado
- Decision: Validar duplicados con combinacion de nombre y telefono normalizado.
- Rationale: Evita duplicados por formato (espacios, guiones, prefijos) conservando precision de identificacion comercial.
- Alternatives considered:
  - Solo telefono: puede colisionar en contactos compartidos.
  - Coincidencia exacta sin normalizacion: deja pasar duplicados por formato.

## Decision 3: Telefono sin validacion de formato o longitud
- Decision: Mantener telefono como dato informativo del perfil, sin validacion activa de formato o longitud.
- Rationale: El flujo de ventas depende solo de la seleccion de mayorista existente; la captura operativa no debe bloquearse por formato telefonico.
- Alternatives considered:
  - E.164 estricto: demasiado rigido para el contexto operativo.
  - Minimo de digitos post-normalizacion: agrega friccion sin aportar al objetivo de esta feature.

## Decision 4: Consulta de ventas por mayorista dentro de vistas existentes
- Decision: Extender filtros/listados de ventas para incluir mayorista, sin crear modulo nuevo.
- Rationale: Cumple necesidad de rastreo comercial con bajo impacto de arquitectura.
- Alternatives considered:
  - Modulo nuevo de analitica mayorista: sobre-esfuerzo para el alcance actual.

## Decision 5: Compatibilidad con arquitectura actual
- Decision: Reutilizar stack y patrones existentes (Django/DRF + React), agregando entidad/campos y contratos minimos necesarios.
- Rationale: Minimiza riesgo y acelera entrega incremental.
- Alternatives considered:
  - Servicio separado de clientes mayoristas: mayor desacople, pero innecesario en esta fase.
