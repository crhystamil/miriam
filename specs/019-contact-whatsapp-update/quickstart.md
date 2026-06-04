# Quickstart: Actualizar contacto y WhatsApp

## 1. Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

## 2. Validar pagina de contacto

Abrir:

```text
http://localhost:5173/contact
```

Comprobar:

- Se muestra WhatsApp `+59161617345`.
- Se muestra la direccion `Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia`.
- El enlace de Facebook abre `https://www.facebook.com/repuestoslavadora/`.
- El mapa de Google se muestra con la ubicacion provista.
- La direccion textual permanece visible aunque el mapa no cargue.

## 3. Validar formulario a WhatsApp

En la pagina de contacto:

1. Llenar nombre, email, asunto y mensaje.
2. Hacer click en el boton de envio.
3. Verificar que se abre WhatsApp para `59161617345`.
4. Verificar que el texto incluye los campos llenados.

Validar tambien:

- Intentar enviar con campos requeridos vacios muestra validacion.
- El formulario no intenta enviar datos a un backend.

## 4. Validar enlaces publicos de WhatsApp

Revisar:

- CTA de WhatsApp en layout publico.
- Footer/contacto del layout publico.
- Botones WhatsApp en tarjetas de producto.
- Boton WhatsApp en detalle de producto.

Todos deben usar `59161617345` como destino.

## 5. Ejecutar verificaciones

```bash
cd frontend
npm run build
```

## Validation Notes

- 2026-06-04: `npm run build` passed in `frontend/`.
- 2026-06-04: Static scan found no remaining old public WhatsApp numbers under `frontend/src`.
- 2026-06-04: Contact data, form behavior, Facebook URL, and map iframe were reviewed against this quickstart in source.
