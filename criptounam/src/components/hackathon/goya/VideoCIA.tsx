import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, Pause } from 'lucide-react'
import Reveal from '../../Reveal'

type Props = {
  src: string
  poster: string
  /** Respaldo QuickTime para Safari si hace falta. */
  srcMov?: string
  titulo: string
  subtitulo?: string
}

/**
 * Vídeo del CIA dentro del bloque "Dónde".
 *
 * Mismo tratamiento que BandaCU: bucle, mudo por defecto, play solo en
 * viewport, controles mínimos (pausa / sonido) y cartelera fija con
 * prefers-reduced-motion.
 */
const VideoCIA: React.FC<Props> = ({ src, poster, srcMov, titulo, subtitulo }) => {
  const contenedor = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  const [conSonido, setConSonido] = useState(false)
  const [pausado, setPausado] = useState(false)
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducido(mq.matches)
    const alCambiar = (e: MediaQueryListEvent) => setReducido(e.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  useEffect(() => {
    const el = contenedor.current
    const v = video.current
    if (!el || !v || reducido) return

    if (typeof IntersectionObserver === 'undefined') {
      if (!pausado) v.play().catch(() => {})
      return
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !pausado) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0, rootMargin: '120px 0px 120px 0px' }
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
    'goya-cut flex h-9 w-9 items-center justify-center border border-goya-amber/40 bg-goya-void/70 text-goya-paper backdrop-blur-sm transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber'

  return (
    <Reveal as="div" delay={200} className="mt-5">
      <div
        ref={contenedor}
        className="goya-panel overflow-hidden"
        style={{ ['--cut' as string]: '18px' }}
      >
        <div className="relative aspect-video w-full bg-goya-void">
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster={poster}
            muted={!conSonido}
            loop
            playsInline
            preload="metadata"
            aria-label={titulo}
          >
            {!reducido && <source src={src} type="video/mp4" />}
            {!reducido && srcMov && <source src={srcMov} type="video/quicktime" />}
          </video>

          <div className="goya-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(1,0,4,0.9) 0%, rgba(1,0,4,0.2) 35%, transparent 55%)',
            }}
            aria-hidden="true"
          />

          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
              Centro de Ingeniería Avanzada
            </p>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-xl uppercase leading-none tracking-wide text-goya-paper sm:text-2xl">
                  {titulo}
                </p>
                {subtitulo && (
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{subtitulo}</p>
                )}
              </div>

              {!reducido && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={alternarPausa}
                    aria-label={pausado ? 'Reanudar el vídeo del CIA' : 'Pausar el vídeo del CIA'}
                    className={mando}
                    style={{ ['--cut' as string]: '6px' }}
                  >
                    {pausado ? <Play size={13} /> : <Pause size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={alternarSonido}
                    aria-label={conSonido ? 'Silenciar el vídeo del CIA' : 'Activar el sonido del vídeo del CIA'}
                    aria-pressed={conSonido}
                    className={mando}
                    style={{ ['--cut' as string]: '6px' }}
                  >
                    {conSonido ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default VideoCIA
