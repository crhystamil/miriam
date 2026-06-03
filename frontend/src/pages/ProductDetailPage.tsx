import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { PublicProductCard } from "../components/PublicProductCard"
import { publicProducts } from "../data/publicCatalog"

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const product = publicProducts.find((item) => item.id === productId)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!product) {
    return (
      <main className="public-page public-container">
        <section className="public-empty">
          <h3>Producto no encontrado</h3>
          <p>No existe un producto con ese identificador.</p>
          <Link to="/catalog">Volver al catalogo</Link>
        </section>
      </main>
    )
  }

  const related = publicProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3)
  const activeImage = useMemo(() => selectedImage ?? product.image, [product.image, selectedImage])

  return (
    <main className="public-page public-container">
      <section className="public-breadcrumb">
        <Link to="/catalog">Catalogo</Link>
        <span>/</span>
        <span>Detalle</span>
      </section>

      <section className="public-detail-card">
        <div className="public-detail-media">
          <img src={activeImage} alt={product.name} referrerPolicy="no-referrer" />
          {product.gallery.length > 1 ? (
            <div className="public-gallery-strip">
              {product.gallery.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={activeImage === item ? "active" : ""}
                  onClick={() => setSelectedImage(item)}
                >
                  <img src={item} alt={product.name} referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="public-kicker">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="public-detail-ref">Categoria: {product.category}</p>
          <p className="public-detail-copy">{product.description}</p>
          <div className="public-tags">
            {product.compatibility.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer" className="public-detail-cta">
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="public-related">
          <div className="public-section-top">
            <h2>Productos relacionados</h2>
            <Link to="/catalog">Ver todo</Link>
          </div>
          <div className="public-product-grid">
            {related.map((item) => (
              <PublicProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
