import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRocket, faGaugeHigh } from '@fortawesome/free-solid-svg-icons'
import { GOLD, GOLD_LIGHT } from './ui'
import { useWallet } from '../../context/WalletContext'

/**
 * Botón único de inscripción. El registro vive en la plataforma propia: sin
 * sesión abre el login de Privy, y con sesión lleva al panel, que es donde se
 * completa el alta del participante y se ve el estado del equipo y el proyecto.
 *
 * Sustituye a DoraHacksCTA, que enlazaba fuera del sitio.
 */
const RegistroCTA: React.FC<{ label?: string; block?: boolean; style?: React.CSSProperties }> = ({
  label = 'Regístrate',
  block,
  style,
}) => {
  const { ready, isConnected, connectWallet } = useWallet()

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
    border: 'none',
    cursor: 'pointer',
    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
    color: '#0a0a0a',
    boxShadow: '0 0 25px rgba(244,208,63,0.35)',
    ...style,
  }

  // Mientras Privy hidrata no sabemos si hay sesión; mostramos el CTA neutro
  // deshabilitado para no parpadear entre "Regístrate" y "Mi panel".
  if (!ready) {
    return (
      <div style={{ ...shared, opacity: 0.6, cursor: 'default' }}>
        <FontAwesomeIcon icon={faRocket} />
        {label}
      </div>
    )
  }

  if (isConnected) {
    return (
      <Link to="/hackathon/dashboard" style={shared}>
        <FontAwesomeIcon icon={faGaugeHigh} />
        Ir a mi panel
      </Link>
    )
  }

  return (
    <button type="button" onClick={connectWallet} style={shared}>
      <FontAwesomeIcon icon={faRocket} />
      {label}
    </button>
  )
}

export default RegistroCTA
