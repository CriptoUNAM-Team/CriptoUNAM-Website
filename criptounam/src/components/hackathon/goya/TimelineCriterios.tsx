import React, { useState } from 'react'
import { AGENDA, CRITERIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

/** Peso de cada criterio: los cuatro puntúan igual. */
const PESO = Math.round(100 / CRITERIOS.length)

const TimelineCriterios: React.FC = () => {
  const [dia, setDia] = useState(AGENDA[0]?.id ?? '')
  const activo = AGENDA.find((d) => d.id === dia) ?? AGENDA[0]

  return (
    <Seccion
      id="timeline"
      numero="04"
      rotulo="Programa"
      titulo="Cinco días, un BUIDL"
      intro="El reloj de 72 horas arranca en el kickoff del martes y se detiene el viernes a las 9:00. El sábado es Demo Day."
    >
      <div className="flex flex-col gap-14 lg:flex-row lg:justify-between lg:gap-20">
        {/* ---- Programa por día ---- */}
        <div className="min-w-0 flex-1">
          <Reveal as="div" delay={140} className="flex flex-wrap gap-2">
            {AGENDA.map((d) => {
              const seleccionado = d.id === activo?.id
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDia(d.id)}
                  aria-pressed={seleccionado}
                  className={`goya-cut px-4 py-2 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                    seleccionado
                      ? 'bg-goya-amber text-goya-void'
                      : 'border border-goya-amber/25 text-slate-400 hover:border-goya-amber/60 hover:text-goya-amber'
                  }`}
                  style={{ ['--cut' as string]: '7px' }}
                >
                  {d.etiqueta.split('·')[0].trim()}
                </button>
              )
            })}
          </Reveal>

          {/* Línea de tiempo: el filete ámbar de la izquierda es el eje. */}
          <ol className="mt-9 list-none border-l border-goya-amber/20 p-0 pl-0">
            {activo?.items.map((item, i) => (
              <Reveal
                key={`${activo.id}-${item.hora}-${i}`}
                as="div"
                delay={160 + i * 80}
                className="relative pb-7 pl-7 last:pb-0"
              >
                {/* Marca del eje: cuadro relleno en los hitos, hueco en el resto. */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 h-2 w-2 -translate-x-1/2 ${
                    item.hito ? 'bg-goya-amber' : 'border border-goya-amber/50 bg-goya-void'
                  }`}
                />
                <p className="font-mono text-[11px] font-bold tracking-label text-goya-amber">
                  {item.hora}
                </p>
                <p
                  className={`mt-1 font-display text-base uppercase tracking-wide ${
                    item.hito ? 'text-goya-amber' : 'text-goya-paper'
                  }`}
                >
                  {item.titulo}
                </p>
                {item.descripcion && (
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.descripcion}</p>
                )}
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ---- Criterios de evaluación ---- */}
        <div className="lg:w-[420px] lg:shrink-0">
          <Reveal
            as="h3"
            delay={140}
            className="font-display text-2xl uppercase tracking-wide text-goya-paper"
          >
            Cómo se califica
          </Reveal>
          <Reveal as="p" delay={190} className="mt-3 text-sm leading-relaxed text-slate-400">
            El jurado puntúa estos cuatro ejes con el mismo peso.
          </Reveal>

          <div className="mt-7 flex flex-col gap-3">
            {CRITERIOS.map((c, i) => (
              <Reveal key={c.id} as="div" delay={220 + i * 90} className="goya-panel">
                <div className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] font-bold tracking-label text-goya-amber">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-base uppercase tracking-wide text-goya-paper">
                        {c.titulo}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] tracking-label text-goya-amber">
                      {PESO}%
                    </span>
                  </div>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-slate-400">{c.descripcion}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Seccion>
  )
}

export default TimelineCriterios
