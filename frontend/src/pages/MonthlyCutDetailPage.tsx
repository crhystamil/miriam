import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { HttpError } from "../api/client"
import { getMonthlyCut } from "../api/reports"
import type { MonthlyCut, MonthlyCutExpenseDetail, MonthlyCutSaleDetail } from "../api/types"
import { PaginatedTable } from "../components/PaginatedTable"
import { StatusMessages } from "../components/StatusMessages"

function fmtMoney(value: string) {
  const num = Number(value)
  if (Number.isNaN(num)) return value
  return `Bs. ${num.toFixed(2)}`
}

export function MonthlyCutDetailPage() {
  const navigate = useNavigate()
  const { cutId } = useParams()
  const [cut, setCut] = useState<MonthlyCut | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadCut() {
      const parsedId = Number(cutId)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")
      setNotFound(false)
      try {
        const detail = await getMonthlyCut(parsedId)
        setCut(detail)
      } catch (err) {
        if (err instanceof HttpError && err.payload.code === "not_found") {
          setNotFound(true)
          return
        }

        if (err instanceof HttpError) {
          setError(err.payload.detail)
        } else {
          setError("No se pudo cargar el detalle del corte.")
        }
      } finally {
        setLoading(false)
      }
    }

    void loadCut()
  }, [cutId])

  const enabledDetails = useMemo(() => cut?.report.enabled_sales_detail ?? [], [cut])
  const disabledDetails = useMemo(() => cut?.report.disabled_sales_detail ?? [], [cut])
  const expensesDetails = useMemo(() => cut?.report.expenses_detail ?? [], [cut])

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Detalle de corte mensual</h1>
        <p className="page-subtle">Consulta completa del cierre mensual ejecutado.</p>
      </section>

      <StatusMessages error={error} success="" fieldErrors={[]} />

      {loading ? <p className="page-subtle">Cargando detalle...</p> : null}

      {!loading && notFound ? (
        <section className="panel">
          <h2>Corte no encontrado</h2>
          <p className="page-subtle">La referencia del corte es invalida o no existe en el historial.</p>
          <button type="button" className="secondary" onClick={() => navigate("/monthly-cut")}>Volver al listado</button>
        </section>
      ) : null}

      {cut ? (
        <>
          <section className="panel">
            <div className="panel-head">
              <h2>Resumen financiero</h2>
              <Link to="/monthly-cut" className="secondary">Volver al listado</Link>
            </div>
            <div className="metrics-grid">
              <div className="metric"><strong>Ingresos totales</strong><span>{fmtMoney(cut.report.summary.total_income)}</span></div>
              <div className="metric"><strong>Ganancia tienda</strong><span>{fmtMoney(cut.report.summary.store_profit)}</span></div>
              <div className="metric"><strong>Ganancia vendedor</strong><span>{fmtMoney(cut.report.summary.vendor_profit)}</span></div>
              <div className="metric"><strong>Capital</strong><span>{fmtMoney(cut.report.summary.capital)}</span></div>
              <div className="metric"><strong>Gastos</strong><span>{fmtMoney(cut.report.summary.expenses)}</span></div>
              <div className="metric"><strong>Neto real</strong><span>{fmtMoney(cut.report.summary.real_net)}</span></div>
            </div>
          </section>

          <section className="panel">
            <h2>Desempeno por mayorista</h2>
            <PaginatedTable
              columns={[
                { key: "wholesaler_name", label: "Mayorista", render: (row) => row.wholesaler_name },
                { key: "sales_count", label: "Nro ventas", render: (row) => row.sales_count },
                { key: "income", label: "Ingresos", render: (row) => fmtMoney(row.income) },
                { key: "capital", label: "Capital", render: (row) => fmtMoney(row.capital) },
                { key: "store_profit", label: "Ganancia tienda", render: (row) => fmtMoney(row.store_profit) },
                { key: "wholesaler_profit", label: "Ganancia mayorista", render: (row) => fmtMoney(row.wholesaler_profit) },
              ]}
              rows={cut.report.wholesaler_performance}
              page={1}
              total={cut.report.wholesaler_performance.length}
              pageSize={100}
              onPageChange={() => undefined}
            />
          </section>

          <section className="panel">
            <h2>Gastos del corte</h2>
            {expensesDetails.length === 0 ? (
              <p className="page-subtle">No hay gastos asociados a este corte.</p>
            ) : (
              <ExpenseDetailTable rows={expensesDetails} />
            )}
          </section>

          <section className="panel">
            <h2>Detalle ventas habilitadas</h2>
            <SalesDetailTable rows={enabledDetails} />
          </section>

          <section className="panel">
            <h2>Ventas deshabilitadas</h2>
            <SalesDetailTable rows={disabledDetails} />
          </section>
        </>
      ) : null}
    </main>
  )
}

function SalesDetailTable({ rows }: { rows: MonthlyCutSaleDetail[] }) {
  return (
    <PaginatedTable
      columns={[
        { key: "sold_at", label: "Fecha", render: (row) => new Date(row.sold_at).toLocaleString("es-BO") },
        { key: "wholesaler_name", label: "Mayorista", render: (row) => row.wholesaler_name },
        { key: "product_name", label: "Producto", render: (row) => row.product_name },
        { key: "quantity", label: "Cantidad", render: (row) => row.quantity },
        { key: "unit_cost_price", label: "Costo", render: (row) => fmtMoney(row.unit_cost_price) },
        { key: "unit_wholesale_reference_price", label: "Precio mayorista", render: (row) => fmtMoney(row.unit_wholesale_reference_price) },
        { key: "unit_sale_price", label: "Precio vendido", render: (row) => fmtMoney(row.unit_sale_price) },
        { key: "store_profit", label: "Ganancia tienda", render: (row) => fmtMoney(row.store_profit) },
        { key: "vendor_profit", label: "Ganancia vendedor", render: (row) => fmtMoney(row.vendor_profit) },
        { key: "sale_total", label: "Venta total", render: (row) => fmtMoney(row.sale_total) },
      ]}
      rows={rows}
      page={1}
      total={rows.length}
      pageSize={1000}
      onPageChange={() => undefined}
    />
  )
}

function ExpenseDetailTable({ rows }: { rows: MonthlyCutExpenseDetail[] }) {
  return (
    <PaginatedTable
      columns={[
        { key: "spent_at", label: "Fecha", render: (row) => new Date(row.spent_at).toLocaleString("es-BO") },
        { key: "concept", label: "Concepto", render: (row) => row.concept },
        { key: "amount", label: "Monto", render: (row) => fmtMoney(row.amount) },
      ]}
      rows={rows}
      page={1}
      total={rows.length}
      pageSize={100}
      onPageChange={() => undefined}
    />
  )
}
