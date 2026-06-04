# Feature Specification: Actualizar contacto y WhatsApp

**Feature Branch**: `main`  
**Created**: 2026-06-03  
**Status**: Draft  
**Input**: User description: "cambiemos los datos de contacto de la pagina, whatsapp +59161617345 la direccion principal es \"Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia\" la pagina de facebook es \"https://www.facebook.com/repuestoslavadora/\" el iframe de google de la ubicacion es \"<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.85271047267537!2d-66.15593620933417!3d-17.35364875213766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e3758e3845a5ab%3A0xb15ddbc7a855c4d9!2stemporal!5e0!3m2!1ses!2sbo!4v1780544963465!5m2!1ses!2sbo\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>\" cuando un usuario escribe el formulario de contacto este al hacer click en el boton se debe enviar un mensaje a whatsapp con la informacion llenada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver datos de contacto actualizados (Priority: P1)

Un visitante entra a la pagina de contacto y ve los datos actuales del negocio: numero de WhatsApp, direccion principal, enlace de Facebook y mapa de ubicacion.

**Why this priority**: Es la informacion minima necesaria para que un cliente pueda comunicarse o visitar la tienda sin usar datos antiguos o incorrectos.

**Independent Test**: Se puede probar entrando a la pagina de contacto y verificando visualmente que el telefono, direccion, Facebook y mapa coincidan con los datos provistos.

**Acceptance Scenarios**:

1. **Given** que un visitante abre la pagina de contacto, **When** revisa el numero de WhatsApp, **Then** ve `+59161617345`.
2. **Given** que un visitante abre la pagina de contacto, **When** revisa la direccion principal, **Then** ve `Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia`.
3. **Given** que un visitante busca redes sociales, **When** usa el enlace de Facebook, **Then** accede a `https://www.facebook.com/repuestoslavadora/`.
4. **Given** que un visitante revisa la ubicacion, **When** ve el mapa, **Then** se muestra la ubicacion indicada por el mapa de Google provisto.

---

### User Story 2 - Enviar formulario de contacto por WhatsApp (Priority: P2)

Un visitante llena el formulario de contacto y, al presionar el boton de envio, se abre WhatsApp con un mensaje prellenado que incluye la informacion capturada.

**Why this priority**: Convierte el formulario en una consulta directa y accionable para el negocio, evitando formularios que no llegan a ningun canal de atencion.

**Independent Test**: Se puede llenar el formulario con datos de prueba, presionar el boton y verificar que se abre WhatsApp dirigido al numero correcto con el mensaje prellenado.

**Acceptance Scenarios**:

1. **Given** que un visitante llena los campos del formulario, **When** presiona el boton de contacto, **Then** se abre WhatsApp dirigido a `+59161617345`.
2. **Given** que el visitante escribio nombre, telefono, mensaje u otros campos disponibles, **When** se abre WhatsApp, **Then** el mensaje prellenado incluye esa informacion de forma legible.
3. **Given** que el visitante no lleno campos obligatorios del formulario, **When** intenta enviar, **Then** se le indica que complete la informacion requerida antes de abrir WhatsApp.

---

### User Story 3 - Usar accesos de contacto desde otras partes publicas (Priority: P3)

Un visitante que encuentra botones o enlaces de WhatsApp en otras paginas publicas usa el mismo numero actualizado para consultar productos o servicios.

**Why this priority**: Mantiene consistencia del canal de contacto en toda la experiencia publica, aunque la pagina de contacto es el punto principal.

**Independent Test**: Se puede revisar los enlaces publicos de WhatsApp fuera de la pagina de contacto y confirmar que apuntan al mismo numero actualizado.

**Acceptance Scenarios**:

1. **Given** que un visitante usa un enlace publico de WhatsApp relacionado con productos o servicios, **When** se abre WhatsApp, **Then** el destino usa el numero `+59161617345`.

### Edge Cases

- Si el navegador bloquea ventanas nuevas, el enlace de WhatsApp debe seguir siendo accesible mediante una accion directa del usuario.
- Si el visitante usa caracteres especiales o saltos de linea en el mensaje, la informacion debe conservarse de forma legible en WhatsApp.
- Si el mapa de Google no carga, la direccion textual debe seguir visible.
- Si el visitante no tiene WhatsApp instalado, el enlace debe abrir una experiencia web o mostrar un destino compatible de WhatsApp.
- Si hay enlaces antiguos de WhatsApp en otras paginas publicas, deben actualizarse para evitar inconsistencias.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The public contact information MUST display WhatsApp number `+59161617345`.
- **FR-002**: The public contact information MUST display the main address as `Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia`.
- **FR-003**: The public contact information MUST include a Facebook link to `https://www.facebook.com/repuestoslavadora/`.
- **FR-004**: The contact page MUST display the Google Maps location provided by the user.
- **FR-005**: The contact form submit action MUST open WhatsApp addressed to `+59161617345`.
- **FR-006**: The WhatsApp message generated from the contact form MUST include all user-provided form information in a readable format.
- **FR-007**: The contact form MUST prevent submission when required fields are missing and MUST provide a clear prompt to complete them.
- **FR-008**: Existing public WhatsApp contact links SHOULD use the updated WhatsApp number for consistency.
- **FR-009**: The contact page MUST keep the address visible even if the embedded map fails to load.
- **FR-010**: The update MUST NOT require backend storage or email delivery for contact form submissions.

### Key Entities *(include if feature involves data)*

- **Contact Information**: Public business contact data including WhatsApp, address, Facebook URL, and map location.
- **Contact Form Submission**: Visitor-provided contact details and message that are transformed into a WhatsApp message.
- **WhatsApp Message**: Pre-filled message addressed to the business WhatsApp number.
- **Map Location**: Embedded Google Maps location representing the principal address.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visible public contact entries show the updated WhatsApp number, address, and Facebook URL.
- **SC-002**: A visitor can open WhatsApp from a completed contact form in under 10 seconds.
- **SC-003**: 100% of completed contact form submissions include the entered information in the generated WhatsApp message.
- **SC-004**: Required-field validation prevents empty contact submissions before WhatsApp opens.
- **SC-005**: The contact page remains useful when the map cannot load because the textual address is still visible.

## Assumptions

- The contact form sends information by opening WhatsApp rather than saving data in the backend.
- WhatsApp links should use the international number format without the plus sign in the link target while displaying the plus sign to users.
- The provided Google Maps embed is trusted as the desired location source.
- Existing public WhatsApp links outside the contact page should be updated when they are part of the public customer journey.
