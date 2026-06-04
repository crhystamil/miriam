import { Link, NavLink, Outlet } from "react-router-dom"

import { createWhatsAppUrl, publicContact } from "../data/publicContact"

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/catalog", label: "Catalogo" },
  { to: "/services", label: "Servicios" },
  { to: "/contact", label: "Contacto" }
]

export function PublicLayout() {
  return (
    <div className="public-root">
      <header className="public-nav-wrap">
        <nav className="public-nav">
          <NavLink to="/" className="public-brand">
            <span className="public-brand-mark">iAM</span>
            <span>
              IAM repuestos
            </span>
          </NavLink>

          <div className="public-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <a className="public-cta" href={createWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp directo
          </a>
        </nav>
      </header>

      <Outlet />

      <footer className="public-footer">
        <div className="public-container public-footer-grid">
          <section>
            <h3>IAM</h3>
            <p>Repuestos y servicio tecnico especializado para lavadoras de todas las marcas.</p>
          </section>
          <section>
            <h4>Navegacion</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalog">Catalogo</Link></li>
              <li><Link to="/services">Servicios</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </section>
          <section>
            <h4>Contacto</h4>
            <p>{publicContact.address}</p>
            <p>{publicContact.whatsappDisplay}</p>
          </section>
        </div>
      </footer>
    </div>
  )
}
