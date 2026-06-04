import { useEffect, useState } from "react"
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadAllProducts(searchTerm: string) {
    const allProducts: Product[] = []
    let nextPage: number | null = 1

    while (nextPage !== null) {
      const result = await getProducts({
        page: nextPage,
        search: searchTerm.trim() || undefined,
        is_active: "true"
      })

      allProducts.push(...result.results)
      nextPage = result.next ? nextPage + 1 : null
    }

    return allProducts
  }

  useEffect(() => {
    let active = true
    const timeoutId = window.setTimeout(() => {
      void loadProducts(query, () => active)
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [query])

  async function loadProducts(searchTerm: string, shouldApply: () => boolean) {
    setLoading(true)
    setError("")
    try {
      const result = await loadAllProducts(searchTerm)
      if (shouldApply()) {
        setProducts(result)
      }
    } catch (err) {
      if (shouldApply()) {
        if (err instanceof HttpError) {
          setError(err.payload.detail)
        } else {
          setError("No se pudo cargar la vista mayorista.")
        }
      }
    } finally {
      if (shouldApply()) {
        setLoading(false)
      }
    }
  }

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
        </article>
      ) : null}

      {loading ? (
        <article className="public-empty">
          <h3>Cargando productos</h3>
          <p>Preparando informacion mayorista disponible.</p>
        </article>
      ) : null}

      {!loading && !error && products.length === 0 ? (
        <article className="public-empty">
          <h3>{query.trim() ? "Sin resultados" : "Sin productos disponibles"}</h3>
          <p>{query.trim() ? "Prueba buscando por otro ID o nombre." : "No hay productos activos para mostrar."}</p>
        </article>
      ) : null}

      {products.length > 0 ? (
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
                      <img className="wholesaler-product-image" src={product.representative_image_url} alt={product.name} />
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
      ) : null}
    </main>
  )
}
