import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Layers, Sprout, ArrowUpRight } from 'lucide-react'
import { HACKATHON_INFO, HACKATHON_TRACKS, type TrackReto } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const ICONOS = [Brain, Layers, Sprout]

const logoClass = (reto: TrackReto) =>
  reto.fondoOpaco
    ? 'h-8 w-auto max-w-[88px] object-contain opacity-90 [filter:invert(1)_grayscale(1)]'
    : 'h-8 w-auto max-w-[88px] object-contain opacity-90 [filter:brightness(0)_invert(1)]'

const RetoCard: React.FC<{ reto: TrackReto }> = ({ reto }) => {
  const interior = (
    <>
      <div className="flex shrink-0 items-center justify-center">
        {reto.logo ? (
          <img src={reto.logo} alt="" loading="lazy" className={logoClass(reto)} />
        ) : (
          <span className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
            {reto.nombre}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {reto.logo && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
            {reto.nombre}
          </p>
        )}
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{reto.descripcion}</p>
      </div>
      {reto.url && (
        <ArrowUpRight size={14} className="shrink-0 text-goya-amber/50 transition-colors group-hover:text-goya-amber" />
      )}
    </>
  )

  const clase =
    'group flex gap-3 rounded-sm border border-goya-amber/12 bg-goya-void/40 p-3 transition-colors duration-300 hover:border-goya-amber/30'

  if (reto.url) {
    return (
      <a href={reto.url} target="_blank" rel="noreferrer" className={`${clase} no-underline`}>
        {interior}
      </a>
    )
  }

  return <div className={clase}>{interior}</div>
}

/**
 * Tracks + qué esperar en una sola sección: el pitch del evento arriba y las
 * tres tarjetas de terreno abajo, sin repetir premios ni copy.
 */
const TracksExperiencia: React.FC = () => (
  <Seccion
    id="tracks"
    rotulo="Tracks"
    titulo="Elige tu terreno"
    intro={`${HACKATHON_INFO.horas} horas en la FI-UNAM: mentorías en vivo, jurado presencial y premios on-chain. Puedes cambiar de track hasta la entrega.`}
  >
    <Reveal as="div" delay={180} className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
        Llegas con una idea y sales con algo que funciona. Tres tracks con retos de patrocinador — Tangem en AI,
        Stellar · Avalanche · Pollar en Blockchain, y 10M $PUMA en Innovación.
      </p>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
        <Link
          to="/hackathon/dashboard"
          className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
          style={{ ['--cut' as string]: '9px' }}
        >
          Registra a tu equipo
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          to="/hackathon/equipos"
          className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
          style={{ ['--cut' as string]: '9px' }}
        >
          Busca equipo
        </Link>
      </div>
    </Reveal>

    <div className="grid gap-5 lg:grid-cols-3">
      {HACKATHON_TRACKS.map((track, i) => {
        const Icono = ICONOS[i] ?? Layers
        const destacado = track.id === 'innovacion'

        return (
          <Reveal
            key={track.id}
            as="article"
            delay={220 + i * 120}
            className={`goya-panel goya-panel-hover h-full ${destacado ? 'goya-panel-lit' : ''}`}
          >
            <div className="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <Icono size={30} strokeWidth={1.4} className="text-goya-amber" />
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-[11px] font-bold tracking-label text-goya-amber/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {track.premio.etiqueta && (
                    <span
                      className="goya-cut border border-goya-amber/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-label text-goya-amber"
                      style={{ ['--cut' as string]: '4px' }}
                    >
                      {track.premio.etiqueta}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mt-6 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
                {track.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{track.description}</p>

              {track.retos.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-label text-slate-500">
                    {track.retos.length === 1 ? 'Reto' : 'Retos'}
                  </p>
                  <div className="flex flex-col gap-2">
                    {track.retos.map((reto) => (
                      <RetoCard key={reto.id} reto={reto} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto border-t border-goya-amber/15 pt-5">
                <p className="font-mono text-[10px] uppercase tracking-label text-slate-500">Premio</p>
                <p
                  className={`mt-1 font-mono text-sm font-bold uppercase tracking-label ${
                    destacado ? 'text-goya-amber' : 'text-goya-paper'
                  }`}
                >
                  {track.premio.monto}
                </p>
                {track.premio.detalle && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{track.premio.detalle}</p>
                )}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  </Seccion>
)

export default TracksExperiencia
