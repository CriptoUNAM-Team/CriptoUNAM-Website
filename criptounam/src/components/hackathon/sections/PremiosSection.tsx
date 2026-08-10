import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faMedal, faGift } from '@fortawesome/free-solid-svg-icons'
import { PREMIOS, type Premio } from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const ICONO_CATEGORIA: Record<string, typeof faTrophy> = {
  General: faTrophy,
  Track: faMedal,
  Especial: faGift,
}

const PremioCard: React.FC<{ premio: Premio; index: number }> = ({ premio, index }) => (
  <article
    className={`hack-card hack-reveal${premio.destacado ? ' hack-card--featured' : ''}`}
    style={{ '--i': index } as React.CSSProperties}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
      <FontAwesomeIcon
        icon={ICONO_CATEGORIA[premio.categoria] ?? faMedal}
        style={{ color: premio.destacado ? '#F4D03F' : '#D4AF37', fontSize: '1.1rem' }}
      />
      <span
        style={{
          fontSize: '0.7rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          fontWeight: 700,
        }}
      >
        {premio.categoria}
      </span>
    </div>

    <h3
      style={{
        fontFamily: 'Orbitron, sans-serif',
        color: '#fff',
        fontSize: '1.05rem',
        margin: '0 0 0.4rem',
      }}
    >
      {premio.titulo}
    </h3>

    <p
      style={{
        color: premio.destacado ? '#F4D03F' : '#D4AF37',
        fontWeight: 800,
        fontSize: '1.25rem',
        margin: '0 0 0.6rem',
      }}
    >
      {premio.monto}
    </p>

    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
      {premio.descripcion}
    </p>
  </article>
)

const SUB =
  'Además de la bolsa por track, todo el que entregue un BUIDL válido recibe POAP y $PUMA en Avalanche.'

const PremiosSection: React.FC = () => (
  <Seccion id="premios" eyebrow="Premios" titulo="Qué se llevan los ganadores" sub={SUB}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {PREMIOS.map((premio, i) => (
        <PremioCard key={premio.id} premio={premio} index={i} />
      ))}
    </div>
  </Seccion>
)

export default PremiosSection
