import type { ReactNode } from "react"
import { createContext, useContext, useMemo, useState } from "react"

type PhoneValidation = "empty" | "incomplete" | "invalid" | "valid"

type WholesalerAccessContextValue = {
  phoneNumber: string
  accessEnabled: boolean
  enableAccess: (rawPhone: string) => PhoneValidation
  clearAccess: () => void
  validatePhone: (rawPhone: string) => PhoneValidation
}

const STORAGE_KEY = "iam.wholesalerAccess"

const WholesalerAccessContext = createContext<WholesalerAccessContextValue | null>(null)

function normalizePhone(rawPhone: string) {
  return rawPhone.replace(/[\s()+-]/g, "")
}

function validatePhoneNumber(rawPhone: string): PhoneValidation {
  const trimmed = rawPhone.trim()
  if (!trimmed) {
    return "empty"
  }

  const normalized = normalizePhone(trimmed)
  if (!/^\d+$/.test(normalized)) {
    return "invalid"
  }

  if (normalized.length < 8) {
    return "incomplete"
  }

  if (normalized.length > 15) {
    return "invalid"
  }

  return "valid"
}

function readStoredPhone() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

function writeStoredPhone(phoneNumber: string) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, phoneNumber)
  } catch {
    // Access remains enabled in memory if sessionStorage is unavailable.
  }
}

function removeStoredPhone() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear if sessionStorage is unavailable.
  }
}

export function WholesalerAccessProvider({ children }: { children: ReactNode }) {
  const [phoneNumber, setPhoneNumber] = useState(readStoredPhone)

  function enableAccess(rawPhone: string) {
    const validation = validatePhoneNumber(rawPhone)
    if (validation !== "valid") {
      return validation
    }

    const normalized = normalizePhone(rawPhone.trim())
    setPhoneNumber(normalized)
    writeStoredPhone(normalized)
    return validation
  }

  function clearAccess() {
    setPhoneNumber("")
    removeStoredPhone()
  }

  const value = useMemo(
    () => ({
      phoneNumber,
      accessEnabled: phoneNumber.length > 0,
      enableAccess,
      clearAccess,
      validatePhone: validatePhoneNumber
    }),
    [phoneNumber]
  )

  return <WholesalerAccessContext.Provider value={value}>{children}</WholesalerAccessContext.Provider>
}

export function useWholesalerAccess() {
  const ctx = useContext(WholesalerAccessContext)
  if (!ctx) {
    throw new Error("useWholesalerAccess must be used inside WholesalerAccessProvider")
  }
  return ctx
}
