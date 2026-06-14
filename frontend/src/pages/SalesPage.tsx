import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"

import { HttpError } from "../api/client"
import { getProducts } from "../api/products"
import { createSale, deactivateSale, deleteSale, getSales, getWholesalers } from "../api/sales"
import type { PaginatedResponse, Product, Sale, Wholesaler } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { SectionCard } from "../components/SectionCard"
import { StatusMessages } from "../components/StatusMessages"
import { useAuth } from "../state/auth"

export function SalesPage() {
  const { user } = useAuth()
  const [data, setData] = useState<PaginatedResponse<Sale> | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([])
  const [page, setPage] = useState(1)
  const [fromInput, setFromInput] = useState("")
  const [toInput, setToInput] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [productQuery, setProductQuery] = useState("")
  const [productSearch, setProductSearch] = useState("")
  const [newQuantity, setNewQuantity] = useState("1")
  const [newPrice, setNewPrice] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newWholesaler, setNewWholesaler] = useState("")
  const [wholesalerFilter, setWholesalerFilter] = useState("")
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [submittingSale, setSubmittingSale] = useState(false)
  const [productImageLoadError, setProductImageLoadError] = useState(false)
  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === newProduct) ?? null,
    [products, newProduct]
  )
  const productPreviewImage = useMemo(() => {
    if (!selectedProduct) return ""
    if (selectedProduct.images.length === 0) return ""

    const firstByPosition = [...selectedProduct.images].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999))[0]
    return firstByPosition?.image_url ?? ""
  }, [selectedProduct])
  async function loadSales() {
    setLoading(true)
    setError("")
    try {
      const result = await getSales({
        page,
        from: from || undefined,
        to: to || undefined,
        wholesaler: wholesalerFilter ? Number(wholesalerFilter) : undefined
      })
      setData(result)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar ventas.")
      }
    } finally {
      setLoading(false)
    }
  }

  async function loadProducts(searchTerm = productSearch) {
    const productList = await getProducts({ page: 1, search: searchTerm.trim() || undefined })
    setProducts(productList.results)
    if (productList.results.length > 0 && !newProduct) {
      setNewProduct(String(productList.results[0].id))
    }
  }

  useEffect(() => {
    void loadSales()
  }, [page, from, to, wholesalerFilter])

  useEffect(() => {
    const timer = setTimeout(() => setProductSearch(productQuery), 300)
    return () => clearTimeout(timer)
  }, [productQuery])

  useEffect(() => {
    void loadProducts(productSearch)
  }, [productSearch])

  useEffect(() => {
    async function loadWholesalers() {
      const wholesalerList = await getWholesalers()
      setWholesalers(wholesalerList.results)
      if (wholesalerList.results.length > 0 && !newWholesaler) {
        setNewWholesaler(String(wholesalerList.results[0].id))
      }
    }
    void loadWholesalers()
  }, [])

  useEffect(() => {
    if (products.length === 0) {
      setNewProduct("")
      return
    }
    const exists = products.some((product) => String(product.id) === newProduct)
    if (!exists) {
      setNewProduct(String(products[0].id))
    }
  }, [products, newProduct])

  function applyFilters() {
    setPage(1)
    setFrom(fromInput)
    setTo(toInput)
  }

  function clearFilters() {
    setPage(1)
    setFromInput("")
    setToInput("")
    setFrom("")
    setTo("")
    setWholesalerFilter("")
  }

  function openSaleModal() {
    setProductImageLoadError(false)
    setIsSaleModalOpen(true)
  }

  function resetSaleDraft() {
    setProductQuery("")
    setNewQuantity("1")
    setNewPrice("")
    setNewNotes("")
    if (wholesalers.length > 0) {
      setNewWholesaler(String(wholesalers[0].id))
    } else {
      setNewWholesaler("")
    }
  }

  function closeSaleModal() {
    setIsSaleModalOpen(false)
    setProductImageLoadError(false)
    resetSaleDraft()
    if (products.length > 0) {
      setNewProduct(String(products[0].id))
    } else {
      setNewProduct("")
    }
  }

  useEffect(() => {
    setProductImageLoadError(false)
  }, [newProduct])

  async function submitCreateSale(e: FormEvent) {
    e.preventDefault()
    if (submittingSale) return
    setError("")
    setSuccess("")
    setFieldErrors([])
    if (!newProduct) {
      setError("Debe seleccionar un producto.")
      return
    }
    if (!newWholesaler) {
      setError("Debe seleccionar un mayorista existente.")
      return
    }
    if (Number(newPrice) <= 0) {
      setError("Precio de venta debe ser mayor a cero.")
      return
    }
    try {
      setSubmittingSale(true)
        await createSale({
          product: Number(newProduct),
          wholesaler: Number(newWholesaler),
          quantity: 1,
          unit_sale_price: newPrice,
          notes: newNotes
      })
      setSuccess("Venta creada correctamente.")
      setNewPrice("")
      setNewNotes("")
      await loadProducts(productSearch)
      setPage(1)
      await loadSales()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo crear la venta.")
      }
    }
    finally {
      setSubmittingSale(false)
    }
  }

  async function handleDeactivateSale(sale: Sale) {
    const ok = window.confirm(`¿Deshabilitar venta #${sale.id}?`)
    if (!ok) return

    setError("")
    setSuccess("")
    setFieldErrors([])
    try {
      await deactivateSale(sale.id)
      setSuccess("Venta deshabilitada correctamente.")
      await loadSales()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo deshabilitar la venta.")
      }
    }
  }

  async function handleDeleteSale(sale: Sale) {
    const ok = window.confirm(`¿Eliminar venta #${sale.id}? Esta accion no se puede deshacer.`)
    if (!ok) return

    setError("")
    setSuccess("")
    setFieldErrors([])
    try {
      await deleteSale(sale.id)
      setSuccess("Venta eliminada correctamente.")
      await loadSales()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo eliminar la venta.")
      }
    }
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Ventas</h1>
        <p className="page-subtle">Registra operaciones y filtra por rango de fechas.</p>
      </section>
      <StatusMessages error={error} success={success} fieldErrors={fieldErrors} />

      <SectionCard title="Nueva venta">
        {user?.role === "vendor" ? (
          <div className="sales-open-wrap">
            <button type="button" onClick={openSaleModal}>Registrar Venta</button>
          </div>
        ) : (
          <p className="page-subtle">Solo los usuarios con rol vendedor pueden registrar ventas.</p>
        )}

        {isSaleModalOpen && user?.role === "vendor" ? (
          <div className="sales-modal-overlay" role="dialog" aria-modal="true" aria-label="Registrar nueva venta">
            <section className="sales-modal-card">
              <div className="panel-head">
                <h3>Registrar venta</h3>
                <button type="button" className="secondary" onClick={closeSaleModal}>Cancelar</button>
              </div>

              <div className="sales-grid">
                <form className="sales-form" onSubmit={submitCreateSale}>
                  <label>
                    Buscar producto
                    <input
                      aria-label="Buscar producto"
                      placeholder="Buscar por SKU o nombre"
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                    />
                  </label>
                  <label>
                    Producto
                    <select aria-label="Producto de venta" value={newProduct} onChange={(e) => setNewProduct(e.target.value)}>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.sku} - {product.name}
                        </option>
                      ))}
                    </select>
                    {products.length === 0 && productQuery.trim() !== "" ? <span className="page-subtle">No se encontraron productos.</span> : null}
                    {products.length === 0 && productQuery.trim() === "" ? <span className="page-subtle">No hay productos disponibles para vender.</span> : null}
                  </label>
                  <label>
                    Mayorista
                    <select
                      aria-label="Mayorista de venta"
                      value={newWholesaler}
                      onChange={(e) => setNewWholesaler(e.target.value)}
                    >
                      {wholesalers.map((wholesaler) => (
                        <option key={wholesaler.id} value={wholesaler.id}>
                          {wholesaler.name}
                        </option>
                      ))}
                    </select>
                    {wholesalers.length === 0 ? (
                      <span className="page-subtle">No hay mayoristas. Registralo en el modulo de mayoristas.</span>
                    ) : null}
                  </label>
                  <label>
                    Precio mayorista (referencial)
                    <input value={selectedProduct?.wholesale_reference_price ?? ""} readOnly aria-label="Precio mayorista" />
                  </label>
                  <input type="hidden" value={1} />
                  <label>
                    Precio de venta
                    <input aria-label="Precio de venta" placeholder="Precio venta" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                  </label>
                  <label>
                    Nota de venta
                    <textarea
                      aria-label="Notas de venta"
                      rows={3}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Detalle adicional de la venta"
                    />
                  </label>
                    <button type="submit" disabled={submittingSale || wholesalers.length === 0 || products.length === 0}>{submittingSale ? "Enviando..." : "Registrar Venta"}</button>
                </form>

                <aside className="sales-product-detail">
                  <h3>Descripcion del producto</h3>
                  {selectedProduct ? (
                    <>
                      {productPreviewImage && !productImageLoadError ? (
                        <img
                          className="sales-product-image"
                          src={productPreviewImage}
                          alt={selectedProduct.name}
                          onError={() => setProductImageLoadError(true)}
                        />
                      ) : (
                        <div className="sales-product-image-fallback" role="status" aria-live="polite">
                          {selectedProduct.images.length === 0
                            ? "Este producto no tiene fotos cargadas."
                            : "No se pudo cargar la imagen del producto."}
                        </div>
                      )}
                      <dl>
                      <div><dt>SKU</dt><dd>{selectedProduct.sku}</dd></div>
                      <div><dt>Nombre</dt><dd>{selectedProduct.name}</dd></div>
                      <div><dt>Stock actual</dt><dd>{selectedProduct.stock}</dd></div>
                        <div><dt>Costo FIFO</dt><dd>Bs. {selectedProduct.fifo_cost_price}</dd></div>
                      <div><dt>Mayorista</dt><dd>Bs. {selectedProduct.wholesale_reference_price}</dd></div>
                      <div><dt>Publico</dt><dd>Bs. {selectedProduct.public_price}</dd></div>
                      <div><dt>Estado</dt><dd>{selectedProduct.is_active ? "Activo" : "Inactivo"}</dd></div>
                      <div><dt>Descripcion</dt><dd>{selectedProduct.description || "Sin descripcion"}</dd></div>
                      </dl>
                    </>
                  ) : (
                    <p className="page-subtle">Selecciona un producto para ver su detalle.</p>
                  )}
                </aside>
              </div>
            </section>
          </div>
        ) : null}
      </SectionCard>

      <section className="panel">
      <div className="panel-head">
        <h2>Filtros</h2>
      </div>
      <div className="filters">
      <label>
        Desde <input type="date" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
      </label>
      <label>
        Hasta <input type="date" value={toInput} onChange={(e) => setToInput(e.target.value)} />
      </label>
      <label>
        Mayorista
        <select value={wholesalerFilter} onChange={(e) => setWholesalerFilter(e.target.value)}>
          <option value="">Todos</option>
          {wholesalers.map((wholesaler) => (
            <option key={wholesaler.id} value={wholesaler.id}>
              {wholesaler.name}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={applyFilters}>Aplicar</button>
      <button type="button" className="secondary" onClick={clearFilters}>Limpiar</button>
      </div>
      </section>
      {loading ? <p className="page-subtle">Cargando ventas...</p> : null}
      {!loading && (data?.results.length ?? 0) === 0 ? <p className="page-subtle">Sin resultados.</p> : null}
      <PaginatedTable
        columns={[
          { key: "id", label: "ID", render: (row) => row.id },
          { key: "sold_at", label: "Fecha", render: (row) => new Date(row.sold_at).toLocaleString("es-BO") },
          { key: "wholesaler", label: "Mayorista", render: (row) => row.wholesaler_name },
          { key: "product", label: "Producto", render: (row) => row.product_name },
          { key: "quantity", label: "Cantidad", render: (row) => row.quantity },
          { key: "unit_cost_price", label: "Costo", render: (row) => `Bs. ${row.unit_cost_price}` },
          { key: "unit_wholesale_reference_price", label: "Precio mayorista", render: (row) => `Bs. ${row.unit_wholesale_reference_price}` },
          { key: "unit_sale_price", label: "Precio vendido", render: (row) => `Bs. ${row.unit_sale_price}` },
          { key: "status", label: "Estado", render: (row) => (row.is_active ? "Activa" : "Deshabilitada") },
          {
            key: "actions",
            label: "Acciones",
            render: (row) => (
              <div className="table-actions">
                <button type="button" className="secondary" onClick={() => void handleDeactivateSale(row)} disabled={!row.is_active}>
                  Deshabilitar
                </button>
                {user?.role === "admin" ? (
                  <button type="button" className="secondary" onClick={() => void handleDeleteSale(row)}>
                    Eliminar
                  </button>
                ) : null}
              </div>
            )
          }
        ]}
        rows={loading ? [] : data?.results ?? []}
        page={page}
        total={data?.count ?? 0}
        pageSize={10}
        onPageChange={setPage}
      />
    </main>
  )
}
