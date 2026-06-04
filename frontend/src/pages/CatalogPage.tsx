import { useEffect, useState } from "react"

import { HttpError } from "../api/client"
import { getProducts } from "../api/products"
import type { Product } from "../api/types"
import { PublicProductCard } from "../components/PublicProductCard"

export function CatalogPage() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")

  async function loadProducts(nextPage: number, searchTerm: string) {
    const isFirstPage = nextPage === 1
    if (isFirstPage) {
      setLoading(true)
      setProducts([])
    } else {
      setLoadingMore(true)
    }
    setError("")

    try {
      const result = await getProducts({ page: nextPage, search: searchTerm.trim() || undefined })
      setProducts((current) => (isFirstPage ? result.results : [...current, ...result.results]))
      setHasMore(Boolean(result.next))
      setPage(nextPage)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar el catalogo.")
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProducts(1, query)
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [query])

  const hasSearch = query.trim().length > 0
  const showEmpty = !loading && !error && products.length === 0

  return (
    <main className="public-page public-container">
      <section className="public-section-head">
        <span className="public-kicker">Nuestra coleccion</span>
        <h1>Catalogo completo</h1>
        <p>Busca repuestos por nombre de producto.</p>
      </section>

      <div className="public-search">
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar repuesto..." />
      </div>

      {error ? (
        <article className="public-empty">
          <h3>No se pudo cargar el catalogo</h3>
          <p>{error}</p>
          <button type="button" className="secondary" onClick={() => void loadProducts(1, query)}>
            Reintentar
          </button>
        </article>
      ) : null}

      {loading ? (
        <article className="public-empty">
          <h3>Cargando catalogo</h3>
          <p>Estamos preparando los productos disponibles.</p>
        </article>
      ) : null}

      {showEmpty ? (
        <article className="public-empty">
          <h3>{hasSearch ? "Sin resultados" : "Sin productos disponibles"}</h3>
          <p>
            {hasSearch
              ? "Prueba otro termino de busqueda para encontrar repuestos."
              : "Vuelve pronto para ver los repuestos disponibles."}
          </p>
          {hasSearch ? (
            <button type="button" className="secondary" onClick={() => setQuery("")}>Limpiar busqueda</button>
          ) : null}
        </article>
      ) : null}

      {products.length > 0 ? (
        <>
          <section className="public-product-grid">
            {products.map((product) => (
              <PublicProductCard key={product.id} product={product} />
            ))}
          </section>

          {hasMore ? (
            <div className="public-actions" style={{ justifyContent: "center", marginTop: "2rem" }}>
              <button type="button" onClick={() => void loadProducts(page + 1, query)} disabled={loadingMore}>
                {loadingMore ? "Cargando..." : "Cargar mas"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  )
}
