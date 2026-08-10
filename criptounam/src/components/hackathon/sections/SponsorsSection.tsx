import React from 'react'
import {
  SPONSORS,
  SPONSOR_TIER_LABEL,
  SPONSOR_TIER_ORDER,
  type Sponsor,
} from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const LogoSponsor: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const clase = `hack-sponsor${sponsor.fondoOpaco ? ' hack-sponsor--opaco' : ''}`
  const contenido = <img src={sponsor.logo} alt={sponsor.nombre} loading="lazy" />

  if (!sponsor.url) {
    return (
      <div className={clase} title={sponsor.nombre}>
        {contenido}
      </div>
    )
  }

  return (
    <a
      className={clase}
      href={sponsor.url}
      target="_blank"
      rel="noreferrer"
      title={sponsor.nombre}
    >
      {contenido}
    </a>
  )
}

const SponsorsSection: React.FC = () => {
  // Sólo se pintan los tiers que tienen a alguien; así la sección no muestra
  // huecos mientras se cierran patrocinios.
  const grupos = SPONSOR_TIER_ORDER.map((tier) => ({
    tier,
    sponsors: SPONSORS.filter((s) => s.tier === tier),
  })).filter((g) => g.sponsors.length > 0)

  if (grupos.length === 0) return null

  return (
    <Seccion
      id="sponsors"
      eyebrow="Quiénes lo hacen posible"
      titulo="Organizan y patrocinan"
      sub="¿Quieres sumar a tu empresa? Escríbenos y te compartimos el brochure de patrocinio."
    >
      <div style={{ display: 'grid', gap: '2.25rem' }}>
        {grupos.map(({ tier, sponsors }, gi) => (
          <div key={tier} className="hack-reveal" style={{ '--i': gi } as React.CSSProperties}>
            <h3
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                margin: '0 0 1rem',
                fontWeight: 700,
              }}
            >
              {SPONSOR_TIER_LABEL[tier]}
            </h3>
            <div className="hack-sponsors">
              {sponsors.map((s) => (
                <LogoSponsor key={s.id} sponsor={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Seccion>
  )
}

export default SponsorsSection
