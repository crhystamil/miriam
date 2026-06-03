import { useMemo, useState } from "react"

import { PublicProductCard } from "../components/PublicProductCard"
import { publicProducts } from "../data/publicCatalog"

export function CatalogPage() {
  const [query, setQuery] = useState("")
  const products = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    if (!normalized) return publicProducts
    return publicProducts.filter((product) => {
      return product.name.toLowerCase().includes(normalized) || product.brand.toLowerCase().includes(normalized)
    })
  }, [query])

  return (
    <main className="public-page public-container">
      <section className="public-section-head">
        <span className="public-kicker">Nuestra coleccion</span>
        <h1>Catalogo completo</h1>
        <p>Busca repuestos por marca o nombre de producto.</p>
      </section>

      <div className="public-search">
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar repuesto..." />
      </div>

      <section className="public-product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))
        ) : (
          <article className="public-empty">
            <h3>Sin resultados</h3>
            <p>Prueba otro termino de busqueda para encontrar repuestos.</p>
            <button type="button" className="secondary" onClick={() => setQuery("")}>Limpiar busqueda</button>
          </article>
        )}
      </section>
    </main>
  )
}
