import React, { useId } from 'react'
import type { Bitmap } from './bitmaps'

/**
 * Dibuja un mapa de bits de `bitmaps.ts` como SVG.
 *
 * Se usa SVG y no una retícula de `div`s: son decenas de celdas por figura,
 * escala sin perder el canto nítido y deja un solo nodo en el DOM. El color
 * principal se hereda con `currentColor`, así que la clase de texto del padre
 * manda; las celdas de acento llevan el ámbar fijo.
 */

/** Paso de la retícula y lado del cuadro: la diferencia es la separación. */
const PASO = 10

type Props = {
  bitmap: Bitmap
  className?: string
  /** Etiqueta accesible. Sin ella el sprite sale del árbol de accesibilidad. */
  titulo?: string
  /**
   * Separación entre celdas, en unidades de la retícula. El cartel del
   * hackathon separa los cuadros de la G; las figuras del cartel de comunidad
   * van casi pegadas.
   */
  separacion?: number
  /**
   * Escalona la aparición de las celdas al montar, en diagonal. Solo para
   * piezas grandes y únicas: repetido en una retícula, distrae.
   */
  animado?: boolean
  /** Color de las celdas de acento. */
  acento?: string
}

const PixelSprite: React.FC<Props> = ({
  bitmap,
  className = '',
  titulo,
  separacion = 1.6,
  animado = false,
  acento = '#E9AF3C',
}) => {
  // `useId` evita que dos instancias compartan el nombre de la animación.
  const id = useId().replace(/:/g, '')

  const columnas = Math.max(...bitmap.map((f) => f.length))
  const filas = bitmap.length
  const lado = PASO - separacion

  const celdas: React.ReactNode[] = []
  bitmap.forEach((fila, y) => {
    ;[...fila].forEach((celda, x) => {
      if (celda === '.') return
      celdas.push(
        <rect
          key={`${x}-${y}`}
          x={x * PASO}
          y={y * PASO}
          width={lado}
          height={lado}
          fill={celda === 'A' ? acento : 'currentColor'}
          style={animado ? { animationDelay: `${(x + y) * 26}ms` } : undefined}
          className={animado ? `goya-pixel-${id}` : undefined}
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
      {animado && (
        <style>{`
          .goya-pixel-${id} { opacity: 0; animation: goyaPixelIn 420ms ease-out forwards; }
          @media (prefers-reduced-motion: reduce) {
            .goya-pixel-${id} { opacity: 1; animation: none; }
          }
        `}</style>
      )}
      {celdas}
    </svg>
  )
}

export default PixelSprite
