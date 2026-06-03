type Props = {
  error?: string
  success?: string
  fieldErrors?: string[]
}

export function StatusMessages({ error, success, fieldErrors = [] }: Props) {
  if (!error && !success && fieldErrors.length === 0) {
    return null
  }

  return (
    <section className="status-stack" aria-live="polite">
      {error ? (
        <p className="status-error" role="alert" aria-live="assertive">
          Error: {error}
        </p>
      ) : null}
      {success ? (
        <p className="status-success" role="status" aria-live="polite">
          {success}
        </p>
      ) : null}
      {fieldErrors.length > 0 ? (
        <ul className="status-error status-list" role="alert" aria-live="assertive">
          {fieldErrors.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
