import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { SEDES } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const MP4 = '/video/CIA.mp4'
const MOV = '/video/CIA.mov'

/**
 * Sede principal del hackathon: vídeo del CIA a ancho completo, siempre mudo.
 */
const SedeCIA: React.FC = () => {
  const sede = SEDES.find((s) => s.principal)
  const contenedor = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [posterActivo, setPosterActivo] = useState(true)

  const intentarPlay = useCallback(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    const prom = v.play()
    if (prom) {
      prom
        .then(() => {
          setPosterActivo(false)
          v.removeAttribute('poster')
        })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    const el = contenedor.current
    const v = video.current
    if (!el || !v) return

    v.muted = true
    intentarPlay()

    if (typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) intentarPlay()
        else v.pause()
      },
      { threshold: 0, rootMargin: '200px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [intentarPlay])

  if (!sede) return null

  const poster = posterActivo ? (sede.videoPoster ?? sede.imagen) : undefined

  return (
    <Seccion id="sedes" rotulo="Sede" titulo="Centro de Ingeniería Avanzada" intro={sede.descripcion}>
      {/* Vídeo a ancho completo — fuera del grid para que se vea de inmediato */}
      <Reveal as="div" delay={140} inmediato className="-mx-5 sm:-mx-8 md:-mx-12">
        <div
          ref={contenedor}
          className="goya-cut relative aspect-video w-full overflow-hidden bg-goya-void sm:aspect-[2.13/1]"
          style={{ ['--cut' as string]: '20px' }}
        >
          <video
            ref={video}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            src={MP4}
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-label={sede.nombreLargo ?? sede.nombre}
            onLoadedData={intentarPlay}
            onCanPlay={intentarPlay}
            onPlaying={() => {
              setPosterActivo(false)
              video.current?.removeAttribute('poster')
            }}
          >
            <source src={MP4} type="video/mp4" />
            <source src={MOV} type="video/quicktime" />
          </video>

          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to top, rgba(1,0,4,0.75) 0%, rgba(1,0,4,0.15) 40%, transparent 65%)',
            }}
            aria-hidden="true"
          />
          <div className="goya-grid pointer-events-none absolute inset-0 z-10 opacity-10" aria-hidden="true" />

          <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8">
            <p className="w-fit rounded-sm bg-goya-void/80 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-goya-amber backdrop-blur-sm">
              Aquí se construye · CIA · Edificio X
            </p>
            <p className="w-fit max-w-lg rounded-sm bg-goya-void/85 px-3 py-2 font-display text-2xl uppercase leading-none tracking-wide text-goya-paper backdrop-blur-sm sm:text-4xl">
              Facultad de Ingeniería, UNAM
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal as="article" delay={200} className="goya-panel goya-panel-lit mt-6" style={{ ['--cut' as string]: '16px' }}>
        <div className="flex flex-col gap-4 p-7 sm:flex-row sm:items-center sm:justify-between lg:p-9">
          <div>
            <h3 className="font-display text-3xl uppercase leading-none tracking-wide text-goya-amber sm:text-4xl">
              {sede.nombre}
            </h3>
            {sede.nombreLargo && (
              <p className="goya-rule mt-2 w-fit font-mono text-[11px] uppercase tracking-label text-goya-paper">
                {sede.nombreLargo}
              </p>
            )}
            {sede.horario && (
              <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-label text-goya-amber/80">
                {sede.horario}
              </p>
            )}
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Nave de cristal del Edificio X: mesas de trabajo, mentorías y soporte técnico durante los cuatro días
              de construcción.
            </p>
          </div>

          {sede.mapsUrl && (
            <a
              href={sede.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="goya-cut inline-flex shrink-0 items-center gap-2 border border-goya-amber/45 px-5 py-2.5 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
              style={{ ['--cut' as string]: '8px' }}
            >
              <MapPin size={12} />
              Cómo llegar
            </a>
          )}
        </div>
      </Reveal>
    </Seccion>
  )
}

export default SedeCIA
