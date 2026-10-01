import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Dice si conviene seguir animando.
 *
 * - `false` con reduced-motion, pestaña oculta o el nodo fuera del viewport.
 * - Así un setInterval o un loop de anime.js no sigue gastando CPU/batería
 *   cuando la página lleva horas abierta en segundo plano.
 */
export function useAnimacionActiva<T extends Element = HTMLDivElement>(
  opts: { rootMargin?: string; threshold?: number } = {}
): { activa: boolean; ref: RefObject<T | null> } {
  const ref = useRef<T | null>(null)
  // Empieza en false: hasta que el observer confirme, no gastamos CPU.
  const [enPantalla, setEnPantalla] = useState(false)
  const [paginaVisible, setPaginaVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible'
  )
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  useEffect(() => {
    const alCambiar = () => setPaginaVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', alCambiar)
    return () => document.removeEventListener('visibilitychange', alCambiar)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      ([entrada]) => setEnPantalla(entrada.isIntersecting),
      {
        rootMargin: opts.rootMargin ?? '80px 0px',
        threshold: opts.threshold ?? 0,
      }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [opts.rootMargin, opts.threshold])

  return {
    activa: !reducido && paginaVisible && enPantalla,
    ref,
  }
}

/** Pausa CSS/anime globales cuando la pestaña no se ve. */
export function usePausaPaginaOculta() {
  useEffect(() => {
    const alCambiar = () => {
      document.documentElement.dataset.paginaOculta =
        document.visibilityState === 'hidden' ? '1' : '0'
    }
    alCambiar()
    document.addEventListener('visibilitychange', alCambiar)
    return () => {
      document.removeEventListener('visibilitychange', alCambiar)
      delete document.documentElement.dataset.paginaOculta
    }
  }, [])
}
