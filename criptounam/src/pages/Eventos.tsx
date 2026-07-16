import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { hackathonsData, eventosLumaPresenciales, eventosLumaPasados } from '../data/eventosData'
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
  faAward,
  faArrowRight,
  faClock,
  faTicket,
  faRocket,
  faTrophy,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const LUMA_CHECKOUT_SCRIPT = 'https://embed.lu.ma/checkout-button.js'


const Eventos = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#comunidad') {
      const el = document.getElementById('comunidad')
      requestAnimationFrame(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  useEffect(() => {
    if (document.getElementById('luma-checkout')) return
    const script = document.createElement('script')
    script.id = 'luma-checkout'
    script.src = LUMA_CHECKOUT_SCRIPT
    script.async = true
    document.body.appendChild(script)
    return () => {
      const s = document.getElementById('luma-checkout')
      if (s) s.remove()
    }
  }, [])

  const totalVigentes = eventosLumaPresenciales.length
  const totalPasados = eventosLumaPasados.length
  const totalHacks = hackathonsData.length
  const totalProximos = totalVigentes + 1

  return (
    <>
      <SEOHead
        title="Eventos y comunidad - CriptoUNAM"
        description="Eventos, hackathons, canales, equipo y galería de la comunidad CriptoUNAM."
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
          title="Comunidad CriptoUNAM"
          description={
            <>
              Meetups, hackathones y sesiones. Al asistir, reclama tu{' '}
              <strong style={{ color: '#F4D03F' }}>POAP on-chain</strong>.
            </>
          }
          accentRgba="rgba(37,99,235,0.1)"
          stats={[
            { icon: faTicket, label: 'Próximos', value: totalProximos, color: '#4ade80' },
            { icon: faCode, label: 'Hackathons', value: totalHacks, color: '#a78bfa' },
            { icon: faClock, label: 'Pasados', value: totalPasados, color: '#60a5fa' },
          ]}
          cta={{ to: '/claim', label: 'Reclamar POAP', icon: faAward, variant: 'gold' }}
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
            <strong style={{ color: '#a78bfa' }}>Facultad de Ingeniería</strong> en la Semana DIE. 48 horas intensivas
            construyendo con inteligencia artificial, blockchain y track libre (soluciones de impacto social/ambiental).
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
                <li><strong>Tracks duales:</strong> AI & Blockchain y Track Libre.</li>
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
                  Inscribirse al Hackathon
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                </Link>
                <Link
                  to="/hackathon/equipos"
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
                  Buscar Equipo
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(167,139,250,0.3)' }}>
              <img
                src="/images/hackathon-2025.png"
                alt="Hackathon UNAM 2026 — Facultad de Ingeniería"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            EVENTOS PRESENCIALES VIGENTES
            ============================================================ */}
        {eventosLumaPresenciales.length > 0 && (
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
                  background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 22px rgba(212,175,55,0.4)',
                }}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#0a0a0a' }} />
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
                Eventos presenciales
              </h2>
              <span className="puma-chip puma-chip--green">
                <FontAwesomeIcon icon={faRocket} />
                {totalVigentes} {totalVigentes === 1 ? 'vigente' : 'vigentes'}
              </span>
              {totalVigentes > 1 && (
                <span className="eventos-swipe-hint">← desliza →</span>
              )}
            </div>

            <div
              className="eventos-carousel puma-stagger"
              style={{ gap: '1rem', alignItems: 'stretch' }}
            >
              {eventosLumaPresenciales.map((evento, idx) => (
                <article
                  key={evento.id}
                  className="puma-card puma-card--featured"
                  style={
                    {
                      '--i': idx,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1.5rem',
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      flexWrap: 'wrap',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span className="puma-chip puma-chip--green">
                      <FontAwesomeIcon icon={faRocket} />
                      Abierto
                    </span>
                    <span className="puma-chip puma-chip--amber">
                      <FontAwesomeIcon icon={faAward} />
                      POAP al asistir
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Orbitron',
                      color: '#F4D03F',
                      fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                      marginBottom: '0.6rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {evento.title}
                  </h3>
                  {evento.description && (
                    <p
                      style={{
                        color: '#cbd5e1',
                        fontSize: '0.95rem',
                        marginBottom: '1.25rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {evento.description}
                    </p>
                  )}

                  <div
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(212,175,55,0.25)',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
                    }}
                  >
                    <iframe
                      src={`https://luma.com/embed/event/${evento.lumaEventId}/simple`}
                      width="100%"
                      height="450"
                      style={{
                        border: 'none',
                        background: '#fff',
                        display: 'block',
                      }}
                      title={evento.title}
                      allow="fullscreen; payment"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 'auto' }}>
                    <a
                      href={`https://luma.com/event/${evento.lumaEventId}`}
                      className="puma-btn puma-btn--gold luma-checkout--button"
                      data-luma-action="checkout"
                      data-luma-event-id={evento.lumaEventId}
                      style={{ flex: '1 1 auto', justifyContent: 'center' }}
                    >
                      <FontAwesomeIcon icon={faTicket} />
                      Inscribirme
                      <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.78rem' }} />
                    </a>
                    <Link
                      to={`/claim/evento/${evento.lumaEventId}`}
                      className="puma-btn puma-btn--ghost"
                      style={{ flex: '0 0 auto' }}
                    >
                      <FontAwesomeIcon icon={faAward} />
                      POAP
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            EVENTOS PASADOS
            ============================================================ */}
        {eventosLumaPasados.length > 0 && (
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
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(148,163,184,0.15)',
                  border: '1px solid rgba(148,163,184,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faClock} style={{ color: '#94a3b8' }} />
              </div>
              <h3
                style={{
                  fontFamily: 'Orbitron',
                  color: '#cbd5e1',
                  fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                  margin: 0,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Eventos pasados
              </h3>
              <span className="puma-chip puma-chip--gray">{totalPasados} eventos</span>
              {totalPasados > 1 && (
                <span className="eventos-swipe-hint">← desliza →</span>
              )}
            </div>

            <div
              className="eventos-carousel eventos-carousel--pasados puma-stagger"
              style={{ gap: '1rem' }}
            >
              {eventosLumaPasados.map((evento, idx) => (
                <article
                  key={evento.id}
                  className="puma-card puma-card--shimmer"
                  style={
                    {
                      '--i': idx,
                      padding: '1.35rem',
                      opacity: 0.92,
                    } as React.CSSProperties
                  }
                >
                  <h4
                    style={{
                      fontFamily: 'Orbitron',
                      color: '#F4D03F',
                      fontSize: '1.1rem',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {evento.title}
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span className="puma-chip puma-chip--gray" style={{ fontSize: '0.72rem' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {evento.date}
                      {evento.time ? ` · ${evento.time}` : ''}
                    </span>
                    <span className="puma-chip puma-chip--gray" style={{ fontSize: '0.72rem' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {evento.location}
                    </span>
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      marginBottom: '0.9rem',
                      border: '1px solid rgba(148,163,184,0.18)',
                    }}
                  >
                    <iframe
                      src={`https://luma.com/embed/event/${evento.lumaEventId}/simple`}
                      width="100%"
                      height="380"
                      style={{
                        border: 'none',
                        background: '#fff',
                        display: 'block',
                      }}
                      title={evento.title}
                      allow="fullscreen; payment"
                    />
                  </div>
                  <a
                    href={`https://luma.com/event/${evento.lumaEventId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#D4AF37',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Ver en Luma
                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            HACKATHONS
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
              <FontAwesomeIcon icon={faCode} style={{ color: '#fff' }} />
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
              Hackathons Pasados
            </h2>
            <span className="puma-chip puma-chip--blue">
              <FontAwesomeIcon icon={faTrophy} />
              {totalHacks} {totalHacks === 1 ? 'evento' : 'eventos'}
            </span>
            {totalHacks > 1 && (
              <span className="eventos-swipe-hint">← desliza →</span>
            )}
          </div>

          <p
            className="puma-fade-in-up"
            style={{
              color: '#94a3b8',
              marginBottom: '1.5rem',
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            Revive los hackathones en los que participó el ecosistema Web3. Premios, mentores y la oportunidad de
            construir el futuro con la comunidad.
          </p>

          <div
            className="eventos-carousel eventos-carousel--hacks puma-stagger"
            style={{ gap: '1rem' }}
          >
            {hackathonsData.map((hack, idx) => (
              <article
                key={hack.id}
                className="puma-card puma-card--shimmer"
                style={
                  {
                    '--i': idx,
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  }}
                >
                  <img
                    src={hack.image}
                    alt={hack.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  {hack.prizes && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                        color: '#0a0a0a',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 999,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'Orbitron',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        boxShadow: '0 6px 18px rgba(212,175,55,0.5)',
                      }}
                    >
                      <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '0.72rem' }} />
                      {hack.prizes}
                    </div>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(6px)',
                      color: '#a78bfa',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'Orbitron',
                      border: '1px solid rgba(167,139,250,0.4)',
                    }}
                  >
                    HACKATHON
                  </span>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'Orbitron',
                      color: '#fff',
                      fontSize: '1.08rem',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {hack.name}
                  </h3>
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      marginBottom: '1rem',
                      flex: 1,
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {hack.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      marginBottom: '1rem',
                    }}
                  >
                    <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.72rem' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {hack.date}
                    </span>
                    <span className="puma-chip puma-chip--blue" style={{ fontSize: '0.72rem' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {hack.location}
                    </span>
                  </div>

                  <a
                    href={hack.url}
                    target="_blank"
                    rel="noreferrer"
                    className="puma-btn puma-btn--gold"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.65rem 1rem',
                      fontSize: '0.92rem',
                    }}
                  >
                    Participar
                    <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.72rem' }} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================
            CTA POAP
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 0.25rem' }}>
          <div
            className="puma-card puma-card--rainbow puma-fade-in-up"
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              textAlign: 'center',
              background:
                'linear-gradient(160deg, rgba(212,175,55,0.12) 0%, rgba(20,20,30,0.95) 70%)',
            }}
          >
            <div
              className="puma-float"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 30% 20%, rgba(244,208,63,0.55), transparent 60%), linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)',
                boxShadow: '0 16px 36px rgba(212,175,55,0.4)',
                marginBottom: '1rem',
                border: '2px solid rgba(255,255,255,0.18)',
              }}
            >
              <FontAwesomeIcon
                icon={faAward}
                style={{ color: '#0a0a0a', fontSize: '2rem' }}
              />
            </div>
            <h2
              className="puma-title-glow"
              style={{
                fontFamily: 'Orbitron',
                fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)',
                marginBottom: '0.65rem',
              }}
            >
              ¿Asististe a un evento? Reclama tu POAP
            </h2>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: 'clamp(0.95rem, 2.4vw, 1.05rem)',
                maxWidth: 600,
                margin: '0 auto 1.5rem',
                lineHeight: 1.6,
              }}
            >
              Cada evento de CriptoUNAM emite un POAP transferible como recuerdo on-chain. Conecta
              tu wallet y reclama el tuyo con el código que te dimos en el evento.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link to="/claim/evento" className="puma-btn puma-btn--gold">
                <FontAwesomeIcon icon={faAward} />
                Reclamar POAP de evento
              </Link>
              <Link to="/claim" className="puma-btn puma-btn--ghost">
                Ver mi colección
              </Link>
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

      <style>{`
        /* ============================================================
           Carrusel horizontal con scroll-snap (vigentes / pasados / hacks)
           Se desliza con swipe en mobile y con trackpad en desktop.
           ============================================================ */
        .eventos-carousel {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 0.25rem;
          padding: 0 0.25rem 1rem;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
        }
        .eventos-carousel > article {
          flex: 0 0 clamp(280px, 88vw, 420px);
          scroll-snap-align: start;
          min-width: 0;
        }
        @media (min-width: 720px) {
          .eventos-carousel > article {
            flex-basis: 460px;
          }
        }
        @media (min-width: 1100px) {
          .eventos-carousel > article {
            flex-basis: 500px;
          }
        }
        /* Cards pasadas son más compactas — menos ancho */
        .eventos-carousel--pasados > article {
          flex-basis: clamp(260px, 84vw, 360px);
        }
        @media (min-width: 720px) {
          .eventos-carousel--pasados > article {
            flex-basis: 380px;
          }
        }
        /* Hackathons: cards medias */
        .eventos-carousel--hacks > article {
          flex-basis: clamp(280px, 86vw, 380px);
        }
        @media (min-width: 720px) {
          .eventos-carousel--hacks > article {
            flex-basis: 400px;
          }
        }
        /* Scrollbar dorada delgada (Chromium/WebKit) */
        .eventos-carousel::-webkit-scrollbar {
          height: 6px;
        }
        .eventos-carousel::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.04);
          border-radius: 4px;
        }
        .eventos-carousel::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.4);
          border-radius: 4px;
        }
        .eventos-carousel::-webkit-scrollbar-thumb:hover {
          background: rgba(212,175,55,0.6);
        }
        /* Firefox */
        .eventos-carousel {
          scrollbar-width: thin;
          scrollbar-color: rgba(212,175,55,0.4) rgba(255,255,255,0.04);
        }
        /* Hint sutil de scroll */
        .eventos-swipe-hint {
          font-size: 0.78rem;
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
          padding: 4px 10px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 999px;
          white-space: nowrap;
        }
      `}</style>
    </>
  )
}

export default Eventos
