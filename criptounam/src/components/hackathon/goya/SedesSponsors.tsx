import React from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import {
  SEDES,
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
  HACKATHON_INFO,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import Multitud from '../../goya/Multitud'

const SedesSponsors: React.FC = () => {
  // Solo se pintan los niveles con alguien dentro, para no dejar huecos
  // mientras se cierran patrocinios.
  const grupos = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    lista: SPONSORS.filter((s) => s.tier === tier),
  })).filter((g) => g.lista.length > 0)

  return (
    <Seccion
      id="sedes"
      numero="05"
      rotulo="Dónde"
      titulo="Ciudad Universitaria"
      intro="La sede principal es la Facultad de Ingeniería. Las charlas se transmiten para quien sigue el evento en híbrido."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {SEDES.map((sede, i) => (
          <Reveal
            key={sede.id}
            as="article"
            delay={180 + i * 110}
            className="goya-panel goya-panel-hover"
          >
            <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden">
              <img
                src={sede.imagen}
                alt={sede.nombre}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale transition-all duration-500 hover:opacity-70 hover:grayscale-0"
              />
              {/* Degradado desde el negro del cartel, no desde un gris. */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(1,0,4,0.97) 12%, rgba(1,0,4,0.6) 50%, rgba(17,36,65,0.25) 100%)',
                }}
                aria-hidden="true"
              />

              <div className="relative p-5">
                <h3 className="font-display text-base uppercase leading-tight tracking-wide text-goya-paper">
                  {sede.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{sede.descripcion}</p>
                {sede.horario && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-goya-amber/70">
                    {sede.horario}
                  </p>
                )}
                {sede.mapsUrl && (
                  <a
                    href={sede.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                  >
                    <MapPin size={12} />
                    Cómo llegar
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Organizadores y aliados — la fila de logos del pie del cartel. */}
      <div className="mt-20">
        {grupos.map((g, gi) => (
          <Reveal key={g.tier} as="div" delay={gi * 100} className="mb-10">
            <h3 className="mb-5 font-mono text-[10px] uppercase tracking-label text-slate-500">
              {SPONSOR_TIER_LABEL[g.tier]}
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {g.lista.map((s) => {
                const logo = (
                  <img
                    src={s.logo}
                    alt={s.nombre}
                    loading="lazy"
                    className={
                      // Con fondo transparente basta la silueta: todo a negro y
                      // luego invertido, que deja el logo en blanco.
                      //
                      // Con fondo opaco esa receta pintaría un rectángulo blanco
                      // sólido. Ahí se invierte sin más: el fondo claro se va a
                      // negro y se funde con el panel, y el trazo oscuro sube a
                      // blanco. El `grayscale` quita el color que la inversión
                      // deja desplazado.
                      s.fondoOpaco
                        ? 'max-h-14 max-w-full object-contain opacity-75 transition-opacity duration-300 [filter:invert(1)_grayscale(1)] group-hover:opacity-100'
                        : 'max-h-14 max-w-full object-contain opacity-65 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100'
                    }
                  />
                )
                const clase =
                  'goya-panel goya-panel-hover group w-[160px] transition-colors duration-300'
                const interior = (
                  <span className="flex min-h-[96px] items-center justify-center p-5">{logo}</span>
                )
                return s.url ? (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={clase}
                    title={s.nombre}
                  >
                    {interior}
                  </a>
                ) : (
                  <div key={s.id} className={clase} title={s.nombre}>
                    {interior}
                  </div>
                )
              })}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Alta de aliados. La retícula de figuras es la del cartel de Community
          Partner, que es exactamente lo que se ofrece aquí. */}
      <Reveal as="div" delay={200} className="goya-panel mt-6" style={{ ['--cut' as string]: '24px' }}>
        <div className="overflow-hidden px-8 pt-10 text-goya-paper/60">
          <Multitud cantidad={16} cadaCuantasAmbar={4} />
        </div>

        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-label text-goya-paper">
              Únete como
            </p>
            <h3 className="goya-rule mt-1 w-fit font-display text-3xl uppercase tracking-wide text-goya-amber sm:text-4xl">
              Community Partner
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              ¿Eres una comunidad, un colectivo o una sociedad de alumnos? Súmate
              a Goya Hack: difundimos lo tuyo, tienes espacio en el evento y tu
              logo entra en esta página.
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
