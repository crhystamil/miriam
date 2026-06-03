# Research - Gestion de productos con modal e imagenes

## Decision 1: Eliminacion logica como regla unica de "eliminar"
- Decision: La accion "Eliminar" en tabla desactiva el producto (`is_active=false`) en lugar de borrarlo fisicamente.
- Rationale: Preserva trazabilidad historica y evita inconsistencias en ventas/reportes asociados.
- Alternatives considered:
  - Borrado fisico solo sin movimientos: agrega bifurcacion operativa y reglas condicionales complejas.
  - Borrado fisico siempre: alto riesgo de perdida de historial.

## Decision 2: Minimo una imagen por producto en alta y edicion
- Decision: El guardado del producto requiere al menos una imagen asociada.
- Rationale: Refuerza identificacion visual y reduce errores de seleccion en catalogo.
- Alternatives considered:
  - Imagen opcional: mas flexible, pero reduce calidad operativa del catalogo.
  - Exigir exactamente una imagen: limita casos reales donde se requieren varias vistas.

## Decision 3: Soporte de imagenes multiples por relacion 1:N
- Decision: Modelar imagenes en entidad relacionada al producto para permitir una o mas imagenes.
- Rationale: Escala mejor para edicion incremental (agregar/quitar/reordenar) y mantiene datos normalizados.
- Alternatives considered:
  - Campo unico con lista serializada: menor complejidad inicial, peor mantenibilidad y validacion.
  - Imagen unica en producto: no cubre requisito funcional.

## Decision 4: Modal de alta en misma vista y refresco local de tabla
- Decision: Crear producto desde modal superpuesto en la vista de productos y actualizar tabla al confirmar.
- Rationale: Disminuye friccion de navegacion y mantiene contexto del usuario.
- Alternatives considered:
  - Formulario embebido fijo: ocupa espacio permanente y compite con la tabla.
  - Pantalla separada de alta: mayor friccion para flujo operativo diario.

## Decision 5: Edicion y desactivacion por fila en tabla
- Decision: Cada fila tendra acciones directas de editar y eliminar (desactivar con confirmacion).
- Rationale: Centraliza mantenimiento del catalogo en un unico punto de trabajo.
- Alternatives considered:
  - Acciones globales fuera de tabla: menos descubribles para el usuario.
  - Edicion solo en detalle separado: mas pasos y menor eficiencia.
