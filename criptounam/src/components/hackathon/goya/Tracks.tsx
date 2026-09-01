import React from 'react'
import { Brain, Layers, Sprout } from 'lucide-react'
import { HACKATHON_TRACKS, PREMIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const ICONOS = [Brain, Layers, Sprout]

/** Premio asociado a cada track, para no repetir cifras en dos sitios. */
const premioDeTrack = (indice: number) => {
  const deTrack = PREMIOS.filter((p) => p.categoria === 'Track')
  return deTrack[indice]?.monto ?? 'Por confirmar'
}

const Tracks: React.FC = () => (
  <Seccion
    id="tracks"
    rotulo="Tres tracks"
    titulo="Elige tu terreno"
    intro="Elige el que mejor encaje con tu equipo. Puedes cambiar de track hasta el momento de la entrega."
  >
    <div className="grid gap-5 md:grid-cols-3">
      {HACKATHON_TRACKS.map((track, i) => {
        const Icono = ICONOS[i] ?? Layers
        return (
          <Reveal
            key={track.id}
            as="article"
            delay={200 + i * 120}
            className="goya-panel goya-panel-hover h-full"
          >
            <div className="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <Icono size={30} strokeWidth={1.4} className="text-goya-amber" />
                <span className="font-mono text-[11px] font-bold tracking-label text-goya-amber/50">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
                {track.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {track.description}
              </p>

              <span className="mt-6 flex items-center gap-2 border-t border-goya-amber/15 pt-4 font-mono text-[10px] uppercase tracking-label text-slate-500">
                Premio
                <span className="text-goya-amber">{premioDeTrack(i)}</span>
              </span>
            </div>
          </Reveal>
        )
      })}
    </div>
  </Seccion>
)

export default Tracks
