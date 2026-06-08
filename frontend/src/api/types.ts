export type Role = "admin" | "vendor"

export type ApiError = {
  code: string
  detail: string
  field_errors: Record<string, string[]>
}

export type UserMe = {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: Role
  is_staff: boolean
}

export type BootstrapData = {
  app: {
    name: string
    version: string
    language: string
    timezone: string
  }
  auth: {
    roles: Role[]
    login_path: string
    me_path: string
    logout_path: string
  }
  pagination: {
    page_size: number
  }
  currency: {
    code: string
    symbol: string
  }
  routes: Record<string, string>
}

export type DashboardSummary = {
  role: Role
  sales_count: number
  units_sold: number
  gross_sales: string
  store_profit: string
  vendor_profit: string
  total_expenses: string
  low_stock_products: Array<{
    id: number
    sku: string
    name: string
    stock: number
  }>
  filters: {
    from: string | null
    to: string | null
  }
}

export type MonthlyReport = {
  role: Role
  month: string
  period: {
    from: string
    to: string
  }
  sales_count: number
  units_sold: number
  gross_sales: string
  store_profit: string
  vendor_profit: string
  total_expenses: string
}

export type MonthlyCutSummary = {
  total_income: string
  store_profit: string
  vendor_profit: string
  capital: string
  expenses: string
  real_net: string
}

export type MonthlyCutExpenseDetail = {
  spent_at: string
  concept: string
  amount: string
}

export type MonthlyCutWholesalerPerformance = {
  wholesaler_name: string
  sales_count: number
  income: string
  capital: string
  store_profit: string
  wholesaler_profit: string
}

export type MonthlyCutSaleDetail = {
  sold_at: string
  wholesaler_name: string
  product_name: string
  quantity: number
  unit_cost_price: string
  unit_wholesale_reference_price: string
  unit_sale_price: string
  store_profit: string
  vendor_profit: string
  sale_total: string
}

export type MonthlyCutReport = {
  summary: MonthlyCutSummary
  wholesaler_performance: MonthlyCutWholesalerPerformance[]
  expenses_detail: MonthlyCutExpenseDetail[]
  enabled_sales_detail: MonthlyCutSaleDetail[]
  disabled_sales_detail: MonthlyCutSaleDetail[]
}

export type MonthlyCut = {
  id: number
  period: string
  cutoff_date: string
  closed_at: string
  closed_by: number
  notes: string
  status: "running" | "completed" | "failed"
  started_at: string
  finished_at: string
  report: MonthlyCutReport
}

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type Product = {
  id: number
  sku: string
  name: string
  description: string
  cost_price: string
  fifo_cost_price: string
  wholesale_reference_price: string
  public_price: string
  stock: number
  is_active: boolean
  images: ProductImage[]
  representative_image_url: string
  representative_thumbnail_url: string
}

export type ProductImage = {
  id: number
  image_url: string
  thumbnail_url: string
  medium_url: string
  large_url: string
  content_type: string
  size_bytes: number
  position?: number
}

export type Sale = {
  id: number
  product: number
  product_name: string
  vendor: number
  vendor_username: string
  wholesaler: number
  wholesaler_name: string
  wholesaler_phone: string
  quantity: number
  unit_sale_price: string
   unit_wholesale_reference_price: string
   unit_cost_price: string
   is_active: boolean
  store_profit: string
  vendor_profit: string
  sold_at: string
}

export type Wholesaler = {
  id: number
  name: string
  phone: string
}

export type SaleDraftState = {
  product: string
  quantity: string
  unit_sale_price: string
  notes: string
}

export type Expense = {
  id: number
  scope: "store" | "vendor"
  vendor: number | null
  vendor_username: string | null
  concept: string
  amount: string
  spent_at: string
}

export type Purchase = {
  id: number
  product: number
  product_name: string
  quantity: number
  remaining: number
  unit_cost: string
  purchased_at: string
  notes: string
}
