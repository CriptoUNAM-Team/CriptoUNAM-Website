import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons'
import { SEDES } from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const SedesSection: React.FC = () => (
  <Seccion
    id="ubicaciones"
    eyebrow="Dónde"
    titulo="Sedes del hackathon"
    sub="El evento es presencial en Ciudad Universitaria, con transmisión de las charlas para quienes participan en híbrido."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {SEDES.map((sede, i) => (
        <article
          key={sede.id}
          className="hack-sede hack-reveal"
          style={{ '--i': i } as React.CSSProperties}
        >
          <img src={sede.imagen} alt={sede.nombre} loading="lazy" />
          <div className="hack-sede__body">
            <h3
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#fff',
                fontSize: '1rem',
                margin: '0 0 0.4rem',
              }}
            >
              {sede.nombre}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.55, margin: 0 }}>
              {sede.descripcion}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 14,
                marginTop: '0.75rem',
                fontSize: '0.82rem',
              }}
            >
              {sede.horario && (
                <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FontAwesomeIcon icon={faClock} />
                  {sede.horario}
                </span>
              )}
              {sede.mapsUrl && (
                <a
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  <FontAwesomeIcon icon={faLocationDot} />
                  Cómo llegar
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  </Seccion>
)

export default SedesSection
