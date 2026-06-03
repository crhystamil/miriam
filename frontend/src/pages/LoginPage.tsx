import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { HttpError } from "../api/client"
import { useAuth } from "../state/auth"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      await login(username, password)
      navigate("/dashboard")
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.payload.detail)
      } else {
        setError("No se pudo iniciar sesion.")
      }
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="auth-badge">IAM REPUESTOS</span>
        <h1>Iniciar sesion</h1>
        <p className="page-subtle">Ingresa con tu usuario para gestionar ventas, compras y gastos.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <label htmlFor="username">
            Usuario
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario"
              autoComplete="username"
              required
            />
          </label>
          <label htmlFor="password">
            Contrasena
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="contrasena"
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
        {error ? <p className="status-error">{error}</p> : null}
        <p className="auth-help">Si no puedes ingresar, solicita acceso al administrador.</p>
      </section>
    </main>
  )
}
