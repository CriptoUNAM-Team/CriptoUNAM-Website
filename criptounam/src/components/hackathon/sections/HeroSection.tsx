import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faLocationDot,
  faCircleCheck,
  faClock,
  faBolt,
} from '@fortawesome/free-solid-svg-icons'
import { HACKATHON_INFO } from '../../../data/hackathonInfo'
import { useCountdown } from '../../../hooks/useCountdown'
import RegistroCTA from '../RegistroCTA'

const CELDAS: { key: 'dias' | 'horas' | 'minutos' | 'segundos'; label: string }[] = [
  { key: 'dias', label: 'Días' },
  { key: 'horas', label: 'Horas' },
  { key: 'minutos', label: 'Min' },
  { key: 'segundos', label: 'Seg' },
]

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })

const HeroSection: React.FC = () => {
  const countdown = useCountdown(HACKATHON_INFO.startsAt)
  const registroAbierto = HACKATHON_INFO.registroAbierto

  return (
    <section className="hack-hero" style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)' }}>
      {/* Decorado: no aporta información, se oculta a lectores de pantalla. */}
      <div className="hack-hero__grid" aria-hidden="true" />
      <div className="hack-hero__scanline" aria-hidden="true" />

      <div style={{ maxWidth: 900 }}>
        <span
          className="hack-eyebrow"
          style={{
            color: registroAbierto ? '#4ade80' : '#94a3b8',
            borderColor: registroAbierto ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.15)',
            background: registroAbierto ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)',
          }}
        >
          <FontAwesomeIcon icon={registroAbierto ? faCircleCheck : faClock} />
          {registroAbierto ? 'Registro abierto' : 'Registro por abrir'}
        </span>

        <h1
          className="hack-hero__title"
          style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', margin: '1.1rem 0 0' }}
        >
          Hackathon UNAM 2026
          <span className="hack-caret" aria-hidden="true">_</span>
        </h1>

        <p
          style={{
            color: '#e2e8f0',
            fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
            margin: '0.85rem 0 0',
            fontWeight: 600,
          }}
        >
          AI &amp; Blockchain · {HACKATHON_INFO.duration}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            margin: '1.5rem 0 0',
            color: '#94a3b8',
            fontSize: '0.95rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faCalendarDays} style={{ color: '#D4AF37' }} />
            {fechaLarga(HACKATHON_INFO.startsAt)} — {fechaLarga(HACKATHON_INFO.endsAt)}, 2026
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faLocationDot} style={{ color: '#D4AF37' }} />
            {HACKATHON_INFO.location}
          </span>
        </div>

        {/* Cuenta regresiva */}
        <div style={{ margin: '2rem 0 0', maxWidth: 460 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#94a3b8',
              fontSize: '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.7rem',
            }}
          >
            <FontAwesomeIcon icon={faBolt} style={{ color: '#22d3ee' }} />
            {countdown.terminado ? 'El hackathon ya comenzó' : 'Faltan'}
          </span>

          {!countdown.terminado && (
            <div className="hack-countdown">
              {CELDAS.map(({ key, label }) => (
                <div key={key} className="hack-countdown__cell">
                  <span className="hack-countdown__value">
                    {String(countdown[key]).padStart(2, '0')}
                  </span>
                  <span className="hack-countdown__label">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', margin: '2rem 0 0' }}>
          <RegistroCTA label="Regístrate gratis" />
          <a
            href="#premios"
            style={{
              padding: '0.9rem 1.5rem',
              borderRadius: 12,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              color: '#D4AF37',
              border: '1px solid rgba(212,175,55,0.45)',
            }}
          >
            Ver premios
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
