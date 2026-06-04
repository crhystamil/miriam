import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"

import { useWholesalerAccess } from "../state/wholesalerAccess"

const validationMessages = {
  empty: "Ingresa tu numero de celular para continuar.",
  incomplete: "El numero parece incompleto. Revisa que tenga al menos 8 digitos.",
  invalid: "Usa solo numeros de celular validos. Puedes incluir espacios o guiones.",
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
              placeholder="Ej. 61617345"
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
            Volver al inicio sin ingresar mi numero
          </Link>
        </form>
      </section>
    </main>
  )
}
