import { apiFetch } from "./client"
import type { BootstrapData } from "./types"

export function getBootstrap() {
  return apiFetch<BootstrapData>("/api/system/bootstrap/")
}
