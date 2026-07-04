import React from 'react'
import { useAccount } from 'wagmi'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faBolt,
  faTrophy,
  faTriangleExclamation,
  faWallet,
  faClipboardList,
  faGift,
  faGamepad,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import ENV_CONFIG from '../config/env'
import PageHero from '../components/PageHero'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import AddPumaToWalletButton from '../components/Puma/AddPumaToWalletButton'
import FaucetButton from '../components/Puma/FaucetButton'
import DropCodeClaim from '../components/Puma/DropCodeClaim'
import BadgeCodeClaimPanel from '../components/Puma/BadgeCodeClaimPanel'
import { usePumaMissionsList, isGameMission } from '../hooks/usePumaMissions'
import { usePumaTokenBalance } from '../hooks/usePumaTokenBalance'
import '../styles/global.css'

const Recompensas: React.FC = () => {
  const { address } = useAccount()

  const { data: missions = [], isLoading: loadingMissions, refetch: refetchMissions } =
    usePumaMissionsList()

  const {
    formatted: balanceFormatted,
    tokenConfigured,
    onExpectedChain,
    expectedChainId,
    isLoading: balanceLoading,
  } = usePumaTokenBalance()

  const nonGameMissions = missions.filter((m) => !isGameMission(m.missionId))
  const activeMissions = nonGameMissions.filter((m) => m.active && Number(m.deadline) * 1000 > Date.now()).length

  const saldoHero =
    !tokenConfigured || !address
      ? '—'
      : balanceLoading
        ? '…'
        : !onExpectedChain
          ? 'Red incorrecta'
          : balanceFormatted

  return (
    <>
      <SEOHead
        title="Recompensas - CriptoUNAM"
        description="PUMA y recompensas CriptoUNAM: misiones, cursos y eventos."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/recompensas"
        type="website"
      />

      <div
        style={{
          padding: '0.5rem clamp(0.5rem, 3vw, 1rem) 3rem',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <PumaPausedBanner />
        </div>

        {/* ============================================================
            HERO
            ============================================================ */}
        <PageHero
          icon={faCoins}
          iconColor="#F4D03F"
          iconGradient="linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)"
          eyebrow="Recompensas"
          title="$PUMA"
          description="Gánalo en misiones, talleres y trabajo con embajadores. Úsalo para inscribirte a cursos y unlocks especiales."
          accentRgba="rgba(212,175,55,0.1)"
          stats={[
            {
              icon: faCoins,
              label: 'Tu saldo PUMA',
              value: saldoHero,
              color: '#F4D03F',
            },
            {
              icon: faBolt,
              label: 'Activas',
              value: String(activeMissions),
              color: '#4ade80',
            },
            {
              icon: faTrophy,
              label: 'Totales',
              value: String(nonGameMissions.length),
              color: '#a78bfa',
            },
          ]}
        />

        {address && tokenConfigured && !onExpectedChain && (
          <div
            className="puma-alert puma-alert--warn"
            style={{ maxWidth: 960, margin: '0 auto 1.25rem' }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
            <span>
              Cambia tu wallet a Avalanche (chain {expectedChainId}) para ver el saldo real de PUMA y
              reclamar. El contrato está en{' '}
              <code style={{ color: '#fde68a' }}>{ENV_CONFIG.EXPLORER_URL}</code>.
            </span>
          </div>
        )}

        {tokenConfigured && (
          <section
            style={{
              maxWidth: 960,
              margin: '0 auto 1.5rem',
              padding: '0.85rem 1rem',
              borderRadius: 14,
              border: '1px solid rgba(212,175,55,0.22)',
              background: 'rgba(20,20,30,0.55)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '0.75rem' }}>
              <FontAwesomeIcon icon={faWallet} style={{ color: '#F4D03F', marginTop: 3 }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                  Ver $PUMA en tu wallet
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.35rem 0 0', lineHeight: 1.5 }}>
                  Tras reclamar, MetaMask no muestra el token hasta que lo importes. Usa el botón para
                  agregarlo con un clic. Las transacciones en Fuji necesitan un poco de AVAX de prueba
                  (gas); si el faucet está vacío, intenta más tarde o con otra wallet.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
                alignItems: 'center',
              }}
            >
              <AddPumaToWalletButton
                disabled={!address || !onExpectedChain}
                compact
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              />
              <FaucetButton compact style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }} />
              {!address && (
                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                  Conecta tu wallet para agregar el token.
                </span>
              )}
            </div>
          </section>
        )}

        <section
          className="puma-card puma-glow"
          style={{
            maxWidth: 1100,
            margin: '0 auto 1.5rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(212, 175, 55, 0.15))',
            border: '1.5px solid #2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                color: '#fff',
                boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)'
              }}
            >
              <FontAwesomeIcon icon={faGamepad} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontFamily: 'Orbitron', color: '#fff', margin: 0, fontSize: '1.2rem' }}>
                  🎮 Cyber Puma Runner
                </h3>
                <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.7rem' }}>¡NUEVO!</span>
              </div>
              <p style={{ color: '#cbd5e1', margin: '0.3rem 0 0', fontSize: '0.9rem', maxWidth: 600 }}>
                ¡Juega en nuestro nuevo Arcade Web3! Supera los récords esquivando obstáculos y desbloquea hasta 210 tokens $PUMA directamente al contrato inteligente.
              </p>
            </div>
          </div>
          <Link
            to="/juegos"
            className="puma-btn puma-btn--blue"
            style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' }}
          >
            Jugar Ahora 🚀
          </Link>
        </section>

        <section id="reclamos" style={{ maxWidth: 1100, margin: '0 auto 1.5rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
            <FontAwesomeIcon icon={faGift} style={{ fontSize: '1.1rem', color: '#F4D03F' }} />
            <h2
              style={{
                fontFamily: 'Orbitron',
                color: '#fff',
                fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Reclamos con código
            </h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 0.9rem', lineHeight: 1.5 }}>
            Todo se reclama aquí: sesión de embajadores (PUMA) y credenciales de curso/evento/certificación.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '1rem',
              alignItems: 'start',
            }}
          >
            <DropCodeClaim />
            <BadgeCodeClaimPanel />
          </div>
        </section>

        <section className="puma-card puma-card--featured" style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem' }}>
          <h2
            style={{
              fontFamily: 'Orbitron',
              color: '#fff',
              fontSize: 'clamp(1.1rem, 3.2vw, 1.4rem)',
              marginTop: 0,
              marginBottom: '0.65rem',
            }}
          >
            Misiones disponibles
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.65, marginBottom: '1rem', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
            Las misiones activas se publican por el equipo y se reclaman una sola vez por wallet.
          </p>
          <PumaMissionsSection
            missions={missions}
            isLoading={loadingMissions}
            onTxConfirmed={() => refetchMissions()}
            tone="embajador"
          />
        </section>
      </div>
    </>
  )
}

export default Recompensas
