export function ContactPage() {
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
              <p>Av. Principal #123, Zona comercial</p>
            </article>
            <article>
              <h3>Telefonos</h3>
              <p>+591 70000000 (Ventas)</p>
              <p>+591 71111111 (Soporte)</p>
            </article>
            <article>
              <h3>Horario</h3>
              <p>Lunes a viernes: 09:00 - 18:30</p>
              <p>Sabado: 10:00 - 14:00</p>
            </article>
          </div>
        </div>

        <form className="public-contact-form">
          <h2>Mensaje directo</h2>
          <label>
            <span>Nombre</span>
            <input type="text" placeholder="Nombre completo" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" placeholder="correo@ejemplo.com" />
          </label>
          <label>
            <span>Asunto</span>
            <select>
              <option>Consulta de repuesto</option>
              <option>Servicio tecnico</option>
              <option>Otro</option>
            </select>
          </label>
          <label>
            <span>Mensaje</span>
            <textarea rows={5} placeholder="Escribe tu consulta" />
          </label>
          <button type="button">Enviar formulario</button>
        </form>
      </section>

      <section className="public-social-row">
        <a href="#">Facebook</a>
        <a href="#">Instagram</a>
        <a href="#">Twitter</a>
      </section>

      <section className="public-map">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920"
          alt="Ubicacion de sucursal"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  )
}
