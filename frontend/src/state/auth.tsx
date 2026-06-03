import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

import { login as loginApi, logout as logoutApi, me } from "../api/auth"
import { getBootstrap } from "../api/system"
import type { BootstrapData, UserMe } from "../api/types"

type AuthContextValue = {
  user: UserMe | null
  bootstrap: BootstrapData | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null)
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const [bootstrapData] = await Promise.all([getBootstrap()])
        setBootstrap(bootstrapData)
        try {
          const current = await me()
          setUser(current)
        } catch {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [])

  async function login(username: string, password: string) {
    const sessionUser = await loginApi(username, password)
    setUser(sessionUser)
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({ user, bootstrap, loading, login, logout }),
    [user, bootstrap, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
