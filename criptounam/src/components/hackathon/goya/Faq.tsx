import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { HACKATHON_INFO, TOTAL_PREMIOS_PUMA, TOTAL_PREMIOS_USD } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const PREGUNTAS = [
  {
    q: '¿Qué tengo que hacer con Tangem? ¿Es obligatorio?',
    a: 'Sí, es obligatorio para todas las personas participantes, presenciales y en línea. Son tres pasos: descargar la app de Tangem desde el enlace o el QR de la sección Tangem de esta página, crear tu wallet, y activar la tarjeta en línea de TangemPay completando la verificación de identidad.',
  },
  {
    q: '¿Puedo descargar la app de Tangem desde la App Store o Google Play?',
    a: 'No. Tiene que ser desde el enlace de GOYA HACK, que es el que registra tu descarga como parte del hackathon. Si la instalas desde la tienda, el requisito no cuenta aunque tengas la app y la wallet funcionando. Si ya la tenías instalada de antes, desinstálala y vuelve a instalarla desde nuestro enlace.',
  },
  {
    q: '¿Puedo formar equipo antes del evento?',
    a: 'Sí. Puedes registrarte en equipo (de 1 a 5 personas) o solo: el martes, tras el kickoff, hay tiempo en el CIA (desde las 14:00) para formar equipos; también puedes unirte desde tu panel con un código de invitación.',
  },
  {
    q: '¿Necesito saber de blockchain?',
    a: `No. Hay talleres virtuales antes del kickoff y mentores durante las ${HACKATHON_INFO.horas} horas. Diseñadores y perfiles de producto también son bienvenidos.`,
  },
  {
    q: '¿Sobre qué tecnologías se construye?',
    a: 'Blockchain trae tres retos: Stellar (BAF), Avalanche y Pollar. AI lo patrocina CriptoUNAM (bolsa $PUMA). Contenido lo patrocina Tangem. La Guía del Hacker enlaza documentación y recursos.',
  },
  {
    q: '¿Cuáles son los premios exactamente?',
    a: `Bolsa estrella: ${TOTAL_PREMIOS_PUMA.toLocaleString('es-MX')} $PUMA en AI (CriptoUNAM) — 1.º 50M · 2.º 25M · 3.º 10M. En USD ($${TOTAL_PREMIOS_USD.toLocaleString('en-US')}): Stellar 1.º $150 · 2.º $100 · 3.º $80; Avalanche 1.º $50 · 2.º $25 · 3.º $10; Pollar 1.º $125 · 2.º $75 (mejor integración); Contenido (Tangem) 1.º $50 · 2.º $25 · 3.º $10. Aparte: 3 certificaciones MoureDev Pro (Axolotech), aceleradora Instaward para ganadores Stellar, y certificado on-chain + drop de $PUMA por BUIDL válido.`,
  },
  {
    q: '¿Cuesta algo participar?',
    a: 'No. El registro es gratuito.',
  },
  {
    q: '¿Se puede participar a distancia?',
    a: 'Sí: GOYA HACK es híbrido. Puedes construir en el CIA o desde donde estés, con el mismo registro y los mismos premios. Talleres, mentorías, main stages y la clausura se transmiten en vivo, y el proyecto se entrega desde el panel del hacker. Lo único exclusivo de la Facultad son los stands.',
  },
  {
    q: '¿En qué cambia participar en línea?',
    a: 'En nada para competir: mismos tracks (puedes elegir uno o más), mismo deadline (domingo 27 · 23:59, hora CDMX) y mismos criterios. Las mentorías en remoto se agendan por el canal de la comunidad, y en el programa cada bloque lleva su etiqueta — presencial, en línea o híbrido — para que sepas de antemano a qué puedes entrar.',
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
