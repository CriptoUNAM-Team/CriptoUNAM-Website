import React, { useEffect, useMemo, useState } from 'react'
import {
  PIXEL_FORMAS,
  type Bitmap,
  type PixelForma,
} from './bitmaps'

const PASO = 10
const CICLO_MS = 140

type Props = {
  /** Forma predefinida del catálogo Goya. */
  forma?: PixelForma
  className?: string
  bitmap?: Bitmap
  camino?: ReadonlyArray<readonly [number, number]>
  estela?: number
  separacion?: number
  acento?: string
  titulo?: string
  /** Desfase del ciclo para que varias instancias no paren al unísono. */
  desfase?: number
}

/**
 * Motivo de píxeles con pulso ámbar. Siempre `max-w-full` + `h-auto` para no
 * cortarse en mobile; el padre no debe usar overflow oculto sobre él.
 */
const PixelFlow: React.FC<Props> = ({
  forma = 'orbita',
  className = '',
  bitmap: bitmapProp,
  camino: caminoProp,
  estela = 3,
  separacion = 1.4,
  acento = '#E9AF3C',
  titulo,
  desfase = 0,
}) => {
  const preset = PIXEL_FORMAS[forma]
  const bitmap = bitmapProp ?? preset.bitmap
  const camino = caminoProp ?? preset.camino

  const [tick, setTick] = useState(desfase % Math.max(camino.length, 1))
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
    const id = window.setInterval(
      () => setTick((t) => (t + 1) % camino.length),
      CICLO_MS
    )
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
  const vbW = columnas * PASO - separacion
  const vbH = filas * PASO - separacion

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
          opacity={on ? 1 : 0.5}
        />
      )
    })
  })

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={vbW}
      height={vbH}
      className={`block h-auto max-w-full shrink-0 overflow-visible ${className}`}
      role={titulo ? 'img' : 'presentation'}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      {celdas}
    </svg>
  )
}

export default PixelFlow

type FranjaProps = {
  formas?: PixelForma[]
  className?: string
  tamano?: 'sm' | 'md' | 'lg'
  tono?: string
  /**
   * `reparto` — a lo ancho (izq · centro · der), lo que se ve mejor en pantalla.
   * `grupo` — juntos al centro (uso puntual).
   */
  modo?: 'reparto' | 'grupo'
}

const TAM: Record<NonNullable<FranjaProps['tamano']>, string> = {
  sm: 'w-[clamp(2.25rem,11vw,3.75rem)]',
  md: 'w-[clamp(2.75rem,12vw,5rem)]',
  lg: 'w-[clamp(3.25rem,14vw,6rem)]',
}

/**
 * Motivos pixel repartidos a lo ancho de la página (no amontonados al centro).
 */
export const PixelFranja: React.FC<FranjaProps> = ({
  formas = ['orbita', 'cruz', 'diamante'],
  className = '',
  tamano = 'md',
  tono = 'text-goya-paper/50',
  modo = 'reparto',
}) => (
  <div
    className={`flex w-full max-w-full items-center overflow-visible ${
      modo === 'reparto'
        ? 'justify-between gap-3 sm:gap-6'
        : 'flex-wrap justify-center gap-4 sm:gap-6'
    } ${className}`}
    aria-hidden="true"
  >
    {formas.map((f, i) => (
      <PixelFlow
        key={`${f}-${i}`}
        forma={f}
        desfase={i * 9 + 2}
        className={`${TAM[tamano]} ${tono}`}
      />
    ))}
  </div>
)

type SeparadorProps = {
  formas?: PixelForma[]
  className?: string
  tamano?: FranjaProps['tamano']
  tono?: string
}

/**
 * Franja a todo el ancho entre secciones de la landing.
 * Vive fuera de paneles con clip-path para no cortarse.
 */
export const PixelSeparador: React.FC<SeparadorProps> = ({
  formas = ['escalera', 'anillo', 'cruz', 'diamante'],
  className = '',
  tamano = 'sm',
  tono = 'text-goya-paper/40',
}) => (
  <div
    className={`mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 md:px-12 md:py-10 ${className}`}
    aria-hidden="true"
  >
    <PixelFranja formas={formas} tamano={tamano} tono={tono} modo="reparto" />
  </div>
)
