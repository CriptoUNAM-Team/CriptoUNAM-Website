import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const PREGUNTAS = [
  {
    q: '¿Puedo formar equipo antes del evento?',
    a: 'Sí. Puedes registrarte en equipo (de 1 a 5 personas) o solo: en el kickoff hay una dinámica para formar equipos, y desde tu panel puedes unirte a uno con su código de invitación.',
  },
  {
    q: '¿Necesito saber de blockchain?',
    a: `No. Hay talleres virtuales antes del kickoff y mentores durante las ${HACKATHON_INFO.horas} horas. Diseñadores y perfiles de producto también son bienvenidos.`,
  },
  {
    q: '¿Sobre qué tecnologías se construye?',
    a: 'Blockchain trae tres retos: Stellar (BAF), Avalanche y Pollar. AI tiene el reto Tangem. Innovación es track abierto — cualquier stack. La Guía del Hacker enlaza documentación y recursos.',
  },
  {
    q: '¿Cuáles son los premios exactamente?',
    a: 'AI y Blockchain: 1.º $100 · 2.º $50 · 3.º $25 USD por track. Innovación: 1.º $50 + 10M $PUMA · 2.º $25 + 5M $PUMA · 3.º 2.5M $PUMA. Además: POAP y drop de $PUMA para quien entregue un BUIDL válido.',
  },
  {
    q: '¿Cuesta algo participar?',
    a: 'No. El registro es gratuito.',
  },
  {
    q: '¿Se puede participar a distancia?',
    a: 'El hackathon es presencial en la Facultad de Ingeniería, y las charlas se transmiten para quienes siguen el evento en híbrido. La entrega del proyecto se hace desde el sitio.',
  },
]

const Faq: React.FC = () => {
  const [abierta, setAbierta] = useState<number | null>(null)

  return (
    <Seccion
      id="faq"
      rotulo="Dudas"
      titulo="Preguntas frecuentes"
      intro="Si lo tuyo no está aquí, pregúntalo en el tablón de dudas y te responde la organización."
    >
      <div className="mx-auto max-w-3xl">
        {PREGUNTAS.map((p, i) => {
          const abierto = abierta === i
          const Icono = abierto ? Minus : Plus
          return (
            <Reveal key={p.q} as="div" delay={140 + i * 70} className="border-b border-goya-amber/15">
              <button
                type="button"
                aria-expanded={abierto}
                onClick={() => setAbierta(abierto ? null : i)}
                className="flex w-full items-center justify-between gap-6 bg-transparent py-5 text-left transition-colors duration-300 hover:text-goya-amber"
              >
                <span className="flex min-w-0 items-baseline gap-4">
                  <span className="shrink-0 font-mono text-[10px] font-bold tracking-label text-goya-amber">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-display text-base uppercase tracking-wide transition-colors duration-300 sm:text-lg ${
                      abierto ? 'text-goya-amber' : 'text-goya-paper'
                    }`}
                  >
                    {p.q}
                  </span>
                </span>
                <Icono size={16} className="shrink-0 text-goya-amber" />
              </button>

              {abierto && (
                <p className="pb-6 pl-9 pr-6 text-sm leading-relaxed text-slate-400">{p.a}</p>
              )}
            </Reveal>
          )
        })}
      </div>
    </Seccion>
  )
}

export default Faq
