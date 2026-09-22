import React, { useEffect, useMemo, useState } from 'react'
import { BITMAP_ORBITA, ORBITA_CAMINO, type Bitmap } from './bitmaps'

const PASO = 10
const CICLO_MS = 120

type Props = {
  className?: string
  /** Bitmap base (celdas '#'). Por defecto la órbita Goya. */
  bitmap?: Bitmap
  /** Camino del pulso ámbar. Por defecto ORBITA_CAMINO. */
  camino?: ReadonlyArray<readonly [number, number]>
  /** Cuántas celdas del camino brillan a la vez. */
  estela?: number
  separacion?: number
  acento?: string
  titulo?: string
}

/**
 * Motivo de píxeles con pulso ámbar que recorre el patrón — mismo lenguaje
 * que el cartel (retícula nítida, steps, sin fade).
 */
const PixelFlow: React.FC<Props> = ({
  className = '',
  bitmap = BITMAP_ORBITA,
  camino = ORBITA_CAMINO,
  estela = 3,
  separacion = 1.4,
  acento = '#E9AF3C',
  titulo,
}) => {
  const [tick, setTick] = useState(0)
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
    if (reducido || camino.length === 0) return
    const id = window.setInterval(() => setTick((t) => (t + 1) % camino.length), CICLO_MS)
    return () => window.clearInterval(id)
  }, [reducido, camino.length])

  const activos = useMemo(() => {
    const set = new Set<string>()
    if (camino.length === 0) return set
    const n = reducido ? 1 : estela
    for (let i = 0; i < n; i++) {
      const [x, y] = camino[(tick - i + camino.length) % camino.length]
      set.add(`${x},${y}`)
    }
    return set
  }, [tick, camino, estela, reducido])

  const columnas = Math.max(...bitmap.map((f) => f.length))
  const filas = bitmap.length
  const lado = PASO - separacion

  const celdas: React.ReactNode[] = []
  bitmap.forEach((fila, y) => {
    ;[...fila].forEach((celda, x) => {
      if (celda === '.') return
      const on = activos.has(`${x},${y}`)
      celdas.push(
        <rect
          key={`${x}-${y}`}
          x={x * PASO}
          y={y * PASO}
          width={lado}
          height={lado}
          fill={on ? acento : 'currentColor'}
          opacity={on ? 1 : 0.55}
        />
      )
    })
  })

  return (
    <svg
      viewBox={`0 0 ${columnas * PASO - separacion} ${filas * PASO - separacion}`}
      className={className}
      role={titulo ? 'img' : 'presentation'}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {celdas}
    </svg>
  )
}

export default PixelFlow
