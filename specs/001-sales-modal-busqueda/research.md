# Research - Mejora de registro de ventas

## Decision 1: Modal centrado para `Registrar Venta`
- Decision: Usar modal centrado como punto de entrada del formulario.
- Rationale: Enfoca la tarea principal de venta, reduce ruido visual y evita errores al separar registro y listado.
- Alternatives considered:
  - Panel desplegable en la pagina: menor aislamiento del flujo, mas distraccion.
  - Nueva ruta/pagina: mayor friccion de navegacion para tarea recurrente.

## Decision 2: Buscador en selector por `SKU` y `nombre`
- Decision: Implementar busqueda de coincidencia parcial por SKU y nombre en el selector de productos.
- Rationale: Es la combinacion mas util para catalogos grandes sin exigir sintaxis especial.
- Alternatives considered:
  - Solo SKU exacto: rapido pero poco usable para usuarios no tecnicos.
  - Incluir descripcion en filtro: aumenta ruido y falsos positivos en resultados.

## Decision 3: Persistencia de borrador limitada al ciclo del modal
- Decision: Conservar borrador mientras modal abierto; limpiar al cerrar/cancelar o al guardar exitosamente.
- Rationale: Previene perdida accidental durante la captura sin introducir complejidad de persistencia entre sesiones.
- Alternatives considered:
  - Limpiar siempre al abrir: empeora experiencia ante cierres accidentales.
  - Persistir entre aperturas: mayor complejidad y riesgo de datos obsoletos.

## Decision 4: Panel de producto en dos columnas con imagen pequena referencial
- Decision: Mantener layout dos columnas en desktop, con imagen pequena no dominante en panel descriptivo.
- Rationale: Mejora verificacion previa sin competir con los campos de captura.
- Alternatives considered:
  - Imagen grande tipo hero: reduce espacio util del formulario.
  - Sin imagen: pierde ayuda visual para confirmacion rapida.

## Decision 5: Mantener backend de ventas sin cambios estructurales
- Decision: Reutilizar endpoint y serializer actual de ventas, agregando/consumiendo `notes` desde frontend.
- Rationale: El contrato ya cubre campos de negocio; el problema principal es UX del frontend.
- Alternatives considered:
  - Crear nuevos endpoints para modal: innecesario para el alcance.
  - Duplicar modelos de venta: rompe simplicidad y eleva riesgo de regresion.
