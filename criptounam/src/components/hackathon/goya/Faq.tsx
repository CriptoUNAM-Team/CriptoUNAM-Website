import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from '../../Reveal'

const PREGUNTAS = [
  {
    q: '¿Puedo formar equipo antes del evento?',
    a: 'Sí. Puedes registrarte en equipo (de 1 a 5 personas) o solo: en el kickoff hay una dinámica para formar equipos, y desde tu panel puedes unirte a uno con su código de invitación.',
  },
  {
    q: '¿Necesito saber de blockchain?',
    a: 'No. Hay talleres virtuales antes del kickoff y mentores durante las 72 horas. Diseñadores y perfiles de producto también son bienvenidos.',
  },
  {
    q: '¿Sobre qué tecnologías se construye?',
    a: 'Los retos de blockchain se despliegan en Avalanche (Fuji para desarrollar). Para el track de IA puedes usar el proveedor de modelos que prefieras. La Guía del Hacker detalla el stack recomendado.',
  },
  {
    q: '¿Cuáles son los premios exactamente?',
    a: 'Hay bolsa por track más los premios generales, y están por confirmarse con los patrocinadores. Lo que sí está asegurado: quien entregue un BUIDL válido recibe el POAP conmemorativo y $PUMA en Avalanche.',
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
    <section id="faq" className="px-5 pb-12 pt-24 sm:px-8 sm:pt-28 md:px-12 md:pb-16">
      <Reveal
        as="h2"
        delay={120}
        className="mb-8 text-3xl font-normal tracking-tight text-white drop-shadow-lg sm:text-4xl"
      >
        Preguntas frecuentes
      </Reveal>

      <div className="mx-auto max-w-2xl space-y-3">
        {PREGUNTAS.map((p, i) => {
          const abierto = abierta === i
          return (
            <Reveal key={p.q} as="div" delay={150 + i * 80}>
              <button
                type="button"
                aria-expanded={abierto}
                onClick={() => setAbierta(abierto ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-accent/20 bg-white/10 p-4 text-left backdrop-blur-md transition-colors hover:bg-white/15"
              >
                <span className="text-base font-medium text-white">{p.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-accent transition-transform duration-300 ${
                    abierto ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {abierto && (
                <div className="rounded-b-lg border-x border-b border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-white/75">
                  {p.a}
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Faq
