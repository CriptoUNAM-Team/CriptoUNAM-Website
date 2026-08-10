import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useReadContract, useChainId } from 'wagmi'
import { isAddress, formatEther, zeroAddress } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWallet,
  faCoins,
  faStar,
  faAward,
  faMedal,
  faGraduationCap,
  faCalendarCheck,
  faUsers,
  faClock,
  faArrowRight,
  faTrophy,
  faExternalLinkAlt,
  faCopy,
  faCheck,
  faLock,
  faWandMagicSparkles,
  faChartLine,
  faGift,
  faFire,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEOHead'
import ProfileTutorial from '../components/ProfileTutorial'
import PerfilHackathonPanel from '../components/hackathon/PerfilHackathonPanel'
import { useWallet } from '../context/WalletContext'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi, type PumaRewardRecord } from '../constants/pumaTokenAbi'
import {
  badgesContractConfigured,
  useBadgesOf,
  resolveMetadataUrl,
  useBadgeMetadata,
} from '../hooks/useCriptoUnamBadges'
import {
  BadgeKind,
  BADGE_KIND_LABEL,
} from '../constants/criptoUnamBadgesAbi'
import {
  obtenerInscripcionesUsuario,
  obtenerPuntos,
  type InscripcionResumen,
} from '../services/progresoCurso.service'
import { cursosData, getLeccionesFlat, cursoBadgeRef } from '../constants/cursosData'
import '../styles/global.css'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const tokenConfigured = isAddress(tokenAddr) && tokenAddr !== zeroAddress
const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://arbiscan.io'

/* ============================================================
   AVATAR DETERMINISTA (sin imagen, basado en address)
   ============================================================ */
const useAvatarGradient = (address?: string) => {
  return useMemo(() => {
    if (!address) return 'linear-gradient(135deg, #94a3b8, #475569)'
    const hash = parseInt(address.slice(2, 10), 16)
    const palettes = [
      'linear-gradient(135deg, #F4D03F, #D4AF37)',
      'linear-gradient(135deg, #60a5fa, #2563eb)',
      'linear-gradient(135deg, #a78bfa, #7c3aed)',
      'linear-gradient(135deg, #4ade80, #16a34a)',
      'linear-gradient(135deg, #fb923c, #ea580c)',
      'linear-gradient(135deg, #f472b6, #db2777)',
      'linear-gradient(135deg, #38bdf8, #0284c7)',
    ]
    return palettes[hash % palettes.length]
  }, [address])
}

/* ============================================================
   BADGE CARD pequeño
   ============================================================ */
const ProfileBadgeCard: React.FC<{
  badge: { tokenId: bigint; kind: BadgeKind; ref: string; uri: string; isSoulbound: boolean }
  index: number
}> = ({ badge, index }) => {
  const { data: meta } = useBadgeMetadata(badge.uri)
  const KIND_ICON: Record<BadgeKind, typeof faAward> = {
    [BadgeKind.EventAttendance]: faCalendarCheck,
    [BadgeKind.Ambassador]: faStar,
    [BadgeKind.CourseCompletion]: faGraduationCap,
    [BadgeKind.Certification]: faAward,
  }
  return (
    <div
      className="puma-card puma-card--shimmer"
      style={{ '--i': index, padding: '0.85rem' } as React.CSSProperties}
    >
      <div
        className="puma-nft-preview"
        style={{ marginBottom: '0.75rem', borderRadius: 14 }}
      >
        {meta?.image ? (
          <img src={resolveMetadataUrl(meta.image)} alt={meta.name || badge.ref} />
        ) : (
          <FontAwesomeIcon icon={KIND_ICON[badge.kind]} className="puma-nft-preview__icon" />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexWrap: 'wrap',
          marginBottom: '0.4rem',
        }}
      >
        <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.68rem' }}>
          #{badge.tokenId.toString()}
        </span>
        {badge.isSoulbound && (
          <span className="puma-chip puma-chip--amber" style={{ fontSize: '0.68rem' }}>
            <FontAwesomeIcon icon={faLock} />
            Soulbound
          </span>
        )}
      </div>
      <h4
        style={{
          color: '#fff',
          fontSize: '0.88rem',
          margin: '0 0 0.3rem',
          lineHeight: 1.3,
        }}
      >
        {meta?.name || BADGE_KIND_LABEL[badge.kind]}
      </h4>
      <p
        style={{
          color: '#777',
          fontSize: '0.72rem',
          margin: 0,
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}
      >
        {badge.ref}
      </p>
    </div>
  )
}

/* ============================================================
   PERFIL PRINCIPAL
   ============================================================ */
const Perfil: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connectWallet } = useWallet()
  const chainId = useChainId()
  const avatarBg = useAvatarGradient(address)

  const [copied, setCopied] = useState(false)
  const copyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const [tutorialForceOpen, setTutorialForceOpen] = useState(false)
  const openTutorial = () => setTutorialForceOpen(true)
  const closeTutorial = () => setTutorialForceOpen(false)

  /* ----- PUMA on-chain ----- */
  const { data: userInfo } = useReadContract({
    address: tokenConfigured && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: { enabled: tokenConfigured && !!address },
  })
  const userTuple = userInfo as [bigint, bigint, bigint, bigint] | undefined
  const pumaBalance = userTuple?.[0] ?? 0n
  const pumaLevel = userTuple?.[1] ?? 0n
  const pumaExperience = userTuple?.[2] ?? 0n

  const { data: pumaBadgesOnChain = [] } = useReadContract({
    address: tokenConfigured && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserBadges',
    args: address ? [address] : undefined,
    query: { enabled: tokenConfigured && !!address },
  })
  const pumaBadges = pumaBadgesOnChain as string[]

  const { data: pumaRewardsOnChain = [] } = useReadContract({
    address: tokenConfigured && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserRewards',
    args: address ? [address] : undefined,
    query: { enabled: tokenConfigured && !!address },
  })
  const pumaRewards = (pumaRewardsOnChain as PumaRewardRecord[]) ?? []
  const recentRewards = [...pumaRewards].reverse().slice(0, 6)

  /* ----- NFTs CriptoUNAMBadges ----- */
  const { data: badges = [], isLoading: badgesLoading } = useBadgesOf(address)
  const badgesByKind = useMemo(() => {
    const grouped: Record<BadgeKind, typeof badges> = {
      [BadgeKind.CourseCompletion]: [],
      [BadgeKind.EventAttendance]: [],
      [BadgeKind.Ambassador]: [],
      [BadgeKind.Certification]: [],
    }
    for (const b of badges) grouped[b.kind].push(b)
    return grouped
  }, [badges])

  /* ----- Supabase: cursos + puntos ----- */
  const [puntos, setPuntos] = useState(0)
  const [inscripciones, setInscripciones] = useState<InscripcionResumen[]>([])
  const [loadingInscripciones, setLoadingInscripciones] = useState(false)

  useEffect(() => {
    if (!address) return
    obtenerPuntos(address).then(setPuntos)
    setLoadingInscripciones(true)
    obtenerInscripcionesUsuario(address)
      .then(setInscripciones)
      .finally(() => setLoadingInscripciones(false))
  }, [address])

  /* ----- Derivados ----- */
  const cursosConProgreso = useMemo(() => {
    return inscripciones
      .map((ins) => {
        const curso = cursosData.find((c) => c.id === ins.curso_id)
        if (!curso) return null
        const total = getLeccionesFlat(curso).length
        const completadas = new Set(ins.lecciones_completadas).size
        const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0
        return {
          curso,
          ins,
          total,
          completadas,
          progreso,
          badgeRef: cursoBadgeRef(curso.id, curso.cohorteRef),
        }
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
  }, [inscripciones])

  const cursosCompletados = cursosConProgreso.filter((c) => c.progreso === 100).length
  const totalSesiones = badgesByKind[BadgeKind.Ambassador].length
  const totalEventos = badgesByKind[BadgeKind.EventAttendance].length
  const totalCertNFT =
    badgesByKind[BadgeKind.CourseCompletion].length + badgesByKind[BadgeKind.Certification].length

  /* ============================================================
     NO CONECTADO
     ============================================================ */
  if (!isConnected) {
    return (
      <>
        <SEOHead
          title="Mi perfil · CriptoUNAM"
          description="Tu espacio personal en CriptoUNAM"
          image="/images/LogosCriptounam.svg"
          url="https://criptounam.xyz/perfil"
          type="website"
        />
        <div className="section" style={{ minHeight: '100vh', paddingTop: '4rem' }}>
          <div
            className="puma-card puma-card--featured puma-fade-in-up"
            style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '2.5rem 2rem' }}
          >
            <div
              className="puma-pop-in"
              style={{
                width: 80,
                height: 80,
                margin: '0 auto 1.25rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 36px rgba(212,175,55,0.4)',
              }}
            >
              <FontAwesomeIcon icon={faWallet} style={{ color: '#0a0a0a', fontSize: '2rem' }} />
            </div>
            <h2
              className="puma-title-glow"
              style={{ fontFamily: 'Orbitron', fontSize: '1.6rem', marginBottom: '0.65rem' }}
            >
              Tu perfil te espera
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Inicia sesión para acceder a tu perfil, ver tu balance $PUMA, tus credenciales NFT, cursos completados,
              sesiones de embajadores y eventos.
            </p>
            <button
              type="button"
              className="puma-btn puma-btn--gold"
              onClick={() => connectWallet()}
            >
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Acceder a mi perfil
            </button>
            <button
              type="button"
              onClick={openTutorial}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.88rem',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              }}
            >
              <FontAwesomeIcon icon={faCircleQuestion} />
              ¿Cómo funciona el perfil?
            </button>
          </div>
        </div>
        <ProfileTutorial forceOpen={tutorialForceOpen} onClose={closeTutorial} />
      </>
    )
  }

  /* ============================================================
     CONECTADO
     ============================================================ */
  return (
    <>
      <SEOHead
        title="Mi perfil · CriptoUNAM"
        description="Tus logros, NFTs, cursos y balance PUMA"
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/perfil"
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
        {/* ============================================================
            HERO
            ============================================================ */}
        <header
          className="puma-hero-bg puma-fade-in-up"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2rem',
            padding: 'clamp(1.5rem, 4vw, 2.25rem)',
            position: 'relative',
          }}
        >
          <div className="puma-hero-grid" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'clamp(1rem, 3vw, 1.75rem)',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Avatar */}
            <div
              className="puma-pop-in"
              style={{
                width: 'clamp(72px, 16vw, 110px)',
                height: 'clamp(72px, 16vw, 110px)',
                borderRadius: '50%',
                background: avatarBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Orbitron',
                color: '#0a0a0a',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
                boxShadow: '0 14px 32px rgba(0,0,0,0.5)',
                border: '3px solid rgba(255,255,255,0.15)',
                flexShrink: 0,
              }}
            >
              {address?.slice(2, 4).toUpperCase()}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginBottom: '0.6rem',
                }}
              >
                <span className="puma-chip puma-chip--gold">
                  <FontAwesomeIcon icon={faStar} />
                  Nivel {pumaLevel.toString()}
                </span>
                <span className="puma-chip puma-chip--blue">
                  Avalanche {chainId === 43114 ? 'C-Chain' : chainId === 43113 ? 'Fuji' : `chain ${chainId}`}
                </span>
              </div>

              <h1
                className="puma-title-glow"
                style={{
                  fontFamily: 'Orbitron',
                  fontSize: 'clamp(1.3rem, 4vw, 1.9rem)',
                  margin: '0 0 0.4rem',
                  lineHeight: 1.15,
                }}
              >
                Mi perfil CriptoUNAM
              </h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={copyAddress}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: 12,
                    padding: '0.45rem 0.85rem',
                    color: '#cbd5e1',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {address?.slice(0, 8)}…{address?.slice(-6)}
                  <FontAwesomeIcon
                    icon={copied ? faCheck : faCopy}
                    style={{ color: copied ? '#4ade80' : '#94a3b8', fontSize: '0.78rem' }}
                  />
                </button>
                <button
                  type="button"
                  onClick={openTutorial}
                  title="Ver tutorial del perfil"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    borderRadius: 12,
                    padding: '0.45rem 0.7rem',
                    color: '#F4D03F',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  ¿Cómo funciona?
                </button>
              </div>
            </div>
          </div>

          {/* XP bar */}
          {tokenConfigured && (
            <div style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                }}
              >
                <span>Experiencia on-chain</span>
                <span style={{ color: '#F4D03F', fontWeight: 600 }}>
                  {Number(formatEther(pumaExperience)).toFixed(0)} XP
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (Number(formatEther(pumaExperience)) % 1000) / 10
                    )}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #F4D03F, #D4AF37)',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <p
                style={{
                  color: '#777',
                  fontSize: '0.72rem',
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                1000 PUMA acumulados ≈ 1 nivel
              </p>
            </div>
          )}
        </header>

        {/* ============================================================
            HACKATHON — registro, equipo y proyecto del participante
            ============================================================ */}
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <PerfilHackathonPanel />
        </div>

        {/* ============================================================
            STATS GRID
            ============================================================ */}
        <section
          className="puma-stagger"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '1rem',
          }}
        >
          <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faCoins} className="puma-stat__icon" />
            <div className="puma-stat__label">Balance $PUMA</div>
            <div className="puma-stat__value">
              {tokenConfigured ? Number(formatEther(pumaBalance)).toFixed(2) : '—'}
            </div>
            <div className="puma-stat__hint">disponibles</div>
          </div>
          <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faGraduationCap} className="puma-stat__icon" />
            <div className="puma-stat__label">Cursos completos</div>
            <div className="puma-stat__value">{cursosCompletados}</div>
            <div className="puma-stat__hint">de {cursosConProgreso.length} inscritos</div>
          </div>
          <div className="puma-stat" style={{ '--i': 2 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faStar} className="puma-stat__icon" />
            <div className="puma-stat__label">Sesiones</div>
            <div className="puma-stat__value">{totalSesiones}</div>
            <div className="puma-stat__hint">Embajadores asistidas</div>
          </div>
          <div className="puma-stat" style={{ '--i': 3 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faCalendarCheck} className="puma-stat__icon" />
            <div className="puma-stat__label">Eventos</div>
            <div className="puma-stat__value">{totalEventos}</div>
            <div className="puma-stat__hint">presenciales</div>
          </div>
          <div className="puma-stat" style={{ '--i': 4 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faAward} className="puma-stat__icon" />
            <div className="puma-stat__label">Certificados</div>
            <div className="puma-stat__value">{totalCertNFT}</div>
            <div className="puma-stat__hint">NFT soulbound</div>
          </div>
          <div className="puma-stat" style={{ '--i': 5 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faTrophy} className="puma-stat__icon" />
            <div className="puma-stat__label">Puntos</div>
            <div className="puma-stat__value">{puntos}</div>
            <div className="puma-stat__hint">off-chain</div>
          </div>
        </section>

        {/* ============================================================
            CENTRO DE RECOMPENSAS Y MISIONES (Exclusivo en Perfil)
            ============================================================ */}
        <section
          className="puma-card puma-glow"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2.5rem',
            padding: '1.4rem 1.6rem',
            borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(30,25,10,0.85) 100%)',
            border: '1.5px solid #F4D03F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a0a0a',
                fontSize: '1.6rem',
                boxShadow: '0 0 20px rgba(244, 208, 63, 0.5)',
              }}
            >
              <FontAwesomeIcon icon={faGift} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: 'Orbitron', color: '#fff', margin: 0, fontSize: '1.25rem' }}>
                  Centro de Recompensas $PUMA
                </h3>
                <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.72rem' }}>
                  EXCLUSIVO MIEMBROS
                </span>
              </div>
              <p style={{ color: '#cbd5e1', margin: '0.35rem 0 0', fontSize: '0.92rem', maxWidth: 620, lineHeight: 1.5 }}>
                Completa misiones, reclama tus tokens y accede al grifo (faucet) y códigos de drop de tus talleres y eventos en un solo lugar.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link
              to="/recompensas"
              className="puma-btn puma-btn--gold"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <FontAwesomeIcon icon={faGift} /> Ver Recompensas y Drops
            </Link>
            <Link
              to="/recompensas/misiones"
              style={{
                color: '#F4D03F',
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.4)',
                padding: '0.75rem 1.3rem',
                borderRadius: 12,
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FontAwesomeIcon icon={faCoins} /> Misiones Activas
            </Link>
          </div>
        </section>

        {/* ============================================================
            CURSOS INSCRITOS / EN PROGRESO
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 2.5rem' }}>
          <div
            className="puma-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <h2
              style={{
                fontFamily: 'Orbitron',
                color: '#fff',
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                margin: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              Mis cursos
            </h2>
            <Link to="/cursos" className="puma-chip puma-chip--gold" style={{ textDecoration: 'none' }}>
              Ver catálogo
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
            </Link>
          </div>

          {loadingInscripciones && (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Cargando tus cursos…</p>
          )}

          {!loadingInscripciones && cursosConProgreso.length === 0 && (
            <div className="puma-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <FontAwesomeIcon
                icon={faGraduationCap}
                style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '0.75rem' }}
              />
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                Aún no te has inscrito a ningún curso.
              </p>
              <Link to="/cursos" className="puma-btn puma-btn--gold">
                <FontAwesomeIcon icon={faGraduationCap} />
                Explorar cursos
              </Link>
            </div>
          )}

          {cursosConProgreso.length > 0 && (
            <div
              className="puma-stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: '1.1rem',
              }}
            >
              {cursosConProgreso.map(({ curso, progreso, completadas, total, badgeRef }, idx) => {
                const completo = progreso === 100
                return (
                  <div
                    key={curso.id}
                    className={`puma-card puma-card--shimmer ${completo ? 'puma-glow' : ''}`}
                    style={{ '--i': idx, padding: 0, overflow: 'hidden' } as React.CSSProperties}
                  >
                    <div
                      style={{
                        aspectRatio: '16 / 9',
                        background: `url(${curso.imagen}) center/cover`,
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background:
                            curso.nivel === 'Principiante'
                              ? 'linear-gradient(135deg, #4ade80, #16a34a)'
                              : curso.nivel === 'Intermedio'
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                              : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                          color: '#fff',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 999,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          fontFamily: 'Orbitron',
                        }}
                      >
                        {curso.nivel}
                      </span>
                      {completo && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                            color: '#0a0a0a',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 999,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            fontFamily: 'Orbitron',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} style={{ fontSize: '0.65rem' }} />
                          Completo
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
                      <h3
                        style={{
                          color: '#fff',
                          fontFamily: 'Orbitron',
                          fontSize: '1rem',
                          margin: '0 0 0.5rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {curso.titulo}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                        }}
                      >
                        <span>
                          {completadas} / {total} lecciones
                        </span>
                        <span
                          style={{
                            color: completo ? '#4ade80' : '#F4D03F',
                            fontWeight: 600,
                          }}
                        >
                          {progreso}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: 'rgba(0,0,0,0.4)',
                          overflow: 'hidden',
                          marginBottom: '0.85rem',
                        }}
                      >
                        <div
                          style={{
                            width: `${progreso}%`,
                            height: '100%',
                            background: completo
                              ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                              : 'linear-gradient(90deg, #D4AF37, #F4D03F)',
                          }}
                        />
                      </div>

                      <Link
                        to={completo ? `/claim/curso/${badgeRef}` : `/registro-curso/${curso.id}`}
                        className={completo ? 'puma-btn puma-btn--ghost' : 'puma-btn puma-btn--gold'}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '0.55rem 0.9rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {completo ? (
                          <>
                            <FontAwesomeIcon icon={faAward} />
                            Ver certificado NFT
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faArrowRight} />
                            Continuar curso
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ============================================================
            COLECCIÓN DE NFTs
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 2.5rem' }}>
          <div
            className="puma-fade-in-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a0a0a',
              }}
            >
              <FontAwesomeIcon icon={faMedal} />
            </div>
            <h2
              style={{
                fontFamily: 'Orbitron',
                color: '#fff',
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                margin: 0,
                flex: 1,
                minWidth: 0,
              }}
            >
              Mi colección NFT
            </h2>
            <span className="puma-chip puma-chip--gold">{badges.length} credenciales</span>
          </div>

          {!badgesContractConfigured && (
            <div className="puma-alert puma-alert--warn">
              El contrato de credenciales aún no está enlazado en esta red.
            </div>
          )}

          {badgesContractConfigured && badgesLoading && (
            <p style={{ color: '#888' }}>Cargando tus credenciales on-chain…</p>
          )}

          {badgesContractConfigured && !badgesLoading && badges.length === 0 && (
            <div className="puma-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
              <FontAwesomeIcon
                icon={faMedal}
                style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '0.75rem' }}
              />
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                Aún no tienes credenciales. Reclama tu primer POAP en{' '}
                <code style={{ color: '#F4D03F' }}>/claim</code> o termina un curso.
              </p>
              <Link to="/claim" className="puma-btn puma-btn--gold">
                <FontAwesomeIcon icon={faGift} />
                Ir a Reclamar
              </Link>
            </div>
          )}

          {/* SESIONES EMBAJADORES */}
          {badgesByKind[BadgeKind.Ambassador].length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faStar} style={{ color: '#F4D03F' }} />
                Sesiones de Embajadores asistidas
              </h3>
              <div
                className="puma-stagger"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                  gap: '1rem',
                }}
              >
                {badgesByKind[BadgeKind.Ambassador].map((b, i) => (
                  <ProfileBadgeCard key={b.tokenId.toString()} badge={b} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* EVENTOS PRESENCIALES */}
          {badgesByKind[BadgeKind.EventAttendance].length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} style={{ color: '#60a5fa' }} />
                Eventos presenciales
              </h3>
              <div
                className="puma-stagger"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                  gap: '1rem',
                }}
              >
                {badgesByKind[BadgeKind.EventAttendance].map((b, i) => (
                  <ProfileBadgeCard key={b.tokenId.toString()} badge={b} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICADOS + CERTIFICACIONES */}
          {(badgesByKind[BadgeKind.CourseCompletion].length > 0 ||
            badgesByKind[BadgeKind.Certification].length > 0) && (
            <div>
              <h3
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faAward} style={{ color: '#a78bfa' }} />
                Certificados (soulbound)
              </h3>
              <div
                className="puma-stagger"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                  gap: '1rem',
                }}
              >
                {[
                  ...badgesByKind[BadgeKind.CourseCompletion],
                  ...badgesByKind[BadgeKind.Certification],
                ].map((b, i) => (
                  <ProfileBadgeCard key={b.tokenId.toString()} badge={b} index={i} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================
            HISTORIAL PUMA + INSIGNIAS ON-CHAIN
            ============================================================ */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          <div className="puma-card puma-fade-in-up">
            <h3
              style={{
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '1.05rem',
                margin: '0 0 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FontAwesomeIcon icon={faChartLine} style={{ color: '#F4D03F' }} />
              Últimos $PUMA recibidos
            </h3>
            {recentRewards.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Cuando recibas $PUMA por misiones, sesiones o cursos, aparecerá aquí.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {recentRewards.map((r, i) => (
                  <li
                    key={`${r.timestamp}-${i}`}
                    style={{
                      padding: '0.7rem 0.85rem',
                      borderRadius: 10,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(212,175,55,0.18)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          color: '#F4D03F',
                          fontFamily: 'Orbitron',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                        }}
                      >
                        +{Number(formatEther(r.amount)).toFixed(2)} PUMA
                      </span>
                      <span style={{ color: '#777', fontSize: '0.72rem' }}>
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: 4 }} />
                        {new Date(Number(r.timestamp) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {r.reason}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="puma-card puma-fade-in-up" style={{ animationDelay: '120ms' }}>
            <h3
              style={{
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '1.05rem',
                margin: '0 0 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FontAwesomeIcon icon={faFire} style={{ color: '#fb923c' }} />
              Insignias on-chain
            </h3>
            {pumaBadges.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Aún no tienes insignias registradas en el contrato PUMA.
              </p>
            ) : (
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {pumaBadges.map((badge, i) => (
                  <li key={`${badge}-${i}`}>
                    <span
                      className="puma-chip puma-chip--gold"
                      style={{ fontSize: '0.82rem' }}
                    >
                      <FontAwesomeIcon icon={faMedal} />
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={`${explorerBase}/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="puma-btn puma-btn--ghost"
              style={{
                marginTop: '1.25rem',
                fontSize: '0.85rem',
                padding: '0.5rem 0.9rem',
              }}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              Ver mi wallet en el explorer
            </a>
          </div>
        </section>

        {/* ============================================================
            ACCIONES RÁPIDAS
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2
            className="puma-fade-in-up"
            style={{
              fontFamily: 'Orbitron',
              color: '#D4AF37',
              fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            Sigue construyendo tu reputación
          </h2>
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
            }}
          >
            {[
              {
                icon: faGift,
                title: 'Reclamar PUMA + POAP',
                desc: 'Si tienes un código de sesión o evento.',
                to: '/claim',
                gradient: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
              },
              {
                icon: faGraduationCap,
                title: 'Continuar cursos',
                desc: 'Termínalos para tu certificado NFT.',
                to: '/cursos',
                gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              },
              {
                icon: faCalendarCheck,
                title: 'Próximos eventos',
                desc: 'Inscríbete a la siguiente sesión.',
                to: '/eventos',
                gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
              },
              {
                icon: faUsers,
                title: 'Misiones activas',
                desc: 'Reclama PUMA de misiones abiertas.',
                to: '/recompensas/misiones',
                gradient: 'linear-gradient(135deg, #4ade80, #16a34a)',
              },
            ].map((it, idx) => (
              <Link
                key={it.title}
                to={it.to}
                className="puma-card puma-card--shimmer"
                style={
                  {
                    '--i': idx,
                    textDecoration: 'none',
                    display: 'block',
                    padding: '1.1rem',
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: it.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.7rem',
                    color: '#fff',
                  }}
                >
                  <FontAwesomeIcon icon={it.icon} />
                </div>
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '0.98rem',
                    fontFamily: 'Orbitron',
                    margin: '0 0 0.3rem',
                  }}
                >
                  {it.title}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  {it.desc}
                </p>
                <span
                  style={{
                    color: '#F4D03F',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginTop: '0.7rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Ir
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <ProfileTutorial forceOpen={tutorialForceOpen} onClose={closeTutorial} />
    </>
  )
}

export default Perfil
