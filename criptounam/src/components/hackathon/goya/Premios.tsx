import React from 'react'
import { Trophy, Medal, Gift } from 'lucide-react'
import { PREMIOS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'

const ICONO = { General: Trophy, Track: Medal, Especial: Gift } as const

const Premios: React.FC = () => {
  // Los premios por track ya se muestran en su tarjeta; aquí van el resto.
  const visibles = PREMIOS.filter((p) => p.categoria !== 'Track')

  return (
    <section
      id="premios"
      className="flex min-h-screen flex-col justify-center px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Reveal as="div" delay={120} className="badge-accent w-fit">
          <span className="font-mono text-[11px] uppercase tracking-label text-accent">
            Premios
          </span>
        </Reveal>

        <Reveal
          as="p"
          delay={220}
          className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl"
        >
          Las bolsas se confirman conforme se cierran los patrocinios. El POAP y
          el $PUMA están asegurados desde ya.
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibles.map((p, i) => {
          const Icono = ICONO[p.categoria as keyof typeof ICONO] ?? Medal
          return (
            <Reveal
              key={p.id}
              as="article"
              delay={200 + i * 110}
              className={`flex h-full flex-col rounded-xl border bg-white/10 p-6 backdrop-blur-md ${
                p.destacado ? 'border-accent' : 'border-accent/20'
              }`}
            >
              <Icono size={28} className={p.destacado ? 'text-accent' : 'text-accent/70'} />
              <span className="label-mono mt-4 text-white/50">{p.categoria}</span>
              <h3 className="mt-1 text-lg font-medium text-white">{p.titulo}</h3>
              <p className="mt-2 text-xl font-semibold text-accent">{p.monto}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">
                {p.descripcion}
              </p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Premios
