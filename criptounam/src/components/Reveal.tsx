import React, { useEffect, useRef } from 'react'
import { goyaReducedMotion, goyaReveal } from '../lib/goyaAnime'

type Props = {
  children: React.ReactNode
  /** Retraso de entrada en ms, para escalonar elementos hermanos. */
  delay?: number
  className?: string
  style?: React.CSSProperties
  /** Etiqueta a renderizar (por defecto `div`). */
  as?: 'div' | 'span' | 'section' | 'article' | 'header' | 'p' | 'h1' | 'h2' | 'h3'
  /**
   * Revela al montar, sin observer. Para lo que siempre está sobre el pliegue
   * —un hero, por ejemplo—: ahí la aparición al hacer scroll no aporta nada y
   * cualquier fallo de medición deja contenido invisible sin manera de
   * recuperarlo, porque el usuario nunca va a scrollear *hacia* él.
   */
  inmediato?: boolean
  /** Variante: `lift` (default) o `scale` (paneles / CTAs). */
  variante?: 'lift' | 'scale'
}

/**
 * Aparición al entrar en pantalla, impulsada por anime.js.
 *
 * Se revela una sola vez; no se vuelve a ocultar al salir de pantalla.
 * Respeta `prefers-reduced-motion`.
 */
const Reveal: React.FC<Props> = ({
  children,
  delay = 0,
  className = '',
  style,
  as: Tag = 'div',
  inmediato = false,
  variante = 'lift',
}) => {
  const ref = useRef<HTMLElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || done.current) return

    const revelar = () => {
      if (done.current) return
      done.current = true
      goyaReveal(el, {
        delay,
        y: variante === 'scale' ? 20 : 36,
        scale: variante === 'scale' ? 0.96 : undefined,
        duration: variante === 'scale' ? 780 : 920,
      })
    }

    if (inmediato) {
      revelar()
      return
    }

    if (goyaReducedMotion() || typeof IntersectionObserver === 'undefined') {
      revelar()
      return
    }

    let cancelado = false

    const mostrarSiEstaEnPantalla = () => {
      if (cancelado || done.current) return false
      const caja = el.getBoundingClientRect()
      const alto = window.innerHeight || document.documentElement.clientHeight
      if (caja.top >= alto || caja.bottom <= 0) return false
      revelar()
      return true
    }

    // Estado inicial oculto (anime lo anima después).
    el.style.opacity = '0'

    if (mostrarSiEstaEnPantalla()) return

    document.fonts?.ready.then(mostrarSiEstaEnPantalla).catch(() => {})

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        revelar()
        obs.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )
    obs.observe(el)
    return () => {
      cancelado = true
      obs.disconnect()
    }
  }, [inmediato, delay, variante])

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
