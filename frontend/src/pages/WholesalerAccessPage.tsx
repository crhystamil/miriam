import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { useWholesalerAccess } from "../state/wholesalerAccess"

const validationMessages = {
  empty: "Ingresa para continuar.",
  incomplete: "Error de codigo.",
  invalid: "Usa solo tu codigo.",
  valid: ""
}

export function WholesalerAccessPage() {
  const { enableAccess } = useWholesalerAccess()
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = enableAccess(phone)
    setError(validationMessages[result])
  }

  return (
    <main className="wholesale-access-page">
      <section className="wholesale-access-card" aria-labelledby="wholesale-access-title">
        <form className="wholesale-access-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Numero de celular</span>
            <input
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                setError("")
              }}
              inputMode="tel"
              autoComplete="tel"
              placeholder=""
              aria-describedby={error ? "wholesale-access-error" : undefined}
            />
          </label>

          {error ? (
            <p id="wholesale-access-error" className="wholesale-access-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="public-cta wholesale-access-button">
            Ver productos mayoristas
          </button>
          <Link to="/" className="wholesale-access-back">
            Volver al inicio 
          </Link>
        </form>
      </section>
    </main>
  )
}
