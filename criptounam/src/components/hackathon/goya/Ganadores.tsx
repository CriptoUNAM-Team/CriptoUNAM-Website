import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Medal, Trophy } from 'lucide-react'
import { PODIOS_GOYA, RESUMEN_GOYA, type LugarGanador } from '../../../data/ganadoresGoya'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const NOMBRE_LUGAR: Record<1 | 2 | 3, string> = { 1: '1.er lugar', 2: '2.º lugar', 3: '3.er lugar' }

const LogoProyecto: React.FC<{ g: LugarGanador; grande?: boolean }> = ({ g, grande }) => {
  const [roto, setRoto] = useState(false)
  const lado = grande ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-14 w-14'
  return (
    <span
      className={`goya-cut flex shrink-0 items-center justify-center overflow-hidden border border-goya-amber/25 ${
        g.placaClara ? 'bg-[#f0f6fc]' : 'bg-goya-paper/5'
      } ${g.logoContain ? 'p-2' : ''} ${lado}`}
      style={{ ['--cut' as string]: '8px' }}
    >
      {roto ? (
        <span className="font-display text-2xl uppercase text-goya-amber">{g.proyecto[0]}</span>
      ) : (
        <img
          src={g.logo}
          alt=""
          loading="lazy"
          onError={() => setRoto(true)}
          className={`h-full w-full ${g.logoContain ? 'object-contain' : 'object-cover'}`}
        />
      )}
    </span>
  )
}

/** Tarjeta de un lugar del podio; enlaza a la ficha pública del proyecto. */
const TarjetaGanador: React.FC<{ g: LugarGanador }> = ({ g }) => {
  const primero = g.lugar === 1
  const Icono = primero ? Trophy : Medal
  return (
    <Link
      to={`/hackathon/proyectos/${g.projectId}`}
      className={`goya-cut group flex h-full flex-col gap-4 border p-5 no-underline transition-colors duration-300 ${
        primero
          ? 'border-goya-amber bg-goya-amber/10 hover:bg-goya-amber/15'
          : 'border-goya-amber/25 bg-goya-void/60 hover:border-goya-amber/60'
      }`}
      style={{ ['--cut' as string]: '12px' }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-label ${
            primero ? 'text-goya-amber' : 'text-slate-400'
          }`}
        >
          <Icono size={13} strokeWidth={1.75} />
          {NOMBRE_LUGAR[g.lugar]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">{g.premio}</span>
      </div>

      <div className="flex items-center gap-4">
        <LogoProyecto g={g} grande={primero} />
        <div className="min-w-0">
          <h4
            className={`font-display uppercase leading-none tracking-wide text-goya-paper ${
              primero ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {g.proyecto}
          </h4>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-label text-slate-500">
            Equipo {g.equipo}
          </p>
        </div>
      </div>

      <p className="flex-1 text-sm leading-relaxed text-slate-400">{g.tagline}</p>

      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-label text-goya-amber transition-colors group-hover:text-goya-paper">
        Ver proyecto
        <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/**
 * Ganadores de GOYA HACK por track. Va justo debajo del hero: con el evento
 * cerrado es lo primero que se busca en la landing.
 */
const Ganadores: React.FC = () => {
  const [trackId, setTrackId] = useState(PODIOS_GOYA[0].id)
  const track = PODIOS_GOYA.find((t) => t.id === trackId) ?? PODIOS_GOYA[0]

  return (
    <Seccion
      id="ganadores"
      rotulo="Ganadores · edición 2026"
      titulo="Los proyectos premiados"
      intro={`Se entregaron ${RESUMEN_GOYA.proyectosEntregados} proyectos y el jurado premió a ${RESUMEN_GOYA.proyectosPremiados} en cinco podios. Gracias a cada equipo que construyó con nosotros.`}
    >
      {/* Selector de track */}
      <Reveal as="div" delay={100} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" >
        <div role="tablist" aria-label="Track" className="flex gap-2">
          {PODIOS_GOYA.map((t) => {
            const activo = t.id === track.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setTrackId(t.id)}
                className={`goya-cut inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors duration-300 ${
                  activo
                    ? 'border-goya-amber bg-goya-amber text-goya-void'
                    : 'border-goya-amber/30 text-slate-300 hover:border-goya-amber/70 hover:text-goya-amber'
                }`}
                style={{ ['--cut' as string]: '7px' }}
              >
                <img
                  src={t.logo}
                  alt=""
                  className={`h-4 w-auto max-w-[40px] object-contain ${
                    t.logoColor ? '' : activo ? '[filter:brightness(0)]' : '[filter:brightness(0)_invert(1)]'
                  }`}
                />
                {t.titulo}
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="mt-6" role="tabpanel" aria-label={track.rotulo}>
        <p className="font-mono text-[11px] uppercase tracking-label text-goya-amber">{track.rotulo}</p>
        {track.nota && <p className="mt-2 max-w-2xl text-sm text-slate-500">{track.nota}</p>}

        <div
          key={track.id}
          className={`mt-5 grid gap-4 ${
            track.ganadores.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
          }`}
        >
          {track.ganadores.map((g) => (
            <TarjetaGanador key={`${track.id}-${g.lugar}`} g={g} />
          ))}
        </div>
      </div>

      <Reveal as="div" delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/hackathon/proyectos"
          className="goya-cut group inline-flex items-center justify-center gap-2 border border-goya-amber/45 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
          style={{ ['--cut' as string]: '9px' }}
        >
          Ver los {RESUMEN_GOYA.proyectosEntregados} proyectos entregados
          <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </Seccion>
  )
}

export default Ganadores
