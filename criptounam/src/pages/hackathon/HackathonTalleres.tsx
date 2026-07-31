import React from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { Card, GOLD } from '../../components/hackathon/ui'
import {
  talleresProximos,
  talleresGrabados,
  LUMA_CALENDAR_URL,
  type TallerHackathon,
} from '../../data/talleresHackathon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardTeacher,
  faCalendarAlt,
  faVideo,
  faExternalLinkAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

const TAG_COLORS: Record<NonNullable<TallerHackathon['tag']>, string> = {
  IA: '#60A5FA',
  Web3: '#F4D03F',
  Producto: '#34d399',
  General: '#a78bfa',
}

const TallerCard: React.FC<{ taller: TallerHackathon }> = ({ taller }) => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <iframe
      src={`https://luma.com/embed/event/${taller.lumaEventId}/simple`}
      title={taller.title}
      style={{ width: '100%', height: 420, border: 'none', display: 'block', background: '#fff' }}
      allow="fullscreen; payment"
    />
    <div style={{ padding: '1.1rem 1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.02rem', fontFamily: 'Orbitron' }}>
          {taller.title}
        </h3>
        {taller.tag && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: TAG_COLORS[taller.tag],
              border: `1px solid ${TAG_COLORS[taller.tag]}`,
              borderRadius: 999,
              padding: '2px 9px',
            }}
          >
            {taller.tag}
          </span>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          color: '#94a3b8',
          fontSize: '0.82rem',
          marginBottom: taller.description ? 8 : 0,
        }}
      >
        <span>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ color: GOLD, marginRight: 6 }} />
          {taller.date}
        </span>
        {taller.ponente && (
          <span>
            <FontAwesomeIcon icon={faUser} style={{ color: GOLD, marginRight: 6 }} />
            {taller.ponente}
          </span>
        )}
      </div>
      {taller.description && (
        <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
          {taller.description}
        </p>
      )}
    </div>
  </Card>
)

const HackathonTalleres: React.FC = () => {
  const proximos = talleresProximos()
  const grabados = talleresGrabados()
  const vacio = proximos.length === 0 && grabados.length === 0

  return (
    <HackathonLayout>
      <SEOHead
        title="Talleres virtuales · Hackathon UNAM 2026"
        description="Talleres virtuales rumbo al Hackathon UNAM 2026: IA, agentes autónomos y desarrollo en Avalanche. Transmisiones y grabaciones."
        url="https://criptounam.xyz/hackathon/talleres"
      />

      <Card
        glow
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.25rem)',
          marginBottom: '1.75rem',
          background: 'linear-gradient(135deg, rgba(96,165,250,0.14) 0%, rgba(16,16,24,0.96) 65%)',
          border: '1.5px solid rgba(212,175,55,0.4)',
        }}
      >
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#fff',
            margin: '0 0 0.75rem',
            fontWeight: 900,
          }}
        >
          Talleres <span style={{ color: GOLD }}>virtuales</span>
        </h1>
        <p style={{ color: '#cbd5e1', maxWidth: 720, fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
          Sesiones en línea rumbo al hackathon: IA y agentes, desarrollo en Avalanche y preparación
          del pitch. Se transmiten en vivo y quedan grabadas. El registro de cada taller es en Luma.
        </p>
        {LUMA_CALENDAR_URL && (
          <a
            href={LUMA_CALENDAR_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: '1.1rem',
              color: GOLD,
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              border: `1px solid ${GOLD}`,
              borderRadius: 10,
              padding: '0.6rem 1.1rem',
            }}
          >
            Ver calendario completo <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
          </a>
        )}
      </Card>

      {vacio && (
        <Card style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: GOLD, fontSize: '1.8rem', marginBottom: 12 }} />
          <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.05rem', fontFamily: 'Orbitron' }}>
            Calendario en preparación
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
            Estamos cerrando fechas y ponentes de los talleres rumbo al hackathon. Anunciaremos cada
            sesión en el Telegram de CriptoUNAM y aquí mismo.
          </p>
        </Card>
      )}

      {proximos.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: 'Orbitron',
              color: '#fff',
              fontSize: '1.35rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: GOLD }} /> Próximos talleres
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.2rem' }}>
            {proximos.map((taller) => (
              <TallerCard key={taller.id} taller={taller} />
            ))}
          </div>
        </section>
      )}

      {grabados.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: 'Orbitron',
              color: '#fff',
              fontSize: '1.35rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <FontAwesomeIcon icon={faVideo} style={{ color: GOLD }} /> Talleres pasados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.2rem' }}>
            {grabados.map((taller) => (
              <TallerCard key={taller.id} taller={taller} />
            ))}
          </div>
        </section>
      )}
    </HackathonLayout>
  )
}

export default HackathonTalleres
