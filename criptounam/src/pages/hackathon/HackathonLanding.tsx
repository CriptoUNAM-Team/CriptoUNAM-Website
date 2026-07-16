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

      {/* Hero con imágenes reales de Semana DIE */}
      <Card
        glow
        style={{
          padding: '2.5rem 1.75rem',
          textAlign: 'center',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at top, rgba(212,175,55,0.15) 0%, rgba(15,15,22,0.95) 70%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <img src="/images/semanadie/escudofi_azul-modified.png" alt="Facultad de Ingeniería UNAM" style={{ height: 48, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.4))' }} />
          <Chip>{HACKATHON_INFO.event}</Chip>
          <img src="/images/semanadie/LogoSemanaDIE.png" alt="Semana DIE" style={{ height: 38, objectFit: 'contain' }} />
        </div>

        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            color: '#fff',
            margin: '0.5rem 0 0.75rem',
            lineHeight: 1.1,
          }}
        >
          Hackathon <span style={{ color: GOLD }}>UNAM</span> 2026
        </h1>
        <p style={{ color: '#cbd5e1', maxWidth: 680, margin: '0 auto 1.5rem', fontSize: '1.08rem', lineHeight: 1.6 }}>
          48 horas intensivas de desarrollo e innovación en la <strong>Facultad de Ingeniería UNAM</strong>. Construye con AI, Blockchain o crea soluciones de impacto social y ambiental durante la <strong>Semana DIE</strong>.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            color: '#cbd5e1',
            fontSize: '0.95rem',
            marginBottom: '1.75rem',
          }}
        >
          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20 }}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: GOLD, marginRight: 8 }} />
            <strong>21–24 septiembre 2026</strong>
          </span>
          <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: 20 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD, marginRight: 8 }} />
            <strong>{HACKATHON_INFO.location}</strong>
          </span>
        </div>

        {!c.ended ? (
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            <CountBox value={c.days} label="días" />
            <CountBox value={c.hours} label="horas" />
            <CountBox value={c.mins} label="min" />
            <CountBox value={c.secs} label="seg" />
          </div>
        ) : (
          <p style={{ color: GOLD, fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.2rem' }}>¡El hackathon está en marcha! 🚀</p>
        )}

        {/* Botones de Acceso Directo */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button onClick={handleCta} disabled={!ready} style={{ padding: '0.95rem 2.4rem', fontSize: '1.05rem', boxShadow: '0 0 25px rgba(212,175,55,0.4)' }}>
            <FontAwesomeIcon icon={faRocket} style={{ marginRight: 8 }} />
            {isConnected ? 'Ir a mi panel' : 'Inscríbete ahora'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/hackathon/proyectos')}
            style={{ padding: '0.95rem 1.8rem', fontSize: '1rem', border: '1px solid rgba(212,175,55,0.5)', color: '#fff' }}
          >
            Explorar Proyectos
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/hackathon/equipos')}
            style={{ padding: '0.95rem 1.8rem', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1' }}
          >
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: 8 }} />
            Ver Equipos
          </Button>
        </div>
        {!isConnected && (
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: 10 }}>
            Ingresa con tu correo o wallet — creamos tu perfil de hacker instantáneamente sin gas.
          </p>
        )}
      </Card>

      {/* Galería visual real: Semana DIE & Facultad de Ingeniería */}
      <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>
        Sede y Comunidad · Facultad de Ingeniería
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: '2.5rem',
        }}
      >
        {[
          { img: '/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg', title: 'Facultad de Ingeniería UNAM', desc: 'Espacios de innovación e ingeniería en Ciudad Universitaria.' },
          { img: '/images/semanadie/sponsorship/hackathon-unamxhacks.png', title: 'Comunidad Hacker', desc: '48 horas de mentoreo intensivo y hacking colaborativo en vivo.' },
          { img: '/images/semanadie/sponsorship/auditorio-conferencia.png', title: 'Conferencias y Workshops', desc: 'Charlas magistrales con referentes de AI, Web3 e Impacto Social.' },
          { img: '/images/semanadie/sponsorship/equipo-edificio-a.png', title: 'Networking & Premios', desc: 'Premios en efectivo, becas y constancias curriculares on-chain.' },
        ].map((item, idx) => (
          <Card key={idx} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)' }}>
            <div style={{ height: 160, width: '100%', overflow: 'hidden', position: 'relative' }}>
              <img
                src={item.img}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
            </div>
            <div style={{ padding: '1.1rem' }}>
              <h4 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.05rem', fontFamily: 'Orbitron' }}>{item.title}</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

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
