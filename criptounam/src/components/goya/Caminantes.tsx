import React, { useEffect, useMemo, useState } from 'react'
import PixelSprite from './PixelSprite'
import { BITMAP_MONEDA, POSES_PERSONA } from './bitmaps'
import { useAnimacionActiva } from '../../hooks/useAnimacionActiva'

const CICLO_MS = 280

type Props = {
  /** Número de figuras que cruzan la franja. */
  cantidad?: number
  /** Alto de cada figura, en clases de Tailwind. */
  alto?: string
  /** Cada cuántas figuras una carga una moneda $PUMA. 0 = ninguna. */
  cadaCuantasMoneda?: number
  className?: string
}

/**
 * Figuras pixel caminando de lado a lado: la multitud del cartel, en marcha.
 *
 * Cada figura cruza la franja con su propia velocidad y desfase; alterna las
 * dos poses del cartel para el paso, y algunas llevan una moneda $PUMA que
 * flota sobre la cabeza. Todo se detiene fuera de pantalla, con la pestaña
 * oculta o con reduced-motion (entonces quedan quietas, repartidas).
 *
 * Decorativa: fuera del árbol de accesibilidad.
 */
const Caminantes: React.FC<Props> = ({
  cantidad = 7,
  alto = 'h-10 sm:h-12',
  cadaCuantasMoneda = 3,
  className = '',
}) => {
  const { activa, ref } = useAnimacionActiva<HTMLDivElement>()
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!activa) return
    const id = window.setInterval(() => setFrame((f) => f + 1), CICLO_MS)
    return () => window.clearInterval(id)
  }, [activa])

  // Velocidades y desfases fijos por índice: sin azar, el SSR y el cliente coinciden.
  const figuras = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => {
        const duracion = 26 + ((i * 7) % 11) * 2.2
        return {
          i,
          duracion,
          // Desfase negativo: arrancan repartidas por la franja, no todas en el borde.
          retraso: -((duracion * i) / cantidad),
          ambar: i % 4 === 1,
          moneda: cadaCuantasMoneda > 0 && i % cadaCuantasMoneda === 0,
          reposo: `${((i + 0.5) / cantidad) * 100}%`,
        }
      }),
    [cantidad, cadaCuantasMoneda]
  )

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`cripto-caminantes relative w-full overflow-hidden ${className}`}
      data-activa={activa ? '1' : '0'}
    >
      {/* Línea de suelo */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-goya-amber/25" />

      {figuras.map((f) => (
        <span
          key={f.i}
          className={`cripto-caminante absolute bottom-[3px] flex flex-col items-center ${
            f.ambar ? 'text-goya-amber' : 'text-goya-paper/75'
          }`}
          style={
            {
              '--dur': `${f.duracion}s`,
              '--retraso': `${f.retraso}s`,
              '--reposo': f.reposo,
            } as React.CSSProperties
          }
        >
          {f.moneda && (
            <span className="cripto-moneda mb-1 block text-goya-void">
              <PixelSprite bitmap={BITMAP_MONEDA} separacion={0.6} className="h-3 w-auto sm:h-3.5" />
            </span>
          )}
          <PixelSprite
            bitmap={POSES_PERSONA[(frame + f.i) % POSES_PERSONA.length]}
            separacion={0.9}
            className={`${alto} w-auto`}
          />
        </span>
      ))}

      <style>{`
        .cripto-caminantes { container-type: inline-size; }
        .cripto-caminante {
          left: 0;
          animation: criptoCruza var(--dur) linear var(--retraso) infinite;
          animation-play-state: paused;
        }
        .cripto-caminantes[data-activa='1'] .cripto-caminante { animation-play-state: running; }
        .cripto-moneda { animation: criptoFlota 1.4s ease-in-out infinite; animation-play-state: paused; }
        .cripto-caminantes[data-activa='1'] .cripto-moneda { animation-play-state: running; }
        @keyframes criptoCruza {
          from { transform: translateX(-60px); }
          to { transform: translateX(calc(100cqw + 60px)); }
        }
        @keyframes criptoFlota {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cripto-caminante { animation: none; left: var(--reposo); }
          .cripto-moneda { animation: none; }
        }
      `}</style>
    </div>
  )
}

export default Caminantes
