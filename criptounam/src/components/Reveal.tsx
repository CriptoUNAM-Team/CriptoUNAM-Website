import React, { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  /** Retraso de entrada en ms, para escalonar elementos hermanos. */
  delay?: number
  className?: string
  style?: React.CSSProperties
  /** Etiqueta a renderizar (por defecto `div`). */
  as?: 'div' | 'span' | 'section' | 'article' | 'header' | 'p' | 'h1' | 'h2' | 'h3'
}

/**
 * Aparición al entrar en pantalla: sube y se desvanece hacia visible.
 *
 * El estado vive en React y los estilos van inline a propósito. La versión
 * anterior alternaba una clase CSS desde el observer, pero al convivir con las
 * capas de Tailwind las utilidades ganaban la cascada y el contenido se
 * quedaba en `opacity: 0` para siempre: un fallo que deja la página en blanco.
 * Con estilos inline no hay cascada que valga.
 *
 * Se revela una sola vez; no se vuelve a ocultar al salir de pantalla.
 */
const Reveal: React.FC<Props> = ({
  children,
  delay = 0,
  className = '',
  style,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reducido =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Sin soporte o con menos movimiento pedido, se muestra ya: el contenido
    // nunca debe quedar oculto esperando una animación.
    if (reducido || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisible(true)
        obs.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(2rem)',
        transition: `opacity 700ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
