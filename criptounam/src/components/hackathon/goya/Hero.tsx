import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  HACKATHON_INFO,
  FECHAS_CARTEL,
  LEMAS_CARTEL,
  SNIPPET_CARTEL,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import PixelG from '../../goya/PixelG'
import { Barras, Marco } from '../../goya/adornos'

/**
 * Hero de la landing: la portada del cartel de Goya Hack traducida a pantalla.
 *
 * La composición es la misma del original — antetítulo arriba a la izquierda,
 * G de píxeles arriba a la derecha, el lettering enorme partido en dos líneas
 * con "HACK" sangrado, las fechas a su derecha y los lemas abajo — reordenada
 * en una sola columna por debajo de `lg`, donde el cartel apaisado no cabe.
 */
const Hero: React.FC = () => (
  <section className="relative mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-between gap-10 px-5 pb-10 pt-24 sm:px-8 md:px-12 md:pt-28">
    {/* ---- Fila superior: antetítulo + G de píxeles ---- */}
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <Reveal
          inmediato
          as="p"
          delay={120}
          className="font-mono text-[11px] uppercase tracking-label text-goya-paper sm:text-sm"
        >
          Participa en el
        </Reveal>

        <Reveal inmediato as="div" delay={220} className="goya-rule mt-1 w-fit max-w-full">
          <p className="font-mono text-base italic uppercase tracking-label text-goya-amber sm:text-xl md:text-2xl">
            Hackathon universitario
          </p>
        </Reveal>

        {/* Barras y snippet van en paralelo, no apilados: apilados el hero
            crecía por encima del alto de una pantalla de portátil y la fila de
            abajo (lemas, sede y registro) quedaba bajo el pliegue. */}
        <div className="mt-8 hidden items-start gap-10 sm:flex">
          <Reveal inmediato as="div" delay={320}>
            <Barras />
          </Reveal>

          {/* Snippet decorativo. En el cartel va en versalitas, como aquí. */}
          <Reveal
            inmediato
            as="p"
            delay={420}
            className="hidden max-w-[26ch] font-mono text-[11px] uppercase leading-relaxed tracking-label text-slate-500 md:block"
          >
            {SNIPPET_CARTEL}
          </Reveal>
        </div>
      </div>

      {/* La G. Es el elemento más reconocible del cartel, así que se mantiene
          visible en todos los tamaños; solo encoge. */}
      <Reveal inmediato as="div" delay={180} className="shrink-0">
        <PixelG
          animado
          className="w-20 text-goya-amber sm:w-28 md:w-36 lg:w-44 xl:w-52"
        />
      </Reveal>
    </div>

    {/* ---- Bloque central: lettering + fechas ---- */}
    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
      <div className="min-w-0">
        <Reveal
          inmediato
          as="h1"
          delay={260}
          className="font-display text-[clamp(3rem,11vw,9.5rem)] font-normal uppercase leading-[0.86] tracking-tight text-goya-paper"
        >
          {/* El cartel parte la marca en dos líneas y sangra la segunda casi un
              cuadratín; el `span` ámbar es la marca vertical que el original
              mete en ese hueco. Las medidas van en `em` para que la sangría
              escale con el cuerpo de letra. */}
          <span className="block">Goya</span>
          <span className="mt-1 flex items-center gap-[0.42em] pl-[0.32em]">
            <span
              className="inline-block h-[0.5em] w-[0.055em] shrink-0 bg-goya-amber"
              aria-hidden="true"
            />
            <span>Hack</span>
          </span>
        </Reveal>
      </div>

      {/* Fechas: en el cartel están a la derecha del lettering, con la regla
          ámbar debajo y el cuadrito tras el día final. */}
      <Reveal inmediato as="div" delay={380} className="shrink-0 lg:pb-[0.6em]">
        <p className="flex items-center gap-3 font-display text-4xl uppercase leading-none tracking-wide text-goya-paper sm:text-5xl">
          {FECHAS_CARTEL.rango}
          <span className="mb-1 inline-block h-3 w-3 shrink-0 self-end bg-goya-amber" aria-hidden="true" />
        </p>
        <p className="goya-rule mt-2 w-fit pr-10 font-display text-2xl uppercase leading-none tracking-wide text-goya-paper sm:text-3xl">
          {FECHAS_CARTEL.mes}
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-slate-400">
          2026 · {HACKATHON_INFO.event}
        </p>
      </Reveal>
    </div>

    {/* ---- Fila inferior: lemas, sede y llamada a la acción ---- */}
    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div>
        <Reveal inmediato as="div" delay={300} className="goya-rule w-fit">
          <p className="font-display text-xl uppercase tracking-wide text-goya-paper sm:text-3xl">
            {LEMAS_CARTEL[0]}
          </p>
        </Reveal>
        <Reveal
          inmediato
          as="p"
          delay={380}
          className="mt-2 font-display text-lg italic uppercase tracking-wide text-goya-amber sm:text-2xl"
        >
          {LEMAS_CARTEL[1]}
        </Reveal>
      </div>

      {/* Sede, con las barras y el círculo del cartel. */}
      <Reveal inmediato as="div" delay={440} className="lg:pb-1">
        <Barras orientacion="vertical" className="mb-3" />
        <p className="font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
          Facultad de
        </p>
        <p className="flex items-center gap-3 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-goya-amber"
            aria-hidden="true"
          />
          Ingeniería
        </p>
      </Reveal>

      {/* Lo único que el cartel no tiene: por dónde se entra. */}
      <Reveal inmediato as="div" delay={520} className="flex flex-col gap-3 sm:flex-row lg:pb-1">
        <Link
          to="/hackathon/dashboard"
          className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
          style={{ ['--cut' as string]: '10px' }}
        >
          {HACKATHON_INFO.registroAbierto ? 'Regístrate gratis' : 'Ver la convocatoria'}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          to="/hackathon/guia"
          className="goya-cut inline-flex items-center justify-center border border-goya-amber/45 px-7 py-3.5 font-mono text-xs uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
          style={{ ['--cut' as string]: '10px' }}
        >
          Guía del hacker
        </Link>
      </Reveal>
    </div>

    {/* Escuadra decorativa de la esquina, como en el pie del cartel. */}
    <Marco className="pointer-events-none absolute bottom-6 right-5 hidden text-slate-600 sm:right-8 md:right-12 lg:block" />
  </section>
)

export default Hero
