# Data Model: Actualizar contacto y WhatsApp

## Contact Information

**Purpose**: Datos publicos del negocio que aparecen en paginas y componentes publicos.

**Fields**:

- `whatsappDisplay`: `+59161617345`
- `whatsappLinkNumber`: `59161617345`
- `address`: `Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia`
- `facebookUrl`: `https://www.facebook.com/repuestoslavadora/`
- `mapEmbedSrc`: URL de Google Maps embed provista por el usuario.

**Validation Rules**:

- El numero visible conserva el prefijo `+`.
- El numero usado en enlaces de WhatsApp no usa espacios ni simbolos.
- La direccion textual permanece visible aunque el mapa no cargue.
- Facebook abre el URL provisto.

## Contact Form Submission

**Purpose**: Informacion escrita por el visitante para construir un mensaje de WhatsApp.

**Fields**:

- `name`: nombre del visitante.
- `email`: correo si el formulario lo conserva.
- `subject`: tipo de consulta.
- `message`: consulta o detalle del visitante.

**Validation Rules**:

- Los campos requeridos no pueden estar vacios.
- El mensaje generado debe incluir todos los campos provistos que tengan valor.
- Caracteres especiales y saltos de linea deben conservarse de forma legible en el mensaje final.

## WhatsApp Message

**Purpose**: Texto prellenado que WhatsApp mostrara al usuario antes de enviar.

**Fields**:

- Destino: `59161617345`.
- Texto: resumen legible con nombre, email si existe, asunto y mensaje.

**State Transition**:

- `draft`: visitante escribe formulario.
- `validated`: formulario contiene campos requeridos.
- `opened`: el navegador abre WhatsApp con texto prellenado.
- `blocked`: si faltan campos requeridos, se muestra mensaje de validacion y no se abre WhatsApp.

## Map Location

**Purpose**: Ubicacion visual de la direccion principal.

**Fields**:

- `embedSrc`: URL de Google Maps embed.
- `title`: etiqueta accesible de ubicacion.

**Validation Rules**:

- Debe usar carga diferida cuando sea posible.
- Debe tener un titulo accesible.
- No reemplaza a la direccion textual.
