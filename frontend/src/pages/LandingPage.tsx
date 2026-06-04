import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { getProducts } from "../api/products"
import type { Product } from "../api/types"
import { PublicProductCard } from "../components/PublicProductCard"

export function LandingPage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        const result = await getProducts({ page: 1 })
        setFeatured(result.results.slice(0, 4))
      } catch {
        setFeatured([])
      } finally {
        setLoadingFeatured(false)
      }
    }

    void loadFeatured()
  }, [])

  return (
    <main className="public-page">
      <section className="public-hero">
        <div className="public-container public-hero-grid">
          <div>
            <span className="public-kicker">Especialistas en lavado</span>
            <h1>
              Repuestos de calidad para tu <span>lavadora</span>
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
          <p>{loadingFeatured ? "Cargando productos recomendados." : `Mostrando ${featured.length} productos recomendados.`}</p>
        </div>
        {featured.length > 0 ? (
          <div className="public-product-grid">
            {featured.map((product) => (
              <PublicProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : !loadingFeatured ? (
          <article className="public-empty">
            <h3>Catalogo en preparacion</h3>
            <p>Pronto publicaremos los repuestos disponibles.</p>
          </article>
        ) : null}
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
          src="https://repuestoslavadora.store/media/img/iam.png"
          alt="Soporte tecnico"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  )
}
