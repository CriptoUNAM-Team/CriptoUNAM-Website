import React, { useMemo } from 'react'
import PixelSprite from './PixelSprite'
import { POSES_PERSONA } from './bitmaps'

type Props = {
  /** Número de figuras. Se reparten en una retícula que fluye sola. */
  cantidad?: number
  className?: string
  /**
   * Cada cuántas figuras cae una en ámbar. En el cartel el acento va salteado,
   * no en todas.
   */
  cadaCuantasAmbar?: number
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
const Multitud: React.FC<Props> = ({ cantidad = 24, className = '', cadaCuantasAmbar = 3 }) => {
  // La composición es determinista (depende solo del índice) para que no
  // cambie entre renders ni baile al rehidratar.
  const figuras = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        pose: POSES_PERSONA[i % POSES_PERSONA.length],
        conAmbar: i % cadaCuantasAmbar === 1,
        // Pequeño desfase vertical para que la fila no quede como un pautado.
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
        <span key={i} className="flex justify-center" style={{ transform: `translateY(${f.desfase}px)` }}>
          <PixelSprite
            bitmap={f.pose}
            separacion={0.9}
            // Sin ámbar, la figura entera hereda el color del contenedor.
            acento={f.conAmbar ? '#E9AF3C' : 'currentColor'}
            className="h-16 w-auto sm:h-20"
          />
        </span>
      ))}
    </div>
  )
}

export default Multitud
