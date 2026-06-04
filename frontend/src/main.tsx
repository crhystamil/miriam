import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { AppRoutes } from "./router/routes"
import { AuthProvider } from "./state/auth"
import { WholesalerAccessProvider } from "./state/wholesalerAccess"
import "./styles.css"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WholesalerAccessProvider>
          <AppRoutes />
        </WholesalerAccessProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
