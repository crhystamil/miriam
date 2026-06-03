import { apiFetch } from "./client"
import type { Expense, PaginatedResponse } from "./types"

type ExpenseFilters = {
  page?: number
  from?: string
  to?: string
  scope?: "store" | "vendor"
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

export function getExpenses(filters: ExpenseFilters = {}) {
  return apiFetch<PaginatedResponse<Expense>>(`/api/expenses/${buildQuery(filters)}`)
}

type CreateExpenseInput = {
  scope: "store" | "vendor"
  concept: string
  amount: string
  notes?: string
}

export function createExpense(payload: CreateExpenseInput) {
  return apiFetch<Expense>("/api/expenses/", {
    method: "POST",
    body: JSON.stringify(payload)
  })
}
