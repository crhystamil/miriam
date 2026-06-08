import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { HttpError } from "../api/client"
import { getProduct } from "../api/products"
import type { Product } from "../api/types"
import { Lightbox } from "../components/Lightbox"
import { createWhatsAppUrl } from "../data/publicContact"

const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Cpath d='M150 329h340l-82-101-58 70-44-54-156 185z' fill='%23c9d4e5'/%3E%3Ccircle cx='234' cy='171' r='45' fill='%23d8e1ee'/%3E%3C/svg%3E"

export type GalleryImage = {
  key: string
  thumbnail: string
  large: string
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
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
      setSelectedImageKey(null)
      setIsLightboxOpen(false)

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

  const gallery = useMemo<GalleryImage[]>(() => {
    if (!product) return []
    const items: GalleryImage[] = product.images
      .filter((item) => item.image_url)
      .map((item) => ({
        key: `img-${item.id}`,
        thumbnail: item.thumbnail_url || item.medium_url || item.image_url,
        large: item.large_url || item.medium_url || item.image_url,
      }))
    if (product.representative_image_url) {
      const hasRepresentative = product.images.some(
        (item) => item.image_url === product.representative_image_url
      )
      if (!hasRepresentative) {
        items.unshift({
          key: "representative",
          thumbnail: product.representative_thumbnail_url || product.representative_image_url,
          large: product.representative_image_url,
        })
      }
    }
    return items
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

  const activeImage = gallery.find((item) => item.key === selectedImageKey) ?? gallery[0]
  const activeSrc = activeImage?.large ?? FALLBACK_PRODUCT_IMAGE
  const activeIndex = activeImage ? Math.max(0, gallery.indexOf(activeImage)) : 0
  const canOpenLightbox = gallery.length > 0
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
          {canOpenLightbox ? (
            <button
              type="button"
              className="public-detail-media-button"
              aria-label={`Ampliar imagen de ${product.name}`}
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={activeSrc}
                alt={product.name}
                loading="lazy"
                width={800}
                height={800}
                referrerPolicy="no-referrer"
              />
            </button>
          ) : (
            <img
              src={activeSrc}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              referrerPolicy="no-referrer"
            />
          )}
          {gallery.length > 1 ? (
            <div className="public-gallery-strip">
              {gallery.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={activeImage?.key === item.key ? "active" : ""}
                  onClick={() => setSelectedImageKey(item.key)}
                >
                  <img
                    src={item.thumbnail}
                    alt={product.name}
                    loading="lazy"
                    width={120}
                    height={120}
                    referrerPolicy="no-referrer"
                  />
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

      {isLightboxOpen && canOpenLightbox ? (
        <Lightbox
          images={gallery}
          startIndex={activeIndex}
          alt={product.name}
          onClose={() => setIsLightboxOpen(false)}
        />
      ) : null}
    </main>
  )
}
