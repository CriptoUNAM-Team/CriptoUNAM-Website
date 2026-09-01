import React from 'react'
import { Trophy, Medal, Gift } from 'lucide-react'
import { PREMIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const ICONO = { General: Trophy, Track: Medal, Especial: Gift } as const

const Premios: React.FC = () => {
  // Los premios por track ya se muestran en su tarjeta; aquí van el resto.
  const visibles = PREMIOS.filter((p) => p.categoria !== 'Track')

  return (
    <Seccion
      id="premios"
      rotulo="Premios"
      titulo="Lo que hay en juego"
      intro="Las bolsas se confirman conforme se cierran los patrocinios. El POAP y el $PUMA están asegurados desde ya."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibles.map((p, i) => {
          const Icono = ICONO[p.categoria as keyof typeof ICONO] ?? Medal
          return (
            <Reveal
              key={p.id}
              as="article"
              delay={180 + i * 110}
              className={`goya-panel goya-panel-hover h-full ${p.destacado ? 'goya-panel-lit' : ''}`}
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <Icono
                    size={26}
                    strokeWidth={1.4}
                    className={p.destacado ? 'text-goya-amber' : 'text-goya-amber/60'}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
                    {p.categoria}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                  {p.titulo}
                </h3>
                <p className="mt-2 font-mono text-sm font-bold uppercase tracking-label text-goya-amber">
                  {p.monto}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.descripcion}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Seccion>
  )
}

export default Premios
