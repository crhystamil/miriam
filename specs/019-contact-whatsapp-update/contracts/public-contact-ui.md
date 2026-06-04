# Contract: UI publica de contacto

## Contact Page

### Required Contact Data

| Field | Expected Value |
|-------|----------------|
| WhatsApp | `+59161617345` |
| Address | `Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia` |
| Facebook | `https://www.facebook.com/repuestoslavadora/` |
| Map | Google Maps embed URL provided in the feature spec |

### Contact Form Behavior

- The form includes visitor contact fields and message fields.
- The submit button does not send data to backend storage.
- If required fields are missing, the page shows a clear validation prompt.
- If required fields are present, the submit action opens WhatsApp for `59161617345`.
- The generated WhatsApp text includes all user-provided form values in a readable format.

### WhatsApp Message Format

Recommended readable structure:

```text
Hola, quiero realizar una consulta desde la pagina web.

Nombre: [nombre]
Email: [email]
Asunto: [asunto]
Mensaje: [mensaje]
```

Fields that are optional and empty may be omitted.

## Public WhatsApp Links

### Required Behavior

- Public layout direct WhatsApp CTA points to `https://wa.me/59161617345`.
- Product card WhatsApp links point to `https://wa.me/59161617345` with product-specific text.
- Product detail WhatsApp links point to `https://wa.me/59161617345` with product-specific text.
- Visible footer/contact phone displays `+59161617345`.

## Map Embed

### Required Behavior

- Contact page displays an embedded map using the provided Google Maps URL.
- Contact page also displays the textual address outside the iframe.
- The iframe has an accessible title and lazy loading.
