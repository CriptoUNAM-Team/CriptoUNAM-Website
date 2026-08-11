import React from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, AlertCircle, Bell } from 'lucide-react'
import {
  actualizacionesOrdenadas,
  ACTUALIZACION_TIPO_LABEL,
  type ActualizacionTipo,
} from '../../../data/actualizacionesHackathon'
import Reveal from '../../Reveal'

const ESTILO: Record<ActualizacionTipo, { icono: typeof Bell; color: string }> = {
  anuncio: { icono: Megaphone, color: 'text-accent' },
  importante: { icono: AlertCircle, color: 'text-amber-300' },
  recordatorio: { icono: Bell, color: 'text-violet-300' },
}

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

const Actualizaciones: React.FC = () => {
  const items = actualizacionesOrdenadas()
  if (items.length === 0) return null

  return (
    <section className="px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16">
      <Reveal as="div" delay={120} className="badge-accent w-fit">
        <span className="font-mono text-[11px] uppercase tracking-label text-accent">
          Novedades
        </span>
      </Reveal>

      <Reveal
        as="h2"
        delay={180}
        className="mt-5 text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl"
      >
        Últimas actualizaciones
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((a, i) => {
          const { icono: Icono, color } = ESTILO[a.tipo]
          const interno = a.url?.startsWith('/')
          return (
            <Reveal
              key={a.id}
              as="article"
              delay={200 + i * 100}
              className="rounded-xl border border-accent/20 bg-white/10 p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`flex items-center gap-1.5 ${color}`}>
                  <Icono size={14} />
                  <span className="label-mono">{ACTUALIZACION_TIPO_LABEL[a.tipo]}</span>
                </span>
                <time dateTime={a.fecha} className="text-xs text-white/45">
                  {fecha(a.fecha)}
                </time>
              </div>

              <h3 className="mt-2 text-base font-medium text-white">{a.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{a.contenido}</p>

              {a.url &&
                (interno ? (
                  <Link
                    to={a.url}
                    className="mt-3 inline-block text-sm font-medium text-accent no-underline"
                  >
                    {a.urlLabel ?? 'Ver más'} →
                  </Link>
                ) : (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-accent no-underline"
                  >
                    {a.urlLabel ?? 'Ver más'} →
                  </a>
                ))}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Actualizaciones
