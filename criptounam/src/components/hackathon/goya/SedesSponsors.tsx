import React from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import {
  SPONSORS,
  SPONSOR_TIER_LABEL,
  COMUNIDADES,
  HACKATHON_INFO,
  type Sponsor,
  type Comunidad,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import Multitud from '../../goya/Multitud'

/**
 * Cómo se pinta un logo dentro de su caja.
 *
 * - `colorPropio`: el archivo ya viene en la paleta del cartel, se deja igual.
 * - `fondoOpaco`: sin transparencia; va sobre placa clara y en su color.
 * - el resto: se normaliza a blanco, que es lo que mantiene la fila de
 *   patrocinadores como un bloque coherente.
 */
const tratamientoLogo = (sp: Sponsor) => {
  const base = 'max-w-full object-contain transition-all duration-500'
  if (sp.colorPropio) return `${base} opacity-95 group-hover:opacity-100`
  if (sp.fondoOpaco) return `${base} opacity-90 group-hover:opacity-100`
  return `${base} opacity-70 [filter:brightness(0)_invert(1)] group-hover:opacity-100`
}

/** Rótulo de nivel: etiqueta en mono con la regla ámbar al lado. */
const Rotulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-6 flex items-center gap-4">
    <h3 className="m-0 shrink-0 font-mono text-[10px] uppercase tracking-label text-goya-amber/70">
      {children}
    </h3>
    <span className="h-px flex-1 bg-gradient-to-r from-goya-amber/25 to-transparent" aria-hidden="true" />
  </div>
)

/** Envoltorio que convierte la tarjeta en enlace solo si hay `url`. */
const Enlazable: React.FC<{
  url?: string
  titulo: string
  className?: string
  children: React.ReactNode
}> = ({ url, titulo, className = '', children }) =>
  url ? (
    <a href={url} target="_blank" rel="noreferrer" title={titulo} className={`${className} no-underline`}>
      {children}
    </a>
  ) : (
    <div title={titulo} className={className}>
      {children}
    </div>
  )

/**
 * Tarjeta de organizador: institución, con su nombre debajo.
 *
 * Los escudos de la UNAM y la Facultad no son logotipos con el nombre escrito,
 * así que aquí el rótulo sí hace falta.
 */
const TarjetaOrganizador: React.FC<{ sp: Sponsor }> = ({ sp }) => (
  <Enlazable url={sp.url} titulo={sp.nombre} className="goya-panel goya-panel-lit group block">
    <div className="flex h-full flex-col">
      <span className={`flex h-28 items-center justify-center px-5 py-4 ${sp.fondoOpaco ? 'bg-white/95' : ''}`}>
        <img
          src={sp.logo}
          alt={sp.nombre}
          loading="lazy"
          className={`${tratamientoLogo(sp)} ${sp.ancho ? 'max-h-full' : 'max-h-20'} mx-auto`}
        />
      </span>
      <p className="m-0 border-t border-goya-amber/15 px-3 py-2.5 text-center font-mono text-[9px] uppercase leading-tight tracking-label text-slate-400 transition-colors duration-300 group-hover:text-goya-amber">
        {sp.nombre}
      </p>
    </div>
  </Enlazable>
)

/**
 * Patrocinador: solo el logo, sin rótulo debajo.
 *
 * Los logos de patrocinio ya traen el nombre escrito —tangem, avalanche, Stellar,
 * BAF, POLLAR, team1—, así que repetirlo debajo en versalitas era
 * decir dos veces lo mismo y duplicaba el texto de la retícula. Donde el logo
 * no dice el nombre (escudos, iconos de comunidad) el rótulo se mantiene.
 */
const TarjetaPatrocinador: React.FC<{ sp: Sponsor }> = ({ sp }) => (
  <Enlazable
    url={sp.url}
    titulo={sp.nombre}
    className="goya-cut group flex h-24 items-center justify-center border border-goya-amber/20 bg-white/[0.02] px-6 transition-colors duration-300 hover:border-goya-amber/60 hover:bg-white/[0.05]"
  >
    <img src={sp.logo} alt={sp.nombre} loading="lazy" className={`${tratamientoLogo(sp)} max-h-12`} />
  </Enlazable>
)

/**
 * Tarjeta de comunidad: la placa ES la tarjeta.
 *
 * Antes eran tres cajas anidadas —marco oscuro achaflanado, placa blanca
 * dentro y el logo dentro de la placa— y con 29 de ellas la pared se volvía el
 * bloque más pesado de la página siendo el menos importante. Ahora hay una
 * sola caja: la placa clara, con el nombre suelto debajo sobre el negro. El
 * logo gana sitio y la retícula respira.
 *
 * La placa sigue siendo clara para todas: los logos llegan en tinta oscura,
 * con foto de fondo o en blanco, y es lo único que los deja legibles a la vez
 * sin tocarles el color.
 */
const TarjetaComunidad: React.FC<{ c: Comunidad }> = ({ c }) => (
  <Enlazable url={c.url} titulo={c.nombre} className="group block">
    <span
      /*
       * h-24 y no h-20: a los logos cuadrados —Cartagena, Medellín, Casa
       * Blanca— los limita el alto, no el ancho, y en la placa baja salían
       * pequeños al lado de los apaisados. Subiéndola crecen un tercio y los
       * anchos no cambian, porque a esos los sigue limitando el ancho.
       */
      className="goya-cut flex h-24 items-center justify-center bg-white/95 p-2.5 transition-transform duration-500 ease-out group-hover:-translate-y-1"
      style={{ ['--cut' as string]: '10px' }}
    >
      {c.logo ? (
        <img src={c.logo} alt={c.nombre} loading="lazy" className="max-h-full max-w-full object-contain" />
      ) : (
        <span className="px-2 text-center font-mono text-[10px] font-bold uppercase leading-tight tracking-label text-goya-void">
          {c.nombre}
        </span>
      )}
    </span>
    <span className="mt-2.5 block text-center font-mono text-[9px] uppercase leading-tight tracking-label text-slate-500 transition-colors duration-300 group-hover:text-goya-amber">
      {c.nombre}
    </span>
  </Enlazable>
)

const SedesSponsors: React.FC = () => {
  const organizadores = SPONSORS.filter((s) => s.tier === 'organizador')
  const apoyos = SPONSORS.filter((s) => s.tier === 'apoyo')
  /*
   * Tangem y BAF salen de la fila: patrocinadores especiales con tarjeta propia.
   */
  const especiales = SPONSORS.filter(
    (s) => s.tier === 'patrocinador' && (s.id === 'tangem' || s.id === 'baf')
  )
  const patrocinadores = SPONSORS.filter(
    (s) => s.tier === 'patrocinador' && s.id !== 'tangem' && s.id !== 'baf'
  )

  const copyEspecial: Record<string, { etiqueta: string; cuerpo: string; cta?: { href: string; label: string } }> = {
    tangem: {
      etiqueta: 'Patrocinador principal',
      cuerpo:
        'Pone los premios del track de Contenido y el requisito de wallet de todas las personas participantes.',
      cta: { href: '/hackathon#tangem', label: 'Ver el requisito' },
    },
    baf: {
      etiqueta: 'Patrocinador especial',
      cuerpo:
        'Blockchain Acceleration Foundation: acompaña el reto Stellar · BAF y la sesión en main stage.',
      cta: { href: 'https://www.linkedin.com/company/thebafnetwork/', label: 'Conocer BAF' },
    },
  }

  return (
    <Seccion
      id="patrocinadores"
      rotulo="Aliados"
      titulo="Quién está detrás"
      intro="Quien organiza, quien pone los premios y las comunidades que traen gente."
    >
      <div className="flex flex-col gap-14">
        {/* Organizan */}
        {organizadores.length > 0 && (
          <Reveal as="div" delay={80}>
            <Rotulo>{SPONSOR_TIER_LABEL.organizador}</Rotulo>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {organizadores.map((sp) => (
                <TarjetaOrganizador key={sp.id} sp={sp} />
              ))}
            </div>
          </Reveal>
        )}

        {/* Patrocinadores, con Tangem y BAF destacados */}
        <Reveal as="div" delay={140}>
          <Rotulo>{SPONSOR_TIER_LABEL.patrocinador}</Rotulo>

          {especiales.length > 0 && (
            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              {especiales.map((sp) => {
                const copy = copyEspecial[sp.id]
                const externo = copy?.cta?.href.startsWith('http')
                return (
                  <div
                    key={sp.id}
                    className="goya-panel goya-panel-lit flex flex-col items-start gap-6 p-6 sm:p-7"
                    style={{ ['--cut' as string]: '18px' }}
                  >
                    <div className="flex w-full flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
                      <img
                        src={sp.logo}
                        alt={sp.nombre}
                        loading="lazy"
                        className="max-h-14 max-w-[160px] object-contain [filter:brightness(0)_invert(1)]"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                          {copy?.etiqueta ?? 'Patrocinador especial'}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                          {copy?.cuerpo ?? sp.nombre}
                        </p>
                      </div>
                    </div>

                    {copy?.cta && (
                      <a
                        href={copy.cta.href}
                        {...(externo ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="goya-cut group inline-flex shrink-0 items-center gap-2 border border-goya-amber/45 px-5 py-3 font-mono text-[10px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                        style={{ ['--cut' as string]: '8px' }}
                      >
                        {copy.cta.label}
                        <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {patrocinadores.map((sp) => (
              <TarjetaPatrocinador key={sp.id} sp={sp} />
            ))}
          </div>
        </Reveal>

        {/* Con el apoyo de */}
        {apoyos.length > 0 && (
          <Reveal as="div" delay={180}>
            <Rotulo>{SPONSOR_TIER_LABEL.apoyo}</Rotulo>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {apoyos.map((sp) => (
                <Enlazable
                  key={sp.id}
                  url={sp.url}
                  titulo={sp.nombre}
                  className="goya-cut group block border border-goya-amber/20 bg-white/[0.02] p-3 transition-colors duration-300 hover:border-goya-amber/60"
                >
                  <span className={`flex h-14 items-center justify-center ${sp.fondoOpaco ? 'rounded bg-white/95 p-2' : ''}`}>
                    <img src={sp.logo} alt={sp.nombre} loading="lazy" className={`${tratamientoLogo(sp)} max-h-full`} />
                  </span>
                  <span className="mt-2.5 block text-center font-mono text-[9px] uppercase leading-tight tracking-label text-slate-500 transition-colors duration-300 group-hover:text-goya-amber">
                    {sp.nombre}
                  </span>
                </Enlazable>
              ))}
            </div>
          </Reveal>
        )}

        {/* Comunidades aliadas */}
        {COMUNIDADES.length > 0 && (
          <Reveal as="div" delay={220}>
            <Rotulo>Comunidades aliadas · {COMUNIDADES.length}</Rotulo>
            {/* Dos columnas en móvil: a tres, la celda bajaba de 110 px y nombres
                como "Medellín Blockchain Community" se partían en tres líneas. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {COMUNIDADES.map((c) => (
                <TarjetaComunidad key={c.id} c={c} />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* CTA community partner */}
      <Reveal as="div" delay={260} className="goya-panel mt-14" style={{ ['--cut' as string]: '24px' }}>
        <div className="overflow-x-auto px-6 pt-8 text-goya-paper/60 sm:overflow-hidden sm:px-8 sm:pt-10">
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
