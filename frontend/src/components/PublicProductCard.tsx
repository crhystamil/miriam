import { Link } from "react-router-dom"

import type { PublicProduct } from "../data/publicCatalog"

type Props = {
  product: PublicProduct
}

export function PublicProductCard({ product }: Props) {
  const message = `Hola, me interesa el producto: ${product.name} (${product.brand})`
  const whatsapp = `https://wa.me/59170000000?text=${encodeURIComponent(message)}`

  return (
    <article className="public-product-card">
      <img src={product.image} alt={product.name} referrerPolicy="no-referrer" />
      <p>{product.brand}</p>
      <h3>{product.name}</h3>
      <div className="public-product-actions">
        <Link to={`/product/${product.id}`}>Detalles</Link>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </article>
  )
}
