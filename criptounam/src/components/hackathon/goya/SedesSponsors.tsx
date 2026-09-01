import React, { useEffect, useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'
import {
  SEDES,
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
  COMUNIDADES,
  HACKATHON_INFO,
  type Sede,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import Multitud from '../../goya/Multitud'
import Marquesina from '../../goya/Marquesina'

/** Milisegundos que aguanta cada foto del CIA antes de pasar a la siguiente. */
const PASE = 5000

/**
 * Tarjeta grande de la sede principal: las fotos del espacio a la izquierda y
 * los datos a la derecha.
 *
 * La galería se pasa sola porque la tarjeta es alta y una sola foto deja el
 * bloque muerto; los puntos de abajo permiten saltar a mano y cortan el pase
 * automático en cuanto alguien los usa.
 */
/**
 * Foto de recambio si alguna imagen del CIA no carga.
 */
const RECAMBIO = '/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg'

const SedePrincipal: React.FC<{ sede: Sede }> = ({ sede }) => {
  const fotos = sede.galeria?.length ? sede.galeria : [sede.imagen]
  const [i, setI] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (manual || fotos.length < 2) return
    const id = window.setInterval(() => setI((n) => (n + 1) % fotos.length), PASE)
    return () => window.clearInterval(id)
  }, [manual, fotos.length])

  return (
    <Reveal as="article" delay={160} className="goya-panel goya-panel-hover" style={{ ['--cut' as string]: '20px' }}>
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* ---- Fotos ---- */}
        <div className="relative min-h-[260px] overflow-hidden lg:min-h-[400px]">
          {fotos.map((src, n) => (
            <img
              key={src}
              src={src}
              alt={sede.nombreLargo ?? sede.nombre}
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget
                if (img.src.endsWith(RECAMBIO)) return
                img.src = RECAMBIO
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                n === i ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* El negro del cartel entrando por abajo y por la derecha, para que
              la foto se funda con el panel en vez de quedar pegada. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(1,0,4,0.85) 0%, rgba(1,0,4,0.12) 45%), linear-gradient(to right, transparent 55%, rgba(1,0,4,0.75) 100%)',
            }}
            aria-hidden="true"
          />

          <p className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-label text-goya-amber">
            Sede del hackathon
          </p>

          {fotos.length > 1 && (
            <div className="absolute bottom-5 left-5 flex gap-2">
              {fotos.map((src, n) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Foto ${n + 1} de ${sede.nombre}`}
                  aria-pressed={n === i}
                  onClick={() => {
                    setManual(true)
                    setI(n)
                  }}
                  className={`h-1.5 w-8 transition-colors duration-300 ${
                    n === i ? 'bg-goya-amber' : 'bg-goya-paper/25 hover:bg-goya-paper/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---- Datos ---- */}
        <div className="flex flex-col justify-center gap-4 p-7 lg:p-9">
          <div>
            <h3 className="font-display text-4xl uppercase leading-none tracking-wide text-goya-amber sm:text-5xl">
              {sede.nombre}
            </h3>
            {sede.nombreLargo && (
              <p className="goya-rule mt-2 w-fit font-mono text-[11px] uppercase tracking-label text-goya-paper">
                {sede.nombreLargo}
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-slate-400">{sede.descripcion}</p>

          {sede.horario && (
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-label text-goya-amber/80">
              {sede.horario}
            </p>
          )}

          {sede.mapsUrl && (
            <a
              href={sede.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="goya-cut inline-flex w-fit items-center gap-2 border border-goya-amber/45 px-5 py-2.5 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
              style={{ ['--cut' as string]: '8px' }}
            >
              <MapPin size={12} />
              Cómo llegar
            </a>
          )}
        </div>
      </div>
    </Reveal>
  )
}

const SedesSponsors: React.FC = () => {
  const principal = SEDES.find((s) => s.principal)
  const secundarias = SEDES.filter((s) => !s.principal)

  // Solo se pintan los niveles con alguien dentro, para no dejar huecos
  // mientras se cierran patrocinios.
  const grupos = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    lista: SPONSORS.filter((s) => s.tier === tier),
  })).filter((g) => g.lista.length > 0)

  return (
    <Seccion
      id="sedes"
      rotulo="Dónde"
      titulo="Ciudad Universitaria"
      intro="Todo pasa en la Facultad de Ingeniería: se construye en el CIA — Centro de Ingeniería Avanzada — del martes al viernes; el Auditorio abre para la inauguración y la clausura."
    >
      {principal && <SedePrincipal sede={principal} />}

      {/* El resto de espacios del programa, en fila. */}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {secundarias.map((sede, i) => (
          <Reveal
            key={sede.id}
            as="article"
            delay={180 + i * 110}
            className="goya-panel goya-panel-hover"
          >
            <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden">
              <img
                src={sede.imagen}
                alt={sede.nombreLargo ?? sede.nombre}
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

              {/* Chapa del logo del espacio, cuando lo tiene. PC Puma es un
                  servicio con marca propia y se reconoce antes por el logo que
                  por el nombre. */}
              {sede.logo && (
                <span className="goya-cut absolute right-4 top-4 flex h-14 w-14 items-center justify-center border border-goya-amber/30 bg-goya-void/75 p-2 backdrop-blur-sm"
                  style={{ ['--cut' as string]: '6px' }}
                >
                  <img
                    src={sede.logo}
                    alt=""
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
              )}

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

      {/* ---- Quién está detrás ---- */}
      <div className="mt-20 flex flex-col gap-12">
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
