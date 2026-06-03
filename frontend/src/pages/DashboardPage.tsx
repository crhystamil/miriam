import { useEffect, useMemo, useState } from "react"

import { HttpError } from "../api/client"
import { getDashboardSummary, getMonthlyReport } from "../api/reports"
import type { DashboardSummary, MonthlyReport } from "../api/types"
import { useAuth } from "../state/auth"

export function DashboardPage() {
  const { user, bootstrap } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [monthly, setMonthly] = useState<MonthlyReport | null>(null)
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError("")
      try {
        const [dashboardData, monthlyData] = await Promise.all([
          getDashboardSummary(),
          getMonthlyReport(month)
        ])
        setDashboard(dashboardData)
        setMonthly(monthlyData)
      } catch (err) {
        if (err instanceof HttpError) {
          setError(err.payload.detail)
        } else {
          setError("No se pudieron cargar los reportes.")
        }
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [month])

  const lowStock = useMemo(() => dashboard?.low_stock_products ?? [], [dashboard])
  const money = useMemo(
    () =>
      new Intl.NumberFormat("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
    []
  )

  if (loading) {
    return <p>Cargando dashboard...</p>
  }

  return (
    <main className="page-stack">
      <section className="page-head">
        <h1>Dashboard</h1>
        <p className="page-subtle">Version API: {bootstrap?.app.version}</p>
      </section>
      <p className="page-subtle">Usuario: {user?.username} - Rol: {user?.role}</p>
      {error ? <p className="status-error">Error: {error}</p> : null}

      <section className="feature-banner">
        <p className="feature-kicker">Resumen operativo</p>
        <h2>Control diario del negocio</h2>
        <p>
          Visualiza ventas, ganancias y gastos en un solo panel para tomar decisiones rapidas.
        </p>
      </section>

      <section className="panel">
        <h2>Resumen global</h2>
        <div className="metrics-grid">
          <div className="metric">
            <strong>Ventas</strong>
            <span>{dashboard?.sales_count ?? 0}</span>
          </div>
          <div className="metric">
            <strong>Unidades</strong>
            <span>{dashboard?.units_sold ?? 0}</span>
          </div>
          <div className="metric">
            <strong>Venta bruta</strong>
            <span>Bs. {money.format(Number(dashboard?.gross_sales ?? 0))}</span>
          </div>
          <div className="metric">
            <strong>Ganancia tienda</strong>
            <span>Bs. {money.format(Number(dashboard?.store_profit ?? 0))}</span>
          </div>
          <div className="metric">
            <strong>Ganancia vendedor</strong>
            <span>Bs. {money.format(Number(dashboard?.vendor_profit ?? 0))}</span>
          </div>
          <div className="metric">
            <strong>Gastos</strong>
            <span>Bs. {money.format(Number(dashboard?.total_expenses ?? 0))}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Reporte mensual</h2>
          <label htmlFor="month">
            Mes
            <input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </label>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <strong>Ventas del mes</strong>
            <span>{monthly?.sales_count ?? 0}</span>
          </div>
          <div className="detail-item">
            <strong>Unidades vendidas</strong>
            <span>{monthly?.units_sold ?? 0}</span>
          </div>
          <div className="detail-item">
            <strong>Venta bruta</strong>
            <span>Bs. {money.format(Number(monthly?.gross_sales ?? 0))}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Stock bajo</h2>
        {lowStock.length === 0 ? <p>Sin productos en nivel critico.</p> : null}
        <ul className="stock-list">
          {lowStock.map((item) => (
            <li key={item.id}>
              {item.sku} - {item.name} (stock: {item.stock})
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
