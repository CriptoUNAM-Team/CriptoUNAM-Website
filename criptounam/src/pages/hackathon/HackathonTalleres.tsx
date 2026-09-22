import React from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { Card, GOLD } from '../../components/hackathon/ui'
import {
  talleresProximos,
  LUMA_CALENDAR_URL,
  LUMA_CALENDAR_EMBED_URL,
  type TallerHackathon,
} from '../../data/talleresHackathon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardTeacher,
  faCalendarAlt,
  faExternalLinkAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

const TAG_COLORS: Record<NonNullable<TallerHackathon['tag']>, string> = {
  IA: '#60A5FA',
  Web3: '#F4D03F',
  Producto: '#34d399',
  General: '#a78bfa',
}

const HackathonTalleres: React.FC = () => {
  const proximos = talleresProximos()

  return (
    <HackathonLayout>
      <SEOHead
        title="Talleres · Hackathon UNAM 2026"
        description="Calendario de talleres GOYA HACK en Luma: Stellar, Pollar, Avalanche, APEX y más."
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
            fontFamily: "'Chakra Petch', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#fff',
            margin: '0 0 0.75rem',
            fontWeight: 900,
          }}
        >
          Talleres <span style={{ color: GOLD }}>del programa</span>
        </h1>
        <p style={{ color: '#cbd5e1', maxWidth: 720, fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
          Calendario oficial en Luma: inscripción y recordatorios por sesión. Stellar, Pollar,
          Avalanche, modelo de negocio, APEX y GrantFox.
        </p>
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
          Abrir en Luma <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
        </a>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: '1.75rem' }}>
        <iframe
          src={LUMA_CALENDAR_EMBED_URL}
          title="Calendario GOYA HACK · Luma"
          width="100%"
          height={520}
          style={{
            width: '100%',
            height: 520,
            border: 'none',
            display: 'block',
            background: '#fff',
          }}
          allow="fullscreen; payment"
        />
      </Card>

      {proximos.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: 'Chakra Petch',
              color: '#fff',
              fontSize: '1.2rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: GOLD }} /> Sesiones del
            calendario
          </h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {proximos.map((taller) => (
              <Card key={taller.id} style={{ padding: '1rem 1.15rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontFamily: 'Chakra Petch' }}>
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
                    marginTop: 6,
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
                  <a
                    href={`https://luma.com/event/${taller.lumaEventId}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}
                  >
                    Inscribirse <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.65rem' }} />
                  </a>
                </div>
                {taller.description && (
                  <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.55, margin: '8px 0 0' }}>
                    {taller.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </HackathonLayout>
  )
}

export default HackathonTalleres
