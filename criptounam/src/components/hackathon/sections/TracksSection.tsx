import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faCube, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons'
import { HACKATHON_TRACKS } from '../../../data/hackathonInfo'
import Seccion from './Seccion'

const ICONOS: Record<string, typeof faBrain> = {
  'ai-agents': faBrain,
  'web3-blockchain': faCube,
  'social-good': faHandHoldingHeart,
}

const ACENTOS: Record<string, string> = {
  'ai-agents': '#a78bfa',
  'web3-blockchain': '#22d3ee',
  'social-good': '#4ade80',
}

const TracksSection: React.FC = () => (
  <Seccion
    id="tracks"
    eyebrow="Retos"
    titulo="Tres tracks, un objetivo"
    sub="Elige el que mejor encaje con tu equipo. Puedes cambiar de track hasta el momento de la entrega."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {HACKATHON_TRACKS.map((track, i) => {
        const acento = ACENTOS[track.id] ?? '#D4AF37'
        return (
          <article
            key={track.id}
            className="hack-card hack-reveal"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 46,
                height: 46,
                borderRadius: 12,
                background: `${acento}1a`,
                color: acento,
                fontSize: '1.15rem',
                marginBottom: '0.9rem',
              }}
            >
              <FontAwesomeIcon icon={ICONOS[track.id] ?? faCube} />
            </span>
            <h3
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#fff',
                fontSize: '1.1rem',
                margin: '0 0 0.6rem',
              }}
            >
              {track.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
              {track.description}
            </p>
          </article>
        )
      })}
    </div>
  </Seccion>
)

export default TracksSection
