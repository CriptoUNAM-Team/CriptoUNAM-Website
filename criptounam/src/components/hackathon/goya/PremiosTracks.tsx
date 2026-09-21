import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Brain, Gift, Layers, Medal, Sprout, Trophy } from 'lucide-react'
import {
  HACKATHON_TRACKS,
  PREMIOS_EXTRA,
  PREMIOS_POR_TRACK,
  textoPremioLugar,
  type LugarPremio,
  type TrackReto,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const ICONOS_TRACK = [Brain, Layers, Sprout]
const PODIO = [
  { lugar: 2 as const, label: '2.º lugar', altura: 'h-28', icon: Medal },
  { lugar: 1 as const, label: '1.º lugar', altura: 'h-36', icon: Trophy },
  { lugar: 3 as const, label: '3.º lugar', altura: 'h-24', icon: Medal },
]

const logoClass = (reto: TrackReto) =>
  reto.fondoOpaco
    ? 'h-7 w-auto max-w-[72px] object-contain opacity-90 [filter:invert(1)_grayscale(1)]'
    : 'h-7 w-auto max-w-[72px] object-contain opacity-90 [filter:brightness(0)_invert(1)]'

const PodioCard: React.FC<{ premio: LugarPremio; altura: string; label: string; destacado?: boolean }> = ({
  premio,
  altura,
  label,
  destacado,
}) => (
  <div
    className={`flex flex-col items-center justify-end ${altura}`}
    aria-label={`${label}: ${textoPremioLugar(premio)}`}
  >
    <div
      className={`goya-cut flex w-full min-w-[100px] max-w-[140px] flex-col items-center justify-center border px-3 py-4 text-center transition-colors duration-300 sm:min-w-[120px] ${
        destacado
          ? 'border-goya-amber bg-goya-amber/10'
          : 'border-goya-amber/30 bg-goya-void/60'
      }`}
      style={{ ['--cut' as string]: '8px' }}
    >
      <span className="font-mono text-[9px] uppercase tracking-label text-slate-500">{label}</span>
      <p
        className={`mt-2 font-mono text-xs font-bold uppercase leading-snug tracking-label sm:text-sm ${
          destacado ? 'text-goya-amber' : 'text-goya-paper'
        }`}
      >
        {textoPremioLugar(premio)}
      </p>
    </div>
  </div>
)

const MiniPodio: React.FC<{ premios: LugarPremio[]; etiqueta: string }> = ({ premios, etiqueta }) => {
  const premioPorLugar = (lugar: 1 | 2 | 3) => premios.find((p) => p.lugar === lugar)
  return (
    <div className="goya-panel goya-panel-lit flex flex-col p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">{etiqueta}</p>
      <div className="mt-5 flex flex-1 items-end justify-center gap-2 sm:gap-3">
        {PODIO.map(({ lugar, label, altura }) => {
          const p = premioPorLugar(lugar)
          if (!p) return null
          return (
            <PodioCard
              key={lugar}
              premio={p}
              altura={altura}
              label={label}
              destacado={lugar === 1}
            />
          )
        })}
      </div>
    </div>
  )
}

const PremiosTracks: React.FC = () => {
  const [trackId, setTrackId] = useState(HACKATHON_TRACKS[0]?.id ?? 'ai')
  const track = HACKATHON_TRACKS.find((t) => t.id === trackId) ?? HACKATHON_TRACKS[0]
  const indice = HACKATHON_TRACKS.findIndex((t) => t.id === track?.id)
  const IconoTrack = ICONOS_TRACK[indice] ?? Layers

  const retosConPremio = useMemo(
    () => (track?.retos ?? []).filter((r) => (r.premios?.length ?? 0) > 0),
    [track]
  )
  const premiosTrack = PREMIOS_POR_TRACK[track?.id ?? ''] ?? []

  return (
    <Seccion
      id="premios"
      rotulo="Premios"
      titulo="Lo que hay en juego"
      intro="Podios por patrocinador: Tangem, Stellar, Avalanche y CriptoUNAM. En Innovación suma $PUMA en Avalanche."
    >
      <Reveal as="div" delay={120} className="flex flex-wrap gap-2">
        {HACKATHON_TRACKS.map((t, i) => {
          const Icono = ICONOS_TRACK[i] ?? Layers
          const on = t.id === track?.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrackId(t.id)}
              aria-pressed={on}
              className={`goya-cut inline-flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-label transition-colors duration-300 sm:text-[11px] ${
                on
                  ? 'bg-goya-amber text-goya-void'
                  : 'border border-goya-amber/30 bg-transparent text-slate-400 hover:border-goya-amber hover:text-goya-amber'
              }`}
              style={{ ['--cut' as string]: '8px' }}
            >
              <Icono size={14} strokeWidth={1.5} />
              {t.name}
            </button>
          )
        })}
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(280px,1fr)] lg:gap-8">
        <Reveal as="div" delay={180} className="goya-panel p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <IconoTrack size={32} strokeWidth={1.4} className="shrink-0 text-goya-amber" />
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wide text-goya-paper sm:text-3xl">
                Track {track?.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{track?.description}</p>
              {track?.premio.detalle && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-goya-amber">
                  {track.premio.detalle}
                </p>
              )}
            </div>
          </div>

          {track && track.retos.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-label text-slate-500">
                {track.retos.length === 1 ? 'Reto patrocinado' : 'Retos patrocinados'}
              </p>
              <div className="flex flex-col gap-2">
                {track.retos.map((reto) => (
                  <RetoFila key={reto.id} reto={reto} />
                ))}
              </div>
            </div>
          )}

          {track && track.retos.length === 0 && (
            <p className="mt-6 text-sm text-slate-500">
              Track abierto CriptoUNAM: cualquier stack. La bolsa se reparte entre los tres mejores
              proyectos del jurado.
            </p>
          )}
        </Reveal>

        {retosConPremio.length > 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {retosConPremio.map((reto, i) => (
              <Reveal key={reto.id} as="div" delay={200 + i * 60}>
                <MiniPodio premios={reto.premios!} etiqueta={reto.nombre} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal as="div" delay={220}>
            <MiniPodio
              premios={retosConPremio[0]?.premios ?? premiosTrack}
              etiqueta={
                retosConPremio[0]
                  ? `Podio · ${retosConPremio[0].nombre}`
                  : `Podio · ${track?.name ?? 'track'}`
              }
            />
          </Reveal>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PREMIOS_EXTRA.map((extra, i) => (
          <Reveal key={extra.id} as="article" delay={260 + i * 80} className="goya-panel goya-panel-hover p-6">
            <div className="flex items-start gap-3">
              <Gift size={24} strokeWidth={1.4} className="shrink-0 text-goya-amber/70" />
              <div>
                <h4 className="font-display text-lg uppercase tracking-wide text-goya-paper">{extra.titulo}</h4>
                <p className="mt-1 font-mono text-xs font-bold uppercase tracking-label text-goya-amber">
                  {extra.monto}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{extra.descripcion}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="div" delay={320} className="mt-8 flex justify-center">
        <Link
          to="/hackathon/dashboard"
          className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
          style={{ ['--cut' as string]: '9px' }}
        >
          Registra a tu equipo
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </Seccion>
  )
}

const RetoFila: React.FC<{ reto: TrackReto }> = ({ reto }) => {
  const interior = (
    <>
      {reto.logo ? (
        <img src={reto.logo} alt="" loading="lazy" className={logoClass(reto)} />
      ) : (
        <span className="font-mono text-[10px] font-bold uppercase text-goya-amber">{reto.nombre}</span>
      )}
      <div className="min-w-0 flex-1">
        {reto.logo && (
          <p className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">{reto.nombre}</p>
        )}
        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{reto.descripcion}</p>
        {reto.premios && reto.premios.length > 0 && (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-goya-amber/80">
            {reto.premios.map((p) => `${p.lugar}º ${textoPremioLugar(p)}`).join(' · ')}
          </p>
        )}
      </div>
      {reto.url && <ArrowUpRight size={13} className="shrink-0 text-goya-amber/50" />}
    </>
  )

  const clase =
    'group flex gap-3 rounded-sm border border-goya-amber/12 bg-goya-void/40 p-3 transition-colors hover:border-goya-amber/30'

  if (reto.url) {
    return (
      <a href={reto.url} target="_blank" rel="noreferrer" className={`${clase} no-underline`}>
        {interior}
      </a>
    )
  }
  return <div className={clase}>{interior}</div>
}

export default PremiosTracks
