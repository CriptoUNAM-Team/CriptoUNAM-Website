import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Send } from 'lucide-react'
import { GUIA_SOPORTE } from '../../../data/guiaHacker'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'

const ENLACES = [
  { to: '/hackathon#tracks', label: 'Tracks' },
  { to: '/hackathon#timeline', label: 'Programa' },
  { to: '/hackathon#premios', label: 'Premios' },
  { to: '/hackathon#faq', label: 'FAQ' },
]

const PLATAFORMA = [
  { to: '/hackathon/dashboard', label: 'Mi panel' },
  { to: '/hackathon/equipos', label: 'Equipos' },
  { to: '/hackathon/proyectos', label: 'Proyectos' },
  { to: '/hackathon/guia', label: 'Guía del Hacker' },
]

const FooterGoya: React.FC = () => (
  <footer className="border-t border-white/10 bg-white/5 px-5 py-12 backdrop-blur-sm sm:px-8 md:px-12">
    <div className="grid gap-8 md:grid-cols-3">
      <div>
        <span className="flex items-center gap-2">
          <Zap size={20} className="text-accent" />
          <span className="text-lg font-medium text-white">{HACKATHON_INFO.brand}</span>
        </span>
        <p className="mt-2 max-w-xs text-sm text-white/60">
          72 horas para construir con IA y Web3 en la Facultad de Ingeniería.
        </p>
      </div>

      <div>
        <h3 className="label-mono mb-3 text-white/50">Esta página</h3>
        <ul className="space-y-2 p-0">
          {ENLACES.map((e) => (
            <li key={e.to} className="list-none">
              <Link
                to={e.to}
                className="text-sm text-white/75 no-underline transition-colors duration-300 hover:text-accent"
              >
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="label-mono mb-3 text-white/50">Plataforma</h3>
        <ul className="space-y-2 p-0">
          {PLATAFORMA.map((e) => (
            <li key={e.to} className="list-none">
              <Link
                to={e.to}
                className="text-sm text-white/75 no-underline transition-colors duration-300 hover:text-accent"
              >
                {e.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={GUIA_SOPORTE.telegram}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 no-underline transition-colors duration-300 hover:text-accent"
        >
          <Send size={16} />
          Telegram de CriptoUNAM
        </a>
      </div>
    </div>

    <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-white/50">
        © 2026 CriptoUNAM · Facultad de Ingeniería, UNAM.
      </span>
      <span className="text-xs text-accent/60">Hecho en Ciudad Universitaria.</span>
    </div>
  </footer>
)

export default FooterGoya
