import { NavLink, Outlet, useNavigate } from "react-router-dom"

import { useAuth } from "../state/auth"

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">IR</div>
          <div>
            <h3 className="brand">IAM Repuestos</h3>
            <p className="brand-subtitle">Control comercial</p>
          </div>
        </div>
        <span className="role-chip">Rol: {user?.role}</span>
        <nav className="nav-grid">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/products">Productos</NavLink>
          <NavLink to="/purchases">Compras</NavLink>
          <NavLink to="/sales">Ventas</NavLink>
          <NavLink to="/expenses">Gastos</NavLink>
          {user?.role === "admin" ? <NavLink to="/monthly-cut">Corte mensual</NavLink> : null}
          {user?.role === "admin" ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <div>
            <strong>Panel operativo</strong>
            <p className="topbar-subtitle">Inventario, ventas y gastos</p>
          </div>
          <button type="button" onClick={() => void handleLogout()} className="secondary">
            Cerrar sesion
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
