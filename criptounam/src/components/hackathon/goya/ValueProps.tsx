import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

const CAPACIDADES = [
  {
    n: '01',
    titulo: 'Jurado en vivo',
    cuerpo:
      'Presentas ante el jurado en persona, no en un vídeo grabado. Preguntas y respuestas en el momento.',
  },
  {
    n: '02',
    titulo: `Mentorías durante las ${HACKATHON_INFO.horas} horas`,
    cuerpo:
      'Acompañamiento técnico de la comunidad CriptoUNAM y de la Facultad mientras construyes, no solo al final.',
  },
  {
    n: '03',
    titulo: 'Premios y reconocimiento on-chain',
    cuerpo:
      'Bolsa por track, POAP conmemorativo y $PUMA en Avalanche para todo el que entregue un BUIDL válido.',
  },
]

const ValueProps: React.FC = () => (
  <Seccion
    numero="01"
    rotulo="Por qué venir"
    titulo={
      <>
        Construye en público.
        <br />
        Gana en equipo.
      </>
    }
    intro="No necesitas experiencia previa en blockchain. Hay talleres antes del kickoff y mentores durante todo el evento."
  >
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
      <div className="max-w-xl lg:pt-2">
        <Reveal as="p" delay={200} className="text-base leading-relaxed text-slate-300 sm:text-lg">
          {HACKATHON_INFO.horas} horas de trabajo real en la Facultad de
          Ingeniería, con entrega y evaluación aquí mismo. Llegas con una idea y
          sales con algo que funciona y que puedes enseñar.
        </Reveal>

        <Reveal as="div" delay={320} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/hackathon/dashboard"
            className="goya-cut group inline-flex items-center justify-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
            style={{ ['--cut' as string]: '9px' }}
          >
            Registra a tu equipo
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/hackathon/equipos"
            className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
            style={{ ['--cut' as string]: '9px' }}
          >
            Busca equipo
          </Link>
        </Reveal>
      </div>

      {/* Panel de capacidades */}
      <div className="w-full lg:max-w-lg">
        {CAPACIDADES.map((c, i) => (
          <Reveal
            key={c.n}
            as="div"
            delay={240 + i * 110}
            className={`flex gap-6 py-6 ${
              i < CAPACIDADES.length - 1 ? 'border-b border-goya-amber/15' : ''
            }`}
          >
            <span className="shrink-0 font-mono text-[11px] font-bold tracking-label text-goya-amber">
              {c.n}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg uppercase tracking-wide text-goya-paper sm:text-xl">
                {c.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.cuerpo}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </Seccion>
)

export default ValueProps
