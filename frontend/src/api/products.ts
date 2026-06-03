import { apiFetch } from "./client"
import type { PaginatedResponse, Product } from "./types"

type ProductFilters = {
  page?: number
  search?: string
  is_active?: "true" | "false"
  low_stock?: "true"
  low_stock_only?: string
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

export function getProducts(filters: ProductFilters = {}) {
  const { low_stock_only: _legacyLowStockOnly, ...normalizedFilters } = filters
  return apiFetch<PaginatedResponse<Product>>(`/api/products/${buildQuery(normalizedFilters)}`)
}

type CreateProductInput = {
  name: string
  description?: string
  cost_price: string
  wholesale_reference_price: string
  public_price: string
  stock?: number
  is_active?: boolean
  image_files: File[]
}

export function createProduct(payload: CreateProductInput) {
  const formData = new FormData()
  formData.append("name", payload.name)
  formData.append("description", payload.description ?? "")
  formData.append("cost_price", payload.cost_price)
  formData.append("wholesale_reference_price", payload.wholesale_reference_price)
  formData.append("public_price", payload.public_price)
  formData.append("stock", String(payload.stock ?? 0))
  payload.image_files.forEach((file) => formData.append("image_files", file))
  return apiFetch<Product>("/api/products/", {
    method: "POST",
    body: formData
  })
}

type UpdateProductInput = Partial<CreateProductInput> & { sku?: string; image_files?: File[] }

export function updateProduct(productId: number, payload: UpdateProductInput) {
  const formData = new FormData()
  if (payload.sku !== undefined) formData.append("sku", payload.sku)
  if (payload.name !== undefined) formData.append("name", payload.name)
  if (payload.description !== undefined) formData.append("description", payload.description)
  if (payload.cost_price !== undefined) formData.append("cost_price", payload.cost_price)
  if (payload.wholesale_reference_price !== undefined) formData.append("wholesale_reference_price", payload.wholesale_reference_price)
  if (payload.public_price !== undefined) formData.append("public_price", payload.public_price)
  if (payload.stock !== undefined) formData.append("stock", String(payload.stock))
  if (payload.image_files !== undefined) payload.image_files.forEach((file) => formData.append("image_files", file))
  return apiFetch<Product>(`/api/products/${productId}/`, {
    method: "PATCH",
    body: formData
  })
}

export function deactivateProduct(productId: number) {
  return apiFetch<void>(`/api/products/${productId}/`, {
    method: "DELETE"
  })
}
