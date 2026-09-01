import React, { useEffect, useMemo, useState } from 'react'
import { MapPin, Sparkles } from 'lucide-react'
import {
  AGENDA,
  CRITERIOS,
  HACKATHON_INFO,
  SEDE_POR_ID,
  type AgendaDia,
  type AgendaItem,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

type Filtro = 'todo' | 'hitos' | 'construccion'

type Slot = {
  key: string
  dia: AgendaDia
  item: AgendaItem
  indice: number
}

const PESO = Math.round(100 / CRITERIOS.length)

const etiquetaTipo = (item: AgendaItem): { label: string; clase: string } => {
  if (item.hito) return { label: 'Hito', clase: 'bg-goya-amber text-goya-void' }
  if (item.sede === 'cia') return { label: 'Construcción', clase: 'border border-goya-amber/50 text-goya-amber' }
  return { label: 'Logística', clase: 'border border-slate-600 text-slate-400' }
}

const pasaFiltro = (item: AgendaItem, filtro: Filtro) => {
  if (filtro === 'todo') return true
  if (filtro === 'hitos') return Boolean(item.hito)
  return Boolean(item.sede === 'cia' && item.fin)
}

const imagenSlot = (item: AgendaItem) => {
  if (item.sede && SEDE_POR_ID[item.sede]) return SEDE_POR_ID[item.sede].imagen
  return '/images/CIA1.png'
}

const ProgramaAgenda: React.FC = () => {
  const [diaId, setDiaId] = useState(AGENDA[0]?.id ?? '')
  const [filtro, setFiltro] = useState<Filtro>('todo')
  const [seleccion, setSeleccion] = useState<string | null>(null)

  const dia = AGENDA.find((d) => d.id === diaId) ?? AGENDA[0]

  const slots: Slot[] = useMemo(() => {
    if (!dia) return []
    return dia.items
      .map((item, indice) => ({
        key: `${dia.id}-${indice}`,
        dia,
        item,
        indice,
      }))
      .filter((s) => pasaFiltro(s.item, filtro))
  }, [dia, filtro])

  useEffect(() => {
    if (slots.length === 0) {
      setSeleccion(null)
      return
    }
    if (!seleccion || !slots.some((s) => s.key === seleccion)) {
      setSeleccion(slots[0].key)
    }
  }, [slots, seleccion])

  const activo = slots.find((s) => s.key === seleccion) ?? slots[0]

  const FILTROS: { id: Filtro; label: string }[] = [
    { id: 'todo', label: 'Todo' },
    { id: 'hitos', label: 'Hitos' },
    { id: 'construccion', label: 'Construcción' },
  ]

  return (
    <Seccion
      id="timeline"
      rotulo="Programa"
      titulo="Cinco días, un BUIDL"
      intro={`Martes 22, 10:00 → viernes 25, 17:00 · ${HACKATHON_INFO.horas} horas de construcción. El sábado 26: Demo Day y premiación.`}
    >
      {/* Días */}
      <Reveal as="div" delay={120} className="flex flex-wrap gap-2">
        {AGENDA.map((d, i) => {
          const on = d.id === dia?.id
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDiaId(d.id)}
              aria-pressed={on}
              className={`goya-cut px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-label transition-colors duration-300 sm:text-[11px] ${
                on
                  ? 'bg-goya-amber text-goya-void'
                  : 'border border-goya-amber/30 text-slate-400 hover:border-goya-amber hover:text-goya-amber'
              }`}
              style={{ ['--cut' as string]: '8px' }}
            >
              Día {i + 1}
              <span className="ml-2 hidden font-normal opacity-80 sm:inline">
                {d.etiqueta.split('·')[0].trim()}
              </span>
            </button>
          )
        })}
      </Reveal>

      {/* Filtros */}
      <Reveal as="div" delay={160} className="mt-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const on = filtro === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              aria-pressed={on}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                on
                  ? 'bg-goya-amber text-goya-void'
                  : 'border border-goya-amber/25 bg-transparent text-slate-400 hover:border-goya-amber/50 hover:text-goya-paper'
              }`}
            >
              {f.id === 'todo' && <Sparkles size={11} />}
              {f.label}
            </button>
          )
        })}
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(280px,420px)] lg:gap-8">
        {/* Lista de horarios */}
        <Reveal as="div" delay={200} className="goya-panel min-h-[320px] overflow-hidden p-1">
          {slots.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Nada en este filtro para el día seleccionado.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {slots.map((slot) => {
                const on = slot.key === activo?.key
                const tipo = etiquetaTipo(slot.item)
                return (
                  <li key={slot.key}>
                    <button
                      type="button"
                      onClick={() => setSeleccion(slot.key)}
                      className={`flex w-full items-start gap-4 border-l-2 bg-transparent px-4 py-4 text-left transition-colors duration-200 ${
                        on
                          ? 'border-goya-amber bg-goya-amber/10'
                          : 'border-transparent hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="w-14 shrink-0 font-mono text-[11px] font-bold tracking-label text-goya-amber">
                        {slot.item.hora}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`goya-cut mb-2 inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${tipo.clase}`}
                          style={{ ['--cut' as string]: '4px' }}
                        >
                          {tipo.label}
                        </span>
                        <span
                          className={`block font-display text-sm uppercase leading-snug tracking-wide sm:text-base ${
                            on ? 'text-goya-amber' : 'text-slate-300'
                          }`}
                        >
                          {slot.item.titulo}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Reveal>

        {/* Tarjeta de detalle */}
        <Reveal as="div" delay={240} className="lg:sticky lg:top-24 lg:self-start">
          {activo ? (
            <article
              className="goya-panel goya-panel-lit overflow-hidden"
              style={{ ['--cut' as string]: '16px' }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-goya-void">
                <img
                  src={imagenSlot(activo.item)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(1,0,4,0.95) 0%, rgba(1,0,4,0.35) 45%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                    {etiquetaTipo(activo.item).label} · {activo.item.hora}
                    {activo.item.fin && ` – ${activo.item.fin}`}
                  </p>
                  <h3 className="mt-2 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
                    {activo.item.titulo}
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                {activo.item.descripcion && (
                  <p className="text-sm leading-relaxed text-slate-400">{activo.item.descripcion}</p>
                )}
                {activo.item.sede && SEDE_POR_ID[activo.item.sede] && (
                  <a
                    href="#sedes"
                    className="goya-cut inline-flex items-center gap-2 border border-goya-amber/35 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-goya-paper no-underline transition-colors hover:border-goya-amber hover:text-goya-amber"
                    style={{ ['--cut' as string]: '6px' }}
                  >
                    <MapPin size={12} />
                    {SEDE_POR_ID[activo.item.sede].nombreLargo ?? SEDE_POR_ID[activo.item.sede].nombre}
                  </a>
                )}
                <p className="font-mono text-[10px] uppercase tracking-label text-slate-600">
                  {activo.dia.etiqueta}
                </p>
              </div>
            </article>
          ) : (
            <div className="goya-panel p-6 text-sm text-slate-500">Selecciona un bloque del programa.</div>
          )}
        </Reveal>
      </div>

      {/* Criterios — debajo, compacto */}
      <Reveal as="div" delay={280} className="mt-14 border-t border-goya-amber/15 pt-12">
        <h3 className="font-display text-2xl uppercase tracking-wide text-goya-paper">Cómo se califica</h3>
        <p className="mt-2 text-sm text-slate-400">Cuatro ejes con el mismo peso en el Demo Day.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CRITERIOS.map((c, i) => (
            <div key={c.id} className="goya-panel px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] font-bold text-goya-amber">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-[11px] text-goya-amber">{PESO}%</span>
              </div>
              <p className="mt-2 font-display text-base uppercase tracking-wide text-goya-paper">{c.titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.descripcion}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Seccion>
  )
}

export default ProgramaAgenda
