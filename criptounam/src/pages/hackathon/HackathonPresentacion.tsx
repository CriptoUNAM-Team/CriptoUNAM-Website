import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import Backdrop from '../../components/goya/Backdrop'
import PixelG from '../../components/goya/PixelG'
import { PixelFranja } from '../../components/goya/PixelFlow'
import Multitud from '../../components/goya/Multitud'
import { Barras } from '../../components/goya/adornos'
import {
  PRESENTACION_GOYA,
  type PresentacionSlide,
  type SlideFoto,
  type SlideItem,
  type SlideLogo,
} from '../../data/presentacionGoya'

/**
 * Presentación pública GOYA HACK — estilo cartel.
 * Controles: ← → · Espacio · F · Escape (salir al hackathon).
 */
const HackathonPresentacion: React.FC = () => {
  const slides = PRESENTACION_GOYA
  const [i, setI] = useState(0)
  const slide = slides[i] ?? slides[0]
  const total = slides.length

  const ir = useCallback(
    (n: number) => setI(Math.max(0, Math.min(total - 1, n))),
    [total]
  )
  const sig = useCallback(() => ir(i + 1), [i, ir])
  const ant = useCallback(() => ir(i - 1), [i, ir])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        sig()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        ant()
      } else if (e.key === 'Home') {
        e.preventDefault()
        ir(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        ir(total - 1)
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.()
        } else {
          document.exitFullscreen?.()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sig, ant, ir, total])

  return (
    <div className="goya-scope relative min-h-[100svh] overflow-hidden bg-goya-void font-sans text-goya-paper">
      <SEOHead
        title="Presentación · Goya Hack"
        description="Presentación pública de CriptoUNAM y GOYA HACK: tracks, premios, horarios y talleres."
        url="https://criptounam.xyz/hackathon/presentacion"
      />
      <Backdrop tono="noche" />

      {/* Zonas click para avanzar / retroceder */}
      <button
        type="button"
        aria-label="Diapositiva anterior"
        onClick={ant}
        className="absolute inset-y-0 left-0 z-20 w-[18%] cursor-w-resize border-0 bg-transparent"
      />
      <button
        type="button"
        aria-label="Diapositiva siguiente"
        onClick={sig}
        className="absolute inset-y-0 right-0 z-20 w-[18%] cursor-e-resize border-0 bg-transparent"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-6 py-5 sm:px-10 md:px-14 md:py-8">
        {/* Barra superior */}
        <header className="relative z-30 mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PixelG className="w-8 text-goya-amber sm:w-10" />
            <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <Link
            to="/hackathon"
            className="relative z-30 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline hover:text-goya-paper"
          >
            ← Landing
          </Link>
        </header>

        <main
          key={slide.id}
          className="relative z-10 flex flex-1 flex-col justify-center animate-[goyaPixelIn_480ms_ease-out]"
        >
          <SlideBody slide={slide} />
        </main>

        {/* Progreso + hint */}
        <footer className="relative z-30 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Ir a ${s.titulo}`}
                aria-current={idx === i}
                onClick={() => ir(idx)}
                className={`h-1.5 rounded-full border-0 transition-all ${
                  idx === i ? 'w-8 bg-goya-amber' : 'w-1.5 bg-goya-amber/25 hover:bg-goya-amber/50'
                }`}
              />
            ))}
          </div>
          <p className="font-mono text-[9px] uppercase tracking-label text-slate-600">
            ← → · Espacio · F pantalla completa
          </p>
        </footer>
      </div>
    </div>
  )
}

const Rotulo: React.FC<{ children?: string }> = ({ children }) =>
  children ? (
    <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-amber sm:text-xs">
      {children}
    </p>
  ) : null

const SlideBody: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => {
  switch (slide.kind) {
    case 'portada':
      return <SlidePortada slide={slide} />
    case 'fotos':
      return <SlideFotos slide={slide} />
    case 'logos':
      return <SlideLogos slide={slide} />
    case 'grid':
    case 'lista':
    case 'premios':
      return <SlideItems slide={slide} destacado={slide.kind === 'premios'} />
    case 'cierre':
      return <SlideCierre slide={slide} />
    default:
      return <SlideTexto slide={slide} />
  }
}

const SlidePortada: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => (
  <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
    {slide.fondo && (
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: `linear-gradient(to top, #010004 10%, transparent 70%), url(${slide.fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
    )}
    <div>
      <Rotulo>{slide.rotulo}</Rotulo>
      <Barras className="mb-6" />
      <h1 className="font-display text-[clamp(3.5rem,14vw,9rem)] uppercase leading-[0.85] tracking-tight text-goya-paper">
        {slide.titulo}
      </h1>
      {slide.subtitulo && (
        <p className="goya-rule mt-6 w-fit font-display text-xl uppercase tracking-wide text-goya-amber sm:text-3xl">
          {slide.subtitulo}
        </p>
      )}
      {slide.cuerpo && (
        <p className="mt-4 max-w-xl font-mono text-xs uppercase tracking-label text-slate-400 sm:text-sm">
          {slide.cuerpo}
        </p>
      )}
    </div>
    <div className="flex w-full max-w-[min(100%,18rem)] flex-col items-end gap-4 sm:max-w-none">
      <PixelG animado className="w-[clamp(5rem,22vw,13rem)] text-goya-amber" />
      <PixelFranja
        formas={['anillo', 'cruz', 'diamante']}
        tamano="sm"
        modo="grupo"
        tono="text-goya-paper/45"
      />
    </div>
  </div>
)

const SlideTexto: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => (
  <div className="mx-auto max-w-4xl">
    <Rotulo>{slide.rotulo}</Rotulo>
    <h2 className="font-display text-[clamp(2.2rem,7vw,4.5rem)] uppercase leading-[0.95] tracking-wide text-goya-paper">
      {slide.titulo}
    </h2>
    {slide.subtitulo && (
      <p className="mt-3 font-mono text-sm uppercase tracking-label text-goya-amber sm:text-base">
        {slide.subtitulo}
      </p>
    )}
    {slide.cuerpo && (
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-xl">{slide.cuerpo}</p>
    )}
    {slide.bullets && (
      <ul className="mt-8 space-y-3">
        {slide.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-sm text-goya-paper sm:text-lg">
            <span className="mt-2 h-2 w-2 shrink-0 bg-goya-amber" aria-hidden />
            {b}
          </li>
        ))}
      </ul>
    )}
  </div>
)

const SlideFotos: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => (
  <div>
    <Rotulo>{slide.rotulo}</Rotulo>
    <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] uppercase tracking-wide text-goya-paper">
      {slide.titulo}
    </h2>
    {slide.subtitulo && (
      <p className="mt-2 font-mono text-xs uppercase tracking-label text-goya-amber">{slide.subtitulo}</p>
    )}
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
      {(slide.fotos as SlideFoto[]).map((f) => (
        <figure key={f.src} className="goya-panel overflow-hidden p-0">
          <div className="aspect-[3/4] overflow-hidden bg-goya-void">
            <img
              src={f.src}
              alt={f.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          {f.caption && (
            <figcaption className="px-2 py-2 font-mono text-[9px] uppercase tracking-label text-slate-400">
              {f.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  </div>
)

const SlideLogos: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => (
  <div>
    <Rotulo>{slide.rotulo}</Rotulo>
    <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] uppercase tracking-wide text-goya-paper">
      {slide.titulo}
    </h2>
    {slide.subtitulo && (
      <p className="mt-2 font-mono text-xs uppercase tracking-label text-goya-amber">{slide.subtitulo}</p>
    )}
    <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
      {(slide.logos as SlideLogo[]).map((l) => (
        <div
          key={l.nombre}
          className="goya-panel flex aspect-[5/3] flex-col items-center justify-center gap-2 p-4"
        >
          <img
            src={l.src}
            alt={l.nombre}
            className={`max-h-12 w-auto max-w-full object-contain sm:max-h-14 ${
              l.colorPropio ? '' : '[filter:brightness(0)_invert(1)]'
            }`}
          />
          <span className="text-center font-mono text-[9px] uppercase tracking-label text-slate-500">
            {l.nombre}
          </span>
        </div>
      ))}
    </div>
  </div>
)

const SlideItems: React.FC<{ slide: PresentacionSlide; destacado?: boolean }> = ({
  slide,
  destacado,
}) => (
  <div>
    <Rotulo>{slide.rotulo}</Rotulo>
    <h2 className="font-display text-[clamp(1.8rem,5vw,3.5rem)] uppercase tracking-wide text-goya-paper">
      {slide.titulo}
    </h2>
    {slide.subtitulo && (
      <p className="mt-2 font-mono text-sm uppercase tracking-label text-goya-amber sm:text-base">
        {slide.subtitulo}
      </p>
    )}
    <div
      className={`mt-8 grid gap-3 sm:gap-4 ${
        (slide.items?.length ?? 0) > 4 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {(slide.items as SlideItem[]).map((it) => (
        <article
          key={it.titulo}
          className={`goya-panel p-5 sm:p-6 ${destacado ? 'goya-panel-lit border border-goya-amber/25' : ''}`}
        >
          {it.meta && (
            <p className="font-mono text-[10px] font-bold uppercase tracking-label text-goya-amber">
              {it.meta}
            </p>
          )}
          <h3 className="mt-1 font-display text-xl uppercase tracking-wide text-goya-paper sm:text-2xl">
            {it.titulo}
          </h3>
          {it.detalle && (
            <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">{it.detalle}</p>
          )}
        </article>
      ))}
    </div>
  </div>
)

const SlideCierre: React.FC<{ slide: PresentacionSlide }> = ({ slide }) => (
  <div className="relative">
    {slide.fondo && (
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to top, #010004, transparent), url(${slide.fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />
    )}
    <div className="mb-8 overflow-hidden opacity-70">
      <Multitud cantidad={16} cadaCuantasAmbar={3} animado />
    </div>
    <Rotulo>{slide.rotulo}</Rotulo>
    <h2 className="font-display text-[clamp(2.4rem,8vw,5rem)] uppercase leading-[0.95] tracking-wide text-goya-amber">
      {slide.titulo}
    </h2>
    {slide.subtitulo && (
      <p className="mt-4 font-mono text-base uppercase tracking-label text-goya-paper sm:text-xl">
        {slide.subtitulo}
      </p>
    )}
    {slide.cuerpo && (
      <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">{slide.cuerpo}</p>
    )}
    <div className="mt-10 flex flex-wrap gap-3">
      <a
        href="/hackathon/dashboard"
        className="goya-cut inline-flex bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline"
        style={{ ['--cut' as string]: '9px' }}
      >
        Regístrate
      </a>
      <a
        href="https://luma.com/goyahack"
        target="_blank"
        rel="noreferrer"
        className="goya-cut inline-flex border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline"
        style={{ ['--cut' as string]: '9px' }}
      >
        Calendario Luma
      </a>
    </div>
  </div>
)

export default HackathonPresentacion
