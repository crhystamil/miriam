import type { ApiError } from "./types"

const API_BASE = import.meta.env.VITE_API_BASE ?? `${window.location.protocol}//${window.location.hostname}:8000`

function getCookie(name: string): string | null {
  const parts = document.cookie.split(";").map((item) => item.trim())
  const match = parts.find((item) => item.startsWith(`${name}=`))
  if (!match) {
    return null
  }
  return decodeURIComponent(match.slice(name.length + 1))
}

export class HttpError extends Error {
  payload: ApiError

  constructor(payload: ApiError) {
    super(payload.detail)
    this.payload = payload
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? "GET"
  const csrfToken = getCookie("csrftoken")
  const needsCsrf = method !== "GET" && method !== "HEAD" && method !== "OPTIONS"

  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData
  const mergedHeaders: HeadersInit = {
    ...(needsCsrf && csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    ...(init?.headers ?? {})
  }
  if (!isFormData) {
    ;(mergedHeaders as Record<string, string>)["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: mergedHeaders,
    ...init
  })

  if (!response.ok) {
    const payload = (await response.json()) as ApiError
    throw new HttpError(payload)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
