# Feature Specification: Optimizacion de carga del catalogo y vista mayorista

**Feature Branch**: `[023-catalog-loading-optimization]`  
**Created**: 2026-06-07  
**Status**: Draft  
**Input**: User description: "las imagenes de productos cargan muy lento en conexiones lentas porque se sirven al tamano original (algunas de 1 a 4 MB). Necesitamos que el backend genere variantes redimensionadas al subir cada imagen en formato comprimido, exponer las URLs de cada variante en la API de productos y un comando de migracion para las imagenes existentes. Tambien agregar carga diferida (lazy), dimensiones para evitar layout shift y srcset que use la variante correcta en cada vista. Ademas la vista mayorista debe ser paginada con boton 'cargar mas' y el buscador debe funcionar de inmediato consultando el backend sin necesidad de haber cargado toda la lista primero."

## Clarifications

### Session 2026-06-07

- Q: Al generar las variantes optimizadas, ¿se conserva el archivo original intacto como fuente maestra o se reemplaza por la version optimizada? → A: Conservar el original como fuente maestra y generar las variantes junto a el (reversible, sin perdida del original).
- Q: ¿Que vistas deben consumir las variantes optimizadas y aplicar carga diferida: solo las publicas/mayorista o tambien la gestion interna (admin)? → A: Solo catalogo publico, vista mayorista y detalle de producto; la gestion interna (admin) queda fuera de alcance.
- Q: ¿Cual debe ser el nuevo limite superior de tamano por imagen al cargar? → A: No cambiar el limite; se mantiene el limite actual de 5 MB.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Buscar y ver productos mayoristas sin esperar toda la lista (Priority: P1)

Como mayorista, quiero abrir la vista de productos y poder buscar un repuesto de inmediato, sin tener que esperar a que se descargue la lista completa, para consultar precios rapidamente incluso en conexiones lentas.

**Why this priority**: Es el problema mas visible: hoy la vista descarga todos los productos antes de mostrar algo y el buscador queda inutilizable mientras tanto. Resolver esto entrega valor inmediato al mayorista.

**Independent Test**: Abrir la vista mayorista, escribir en el buscador antes de que cargue toda la lista y verificar que aparecen resultados coincidentes sin necesidad de cargar el resto.

**Acceptance Scenarios**:

1. **Given** que un mayorista abre la vista de productos, **When** se muestra el primer grupo de resultados, **Then** ve productos de inmediato sin esperar a que se descargue toda la lista.
2. **Given** que la lista aun no termina de cargarse, **When** el mayorista escribe un termino de busqueda, **Then** el sistema consulta el inventario por ese termino y muestra resultados coincidentes al instante.
3. **Given** que existen mas productos que los visibles inicialmente, **When** el mayorista solicita cargar mas, **Then** se agregan productos adicionales sin perder los ya mostrados ni repetirlos.
4. **Given** que la busqueda no coincide con ningun producto, **When** el mayorista la ejecuta, **Then** ve un mensaje claro de sin resultados y puede corregir el termino.

---

### User Story 2 - Recibir imagenes en tamano optimizado (Priority: P1)

Como visitante y mayorista con conexion lenta, quiero que las imagenes del catalogo y la vista mayorista se sirvan en un tamano reducido y formato comprimido, para que las paginas carguen rapido sin perder calidad visual.

**Why this priority**: Las imagenes actuales pesan hasta varios megabytes y se sirven al tamano original; reducir su peso es la mejora estructural con mayor impacto en el tiempo de carga.

**Independent Test**: Comparar el peso de las imagenes que recibe el navegador en una tarjeta del catalogo antes y despues del cambio, verificando que sean sustancialmente menores manteniendo una presentacion aceptable.

**Acceptance Scenarios**:

1. **Given** que se carga una nueva imagen de producto, **When** se almacena, **Then** el sistema genera varias versiones de tamano (miniatura, mediana y grande) en formato comprimido.
2. **Given** que ya existen imagenes de productos registradas, **When** se ejecuta la migracion, **Then** todas quedan con sus versiones optimizadas disponibles para el catalogo y la vista mayorista.
3. **Given** que una vista muestra una imagen pequena (tarjeta o fila de tabla), **When** el navegador la solicita, **Then** recibe la version miniatura en lugar del archivo original completo.

---

### User Story 3 - Cargar imagenes solo cuando son visibles (Priority: P2)

Como visitante en conexion lenta, quiero que las imagenes que estan fuera de pantalla no se descarguen hasta que las necesito ver, para no consumir datos ni tiempo esperando contenido que aun no veo.

**Why this priority**: Complementa la optimizacion de tamano evitando descargas innecesarias y reduciendo el cambio de layout mientras carga el contenido.

**Independent Test**: Abrir un catalogo con muchos productos, inspeccionar la red del navegador y verificar que las imagenes fuera de pantalla no se descargan hasta hacer scroll hacia ellas.

**Acceptance Scenarios**:

1. **Given** que el catalogo o la vista mayorista muestra muchos productos, **When** se renderiza la pagina, **Then** las imagenes fuera de la pantalla visible no se descargan hasta que el usuario se desplaza hacia ellas.
2. **Given** que una imagen esta cargando, **When** el navegador reserva su espacio, **Then** el resto del contenido no salta ni cambia de posicion una vez cargada.
3. **Given** que se abre el detalle de un producto, **When** se muestran la imagen principal y la galeria, **Then** la imagen principal usa una version de mayor tamano y las miniaturas de la galeria usan la version pequena.

---

### Edge Cases

- Que ocurre cuando una imagen existente esta corrupta o no se puede procesar durante la migracion.
- Como se comporta el sistema si una imagen no tiene generadas sus versiones optimizadas (cargada antes de aplicar el cambio y sin migrar).
- Que sucede si el mayorista busca un termino nuevo mientras aun hay una busqueda en curso.
- Como se maneja la paginacion cuando productos cambian de estado entre cargas (dados de baja mientras se navega).
- Que ocurre si el navegador no soporta el formato comprimido moderno elegido.
- Como se comporta la vista si la conexion se interrumpe a mitad de una carga de mas productos.
- Que sucede con un producto que nunca tuvo imagen o cuya imagen se elimino.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST generar versiones optimizadas de tamano (miniatura, mediana y grande) para cada imagen de producto al momento de cargarla, en un formato comprimido moderno.
- **FR-002**: El sistema MUST mantener el limite actual de 5 MB por imagen al cargar un producto, sin reducirlo (decision explicita del negocio).
- **FR-003**: El sistema MUST conservar una calidad visual aceptable en las versiones optimizadas para que el producto se identifique correctamente en catalogo, tabla mayorista y detalle.
- **FR-004**: El sistema MUST exponer, en la informacion de cada producto, las referencias a las distintas versiones de tamano de sus imagenes, de modo que cada vista pueda elegir la version adecuada.
- **FR-005**: El sistema MUST ofrecer un mecanismo de migracion que procese todas las imagenes de productos ya registradas y genere sus versiones optimizadas.
- **FR-006**: El mecanismo de migracion MUST poder ejecutarse de forma centralizada y reportar claramente las imagenes que no pudo procesar.
- **FR-007**: La vista mayorista MUST mostrar productos de forma paginada, presentando un primer grupo visible sin necesidad de descargar todo el inventario.
- **FR-008**: La vista mayorista MUST permitir cargar grupos adicionales de productos a peticion del usuario, sin perder ni duplicar los ya mostrados.
- **FR-009**: La vista mayorista MUST permitir buscar productos por texto de inmediato, consultando el inventario directamente, sin depender de que la lista completa se haya cargado antes.
- **FR-010**: El buscador de la vista mayorista MUST cancelar o reemplazar correctamente una busqueda previa cuando el usuario escribe un termino nuevo.
- **FR-011**: El catalogo publico, la vista mayorista y el detalle de producto MUST cargar las imagenes de forma diferida, descargando solo las visibles y las proximas a medida que el usuario se desplaza.
- **FR-012**: Las imagenes mostradas MUST reservar su espacio en pantalla al renderizarse para evitar saltos de layout mientras cargan.
- **FR-013**: Cada vista MUST usar la version de tamano apropiada: miniatura en tarjetas y filas de tabla, mediana o grande en el detalle de producto.
- **FR-014**: El sistema MUST mostrar estados claros cuando no haya resultados de busqueda o cuando falle la carga de un grupo de productos.

### Key Entities *(include if feature involves data)*

- **Version de imagen**: Cada uno de los tamanos optimizados (miniatura, mediana, grande) generados a partir de la imagen original de un producto, servidos en formato comprimido moderno.
- **Imagen de producto original**: Archivo de imagen subido por administracion para un producto, conservado intacto como fuente maestra a partir de la cual se generan las versiones optimizadas.
- **Busqueda mayorista inmediata**: Consulta por texto que el mayorista realiza sobre el inventario sin necesidad de haber cargado previamente toda la lista de productos.
- **Grupo de productos (pagina)**: Conjunto acotado de productos presentados a la vez en la vista mayorista, con la opcion de cargar el siguiente grupo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El peso promedio de las imagenes descargadas al abrir el catalogo se reduce en al menos un 80% respecto al tamano original.
- **SC-002**: Un mayorista puede ver el primer grupo de productos y realizar una busqueda en menos de 5 segundos incluso en una conexion lenta.
- **SC-003**: Un mayorista puede encontrar un producto especifico mediante el buscador sin haber cargado mas alla del primer grupo de resultados.
- **SC-004**: En una lista con muchos productos, las imagenes fuera de la pantalla visible no se descargan hasta que el usuario se desplaza hacia ellas.
- **SC-005**: El 100% de las imagenes de productos ya registradas quedan con versiones optimizadas disponibles tras ejecutar la migracion.
- **SC-006**: El contenido de la pagina no presenta saltos de layout apreciables mientras cargan las imagenes.
- **SC-007**: Las vistas mantienen calidad visual suficiente para identificar claramente cada producto tras la optimizacion de imagenes.

## Assumptions

- El enfoque tecnico acordado previamente por el usuario (procesamiento con libreria de imagenes tipo Pillow, formato WebP calidad ~80, variantes de ~400/800/1200px) se detallara y concretara en la fase de planificacion; este documento describe el que y el por que del cambio.
- Se priorizan las conexiones lentas (p. ej. dispositivos moviles) como escenario principal de rendimiento.
- El archivo original se conserva intacto como fuente maestra; las variantes optimizadas (miniatura, mediana, grande) se generan junto a el, sin reemplazarlo. El catalogo y la vista mayorista sirven la miniatura; el detalle puede usar la version grande.
- La busqueda se realiza sobre los productos activos disponibles para mayoristas, bajo la misma barrera de acceso por celular ya definida en el spec 022.
- Los productos sin imagen, o cuya imagen no pudo optimizarse, muestran la alternativa visual consistente ya existente.
- El cambio no altera los permisos ni los flujos de administracion del catalogo.
- La optimizacion de imagenes y la carga diferida aplican solo a las vistas publicas (catalogo, mayorista y detalle); la gestion interna de productos (panel administrativo) queda fuera de alcance y mantiene su comportamiento actual, pudiendo optimizarse en un cambio posterior.
- La configuracion de cache del servidor (Apache) para los archivos de imagen se trata de forma complementaria y no forma parte del alcance funcional de este documento.
