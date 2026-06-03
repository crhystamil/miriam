import { apiFetch } from "./client"
import type { PaginatedResponse, Purchase, Sale, Wholesaler } from "./types"

type SaleFilters = {
  page?: number
  from?: string
  to?: string
  product?: number
  wholesaler?: number
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value))
    }
  })
  const q = query.toString()
  return q ? `?${q}` : ""
}

export function getSales(filters: SaleFilters = {}) {
  return apiFetch<PaginatedResponse<Sale>>(`/api/sales/${buildQuery(filters)}`)
}

type CreateSaleInput = {
  product: number
  vendor?: number
  wholesaler: number
  quantity: number
  unit_sale_price: string
  notes?: string
}

export function createSale(payload: CreateSaleInput) {
  return apiFetch<Sale>("/api/sales/", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

export function deactivateSale(saleId: number) {
  return apiFetch<Sale>(`/api/sales/${saleId}/deactivate/`, {
    method: "POST",
    body: JSON.stringify({})
  })
}

export function deleteSale(saleId: number) {
  return apiFetch<void>(`/api/sales/${saleId}/`, {
    method: "DELETE"
  })
}

type CreatePurchaseInput = {
  product: number
  quantity: number
  unit_cost: string
  notes?: string
}

export function createPurchase(payload: CreatePurchaseInput) {
  return apiFetch<Purchase>("/api/purchases/", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}

export function getWholesalers() {
  return apiFetch<PaginatedResponse<Wholesaler>>("/api/wholesalers/")
}

type PurchaseFilters = {
  page?: number
}

export function getPurchases(filters: PurchaseFilters = {}) {
  return apiFetch<PaginatedResponse<Purchase>>(`/api/purchases/${buildQuery(filters)}`)
}
