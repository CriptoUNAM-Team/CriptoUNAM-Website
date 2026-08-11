import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ChevronRight } from 'lucide-react'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'

/** Lo que el hackathon ofrece, en tres golpes. */
const CLAIMS = [
  '/ CONSTRUYE CON IA Y BLOCKCHAIN',
  '/ 72 HORAS EN CIUDAD UNIVERSITARIA',
  '/ MENTORÍAS, POAP Y $PUMA',
]

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })

const Hero: React.FC = () => (
  <section className="flex min-h-screen flex-col justify-between px-5 pb-12 pt-24 supports-[height:100svh]:min-h-[100svh] sm:px-8 sm:pt-28 md:px-12 md:pb-16">
    {/* Fila superior */}
    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-3">
        {CLAIMS.map((c, i) => (
          <Reveal
            key={c}
            as="span"
            delay={150 + i * 120}
            className="font-mono text-xs uppercase tracking-label text-accent drop-shadow-md"
          >
            {c}
          </Reveal>
        ))}
      </div>

      <Reveal
        as="p"
        delay={300}
        className="max-w-xs text-lg leading-relaxed text-white drop-shadow-md sm:text-right sm:text-xl"
      >
        Tres días intensivos donde estudiantes de la UNAM y de otras
        universidades construyen, en equipo, un proyecto de inteligencia
        artificial o Web3 que funcione.
      </Reveal>
    </div>

    {/* Fila inferior */}
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal as="div" delay={150} className="badge-accent mb-5 w-fit">
          <span className="font-mono text-[11px] uppercase tracking-label text-accent">
            {fecha(HACKATHON_INFO.startsAt)} – {fecha(HACKATHON_INFO.endsAt)} 2026 · UNAM
          </span>
        </Reveal>

        <Reveal
          as="h1"
          delay={280}
          className="text-5xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
        >
          Construye.
          <br />
          Entrega. Gana.
        </Reveal>
      </div>

      {/* Tarjeta de registro */}
      <Reveal
        as="div"
        delay={420}
        className="flex w-fit items-center gap-4 rounded-xl border border-accent-border bg-accent-soft p-3 backdrop-blur-md"
      >
        <Zap size={32} className="shrink-0 text-accent" />
        <div className="flex flex-col gap-1.5 pr-2">
          <span className="text-sm font-medium text-white">Inscripción abierta</span>
          <span className="label-mono text-white/60">
            {HACKATHON_INFO.event} · Facultad de Ingeniería
          </span>
          <span className="label-mono text-accent">Gratis · equipos de 1 a 5</span>
          <Link
            to="/hackathon/dashboard"
            className="mt-2 flex items-center justify-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-medium text-black no-underline transition-colors duration-300 hover:bg-accent/85"
          >
            Regístrate
            <ChevronRight size={14} />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
)

export default Hero
