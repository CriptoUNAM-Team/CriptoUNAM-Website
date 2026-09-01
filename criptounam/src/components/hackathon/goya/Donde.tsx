import React from 'react'
import { MapPin } from 'lucide-react'
import { SEDES } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'

/**
 * Panorama de espacios: va justo bajo el hero para ubicar al hacker antes
 * de entrar al CIA con vídeo.
 */
const Donde: React.FC = () => {
  const secundarias = SEDES.filter((s) => !s.principal)

  return (
    <Seccion
      id="donde"
      rotulo="Dónde"
      titulo="Ciudad Universitaria"
      intro="Todo pasa en la Facultad de Ingeniería: se construye en el CIA del martes al viernes; el Auditorio abre para la inauguración y la clausura."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {secundarias.map((sede, i) => (
          <Reveal key={sede.id} as="article" delay={160 + i * 100} className="goya-panel goya-panel-hover">
            <div className="relative flex min-h-[240px] flex-col justify-end overflow-hidden">
              <img
                src={sede.imagen}
                alt={sede.nombreLargo ?? sede.nombre}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale transition-all duration-500 hover:opacity-70 hover:grayscale-0"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(1,0,4,0.97) 12%, rgba(1,0,4,0.6) 50%, rgba(17,36,65,0.25) 100%)',
                }}
                aria-hidden="true"
              />

              {sede.logo && (
                <span
                  className="goya-cut absolute right-4 top-4 flex h-14 w-14 items-center justify-center border border-goya-amber/30 bg-goya-void/75 p-2 backdrop-blur-sm"
                  style={{ ['--cut' as string]: '6px' }}
                >
                  <img src={sede.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                </span>
              )}

              <div className="relative p-5">
                <h3 className="font-display text-base uppercase leading-tight tracking-wide text-goya-paper">
                  {sede.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{sede.descripcion}</p>
                {sede.horario && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-goya-amber/70">
                    {sede.horario}
                  </p>
                )}
                {sede.mapsUrl && (
                  <a
                    href={sede.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                  >
                    <MapPin size={12} />
                    Cómo llegar
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Seccion>
  )
}

export default Donde
