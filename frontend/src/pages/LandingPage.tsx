import { Link } from "react-router-dom"

import { PublicProductCard } from "../components/PublicProductCard"
import { publicProducts } from "../data/publicCatalog"

export function LandingPage() {
  const featured = publicProducts.slice(0, 4)

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="public-container public-hero-grid">
          <div>
            <span className="public-kicker">Especialistas en lavado</span>
            <h1>
              Repuestos premium para tu <span>lavadora</span>
            </h1>
            <p>
              Soluciones confiables en repuestos originales y servicio tecnico para que tu hogar no se detenga.
            </p>
            <div className="public-actions">
              <Link to="/catalog">Ver catalogo</Link>
              <Link to="/services" className="secondary">Ver servicios</Link>
            </div>
          </div>
          <div className="public-hero-card">
            <img
              src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80"
              alt="Servicio de lavadoras"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <section className="public-container public-banner-hero">
        <h2>Repuestos originales</h2>
        <p>Calidad certificada para todas las marcas con soporte tecnico especializado.</p>
        <Link to="/catalog">Ver ofertas</Link>
      </section>

      <section className="public-container public-highlight">
        <div className="public-section-top">
          <div>
            <span className="public-kicker">Stock actualizado</span>
            <h2>Catalogo destacado</h2>
          </div>
          <p>Mostrando {featured.length} productos recomendados.</p>
        </div>
        <div className="public-product-grid">
          {featured.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="public-container public-assist">
        <div>
          <h2>Necesitas ayuda para identificar el repuesto correcto?</h2>
          <p>Envianos el modelo de la lavadora y te guiamos con una recomendacion precisa.</p>
        </div>
        <Link to="/contact">Hablar con un tecnico</Link>
      </section>

      <section className="public-container public-store-block">
        <div>
          <h2>No sabes que repuesto necesitas?</h2>
          <p>
            Envia una foto del modelo y del problema. Te ayudamos a elegir la pieza exacta para tu lavadora.
          </p>
          <Link to="/contact">Ver sucursales</Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200"
          alt="Soporte tecnico"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  )
}
