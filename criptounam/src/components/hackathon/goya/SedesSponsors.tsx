import React from 'react'
import { ExternalLink } from 'lucide-react'
import {
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
  COMUNIDADES,
  HACKATHON_INFO,
  type Sponsor,
  type SponsorTier,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import Multitud from '../../goya/Multitud'

const LOGO_CLASS = (sp: Sponsor) => {
  if (sp.fondoOpaco) {
    return 'max-h-full max-w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100'
  }
  if (sp.id === 'criptounam') {
    return 'max-h-full max-w-full object-contain opacity-95 transition-opacity duration-300 group-hover:opacity-100'
  }
  return 'max-h-full max-w-full object-contain opacity-70 transition-all duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100'
}

const LOGO_MAX_H = (sp: Sponsor) => (sp.id === 'criptounam' ? 'max-h-14 w-full' : 'max-h-20')

const CARD_CLASS = (sp: Sponsor, base: string) =>
  sp.id === 'criptounam' ? `${base} col-span-full mx-auto w-full max-w-sm` : base

const TIER_STYLE: Record<
  SponsorTier,
  { card: string; logoBox: string; showName: boolean; grid: string }
> = {
  patrocinador: {
    card: 'goya-panel goya-panel-hover group min-h-[140px]',
    logoBox: 'flex min-h-[100px] items-center justify-center p-6',
    showName: true,
    grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
  },
  organizador: {
    card: 'goya-panel goya-panel-lit group min-h-[160px]',
    logoBox: 'flex min-h-[110px] items-center justify-center p-6',
    showName: true,
    grid: 'grid grid-cols-1 gap-5 sm:grid-cols-2',
  },
  apoyo: {
    card: 'goya-panel goya-panel-hover group min-h-[120px]',
    logoBox: 'flex min-h-[88px] items-center justify-center p-5',
    showName: true,
    grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5',
  },
}

const TarjetaLogo: React.FC<{ sp: Sponsor; estilo: (typeof TIER_STYLE)[SponsorTier] }> = ({ sp, estilo }) => {
  const interior = (
    <div className="flex h-full flex-col">
      <span
        className={`${estilo.logoBox} ${sp.fondoOpaco ? 'bg-white/95' : ''} ${
          sp.id === 'criptounam' ? 'items-center justify-center' : ''
        }`}
      >
        <img
          src={sp.logo}
          alt={sp.nombre}
          loading="lazy"
          className={`${LOGO_CLASS(sp)} ${LOGO_MAX_H(sp)} ${sp.id === 'criptounam' ? 'mx-auto object-center' : ''}`}
        />
      </span>
      {estilo.showName && (
        <p className="border-t border-goya-amber/15 px-4 py-3 text-center font-mono text-[9px] uppercase tracking-label text-slate-400 transition-colors group-hover:text-goya-amber">
          {sp.nombre}
        </p>
      )}
    </div>
  )

  if (sp.url) {
    return (
      <a
        href={sp.url}
        target="_blank"
        rel="noreferrer"
        className={`${CARD_CLASS(sp, estilo.card)} no-underline transition-colors duration-300`}
        title={sp.nombre}
      >
        {interior}
      </a>
    )
  }
  return (
    <div className={CARD_CLASS(sp, estilo.card)} title={sp.nombre}>
      {interior}
    </div>
  )
}

const SedesSponsors: React.FC = () => {
  const grupos = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    lista: SPONSORS.filter((s) => s.tier === tier),
  })).filter((g) => g.lista.length > 0)

  return (
    <Seccion
      id="patrocinadores"
      rotulo="Aliados"
      titulo="Quién está detrás"
      intro="Patrocinadores, organizadores y comunidades que hacen posible Goya Hack."
    >
      <div className="flex flex-col gap-14">
        {grupos.map((g, gi) => {
          const estilo = TIER_STYLE[g.tier]
          return (
            <Reveal key={g.tier} as="div" delay={gi * 100}>
              <h3 className="mb-6 font-mono text-[10px] uppercase tracking-label text-goya-amber/70">
                {SPONSOR_TIER_LABEL[g.tier]}
              </h3>
              <div className={estilo.grid}>
                {g.lista.map((sp) => (
                  <TarjetaLogo key={sp.id} sp={sp} estilo={estilo} />
                ))}
              </div>
            </Reveal>
          )
        })}

        {COMUNIDADES.length > 0 && (
          <Reveal as="div" delay={grupos.length * 100}>
            <h3 className="mb-6 font-mono text-[10px] uppercase tracking-label text-goya-amber/70">
              Comunidades aliadas
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
              {COMUNIDADES.map((c) => {
                const interior = (
                  <div
                    className={`flex flex-col items-center gap-2 p-3 ${c.fondoOpaco ? 'rounded-sm bg-white/95' : ''}`}
                  >
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={c.nombre}
                        loading="lazy"
                        className={
                          c.fondoOpaco
                            ? 'max-h-10 w-full max-w-[88px] object-contain'
                            : 'max-h-10 w-full max-w-[72px] object-contain opacity-65 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0'
                        }
                      />
                    ) : (
                      <span className="font-mono text-[9px] font-bold uppercase text-goya-amber">{c.nombre}</span>
                    )}
                    <span className="line-clamp-2 text-center font-mono text-[8px] uppercase leading-tight tracking-label text-slate-500 transition-colors group-hover:text-goya-paper">
                      {c.nombre}
                    </span>
                  </div>
                )
                const clase =
                  'goya-panel goya-panel-hover group transition-colors duration-300'
                return c.url ? (
                  <a
                    key={c.id}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`${clase} no-underline`}
                    title={c.nombre}
                  >
                    {interior}
                  </a>
                ) : (
                  <div key={c.id} className={clase} title={c.nombre}>
                    {interior}
                  </div>
                )
              })}
            </div>
          </Reveal>
        )}
      </div>

      <Reveal as="div" delay={200} className="goya-panel mt-10" style={{ ['--cut' as string]: '24px' }}>
        <div className="overflow-hidden px-8 pt-10 text-goya-paper/60">
          <Multitud cantidad={16} cadaCuantasAmbar={4} animado />
        </div>

        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-label text-goya-paper">Únete como</p>
            <h3 className="goya-rule mt-1 w-fit font-display text-3xl uppercase tracking-wide text-goya-amber sm:text-4xl">
              Community Partner
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              ¿Eres una comunidad, un colectivo o una sociedad de alumnos? Súmate a Goya Hack: difundimos lo tuyo,
              tienes espacio en el evento y tu logo entra en esta página.
            </p>
          </div>

          <a
            href={HACKATHON_INFO.communityPartnerForm}
            target="_blank"
            rel="noreferrer"
            className="goya-cut inline-flex shrink-0 items-center justify-center gap-2 bg-goya-amber px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
            style={{ ['--cut' as string]: '10px' }}
          >
            Quiero ser partner
            <ExternalLink size={13} />
          </a>
        </div>
      </Reveal>
    </Seccion>
  )
}

export default SedesSponsors
