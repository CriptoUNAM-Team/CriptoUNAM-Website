import React, { useEffect, useMemo, useState } from 'react'
import PixelSprite from './PixelSprite'
import { POSES_PERSONA, type Bitmap } from './bitmaps'

const CICLO_MS = 450

type Props = {
  /** Número de figuras. Se reparten en una retícula que fluye sola. */
  cantidad?: number
  className?: string
  /**
   * Cada cuántas figuras cae una en ámbar. En el cartel el acento va salteado,
   * no en todas.
   */
  cadaCuantasAmbar?: number
  /** Ciclo de caminata (poses A/B) y rebote sutil. */
  animado?: boolean
}

type FiguraProps = {
  indice: number
  conAmbar: boolean
  desfase: number
  frame: number
  animado: boolean
}

const FiguraCaminando: React.FC<FiguraProps> = ({ indice, conAmbar, desfase, frame, animado }) => {
  const pose: Bitmap = animado ? POSES_PERSONA[(frame + indice) % POSES_PERSONA.length] : POSES_PERSONA[indice % POSES_PERSONA.length]
  const acento = conAmbar ? '#E9AF3C' : 'currentColor'

  return (
    <span
      className={`flex justify-center ${animado ? 'goya-walk-bob' : ''}`}
      style={{
        transform: animado ? undefined : `translateY(${desfase}px)`,
        animationDelay: animado ? `${(indice % 8) * 55}ms` : undefined,
      }}
    >
      <PixelSprite bitmap={pose} separacion={0.9} acento={acento} className="h-16 w-auto sm:h-20" />
    </span>
  )
}

/**
 * La retícula de figuras caminando del cartel de Community Partner.
 *
 * Es el motivo de comunidad del sitio: mucha gente distinta avanzando en la
 * misma dirección. Alterna las dos poses del ciclo y reparte el acento ámbar
 * salteado, como el original.
 *
 * Decorativa por completo — no entra en el árbol de accesibilidad.
 */
const Multitud: React.FC<Props> = ({
  cantidad = 24,
  className = '',
  cadaCuantasAmbar = 3,
  animado = false,
}) => {
  const [frame, setFrame] = useState(0)
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  const enMovimiento = animado && !reducido

  useEffect(() => {
    if (!enMovimiento) return
    const id = window.setInterval(() => setFrame((f) => (f + 1) % POSES_PERSONA.length), CICLO_MS)
    return () => window.clearInterval(id)
  }, [enMovimiento])

  const figuras = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        conAmbar: i % cadaCuantasAmbar === 1,
        desfase: (i % 4) * 3,
      })),
    [cantidad, cadaCuantasAmbar]
  )

  return (
    <div
      className={`grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-6 sm:gap-x-6 lg:grid-cols-8 ${className}`}
      aria-hidden="true"
    >
      {figuras.map((f, i) => (
        <FiguraCaminando
          key={i}
          indice={i}
          conAmbar={f.conAmbar}
          desfase={f.desfase}
          frame={frame}
          animado={enMovimiento}
        />
      ))}
    </div>
  )
}

export default Multitud
