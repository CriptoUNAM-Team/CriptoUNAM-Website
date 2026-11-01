import React, { useEffect, useRef, useState } from 'react'

/** "500+" → 500 y "+"; lo que no empieza por dígito se muestra tal cual. */
const PARTES = /^(\d[\d,]*)(.*)$/s
const salida = (t: number) => 1 - (1 - t) ** 4

/**
 * Una cifra que se arma sola al entrar en pantalla: sube desde cero con una
 * salida suave (el `Contador` de la landing de CEDUCT, en versión ligera).
 *
 * El valor final va en el HTML y en `aria-label`, así que un lector de
 * pantalla —o un navegador sin JS— lo lee completo. Con reduced-motion no
 * anima.
 */
const CifraViva: React.FC<{ valor: string; className?: string; duracion?: number }> = ({
  valor,
  className = '',
  duracion = 1600,
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const m = PARTES.exec(valor)
  const meta = m ? Number(m[1].replace(/,/g, '')) : 0
  const sufijo = m ? m[2] : ''
  const [actual, setActual] = useState<number | null>(null)

  useEffect(() => {
    const nodo = ref.current
    if (!m || !nodo || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let cuadro = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const inicio = performance.now()
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / duracion, 1)
          setActual(Math.round(meta * salida(t)))
          if (t < 1) cuadro = requestAnimationFrame(paso)
        }
        setActual(0)
        cuadro = requestAnimationFrame(paso)
      },
      { threshold: 0.6 }
    )
    io.observe(nodo)
    return () => {
      io.disconnect()
      cancelAnimationFrame(cuadro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor, duracion])

  return (
    <span ref={ref} className={className} aria-label={valor}>
      <span aria-hidden="true" className="tabular-nums">
        {m && actual !== null ? `${actual.toLocaleString('es-MX')}${sufijo}` : valor}
      </span>
    </span>
  )
}

export default CifraViva
