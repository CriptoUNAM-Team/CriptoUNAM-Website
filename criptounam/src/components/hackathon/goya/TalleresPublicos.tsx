import React, { useEffect, useRef, useState } from 'react'
import { Clock3, MapPin, Sparkles } from 'lucide-react'
import {
  TALLERES_ESPECIALES,
  TALLERES_PUBLICOS,
  type TallerPublico,
} from '../../../data/talleresPublicos'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import { goyaStaggerChildren, goyaSwapIn } from '../../../lib/goyaAnime'

type DiaTab = 'mie' | 'jue'

const DIAS: { id: DiaTab; label: string; fecha: string }[] = [
  { id: 'mie', label: 'Miércoles', fecha: '23 SEP' },
  { id: 'jue', label: 'Jueves', fecha: '24 SEP' },
]

const TallerCard: React.FC<{ taller: TallerPublico; featured?: boolean }> = ({
  taller,
  featured,
}) => (
  <article
    data-goya-card
    className={`goya-panel goya-panel-hover group overflow-hidden ${
      featured ? 'sm:col-span-1' : ''
    }`}
  >
    <div
      className={`relative overflow-hidden bg-goya-void/80 ${
        featured ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-square'
      }`}
    >
      {taller.imagen ? (
        <img
          src={taller.imagen}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-goya-amber/20 via-goya-void to-goya-void p-5">
          <span className="font-mono text-[9px] uppercase tracking-label text-goya-amber/70">
            Arte pendiente
          </span>
          <p className="mt-2 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper/85">
            {taller.titulo}
          </p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-goya-void/80 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
        <span className="font-display text-3xl uppercase leading-none tracking-wide text-goya-amber sm:text-4xl">
          {taller.hora}
        </span>
        {taller.paralelo && (
          <span className="border border-goya-amber/50 bg-goya-void/85 px-2 py-1 font-mono text-[9px] uppercase tracking-label text-goya-amber backdrop-blur-sm">
            En paralelo
          </span>
        )}
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-goya-paper sm:text-xl">
        {taller.titulo}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{taller.subtitulo}</p>
      <p className="mt-3 flex items-start gap-1.5 font-mono text-[10px] uppercase tracking-label text-slate-500">
        <MapPin size={11} className="mt-0.5 shrink-0 text-goya-amber/60" />
        {taller.sede}
      </p>
    </div>
  </article>
)

const TalleresPublicos: React.FC = () => {
  const [dia, setDia] = useState<DiaTab>('mie')
  const panelRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const delDia = TALLERES_PUBLICOS.filter((t) => t.dia === dia)
  const paralelos = delDia.filter((t) => t.paralelo)
  const normales = delDia.filter((t) => !t.paralelo && !t.especial)

  useEffect(() => {
    goyaSwapIn(panelRef.current)
    const t = window.setTimeout(() => {
      goyaStaggerChildren(gridRef.current, '[data-goya-card]', { step: 55, y: 18 })
    }, 40)
    return () => window.clearTimeout(t)
  }, [dia])

  return (
    <Seccion
      id="talleres"
      rotulo="Talleres"
      titulo="Talleres abiertos"
      intro="Miércoles 23 y jueves 24 · entrada libre. Charlas y workshops públicos (no es la agenda de construcción del hackathon). La mayoría en Edificio M · PC PUMA; Avalanche L1 en la División de Ingeniería Mecánica e Industrial."
    >
      <Reveal as="p" delay={100} className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <Clock3 size={14} className="text-goya-amber/70" />
        Público · sin registro de hacker
      </Reveal>

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Día de talleres">
        {DIAS.map((d) => {
          const activo = dia === d.id
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => setDia(d.id)}
              className={`goya-cut px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-label transition-colors ${
                activo
                  ? 'bg-goya-amber text-goya-void'
                  : 'border border-goya-amber/25 bg-transparent text-slate-400 hover:border-goya-amber/50 hover:text-goya-paper'
              }`}
              style={{ ['--cut' as string]: '6px' }}
            >
              {d.label}
              <span className={`ml-2 ${activo ? 'text-goya-void/70' : 'text-slate-600'}`}>
                {d.fecha}
              </span>
            </button>
          )
        })}
      </div>

      <div ref={panelRef}>
        <div
          ref={gridRef}
          className={`grid gap-4 ${
            normales.length + paralelos.length >= 4
              ? 'sm:grid-cols-2 lg:grid-cols-4'
              : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {normales.map((t) => (
            <TallerCard key={t.id} taller={t} />
          ))}
        </div>

        {paralelos.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-goya-amber">
              <Sparkles size={12} />
              11:00 · En paralelo
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {paralelos.map((t) => (
                <TallerCard key={t.id} taller={t} featured />
              ))}
            </div>
          </div>
        )}
      </div>

      <Reveal as="div" delay={180} className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-goya-amber/20 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
              Sección especial
            </p>
            <h3 className="mt-1 font-display text-2xl uppercase tracking-wide text-goya-paper">
              Avalanche · Office Hours · GrantFox
            </h3>
          </div>
          <p className="hidden max-w-[28ch] text-right text-xs text-slate-500 sm:block">
            Piezas de arte en camino — la sesión ya está en el programa.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {TALLERES_ESPECIALES.map((t) => (
            <article
              key={t.id}
              className="goya-panel relative overflow-hidden border border-goya-amber/20 p-5"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-goya-amber/10 blur-2xl"
                aria-hidden
              />
              <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                {t.fechaLabel} · {t.hora}
              </p>
              <h4 className="mt-3 font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                {t.titulo}
              </h4>
              <p className="mt-2 text-sm text-slate-400">{t.subtitulo}</p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-label text-slate-500">
                {t.sede}
              </p>
              {!t.imagen && (
                <span className="mt-4 inline-block border border-dashed border-goya-amber/30 px-2 py-1 font-mono text-[9px] uppercase tracking-label text-goya-amber/60">
                  Arte pendiente
                </span>
              )}
            </article>
          ))}
        </div>
      </Reveal>
    </Seccion>
  )
}

export default TalleresPublicos
