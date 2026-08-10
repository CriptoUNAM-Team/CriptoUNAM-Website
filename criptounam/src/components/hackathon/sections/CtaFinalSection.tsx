import React from 'react'
import { Link } from 'react-router-dom'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import { GUIA_SOPORTE } from '../../../data/guiaHacker'
import RegistroCTA from '../RegistroCTA'

const CtaFinalSection: React.FC = () => (
  <section
    id="registro"
    className="hack-card hack-card--featured hack-reveal"
    style={{
      scrollMarginTop: 90,
      textAlign: 'center',
      padding: 'clamp(2rem, 5vw, 3.25rem)',
      marginBottom: '3rem',
    }}
  >
    <h2
      style={{
        fontFamily: 'Orbitron, sans-serif',
        color: '#fff',
        fontSize: 'clamp(1.4rem, 4vw, 2rem)',
        margin: '0 0 0.75rem',
      }}
    >
      Nos vemos en {HACKATHON_INFO.event}
    </h2>
    <p
      style={{
        color: '#94a3b8',
        fontSize: '1rem',
        lineHeight: 1.65,
        margin: '0 auto 1.75rem',
        maxWidth: '55ch',
      }}
    >
      El registro es gratuito y toma dos minutos. Puedes apuntarte solo y formar equipo durante el
      kickoff.
    </p>

    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.85rem',
        justifyContent: 'center',
      }}
    >
      <RegistroCTA label="Regístrate gratis" />
      <Link
        to="/hackathon/guia"
        style={{
          padding: '0.9rem 1.5rem',
          borderRadius: 12,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#D4AF37',
          border: '1px solid rgba(212,175,55,0.45)',
        }}
      >
        Leer la Guía del Hacker
      </Link>
    </div>

    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '1.75rem 0 0' }}>
      ¿Dudas?{' '}
      <a
        href={GUIA_SOPORTE.telegram}
        target="_blank"
        rel="noreferrer"
        style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 700 }}
      >
        Escríbenos en Telegram
      </a>
    </p>
  </section>
)

export default CtaFinalSection
