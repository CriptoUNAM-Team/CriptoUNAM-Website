import React from 'react'
import { Link } from 'react-router-dom'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import { useCountdown } from '../../../hooks/useCountdown'
import PixelG from '../../goya/PixelG'

const ENLACES = [
  { href: '#tracks', label: 'Tracks' },
  { href: '#timeline', label: 'Programa' },
  { href: '#premios', label: 'Premios' },
  { href: '#sedes', label: 'Sede' },
  { href: '#faq', label: 'FAQ' },
]

/** Barra fija de la landing: marca, anclas de sección, cuenta atrás y registro. */
const Nav: React.FC = () => {
  const { dias, terminado } = useCountdown(HACKATHON_INFO.startsAt)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-goya-amber/20 bg-goya-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3 sm:px-8 md:px-12">
        <Link to="/hackathon" className="flex shrink-0 items-center gap-2.5 no-underline">
          <PixelG className="w-5 shrink-0 text-goya-amber" />
          <span className="whitespace-nowrap font-display text-lg uppercase tracking-wide text-goya-paper sm:text-xl">
            Goya Hack
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-9">
          {ENLACES.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="font-mono text-[11px] uppercase tracking-label text-slate-400 no-underline transition-colors duration-300 hover:text-goya-amber"
            >
              {e.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {/* Solo desde lg: por debajo compite por espacio con los enlaces. */}
          <span className="hidden items-center gap-2 lg:flex">
            <span className="goya-blink inline-block h-1.5 w-1.5 bg-goya-amber" aria-hidden="true" />
            <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-label text-slate-400">
              {terminado ? 'En marcha' : `T-${dias} días`}
            </span>
          </span>

          <Link
            to="/hackathon/dashboard"
            className="goya-cut bg-goya-amber px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper sm:px-5"
            style={{ ['--cut' as string]: '8px' }}
          >
            Regístrate
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Nav
