import React, { useState } from 'react'
import { AGENDA } from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const AgendaSection: React.FC = () => {
  const [diaActivo, setDiaActivo] = useState(AGENDA[0]?.id ?? '')
  const dia = AGENDA.find((d) => d.id === diaActivo) ?? AGENDA[0]

  if (!dia) return null

  return (
    <Seccion
      id="horarios"
      eyebrow="Programa"
      titulo="72 horas, hora por hora"
      sub="Los talleres y mentorías se confirman en la Guía del Hacker conforme se cierren los cupos."
    >
      {/* Selector de día */}
      <div
        className="hack-reveal"
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.75rem' }}
        role="tablist"
        aria-label="Días del hackathon"
      >
        {AGENDA.map((d) => {
          const activo = d.id === dia.id
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => setDiaActivo(d.id)}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: `1px solid ${activo ? '#F4D03F' : 'rgba(212,175,55,0.3)'}`,
                background: activo
                  ? 'linear-gradient(135deg, #F4D03F, #D4AF37)'
                  : 'rgba(212,175,55,0.07)',
                color: activo ? '#0a0a0a' : '#D4AF37',
              }}
            >
              {d.etiqueta}
            </button>
          )
        })}
      </div>

      <div className="hack-timeline hack-reveal">
        {dia.items.map((item, i) => (
          <div key={`${item.hora}-${i}`} className="hack-timeline__item">
            <span
              className={`hack-timeline__dot${item.hito ? ' hack-timeline__dot--hito' : ''}`}
              aria-hidden="true"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12 }}>
              <span className="hack-timeline__hora">{item.hora}</span>
              <h3
                style={{
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {item.titulo}
              </h3>
            </div>
            {item.descripcion && (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>
                {item.descripcion}
              </p>
            )}
          </div>
        ))}
      </div>
    </Seccion>
  )
}

export default AgendaSection
