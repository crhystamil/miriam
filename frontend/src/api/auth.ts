import { apiFetch } from "./client"
import type { UserMe } from "./types"

export function login(username: string, password: string) {
  return apiFetch<UserMe>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password })
  })
}

export function me() {
  return apiFetch<UserMe>("/api/auth/me/")
}

export function logout() {
  return apiFetch<void>("/api/auth/logout/", { method: "POST", body: JSON.stringify({}) })
}
