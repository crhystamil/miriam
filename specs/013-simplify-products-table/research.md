# Research - Simplificar tabla y filtros de productos

## Decision 1: Ocultar columnas, no eliminar datos
- Decision: Quitar SKU y descripcion solo de la tabla de productos, manteniendo ambos campos en el dominio.
- Rationale: Cumple la simplificacion visual pedida sin afectar otras pantallas, reportes o procesos que dependan de esos atributos.
- Alternatives considered:
  - Eliminar campos del backend: rompe contratos y usos no solicitados.
  - Mantener columnas con visibilidad condicional: no cumple simplificacion directa.

## Decision 2: Remover checkbox de stock bajo del formulario
- Decision: Eliminar el checkbox "solo stock bajo" de la seccion de filtros de productos.
- Rationale: Es un requerimiento explicito y reduce complejidad de la interfaz.
- Alternatives considered:
  - Dejarlo deshabilitado: conserva ruido visual.
  - Mantenerlo para admin solamente: no solicitado y agrega reglas de rol.

## Decision 3: Compatibilidad con estado/URL legado
- Decision: Si llega `low_stock_only` por URL o estado previo, ignorarlo y continuar con carga normal.
- Rationale: Evita errores para enlaces antiguos y no fuerza redirecciones innecesarias.
- Alternatives considered:
  - Error por parametro no soportado: mala experiencia de usuario.
  - Redireccion canonica obligatoria: mas complejidad sin beneficio funcional clave.

## Decision 4: Mantener comportamiento de filtros restantes
- Decision: No cambiar semantica de los demas filtros actuales.
- Rationale: Reduce riesgo de regresion y mantiene curva de uso conocida para operacion diaria.
- Alternatives considered:
  - Reestructurar panel completo de filtros: fuera de alcance de esta feature.
