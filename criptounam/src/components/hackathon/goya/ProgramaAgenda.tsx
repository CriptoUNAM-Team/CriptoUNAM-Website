import React, { useEffect, useMemo, useState } from 'react'
import { Clock, MapPin, Sparkles } from 'lucide-react'
import {
  AGENDA,
  AGENDA_TIPO_LABEL,
  CRITERIOS,
  HACKATHON_INFO,
  SEDE_POR_ID,
  agendaADate,
  agendaFinDate,
  type AgendaDia,
  type AgendaItem,
  type AgendaTipo,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

type Filtro = 'todo' | AgendaTipo

type Slot = {
  key: string
  dia: AgendaDia
  item: AgendaItem
  indice: number
  inicio: Date
  fin: Date
}

const TIPO_CLASE: Record<AgendaTipo, string> = {
  taller: 'bg-goya-amber text-goya-void',
  stand: 'border border-sky-400/50 text-sky-300',
  mentoria: 'border border-violet-400/50 text-violet-300',
  hack: 'border border-emerald-400/50 text-emerald-300',
  hito: 'bg-goya-amber text-goya-void',
  mainstage: 'border border-goya-amber text-goya-amber',
  registro: 'border border-slate-500 text-slate-300',
}

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todo', label: 'Todo' },
  { id: 'taller', label: 'Talleres' },
  { id: 'stand', label: 'Stands' },
  { id: 'mentoria', label: 'Mentorías' },
  { id: 'hack', label: 'Área hack' },
  { id: 'mainstage', label: 'Main stage' },
  { id: 'hito', label: 'Hitos' },
]

const pasaFiltro = (item: AgendaItem, filtro: Filtro) => {
  if (filtro === 'todo') return true
  if (filtro === 'hito') return Boolean(item.hito) || item.tipo === 'hito'
  return item.tipo === filtro
}

const imagenSlot = (item: AgendaItem) => {
  if (item.sede && SEDE_POR_ID[item.sede]) return SEDE_POR_ID[item.sede].imagen
  return '/images/CIA1.png'
}

const pad2 = (n: number) => String(n).padStart(2, '0')

const formatearRestante = (ms: number) => {
  if (ms <= 0) return '00:00:00'
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 48) {
    const d = Math.floor(h / 24)
    return `${d}d ${pad2(h % 24)}:${pad2(m)}:${pad2(s)}`
  }
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

const diaHoyId = (now: Date) => {
  const ymd = now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })
  return AGENDA.find((d) => d.fecha === ymd)?.id
}

const construirSlots = (): Slot[] =>
  AGENDA.flatMap((dia) =>
    dia.items.map((item, indice) => ({
      key: `${dia.id}-${indice}`,
      dia,
      item,
      indice,
      inicio: agendaADate(dia.fecha, item.hora),
      fin: agendaFinDate(dia, item),
    }))
  ).sort((a, b) => a.inicio.getTime() - b.inicio.getTime())

const ProgramaAgenda: React.FC = () => {
  const [now, setNow] = useState(() => new Date())
  const [diaId, setDiaId] = useState(() => diaHoyId(new Date()) ?? AGENDA[0]?.id ?? '')
  const [filtro, setFiltro] = useState<Filtro>('todo')
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [autoDia, setAutoDia] = useState(true)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const todosSlots = useMemo(() => construirSlots(), [])

  const enCurso = useMemo(
    () => todosSlots.filter((s) => now >= s.inicio && now < s.fin),
    [todosSlots, now]
  )

  const siguiente = useMemo(() => {
    const prox = todosSlots.find((s) => s.inicio > now)
    return prox ?? null
  }, [todosSlots, now])

  const focoVivo = enCurso[0] ?? siguiente

  useEffect(() => {
    if (!autoDia) return
    const hoy = diaHoyId(now)
    if (hoy) setDiaId(hoy)
  }, [now, autoDia])

  useEffect(() => {
    if (!focoVivo) return
    if (autoDia) setSeleccion(focoVivo.key)
  }, [focoVivo?.key, autoDia])

  const dia = AGENDA.find((d) => d.id === diaId) ?? AGENDA[0]

  const slots: Slot[] = useMemo(() => {
    if (!dia) return []
    return dia.items
      .map((item, indice) => ({
        key: `${dia.id}-${indice}`,
        dia,
        item,
        indice,
        inicio: agendaADate(dia.fecha, item.hora),
        fin: agendaFinDate(dia, item),
      }))
      .filter((s) => pasaFiltro(s.item, filtro))
  }, [dia, filtro])

  useEffect(() => {
    if (slots.length === 0) {
      setSeleccion(null)
      return
    }
    if (!seleccion || !slots.some((s) => s.key === seleccion)) {
      const vivo = slots.find((s) => now >= s.inicio && now < s.fin) ?? slots[0]
      setSeleccion(vivo.key)
    }
  }, [slots, seleccion, now])

  const activo = slots.find((s) => s.key === seleccion) ?? slots[0]

  const eventoInicio = todosSlots[0]?.inicio
  const eventoFin = todosSlots[todosSlots.length - 1]?.fin
  const antes = eventoInicio ? now < eventoInicio : false
  const despues = eventoFin ? now >= eventoFin : false

  const cronometro = (() => {
    if (antes && eventoInicio) {
      return {
        rotulo: 'Arranca en',
        titulo: 'Kickoff · GOYA HACK',
        sub: 'Martes 22 · 10:00',
        ms: eventoInicio.getTime() - now.getTime(),
        chip: 'Cuenta atrás',
      }
    }
    if (enCurso.length > 0) {
      const principal =
        enCurso.find((s) => s.item.hito || s.item.tipo === 'taller' || s.item.tipo === 'mainstage') ??
        enCurso[0]
      return {
        rotulo: 'Ahora',
        titulo: principal.item.titulo,
        sub: siguiente
          ? `Siguiente · ${siguiente.item.hora} ${siguiente.item.titulo}`
          : `${principal.item.hora}${principal.item.fin ? ` – ${principal.item.fin}` : ''}`,
        ms: principal.fin.getTime() - now.getTime(),
        chip: AGENDA_TIPO_LABEL[principal.item.tipo],
      }
    }
    if (siguiente) {
      return {
        rotulo: 'Siguiente',
        titulo: siguiente.item.titulo,
        sub: `${siguiente.dia.etiqueta} · ${siguiente.item.hora}`,
        ms: siguiente.inicio.getTime() - now.getTime(),
        chip: AGENDA_TIPO_LABEL[siguiente.item.tipo],
      }
    }
    return {
      rotulo: 'Cerrado',
      titulo: 'GOYA HACK terminó',
      sub: 'Gracias por buildear',
      ms: 0,
      chip: 'Fin',
    }
  })()

  return (
    <Seccion
      id="timeline"
      rotulo="Programa"
      titulo="Semana DIE × GOYA HACK"
      intro={`Lunes 21 → viernes 25 · talleres, stands, mentorías y ${HACKATHON_INFO.horas} h de BUIDL. Deadline viernes 14:00 · clausura 18:00.`}
    >
      {/* Reloj en vivo */}
      <Reveal as="div" delay={80} className="goya-panel goya-panel-lit mb-8 overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`goya-cut inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label ${
                  despues ? 'border border-slate-600 text-slate-400' : 'bg-goya-amber text-goya-void'
                }`}
                style={{ ['--cut' as string]: '5px' }}
              >
                <Clock size={11} />
                {cronometro.chip}
              </span>
              {!despues && !antes && (
                <span className="goya-blink inline-block h-1.5 w-1.5 bg-goya-amber" aria-hidden="true" />
              )}
              <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
                {cronometro.rotulo}
              </span>
            </div>
            <h3 className="mt-2 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
              {cronometro.titulo}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{cronometro.sub}</p>
            {enCurso.length > 1 && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-slate-500">
                +{enCurso.length - 1} en paralelo ahora
              </p>
            )}
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="font-mono text-[10px] uppercase tracking-label text-slate-500">
              {antes ? 'Para el kickoff' : enCurso.length ? 'Termina en' : siguiente ? 'Empieza en' : '—'}
            </p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-goya-amber tabular-nums sm:text-4xl">
              {formatearRestante(cronometro.ms)}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Días */}
      <Reveal as="div" delay={120} className="flex flex-wrap gap-2">
        {AGENDA.map((d, i) => {
          const on = d.id === dia?.id
          const esHoy = d.id === diaHoyId(now)
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDiaId(d.id)
                setAutoDia(false)
              }}
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
              {esHoy && <span className="ml-1.5 text-[8px] opacity-70">· hoy</span>}
            </button>
          )
        })}
        {!autoDia && (
          <button
            type="button"
            onClick={() => setAutoDia(true)}
            className="rounded-full border border-goya-amber/25 px-3 py-2 font-mono text-[9px] uppercase tracking-label text-slate-500 transition-colors hover:border-goya-amber/50 hover:text-goya-amber"
          >
            Seguir en vivo
          </button>
        )}
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
        <Reveal as="div" delay={200} className="goya-panel min-h-[320px] overflow-hidden p-1">
          {slots.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Nada en este filtro para el día seleccionado.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {slots.map((slot) => {
                const on = slot.key === activo?.key
                const vivo = now >= slot.inicio && now < slot.fin
                const tipoClase = TIPO_CLASE[slot.item.tipo]
                return (
                  <li key={slot.key}>
                    <button
                      type="button"
                      onClick={() => {
                        setSeleccion(slot.key)
                        setAutoDia(false)
                      }}
                      className={`flex w-full items-start gap-4 border-l-2 bg-transparent px-4 py-4 text-left transition-colors duration-200 ${
                        on
                          ? 'border-goya-amber bg-goya-amber/10'
                          : vivo
                            ? 'border-goya-amber/40 bg-goya-amber/[0.04]'
                            : 'border-transparent hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="w-14 shrink-0 font-mono text-[11px] font-bold tracking-label text-goya-amber">
                        {slot.item.hora}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="mb-2 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`goya-cut inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${tipoClase}`}
                            style={{ ['--cut' as string]: '4px' }}
                          >
                            {AGENDA_TIPO_LABEL[slot.item.tipo]}
                          </span>
                          {vivo && (
                            <span className="font-mono text-[8px] font-bold uppercase tracking-label text-goya-amber">
                              En curso
                            </span>
                          )}
                        </span>
                        <span
                          className={`block font-display text-sm uppercase leading-snug tracking-wide sm:text-base ${
                            on || vivo ? 'text-goya-amber' : 'text-slate-300'
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
                    {AGENDA_TIPO_LABEL[activo.item.tipo]} · {activo.item.hora}
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

      <Reveal as="div" delay={280} className="mt-14 border-t border-goya-amber/15 pt-12">
        <h3 className="font-display text-2xl uppercase tracking-wide text-goya-paper">Cómo se califica</h3>
        <p className="mt-2 text-sm text-slate-400">Cuatro ejes de evaluación en la clausura.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CRITERIOS.map((c, i) => (
            <div key={c.id} className="goya-panel px-5 py-4">
              <span className="font-mono text-[11px] font-bold text-goya-amber">
                {String(i + 1).padStart(2, '0')}
              </span>
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
