import { apiFetch } from "./client"
import type { DashboardSummary, MonthlyCut, MonthlyReport, PaginatedResponse } from "./types"

type DashboardFilters = {
  from?: string
  to?: string
  month?: string
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value)
    }
  })
  const q = query.toString()
  return q ? `?${q}` : ""
}

export function getDashboardSummary(filters: DashboardFilters = {}) {
  return apiFetch<DashboardSummary>(`/api/reports/dashboard/${buildQuery(filters)}`)
}

export function getMonthlyReport(month: string) {
  return apiFetch<MonthlyReport>(`/api/reports/monthly/?month=${encodeURIComponent(month)}`)
}

export function listMonthlyCuts(page = 1) {
  return apiFetch<PaginatedResponse<MonthlyCut>>(`/api/cuts/?page=${page}`)
}

export function getMonthlyCut(cutId: number) {
  return apiFetch<MonthlyCut>(`/api/cuts/${cutId}/`)
}

export function executeMonthlyCut(payload: { cutoff_date: string; notes?: string }) {
  return apiFetch<MonthlyCut>("/api/cuts/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
