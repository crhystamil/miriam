import type { FormEvent } from "react"
import { useEffect, useState } from "react"

import { HttpError } from "../api/client"
import { createExpense, getExpenses } from "../api/expenses"
import type { Expense, PaginatedResponse } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { StatusMessages } from "../components/StatusMessages"

export function ExpensesPage() {
  const [data, setData] = useState<PaginatedResponse<Expense> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newScope, setNewScope] = useState<"store" | "vendor">("vendor")
  const [newConcept, setNewConcept] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [submittingExpense, setSubmittingExpense] = useState(false)

  function resetExpenseForm() {
    setNewScope("vendor")
    setNewConcept("")
    setNewAmount("")
    setNewNotes("")
  }

  function openCreateModal() {
    setError("")
    setSuccess("")
    setFieldErrors([])
    resetExpenseForm()
    setIsCreateModalOpen(true)
  }

  function closeCreateModal() {
    if (submittingExpense) return
    setIsCreateModalOpen(false)
    resetExpenseForm()
  }

  async function loadExpenses() {
    setLoading(true)
    setError("")
    try {
      const result = await getExpenses({ page })
      setData(result)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar gastos.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExpenses()
  }, [page])

  async function submitCreateExpense(e: FormEvent) {
    e.preventDefault()
    if (submittingExpense) return
    setError("")
    setSuccess("")
    setFieldErrors([])
    if (!newConcept.trim()) {
      setError("El concepto es obligatorio.")
      return
    }
    if (Number(newAmount) <= 0) {
      setError("El monto debe ser mayor a cero.")
      return
    }
    try {
      setSubmittingExpense(true)
      await createExpense({
        scope: newScope,
        concept: newConcept,
        amount: newAmount,
        notes: newNotes || undefined,
      })
      setSuccess("Gasto creado correctamente.")
      setIsCreateModalOpen(false)
      resetExpenseForm()
      setPage(1)
      await loadExpenses()
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo crear el gasto.")
      }
    }
    finally {
      setSubmittingExpense(false)
    }
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Gastos</h1>
        <p className="page-subtle">Controla egresos de tienda y vendedor.</p>
      </section>
      <StatusMessages error={error} success={success} fieldErrors={fieldErrors} />

      <section className="panel">
        <div className="sales-open-wrap">
          <button type="button" onClick={openCreateModal}>Nuevo gasto</button>
        </div>
      </section>

      {isCreateModalOpen ? (
        <div className="sales-modal-overlay" role="dialog" aria-modal="true" aria-label="Registrar gasto">
          <section className="sales-modal-card">
            <div className="panel-head">
              <h3>Nuevo gasto</h3>
              <button type="button" className="secondary" onClick={closeCreateModal}>Cancelar</button>
            </div>
            <form className="sales-form" onSubmit={submitCreateExpense}>
              <label>
                Ambito
                <select aria-label="Ambito de gasto" value={newScope} onChange={(e) => setNewScope(e.target.value as "store" | "vendor")}>
                  <option value="store">Tienda</option>
                  <option value="vendor">Vendedor</option>
                </select>
              </label>
              <label>
                Concepto
                <input aria-label="Concepto de gasto" placeholder="Concepto" value={newConcept} onChange={(e) => setNewConcept(e.target.value)} />
              </label>
              <label>
                Monto
                <input aria-label="Monto de gasto" placeholder="Monto" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
              </label>
              <label>
                Notas (opcional)
                <textarea aria-label="Notas de gasto" rows={3} placeholder="Notas" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
              </label>
              <p className="page-subtle">La fecha y hora se asignan automaticamente al guardar.</p>
              <button type="submit" disabled={submittingExpense}>{submittingExpense ? "Enviando..." : "Crear gasto"}</button>
            </form>
          </section>
        </div>
      ) : null}

      {loading ? <p className="page-subtle">Cargando gastos...</p> : null}
      {!loading && (data?.results.length ?? 0) === 0 ? <p className="page-subtle">Sin resultados.</p> : null}
      <PaginatedTable
        columns={[
          { key: "id", label: "ID", render: (row) => row.id },
          { key: "scope", label: "Ambito", render: (row) => (row.scope === "store" ? "Tienda" : "Vendedor") },
          { key: "vendor", label: "Usuario", render: (row) => row.vendor_username ?? "-" },
          { key: "concept", label: "Concepto", render: (row) => row.concept },
          { key: "amount", label: "Monto", render: (row) => `Bs. ${row.amount}` },
          { key: "spent_at", label: "Fecha", render: (row) => new Date(row.spent_at).toLocaleString("es-BO") }
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
