import React from 'react'
import { trackPublicoPorNombre, type TrackReto } from '../../data/hackathonInfo'
import type { Track } from '../../services/hackathon.service'
import { AvisoApexStellar } from './TrackPicker'
import { GOLD } from './ui'

type Props = {
  tracks: Track[]
  trackIds: string[]
  value: string[]
  onChange: (sponsorIds: string[]) => void
  disabled?: boolean
}

/** Sponsors de los tracks ya elegidos. En Blockchain: Stellar, Pollar y Avalanche. */
const SponsorPicker: React.FC<Props> = ({ tracks, trackIds, value, onChange, disabled }) => {
  const retos: TrackReto[] = []
  const vistos = new Set<string>()
  for (const track of tracks) {
    if (!trackIds.includes(track.id)) continue
    for (const reto of trackPublicoPorNombre(track.name)?.retos ?? []) {
      if (vistos.has(reto.id)) continue
      vistos.add(reto.id)
      retos.push(reto)
    }
  }

  if (trackIds.length === 0) {
    return (
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>
        Primero elige uno o más tracks. Después marcas el sponsor.
      </p>
    )
  }

  if (retos.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
        Puedes elegir uno o más sponsors de los tracks marcados.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
        }}
      >
        {retos.map((reto) => {
          const on = value.includes(reto.id)
          return (
            <button
              key={reto.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(on ? value.filter((id) => id !== reto.id) : [...value, reto.id])}
              aria-pressed={on}
              style={{
                textAlign: 'left',
                background: on ? 'rgba(233,175,60,0.16)' : 'rgba(15,23,42,0.65)',
                border: `1.5px solid ${on ? GOLD : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14,
                padding: '0.85rem 0.95rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: on ? GOLD : '#fff', fontWeight: 800 }}>
                  {reto.logo && (
                    <img
                      src={reto.logo}
                      alt=""
                      style={{
                        height: 22,
                        width: 'auto',
                        maxWidth: 72,
                        objectFit: 'contain',
                        filter: reto.colorPropio ? undefined : 'brightness(0) invert(1)',
                      }}
                    />
                  )}
                  {reto.nombre}
                </span>
                {on && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#0a0a0a',
                      background: GOLD,
                      borderRadius: 999,
                      padding: '2px 8px',
                    }}
                  >
                    Elegido
                  </span>
                )}
              </div>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.45 }}>
                {reto.descripcion}
              </p>
            </button>
          )
        })}
      </div>
      {value.includes('stellar') && <AvisoApexStellar />}
    </div>
  )
}

export default SponsorPicker
