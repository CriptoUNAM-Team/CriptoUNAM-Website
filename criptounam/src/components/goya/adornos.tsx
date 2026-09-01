import React from 'react'

/**
 * Los adornos geométricos que el cartel de Goya Hack reparte por los márgenes:
 * grupos de barras ámbar, escuadras y cruces.
 *
 * Son puramente decorativos — todos salen del árbol de accesibilidad — y viven
 * juntos aquí para que las secciones no repitan el mismo SVG suelto.
 */

type BarrasProps = {
  className?: string
  /**
   * `horizontal` apila cuatro barras (el motivo de la esquina superior
   * izquierda del cartel); `vertical` las pone en fila, como junto a
   * "FACULTAD DE INGENIERÍA".
   */
  orientacion?: 'horizontal' | 'vertical'
}

export const Barras: React.FC<BarrasProps> = ({
  className = '',
  orientacion = 'horizontal',
}) => (
  <span
    className={`flex w-fit gap-[7px] ${orientacion === 'horizontal' ? 'flex-col' : ''} ${className}`}
    aria-hidden="true"
  >
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className={
          orientacion === 'horizontal'
            ? 'block h-[9px] w-11 bg-goya-amber'
            : 'block h-7 w-[9px] bg-goya-amber'
        }
      />
    ))}
  </span>
)

/** Escuadra de esquina: dos trazos finos en ángulo, como el pie del cartel. */
export const Marco: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width="48"
    height="48"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M47.5 0.5 v47 h-47" />
    <path d="M47.5 0.5 L14 34" />
  </svg>
)

/** Columna de cruces "+", el ritmo vertical que el cartel usa junto a la G. */
export const Cruces: React.FC<{ className?: string; cantidad?: number }> = ({
  className = '',
  cantidad = 4,
}) => (
  <span className={`flex flex-col gap-6 text-goya-amber/70 ${className}`} aria-hidden="true">
    {Array.from({ length: cantidad }, (_, i) => (
      <span key={i} className="goya-cross" />
    ))}
  </span>
)

/**
 * Antetítulo de sección en mono: encabeza cada bloque igual que el antetítulo
 * encabeza el cartel.
 *
 * Llevaba delante el número de bloque ("04") y un filete ámbar. Se quitaron los
 * dos: numerar obliga a renumerar cada vez que se mueve o se añade una sección
 * —ya pasó al meter el vídeo— y no le dice nada a quien lee. Queda la etiqueta,
 * que es lo único que informa.
 */
export const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-mono text-[11px] uppercase tracking-label text-goya-amber">
    {children}
  </span>
)
