import React from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, AlertCircle, Bell } from 'lucide-react'
import {
  actualizacionesOrdenadas,
  ACTUALIZACION_TIPO_LABEL,
  type ActualizacionTipo,
} from '../../../data/actualizacionesHackathon'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const ESTILO: Record<ActualizacionTipo, { icono: typeof Bell; color: string }> = {
  anuncio: { icono: Megaphone, color: 'text-goya-amber' },
  importante: { icono: AlertCircle, color: 'text-red-300' },
  recordatorio: { icono: Bell, color: 'text-sky-300' },
}

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

const Actualizaciones: React.FC = () => {
  const items = actualizacionesOrdenadas()
  if (items.length === 0) return null

  return (
    <Seccion
      rotulo="Novedades"
      titulo="Últimas actualizaciones"
      intro="Lo que se anuncia sobre la marcha: cambios de programa, avisos y recordatorios."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((a, i) => {
          const { icono: Icono, color } = ESTILO[a.tipo]
          const interno = a.url?.startsWith('/')
          return (
            <Reveal
              key={a.id}
              as="article"
              delay={180 + i * 100}
              className="goya-panel goya-panel-hover"
            >
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`flex items-center gap-2 ${color}`}>
                    <Icono size={13} />
                    <span className="font-mono text-[10px] uppercase tracking-label">
                      {ACTUALIZACION_TIPO_LABEL[a.tipo]}
                    </span>
                  </span>
                  <time
                    dateTime={a.fecha}
                    className="font-mono text-[10px] uppercase tracking-label text-slate-500"
                  >
                    {fecha(a.fecha)}
                  </time>
                </div>

                <h3 className="mt-3 font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                  {a.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{a.contenido}</p>

                {a.url &&
                  (interno ? (
                    <Link
                      to={a.url}
                      className="mt-4 inline-block font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                    >
                      {a.urlLabel ?? 'Ver más'} →
                    </Link>
                  ) : (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                    >
                      {a.urlLabel ?? 'Ver más'} →
                    </a>
                  ))}
              </div>
            </Reveal>
          )
        })}
      </div>
    </Seccion>
  )
}

export default Actualizaciones
