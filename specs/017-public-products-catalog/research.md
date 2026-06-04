# Research: Catalogo publico con productos reales

## Decision: Reutilizar `/api/products/` para lectura publica

**Rationale**: El endpoint existente ya permite metodos seguros a usuarios no autenticados mediante permiso read-only, filtra productos activos para listados y entrega paginacion compatible con el frontend actual. Esto satisface el objetivo explicito de consumir `/api/products/` sin introducir un endpoint paralelo.

**Alternatives considered**:

- Crear `/api/public/products/`: mejor separacion de datos publicos, pero excede el objetivo inmediato de consumir `/api/products/` y aumenta alcance backend.
- Mantener `publicCatalog.ts` y sincronizarlo manualmente: conserva el problema de datos duplicados y no refleja inventario real.

## Decision: Usar carga progresiva basada en paginacion existente

**Rationale**: El backend usa paginacion de 10 resultados. Un boton "Cargar mas" permite al invitado acceder a productos adicionales sin agregar soporte nuevo de tamanos de pagina y sin cargar cientos de productos de una vez.

**Alternatives considered**:

- Paginacion numerada: funciona, pero agrega mas estado visible y una experiencia menos fluida para catalogo comercial.
- Cargar todos los productos activos: simple para pocos datos, pero menos escalable y contradice la paginacion existente.

## Decision: Buscar contra el backend usando el filtro `search`

**Rationale**: La busqueda local solo funciona con datos cargados y podria ocultar coincidencias en paginas no cargadas. El filtro existente busca por nombre y SKU, y permite resultados reales desde la fuente de datos.

**Alternatives considered**:

- Filtrado local sobre resultados acumulados: rapido de implementar, pero incompleto cuando hay mas paginas.
- Nuevo filtro por marca/categoria: deseable a futuro, pero los datos actuales no modelan marca/categoria como campos separados.

## Decision: No mostrar campos internos aunque esten presentes en la respuesta

**Rationale**: El serializer actual expone campos administrativos como costos y stock. Para esta feature el requisito minimo es que la interfaz publica no renderice datos internos, manteniendo cambios pequenos. La separacion estricta de contrato publico puede planificarse como mejora posterior si se requiere ocultamiento a nivel de red.

**Alternatives considered**:

- Serializer publico separado: reduce exposicion de datos en JSON, pero no cumple literalmente el objetivo de consumir `/api/products/` si se crea endpoint nuevo; tambien aumenta alcance backend.
- Mostrar todos los campos disponibles: no cumple la especificacion, que pide evitar datos internos en pantallas publicas.

## Decision: Reutilizar tipos `Product` y `PaginatedResponse`

**Rationale**: El frontend ya tiene tipos compatibles con la respuesta existente. Reutilizarlos reduce duplicacion y mantiene una sola forma de consumir productos.

**Alternatives considered**:

- Mantener `PublicProduct` y mapear desde `Product`: viable, pero conserva una abstraccion de datos de muestra innecesaria.
- Crear nuevos tipos publicos estrictos: util si se introduce endpoint publico separado, pero no necesario para este cambio.

## Decision: Validar con pruebas API y build frontend

**Rationale**: El riesgo principal es romper acceso invitado, busqueda, paginacion o renderizado. Las pruebas API verifican lectura publica y filtros; el build valida tipos y empaquetado.

**Alternatives considered**:

- Solo validacion manual: insuficiente para proteger permisos y filtros.
- Pruebas E2E completas: valiosas, pero no hay infraestructura E2E existente en el proyecto.
