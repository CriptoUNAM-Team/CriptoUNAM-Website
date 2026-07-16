import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { HACKATHON_INFO, HACKATHON_TRACKS } from '../../services/hackathon.service'
import { Card, Button, Chip, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faRocket,
  faBrain,
  faLeaf,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'

function useCountdown(target: string) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, new Date(target).getTime() - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return { days, hours, mins, secs, ended: diff === 0 }
}

const CountBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: 'center', minWidth: 68 }}>
    <div
      style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '2.2rem',
        fontWeight: 800,
        color: GOLD,
        lineHeight: 1,
      }}
    >
      {String(value).padStart(2, '0')}
    </div>
    <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
  </div>
)

const HackathonLanding: React.FC = () => {
  const navigate = useNavigate()
  const { isConnected, connectWallet, ready } = useWallet()
  const c = useCountdown(HACKATHON_INFO.startsAt)

  const handleCta = () => {
    if (isConnected) navigate('/hackathon/dashboard')
    else connectWallet()
  }

  const trackIcons = [faBrain, faLeaf]

  return (
    <HackathonLayout>
      <SEOHead
        title="Hackathon UNAM 2026 · CriptoUNAM"
        description="Hackathon organizado por CriptoUNAM y la Facultad de Ingeniería en la Semana DIE. 21–24 de septiembre 2026. Tracks: AI & Blockchain y Track Libre."
        url="https://criptounam.xyz/hackathon"
      />

      {/* Hero */}
      <Card glow style={{ padding: '2.5rem 1.75rem', textAlign: 'center', marginBottom: '2rem' }}>
        <Chip>{HACKATHON_INFO.event}</Chip>
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: '#fff',
            margin: '1rem 0 0.5rem',
            lineHeight: 1.1,
          }}
        >
          Hackathon <span style={{ color: GOLD }}>UNAM</span> 2026
        </h1>
        <p style={{ color: '#cbd5e1', maxWidth: 640, margin: '0 auto 1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          48 horas para construir con AI, Blockchain o crear soluciones de impacto social y ambiental.
          Organizado por CriptoUNAM y la Facultad de Ingeniería.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginBottom: '1.75rem',
          }}
        >
          <span>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: GOLD, marginRight: 6 }} />
            21–24 septiembre 2026
          </span>
          <span>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD, marginRight: 6 }} />
            {HACKATHON_INFO.location}
          </span>
        </div>

        {!c.ended ? (
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '1.75rem',
            }}
          >
            <CountBox value={c.days} label="días" />
            <CountBox value={c.hours} label="horas" />
            <CountBox value={c.mins} label="min" />
            <CountBox value={c.secs} label="seg" />
          </div>
        ) : (
          <p style={{ color: GOLD, fontWeight: 700, marginBottom: '1.5rem' }}>¡El hackathon está en marcha! 🚀</p>
        )}

        <Button onClick={handleCta} disabled={!ready} style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
          <FontAwesomeIcon icon={faRocket} style={{ marginRight: 8 }} />
          {isConnected ? 'Ir a mi panel' : 'Inscríbete ahora'}
        </Button>
        {!isConnected && (
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 12 }}>
            Ingresa con tu correo — creamos tu cuenta y wallet automáticamente.
          </p>
        )}
      </Card>

      {/* Tracks */}
      <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Tracks</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: '2.5rem',
        }}
      >
        {HACKATHON_TRACKS.map((track, i) => (
          <Card key={track.id}>
            <FontAwesomeIcon icon={trackIcons[i]} style={{ color: GOLD, fontSize: '1.6rem', marginBottom: 10 }} />
            <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.15rem' }}>{track.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>{track.description}</p>
          </Card>
        ))}
      </div>

      {/* Cómo funciona */}
      <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>
        ¿Cómo participar?
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {[
          { icon: faRocket, t: '1. Inscríbete', d: 'Regístrate con tu correo y completa tu perfil de hacker.' },
          { icon: faUsers, t: '2. Arma equipo', d: 'Crea tu equipo o únete a uno que busque tu perfil.' },
          { icon: faBrain, t: '3. Construye', d: 'Desarrolla tu proyecto en el track que elijas.' },
          { icon: faTrophy, t: '4. Presenta', d: 'Sube tu proyecto y compite por los premios.' },
        ].map((step) => (
          <Card key={step.t}>
            <FontAwesomeIcon icon={step.icon} style={{ color: GOLD, fontSize: '1.3rem', marginBottom: 8 }} />
            <h4 style={{ color: '#fff', margin: '0 0 6px' }}>{step.t}</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{step.d}</p>
          </Card>
        ))}
      </div>
    </HackathonLayout>
  )
}

export default HackathonLanding
