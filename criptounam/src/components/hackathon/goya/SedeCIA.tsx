import React, { useCallback, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { SEDES } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

/**
 * Sede principal del hackathon con vídeo del CIA en bucle, siempre mudo.
 * MP4 + MOV como fuentes para máxima compatibilidad.
 */
const SedeCIA: React.FC = () => {
  const sede = SEDES.find((s) => s.principal)
  const contenedor = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  const intentarPlay = useCallback(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])

  useEffect(() => {
    const el = contenedor.current
    const v = video.current
    if (!el || !v || !sede?.video) return

    v.muted = true

    if (typeof IntersectionObserver === 'undefined') {
      intentarPlay()
      return
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) intentarPlay()
        else v.pause()
      },
      { threshold: 0, rootMargin: '120px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [sede?.video, intentarPlay])

  if (!sede) return null

  const poster = sede.videoPoster ?? sede.imagen
  const mp4 = sede.video ?? '/video/CIA.mp4'
  const mov = sede.videoMov ?? '/video/CIA.mov'

  return (
    <Seccion id="sedes" rotulo="Sede" titulo="Centro de Ingeniería Avanzada" intro={sede.descripcion}>
      <Reveal as="article" delay={160} className="goya-panel goya-panel-lit" style={{ ['--cut' as string]: '20px' }}>
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div ref={contenedor} className="relative min-h-[280px] overflow-hidden bg-goya-void lg:min-h-[420px]">
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              poster={poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-label={sede.nombreLargo ?? sede.nombre}
              onLoadedData={intentarPlay}
              onCanPlay={intentarPlay}
              onError={intentarPlay}
            >
              <source src={mp4} type="video/mp4" />
              {mov && <source src={mov} type="video/quicktime" />}
            </video>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(1,0,4,0.88) 0%, rgba(1,0,4,0.2) 45%), linear-gradient(to right, transparent 50%, rgba(1,0,4,0.65) 100%)',
              }}
              aria-hidden="true"
            />
            <div className="goya-grid pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
            <p className="absolute left-5 top-5 max-w-[min(100%,20rem)] rounded-sm bg-goya-void/75 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-goya-amber backdrop-blur-sm">
              Aquí se construye · CIA · Edificio X
            </p>
            <p className="absolute bottom-5 left-5 max-w-xs rounded-sm bg-goya-void/80 px-3 py-2 font-display text-2xl uppercase leading-none tracking-wide text-goya-paper backdrop-blur-sm sm:text-3xl">
              Facultad de Ingeniería, UNAM
            </p>
          </div>

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

            {sede.horario && (
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-label text-goya-amber/80">
                {sede.horario}
              </p>
            )}

            <p className="text-sm leading-relaxed text-slate-400">
              Nave de cristal del Edificio X: mesas de trabajo, mentorías y soporte técnico durante los cuatro días
              de construcción.
            </p>

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
    </Seccion>
  )
}

export default SedeCIA
