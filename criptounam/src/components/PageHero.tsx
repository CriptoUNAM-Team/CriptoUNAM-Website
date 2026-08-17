import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export type PageHeroStat = {
  icon: IconDefinition
  label: string
  value: string | number
  color?: string
}

export type PageHeroCta = {
  to?: string
  href?: string
  label: string
  icon?: IconDefinition
  variant?: 'gold' | 'ghost'
}

type Props = {
  icon: IconDefinition
  iconColor: string
  iconGradient?: string
  eyebrow?: string
  title: string
  /** Highlight visual del título: gradient text dorado */
  highlight?: boolean
  description?: React.ReactNode
  stats?: PageHeroStat[]
  cta?: PageHeroCta
  /** Color de acento — tinte sutil del fondo de la card */
  accentRgba?: string
}

/**
 * Hero compacto y mobile-first usado en páginas internas (Cursos,
 * Recompensas, Eventos). Integra icono, título, sub, stats inline y
 * CTA en una sola card glassmorphism que aprovecha el ancho útil.
 */
const PageHero: React.FC<Props> = ({
  icon,
  iconColor,
  iconGradient,
  eyebrow,
  title,
  highlight = true,
  description,
  stats,
  cta,
  accentRgba = 'rgba(212,175,55,0.08)',
}) => {
  const gradient = iconGradient || `linear-gradient(135deg, ${iconColor}, ${iconColor}aa)`

  return (
    <section
      style={{
        maxWidth: 1100,
        margin: '0 auto 1.25rem',
        padding: '0 0.5rem',
      }}
    >
      <div
        className="page-hero"
        style={{
          position: 'relative',
          borderRadius: 18,
          padding: 'clamp(1.1rem, 3.5vw, 1.6rem)',
          background: `linear-gradient(160deg, ${accentRgba} 0%, rgba(15,15,23,0.92) 70%)`,
          border: `1px solid ${iconColor}33`,
          boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          overflow: 'hidden',
        }}
      >
        {/* glow ambiental */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, ${iconColor}40, transparent 70%)`,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        <div className="page-hero__row">
          {/* Icono */}
          <div
            style={{
              width: 'clamp(48px, 10vw, 60px)',
              height: 'clamp(48px, 10vw, 60px)',
              borderRadius: 14,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 10px 26px ${iconColor}55`,
              flexShrink: 0,
            }}
          >
            <FontAwesomeIcon
              icon={icon}
              style={{ color: '#fff', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
            />
          </div>

          {/* Título + sub */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {eyebrow && (
              <div
                style={{
                  color: iconColor,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {eyebrow}
              </div>
            )}
            <h1
              style={{
                fontFamily: 'Chakra Petch',
                fontSize: 'clamp(1.35rem, 4.5vw, 1.9rem)',
                margin: 0,
                lineHeight: 1.1,
                ...(highlight
                  ? {
                      background:
                        'linear-gradient(135deg, #fff7d6 0%, #F4D03F 50%, #D4AF37 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : { color: '#fff' }),
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: 'clamp(0.82rem, 2.2vw, 0.92rem)',
                  margin: '0.35rem 0 0',
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* CTA opcional en desktop, va abajo en mobile */}
          {cta && (
            <div className="page-hero__cta">
              <HeroCta cta={cta} iconColor={iconColor} />
            </div>
          )}
        </div>

        {/* Stats inline — chips compactos */}
        {stats && stats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
              gap: 'clamp(0.4rem, 1.5vw, 0.6rem)',
              marginTop: '1rem',
            }}
          >
            {stats.map((s) => {
              const color = s.color || iconColor
              return (
                <div
                  key={s.label}
                  style={{
                    padding: '0.55rem 0.7rem',
                    background: 'rgba(0,0,0,0.35)',
                    border: `1px solid ${color}22`,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FontAwesomeIcon
                      icon={s.icon}
                      style={{ color, fontSize: '0.7rem', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#fff',
                      fontFamily: 'Chakra Petch',
                      fontSize: 'clamp(0.95rem, 3.5vw, 1.2rem)',
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA en mobile: full width abajo */}
        {cta && (
          <div className="page-hero__cta--mobile" style={{ marginTop: '0.9rem' }}>
            <HeroCta cta={cta} iconColor={iconColor} fullWidth />
          </div>
        )}
      </div>

      <style>{`
        .page-hero__row {
          display: flex;
          align-items: center;
          gap: clamp(0.8rem, 2.5vw, 1rem);
          position: relative;
          z-index: 1;
        }
        .page-hero__cta { display: block; flex-shrink: 0; }
        .page-hero__cta--mobile { display: none; }
        @media (max-width: 640px) {
          .page-hero__cta { display: none; }
          .page-hero__cta--mobile { display: block; }
        }
      `}</style>
    </section>
  )
}

const HeroCta: React.FC<{ cta: PageHeroCta; iconColor: string; fullWidth?: boolean }> = ({
  cta,
  iconColor,
  fullWidth,
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '0.55rem 1rem',
    borderRadius: 10,
    fontSize: '0.88rem',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'transform 0.2s',
    width: fullWidth ? '100%' : 'auto',
  }
  const styles: React.CSSProperties =
    cta.variant === 'ghost'
      ? {
          ...base,
          background: 'rgba(255,255,255,0.04)',
          color: '#fff',
          border: `1px solid ${iconColor}55`,
        }
      : {
          ...base,
          background: `linear-gradient(135deg, ${iconColor}, ${iconColor}cc)`,
          color: '#0a0a0a',
          fontWeight: 700,
          border: 'none',
          boxShadow: `0 6px 18px ${iconColor}55`,
        }
  const content = (
    <>
      {cta.icon && <FontAwesomeIcon icon={cta.icon} />}
      {cta.label}
      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
    </>
  )
  if (cta.href) {
    return (
      <a href={cta.href} style={styles} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }
  return (
    <Link to={cta.to || '#'} style={styles}>
      {content}
    </Link>
  )
}

export default PageHero
