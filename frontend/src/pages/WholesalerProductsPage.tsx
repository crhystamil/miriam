import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { HttpError } from "../api/client"
import { getProducts } from "../api/products"
import type { Product } from "../api/types"
import { useWholesalerAccess } from "../state/wholesalerAccess"

function formatMoney(value: string) {
  return `Bs. ${value}`
}

export function WholesalerProductsPage() {
  const { clearAccess } = useWholesalerAccess()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const requestId = useRef(0)

  async function loadProducts(nextPage: number, searchTerm: string) {
    const current = ++requestId.current
    const isFirstPage = nextPage === 1
    if (isFirstPage) {
      setLoading(true)
      setProducts([])
    } else {
      setLoadingMore(true)
    }
    setError("")

    try {
      const result = await getProducts({
        page: nextPage,
        search: searchTerm.trim() || undefined,
        is_active: "true",
      })
      if (current !== requestId.current) return
      setProducts((previous) =>
        isFirstPage ? result.results : [...previous, ...result.results]
      )
      setHasMore(Boolean(result.next))
      setPage(nextPage)
    } catch (err) {
      if (current !== requestId.current) return
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar la vista mayorista.")
      }
    } finally {
      if (current === requestId.current) {
        setLoading(false)
        setLoadingMore(false)
      }
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
    <main className="public-page public-container wholesaler-products-page">
      <section className="public-section-head wholesaler-products-head">
        <div>
          <span className="public-kicker">Lista mayorista</span>
          <h1>Productos disponibles para mayoristas</h1>
          <p>Consulta precios de referencia y abre el detalle de cada repuesto.</p>
        </div>
        <button type="button" className="secondary" onClick={clearAccess}>
          Cerrar acceso mayorista
        </button>
      </section>

      <div className="public-search wholesaler-search">
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID o nombre..." />
      </div>

      {error ? (
        <article className="public-empty">
          <h3>No se pudo cargar la lista</h3>
          <p>{error}</p>
          <button type="button" className="secondary" onClick={() => void loadProducts(1, query)}>
            Reintentar
          </button>
        </article>
      ) : null}

      {loading ? (
        <article className="public-empty">
          <h3>Cargando productos</h3>
          <p>Preparando informacion mayorista disponible.</p>
        </article>
      ) : null}

      {showEmpty ? (
        <article className="public-empty">
          <h3>{hasSearch ? "Sin resultados" : "Sin productos disponibles"}</h3>
          <p>{hasSearch ? "Prueba buscando por otro ID o nombre." : "No hay productos activos para mostrar."}</p>
          {hasSearch ? (
            <button type="button" className="secondary" onClick={() => setQuery("")}>Limpiar busqueda</button>
          ) : null}
        </article>
      ) : null}

      {products.length > 0 ? (
        <>
          <div className="wholesaler-table-wrap">
            <table className="wholesaler-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Imagen</th>
                  <th>Precio mayorista</th>
                  <th>Precio venta</th>
                  <th>Enlace</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      {product.representative_image_url ? (
                        <img
                          className="wholesaler-product-image"
                          src={product.representative_thumbnail_url || product.representative_image_url}
                          alt={product.name}
                          loading="lazy"
                          width={72}
                          height={72}
                        />
                      ) : (
                        <span className="wholesaler-image-empty">Sin imagen</span>
                      )}
                    </td>
                    <td>{product.wholesale_reference_price ? formatMoney(product.wholesale_reference_price) : "No disponible"}</td>
                    <td>{product.public_price ? formatMoney(product.public_price) : "No disponible"}</td>
                    <td>
                      <Link to={`/product/${product.id}`}>Ver producto</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
