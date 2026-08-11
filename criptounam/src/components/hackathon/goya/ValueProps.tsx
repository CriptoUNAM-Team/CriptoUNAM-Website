import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Reveal from '../../Reveal'

const CAPACIDADES = [
  {
    n: '01',
    titulo: 'Jurado en vivo',
    cuerpo:
      'Presentas ante el jurado en persona, no en un video grabado. Preguntas y respuestas en el momento.',
  },
  {
    n: '02',
    titulo: 'Mentorías durante las 72 horas',
    cuerpo:
      'Acompañamiento técnico de la comunidad CriptoUNAM y de la Facultad mientras construyes, no solo al final.',
  },
  {
    n: '03',
    titulo: 'Premios y reconocimiento on-chain',
    cuerpo:
      'Bolsa por track, POAP conmemorativo y $PUMA en Avalanche para todo el que entregue un BUIDL válido.',
  },
]

const ValueProps: React.FC = () => (
  <section className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16">
    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <Reveal as="div" delay={120} className="badge-accent w-fit">
        <span className="font-mono text-[11px] uppercase tracking-label text-accent">
          Mentorías · Premios · Comunidad
        </span>
      </Reveal>

      <Reveal
        as="p"
        delay={220}
        className="max-w-sm text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl"
      >
        No necesitas experiencia previa en blockchain. Hay talleres antes del
        kickoff y mentores durante todo el evento.
      </Reveal>
    </div>

    <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
      <div className="max-w-xl">
        <Reveal
          as="h2"
          delay={180}
          className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
        >
          Construye en público.
          <br />
          Gana en equipo.
        </Reveal>

        <Reveal
          as="p"
          delay={320}
          className="mt-6 max-w-md text-sm text-white/80 drop-shadow-md sm:text-base"
        >
          72 horas de trabajo real en la Facultad de Ingeniería, con entrega y
          evaluación aquí mismo. Llegas con una idea y sales con algo que
          funciona y que puedes enseñar.
        </Reveal>

        <Reveal as="div" delay={420} className="mt-8 flex flex-wrap gap-3">
          <Link to="/hackathon/dashboard" className="btn-accent flex items-center gap-1 no-underline">
            Registra a tu equipo
            <ChevronRight size={14} />
          </Link>
          <Link to="/hackathon/guia" className="btn-ghost no-underline">
            Guía del Hacker
          </Link>
        </Reveal>
      </div>

      {/* Panel de capacidades */}
      <div className="w-full max-w-md rounded-2xl border border-accent-border bg-white/10 px-5 backdrop-blur-md sm:px-6">
        {CAPACIDADES.map((c, i) => (
          <Reveal
            key={c.n}
            as="div"
            delay={300 + i * 110}
            className={`group flex gap-5 py-5 ${
              i < CAPACIDADES.length - 1 ? 'border-b border-accent/20' : ''
            }`}
          >
            <span className="font-mono text-[11px] tracking-label text-accent">{c.n}</span>
            <div>
              <h3 className="flex items-center gap-1 text-base font-medium text-white sm:text-lg">
                {c.titulo}
                <ChevronRight
                  size={16}
                  className="text-accent/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{c.cuerpo}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)

export default ValueProps
