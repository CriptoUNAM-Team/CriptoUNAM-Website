import React from 'react'
import { Brain, Layers, Sprout } from 'lucide-react'
import { HACKATHON_TRACKS, PREMIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'

const ICONOS = [Brain, Layers, Sprout]

/** Premio asociado a cada track, para no repetir cifras en dos sitios. */
const premioDeTrack = (indice: number) => {
  const deTrack = PREMIOS.filter((p) => p.categoria === 'Track')
  return deTrack[indice]?.monto ?? 'Por confirmar'
}

const Tracks: React.FC = () => (
  <section
    id="tracks"
    className="flex min-h-screen flex-col justify-center px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
  >
    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <Reveal as="div" delay={120} className="badge-accent w-fit">
        <span className="font-mono text-[11px] uppercase tracking-label text-accent">
          Tres tracks
        </span>
      </Reveal>

      <Reveal
        as="p"
        delay={220}
        className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl"
      >
        Elige el que mejor encaje con tu equipo. Puedes cambiar de track hasta el
        momento de la entrega.
      </Reveal>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {HACKATHON_TRACKS.map((track, i) => {
        const Icono = ICONOS[i] ?? Layers
        return (
          <Reveal
            key={track.id}
            as="article"
            delay={250 + i * 120}
            className="flex h-full flex-col rounded-xl border border-accent-border bg-white/10 p-6 backdrop-blur-md"
          >
            <Icono size={32} className="text-accent" />
            <h3 className="mt-4 text-xl font-medium text-white sm:text-2xl">{track.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
              {track.description}
            </p>
            <span className="mt-5 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/70">
              Premio: {premioDeTrack(i)}
            </span>
          </Reveal>
        )
      })}
    </div>
  </section>
)

export default Tracks
