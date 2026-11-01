import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarCheck, Gamepad2, Target, Ticket, Trophy } from 'lucide-react'
import Reveal from './Reveal'
import PixelSprite from './goya/PixelSprite'
import { BITMAP_MONEDA } from './goya/bitmaps'
import { Rotulo } from './goya/adornos'

const COMO_SE_GANA = [
  {
    icono: Target,
    titulo: 'Misiones',
    texto: 'Retos de la comunidad: asistir, aprender, entregar código. Cada misión cumplida suma.',
  },
  {
    icono: CalendarCheck,
    titulo: 'Sesiones de embajadores',
    texto: 'Pase de lista en las sesiones de embajadores, reclamado desde Recompensas.',
  },
  {
    icono: Trophy,
    titulo: 'Hackathones',
    texto: 'El track de IA de Goya Hack repartió 85 millones de $PUMA entre su podio.',
  },
  {
    icono: Gamepad2,
    titulo: 'Arcade',
    texto: 'Cyber Puma Runner: supera récords y desbloquea hasta 210 $PUMA.',
  },
]

const EN_QUE_SE_USA = [
  { icono: BookOpen, texto: 'Cursos premium de la comunidad' },
  { icono: Ticket, texto: 'Acceso a eventos de la comunidad' },
]

/** Monedas pixel que orbitan la moneda grande. Posiciones fijas, sin azar. */
const ORBITA = [
  { top: '6%', left: '12%', tam: 'h-5', retraso: '0s' },
  { top: '18%', left: '84%', tam: 'h-4', retraso: '-1.2s' },
  { top: '72%', left: '6%', tam: 'h-4', retraso: '-2.1s' },
  { top: '82%', left: '78%', tam: 'h-6', retraso: '-0.6s' },
  { top: '44%', left: '94%', tam: 'h-3', retraso: '-1.7s' },
]

/**
 * El token de la comunidad, con más presencia que el panel de antes: la
 * moneda grande flotando entre monedas pixel, cómo se gana y en qué se usa.
 */
const PumaToken: React.FC = () => (
  <section id="puma" className="goya-anchor mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 md:py-28">
    <div className="goya-panel goya-panel-lit overflow-hidden" style={{ ['--cut' as string]: '28px' }}>
      <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        {/* Moneda */}
        <Reveal as="div" delay={120} className="relative mx-auto aspect-square w-full max-w-[380px]">
          <div
            className="absolute inset-[12%] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(233,175,60,0.28) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <img
            src="/images/puma-token-v2.png"
            alt="Moneda $PUMA"
            loading="lazy"
            className="cripto-moneda-grande relative h-full w-full object-contain p-[14%]"
          />
          {ORBITA.map((o, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="cripto-moneda-orbita absolute text-goya-void"
              style={{ top: o.top, left: o.left, animationDelay: o.retraso }}
            >
              <PixelSprite bitmap={BITMAP_MONEDA} separacion={0.6} className={`${o.tam} w-auto`} />
            </span>
          ))}
        </Reveal>

        {/* Texto */}
        <div className="min-w-0">
          <Reveal as="div" delay={100}>
            <Rotulo>Token de la comunidad · Avalanche</Rotulo>
          </Reveal>
          <Reveal as="h2" delay={160} className="mt-4 font-display text-5xl uppercase leading-none tracking-wide text-goya-paper sm:text-6xl">
            $PUMA
          </Reveal>
          <Reveal as="p" delay={220} className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
            La recompensa de CriptoUNAM. Se gana participando en la comunidad y se queda en tu wallet
            como prueba de lo que has construido con nosotros.
          </Reveal>

          <div className="mt-8 grid gap-px overflow-hidden border border-goya-amber/15 bg-goya-amber/15 sm:grid-cols-2">
            {COMO_SE_GANA.map((c, i) => (
              <Reveal key={c.titulo} as="div" delay={260 + i * 80} className="bg-[#07060c] p-5">
                <c.icono size={18} strokeWidth={1.6} className="text-goya-amber" />
                <h3 className="mt-3 font-display text-base uppercase tracking-wide text-goya-paper">{c.titulo}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{c.texto}</p>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" delay={560} className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-label text-slate-500">En qué se usa</p>
            <ul className="mt-3 flex flex-col gap-2">
              {EN_QUE_SE_USA.map((u) => (
                <li key={u.texto} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <u.icono size={15} className="shrink-0 text-goya-amber" />
                  {u.texto}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" delay={620} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/recompensas"
              className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
              style={{ ['--cut' as string]: '9px' }}
            >
              Gana $PUMA
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/juegos"
              className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
              style={{ ['--cut' as string]: '9px' }}
            >
              Jugar el arcade
            </Link>
          </Reveal>
        </div>
      </div>
    </div>

    <style>{`
      .cripto-moneda-grande { animation: criptoMonedaFlota 5s ease-in-out infinite; }
      .cripto-moneda-orbita { animation: criptoMonedaOrbita 3.2s ease-in-out infinite; }
      @keyframes criptoMonedaFlota {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }
      @keyframes criptoMonedaOrbita {
        0%, 100% { transform: translateY(0); opacity: 0.95; }
        50% { transform: translateY(-8px); opacity: 0.6; }
      }
      html[data-pagina-oculta='1'] .cripto-moneda-grande,
      html[data-pagina-oculta='1'] .cripto-moneda-orbita { animation-play-state: paused; }
      @media (prefers-reduced-motion: reduce) {
        .cripto-moneda-grande, .cripto-moneda-orbita { animation: none; }
      }
    `}</style>
  </section>
)

export default PumaToken
