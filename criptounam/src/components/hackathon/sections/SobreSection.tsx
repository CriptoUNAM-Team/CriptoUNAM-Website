import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faStopwatch, faGraduationCap, faCode } from '@fortawesome/free-solid-svg-icons'
import Seccion from './Seccion'

const DATOS = [
  {
    icon: faStopwatch,
    valor: '72 h',
    label: 'De construcción continua',
  },
  {
    icon: faUsers,
    valor: '1 a 5',
    label: 'Integrantes por equipo',
  },
  {
    icon: faGraduationCap,
    valor: 'Abierto',
    label: 'Estudiantes de cualquier carrera y semestre',
  },
  {
    icon: faCode,
    valor: '3',
    label: 'Tracks: AI, Web3 e impacto social',
  },
]

const SobreSection: React.FC = () => (
  <Seccion
    id="sobre"
    eyebrow="Qué es"
    titulo="Tres días para construir algo que funcione"
    sub="El Hackathon UNAM 2026 reúne a estudiantes de la UNAM y de otras universidades para construir, en 72 horas, un proyecto de Inteligencia Artificial o Web3. No necesitas experiencia previa en blockchain: hay talleres y mentorías durante todo el evento."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {DATOS.map((d, i) => (
        <div
          key={d.label}
          className="hack-card hack-reveal"
          style={{ '--i': i, textAlign: 'center' } as React.CSSProperties}
        >
          <FontAwesomeIcon
            icon={d.icon}
            style={{ color: '#D4AF37', fontSize: '1.4rem', marginBottom: '0.7rem' }}
          />
          <p
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 900,
              margin: '0 0 0.35rem',
            }}
          >
            {d.valor}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            {d.label}
          </p>
        </div>
      ))}
    </div>
  </Seccion>
)

export default SobreSection
