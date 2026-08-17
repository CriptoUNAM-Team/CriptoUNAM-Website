import React from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import PumaUserPanel from '../components/Puma/PumaUserPanel'
import DropCodeClaim from '../components/Puma/DropCodeClaim'
import { usePumaMissionsList, pumaTokenConfigured, isGameMission } from '../hooks/usePumaMissions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faClipboardList,
  faBolt,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const Misiones: React.FC = () => {
  const { data: missions = [], isLoading, refetch } = usePumaMissionsList()

  const nonGameMissions = missions.filter((m) => !isGameMission(m.missionId))
  const activeMissions = nonGameMissions.filter(
    (m) => m.active && Number(m.deadline) * 1000 > Date.now()
  ).length

  return (
    <>
      <SEOHead
        title="Misiones PUMA - CriptoUNAM"
        description="Misiones PUMA CriptoUNAM: tu wallet, recompensas y reclamos en un solo lugar."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/recompensas/misiones"
        type="website"
      />

      <div
        className="section"
        style={{
          minHeight: '100vh',
          paddingTop: '1.5rem',
          paddingBottom: '4rem',
          paddingLeft: 'clamp(0.75rem, 4vw, 1.25rem)',
          paddingRight: 'clamp(0.75rem, 4vw, 1.25rem)',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <PumaPausedBanner />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto 1rem' }} className="puma-fade-in">
          <Link to="/recompensas" className="puma-breadcrumb">
            <FontAwesomeIcon icon={faArrowLeft} />
            Recompensas
          </Link>
        </div>

        <header
          className="puma-hero-bg"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2rem',
            padding: '1.5rem 1rem 1rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className="puma-hero-grid" />
          <div
            className="puma-pop-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #F4D03F, #D4AF37 70%, #b8962e)',
              boxShadow: '0 10px 30px rgba(212,175,55,0.4)',
              marginBottom: '1rem',
            }}
          >
            <FontAwesomeIcon icon={faClipboardList} style={{ color: '#0a0a0a', fontSize: '1.6rem' }} />
          </div>

          <h1
            className="puma-title-glow puma-fade-in-up"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              marginBottom: '0.65rem',
              lineHeight: 1.2,
            }}
          >
            Misiones PUMA
          </h1>
          <p
            className="puma-fade-in-up"
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.65,
              animationDelay: '120ms',
            }}
          >
            Conecta tu wallet en Avalanche. Si estuviste en una sesión de embajadores, usa el{' '}
            <strong style={{ color: '#F4D03F' }}>código</strong> que te dictaron. También puedes
            reclamar misiones publicadas (una vez por wallet).
          </p>
        </header>

        <section style={{ maxWidth: 1100, margin: '0 auto 1.5rem' }}>
          <DropCodeClaim />
        </section>

        <section style={{ maxWidth: 1100, margin: '0 auto 1.5rem' }}>
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: '1rem',
            }}
          >
            <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faBolt} className="puma-stat__icon" />
              <div className="puma-stat__label">Activas ahora</div>
              <div className="puma-stat__value">{activeMissions}</div>
              <div className="puma-stat__hint">Disponibles para reclamar</div>
            </div>
            <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faClipboardList} className="puma-stat__icon" />
              <div className="puma-stat__label">Histórico</div>
              <div className="puma-stat__value">{nonGameMissions.length}</div>
              <div className="puma-stat__hint">Misiones publicadas</div>
            </div>
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
            maxWidth: 1100,
            margin: '0 auto 1.5rem',
            alignItems: 'start',
          }}
        >
          <div className="puma-fade-in-up">
            <PumaUserPanel />
          </div>
          <div className="puma-card puma-fade-in-up" style={{ animationDelay: '120ms' }}>
            <h3
              style={{
                color: '#fff',
                fontFamily: 'Chakra Petch',
                fontSize: '1.05rem',
                margin: '0 0 0.85rem',
              }}
            >
              Cómo usar esta página
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: '1.2rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                fontSize: '0.93rem',
              }}
            >
              <li style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: '#F4D03F' }}>Conecta</strong> tu wallet para ver tu saldo,
                nivel e historial PUMA.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                En sesiones, escribe el <strong style={{ color: '#F4D03F' }}>código</strong> del
                equipo (ej. embajadores-13-mayo-2026) y reclama PUMA + POAP si aplica.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: '#F4D03F' }}>Reclama</strong> cada misión activa una sola
                vez por wallet.
              </li>
              <li>
                Los $PUMA llegan a tu wallet en la misma transacción y suman experiencia para
                subir de nivel.
              </li>
            </ol>
          </div>
        </div>

        <section
          className="puma-card puma-card--featured puma-fade-in-up"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontFamily: 'Chakra Petch',
              color: '#fff',
              fontSize: 'clamp(1.1rem, 3.2vw, 1.4rem)',
              marginTop: 0,
              marginBottom: '0.65rem',
            }}
          >
            Misiones disponibles
          </h2>
          <p
            style={{
              color: '#94a3b8',
              lineHeight: 1.65,
              marginBottom: '1.25rem',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            }}
          >
            Las nuevas misiones aparecen cuando el equipo las publica. Si la red está en pausa,
            no podrás reclamar hasta que se levante.
          </p>
          {!pumaTokenConfigured && (
            <div className="puma-alert puma-alert--warn" style={{ marginBottom: '1rem' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
              <span>En esta build aún no está enlazado el contrato PUMA.</span>
            </div>
          )}
          <PumaMissionsSection
            missions={missions}
            isLoading={isLoading}
            onTxConfirmed={() => refetch()}
            tone="embajador"
          />
        </section>
      </div>
    </>
  )
}

export default Misiones
