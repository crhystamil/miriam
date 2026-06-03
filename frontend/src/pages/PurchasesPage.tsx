import type { FormEvent } from "react"
import { useEffect, useState } from "react"

import { HttpError } from "../api/client"
import { getProducts } from "../api/products"
import { createPurchase, getPurchases } from "../api/sales"
import type { PaginatedResponse, Product, Purchase } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { SectionCard } from "../components/SectionCard"
import { StatusMessages } from "../components/StatusMessages"
import { useAuth } from "../state/auth"

export function PurchasesPage() {
  const { user } = useAuth()
  const [data, setData] = useState<PaginatedResponse<Purchase> | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [newProduct, setNewProduct] = useState("")
  const [newQuantity, setNewQuantity] = useState("1")
  const [newUnitCost, setNewUnitCost] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [submittingPurchase, setSubmittingPurchase] = useState(false)

  async function loadPurchases(pageOverride = page) {
    setLoading(true)
    setError("")
    try {
      const result = await getPurchases({ page: pageOverride })
      setData(result)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar compras.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPurchases()
  }, [page])

  useEffect(() => {
    async function loadProducts() {
      const productList = await getProducts({ page: 1 })
      setProducts(productList.results)
      if (productList.results.length > 0 && !newProduct) {
        setNewProduct(String(productList.results[0].id))
      }
    }
    void loadProducts()
  }, [])

  function resetPurchaseDraft() {
    setNewQuantity("1")
    setNewUnitCost("")
    setNewNotes("")
  }

  function openPurchaseModal() {
    setError("")
    setSuccess("")
    setFieldErrors([])
    setIsPurchaseModalOpen(true)
  }

  function closePurchaseModal() {
    setIsPurchaseModalOpen(false)
    resetPurchaseDraft()
  }

  async function submitCreatePurchase(e: FormEvent) {
    e.preventDefault()
    if (submittingPurchase) return
    setError("")
    setSuccess("")
    setFieldErrors([])

    if (!newProduct) {
      setError("Debe seleccionar un producto.")
      return
    }
    if (Number(newQuantity) <= 0 || Number(newUnitCost) <= 0) {
      setError("Cantidad y costo deben ser mayores a cero.")
      return
    }

    try {
      setSubmittingPurchase(true)
      await createPurchase({
        product: Number(newProduct),
        quantity: Number(newQuantity),
        unit_cost: newUnitCost,
        notes: newNotes
      })
      setSuccess("Compra creada correctamente.")
      resetPurchaseDraft()
      setIsPurchaseModalOpen(false)
      setPage(1)
      await loadPurchases(1)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo crear la compra.")
      }
    }
    finally {
      setSubmittingPurchase(false)
    }
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Compras</h1>
        <p className="page-subtle">Registra reposicion y controla costo unitario.</p>
      </section>
      <StatusMessages error={error} success={success} fieldErrors={fieldErrors} />

      {user?.role === "admin" ? (
        <SectionCard title="Nueva compra">
          <div className="sales-open-wrap">
            <button type="button" onClick={openPurchaseModal}>Nueva compra</button>
          </div>
        </SectionCard>
      ) : null}

      {isPurchaseModalOpen && user?.role === "admin" ? (
        <div className="sales-modal-overlay" role="dialog" aria-modal="true" aria-label="Registrar nueva compra">
          <section className="sales-modal-card">
            <div className="panel-head">
              <h3>Registrar compra</h3>
              <button type="button" className="secondary" onClick={closePurchaseModal}>Cancelar</button>
            </div>

            <form className="sales-form" onSubmit={submitCreatePurchase}>
              <label>
                Producto
                <select aria-label="Producto de compra" value={newProduct} onChange={(e) => setNewProduct(e.target.value)}>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.sku} - {product.name}
                    </option>
                  ))}
                </select>
                {products.length === 0 ? <span className="page-subtle">No hay productos disponibles para comprar.</span> : null}
              </label>
              <label>
                Cantidad
                <input aria-label="Cantidad de compra" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="Cantidad" />
              </label>
              <label>
                Costo unitario
                <input aria-label="Costo unitario compra" value={newUnitCost} onChange={(e) => setNewUnitCost(e.target.value)} placeholder="Costo unitario" />
              </label>
              <label>
                Descripcion de compra
                <textarea
                  aria-label="Descripcion de compra"
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Detalle adicional de la compra"
                />
              </label>
              <button type="submit" disabled={submittingPurchase || products.length === 0}>
                {submittingPurchase ? "Enviando..." : "Registrar compra"}
              </button>
            </form>
          </section>
        </div>
      ) : null}

      {loading ? <p className="page-subtle">Cargando compras...</p> : null}
      {!loading && (data?.results.length ?? 0) === 0 ? <p className="page-subtle">Sin resultados.</p> : null}
      <PaginatedTable
        columns={[
          { key: "id", label: "ID", render: (row) => row.id },
          { key: "product", label: "Producto", render: (row) => row.product_name },
          { key: "quantity", label: "Cantidad", render: (row) => row.quantity },
          { key: "unit_cost", label: "Costo", render: (row) => `Bs. ${row.unit_cost}` },
          { key: "notes", label: "Descripcion", render: (row) => row.notes || "Sin descripcion" },
          { key: "purchased_at", label: "Fecha", render: (row) => new Date(row.purchased_at).toLocaleString("es-BO") }
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
