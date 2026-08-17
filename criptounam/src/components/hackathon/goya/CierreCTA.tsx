import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HACKATHON_INFO, FECHAS_CARTEL } from '../../../data/hackathonInfo'
import { useCountdown } from '../../../hooks/useCountdown'
import Reveal from '../../Reveal'
import LumaEmbed from '../../goya/LumaEmbed'

/** Los tres pasos de la plataforma, en el orden en que se hacen. */
const PASOS = [
  {
    n: '01',
    titulo: 'Crea tu perfil',
    cuerpo: 'Entras con tu correo y te creamos la cuenta y la wallet. No hace falta instalar nada.',
    to: '/hackathon/dashboard',
    cta: 'Registrarme',
  },
  {
    n: '02',
    titulo: 'Arma tu equipo',
    cuerpo: 'De 1 a 5 personas. Comparte tu código de invitación o entra al directorio de equipos.',
    to: '/hackathon/equipos',
    cta: 'Ver equipos',
  },
  {
    n: '03',
    titulo: 'Entrega tu BUIDL',
    cuerpo: 'Repo, demo y vídeo desde tu panel antes del cierre. El jurado califica lo que entregues.',
    to: '/hackathon/proyectos',
    cta: 'Ver proyectos',
  },
]

/**
 * Cierre de la landing: la cuenta atrás y la puerta de entrada a la plataforma.
 *
 * El cartel no tiene esta sección — es lo que la página añade al cartel: dice
 * en tres pasos qué se hace aquí dentro y enlaza cada uno con su pantalla.
 */
const CierreCTA: React.FC = () => {
  const { dias, horas, minutos, terminado } = useCountdown(HACKATHON_INFO.startsAt)

  const bloques = terminado
    ? null
    : [
        { valor: dias, etiqueta: 'días' },
        { valor: horas, etiqueta: 'horas' },
        { valor: minutos, etiqueta: 'min' },
      ]

  return (
    <section className="goya-anchor mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 md:py-28">
      <div className="goya-panel goya-panel-lit" style={{ ['--cut' as string]: '28px' }}>
        <div className="flex flex-col gap-12 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal
              as="p"
              delay={100}
              className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
            >
              {HACKATHON_INFO.registroAbierto ? 'Registro abierto' : 'Registro por abrir'}
            </Reveal>

            <Reveal
              as="h2"
              delay={180}
              className="mt-4 font-display text-4xl uppercase leading-[1] tracking-wide text-goya-paper sm:text-5xl md:text-6xl"
            >
              Nos vemos el {FECHAS_CARTEL.rango.split('–')[0].trim()}
            </Reveal>

            <Reveal as="p" delay={260} className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
              Gratis, presencial en la Facultad de Ingeniería y abierto a
              estudiantes de cualquier universidad. Equipos de 1 a 5 personas.
            </Reveal>

            {/* Cuenta atrás */}
            {bloques && (
              <Reveal as="div" delay={340} className="mt-8 flex gap-3">
                {bloques.map((b) => (
                  <span
                    key={b.etiqueta}
                    className="goya-cut flex w-20 flex-col items-center gap-1 border border-goya-amber/30 py-3"
                    style={{ ['--cut' as string]: '8px' }}
                  >
                    <span className="font-display text-2xl leading-none text-goya-paper">
                      {String(b.valor).padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-label text-slate-500">
                      {b.etiqueta}
                    </span>
                  </span>
                ))}
              </Reveal>
            )}

            <Reveal as="p" delay={420} className="mt-8 font-mono text-[10px] uppercase tracking-label text-slate-500">
              Reserva tu lugar aquí · después arma tu equipo en el panel
            </Reveal>
          </div>

          {/* Aforo en Luma. Es distinto del registro de la plataforma: aquí se
              apunta la asistencia y Luma manda los recordatorios; el equipo y
              el proyecto se crean en /hackathon/dashboard. */}
          <Reveal as="div" delay={220} className="w-full shrink-0 lg:w-[600px]">
            <LumaEmbed eventId={HACKATHON_INFO.lumaEventId} titulo="Inscripción a Goya Hack" />
          </Reveal>
        </div>

        {/* Los tres pasos */}
        <div className="grid gap-px border-t border-goya-amber/20 sm:grid-cols-3">
          {PASOS.map((p, i) => (
            <Reveal
              key={p.n}
              as="div"
              delay={200 + i * 110}
              className={`p-8 ${i > 0 ? 'sm:border-l sm:border-goya-amber/20' : ''}`}
            >
              <span className="font-mono text-[11px] font-bold tracking-label text-goya-amber">
                {p.n}
              </span>
              <h3 className="mt-3 font-display text-lg uppercase tracking-wide text-goya-paper">
                {p.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.cuerpo}</p>
              <Link
                to={p.to}
                className="group mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
              >
                {p.cta}
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CierreCTA
