import React from 'react'
import { HACKATHON_TRACKS, STELLAR_APEX_GOYA_URL } from '../../data/hackathonInfo'
import type { Track } from '../../services/hackathon.service'
import { GOLD } from './ui'

type Props = {
  tracks: Track[]
  value: string[]
  onChange: (trackIds: string[]) => void
  /** Permite dejar los tracks sin elegir (crear equipo). */
  allowEmpty?: boolean
  disabled?: boolean
}

/** Copia de landing enriquecida por nombre de track en DB. */
/** Blockchain incluye el reto Stellar. El nombre en DB a veces es solo "Blockchain". */
export function esTrackConStellar(name: string): boolean {
  const n = name.trim().toLowerCase()
  return n.includes('blockchain') || n.includes('stellar')
}

/** Paso obligatorio de entrega Stellar: el jurado elige en Stellar Apex. */
/** Aviso para todo el hackathon: GOYA HACK ya está abierto en Stellar Apex. */
export const AvisoSubirApex: React.FC = () => (
  <p
    role="status"
    style={{
      margin: '0 0 1rem',
      padding: '0.85rem 1rem',
      borderRadius: 12,
      border: '1px solid rgba(233,175,60,0.55)',
      background: 'rgba(233,175,60,0.12)',
      color: '#f8e7c0',
      fontSize: '0.92rem',
      lineHeight: 1.5,
    }}
  >
    Si vas por el track de Stellar, sube también tu proyecto en{' '}
    <a href={STELLAR_APEX_GOYA_URL} target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 800 }}>
      Stellar Apex · GOYA HACK
    </a>
    . Solo esos proyectos van ahí: Stellar elige a los ganadores desde esa página. La entrega en esta plataforma sigue siendo para todos, hasta el domingo 27 a las 23:59 (CDMX).
  </p>
)

export const AvisoApexStellar: React.FC = () => (
  <p
    role="status"
    style={{
      margin: 0,
      padding: '0.75rem 0.9rem',
      borderRadius: 12,
      border: '1px solid rgba(233,175,60,0.55)',
      background: 'rgba(233,175,60,0.1)',
      color: '#f8e7c0',
      fontSize: '0.82rem',
      lineHeight: 1.5,
    }}
  >
    Paso obligatorio si vas por <strong style={{ color: GOLD }}>Stellar</strong>: sube el mismo
    proyecto en{' '}
    <a href={STELLAR_APEX_GOYA_URL} target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 800 }}>
      Stellar Apex · GOYA HACK
    </a>
    . Stellar elige a los ganadores ahí, además de la entrega en esta plataforma.
  </p>
)

const metaPorNombre = (name: string) => {
  const key = name.trim().toLowerCase()
  const alias: Record<string, string> = {
    innovación: 'contenido',
    innovacion: 'contenido',
    contenido: 'contenido',
    ai: 'ai',
    blockchain: 'blockchain',
  }
  const id = alias[key] ?? HACKATHON_TRACKS.find((t) => t.name.toLowerCase() === key)?.id
  return HACKATHON_TRACKS.find((t) => t.id === id)
}

/**
 * Selector visual de tracks (AI · Blockchain · Contenido) con premio y retos.
 * Se pueden marcar uno o más. Usa los UUIDs de `hackathon_tracks`.
 */
const TrackPicker: React.FC<Props> = ({ tracks, value, onChange, allowEmpty, disabled }) => {
  if (tracks.length === 0) {
    return (
      <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0 }}>
        Cargando tracks…
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {allowEmpty && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange([])}
          aria-pressed={value.length === 0}
          style={{
            textAlign: 'left',
            background: value.length === 0 ? 'rgba(233,175,60,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${value.length === 0 ? GOLD : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 12,
            padding: '0.75rem 1rem',
            color: '#cbd5e1',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.86rem',
          }}
        >
          Sin definir aún — lo elijo al entregar
        </button>
      )}
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
        Puedes elegir uno o más tracks.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
        }}
      >
        {tracks.map((t) => {
          const meta = metaPorNombre(t.name)
          const on = value.includes(t.id)
          return (
            <button
              key={t.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(on ? value.filter((id) => id !== t.id) : [...value, t.id])}
              aria-pressed={on}
              style={{
                textAlign: 'left',
                background: on ? 'rgba(233,175,60,0.16)' : 'rgba(15,23,42,0.65)',
                border: `1.5px solid ${on ? GOLD : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 14,
                padding: '1rem 1.05rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s, background 0.2s',
                boxShadow: on ? '0 0 24px rgba(233,175,60,0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontFamily: "'Chakra Petch', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: on ? GOLD : '#fff',
                    letterSpacing: 0.3,
                  }}
                >
                  {t.name}
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
              {meta?.premio.etiqueta && (
                <p
                  style={{
                    margin: '8px 0 0',
                    fontFamily: 'monospace',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: GOLD,
                  }}
                >
                  {meta.premio.monto}
                </p>
              )}
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {meta?.description || t.description}
              </p>
              {meta?.premio.detalle && (
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.72rem', lineHeight: 1.45 }}>
                  {meta.premio.detalle}
                </p>
              )}
              {meta && meta.retos.length > 0 && (
                <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.7rem' }}>
                  Retos: {meta.retos.map((r) => r.nombre).join(' · ')}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TrackPicker
