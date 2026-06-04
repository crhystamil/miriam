import { Navigate, Outlet } from "react-router-dom"

import { WholesalerAccessPage } from "../pages/WholesalerAccessPage"
import { useAuth } from "../state/auth"
import { useWholesalerAccess } from "../state/wholesalerAccess"
import type { Role } from "../api/types"

export function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) {
    return <p>Cargando sesion...</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

export function RequireWholesalerAccess() {
  const { accessEnabled } = useWholesalerAccess()
  if (!accessEnabled) {
    return <WholesalerAccessPage />
  }
  return <Outlet />
}
