import React, { useEffect, useRef, useState } from 'react'

/**
 * Fondo de vídeo cuya reproducción la controla el scroll de la página.
 *
 * Tres capas superpuestas que se van relevando:
 *   1. póster    — se ve de inmediato, sin esperar red
 *   2. <video>   — toma el relevo en cuanto tiene un fotograma decodificado
 *   3. <canvas>  — dibuja fotogramas cacheados; es el modo fluido definitivo
 *
 * Buscar dentro de un <video> en cada scroll da tirones porque el decodificador
 * solo salta entre keyframes. Por eso, cuando el vídeo está listo, se extraen
 * fotogramas a `ImageBitmap` y el canvas pinta el que toque: eso sí va suave.
 *
 * En móvil y con `prefers-reduced-motion` no se descarga el vídeo: se queda el
 * póster. Son 770 KB que no aportan nada en una pantalla pequeña ni a quien ha
 * pedido menos movimiento.
 */

type Props = {
  src: string
  poster: string
  /**
   * Oscurecimiento sobre el vídeo. El clip es un fondo gris claro y encima va
   * texto blanco: sin un velo fuerte el hero resulta ilegible.
   */
  scrim?: number
}

const MAX_FRAMES = 90
const FRAME_WIDTH = 960
/** Suavizado del scroll: cuanto más bajo, más inercia. */
const LERP = 0.12

const ScrollVideo: React.FC<Props> = ({ src, poster, scrim = 0.78 }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<ImageBitmap[]>([])
  const rafRef = useRef<number>()
  const smoothedRef = useRef(0)

  const [videoListo, setVideoListo] = useState(false)
  const [framesListos, setFramesListos] = useState(false)
  const [usarVideo, setUsarVideo] = useState(false)

  // ¿Merece la pena descargar el vídeo en este dispositivo?
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pantallaChica = window.matchMedia('(max-width: 768px)').matches
    setUsarVideo(!reducido && !pantallaChica)
  }, [])

  /** Dibuja `bitmap` recortado al centro, como `object-fit: cover`. */
  const pintarCover = (
    ctx: CanvasRenderingContext2D,
    fuente: CanvasImageSource,
    anchoFuente: number,
    altoFuente: number,
    ancho: number,
    alto: number
  ) => {
    const escala = Math.max(ancho / anchoFuente, alto / altoFuente)
    const w = anchoFuente * escala
    const h = altoFuente * escala
    ctx.clearRect(0, 0, ancho, alto)
    ctx.drawImage(fuente, (ancho - w) / 2, (alto - h) / 2, w, h)
  }

  // Extracción de fotogramas: se lanza cuando el vídeo visible ya puede pintar.
  useEffect(() => {
    if (!usarVideo || !videoListo) return
    let cancelado = false

    const extraer = async () => {
      const oculto = document.createElement('video')
      oculto.src = src
      oculto.muted = true
      oculto.playsInline = true
      oculto.preload = 'auto'
      oculto.crossOrigin = 'anonymous'

      await new Promise<void>((resolve) => {
        oculto.onloadeddata = () => resolve()
        oculto.onerror = () => resolve()
      })
      if (cancelado || !oculto.duration || Number.isNaN(oculto.duration)) return

      const total = Math.max(24, Math.min(MAX_FRAMES, Math.floor(oculto.duration * 12)))
      const escala = FRAME_WIDTH / (oculto.videoWidth || FRAME_WIDTH)
      const w = FRAME_WIDTH
      const h = Math.round((oculto.videoHeight || 540) * escala)

      const lienzo = document.createElement('canvas')
      lienzo.width = w
      lienzo.height = h
      const ctx = lienzo.getContext('2d')
      if (!ctx) return

      const capturados: ImageBitmap[] = []
      for (let i = 0; i < total; i++) {
        if (cancelado) return
        const t = (i / (total - 1)) * (oculto.duration - 0.05)
        await new Promise<void>((resolve) => {
          const alBuscar = () => {
            oculto.removeEventListener('seeked', alBuscar)
            resolve()
          }
          oculto.addEventListener('seeked', alBuscar)
          oculto.currentTime = t
        })
        ctx.drawImage(oculto, 0, 0, w, h)
        capturados.push(await createImageBitmap(lienzo))
      }

      if (cancelado) {
        capturados.forEach((b) => b.close())
        return
      }
      framesRef.current = capturados
      setFramesListos(true)
    }

    // Un respiro para no competir con el primer render de la página.
    const id = setTimeout(extraer, 300)
    return () => {
      cancelado = true
      clearTimeout(id)
      framesRef.current.forEach((b) => b.close())
      framesRef.current = []
    }
  }, [usarVideo, videoListo, src])

  // Bucle de scroll: suaviza el progreso y pinta.
  useEffect(() => {
    if (!usarVideo) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const ajustarLienzo = () => {
      const c = canvasRef.current
      if (!c) return
      c.width = Math.floor(window.innerWidth * dpr)
      c.height = Math.floor(window.innerHeight * dpr)
    }
    ajustarLienzo()
    window.addEventListener('resize', ajustarLienzo)

    const tick = () => {
      const alcance = document.documentElement.scrollHeight - window.innerHeight
      const objetivo = alcance > 0 ? Math.min(1, Math.max(0, window.scrollY / alcance)) : 0
      smoothedRef.current += (objetivo - smoothedRef.current) * LERP
      const p = smoothedRef.current

      const frames = framesRef.current
      const c = canvasRef.current
      if (frames.length > 0 && c) {
        const ctx = c.getContext('2d')
        const bmp = frames[Math.min(frames.length - 1, Math.round(p * (frames.length - 1)))]
        if (ctx && bmp) pintarCover(ctx, bmp, bmp.width, bmp.height, c.width, c.height)
      } else {
        // Todavía sin caché: se busca dentro del vídeo. Solo si el salto es
        // apreciable, para no encadenar `seek` que el decodificador no alcanza.
        const v = videoRef.current
        if (v && v.duration && !Number.isNaN(v.duration)) {
          const destino = p * (v.duration - 0.05)
          if (Math.abs(v.currentTime - destino) > 0.04) v.currentTime = destino
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', ajustarLienzo)
    }
  }, [usarVideo])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink"
      aria-hidden="true"
    >
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoListo || framesListos ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {usarVideo && (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoListo(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            videoListo && !framesListos ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          framesListos ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Velo oscuro: el clip es claro y encima va texto blanco. */}
      <div className="absolute inset-0" style={{ background: `rgba(10,10,10,${scrim})` }} />
      {/* Tinte de marca por encima del velo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,217,255,0.10), rgba(124,58,237,0.08))',
        }}
      />
    </div>
  )
}

export default ScrollVideo
