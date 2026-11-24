import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Reveal from './Reveal'
import Caminantes from './goya/Caminantes'

/**
 * Formas geométricas del fondo del hero: rombos, cuadros y una órbita
 * punteada, en el ámbar y el marino del sitio. Flotan despacio; con
 * reduced-motion quedan quietas (ver `.cu-float` en tailwind.css).
 *
 * Decorativas: fuera del árbol de accesibilidad.
 */
const FormasHero: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Órbita grande detrás del emblema */}
    <svg
      className="cu-spin-slow absolute left-1/2 top-1/2 h-[min(92vw,900px)] w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-60"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(233,175,60,0.16)" strokeWidth="0.15" strokeDasharray="0.6 1.4" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(140,166,201,0.12)" strokeWidth="0.12" />
      <rect x="48.6" y="-0.4" width="2.8" height="2.8" transform="rotate(45 50 1)" fill="#E9AF3C" opacity="0.8" />
      <rect x="13.2" y="48.6" width="1.8" height="1.8" fill="rgba(238,243,250,0.7)" />
    </svg>

    {/* Rombos y cuadros sueltos */}
    <span className="cu-float absolute left-[8%] top-[22%] hidden sm:block h-4 w-4 rotate-45 border border-goya-amber/70" style={{ animationDelay: '0s' }} />
    <span className="cu-float absolute left-[6%] top-[44%] hidden sm:block h-2.5 w-2.5 bg-goya-amber/80" style={{ animationDelay: '-2s' }} />
    <span className="cu-float absolute right-[12%] top-[18%] hidden sm:block h-3 w-3 bg-slate-200/70" style={{ animationDelay: '-4s' }} />
    <span className="cu-float absolute right-[7%] top-[58%] hidden sm:block h-6 w-6 rotate-45 border border-slate-300/30" style={{ animationDelay: '-1s' }} />
    <span className="cu-float absolute left-[42%] top-[12%] hidden sm:block h-2 w-2 rotate-45 bg-goya-amber/60" style={{ animationDelay: '-3s' }} />
    <span className="cu-float absolute right-[38%] top-[26%] hidden sm:block h-3.5 w-3.5 border border-goya-amber/50" style={{ animationDelay: '-5s' }} />
  </div>
)

/**
 * Lo que va entre CRIPTO y UNAM: el puma y, alternándose con él, fotos de la
 * comunidad y del campus virtual en un círculo. Con reduced-motion se queda el
 * puma fijo. Las fotos son las copias ligeras de bitacora/ y campus/.
 */
const ROTACION: { src: string; foto: boolean }[] = [
  { src: '/images/emblema-criptounam.png', foto: false },
  { src: '/images/bitacora/enero-1.jpg', foto: true },
  { src: '/images/bitacora/marzo-1.jpg', foto: true },
  { src: '/images/campus/01-plaza.jpg', foto: true },
  { src: '/images/emblema-criptounam.png', foto: false },
  { src: '/images/bitacora/julio-1.jpg', foto: true },
  { src: '/images/bitacora/mayo-2.jpg', foto: true },
  { src: '/images/campus/11-biblioteca.jpg', foto: true },
]

const EmblemaRotativo: React.FC = () => {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % ROTACION.length)
    }, 1800)
    return () => window.clearInterval(t)
  }, [])

  return (
    <span className="relative block h-full w-full">
      {ROTACION.map((r, k) => (
        <img
          key={k}
          src={r.src}
          alt=""
          aria-hidden="true"
          width={292}
          height={292}
          loading={k === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-700 ${
            r.foto
              ? 'rounded-full object-cover ring-2 ring-goya-amber/60'
              : 'object-contain drop-shadow-[0_0_40px_rgba(233,175,60,0.25)]'
          } ${k === i ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        />
      ))}
    </span>
  )
}

/**
 * Portada de la landing.
 *
 * Un solo gesto tipográfico, a todo lo ancho: CRIPTO · emblema · UNAM. Arriba
 * dos rótulos discretos, abajo la propuesta y las dos llamadas a la acción, y
 * las figuras pixel caminando como remate.
 */
const HeroCriptoUNAM: React.FC = () => (
  <section className="relative mx-auto flex min-h-[calc(100svh-70px)] w-full max-w-[1500px] flex-col justify-between gap-10 overflow-hidden px-5 pb-8 pt-8 sm:px-8 md:px-12 md:pt-10">
    <FormasHero />

    <div className="relative flex items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-label text-slate-400 sm:text-[11px]">
      <Reveal inmediato as="p" delay={80}>
        Comunidad Web3 · <span className="text-goya-amber">UNAM</span>
      </Reveal>
      <Reveal inmediato as="p" delay={140} className="text-right">
        Ciudad Universitaria · CDMX
      </Reveal>
    </div>

    <div className="relative flex flex-col items-center text-center">
      <Reveal
        inmediato
        as="p"
        delay={200}
        className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-goya-amber sm:text-xs"
      >
        <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
        Cursos · Hackathones · Comunidad
        <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
      </Reveal>

      <Reveal inmediato as="h1" delay={280} className="m-0 w-full">
        <span className="flex w-full items-center justify-center gap-[0.12em] font-display text-[clamp(2.5rem,12vw,12.5rem)] font-semibold uppercase leading-[0.85] tracking-tight text-goya-paper">
          <span className="text-goya-paper">Cripto</span>
          <span className="relative inline-flex h-[0.86em] w-[0.86em] shrink-0 items-center justify-center">
            {/* Anillo que gira alrededor del emblema; el puma queda quieto. */}
            <svg aria-hidden="true" viewBox="0 0 100 100" className="cu-spin absolute inset-[-14%] h-[128%] w-[128%]">
              <circle cx="50" cy="50" r="47" fill="none" stroke="#E9AF3C" strokeWidth="1.2" strokeDasharray="4 6" opacity="0.7" />
            </svg>
            <EmblemaRotativo />
          </span>
          <span className="text-goya-paper">UNAM</span>
        </span>
        <span className="sr-only">CriptoUNAM</span>
      </Reveal>
    </div>

    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <Reveal
        inmediato
        as="p"
        delay={420}
        className="m-0 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base"
      >
        Formamos a la próxima generación de constructores descentralizados.
        Cursos gratuitos, hackathones, eventos en Ciudad Universitaria y una
        comunidad de más de 500 personas.
      </Reveal>

      <Reveal inmediato as="div" delay={500} className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/cursos"
          className="goya-cut group inline-flex items-center justify-center gap-3 bg-goya-amber px-7 py-4 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
          style={{ ['--cut' as string]: '10px' }}
        >
          Explora los cursos
          <FontAwesomeIcon icon={faArrowRight} className="text-[0.7rem] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          to="/eventos"
          className="goya-cut inline-flex items-center justify-center border border-goya-amber/45 px-7 py-4 font-mono text-xs uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
          style={{ ['--cut' as string]: '10px' }}
        >
          Únete a la comunidad
        </Link>
      </Reveal>
    </div>

    <Reveal inmediato as="div" delay={580} className="relative">
      <Caminantes cantidad={8} className="h-16" />
    </Reveal>
  </section>
)

export default HeroCriptoUNAM
