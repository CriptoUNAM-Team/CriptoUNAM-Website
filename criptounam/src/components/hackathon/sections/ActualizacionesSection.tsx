import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faCircleExclamation, faBell } from '@fortawesome/free-solid-svg-icons'
import {
  actualizacionesOrdenadas,
  ACTUALIZACION_TIPO_LABEL,
  type ActualizacionTipo,
} from '../../../data/actualizacionesHackathon'
import Seccion from './Seccion'

const ESTILO_TIPO: Record<ActualizacionTipo, { color: string; icon: typeof faBullhorn }> = {
  anuncio: { color: '#22d3ee', icon: faBullhorn },
  importante: { color: '#F4D03F', icon: faCircleExclamation },
  recordatorio: { color: '#a78bfa', icon: faBell },
}

const fechaCorta = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const ActualizacionesSection: React.FC = () => {
  const items = actualizacionesOrdenadas()
  if (items.length === 0) return null

  return (
    <Seccion
      id="actualizaciones"
      eyebrow="Novedades"
      titulo="Últimas actualizaciones"
      sub="Aquí publicamos cambios de sede, horarios y anuncios durante el evento."
    >
      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map((a, i) => {
          const estilo = ESTILO_TIPO[a.tipo]
          // Los enlaces internos usan Link para no recargar la SPA.
          const esInterno = a.url?.startsWith('/')

          return (
            <article
              key={a.id}
              className="hack-card hack-reveal"
              style={{ '--i': i } as React.CSSProperties}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: '0.6rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: estilo.color,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  <FontAwesomeIcon icon={estilo.icon} />
                  {ACTUALIZACION_TIPO_LABEL[a.tipo]}
                </span>
                <time dateTime={a.fecha} style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {fechaCorta(a.fecha)}
                </time>
              </div>

              <h3
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#fff',
                  fontSize: '1rem',
                  margin: '0 0 0.45rem',
                }}
              >
                {a.titulo}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                {a.contenido}
              </p>

              {a.url &&
                (esInterno ? (
                  <Link
                    to={a.url}
                    style={{
                      display: 'inline-block',
                      marginTop: '0.75rem',
                      color: '#D4AF37',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                    }}
                  >
                    {a.urlLabel ?? 'Ver más'} →
                  </Link>
                ) : (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '0.75rem',
                      color: '#D4AF37',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                    }}
                  >
                    {a.urlLabel ?? 'Ver más'} →
                  </a>
                ))}
            </article>
          )
        })}
      </div>
    </Seccion>
  )
}

export default ActualizacionesSection
