import type { ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
}

export function SectionCard({ title, children }: Props) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}
