import React from 'react'
import { Play } from 'lucide-react'
import { VIDEOS_ACTUALIZACION, type VideoActualizacion } from '../../../data/actualizacionesHackathon'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const fecha = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
    : null

const SlotVideo: React.FC<{ video: VideoActualizacion; index: number }> = ({ video, index }) => {
  const listo = Boolean(video.videoUrl)

  return (
    <Reveal as="article" delay={160 + index * 80} className="goya-panel goya-panel-hover overflow-hidden">
      <div className="relative aspect-video w-full overflow-hidden bg-goya-void">
        {listo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={video.videoUrl}
            poster={video.posterUrl}
            controls
            playsInline
            preload="metadata"
            aria-label={video.titulo}
          />
        ) : (
          <>
            {video.posterUrl ? (
              <img
                src={video.posterUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            ) : (
              <div
                className="goya-grid absolute inset-0 opacity-30"
                aria-hidden="true"
              />
            )}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{
                background:
                  'linear-gradient(to top, rgba(1,0,4,0.9) 0%, rgba(1,0,4,0.5) 50%, rgba(1,0,4,0.7) 100%)',
              }}
            >
              <span className="goya-cut flex h-12 w-12 items-center justify-center border border-goya-amber/40 bg-goya-void/60 text-goya-amber">
                <Play size={18} fill="currentColor" />
              </span>
              <span className="font-mono text-[9px] uppercase tracking-label text-goya-amber">
                Próximamente
              </span>
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-sm uppercase leading-tight tracking-wide text-goya-paper">
            {video.titulo}
          </h3>
          {video.fecha && (
            <time
              dateTime={video.fecha}
              className="font-mono text-[9px] uppercase tracking-label text-slate-500"
            >
              {fecha(video.fecha)}
            </time>
          )}
        </div>
        {video.duracion && (
          <p className="mt-1 font-mono text-[9px] uppercase tracking-label text-slate-600">
            {video.duracion}
          </p>
        )}
      </div>
    </Reveal>
  )
}

const Actualizaciones: React.FC = () => (
  <Seccion
    id="actualizaciones"
    rotulo="Novedades"
    titulo="Últimas actualizaciones"
    intro="Vídeos del evento: kickoff, construcción, mentorías y Demo Day. Se publican conforme avanza Goya Hack."
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {VIDEOS_ACTUALIZACION.map((v, i) => (
        <SlotVideo key={v.id} video={v} index={i} />
      ))}
    </div>
  </Seccion>
)

export default Actualizaciones
