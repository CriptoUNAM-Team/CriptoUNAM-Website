import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Radio } from 'lucide-react'
import {
  HACKATHON_INFO,
  FECHAS_CARTEL,
  LEMAS_CARTEL,
  SNIPPET_CARTEL,
} from '../../../data/hackathonInfo'
import PixelG from '../../goya/PixelG'
import PixelFlow, { PixelFranja } from '../../goya/PixelFlow'
import { Barras, Marco } from '../../goya/adornos'
import { goyaHeroTimeline } from '../../../lib/goyaAnime'
import { AvisoSubirApex } from '../TrackPicker'

const Letras: React.FC<{ texto: string; className?: string }> = ({ texto, className = '' }) => (
  <span className={`inline-flex ${className}`} aria-label={texto}>
    {texto.split('').map((ch, i) => (
      <span
        key={`${ch}-${i}`}
        data-goya-letter
        className="inline-block origin-bottom will-change-transform"
        style={{ perspective: '600px' }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ))}
  </span>
)

/**
 * Hero de la landing: portada del cartel de Goya Hack + timeline anime.js.
 */
const Hero: React.FC = () => {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current) return
    const tl = goyaHeroTimeline(root.current)
    return () => {
      tl?.pause()
      tl?.revert?.()
    }
  }, [])

  return (
    <section
      ref={root}
      className="relative mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-between gap-10 px-5 pb-10 pt-24 sm:px-8 md:px-12 md:pt-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-20 -z-0 h-px goya-scanline opacity-40" aria-hidden="true" />

      <AvisoSubirApex />

      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p data-goya-hero className="font-mono text-[11px] uppercase tracking-label text-goya-paper sm:text-sm">
            Participa en el
          </p>

          <div data-goya-hero className="goya-rule mt-1 w-fit max-w-full">
            <p className="font-mono text-base italic uppercase tracking-label text-goya-amber sm:text-xl md:text-2xl">
              Hackathon universitario
            </p>
          </div>

          <div className="mt-8 hidden items-start gap-10 sm:flex">
            <div data-goya-hero>
              <Barras />
            </div>
            <p
              data-goya-hero
              className="hidden max-w-[26ch] font-mono text-[11px] uppercase leading-relaxed tracking-label text-slate-500 md:block"
            >
              {SNIPPET_CARTEL}
            </p>
          </div>
        </div>

        <div data-goya-hero className="flex shrink-0 flex-col items-end gap-3 sm:gap-4">
          <PixelG animado className="w-16 text-goya-amber sm:w-28 md:w-36 lg:w-44 xl:w-52" />
          <div className="flex items-end gap-2 sm:gap-3">
            <PixelFlow
              forma="anillo"
              desfase={3}
              className="w-[clamp(2.25rem,12vw,4.5rem)] text-goya-paper/50"
            />
            <PixelFlow
              forma="cruz"
              desfase={11}
              className="hidden w-[clamp(2.25rem,12vw,4.5rem)] text-goya-paper/45 sm:block"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="min-w-0">
          <h1 className="font-display text-[clamp(3rem,11vw,9.5rem)] font-normal uppercase leading-[0.86] tracking-tight text-goya-paper">
            <span className="block">
              <Letras texto="Goya" />
            </span>
            <span className="mt-1 flex items-center gap-[0.42em] pl-[0.32em]">
              <span
                data-goya-hero
                className="inline-block h-[0.5em] w-[0.055em] shrink-0 bg-goya-amber goya-amber-glow"
                aria-hidden="true"
              />
              <Letras texto="Hack" />
            </span>
          </h1>
        </div>

        <div data-goya-hero className="shrink-0 lg:pb-[0.6em]">
          <p className="flex items-center gap-3 font-display text-4xl uppercase leading-none tracking-wide text-goya-paper sm:text-5xl">
            {FECHAS_CARTEL.rango}
            <span className="mb-1 inline-block h-3 w-3 shrink-0 self-end bg-goya-amber goya-amber-glow" aria-hidden="true" />
          </p>
          <p className="goya-rule mt-2 w-fit pr-10 font-display text-2xl uppercase leading-none tracking-wide text-goya-paper sm:text-3xl">
            {FECHAS_CARTEL.mes}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-label text-slate-400">
            2026 · {HACKATHON_INFO.event}
          </p>
          <p className="mt-2 flex items-center justify-start gap-1.5 font-mono text-[11px] uppercase tracking-label text-goya-amber">
            <Radio size={12} />
            Presencial y en línea
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div data-goya-hero>
          <div className="goya-rule w-fit">
            <p className="font-display text-xl uppercase tracking-wide text-goya-paper sm:text-3xl">
              {LEMAS_CARTEL[0]}
            </p>
          </div>
          <p className="mt-2 font-display text-lg italic uppercase tracking-wide text-goya-amber sm:text-2xl">
            {LEMAS_CARTEL[1]}
          </p>
        </div>

        <div data-goya-hero className="lg:pb-1">
          <Barras orientacion="vertical" className="mb-3" />
          <p className="font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
            Facultad de
          </p>
          <p className="flex items-center gap-3 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
            <span
              className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-goya-amber goya-amber-glow"
              aria-hidden="true"
            />
            Ingeniería
          </p>
        </div>

        <div data-goya-hero className="flex flex-col gap-3 sm:flex-row lg:pb-1">
          <Link
            to="/hackathon/dashboard"
            className="goya-cut goya-cta-glow group inline-flex items-center justify-center gap-2 bg-goya-amber px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-label text-[#010004] no-underline transition-colors duration-300 hover:bg-goya-paper"
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
        </div>
      </div>

      <Marco className="pointer-events-none absolute bottom-6 right-5 hidden text-slate-600 sm:right-8 md:right-12 lg:block" />

      <div data-goya-hero className="mt-6 w-full overflow-visible sm:mt-8">
        <PixelFranja
          formas={['escalera', 'orbita', 'diamante', 'columnas']}
          tamano="sm"
          modo="reparto"
          tono="text-goya-paper/40"
        />
      </div>
    </section>
  )
}

export default Hero
