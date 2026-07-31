import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket, faClock } from '@fortawesome/free-solid-svg-icons'
import { GOLD, GOLD_LIGHT } from './ui'
import { DORAHACKS_URL } from '../../data/hackathonInfo'

/**
 * Botón único de inscripción/entrega. Todo pasa por DoraHacks; el sitio no
 * registra participantes ni recibe proyectos.
 *
 * Sin `VITE_DORAHACKS_URL` configurada se muestra deshabilitado como
 * "próximamente" en vez de enlazar a una URL inventada.
 */
const DoraHacksCTA: React.FC<{ label?: string; block?: boolean; style?: React.CSSProperties }> = ({
  label = 'Registrarme en DoraHacks',
  block,
  style,
}) => {
  const shared: React.CSSProperties = {
    padding: '0.9rem 1.5rem',
    borderRadius: 12,
    fontWeight: 800,
    fontSize: '1rem',
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    textDecoration: 'none',
    ...style,
  }

  if (!DORAHACKS_URL) {
    return (
      <div
        style={{
          ...shared,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#94a3b8',
          cursor: 'default',
        }}
      >
        <FontAwesomeIcon icon={faClock} />
        Registro en DoraHacks — próximamente
      </div>
    )
  }

  return (
    <a
      href={DORAHACKS_URL}
      target="_blank"
      rel="noreferrer"
      style={{
        ...shared,
        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
        color: '#0a0a0a',
        boxShadow: '0 0 25px rgba(244,208,63,0.35)',
      }}
    >
      <FontAwesomeIcon icon={faRocket} />
      {label}
    </a>
  )
}

export default DoraHacksCTA
