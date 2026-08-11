import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import ComunidadPageContent from '../components/ComunidadPageContent'
import PageHero from '../components/PageHero'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faCode,
  faExternalLinkAlt,
  faUsers,
  faArrowRight,
  faClock,
  faRocket,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import { HACKATHON_INFO, NUM_TRACKS, TRACKS_EN_LINEA } from '../data/hackathonInfo'
import '../styles/global.css'

const Eventos = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#comunidad') {
      const el = document.getElementById('comunidad')
      requestAnimationFrame(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  return (
    <>
      <SEOHead
        title="Eventos — CriptoUNAM"
        description="Eventos, hackathones y comunidad CriptoUNAM. Construye con blockchain e inteligencia artificial."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/eventos"
        type="website"
      />

      <div
        style={{
          padding: '0.5rem clamp(0.5rem, 3vw, 1rem) 3rem',
        }}
      >
        {/* ============================================================
            HERO
            ============================================================ */}
        <PageHero
          icon={faCalendarAlt}
          iconColor="#60a5fa"
          iconGradient="linear-gradient(135deg, #60a5fa, #2563eb)"
          eyebrow="Eventos"
          title="CriptoUNAM en acción"
          description={
            <>
              Meetups, hackathones y sesiones presenciales. Únete a la comunidad y construye el futuro de Web3 desde la{' '}
              <strong style={{ color: '#F4D03F' }}>UNAM</strong>.
            </>
          }
          accentRgba="rgba(37,99,235,0.1)"
          stats={[
            { icon: faRocket, label: 'Hackathon', value: '2026', color: '#4ade80' },
            { icon: faCode, label: 'Tracks', value: NUM_TRACKS, color: '#a78bfa' },
            { icon: faClock, label: 'Horas', value: HACKATHON_INFO.horas, color: '#60a5fa' },
          ]}
        />

        {/* ============================================================
            HACKATHON CRIPTOUNAM 2026 — FACULTAD DE INGENIERÍA
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 0.25rem' }}>
          <div
            className="puma-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(124,58,237,0.4)',
              }}
            >
              <FontAwesomeIcon icon={faCode} style={{ color: '#fff', fontSize: '1.2rem' }} />
            </div>
            <h2
              style={{
                fontFamily: 'Orbitron',
                color: '#fff',
                fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)',
                margin: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              Hackathon UNAM 2026 · Facultad de Ingeniería
            </h2>
            <span className="puma-chip puma-chip--green">
              <FontAwesomeIcon icon={faRocket} />
              Inscripciones Abiertas
            </span>
          </div>

          <p
            className="puma-fade-in-up"
            style={{
              color: '#94a3b8',
              marginBottom: '1.75rem',
              maxWidth: 720,
              lineHeight: 1.6,
            }}
          >
            El hackathon insignia de <strong style={{ color: '#F4D03F' }}>CriptoUNAM</strong> y la{' '}
            <strong style={{ color: '#a78bfa' }}>Facultad de Ingeniería</strong> en la {HACKATHON_INFO.event}. {HACKATHON_INFO.horas} horas
            intensivas construyendo con inteligencia artificial, blockchain e impacto social.
          </p>

          <div
            className="puma-card puma-card--shimmer puma-fade-in-up"
            style={{
              padding: 'clamp(1.8rem, 4vw, 2.8rem)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.94) 100%)',
              border: '1.5px solid rgba(167, 139, 250, 0.4)',
              borderRadius: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <span className="puma-chip" style={{ background: 'rgba(167, 139, 250, 0.2)', color: '#c4b5fd', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} /> 21 – 24 Septiembre 2026
                </span>
                <span className="puma-chip puma-chip--gold">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> Facultad de Ingeniería, UNAM
                </span>
              </div>
              <h3 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.4rem', margin: '0 0 0.75rem 0' }}>
                ¿Por qué participar?
              </h3>
              <ul style={{ color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 1.75rem 0', paddingLeft: '1.25rem' }}>
                <li><strong>{NUM_TRACKS} tracks:</strong> {TRACKS_EN_LINEA}.</li>
                <li><strong>Premios en metálico y becas:</strong> Aceleración de proyectos ganadores.</li>
                <li><strong>Certificación y POAPs:</strong> Constancia curricular on-chain y POAP exclusivo.</li>
                <li><strong>Mentores top:</strong> Asesoría técnica en vivo y talleres prácticos.</li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/hackathon"
                  className="puma-btn puma-btn--gold"
                  style={{ textDecoration: 'none', padding: '0.8rem 1.6rem' }}
                >
                  <FontAwesomeIcon icon={faTrophy} />
                  Ver el Hackathon
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                </Link>
                <Link
                  to="/hackathon/guia"
                  style={{
                    color: '#c4b5fd',
                    textDecoration: 'none',
                    fontWeight: 600,
                    padding: '0.8rem 1.3rem',
                    borderRadius: '12px',
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  Guía del Hacker
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.3)' }}>
              <img
                src="/images/semanadie/sponsorship/hackathon-unamxhacks.png"
                alt="Hackathon UNAM 2026 — Facultad de Ingeniería"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            PRÓXIMAMENTE — espacio para futuros eventos
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 0.25rem' }}>
          <div
            className="puma-card puma-fade-in-up"
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(96,165,250,0.08) 0%, rgba(20,20,30,0.95) 70%)',
              border: '1px solid rgba(96,165,250,0.2)',
              borderRadius: '24px',
            }}
          >
            <div
              className="puma-float"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #60a5fa, #2563eb)',
                boxShadow: '0 14px 32px rgba(37,99,235,0.4)',
                marginBottom: '1rem',
                border: '2px solid rgba(255,255,255,0.15)',
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#fff', fontSize: '1.7rem' }} />
            </div>
            <h2
              className="puma-title-glow"
              style={{
                fontFamily: 'Orbitron',
                fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                marginBottom: '0.65rem',
              }}
            >
              Más eventos próximamente
            </h2>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
                maxWidth: 560,
                margin: '0 auto 1.5rem',
                lineHeight: 1.6,
              }}
            >
              Estamos preparando meetups, talleres y sesiones. Síguenos en nuestras redes y activa las notificaciones
              para enterarte primero.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://t.me/criptounam"
                target="_blank"
                rel="noopener noreferrer"
                className="puma-btn puma-btn--ghost"
              >
                Telegram
                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.78rem' }} />
              </a>
              <a
                href="https://twitter.com/criptounam"
                target="_blank"
                rel="noopener noreferrer"
                className="puma-btn puma-btn--ghost"
              >
                Twitter / X
                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.78rem' }} />
              </a>
            </div>
          </div>
        </section>

        {/* ============================================================
            COMUNIDAD
            ============================================================ */}
        <section
          id="comunidad"
          className="puma-fade-in-up"
          style={{
            marginTop: '4rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 26px rgba(212,175,55,0.4)',
              }}
            >
              <FontAwesomeIcon icon={faUsers} style={{ color: '#0a0a0a', fontSize: '1.3rem' }} />
            </div>
            <h2
              className="puma-title-glow"
              style={{
                fontFamily: 'Orbitron',
                margin: 0,
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              }}
            >
              Comunidad CriptoUNAM
            </h2>
          </div>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
              maxWidth: 640,
              margin: '0 auto 2rem',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Red de estudiantes, desarrolladores y entusiastas del blockchain en la UNAM.
          </p>
          <ComunidadPageContent />
        </section>
      </div>
    </>
  )
}

export default Eventos
