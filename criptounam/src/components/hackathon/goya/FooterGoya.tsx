import React from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { GUIA_SOPORTE } from '../../../data/guiaHacker'
import { HACKATHON_INFO, FECHAS_CARTEL, SNIPPET_CARTEL } from '../../../data/hackathonInfo'
import PixelG from '../../goya/PixelG'
import { Barras } from '../../goya/adornos'

const ENLACES = [
  { to: '/hackathon#tracks', label: 'Tracks' },
  { to: '/hackathon#timeline', label: 'Programa' },
  { to: '/hackathon#premios', label: 'Premios' },
  { to: '/hackathon#sedes', label: 'Sede' },
  { to: '/hackathon#faq', label: 'FAQ' },
]

const PLATAFORMA = [
  { to: '/hackathon/dashboard', label: 'Mi panel' },
  { to: '/hackathon/equipos', label: 'Equipos' },
  { to: '/hackathon/proyectos', label: 'Proyectos' },
  { to: '/hackathon/dudas', label: 'Dudas' },
  { to: '/hackathon/guia', label: 'Guía del Hacker' },
]

const columna = (titulo: string, enlaces: { to: string; label: string }[]) => (
  <div>
    <h3 className="mb-5 font-mono text-[10px] uppercase tracking-label text-slate-500">{titulo}</h3>
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {enlaces.map((e) => (
        <li key={e.to}>
          <Link
            to={e.to}
            className="font-mono text-[11px] uppercase tracking-label text-slate-400 no-underline transition-colors duration-300 hover:text-goya-amber"
          >
            {e.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const FooterGoya: React.FC = () => (
  <footer className="border-t border-goya-amber/20">
    <div className="mx-auto w-full max-w-[1500px] px-5 py-14 sm:px-8 md:px-12">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="flex items-center gap-2.5">
            <PixelG className="w-5 text-goya-amber" />
            <span className="font-display text-lg uppercase tracking-wide text-goya-paper">
              {HACKATHON_INFO.brand}
            </span>
          </span>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {HACKATHON_INFO.horas} horas para construir con inteligencia
            artificial y Web3 en la Facultad de Ingeniería.
          </p>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-label text-goya-amber">
            {FECHAS_CARTEL.completo} · 2026
          </p>

          <Barras className="mt-6" />
        </div>

        {columna('Esta página', ENLACES)}
        {columna('Plataforma', PLATAFORMA)}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-goya-amber/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
          © 2026 CriptoUNAM · Facultad de Ingeniería, UNAM
        </span>

        <a
          href={GUIA_SOPORTE.telegram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-slate-400 no-underline transition-colors duration-300 hover:text-goya-amber"
        >
          <Send size={13} />
          Telegram de CriptoUNAM
        </a>

        <span className="hidden font-mono text-[10px] uppercase tracking-label text-slate-600 lg:inline">
          {SNIPPET_CARTEL}
        </span>
      </div>
    </div>
  </footer>
)

export default FooterGoya
