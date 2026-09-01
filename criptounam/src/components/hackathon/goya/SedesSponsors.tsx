import React from 'react'
import { ExternalLink } from 'lucide-react'
import {
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
  COMUNIDADES,
  HACKATHON_INFO,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import Multitud from '../../goya/Multitud'
import Marquesina from '../../goya/Marquesina'

const SedesSponsors: React.FC = () => {
  // Solo se pintan los niveles con alguien dentro, para no dejar huecos
  // mientras se cierran patrocinios.
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
      {/* ---- Quién está detrás ---- */}
      <div className="flex flex-col gap-12">
        {grupos.map((g, gi) => (
          <Reveal key={g.tier} as="div" delay={gi * 100}>
            <h3 className="mb-5 font-mono text-[10px] uppercase tracking-label text-slate-500">
              {SPONSOR_TIER_LABEL[g.tier]}
            </h3>
            {/*
              Los patrocinadores van en cinta y grandes: es el bloque que hay
              que ver. Organizan y el apoyo se quedan en fila fija — son tres
              logos que no cambian y moverlos solo distraería.
            */}
            {g.tier === 'patrocinador' ? (
              <Marquesina
                logos={g.lista}
                tamano="grande"
                duracion={Math.max(24, g.lista.length * 9)}
                className="-mx-2"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                {g.lista.map((sp) => {
                  const logo = (
                    <img
                      src={sp.logo}
                      alt={sp.nombre}
                      loading="lazy"
                      className={
                        // Con fondo transparente basta la silueta: todo a negro
                        // y luego invertido, que deja el logo en blanco.
                        //
                        // Con fondo opaco esa receta pintaría un rectángulo
                        // blanco sólido. Ahí se invierte sin más: el fondo claro
                        // se va a negro y se funde con el panel, y el trazo
                        // oscuro sube a blanco. El `grayscale` quita el color
                        // que la inversión deja desplazado.
                        sp.fondoOpaco
                          ? 'max-h-14 max-w-full object-contain opacity-75 transition-opacity duration-300 [filter:invert(1)_grayscale(1)] group-hover:opacity-100'
                          : 'max-h-14 max-w-full object-contain opacity-65 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100'
                      }
                    />
                  )
                  const clase =
                    'goya-panel goya-panel-hover group w-[160px] transition-colors duration-300'
                  const interior = (
                    <span className="flex min-h-[96px] items-center justify-center p-5">
                      {logo}
                    </span>
                  )
                  return sp.url ? (
                    <a
                      key={sp.id}
                      href={sp.url}
                      target="_blank"
                      rel="noreferrer"
                      className={clase}
                      title={sp.nombre}
                    >
                      {interior}
                    </a>
                  ) : (
                    <div key={sp.id} className={clase} title={sp.nombre}>
                      {interior}
                    </div>
                  )
                })}
              </div>
            )}
          </Reveal>
        ))}

        {/* Comunidades: su propia cinta, más pequeña y más rápida. */}
        {COMUNIDADES.length > 0 && (
          <Reveal as="div" delay={grupos.length * 100}>
            <h3 className="mb-5 font-mono text-[10px] uppercase tracking-label text-slate-500">
              Comunidades aliadas
            </h3>
            <Marquesina
              logos={COMUNIDADES}
              duracion={Math.max(28, COMUNIDADES.length * 5)}
              className="-mx-2"
            />
          </Reveal>
        )}
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
