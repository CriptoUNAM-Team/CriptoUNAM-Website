import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarRange, Clock, Globe, MapPin, Radio, Sparkles, Users, Video } from 'lucide-react'
import {
  AGENDA,
  AGENDA_MODALIDAD_CORTA,
  AGENDA_MODALIDAD_LABEL,
  AGENDA_TIPO_LABEL,
  CRITERIOS,
  HACKATHON_INFO,
  SEDE_POR_ID,
  TRANSMISION,
  agendaADate,
  agendaEsRemoto,
  agendaFinDate,
  agendaModalidad,
  enlaceRemoto,
  type AgendaDia,
  type AgendaItem,
  type AgendaModalidad,
  type AgendaTipo,
} from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import AgregarCalendario from './AgregarCalendario'
import { goyaPulse, goyaStaggerFilas, goyaSwapIn } from '../../../lib/goyaAnime'
import type { EventoCalendario } from '../../../lib/calendario'

type Filtro = 'todo' | AgendaTipo
/** `todo` no filtra; `presencial` y `online` incluyen además los bloques híbridos. */
type FiltroModo = 'todo' | 'presencial' | 'online'

type Slot = {
  key: string
  dia: AgendaDia
  item: AgendaItem
  indice: number
  inicio: Date
  fin: Date
}

const SITIO = 'https://criptounam.xyz/hackathon'

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

const MODOS: { id: FiltroModo; label: string; icono: React.ReactNode }[] = [
  { id: 'todo', label: 'Todo', icono: <Sparkles size={11} /> },
  { id: 'presencial', label: 'Presencial', icono: <MapPin size={11} /> },
  { id: 'online', label: 'En línea', icono: <Globe size={11} /> },
]

const ICONO_MODALIDAD: Record<AgendaModalidad, React.ReactNode> = {
  presencial: <MapPin size={10} />,
  online: <Globe size={10} />,
  hibrido: <Radio size={10} />,
}

const CLASE_MODALIDAD: Record<AgendaModalidad, string> = {
  presencial: 'border border-slate-600 text-slate-400',
  online: 'border border-cyan-400/50 text-cyan-300',
  hibrido: 'border border-goya-amber/50 text-goya-amber',
}

const ICONO_CANAL: Record<string, React.ReactNode> = {
  directo: <Video size={14} />,
  comunidad: <Users size={14} />,
  entrega: <CalendarRange size={14} />,
}

const pasaFiltro = (item: AgendaItem, filtro: Filtro) => {
  if (filtro === 'todo') return true
  if (filtro === 'hito') return Boolean(item.hito) || item.tipo === 'hito'
  return item.tipo === filtro
}

/**
 * El modo es una pregunta de asistencia, no una etiqueta: quien va a estar en
 * la Facultad quiere ver también lo híbrido (puede entrar a la sala), y quien
 * participa desde casa también (lo puede seguir por el directo). Solo se
 * excluye lo que es exclusivo del otro lado.
 */
const pasaModo = (item: AgendaItem, modo: FiltroModo) => {
  if (modo === 'todo') return true
  const modalidad = agendaModalidad(item)
  if (modalidad === 'hibrido') return true
  return modalidad === modo
}

const imagenSlot = (item: AgendaItem) => {
  if (item.imagen) return item.imagen
  if (item.sede && SEDE_POR_ID[item.sede]) return SEDE_POR_ID[item.sede].imagen
  return '/images/hackathon/sedes/cia-1.jpg'
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

/** "2 h", "45 min", "1 h 30". Para el rótulo de duración de cada fila. */
const formatearDuracion = (slot: Slot) => {
  if (!slot.item.fin) return 'Puntual'
  const min = Math.round((slot.fin.getTime() - slot.inicio.getTime()) / 60_000)
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const resto = min % 60
  return resto ? `${h} h ${resto}` : `${h} h`
}

const diaHoyId = (now: Date) => {
  const ymd = now.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' })
  return AGENDA.find((d) => d.fecha === ymd)?.id
}

const horaAhora = (now: Date) =>
  now.toLocaleTimeString('es-MX', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

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

/** Traduce un bloque del programa a un evento de calendario. */
const eventoDe = (slot: Slot): EventoCalendario => {
  const modalidad = agendaModalidad(slot.item)
  const sede = slot.item.sede ? SEDE_POR_ID[slot.item.sede] : undefined
  const remoto = agendaEsRemoto(slot.item) ? enlaceRemoto(slot.item) : undefined

  const lugar =
    modalidad === 'online'
      ? 'En línea · Goya Hack'
      : [sede?.nombreLargo ?? sede?.nombre, HACKATHON_INFO.sedeFisica].filter(Boolean).join(' · ')

  const descripcion = [
    slot.item.descripcion,
    `Modalidad: ${AGENDA_MODALIDAD_LABEL[modalidad]}.`,
    modalidad === 'hibrido' && !remoto
      ? 'Se transmite en vivo; el enlace se publica en criptounam.xyz/hackathon.'
      : null,
    `${HACKATHON_INFO.brand} · ${HACKATHON_INFO.event} 2026`,
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    // Estable por día e índice: reimportar el .ics actualiza en vez de duplicar.
    uid: `${slot.dia.id}-${slot.indice}@goyahack.criptounam.xyz`,
    titulo: `${slot.item.titulo} · Goya Hack`,
    descripcion,
    lugar,
    url: remoto ?? `${SITIO}#timeline`,
    inicio: slot.inicio,
    fin: slot.fin,
  }
}

const ProgramaAgenda: React.FC = () => {
  const [now, setNow] = useState(() => new Date())
  const [diaId, setDiaId] = useState(() => diaHoyId(new Date()) ?? AGENDA[0]?.id ?? '')
  const [filtro, setFiltro] = useState<Filtro>('todo')
  const [modo, setModo] = useState<FiltroModo>('todo')
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [autoDia, setAutoDia] = useState(true)

  const lista = useRef<HTMLUListElement>(null)
  const detalle = useRef<HTMLDivElement>(null)
  const reloj = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const anim = goyaPulse(reloj.current)
    return () => {
      anim?.pause()
    }
  }, [])

  const todosSlots = useMemo(() => construirSlots(), [])

  const enCurso = useMemo(
    () => todosSlots.filter((s) => now >= s.inicio && now < s.fin),
    [todosSlots, now]
  )

  const siguiente = useMemo(() => todosSlots.find((s) => s.inicio > now) ?? null, [todosSlots, now])

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
      .filter((s) => pasaFiltro(s.item, filtro) && pasaModo(s.item, modo))
  }, [dia, filtro, modo])

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

  // La lista se rehace entera al cambiar de día o de filtro: se reanima.
  useEffect(() => {
    goyaStaggerFilas(lista.current)
  }, [diaId, filtro, modo])

  const activo = slots.find((s) => s.key === seleccion) ?? slots[0]

  useEffect(() => {
    goyaSwapIn(detalle.current)
  }, [activo?.key])

  /** ↑/↓ recorren la línea de tiempo sin salir del componente. */
  const navegarLista = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const actual = slots.findIndex((s) => s.key === seleccion)
      if (actual < 0) return
      const destino = e.key === 'ArrowDown' ? actual + 1 : actual - 1
      if (destino < 0 || destino >= slots.length) return
      e.preventDefault()
      setSeleccion(slots[destino].key)
      setAutoDia(false)
      lista.current
        ?.querySelector<HTMLButtonElement>(`[data-slot="${slots[destino].key}"]`)
        ?.focus()
    },
    [slots, seleccion]
  )

  const eventoInicio = todosSlots[0]?.inicio
  const eventoFin = todosSlots[todosSlots.length - 1]?.fin
  const antes = eventoInicio ? now < eventoInicio : false
  const despues = eventoFin ? now >= eventoFin : false

  const cronometro = (() => {
    if (antes && eventoInicio) {
      return {
        rotulo: 'Arranca en',
        titulo: 'Kickoff · GOYA HACK',
        sub: 'Martes 22 · 10:00–11:00 · Barros Sierra',
        ms: eventoInicio.getTime() - now.getTime(),
        chip: 'Cuenta atrás',
        slot: todosSlots[0] ?? null,
        avance: 0,
      }
    }
    if (enCurso.length > 0) {
      const principal =
        enCurso.find((s) => s.item.hito || s.item.tipo === 'taller' || s.item.tipo === 'mainstage') ??
        enCurso[0]
      const total = principal.fin.getTime() - principal.inicio.getTime()
      return {
        rotulo: 'Ahora',
        titulo: principal.item.titulo,
        sub: siguiente
          ? `Siguiente · ${siguiente.item.hora} ${siguiente.item.titulo}`
          : `${principal.item.hora}${principal.item.fin ? ` – ${principal.item.fin}` : ''}`,
        ms: principal.fin.getTime() - now.getTime(),
        chip: AGENDA_TIPO_LABEL[principal.item.tipo],
        slot: principal,
        avance: total > 0 ? ((now.getTime() - principal.inicio.getTime()) / total) * 100 : 0,
      }
    }
    if (siguiente) {
      return {
        rotulo: 'Siguiente',
        titulo: siguiente.item.titulo,
        sub: `${siguiente.dia.etiqueta} · ${siguiente.item.hora}`,
        ms: siguiente.inicio.getTime() - now.getTime(),
        chip: AGENDA_TIPO_LABEL[siguiente.item.tipo],
        slot: siguiente,
        avance: 0,
      }
    }
    return {
      rotulo: 'Cerrado',
      titulo: 'GOYA HACK terminó',
      sub: 'Gracias por buildear',
      ms: 0,
      chip: 'Fin',
      slot: null,
      avance: 100,
    }
  })()

  const hoyId = diaHoyId(now)
  const esHoy = dia?.id === hoyId
  /** Fila ante la que va el marcador de "ahora". -1 si no toca pintarlo. */
  const indiceAhora = useMemo(() => {
    if (!esHoy || slots.length === 0) return -1
    const i = slots.findIndex((s) => s.inicio > now)
    if (i === 0 && now < slots[0].inicio) return -1
    return i
  }, [esHoy, slots, now])

  const eventosFiltrados = useMemo(() => slots.map(eventoDe), [slots])
  const eventosTodo = useMemo(() => todosSlots.map(eventoDe), [todosSlots])

  const modalidadActivo = activo ? agendaModalidad(activo.item) : 'presencial'
  const enlaceActivo = activo && agendaEsRemoto(activo.item) ? enlaceRemoto(activo.item) : undefined

  return (
    <Seccion
      id="timeline"
      rotulo="Agenda hack"
      titulo="Agenda del hackathon"
      intro={`Kickoff martes 22 · 10:00–11:00 en Auditorio Javier Barros Sierra (Edificio Principal). Luego registro en CIA 11:00–14:00 y área de hack 14:00–17:00. Miércoles abre CIA a las 09:00. Talleres abiertos y stand FI están arriba. Deadline viernes 14:00 · clausura 18:00.`}
    >
      {/* Reloj en vivo */}
      <Reveal
        as="div"
        delay={80}
        className="goya-panel goya-panel-lit mb-6 overflow-hidden p-5 sm:p-6"
        variante="scale"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`goya-cut inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label ${
                  despues ? 'border border-slate-600 text-slate-400' : 'bg-goya-amber text-goya-void goya-amber-glow'
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
              {cronometro.slot && (
                <span
                  className={`goya-cut inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${
                    CLASE_MODALIDAD[agendaModalidad(cronometro.slot.item)]
                  }`}
                  style={{ ['--cut' as string]: '4px' }}
                >
                  {ICONO_MODALIDAD[agendaModalidad(cronometro.slot.item)]}
                  {AGENDA_MODALIDAD_LABEL[agendaModalidad(cronometro.slot.item)]}
                </span>
              )}
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
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <div className="text-left sm:text-right">
              <p className="font-mono text-[10px] uppercase tracking-label text-slate-500">
                {antes ? 'Para el kickoff' : enCurso.length ? 'Termina en' : siguiente ? 'Empieza en' : '—'}
              </p>
              <p
                ref={reloj}
                className="mt-1 font-mono text-3xl font-bold tracking-widest text-goya-amber tabular-nums sm:text-4xl"
              >
                {formatearRestante(cronometro.ms)}
              </p>
            </div>
            {cronometro.slot && !despues && (
              <AgregarCalendario
                eventos={[eventoDe(cronometro.slot)]}
                etiqueta={enCurso.length ? 'Guardar este bloque' : 'Recordármelo'}
                variante="boton"
                alineacion="derecha"
              />
            )}
          </div>
        </div>

        {/* Avance del bloque en curso */}
        {enCurso.length > 0 && (
          <div className="mt-5">
            <div className="h-[3px] w-full overflow-hidden bg-goya-amber/15">
              <div
                className="goya-progreso h-full bg-goya-amber goya-amber-glow"
                style={{ width: `${Math.min(100, Math.max(0, cronometro.avance))}%` }}
                role="progressbar"
                aria-valuenow={Math.round(cronometro.avance)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Avance de ${cronometro.titulo}`}
              />
            </div>
          </div>
        )}
      </Reveal>

      {/* Modalidad híbrida */}
      <Reveal as="div" delay={110} className="goya-panel mb-8 overflow-hidden p-5 sm:p-6" variante="scale">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="goya-cut inline-flex items-center gap-1.5 bg-goya-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label text-goya-void"
            style={{ ['--cut' as string]: '5px' }}
          >
            <Radio size={11} />
            Híbrido
          </span>
          <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-goya-paper sm:text-xl">
            Compite desde el CIA o desde donde estés
          </h3>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Talleres, mentorías, main stages y la clausura se transmiten en vivo, y la entrega del
          proyecto se hace en la plataforma. Los stands son lo único que solo existe en la Facultad.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {TRANSMISION.canales.map((canal) => (
            <div key={canal.id} className="goya-panel goya-panel-hover p-4" style={{ ['--cut' as string]: '10px' }}>
              <p className="flex items-center gap-2 font-display text-sm uppercase tracking-wide text-goya-amber">
                {ICONO_CANAL[canal.id] ?? <Globe size={14} />}
                {canal.nombre}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{canal.descripcion}</p>
              {canal.url ? (
                <a
                  href={canal.url}
                  target={canal.url.startsWith('http') ? '_blank' : undefined}
                  rel={canal.url.startsWith('http') ? 'noreferrer' : undefined}
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                >
                  {canal.cta ?? 'Abrir'}
                </a>
              ) : (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-label text-slate-600">
                  Enlace próximamente
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Días */}
      <Reveal as="div" delay={140} className="flex flex-wrap gap-2">
        {AGENDA.map((d, i) => {
          const on = d.id === dia?.id
          const eseEsHoy = d.id === hoyId
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
              {eseEsHoy && <span className="ml-1.5 text-[8px] opacity-70">· hoy</span>}
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

      {/* Modalidad + tipo + exportar */}
      <Reveal as="div" delay={170} className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div
          className="goya-cut inline-flex items-center border border-goya-amber/25 p-1"
          role="group"
          aria-label="Filtrar por modalidad"
          style={{ ['--cut' as string]: '6px' }}
        >
          {MODOS.map((m) => {
            const on = modo === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModo(m.id)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                  on ? 'bg-goya-amber text-goya-void' : 'bg-transparent text-slate-400 hover:text-goya-paper'
                }`}
              >
                {m.icono}
                {m.label}
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <AgregarCalendario
            eventos={eventosFiltrados}
            etiqueta={`Guardar día ${(AGENDA.findIndex((d) => d.id === dia?.id) ?? 0) + 1}`}
            variante="boton"
          />
          <AgregarCalendario
            eventos={eventosTodo}
            etiqueta="Programa completo"
            variante="boton"
          />
        </div>
      </Reveal>

      <Reveal as="div" delay={200} className="mt-3 flex flex-wrap gap-2">
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
                  : f.id === 'taller' || f.id === 'stand'
                    ? 'border border-sky-400/35 bg-sky-400/5 text-sky-200/90 hover:border-sky-400/55 hover:text-sky-100'
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
        <Reveal as="div" delay={230} className="goya-panel min-h-[320px] overflow-hidden p-1">
          {slots.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-slate-500">Nada en este filtro para el día seleccionado.</p>
              <button
                type="button"
                onClick={() => {
                  setFiltro('todo')
                  setModo('todo')
                }}
                className="mt-3 bg-transparent p-0 font-mono text-[10px] uppercase tracking-label text-goya-amber transition-colors hover:text-goya-paper"
              >
                Quitar filtros
              </button>
            </div>
          ) : (
            <ul
              ref={lista}
              onKeyDown={navegarLista}
              className="goya-rail m-0 list-none py-4 pl-4 pr-1 sm:pl-5"
            >
              {slots.map((slot, i) => {
                const on = slot.key === activo?.key
                const vivo = now >= slot.inicio && now < slot.fin
                const pasado = now >= slot.fin
                const modalidad = agendaModalidad(slot.item)
                const total = slot.fin.getTime() - slot.inicio.getTime()
                const avance = vivo && total > 0 ? ((now.getTime() - slot.inicio.getTime()) / total) * 100 : 0

                return (
                  <React.Fragment key={slot.key}>
                    {i === indiceAhora && (
                      <li className="relative -ml-4 flex items-center gap-2 py-2 pl-4 sm:-ml-5 sm:pl-5" aria-hidden="true">
                        <span className="goya-ahora absolute left-[-3px] h-1.5 w-1.5 rounded-full bg-goya-amber goya-amber-glow" />
                        <span className="h-px flex-1 bg-gradient-to-r from-goya-amber/60 to-transparent" />
                        <span className="goya-ahora font-mono text-[9px] uppercase tracking-label text-goya-amber">
                          Ahora · {horaAhora(now)}
                        </span>
                      </li>
                    )}

                    <li
                      data-goya-fila
                      className={`goya-fila relative -ml-4 flex items-stretch sm:-ml-5 ${pasado && !on ? 'opacity-55' : ''}`}
                    >
                      {/* Nodo del raíl */}
                      <span
                        aria-hidden="true"
                        className={`goya-nodo absolute left-[-3px] top-[1.45rem] h-[7px] w-[7px] rounded-full ${
                          vivo
                            ? 'bg-goya-amber goya-amber-glow'
                            : on
                              ? 'bg-goya-amber'
                              : pasado
                                ? 'bg-slate-700'
                                : 'bg-goya-amber/35'
                        }`}
                      />

                      <button
                        type="button"
                        data-slot={slot.key}
                        onClick={() => {
                          setSeleccion(slot.key)
                          setAutoDia(false)
                        }}
                        aria-pressed={on}
                        className={`flex min-w-0 flex-1 items-start gap-4 border-l-2 bg-transparent py-3.5 pl-4 pr-2 text-left transition-colors duration-200 sm:pl-5 ${
                          on
                            ? 'border-goya-amber bg-goya-amber/10'
                            : vivo
                              ? 'border-goya-amber/40 bg-goya-amber/[0.04]'
                              : 'border-transparent hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="w-14 shrink-0">
                          <span className="block font-mono text-[11px] font-bold tracking-label text-goya-amber">
                            {slot.item.hora}
                          </span>
                          <span className="mt-1 block font-mono text-[9px] uppercase tracking-label text-slate-600">
                            {formatearDuracion(slot)}
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="mb-2 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`goya-cut inline-block px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${TIPO_CLASE[slot.item.tipo]}`}
                              style={{ ['--cut' as string]: '4px' }}
                            >
                              {AGENDA_TIPO_LABEL[slot.item.tipo]}
                            </span>
                            <span
                              className={`goya-cut inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${CLASE_MODALIDAD[modalidad]}`}
                              style={{ ['--cut' as string]: '4px' }}
                              title={AGENDA_MODALIDAD_CORTA[modalidad]}
                            >
                              {ICONO_MODALIDAD[modalidad]}
                              {AGENDA_MODALIDAD_LABEL[modalidad]}
                            </span>
                            {vivo && (
                              <span className="font-mono text-[8px] font-bold uppercase tracking-label text-goya-amber">
                                En curso
                              </span>
                            )}
                          </span>

                          <span
                            className={`block font-display text-sm uppercase leading-snug tracking-wide transition-colors duration-200 sm:text-base ${
                              on || vivo ? 'text-goya-amber' : 'text-slate-300'
                            }`}
                          >
                            {slot.item.titulo}
                          </span>

                          {vivo && (
                            <span className="mt-2 block h-[2px] w-full overflow-hidden bg-goya-amber/15">
                              <span
                                className="goya-progreso block h-full bg-goya-amber"
                                style={{ width: `${Math.min(100, Math.max(0, avance))}%` }}
                              />
                            </span>
                          )}
                        </span>
                      </button>

                      {/* Fuera del botón: un <button> no puede anidar otro. */}
                      <span className={`flex shrink-0 items-center pl-1 pr-2 ${vivo ? 'goya-barrido' : ''}`}>
                        <AgregarCalendario
                          eventos={[eventoDe(slot)]}
                          etiqueta={`Añadir «${slot.item.titulo}» al calendario`}
                          variante="icono"
                        />
                      </span>
                    </li>
                  </React.Fragment>
                )
              })}
            </ul>
          )}
        </Reveal>

        <Reveal as="div" delay={260} className="lg:sticky lg:top-24 lg:self-start">
          {activo ? (
            <article
              ref={detalle}
              className="goya-panel goya-panel-lit overflow-hidden"
              style={{ ['--cut' as string]: '16px' }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-goya-void">
                <img
                  src={imagenSlot(activo.item)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[1200ms] ease-out hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(1,0,4,0.95) 0%, rgba(1,0,4,0.35) 45%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <span
                  className={`goya-cut absolute right-4 top-4 inline-flex items-center gap-1 bg-goya-void/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-label backdrop-blur-sm ${CLASE_MODALIDAD[modalidadActivo]}`}
                  style={{ ['--cut' as string]: '5px' }}
                >
                  {ICONO_MODALIDAD[modalidadActivo]}
                  {AGENDA_MODALIDAD_LABEL[modalidadActivo]}
                </span>
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

                <p className="text-sm leading-relaxed text-slate-500">
                  {modalidadActivo === 'presencial'
                    ? 'Solo en la Facultad: este bloque no se transmite.'
                    : modalidadActivo === 'online'
                      ? 'Desde la plataforma, estés donde estés.'
                      : 'En la sede y en vivo: puedes seguirlo en remoto.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  <AgregarCalendario
                    eventos={[eventoDe(activo)]}
                    etiqueta="Añadir al calendario"
                    variante="boton"
                    alineacion="izquierda"
                  />

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

                  {enlaceActivo && (
                    <a
                      href={enlaceActivo}
                      target={enlaceActivo.startsWith('http') ? '_blank' : undefined}
                      rel={enlaceActivo.startsWith('http') ? 'noreferrer' : undefined}
                      className="goya-cut inline-flex items-center gap-2 border border-goya-amber/35 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-goya-paper no-underline transition-colors hover:border-goya-amber hover:text-goya-amber"
                      style={{ ['--cut' as string]: '6px' }}
                    >
                      <Video size={12} />
                      Seguir en línea
                    </a>
                  )}
                </div>

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

      <Reveal as="div" delay={300} className="mt-14 border-t border-goya-amber/15 pt-12">
        <h3 className="font-display text-2xl uppercase tracking-wide text-goya-paper">Cómo se califica</h3>
        <p className="mt-2 text-sm text-slate-400">Cuatro ejes de evaluación en la clausura.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CRITERIOS.map((c, i) => (
            <div key={c.id} className="goya-panel goya-panel-hover px-5 py-4">
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
