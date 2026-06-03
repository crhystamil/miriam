# Research - Carga de imagen en nuevo producto

## Decision 1: Reemplazar URL por carga de archivo
- Decision: El flujo de "Nuevo producto" recibe archivo de imagen en lugar de URL manual.
- Rationale: Cumple requerimiento de negocio y elimina dependencia de enlaces externos inestables.
- Alternatives considered:
  - Mantener URL como alternativa: contradice requerimiento explicito.
  - Permitir URL + archivo: incrementa complejidad y no aporta al alcance solicitado.

## Decision 2: Exactamente una imagen obligatoria
- Decision: Cada producto nuevo debe registrar exactamente una imagen.
- Rationale: Alinea con la aclaracion formal y simplifica validacion de formulario.
- Alternatives considered:
  - Multiples imagenes: mayor flexibilidad, pero fuera del alcance de esta iteracion.
  - Imagen opcional: reduce calidad visual del catalogo.

## Decision 3: Validacion de archivo en backend y frontend
- Decision: Validar presencia, tipo permitido y tamano maximo del archivo en backend; frontend refleja errores claros.
- Rationale: La validacion de backend garantiza integridad aunque cambie el cliente; frontend mejora UX.
- Alternatives considered:
  - Validar solo frontend: insuficiente para seguridad/integridad.
  - Validar solo backend sin feedback de campo: UX pobre.

## Decision 4: Persistir metadatos y servir imagen desde almacenamiento local
- Decision: Guardar archivo en almacenamiento local del proyecto y persistir referencia en entidad de imagen de producto.
- Rationale: Compatibilidad con arquitectura actual y menor complejidad operativa inmediata.
- Alternatives considered:
  - Almacenamiento externo: mayor escalabilidad, pero fuera de alcance.
  - Base64 en BD: peor eficiencia de almacenamiento y consulta.

## Decision 5: Visualizacion post-alta en gestion de productos
- Decision: Mostrar miniatura o indicador visual de la imagen en la gestion de productos.
- Rationale: Permite confirmar rapidamente que la imagen correcta quedo asociada.
- Alternatives considered:
  - Solo mostrar nombre de archivo: menor valor visual para control operativo.
