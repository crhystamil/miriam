import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "../components/AppShell"
import { PublicLayout } from "../components/PublicLayout"
import { CatalogPage } from "../pages/CatalogPage"
import { ContactPage } from "../pages/ContactPage"
import { DashboardPage } from "../pages/DashboardPage"
import { ExpensesPage } from "../pages/ExpensesPage"
import { LandingPage } from "../pages/LandingPage"
import { LoginPage } from "../pages/LoginPage"
import { MonthlyCutPage } from "../pages/MonthlyCutPage"
import { MonthlyCutDetailPage } from "../pages/MonthlyCutDetailPage"
import { PurchasesPage } from "../pages/PurchasesPage"
import { ProductsPage } from "../pages/ProductsPage"
import { ProductDetailPage } from "../pages/ProductDetailPage"
import { SalesPage } from "../pages/SalesPage"
import { ServicesPage } from "../pages/ServicesPage"
import { WholesalerProductsPage } from "../pages/WholesalerProductsPage"
import { RequireAuth, RequireRole, RequireWholesalerAccess } from "./guards"

function PortalAdminPage() {
  return <p>Area administrativa del portal</p>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route element={<RequireWholesalerAccess />}>
          <Route path="/mayoristas" element={<WholesalerProductsPage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />

          <Route element={<RequireRole roles={["admin"]} />}>
            <Route path="/monthly-cut" element={<MonthlyCutPage />} />
            <Route path="/monthly-cut/:cutId" element={<MonthlyCutDetailPage />} />
            <Route path="/portal-admin" element={<PortalAdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
