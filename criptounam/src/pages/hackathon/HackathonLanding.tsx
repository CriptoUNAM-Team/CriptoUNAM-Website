import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { HACKATHON_INFO, HACKATHON_TRACKS, DORAHACKS_URL } from '../../data/hackathonInfo'
import { Card, Chip, GOLD } from '../../components/hackathon/ui'
import DoraHacksCTA from '../../components/hackathon/DoraHacksCTA'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faRocket,
  faBrain,
  faLeaf,
  faTrophy,
  faClock,
  faCoins,
  faLightbulb,
  faCode,
  faExternalLinkAlt,
  faAward,
  faArrowRight,
  faGavel,
  faCheckCircle,
  faBook,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons'
import { GUIA_SOPORTE } from '../../data/guiaHacker'

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
  <div style={{ textAlign: 'center', minWidth: 64, background: 'rgba(0,0,0,0.4)', padding: '8px 6px', borderRadius: 10, border: '1px solid rgba(212,175,55,0.25)' }}>
    <div
      style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '1.8rem',
        fontWeight: 800,
        color: GOLD,
        lineHeight: 1,
      }}
    >
      {String(value).padStart(2, '0')}
    </div>
    <div style={{ color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
  </div>
)

const HackathonLanding: React.FC = () => {
  const c = useCountdown(HACKATHON_INFO.startsAt)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const trackIcons = [faBrain, faCode, faLeaf]

  return (
    <HackathonLayout wide={true}>
      <SEOHead
        title="Hackathon UNAM 2026 · AI & Blockchain (72 Horas)"
        description="72 horas intensivas de desarrollo en AI & Blockchain en la Facultad de Ingeniería UNAM durante la Semana DIE. Becas, incubación y premios por confirmar."
        url="https://criptounam.xyz/hackathon"
      />

      {/* ============================================================
          DEVPOST / DORAHACKS STYLE FULL-WIDTH HERO BANNER
          ============================================================ */}
      <Card
        glow
        style={{
          padding: isMobile ? '1.25rem 1rem' : 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(16,16,24,0.96) 60%, rgba(30,30,50,0.95) 100%)',
          border: '1.5px solid rgba(212,175,55,0.45)',
          borderRadius: isMobile ? 18 : 24,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: isMobile ? 10 : 16, marginBottom: isMobile ? '1rem' : '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 14, flexWrap: 'wrap' }}>
            <img src="/images/semanadie/escudofi_azul-modified.png" alt="Facultad de Ingeniería UNAM" style={{ height: isMobile ? 36 : 46, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.4))' }} />
            <Chip style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', padding: isMobile ? '3px 8px' : '4px 10px' }}>{HACKATHON_INFO.event}</Chip>
            <span className="puma-chip puma-chip--blue" style={{ fontSize: isMobile ? '0.68rem' : '0.75rem', fontWeight: 700, padding: isMobile ? '3px 8px' : '4px 10px' }}>⚡ 72 HORAS INTENSIVAS</span>
            <span className="puma-chip puma-chip--gold" style={{ fontSize: isMobile ? '0.68rem' : '0.75rem', fontWeight: 700, padding: isMobile ? '3px 8px' : '4px 10px' }}>🏆 AI & BLOCKCHAIN</span>
          </div>
          <img src="/images/semanadie/LogoSemanaDIE.png" alt="Semana DIE" style={{ height: isMobile ? 30 : 40, objectFit: 'contain' }} />
        </div>

        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(2.1rem, 5vw, 3.5rem)',
            color: '#fff',
            margin: '0 0 0.85rem',
            lineHeight: 1.12,
            fontWeight: 900,
          }}
        >
          Hackathon <span style={{ color: GOLD }}>UNAM</span> 2026
        </h1>
        <p style={{ color: '#cbd5e1', maxWidth: 780, fontSize: 'clamp(1.05rem, 2.5vw, 1.2rem)', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
          <strong>Builders en una sala, solucionando problemas reales.</strong> 72 horas continuas de innovación, desarrollo de agentes de Inteligencia Artificial y contratos inteligentes Web3 en la <strong>Facultad de Ingeniería UNAM</strong> durante la <strong>Semana DIE</strong>.
        </p>

        {/* Quick Pills */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            color: '#cbd5e1',
            fontSize: '0.92rem',
          }}
        >
          <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: GOLD }} />
            <strong>21–24 Septiembre 2026</strong>
          </span>
          <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD }} />
            <strong>{HACKATHON_INFO.location}</strong>
          </span>
          <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '8px 16px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faClock} style={{ color: '#60A5FA' }} />
            <strong>72 Horas de Desarrollo</strong>
          </span>
          <span style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid #F4D03F', padding: '8px 16px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 8, color: '#F4D03F' }}>
            <FontAwesomeIcon icon={faCoins} />
            <strong>{HACKATHON_INFO.prizePool}</strong>
          </span>
        </div>
      </Card>

      {/* ============================================================
          2-COLUMN DEVPOST / DORAHACKS HYBRID GRID
          ============================================================ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2.5rem',
          alignItems: 'flex-start',
        }}
      >
        {/* LEFT COLUMN: OVERVIEW, TRACKS, TIMELINE, CRITERIA, GALLERY */}
        <div style={{ flex: '1 1 680px', minWidth: 0 }}>
          
          {/* ABOUT THE CHALLENGE (OVERVIEW - COMPACT & PROFESSIONAL) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.45rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faLightbulb} style={{ color: GOLD }} /> Sobre el Reto (Overview)
            </h2>
            <Card glow style={{ background: 'linear-gradient(135deg, rgba(20,20,32,0.85) 0%, rgba(15,15,22,0.95) 100%)', border: '1px solid rgba(212,175,55,0.35)', padding: '1.25rem 1.4rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#fff' }}>
                <strong>72 horas intensivas non-stop</strong> en la <strong>Facultad de Ingeniería UNAM</strong> durante la <strong>Semana DIE</strong> para resolver problemas reales combinando Inteligencia Artificial y tecnología Web3.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.65rem 0.85rem', borderRadius: 12 }}>
                  <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>🤖 Agentes de IA</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Automatización y LLMs autónomos.</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.65rem 0.85rem', borderRadius: 12 }}>
                  <div style={{ color: '#60A5FA', fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>⚡ Avalanche Web3</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Smart Contracts, DeFi y dApps veloces.</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.65rem 0.85rem', borderRadius: 12 }}>
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>🏆 +$50k MXN en Premios</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Becas, constancias e incubación.</div>
                </div>
              </div>
            </Card>
          </section>

          {/* TRACKS OFICIALES */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.45rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faCode} style={{ color: GOLD }} /> Tracks y Retos Oficiales
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {HACKATHON_TRACKS.map((track, i) => (
                <Card key={track.id} style={{ background: 'rgba(25,25,38,0.75)', border: '1px solid rgba(212,175,55,0.3)', padding: '1.35rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(0,0,0,0.6))',
                      border: '1px solid #F4D03F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: GOLD,
                      fontSize: '1.4rem',
                      flexShrink: 0,
                    }}
                  >
                    <FontAwesomeIcon icon={trackIcons[i]} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: '0.3rem' }}>
                      <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem', fontFamily: 'Orbitron' }}>{track.name}</h3>
                      <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.7rem' }}>Prize Pool Elegible</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>{track.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* TIMELINE 72 HORAS */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: '0.9rem' }}>
              <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.45rem', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: GOLD }} /> Agenda & Timeline
              </h2>
              <span style={{ fontSize: '0.75rem', background: 'rgba(244,208,63,0.12)', color: GOLD, border: '1px solid rgba(244,208,63,0.3)', padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                ⏳ Fechas exactas por confirmar
              </span>
            </div>
            <Card style={{ padding: '1.5rem', background: 'rgba(18,18,26,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                {[
                  { title: 'Fase 1: Pre-Registro y Formación de Equipos', date: '15 Julio – 20 Septiembre 2026', desc: 'Registro abierto en DoraHacks. Arma tu equipo ahí mismo y asiste a los talleres virtuales de pre-hackathon.', status: 'Activo' },
                  { title: 'Fase 2: Kickoff & Inauguración (Semana DIE)', date: 'Septiembre 2026 (Por Confirmar)', desc: 'Ceremonia de apertura en el Auditorio de la Facultad de Ingeniería. Revelación de retos patrocinados y arranque del reloj.', status: 'Por Confirmar' },
                  { title: 'Fase 3: 72 Horas de Hacking Intensivo', date: 'Septiembre 2026 (Por Confirmar)', desc: 'Desarrollo continuo non-stop, talleres técnicos de IA y Avalanche, y mentorías personalizadas 1 a 1 con arquitectos Web3.', status: 'Por Confirmar' },
                  { title: 'Fase 4: Entrega de BUIDLs (Submission Deadline)', date: 'Septiembre 2026 (Por Confirmar)', desc: 'Entrega en DoraHacks: repositorio de GitHub, contrato desplegado y video demo del proyecto.', status: 'Por Confirmar' },
                  { title: 'Fase 5: Pitch Final y Premiación en Vivo', date: 'Septiembre 2026 (Por Confirmar)', desc: 'Presentación final de 5 minutos ante jurado de expertos y ceremonia formal de premiación en la Semana DIE.', status: 'Por Confirmar' },
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: idx < 4 ? '1.1rem' : 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: idx === 0 ? '#F4D03F' : 'rgba(255,255,255,0.08)', color: idx === 0 ? '#0a0a0a' : '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0, marginTop: 2 }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        <h4 style={{ color: '#fff', margin: '0 0 3px', fontSize: '1rem' }}>{step.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: idx === 0 ? '#4ADE80' : '#F4D03F', fontWeight: 600 }}>{step.date}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0', lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* CRITERIOS DE EVALUACIÓN (REVAMPED VISUALLY WITHOUT %) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.45rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faGavel} style={{ color: GOLD }} /> Criterios de Evaluación
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {[
                { title: 'Implementación Técnica', desc: 'Calidad limpia del código, solidez arquitectónica, dificultad técnica e integración funcional de LLMs, agentes o smart contracts.', icon: faCode, tone: '#F4D03F', bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.35)' },
                { title: 'Innovación y Creatividad', desc: 'Diferenciación notable, originalidad en la solución propuesta y resolución creativa para un reto complejo del ecosistema.', icon: faLightbulb, tone: '#60A5FA', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.35)' },
                { title: 'Impacto Social & Usabilidad', desc: 'Relevancia directa para la sociedad, sustentabilidad, beneficios para la comunidad UNAM y excelente experiencia de usuario (UX/UI).', icon: faUsers, tone: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.35)' },
                { title: 'Demo Funcional y Pitch', desc: 'Demostración contundente en vivo de un MVP operando sin fallos y claridad expositiva al transmitir la visión de negocio.', icon: faRocket, tone: '#F4D03F', bg: 'rgba(244,208,63,0.08)', border: 'rgba(244,208,63,0.35)' },
              ].map((c, i) => (
                <Card key={i} glow style={{ background: c.bg, border: `1.5px solid ${c.border}`, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.6rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,0,0,0.4)', border: `1px solid ${c.tone}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.tone, fontSize: '0.95rem' }}>
                      <FontAwesomeIcon icon={c.icon} />
                    </div>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1.02rem', fontFamily: 'Orbitron', fontWeight: 800 }}>{c.title}</h4>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.86rem', margin: 0, lineHeight: 1.55 }}>{c.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* GALERÍA SEDE Y COMUNIDAD */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.45rem', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faAward} style={{ color: GOLD }} /> Sede Presencial & Comunidad
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { img: '/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg', title: 'Facultad de Ingeniería UNAM', desc: 'Espacio de innovación e ingeniería en Ciudad Universitaria.' },
                { img: '/images/semanadie/sponsorship/hackathon-unamxhacks.png', title: 'Comunidad Hacker en Vivo', desc: '72 horas de mentoreo intensivo y hacking colaborativo.' },
                { img: '/images/semanadie/sponsorship/auditorio-conferencia.png', title: 'Conferencias & Workshops', desc: 'Charlas magistrales con referentes de AI, Web3 e Impacto.' },
                { img: '/images/semanadie/sponsorship/equipo-edificio-a.png', title: 'Networking & Premiación', desc: 'Premios en efectivo, becas y constancias curriculares.' },
              ].map((item, idx) => (
                <Card key={idx} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <div style={{ height: 155, width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ color: '#fff', margin: '0 0 5px', fontSize: '1rem', fontFamily: 'Orbitron' }}>{item.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </div>

        {/* ============================================================
            RIGHT SIDEBAR COLUMN: DEVPOST / DORAHACKS STICKY PANEL
            (CENTERED ON MOBILE WHEN WRAPPED)
            ============================================================ */}
        <div
          style={{
            flex: '0 0 clamp(300px, 100%, 360px)',
            position: isMobile ? 'static' : 'sticky',
            top: '2rem',
            margin: isMobile ? '0 auto' : '0',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '460px' : '360px',
            alignSelf: isMobile ? 'center' : 'flex-start',
          }}
        >
          
          <Card
            glow
            style={{
              padding: '1.6rem',
              background: 'linear-gradient(180deg, rgba(26,26,38,0.95) 0%, rgba(15,15,22,0.98) 100%)',
              border: '1.5px solid #F4D03F',
              borderRadius: 20,
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              marginBottom: '1.5rem',
            }}
          >
            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ color: DORAHACKS_URL ? '#4ADE80' : '#94a3b8', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FontAwesomeIcon icon={DORAHACKS_URL ? faCheckCircle : faClock} />{' '}
                  {DORAHACKS_URL ? 'Registro Abierto' : 'Registro por abrir'}
                </span>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginTop: 4 }}>
                  72 Horas AI & Web3
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#888', fontSize: '0.72rem' }}>FORMATO</span>
                <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.85rem' }}>Presencial / Híbrido</div>
              </div>
            </div>

            {/* Countdown Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: 8, textAlign: 'center' }}>
                ⏱️ TIEMPO PARA INICIO (KICKOFF)
              </div>
              {!c.ended ? (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <CountBox value={c.days} label="días" />
                  <CountBox value={c.hours} label="horas" />
                  <CountBox value={c.mins} label="min" />
                  <CountBox value={c.secs} label="seg" />
                </div>
              ) : (
                <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #4ADE80', padding: '10px', borderRadius: 10, textAlign: 'center', color: '#4ADE80', fontWeight: 700 }}>
                  ⚡ ¡HACKATHON EN CURSO! 72 HORAS
                </div>
              )}
            </div>

            {/* Key Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Prize Pool:</span>
                <span style={{ color: '#F4D03F', fontWeight: 700 }}>Premios por confirmar + PUMA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Deadline Submission:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>24 Sep 2026 @ 09:00 AM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Tamaño de Equipo:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>1 a 5 Hackers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Costo de Inscripción:</span>
                <span style={{ color: '#4ADE80', fontWeight: 700 }}>100% Gratuito</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Registro y entrega:</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>DoraHacks</span>
              </div>
            </div>

            {/* CTAs — el registro y la entrega viven en DoraHacks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.25rem' }}>
              <DoraHacksCTA block />
              <Link
                to="/hackathon/guia"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '0.8rem',
                  borderRadius: 12,
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faBook} /> Guía del Hacker
              </Link>
              <Link
                to="/hackathon/talleres"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: GOLD,
                  padding: '0.8rem',
                  borderRadius: 12,
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} /> Talleres virtuales
              </Link>
            </div>

            {/* Tags */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: 8, textTransform: 'uppercase' }}>HACKATHON TAGS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['AI', 'Autonomous Agents', 'Blockchain', 'Avalanche', 'DeFi', 'Social Good', 'Semana DIE', 'UNAM'].map((tag) => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', color: '#cbd5e1' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Help Box */}
          <Card style={{ padding: '1.25rem', background: 'rgba(20,20,30,0.6)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <h4 style={{ color: '#fff', margin: '0 0 6px', fontSize: '0.95rem' }}>¿Dudas o necesitas mentoría?</h4>
            <p style={{ color: '#888', fontSize: '0.82rem', margin: '0 0 12px' }}>
              {GUIA_SOPORTE.descripcion}
            </p>
            <a
              href={GUIA_SOPORTE.telegram}
              target="_blank"
              rel="noreferrer"
              style={{ color: GOLD, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Entrar al Telegram de CriptoUNAM <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </Card>

        </div>
      </div>
    </HackathonLayout>
  )
}

export default HackathonLanding
