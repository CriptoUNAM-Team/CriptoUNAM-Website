import React, { useEffect, useRef, useState } from 'react'
import { Gift, Glasses, Ticket } from 'lucide-react'
import {
  RIFA_REGLAS,
  STAND_PUBLICO,
  type StandBloque,
  type StandDiaId,
} from '../../../data/standPublico'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import { goyaStaggerChildren, goyaSwapIn } from '../../../lib/goyaAnime'

const iconoBloque = (tipo: StandBloque['tipo']) => {
  if (tipo === 'rifa') return Gift
  if (tipo === 'actividad') return Glasses
  return Ticket
}

const StandPublico: React.FC = () => {
  const [diaId, setDiaId] = useState<StandDiaId>('lun')
  const panelRef = useRef<HTMLDivElement>(null)
  const listaRef = useRef<HTMLDivElement>(null)
  const dia = STAND_PUBLICO.find((d) => d.id === diaId) ?? STAND_PUBLICO[0]

  useEffect(() => {
    goyaSwapIn(panelRef.current)
    const t = window.setTimeout(() => {
      goyaStaggerChildren(listaRef.current, '[data-goya-stand]', { step: 50, y: 14 })
    }, 40)
    return () => window.clearTimeout(t)
  }, [diaId])

  return (
    <Seccion
      id="stands"
      rotulo="Stand FI"
      titulo="Stand en la Facultad"
      intro="Horario del stand físico en la FI (lun–jue): VR, rifas Tangem e info Avalanche. No es la agenda del hackathon — esa está más abajo en Programa."
    >
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Día de stand">
        {STAND_PUBLICO.map((d) => {
          const activo = diaId === d.id
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => setDiaId(d.id)}
              className={`goya-cut px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-label transition-colors sm:px-4 sm:text-[11px] ${
                activo
                  ? 'bg-goya-amber text-goya-void'
                  : 'border border-goya-amber/25 text-slate-400 hover:border-goya-amber/50 hover:text-goya-paper'
              }`}
              style={{ ['--cut' as string]: '6px' }}
            >
              {d.label}
              <span className={`ml-1.5 ${activo ? 'text-goya-void/65' : 'text-slate-600'}`}>
                {d.fecha}
              </span>
            </button>
          )
        })}
      </div>

      <div ref={panelRef} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="goya-panel goya-panel-lit overflow-hidden p-5 sm:p-7">
          <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
            {dia.marca}
          </p>
          <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-goya-paper sm:text-3xl">
            {dia.tema}
          </h3>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-slate-400">{dia.resumen}</p>

          <div ref={listaRef} className="mt-7 space-y-3">
            {dia.bloques.map((b) => {
              const Icono = iconoBloque(b.tipo)
              return (
                <div
                  key={`${b.hora}-${b.titulo}`}
                  data-goya-stand
                  className={`flex gap-4 border border-white/5 bg-white/[0.02] p-3 sm:p-4 ${
                    b.tipo === 'rifa' ? 'border-goya-amber/35 bg-goya-amber/[0.06]' : ''
                  }`}
                >
                  <div className="w-16 shrink-0 font-mono text-[11px] font-bold uppercase tracking-label text-goya-amber sm:w-20">
                    {b.hora}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icono size={14} className="shrink-0 text-goya-amber/80" />
                      <p className="font-display text-base uppercase tracking-wide text-goya-paper">
                        {b.titulo}
                      </p>
                    </div>
                    {b.detalle && (
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{b.detalle}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Reveal as="aside" delay={120} className="goya-panel flex flex-col p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
            Rifas Tangem
          </p>
          <h4 className="mt-2 font-display text-xl uppercase tracking-wide text-goya-paper">
            Cada 3 horas
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Arranque {RIFA_REGLAS.inicio}. Rifas a las{' '}
            <strong className="text-goya-paper">{RIFA_REGLAS.horas.join(' y ')}</strong>.{' '}
            {RIFA_REGLAS.ganadores} ganadores de merch por rifa.
          </p>

          <ol className="relative mt-6 space-y-0 border-l border-goya-amber/30 pl-5">
            {[
              { h: RIFA_REGLAS.inicio, t: 'Apertura · activa wallet' },
              { h: RIFA_REGLAS.horas[0], t: 'Rifa 1 · 5 merch' },
              { h: RIFA_REGLAS.horas[1], t: 'Rifa 2 · 5 merch' },
            ].map((paso) => (
              <li key={paso.h} className="relative pb-6 last:pb-0">
                <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 bg-goya-amber" />
                <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                  {paso.h}
                </p>
                <p className="mt-1 text-sm text-goya-paper">{paso.t}</p>
              </li>
            ))}
          </ol>

          <p className="mt-auto border-t border-goya-amber/15 pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-label text-slate-500">
            {RIFA_REGLAS.requisito}
          </p>
          {!dia.rifas && (
            <p className="mt-3 text-xs text-slate-500">
              Este día el stand no concentra rifas Tangem — mira martes y miércoles.
            </p>
          )}
        </Reveal>
      </div>
    </Seccion>
  )
}

export default StandPublico
