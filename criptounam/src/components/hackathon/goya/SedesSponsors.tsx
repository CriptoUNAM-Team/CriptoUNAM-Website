import React from 'react'
import { MapPin } from 'lucide-react'
import {
  SEDES,
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'

const SedesSponsors: React.FC = () => {
  // Solo se pintan los niveles con alguien dentro, para no dejar huecos
  // mientras se cierran patrocinios.
  const grupos = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    lista: SPONSORS.filter((s) => s.tier === tier),
  })).filter((g) => g.lista.length > 0)

  return (
    <section id="sedes" className="px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16">
      <Reveal as="div" delay={120} className="badge-accent w-fit">
        <span className="font-mono text-[11px] uppercase tracking-label text-accent">Dónde</span>
      </Reveal>

      <Reveal
        as="h2"
        delay={180}
        className="mt-5 text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl"
      >
        Ciudad Universitaria
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {SEDES.map((sede, i) => (
          <Reveal
            key={sede.id}
            as="article"
            delay={200 + i * 110}
            className="relative flex min-h-[220px] items-end overflow-hidden rounded-xl border border-white/15"
          >
            <img
              src={sede.imagen}
              alt={sede.nombre}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4">
              <h3 className="text-base font-medium text-white">{sede.nombre}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/70">{sede.descripcion}</p>
              {sede.mapsUrl && (
                <a
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent no-underline"
                >
                  <MapPin size={12} />
                  Cómo llegar
                </a>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Organizadores y aliados */}
      <div className="mt-16">
        {grupos.map((g, gi) => (
          <Reveal key={g.tier} as="div" delay={gi * 100} className="mb-8">
            <h3 className="label-mono mb-4 text-white/50">{SPONSOR_TIER_LABEL[g.tier]}</h3>
            <div className="flex flex-wrap items-center gap-4">
              {g.lista.map((s) => {
                const logo = (
                  <img
                    src={s.logo}
                    alt={s.nombre}
                    loading="lazy"
                    className={
                      s.fondoOpaco
                        ? 'max-h-14 max-w-full rounded object-contain opacity-90'
                        : 'max-h-14 max-w-full object-contain opacity-70 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100 group-hover:[filter:none]'
                    }
                  />
                )
                const clase =
                  'group flex min-h-[92px] w-[150px] items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 hover:border-accent-border'
                return s.url ? (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={clase}
                    title={s.nombre}
                  >
                    {logo}
                  </a>
                ) : (
                  <div key={s.id} className={clase} title={s.nombre}>
                    {logo}
                  </div>
                )
              })}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default SedesSponsors
