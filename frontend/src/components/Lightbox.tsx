import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import type { GalleryImage } from "../pages/ProductDetailPage"

const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23eef2f7'/%3E%3Cpath d='M150 329h340l-82-101-58 70-44-54-156 185z' fill='%23c9d4e5'/%3E%3Ccircle cx='234' cy='171' r='45' fill='%23d8e1ee'/%3E%3C/svg%3E"

type LightboxProps = {
  images: GalleryImage[]
  startIndex: number
  alt: string
  onClose: () => void
}

export function Lightbox({ images, startIndex, alt, onClose }: LightboxProps) {
  const hasMultiple = images.length > 1
  const clampedStart =
    images.length === 0 ? 0 : Math.min(Math.max(startIndex, 0), images.length - 1)

  const [currentIndex, setCurrentIndex] = useState(clampedStart)
  const [errorLevel, setErrorLevel] = useState(0)

  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const prevBtnRef = useRef<HTMLButtonElement | null>(null)
  const nextBtnRef = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const triggerRef = useRef<Element | null>(null)

  const current = images[currentIndex]

  // Cadena de fallback por imagen: large -> thumbnail -> placeholder (dedupe).
  const sources = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const s of [current?.large, current?.thumbnail, FALLBACK_PRODUCT_IMAGE]) {
      if (s && !seen.has(s)) {
        seen.add(s)
        out.push(s)
      }
    }
    return out
  }, [current])

  const safeLevel = Math.min(errorLevel, sources.length - 1)
  const resolvedSrc = sources[safeLevel]
  const allFailed = errorLevel >= sources.length - 1

  // FR-009: bloquear scroll del fondo mientras el visor esta abierto.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // FR-008: al abrir enfocar el boton de cerrar; al cerrar restaurar foco al trigger.
  useEffect(() => {
    triggerRef.current = document.activeElement
    closeBtnRef.current?.focus()
    return () => {
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
    }
  }, [])

  // FR-002 + FR-005 + FR-008: Escape cierra, flechas navegan (si hay varias).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (!hasMultiple) return
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setCurrentIndex((i) => Math.max(0, i - 1))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setCurrentIndex((i) => Math.min(images.length - 1, i + 1))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hasMultiple, images.length, onClose])

  // Focus trap basico: Tab/Shift+Tab cicla entre los botones del visor.
  useEffect(() => {
    function onTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return
      const refs = [closeBtnRef, prevBtnRef, nextBtnRef].filter(
        (r) => r.current !== null && !(r.current as HTMLButtonElement).disabled,
      ) as { current: HTMLButtonElement }[]
      if (refs.length === 0) return
      const active = document.activeElement
      const first = refs[0].current
      const last = refs[refs.length - 1].current
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onTab)
    return () => window.removeEventListener("keydown", onTab)
  }, [hasMultiple, currentIndex])

  // Reiniciar el nivel de error al cambiar de imagen (antes del paint, sin flash).
  useLayoutEffect(() => {
    setErrorLevel(0)
  }, [currentIndex])

  // R-010: ante error de carga, degradar al siguiente escalon de fallback.
  function handleImageError() {
    setErrorLevel((l) => l + 1)
  }

  // FR-005 (movil): swipe horizontal para navegar (umbral 50px, dominante en X).
  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current || !hasMultiple) {
      touchStart.current = null
      return
    }
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      setCurrentIndex((i) =>
        dx < 0 ? Math.min(images.length - 1, i + 1) : Math.max(0, i - 1),
      )
    }
  }

  if (images.length === 0 || !current) {
    return null
  }

  function stop<R>(handler?: () => R) {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation()
      handler?.()
    }
  }

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Imagen ampliada de ${alt}`}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="lightbox-close"
          aria-label="Cerrar visor"
          onClick={stop(onClose)}
        >
          &times;
        </button>

        {hasMultiple ? (
          <>
            <button
              ref={prevBtnRef}
              type="button"
              className="lightbox-nav lightbox-prev"
              aria-label="Imagen anterior"
              disabled={currentIndex === 0}
              onClick={stop(() => setCurrentIndex((i) => Math.max(0, i - 1)))}
            >
              &lsaquo;
            </button>
            <button
              ref={nextBtnRef}
              type="button"
              className="lightbox-nav lightbox-next"
              aria-label="Imagen siguiente"
              disabled={currentIndex === images.length - 1}
              onClick={stop(() => setCurrentIndex((i) => Math.min(images.length - 1, i + 1)))}
            >
              &rsaquo;
            </button>
          </>
        ) : null}

        {allFailed ? (
          <div className="lightbox-error">
            <p>No se pudo cargar la imagen</p>
          </div>
        ) : (
          <img
            key={resolvedSrc}
            className="lightbox-image"
            src={resolvedSrc}
            alt={alt}
            onError={handleImageError}
            onClick={stop()}
          />
        )}

        {hasMultiple ? (
          <span className="lightbox-counter" aria-live="polite">
            {currentIndex + 1} de {images.length}
          </span>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
