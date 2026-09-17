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

/**
 * Cómo se pinta un logo dentro de su caja.
 *
 * Tres casos, y el orden importa:
 *
 * 1. `colorPropio` — el archivo ya viene en la paleta del cartel. Se deja
 *    intacto: pasarlo por el filtro lo aplanaría a blanco.
 * 2. `fondoOpaco` — no hay transparencia. Va sobre placa clara y en su color;
 *    el filtro de silueta sobre un PNG opaco da un rectángulo blanco sólido.
 * 3. El resto — logotipo sobre transparente. Se normaliza a blanco, que es lo
 *    que mantiene la retícula de patrocinadores como un bloque coherente.
 */
/*
 * Sin `max-h-*` aquí: el alto lo pone quien llama, con la clase del nivel.
 *
 * La base traía `max-h-full` y se concatenaba con el `max-h-20` del nivel en
 * el mismo `class`. Son dos utilidades de Tailwind con idéntica especificidad,
 * así que decidía el orden del CSS generado —ganaba `max-h-full`— y el alto
 * por nivel no servía de nada: todos los logos se estiraban hasta el borde de
 * su caja sin respetar el suyo.
 */
const LOGO_IMG_CLASS = (sp: Sponsor) => {
  const base = 'max-w-full object-contain transition-all duration-300'
  if (sp.colorPropio) return `${base} opacity-95 group-hover:opacity-100`
  if (sp.fondoOpaco) return `${base} opacity-90 group-hover:opacity-100`
  return `${base} opacity-75 [filter:brightness(0)_invert(1)] group-hover:opacity-100`
}

const TIER_STYLE: Record<
  SponsorTier,
  { card: string; logoBox: string; logoH: string; showName: boolean; grid: string }
> = {
  patrocinador: {
    card: 'goya-panel goya-panel-hover group',
    logoBox: 'flex h-24 items-center justify-center p-5',
    logoH: 'max-h-14',
    showName: true,
    grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
  },
  organizador: {
    card: 'goya-panel goya-panel-lit group',
    /*
     * Más alto que los otros niveles a propósito: los cuatro organizadores son
     * lockups con texto —escudos con leyenda, la marca de CriptoUNAM con su
     * bajada— y en la caja de 64 px que tenían antes el texto no se leía.
     */
    logoBox: 'flex h-32 items-center justify-center px-5 py-4',
    logoH: 'max-h-20',
    showName: true,
    grid: 'grid grid-cols-2 gap-4 sm:grid-cols-4',
  },
  apoyo: {
    card: 'goya-panel goya-panel-hover group',
    logoBox: 'flex h-20 items-center justify-center p-4',
    logoH: 'max-h-12',
    showName: true,
    grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5',
  },
}

const TarjetaLogo: React.FC<{ sp: Sponsor; estilo: (typeof TIER_STYLE)[SponsorTier] }> = ({ sp, estilo }) => {
  const interior = (
    <div className="flex h-full flex-col">
      <span className={`${estilo.logoBox} ${sp.fondoOpaco ? 'rounded-t-sm bg-white/95' : ''}`}>
        <img
          src={sp.logo}
          alt={sp.nombre}
          loading="lazy"
          className={`${LOGO_IMG_CLASS(sp)} ${sp.ancho ? 'max-h-full' : estilo.logoH} mx-auto`}
        />
      </span>
      {estilo.showName && (
        <p className="border-t border-goya-amber/15 px-3 py-2 text-center font-mono text-[9px] uppercase tracking-label text-slate-400 transition-colors group-hover:text-goya-amber">
          {sp.nombre}
        </p>
      )}
    </div>
  )

  const cls = estilo.card + ' no-underline transition-colors duration-300'
  if (sp.url) {
    return (
      <a href={sp.url} target="_blank" rel="noreferrer" className={cls} title={sp.nombre}>
        {interior}
      </a>
    )
  }
  return (
    <div className={cls} title={sp.nombre}>
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {COMUNIDADES.map((c) => {
                const interior = (
                  <div className="flex h-full flex-col items-center justify-between gap-2.5 p-3">
                    {/*
                      * Placa clara para todos, sin excepción.
                      *
                      * Estos 29 logos llegan como llegan: unos en tinta oscura
                      * sobre transparente, otros con foto de fondo, otros en
                      * blanco. Dando placa solo a los que la "necesitaban", la
                      * retícula salía a parches y no se leía como una sola
                      * pared de aliados. Con una placa igual para todos, el
                      * bloque es uniforme y cada marca sale en su color, que
                      * es lo que corresponde con logos de terceros: ni
                      * silueta, ni escala de grises, ni negativo.
                      *
                      * El precio es que un logo en blanco sobre transparente
                      * desaparecería aquí. Son dos —Mobil3 y UNLOCK— y se
                      * resolvió en el archivo, pasando su texto a tinta oscura
                      * y dejando intacta la parte de color. Si entra un logo
                      * nuevo en blanco, hay que hacerle lo mismo; está anotado
                      * en el README de la carpeta.
                      */}
                    <span className="flex h-16 w-full items-center justify-center rounded bg-white/95 p-2">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt={c.nombre}
                          loading="lazy"
                          className="mx-auto max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-label text-goya-void">
                          {c.nombre}
                        </span>
                      )}
                    </span>
                    <span className="line-clamp-2 text-center font-mono text-[9px] uppercase leading-tight tracking-label text-slate-400 transition-colors group-hover:text-goya-amber">
                      {c.nombre}
                    </span>
                  </div>
                )
                const clase = 'goya-panel goya-panel-hover group transition-colors duration-300'
                return c.url ? (
                  <a key={c.id} href={c.url} target="_blank" rel="noreferrer" className={`${clase} no-underline`} title={c.nombre}>
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
