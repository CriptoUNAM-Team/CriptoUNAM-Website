import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import Reveal from '../Reveal'
import { Rotulo } from './adornos'

const FUENTE_DEFAULT = '/video/goyahack-unam.mp4'
const CARTELERA_DEFAULT = '/video/goyahack-unam-poster.jpg'

type Props = {
  /** Ancla de la sección, si hace falta enlazarla. */
  id?: string
  /** Antetítulo en mono. */
  rotulo: string
  /** Titular grande en versalitas. */
  titulo: string
  /** Rótulo pequeño arriba a la izquierda, sobre la imagen. */
  etiqueta?: string
  /** Línea grande abajo a la izquierda, sobre la imagen. */
  pie?: string
  /** Línea pequeña en ámbar bajo el pie. */
  subpie?: string
  /** Vídeo bajo /public. Por defecto el de CU en la home. */
  videoSrc?: string
  posterSrc?: string
}

/**
 * Banda de vídeo de Ciudad Universitaria.
 *
 * Va a sangre —fuera de `Seccion`, que centra a 1500 px— porque el plano es
 * panorámico (2.13:1) y encajonado pierde toda la escala. El material se
 * reproduce en bucle, mudo y sin controles nativos: es ambiente, no un vídeo
 * que alguien vaya a "ver". Los dos únicos mandos son sonido y pausa.
 *
 * Solo se reproduce mientras está en pantalla: un `<video>` en bucle a lo largo
 * de una página entera gasta batería en el móvil sin que nadie lo esté viendo.
 *
 * El texto llega por props porque la misma banda sale en la home y en la
 * landing del hackathon, y en cada sitio dice otra cosa.
 */
const BandaCU: React.FC<Props> = ({
  id,
  rotulo,
  titulo,
  etiqueta,
  pie,
  subpie,
  videoSrc = FUENTE_DEFAULT,
  posterSrc = CARTELERA_DEFAULT,
}) => {
  const seccion = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  const [conSonido, setConSonido] = useState(false)
  /** Pausa pedida a mano. Manda sobre la pausa automática por visibilidad. */
  const [pausado, setPausado] = useState(false)
  /**
   * Con `prefers-reduced-motion` no se reproduce nada: queda la cartelera fija
   * y los mandos desaparecen, porque no hay nada que mandar.
   */
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  // Reproducir solo dentro del viewport.
  useEffect(() => {
    const el = seccion.current
    const v = video.current
    if (!el || !v || reducido) return

    // Sin observer no hay manera de saber si está en pantalla: se reproduce y
    // punto, que es peor para la batería pero deja el bloque vivo.
    if (typeof IntersectionObserver === 'undefined') {
      if (!pausado) v.play().catch(() => {})
      return
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !pausado) {
          // `play()` devuelve una promesa que el navegador rechaza si aún no
          // hay interacción y el vídeo no está mudo. No es un error que haya
          // que propagar: simplemente no arranca.
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      // Umbral 0 y margen holgado: la banda es más alta que muchas ventanas,
      // así que exigir un porcentaje del bloque la dejaba parada justo cuando
      // llena la pantalla. Con esto arranca un poco antes de asomar y ya está
      // rodando cuando se ve.
      { threshold: 0, rootMargin: '200px 0px 200px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [pausado, reducido])

  const alternarSonido = useCallback(() => {
    const v = video.current
    if (!v) return
    const nuevo = !conSonido
    v.muted = !nuevo
    setConSonido(nuevo)
    // Quitar el mute cuenta como interacción, así que aquí sí puede arrancar.
    if (nuevo) v.play().catch(() => {})
  }, [conSonido])

  const alternarPausa = useCallback(() => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPausado(false)
    } else {
      v.pause()
      setPausado(true)
    }
  }, [])

  const mando =
    'goya-cut flex h-10 w-10 items-center justify-center border border-goya-amber/40 bg-goya-void/60 text-goya-paper backdrop-blur-sm transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber'

  return (
    <section
      ref={seccion}
      id={id}
      className="goya-anchor relative w-full overflow-hidden py-20 md:py-28"
    >
      {/* Cabecera, alineada con el resto de secciones aunque el vídeo salga
          del contenedor. */}
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 md:px-12">
        <Reveal as="div" delay={100}>
          <Rotulo>{rotulo}</Rotulo>
        </Reveal>
        <Reveal as="h2" delay={180} className="goya-rule mt-4 w-fit max-w-full">
          <span className="block font-display text-3xl uppercase leading-[1.05] tracking-wide text-goya-paper sm:text-4xl md:text-5xl">
            {titulo}
          </span>
        </Reveal>
      </div>

      {/* ---- La banda ---- */}
      <Reveal as="div" delay={220} className="relative mt-12 md:mt-16">
        <div
          className="goya-cut relative mx-auto w-full max-w-[1760px]"
          style={{ ['--cut' as string]: '28px' }}
        >
          <div className="relative aspect-[64/27] w-full bg-goya-void sm:aspect-[2.13/1]">
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              src={reducido ? undefined : videoSrc}
              poster={posterSrc}
              muted={!conSonido}
              loop
              playsInline
              preload="auto"
              // Decorativo: el contenido informativo está en el texto de al
              // lado, así que no compite con él en los lectores de pantalla.
              aria-hidden="true"
              tabIndex={-1}
            />

            {/* Retícula azul del cartel sobre la imagen, para que el plano no
                se lea como un vídeo pegado sino como parte de la maqueta. */}
            <div
              className="goya-grid pointer-events-none absolute inset-0 opacity-20"
              aria-hidden="true"
            />

            {/*
              Viñeta. Va deliberadamente floja: el material ya es oscuro y
              apagado, y con más carga el plano se leía como un rectángulo
              negro. Lo único que se oscurece de verdad es la franja inferior,
              que es donde va el texto y necesita contraste.
            */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(130% 100% at 50% 40%, transparent 45%, rgba(1,0,4,0.35) 100%), linear-gradient(to top, rgba(1,0,4,0.88) 0%, rgba(1,0,4,0.35) 22%, transparent 45%)',
              }}
              aria-hidden="true"
            />

            {/* ---- Rótulos sobre la imagen ---- */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 md:p-10">
              {etiqueta ? (
                <p className="font-mono text-[10px] uppercase tracking-label text-goya-paper/70 sm:text-[11px]">
                  {etiqueta}
                </p>
              ) : (
                <span />
              )}

              <div className="flex flex-wrap items-end justify-between gap-5">
                <div className="min-w-0">
                  {pie && (
                    <p className="font-display text-2xl uppercase leading-none tracking-wide text-goya-paper sm:text-4xl md:text-5xl">
                      {pie}
                    </p>
                  )}
                  {subpie && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-goya-amber sm:text-[11px]">
                      {subpie}
                    </p>
                  )}
                </div>

                {/* Mandos. Sin ellos el vídeo no tendría manera de callarse ni
                    de detenerse, porque no lleva controles nativos. */}
                {!reducido && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={alternarPausa}
                      aria-label={pausado ? 'Reanudar el vídeo' : 'Pausar el vídeo'}
                      className={mando}
                      style={{ ['--cut' as string]: '7px' }}
                    >
                      {pausado ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={alternarSonido}
                      aria-label={conSonido ? 'Silenciar el vídeo' : 'Activar el sonido'}
                      aria-pressed={conSonido}
                      className={mando}
                      style={{ ['--cut' as string]: '7px' }}
                    >
                      {conSonido ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default BandaCU
