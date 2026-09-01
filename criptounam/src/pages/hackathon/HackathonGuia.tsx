import React from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { Card, GOLD } from '../../components/hackathon/ui'
import RegistroCTA from '../../components/hackathon/RegistroCTA'
import { GUIA_SECTIONS, GUIA_RECURSOS, GUIA_SOPORTE, type GuiaSection } from '../../data/guiaHacker'
import { HACKATHON_INFO } from '../../data/hackathonInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faRocket,
  faCode,
  faUpload,
  faMicrophone,
  faShieldHalved,
  faExternalLinkAlt,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'

const ICONS: Record<GuiaSection['icon'], IconDefinition> = {
  rocket: faRocket,
  code: faCode,
  upload: faUpload,
  microphone: faMicrophone,
  shield: faShieldHalved,
}

/**
 * Guía del Hacker: cinco respuestas y los enlaces, sin más.
 *
 * Tuvo checklist con progreso guardado, filtro por track, índice fijo con
 * scroll-spy y secciones plegables. Todo eso pedía trabajo a quien solo venía a
 * resolver una duda, y el contenido que sostenía era una receta paso a paso que
 * decidía el proyecto por los equipos. Se quitaron las dos cosas: la página es
 * ahora un texto que se lee de un tirón.
 */
const HackathonGuia: React.FC = () => (
  <HackathonLayout>
    <SEOHead
      title="Guía del Hacker · Hackathon UNAM 2026"
      description="Cómo funciona Goya Hack: equipos, qué llevar, qué se entrega y cómo se califica."
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
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: '#fff',
          margin: '0 0 0.75rem',
          fontWeight: 900,
        }}
      >
        Guía del <span style={{ color: GOLD }}>Hacker</span>
      </h1>
      <p
        style={{
          color: '#cbd5e1',
          maxWidth: 720,
          fontSize: '1.02rem',
          lineHeight: 1.6,
          margin: '0 0 1.25rem',
        }}
      >
        Lo que hay que saber para llegar a las {HACKATHON_INFO.horas} horas sin sorpresas: cómo
        funciona el evento, qué se entrega y cómo se califica. Lo que construyas y con qué lo
        construyas es cosa tuya.
      </p>
      <RegistroCTA />
    </Card>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {GUIA_SECTIONS.map((section) => (
        <Card key={section.id} id={section.id} style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.7rem' }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
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
            </span>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontFamily: 'Chakra Petch' }}>
              {section.title}
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.7, margin: 0 }}>
            {section.texto}
          </p>
        </Card>
      ))}
    </div>

    <Card style={{ marginTop: '1rem', padding: '1.4rem' }}>
      <h2
        style={{
          color: '#fff',
          margin: '0 0 0.9rem',
          fontSize: '1.1rem',
          fontFamily: 'Chakra Petch',
        }}
      >
        Por dónde empezar
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {GUIA_RECURSOS.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: GOLD,
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid rgba(212,175,55,0.35)',
              borderRadius: 999,
              padding: '6px 14px',
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
    </Card>

    <Card style={{ marginTop: '1rem', padding: '1.35rem', textAlign: 'center' }}>
      <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.05rem', fontFamily: 'Chakra Petch' }}>
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
