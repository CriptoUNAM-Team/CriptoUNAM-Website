import React, { useState } from 'react'
import { Clock, Users, Laptop, Zap, Trophy, Rocket } from 'lucide-react'
import { AGENDA, CRITERIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'

/** Un icono por franja horaria, para que el programa se lea de un vistazo. */
const iconoDe = (titulo: string) => {
  const t = titulo.toLowerCase()
  if (t.includes('registro') || t.includes('acredit')) return Users
  if (t.includes('apertura') || t.includes('kickoff')) return Zap
  if (t.includes('premiación') || t.includes('clausura')) return Trophy
  if (t.includes('demo')) return Rocket
  if (t.includes('cierre')) return Clock
  return Laptop
}

const TimelineCriterios: React.FC = () => {
  const [dia, setDia] = useState(AGENDA[0]?.id ?? '')
  const activo = AGENDA.find((d) => d.id === dia) ?? AGENDA[0]

  return (
    <section
      id="timeline"
      className="flex flex-col gap-14 px-5 pb-24 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
        {/* Programa */}
        <div className="md:max-w-sm">
          <Reveal
            as="h2"
            delay={120}
            className="text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl"
          >
            Programa
          </Reveal>

          <Reveal as="div" delay={160} className="mt-6 flex flex-wrap gap-2">
            {AGENDA.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDia(d.id)}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                  d.id === activo?.id
                    ? 'bg-accent text-black'
                    : 'border border-accent/30 bg-accent/5 text-accent hover:bg-accent/10'
                }`}
              >
                {d.etiqueta.split('·')[0].trim()}
              </button>
            ))}
          </Reveal>

          <div className="mt-8 flex flex-col gap-6">
            {activo?.items.map((item, i) => {
              const Icono = iconoDe(item.titulo)
              return (
                <Reveal
                  key={`${item.hora}-${i}`}
                  as="div"
                  delay={180 + i * 100}
                  className="flex gap-3"
                >
                  <Icono size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-label text-white/80">
                      {item.titulo}
                    </p>
                    <p className="font-mono text-[11px] tracking-label text-accent">{item.hora}</p>
                    {item.descripcion && (
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {item.descripcion}
                      </p>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Criterios */}
        <div className="md:max-w-md">
          <Reveal
            as="h2"
            delay={120}
            className="text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl"
          >
            Cómo se califica
          </Reveal>
          <Reveal as="p" delay={160} className="mt-3 text-sm text-white/70">
            El jurado puntúa estos cuatro ejes con el mismo peso.
          </Reveal>

          <div className="mt-6">
            {CRITERIOS.map((c, i) => (
              <Reveal
                key={c.id}
                as="div"
                delay={200 + i * 100}
                className="mb-3 rounded-lg border border-accent/20 bg-white/10 px-4 py-3 backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-white">{c.titulo}</span>
                  </span>
                  <span className="font-mono text-xs text-accent">25%</span>
                </div>
                <p className="mt-1.5 pl-8 text-xs leading-relaxed text-white/60">
                  {c.descripcion}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineCriterios
