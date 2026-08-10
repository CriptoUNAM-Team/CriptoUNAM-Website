import React from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { Card, GOLD } from '../../components/hackathon/ui'
import RegistroCTA from '../../components/hackathon/RegistroCTA'
import { GUIA_SECTIONS, GUIA_SOPORTE, type GuiaSection } from '../../data/guiaHacker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faRocket,
  faCode,
  faBrain,
  faCube,
  faUpload,
  faMicrophone,
  faShieldHalved,
  faBook,
  faExternalLinkAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'

const ICONS: Record<GuiaSection['icon'], IconDefinition> = {
  rocket: faRocket,
  code: faCode,
  brain: faBrain,
  cube: faCube,
  upload: faUpload,
  microphone: faMicrophone,
  shield: faShieldHalved,
  book: faBook,
}

const HackathonGuia: React.FC = () => (
  <HackathonLayout>
    <SEOHead
      title="Guía del Hacker · Hackathon UNAM 2026"
      description="Cómo prepararte para el Hackathon UNAM 2026: setup, stack de IA y Avalanche, qué se entrega en DoraHacks y cómo presentar tu pitch."
      url="https://criptounam.xyz/hackathon/guia"
    />

    <Card
      glow
      style={{
        padding: 'clamp(1.5rem, 4vw, 2.25rem)',
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(16,16,24,0.96) 65%)',
        border: '1.5px solid rgba(212,175,55,0.45)',
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
        Guía del <span style={{ color: GOLD }}>Hacker</span>
      </h1>
      <p style={{ color: '#cbd5e1', maxWidth: 720, fontSize: '1.02rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
        Todo lo que necesitas para llegar listo a las 72 horas: qué instalar, con qué construir, qué
        se entrega y cómo presentarlo. El registro y la entrega se hacen en DoraHacks.
      </p>
      <RegistroCTA />
    </Card>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.1rem' }}>
      {GUIA_SECTIONS.map((section) => (
        <Card key={section.id} id={section.id} style={{ padding: '1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: 'rgba(212,175,55,0.14)',
                border: `1px solid ${GOLD}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: GOLD,
                flexShrink: 0,
              }}
            >
              <FontAwesomeIcon icon={ICONS[section.icon]} />
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.12rem', fontFamily: 'Orbitron' }}>
              {section.title}
            </h2>
          </div>

          {section.intro && (
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 0.85rem' }}>
              {section.intro}
            </p>
          )}

          {section.items && (
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65 }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.links && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
              {section.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: GOLD,
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid rgba(212,175,55,0.35)',
                    borderRadius: 999,
                    padding: '5px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {link.label}
                  <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.65rem' }} />
                </a>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>

    <Card style={{ marginTop: '1.75rem', padding: '1.35rem', textAlign: 'center' }}>
      <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.05rem', fontFamily: 'Orbitron' }}>
        ¿Dudas durante el hackathon?
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 14px', lineHeight: 1.6 }}>
        {GUIA_SOPORTE.descripcion}
      </p>
      <a
        href={GUIA_SOPORTE.telegram}
        target="_blank"
        rel="noreferrer"
        style={{
          color: GOLD,
          fontWeight: 700,
          fontSize: '0.9rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} /> Entrar al Telegram de CriptoUNAM
      </a>
    </Card>
  </HackathonLayout>
)

export default HackathonGuia
