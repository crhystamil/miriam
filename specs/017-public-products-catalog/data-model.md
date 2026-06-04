# Data Model: Catalogo publico con productos reales

## Public Product

**Source**: Producto registrado existente.

**Purpose**: Representa un producto visible para visitantes invitados en catalogo, detalle y destacados.

**Fields**:

- `id`: identificador unico usado para abrir detalle.
- `name`: nombre comercial visible.
- `description`: descripcion visible del producto.
- `public_price`: precio publico si el negocio decide mostrarlo.
- `is_active`: determina si el producto puede aparecer publicamente.
- `representative_image_url`: imagen principal para tarjeta y detalle.
- `images`: galeria de imagenes asociadas.

**Fields not rendered publicly**:

- `cost_price`
- `fifo_cost_price`
- `wholesale_reference_price`
- `stock`
- `sku`, salvo que el negocio decida exponerlo como referencia publica en una feature posterior

**Validation Rules**:

- Solo productos activos aparecen en listados publicos.
- Productos inexistentes o no activos producen estado de no encontrado en detalle.
- Si no hay imagen principal, la UI usa fallback visual.

## Product Image

**Source**: Imagen asociada a producto existente.

**Purpose**: Provee representacion visual para catalogo y galeria de detalle.

**Fields**:

- `id`: identificador de imagen.
- `image_url`: URL visible de la imagen.
- `position`: orden de presentacion.
- `content_type`: metadato disponible, no necesario para render publico.
- `size_bytes`: metadato disponible, no necesario para render publico.

**Validation Rules**:

- La imagen con menor posicion/id es la representativa.
- Imagenes vacias o faltantes no deben romper la pagina publica.

## Catalog Search

**Purpose**: Texto ingresado por visitante para encontrar productos reales.

**Fields**:

- `query`: texto normalizado enviado como criterio de busqueda.
- `page`: pagina actual de resultados.

**Validation Rules**:

- Terminos vacios muestran el listado inicial de productos activos.
- Cambiar el termino reinicia los resultados acumulados desde la primera pagina.
- Busquedas sin resultados muestran estado vacio especifico.

## Catalog Result Page

**Purpose**: Respuesta paginada de productos publicos.

**Fields**:

- `count`: cantidad total de resultados coincidentes.
- `next`: indicador/enlace para mas resultados.
- `previous`: indicador/enlace para pagina anterior.
- `results`: productos de la pagina actual.

**State Transitions**:

- `initial` -> `loading`: al abrir catalogo o cambiar busqueda.
- `loading` -> `loaded`: al recibir resultados.
- `loaded` -> `loading_more`: al solicitar mas resultados.
- `loading`/`loading_more` -> `error`: si no se pueden cargar productos.
- `loaded` -> `empty`: si no hay productos o no hay coincidencias.
