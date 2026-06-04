import { FormEvent, useState } from "react"

import { createWhatsAppUrl, publicContact } from "../data/publicContact"

const initialForm = {
  name: "",
  subject: "Consulta de repuesto",
  message: ""
}

export function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [validationMessage, setValidationMessage] = useState("")

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    if (validationMessage) {
      setValidationMessage("")
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.message.trim()) {
      setValidationMessage("Completa tu nombre y mensaje para abrir WhatsApp.")
      return
    }

    const message = [
      "Hola, quiero realizar una consulta desde la pagina web.",
      "",
      `Nombre: ${form.name.trim()}`,
      `Asunto: ${form.subject}`,
      `Mensaje: ${form.message.trim()}`
    ]
      .filter(Boolean)
      .join("\n")

    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer")
  }

  return (
    <main className="public-page public-container">
      <section className="public-contact-grid">
        <div>
          <span className="public-kicker">Estamos para ayudarte</span>
          <h1>Contacto</h1>
          <p className="page-subtle">Te ayudamos a elegir repuestos y coordinar visitas tecnicas.</p>

          <div className="public-contact-list">
            <article>
              <h3>Sucursal principal</h3>
              <p>{publicContact.address}</p>
            </article>
            <article>
              <h3>Telefonos</h3>
              <p><a target="_blank" href={publicContact.whatsapplink}>{publicContact.whatsappDisplay} (Ventas)</a></p>
            </article>
            <article>
              <h3>Horario</h3>
              <p>Lunes a viernes: 09:00 - 18:30</p>
              <p>Sabado: 09:00 - 14:00</p>
            </article>
          </div>
        </div>

        <form className="public-contact-form" onSubmit={handleSubmit} noValidate>
          <h2>Mensaje directo</h2>
          <label>
            <span>Nombre</span>
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              aria-invalid={validationMessage ? !form.name.trim() : undefined}
              required
            />
          </label>
                <label>
            <span>Asunto</span>
            <select value={form.subject} onChange={(event) => updateField("subject", event.target.value)}>
              <option>Consulta de repuesto</option>
              <option>Servicio tecnico</option>
              <option>Otro</option>
            </select>
          </label>
          <label>
            <span>Mensaje</span>
            <textarea
              rows={5}
              placeholder="Escribe tu consulta"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              aria-invalid={validationMessage ? !form.message.trim() : undefined}
              required
            />
          </label>
          {validationMessage ? (
            <p className="public-contact-error" role="alert">
              {validationMessage}
            </p>
          ) : null}
          <button type="submit">Enviar por WhatsApp</button>
        </form>
      </section>

      <section className="public-social-row">
        <a href={publicContact.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://repuestoslavadora.store/">Pagina Web</a>
      </section>

      <section className="public-map">
        <iframe
          src={publicContact.mapEmbedSrc}
          title="Ubicacion de IAM repuestos en Cochabamba"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  )
}
