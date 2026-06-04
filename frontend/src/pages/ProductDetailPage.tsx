import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { HttpError } from "../api/client"
import { getProduct } from "../api/products"
import type { Product } from "../api/types"
import { createWhatsAppUrl } from "../data/publicContact"

const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Cpath d='M150 329h340l-82-101-58 70-44-54-156 185z' fill='%23c9d4e5'/%3E%3Ccircle cx='234' cy='171' r='45' fill='%23d8e1ee'/%3E%3C/svg%3E"

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      if (!Number.isFinite(productId)) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")
      setNotFound(false)
      setSelectedImage(null)

      try {
        const result = await getProduct(productId)
        if (!result.is_active) {
          setProduct(null)
          setNotFound(true)
          return
        }
        setProduct(result)
      } catch (err) {
        if (err instanceof HttpError && err.payload.code === "not_found") {
          setNotFound(true)
        } else if (err instanceof HttpError) {
          setError(err.payload.detail)
        } else {
          setError("No se pudo cargar el producto.")
        }
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [productId])

  const gallery = useMemo(() => {
    if (!product) return []
    const images = product.images.map((item) => item.image_url).filter(Boolean)
    if (product.representative_image_url && !images.includes(product.representative_image_url)) {
      return [product.representative_image_url, ...images]
    }
    return images
  }, [product])

  if (loading) {
    return (
      <main className="public-page public-container">
        <section className="public-empty">
          <h3>Cargando producto</h3>
          <p>Estamos preparando la informacion del repuesto.</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="public-page public-container">
        <section className="public-empty">
          <h3>No se pudo cargar el producto</h3>
          <p>{error}</p>
          <Link to="/catalog">Volver al catalogo</Link>
        </section>
      </main>
    )
  }

  if (notFound || !product) {
    return (
      <main className="public-page public-container">
        <section className="public-empty">
          <h3>Producto no encontrado</h3>
          <p>No existe un producto publico con ese identificador.</p>
          <Link to="/catalog">Volver al catalogo</Link>
        </section>
      </main>
    )
  }

  const activeImage = selectedImage ?? gallery[0] ?? FALLBACK_PRODUCT_IMAGE
  const message = `Hola, me interesa el producto: ${product.name} con ID: ${product.id}`
  const whatsapp = createWhatsAppUrl(message)

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
          {gallery.length > 1 ? (
            <div className="public-gallery-strip">
              {gallery.map((item) => (
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
          <p className="public-kicker">Repuesto disponible</p>
          <h1>{product.name}</h1>
          <p className="public-detail-ref">Consulta disponibilidad y compatibilidad antes de comprar.</p>
          <p className="public-detail-copy">{product.description || "Contactanos para mas informacion sobre este repuesto."}</p>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="public-detail-cta">
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}
