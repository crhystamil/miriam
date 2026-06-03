import type { ReactNode } from "react"

type Column<T> = {
  key: string
  label: string
  render: (row: T) => ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginatedTable<T>({ columns, rows, page, total, pageSize, onPageChange }: Props<T>) {
  const pages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <section className="panel">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="secondary">
          Anterior
        </button>
        <span>
          Pagina {page} de {pages}
        </span>
        <button type="button" onClick={() => onPageChange(Math.min(pages, page + 1))} disabled={page >= pages} className="secondary">
          Siguiente
        </button>
      </div>
    </section>
  )
}
