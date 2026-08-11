import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ChevronRight } from 'lucide-react'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import { useCountdown } from '../../../hooks/useCountdown'

const ENLACES = [
  { href: '#tracks', label: 'Tracks' },
  { href: '#timeline', label: 'Programa' },
  { href: '#premios', label: 'Premios' },
  { href: '#faq', label: 'FAQ' },
]

/** Barra fija de la landing: marca, anclas de sección, cuenta atrás y registro. */
const Nav: React.FC = () => {
  const { dias, terminado } = useCountdown(HACKATHON_INFO.startsAt)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-black/30 backdrop-blur-md">
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 md:px-12">
        <Link to="/hackathon" className="flex shrink-0 items-center gap-2 no-underline">
          <Zap size={24} strokeWidth={1.5} className="shrink-0 text-accent" />
          <span className="whitespace-nowrap text-lg font-medium tracking-tight text-white sm:text-xl">
            hackathon unam
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="text-sm text-white/85 no-underline transition-colors duration-300 hover:text-accent"
            >
              {e.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {/* Solo desde lg: por debajo compite por espacio con los enlaces. */}
          <span className="hidden items-center rounded-full border border-accent-border bg-accent-soft px-3 py-1.5 backdrop-blur-md lg:flex">
            <span className="label-mono whitespace-nowrap text-accent">
              {terminado ? 'En marcha' : `Faltan ${dias} días`}
            </span>
          </span>

          <Link
            to="/hackathon/dashboard"
            className="flex items-center gap-1 rounded-md bg-accent px-4 py-2 text-xs font-medium text-black no-underline transition-colors duration-300 hover:bg-accent/85 sm:px-5 sm:text-sm"
          >
            Regístrate
            <ChevronRight size={16} className="text-black" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Nav
