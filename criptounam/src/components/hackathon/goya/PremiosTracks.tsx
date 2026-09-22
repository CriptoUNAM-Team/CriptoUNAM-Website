import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Brain, Gift, Layers, Medal, PenLine, Trophy, Users } from 'lucide-react'
import {
  HACKATHON_TRACKS,
  PREMIOS_EXTRA,
  PREMIOS_POR_TRACK,
  TOTAL_PREMIOS_PUMA,
  TOTAL_PREMIOS_USD,
  textoPremioLugar,
  type LugarPremio,
  type TrackReto,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import PixelFlow from '../../goya/PixelFlow'

const ICONOS_TRACK = [Brain, Layers, PenLine]

/** Orden visual de podio: 2.º · 1.º · 3.º */
const PODIO_VISUAL = [
  { lugar: 2 as const, label: '2.º', altura: 'h-[4.5rem] sm:h-24', icon: Medal },
  { lugar: 1 as const, label: '1.º', altura: 'h-24 sm:h-32', icon: Trophy },
  { lugar: 3 as const, label: '3.º', altura: 'h-16 sm:h-20', icon: Medal },
]

const logoClass = (reto: TrackReto) => {
  const base = 'h-7 w-auto max-w-[72px] object-contain opacity-90'
  if (reto.colorPropio) return base
  if (reto.fondoOpaco) return `${base} [filter:invert(1)_grayscale(1)]`
  return `${base} [filter:brightness(0)_invert(1)]`
}

const MiniPodio: React.FC<{ premios: LugarPremio[]; etiqueta: string }> = ({ premios, etiqueta }) => {
  const porLugar = (lugar: 1 | 2 | 3) => premios.find((p) => p.lugar === lugar)

  return (
    <div className="goya-panel goya-panel-lit flex h-full flex-col p-4 sm:p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
        {etiqueta}
      </p>
      <div className="mt-5 flex flex-1 items-end justify-center gap-2 sm:gap-3">
        {PODIO_VISUAL.map(({ lugar, label, altura, icon: Icono }) => {
          const p = porLugar(lugar)
          if (!p) return null
          const top = lugar === 1
          return (
            <div
              key={lugar}
              className={`flex w-full max-w-[7.5rem] flex-col items-center justify-end ${altura}`}
              aria-label={`${label} lugar: ${textoPremioLugar(p)}`}
            >
              <Icono
                size={top ? 18 : 14}
                strokeWidth={1.5}
                className={`mb-2 ${top ? 'text-goya-amber' : 'text-goya-amber/45'}`}
              />
              <div
                className={`goya-cut flex w-full flex-1 flex-col items-center justify-center border px-2 py-3 text-center transition-colors ${
                  top
                    ? 'border-goya-amber bg-goya-amber text-goya-void shadow-[0_0_28px_rgba(233,175,60,0.22)]'
                    : 'border-goya-amber/35 bg-goya-void/70 text-goya-paper'
                }`}
                style={{ ['--cut' as string]: '8px' }}
              >
                <span
                  className={`font-mono text-[9px] font-bold uppercase tracking-label ${
                    top ? 'text-goya-void/70' : 'text-slate-500'
                  }`}
                >
                  {label} lugar
                </span>
                <p
                  className={`mt-1.5 font-display text-base uppercase leading-none tracking-wide sm:text-lg ${
                    top ? 'text-goya-void' : 'text-goya-amber'
                  }`}
                >
                  {textoPremioLugar(p)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PoolCard: React.FC<{ usd: number; etiqueta: string; detalle: string }> = ({
  usd,
  etiqueta,
  detalle,
}) => (
  <div className="goya-panel goya-panel-lit flex h-full flex-col justify-between p-5 sm:p-6">
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
          {etiqueta}
        </p>
        <span
          className="goya-cut inline-flex items-center gap-1.5 border border-goya-amber/40 px-2 py-1 font-mono text-[9px] uppercase tracking-label text-goya-amber"
          style={{ ['--cut' as string]: '5px' }}
        >
          <Users size={11} />
          Prize pool
        </span>
      </div>
      <p className="mt-5 font-display text-4xl uppercase leading-none tracking-wide text-goya-amber sm:text-5xl">
        ${usd.toLocaleString('en-US')} USD
      </p>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{detalle}</p>
    </div>
    <p className="mt-6 border-t border-goya-amber/15 pt-4 font-mono text-[10px] uppercase tracking-label text-slate-500">
      Integra Pollar · entras al pool
    </p>
  </div>
)

const PremiosTracks: React.FC = () => {
  const [trackId, setTrackId] = useState(HACKATHON_TRACKS[0]?.id ?? 'ai')
  const track = HACKATHON_TRACKS.find((t) => t.id === trackId) ?? HACKATHON_TRACKS[0]
  const indice = HACKATHON_TRACKS.findIndex((t) => t.id === track?.id)
  const IconoTrack = ICONOS_TRACK[indice] ?? Layers

  const retosConPremio = useMemo(
    () =>
      (track?.retos ?? []).filter(
        (r) => (r.premios?.length ?? 0) > 0 || Boolean(r.pool)
      ),
    [track]
  )
  const premiosTrack = PREMIOS_POR_TRACK[track?.id ?? ''] ?? []

  return (
    <Seccion
      id="premios"
      rotulo="Premios"
      titulo="Lo que hay en juego"
      intro="Bolsa estrella: 85M $PUMA en AI (CriptoUNAM). En USD: Stellar, Avalanche, Pollar ($200 pool) y Contenido (Tangem). Aparte: 3 MoureDev Pro y aceleradora Instaward para ganadores Stellar."
    >
      <Reveal as="div" delay={100} className="mb-10 md:mb-12">
        <div
          className="goya-cut relative overflow-hidden border border-goya-amber/40 bg-goya-amber/10 px-6 py-8 text-center sm:px-10 sm:py-10"
          style={{ ['--cut' as string]: '14px' }}
        >
          <PixelFlow
            className="pointer-events-none absolute -left-2 top-1/2 w-14 -translate-y-1/2 text-goya-paper/35 opacity-70 sm:w-20"
          />
          <PixelFlow
            className="pointer-events-none absolute -right-2 top-1/2 w-14 -translate-y-1/2 scale-x-[-1] text-goya-paper/35 opacity-70 sm:w-20"
          />
          <p className="relative font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber sm:text-[11px]">
            Bolsa $PUMA · track AI · CriptoUNAM
          </p>
          <p className="relative mt-3 font-display text-5xl uppercase leading-none tracking-wide text-goya-amber sm:text-6xl md:text-7xl">
            {TOTAL_PREMIOS_PUMA.toLocaleString('es-MX')} $PUMA
          </p>
          <p className="relative mt-5 font-mono text-xs uppercase tracking-label text-goya-paper/80 sm:text-sm">
            1.º 50M · 2.º 25M · 3.º 10M
          </p>
          <p className="relative mt-6 border-t border-goya-amber/20 pt-5 font-mono text-[10px] uppercase tracking-label text-slate-400 sm:text-[11px]">
            + ${TOTAL_PREMIOS_USD.toLocaleString('en-US')} USD en podios Blockchain y Contenido
          </p>
        </div>
      </Reveal>

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

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
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
              Track abierto: cualquier stack. La bolsa se reparte entre los tres mejores proyectos del
              jurado.
            </p>
          )}
        </Reveal>

        <div
          className={`grid gap-4 ${
            retosConPremio.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {retosConPremio.length > 0 ? (
            retosConPremio.map((reto, i) => (
              <Reveal key={reto.id} as="div" delay={200 + i * 50} className="min-h-[11rem]">
                {reto.pool ? (
                  <PoolCard
                    usd={reto.pool.usd}
                    etiqueta={reto.nombre}
                    detalle={reto.pool.detalle}
                  />
                ) : (
                  <MiniPodio premios={reto.premios!} etiqueta={reto.nombre} />
                )}
              </Reveal>
            ))
          ) : (
            <Reveal as="div" delay={220}>
              <MiniPodio
                premios={premiosTrack}
                etiqueta={`Podio · ${track?.name ?? 'track'}`}
              />
            </Reveal>
          )}
          {retosConPremio.length === 0 && premiosTrack.length === 0 && (
            <Reveal as="div" delay={220} className="goya-panel flex items-center gap-3 p-5">
              <Trophy size={22} className="shrink-0 text-goya-amber/70" />
              <p className="text-sm text-slate-400">Sin podio asignado a este track.</p>
            </Reveal>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        {reto.pool ? (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-goya-amber/80">
            Prize pool ${reto.pool.usd} USD · quien integre Pollar entra
          </p>
        ) : reto.premios && reto.premios.length > 0 ? (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-goya-amber/80">
            {reto.premios.map((p) => `${p.lugar}º ${textoPremioLugar(p)}`).join(' · ')}
          </p>
        ) : null}
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
