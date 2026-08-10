import React from 'react'
import { CRITERIOS } from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const CriteriosSection: React.FC = () => (
  <Seccion
    id="criterios"
    eyebrow="Evaluación"
    titulo="Cómo se califica tu BUIDL"
    sub="El jurado puntúa estos cuatro ejes con el mismo peso. La Guía del Hacker detalla qué espera cada uno."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {CRITERIOS.map((c, i) => (
        <article
          key={c.id}
          className="hack-card hack-reveal"
          style={
            {
              '--i': i,
              borderTop: `2px solid ${c.tono}`,
            } as React.CSSProperties
          }
        >
          <h3
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#fff',
              fontSize: '1rem',
              margin: '0 0 0.55rem',
            }}
          >
            {c.titulo}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
            {c.descripcion}
          </p>
        </article>
      ))}
    </div>
  </Seccion>
)

export default CriteriosSection
