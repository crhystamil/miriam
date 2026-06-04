import { Link } from "react-router-dom"

import type { Product } from "../api/types"
import { createWhatsAppUrl } from "../data/publicContact"

const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Cpath d='M150 329h340l-82-101-58 70-44-54-156 185z' fill='%23c9d4e5'/%3E%3Ccircle cx='234' cy='171' r='45' fill='%23d8e1ee'/%3E%3C/svg%3E"

type Props = {
  product: Product
}

export function PublicProductCard({ product }: Props) {
  const imageUrl = product.representative_image_url || product.images[0]?.image_url || FALLBACK_PRODUCT_IMAGE
  const message = `Hola, me interesa el producto: ${product.name} imagen: ${imageUrl}`
  const whatsapp = createWhatsAppUrl(message)

  return (
    <article className="public-product-card">
      <img src={imageUrl} alt={product.name} referrerPolicy="no-referrer" />
      <p>{ "Repuesto disponible"}</p>
      <h3>{product.name}</h3>
      <div className="public-product-actions">
        <Link to={`/product/${product.id}`}>Detalles</Link>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </article>
  )
}
