import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { HttpError } from "../api/client"
import { executeMonthlyCut, listMonthlyCuts } from "../api/reports"
import type { MonthlyCut, PaginatedResponse } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { StatusMessages } from "../components/StatusMessages"

function fmtMoney(value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return `Bs. ${num.toFixed(2)}`
}

export function MonthlyCutPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<PaginatedResponse<MonthlyCut> | null>(null)
  const [page, setPage] = useState(1)
  const [cutoffDate, setCutoffDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  async function loadCuts(targetPage = page) {
    setLoading(true)
    setError("")
    try {
      const cuts = await listMonthlyCuts(targetPage)
      setData(cuts)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo cargar cortes mensuales.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCuts()
  }, [page])

  async function handleRunCut() {
    if (submitting) return
    setError("")
    setSuccess("")
    setFieldErrors([])
    if (!cutoffDate) {
      setError("Debe seleccionar una fecha de corte.")
      return
    }

    const shouldContinue = window.confirm("Esta accion cerrara ventas y gastos hasta la fecha elegida. Desea ejecutar el corte mensual?")
    if (!shouldContinue) {
      return
    }

    try {
      setSubmitting(true)
      await executeMonthlyCut({ cutoff_date: cutoffDate, notes: notes || undefined })
      setSuccess("Corte mensual ejecutado correctamente.")
      setNotes("")
      setPage(1)
      await loadCuts(1)
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
        setFieldErrors(Object.values(err.payload.field_errors).flat())
      } else {
        setError("No se pudo ejecutar el corte mensual.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Corte mensual</h1>
        <p className="page-subtle">Cierre de ventas y gastos con resumen financiero.</p>
      </section>

      <StatusMessages error={error} success={success} fieldErrors={fieldErrors} />

      <section className="panel">
        <div className="panel-head">
          <h2>Ejecutar corte</h2>
        </div>
        <div className="filters">
          <label>
            Fecha de corte
            <input type="date" value={cutoffDate} onChange={(e) => setCutoffDate(e.target.value)} />
          </label>
          <input placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button type="button" onClick={() => void handleRunCut()} disabled={submitting}>
            {submitting ? "Procesando..." : "Ejecutar corte"}
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Historial de cortes</h2>
        <PaginatedTable
          columns={[
            { key: "id", label: "ID", render: (row) => row.id },
            { key: "period", label: "Periodo", render: (row) => row.period },
            { key: "cutoff_date", label: "Fecha corte", render: (row) => row.cutoff_date },
            { key: "status", label: "Estado", render: (row) => row.status },
            {
              key: "income_preview",
              label: "Ingresos",
              render: (row) => fmtMoney(row.report.summary.total_income),
            },
            {
              key: "actions",
              label: "Accion",
              render: (row) => (
                <button type="button" className="secondary" onClick={() => navigate(`/monthly-cut/${row.id}`)}>
                  Ver
                </button>
              ),
            },
          ]}
          rows={loading ? [] : data?.results ?? []}
          page={page}
          total={data?.count ?? 0}
          pageSize={10}
          onPageChange={setPage}
        />
      </section>
    </main>
  )
}
