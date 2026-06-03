import { Link } from "react-router-dom"

import { publicServices } from "../data/publicCatalog"

export function ServicesPage() {
  return (
    <main className="public-page">
      <section className="public-section-head public-container">
        <span className="public-kicker">Excelencia tecnica</span>
        <h1>Servicios especializados</h1>
        <p>Atendemos instalacion, mantenimiento y reparacion para tu equipo.</p>
      </section>

      <section className="public-container public-service-grid">
        {publicServices.map((service) => (
          <article key={service.id} className="public-service-card">
            <div className="public-service-icon">S</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>Respuesta 24h</span>
          </article>
        ))}
      </section>

      <section className="public-container public-banner">
        <h2>Reserva tu visita hoy</h2>
        <p>Agenda una revision tecnica para diagnosticar y resolver cualquier falla de forma segura.</p>
        <Link to="/contact">Contactar ahora</Link>
      </section>

      <section className="public-container public-service-notes">
        <article>
          <h4>Respuesta 24h</h4>
          <p>Atencion prioritaria para emergencias y equipos en uso diario.</p>
        </article>
        <article>
          <h4>Garantia de servicio</h4>
          <p>Respaldamos cada reparacion con seguimiento post servicio.</p>
        </article>
      </section>
    </main>
  )
}
