import React, { useEffect, useRef, useState } from 'react'

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
  inmediato = false,
}) => {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (inmediato) {
      setVisible(true)
      return
    }

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

    /**
     * Lo que ya está en pantalla se revela sin observer.
     *
     * El observer solo por sí mismo dejaba en blanco el bloque inferior del
     * hero: cuando evalúa la primera vez, las fuentes web todavía no han
     * cargado, el titular ocupa otra altura y ese bloque cae fuera del
     * viewport. Al asentarse la maquetación el elemento ya está donde toca,
     * pero como la página no se ha movido no siempre llega una segunda
     * notificación, y el contenido se quedaba en `opacity: 0` para siempre.
     *
     * Midiendo la posición real en el montaje, lo visible aparece siempre y el
     * observer queda solo para lo que hay más abajo, que es su caso de uso.
     */
    let cancelado = false

    const mostrarSiEstaEnPantalla = () => {
      if (cancelado) return false
      const caja = el.getBoundingClientRect()
      const alto = window.innerHeight || document.documentElement.clientHeight
      if (caja.top >= alto || caja.bottom <= 0) return false
      setVisible(true)
      return true
    }

    if (mostrarSiEstaEnPantalla()) return

    // Segunda pasada al terminar de cargar las fuentes: hasta ese momento el
    // texto ocupa otra altura, así que un elemento puede estar fuera de
    // pantalla al montar y dentro un instante después.
    document.fonts?.ready.then(mostrarSiEstaEnPantalla).catch(() => {})

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisible(true)
        obs.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => {
      cancelado = true
      obs.disconnect()
    }
  }, [inmediato])

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
