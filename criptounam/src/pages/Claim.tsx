import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  useAccount,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { isAddress, zeroAddress } from 'viem'
import SEOHead from '../components/SEOHead'
import { useWallet } from '../context/WalletContext'
import { useEnsureNetwork } from '../hooks/useEnsureNetwork'
import ENV_CONFIG from '../config/env'
import {
  criptoUnamBadgesAbi,
  BadgeKind,
  BADGE_KIND_LABEL,
  BADGE_KIND_DESCRIPTION,
  BADGE_KIND_SOULBOUND,
} from '../constants/criptoUnamBadgesAbi'
import {
  badgesContractConfigured,
  useIsBadgeMinter,
  useBadgesOf,
  resolveMetadataUrl,
  useBadgeMetadata,
} from '../hooks/useCriptoUnamBadges'
import DropCodeClaim from '../components/Puma/DropCodeClaim'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faCalendarCheck,
  faStar,
  faAward,
  faArrowRight,
  faArrowLeft,
  faCheckCircle,
  faExternalLinkAlt,
  faLock,
  faShieldHalved,
  faMedal,
  faPaperPlane,
  faGift,
  faWandMagicSparkles,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

const badgesAddr = ENV_CONFIG.BADGES_CONTRACT_ADDRESS as `0x${string}`
const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'
const claimEndpoint = ENV_CONFIG.BADGES_CLAIM_ENDPOINT

type SlugKind = 'sesion' | 'curso' | 'evento' | 'embajador' | 'certificacion'

const SLUG_TO_KIND: Record<SlugKind, BadgeKind> = {
  sesion: BadgeKind.EventAttendance,
  evento: BadgeKind.EventAttendance,
  embajador: BadgeKind.Ambassador,
  curso: BadgeKind.CourseCompletion,
  certificacion: BadgeKind.Certification,
}

const KIND_TO_DEFAULT_SLUG: Record<BadgeKind, SlugKind> = {
  [BadgeKind.EventAttendance]: 'evento',
  [BadgeKind.Ambassador]: 'embajador',
  [BadgeKind.CourseCompletion]: 'curso',
  [BadgeKind.Certification]: 'certificacion',
}

const KIND_ICON: Record<BadgeKind, typeof faAward> = {
  [BadgeKind.EventAttendance]: faCalendarCheck,
  [BadgeKind.Ambassador]: faStar,
  [BadgeKind.CourseCompletion]: faGraduationCap,
  [BadgeKind.Certification]: faAward,
}

const KIND_GRADIENT: Record<BadgeKind, string> = {
  [BadgeKind.EventAttendance]: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
  [BadgeKind.Ambassador]: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
  [BadgeKind.CourseCompletion]: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
  [BadgeKind.Certification]: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
}

/* ============================================================
   CONFETTI on success
   ============================================================ */
const Confetti: React.FC = () => {
  const pieces = useMemo(() => {
    const colors = ['#F4D03F', '#D4AF37', '#60a5fa', '#a78bfa', '#4ade80', '#fb923c']
    return Array.from({ length: 28 }, (_, i) => ({
      key: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.4}s`,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
    }))
  }, [])
  return (
    <div className="puma-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.key}
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

/* ============================================================
   LANDING /claim
   ============================================================ */
const ClaimLanding: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connectWallet } = useWallet()
  const { data: badges = [], isLoading: loadingBadges } = useBadgesOf(address)

  const kinds: { kind: BadgeKind; slug: SlugKind; title: string; sub: string }[] = [
    {
      kind: BadgeKind.Ambassador,
      slug: 'sesion',
      title: 'Sesión de Embajadores',
      sub: 'Cada domingo, los embajadores asistentes pueden reclamar su POAP transferible.',
    },
    {
      kind: BadgeKind.CourseCompletion,
      slug: 'curso',
      title: 'Certificado de Curso',
      sub: 'Soulbound: al completar un curso obtienes una credencial verificable on-chain.',
    },
    {
      kind: BadgeKind.EventAttendance,
      slug: 'evento',
      title: 'POAP de Evento',
      sub: 'Recuerdo on-chain de meetups, hackatones y eventos presenciales.',
    },
    {
      kind: BadgeKind.Certification,
      slug: 'certificacion',
      title: 'Certificación',
      sub: 'Certificación oficial de CriptoUNAM (soulbound, no transferible).',
    },
  ]

  return (
    <>
      {/* ----- HERO ----- */}
      <section
        className="puma-hero-bg puma-fade-in"
        style={{
          maxWidth: 1100,
          margin: '0 auto 2.5rem',
          padding: '3rem 1.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="puma-hero-grid" />

        <div
          className="puma-pop-in"
          style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
        >
          <div className="puma-coin puma-coin--lg puma-pulse-ring">P</div>
        </div>

        <h1
          className="puma-title-glow puma-fade-in-up"
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
            marginBottom: '0.85rem',
            lineHeight: 1.15,
          }}
        >
          Reclama tus credenciales on-chain
        </h1>
        <p
          className="puma-fade-in-up"
          style={{
            color: '#cbd5e1',
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            maxWidth: 720,
            margin: '0 auto',
            lineHeight: 1.65,
            animationDelay: '120ms',
          }}
        >
          POAPs de sesiones de embajadores, certificados de cursos y badges de eventos. Conecta tu
          wallet, ingresa el código que te dio el equipo y reclama tu NFT en segundos.
        </p>

        <div
          className="puma-fade-in-up"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '1.75rem',
            animationDelay: '220ms',
          }}
        >
          {!isConnected && (
            <button type="button" className="puma-btn puma-btn--gold" onClick={() => connectWallet()}>
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Conectar wallet
            </button>
          )}
          <Link to="/recompensas" className="puma-btn puma-btn--ghost">
            <FontAwesomeIcon icon={faGift} />
            Ver recompensas $PUMA
          </Link>
        </div>
      </section>

      {/* ----- DROP CON CÓDIGO ----- */}
      <section style={{ maxWidth: 720, margin: '0 auto 3rem', padding: '0 1rem' }}>
        <DropCodeClaim />
      </section>

      {/* ----- TIPOS DE RECLAMO ----- */}
      <section style={{ maxWidth: 1100, margin: '0 auto 3rem', padding: '0 1rem' }}>
        <h2
          className="puma-fade-in-up"
          style={{
            fontFamily: 'Chakra Petch',
            color: '#D4AF37',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.55rem)',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          ¿Qué quieres reclamar hoy?
        </h2>

        <div
          className="puma-stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: '1.2rem',
          }}
        >
          {kinds.map((k, idx) => (
            <Link
              key={k.title}
              to={`/claim/${k.slug}`}
              className="puma-card puma-card--shimmer"
              style={
                { textDecoration: 'none', display: 'block', '--i': idx } as React.CSSProperties
              }
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: KIND_GRADIENT[k.kind],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <FontAwesomeIcon icon={KIND_ICON[k.kind]} style={{ color: '#fff', fontSize: '1.4rem' }} />
              </div>
              <h3
                style={{
                  color: '#fff',
                  fontFamily: 'Chakra Petch',
                  fontSize: '1.05rem',
                  marginBottom: '0.45rem',
                  lineHeight: 1.3,
                }}
              >
                {k.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1rem' }}>
                {k.sub}
              </p>
              <span
                style={{
                  color: '#D4AF37',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Reclamar
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.75rem' }} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ----- MIS BADGES ----- */}
      <section
        style={{ maxWidth: 1100, margin: '0 auto 4rem', padding: '0 1rem' }}
        className="puma-fade-in-up"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'Chakra Petch',
              color: '#D4AF37',
              fontSize: 'clamp(1.2rem, 3.5vw, 1.55rem)',
              margin: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <FontAwesomeIcon icon={faMedal} /> Tu colección
          </h2>
          <span className="puma-chip puma-chip--gold">{badges.length} credenciales</span>
        </div>

        {!badgesContractConfigured && (
          <div className="puma-alert puma-alert--warn">
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span>
              Aún no configuramos el contrato de credenciales en esta red. Pronto podrás reclamar
              POAPs y certificados aquí.
            </span>
          </div>
        )}

        {badgesContractConfigured && !isConnected && (
          <div className="puma-card" style={{ textAlign: 'center' }}>
            <FontAwesomeIcon
              icon={faUsers}
              style={{ fontSize: '2.2rem', color: '#D4AF37', marginBottom: '0.75rem' }}
            />
            <p style={{ color: '#ccc', marginBottom: '1rem' }}>
              Conecta tu wallet para ver tus POAPs y certificados.
            </p>
            <button type="button" className="puma-btn puma-btn--gold" onClick={() => connectWallet()}>
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              Conectar wallet
            </button>
          </div>
        )}

        {badgesContractConfigured && isConnected && loadingBadges && (
          <p style={{ color: '#888', textAlign: 'center' }}>Buscando tus credenciales on-chain…</p>
        )}

        {badgesContractConfigured && isConnected && !loadingBadges && badges.length === 0 && (
          <div className="puma-card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#aaa', margin: 0 }}>
              Aún no tienes credenciales en esta wallet. Reclama tu primer POAP arriba.
            </p>
          </div>
        )}

        {badges.length > 0 && (
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
              gap: '1.1rem',
            }}
          >
            {badges.map((b, idx) => (
              <OwnedBadgeCard key={b.tokenId.toString()} badge={b} index={idx} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

/* ============================================================
   OwnedBadgeCard
   ============================================================ */
const OwnedBadgeCard: React.FC<{
  badge: { tokenId: bigint; kind: BadgeKind; ref: string; uri: string; isSoulbound: boolean }
  index: number
}> = ({ badge, index }) => {
  const { data: meta } = useBadgeMetadata(badge.uri)
  return (
    <div className="puma-card" style={{ '--i': index, padding: '1rem' } as React.CSSProperties}>
      <div className="puma-nft-preview" style={{ marginBottom: '0.85rem' }}>
        {meta?.image ? (
          <img src={resolveMetadataUrl(meta.image)} alt={meta.name || badge.ref} />
        ) : (
          <FontAwesomeIcon icon={KIND_ICON[badge.kind]} className="puma-nft-preview__icon" />
        )}
      </div>
      <span className="puma-chip puma-chip--gold" style={{ marginBottom: '0.5rem' }}>
        #{badge.tokenId.toString()}
      </span>
      <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0.45rem 0 0.35rem', lineHeight: 1.3 }}>
        {meta?.name || BADGE_KIND_LABEL[badge.kind]}
      </h4>
      <p style={{ color: '#888', fontSize: '0.78rem', margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
        {badge.ref}
      </p>
      {badge.isSoulbound && (
        <span className="puma-chip puma-chip--amber" style={{ marginTop: '0.65rem' }}>
          <FontAwesomeIcon icon={faLock} />
          Soulbound
        </span>
      )}
    </div>
  )
}

/* ============================================================
   CLAIM VIEW (subruta)
   ============================================================ */
type ClaimStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success'; tokenId?: string; txHash?: `0x${string}` }
  | { state: 'error'; message: string }

const ClaimView: React.FC<{ slug: SlugKind; ref?: string }> = ({ slug, ref: refParam }) => {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { connectWallet } = useWallet()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const chain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const kind = SLUG_TO_KIND[slug]
  const icon = KIND_ICON[kind]
  const gradient = KIND_GRADIENT[kind]
  const isSoulbound = BADGE_KIND_SOULBOUND[kind]

  const [refValue, setRefValue] = useState(refParam ?? '')
  const [claimCode, setClaimCode] = useState('')
  const [status, setStatus] = useState<ClaimStatus>({ state: 'idle' })

  useEffect(() => {
    if (refParam) setRefValue(refParam)
  }, [refParam])

  const { data: hasMinterRole } = useIsBadgeMinter(address)

  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txOk && txHash) {
      setStatus({ state: 'success', txHash })
      reset()
    }
  }, [txOk, txHash, reset])

  useEffect(() => {
    if (writeError) {
      setStatus({ state: 'error', message: writeError.message.slice(0, 220) })
    }
  }, [writeError])

  const tokenOk = isAddress(badgesAddr) && badgesAddr !== zeroAddress
  const busy = isPending || confirming || status.state === 'submitting'

  /* ---- mint directo si la wallet tiene MINTER_ROLE ---- */
  const submitSelfMint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasMinterRole || !chain || !address) return
    if (!refValue.trim()) return
    if (!(await ensureTargetChain())) return
    const uri = ENV_CONFIG.BADGES_METADATA_BASE
      ? `${ENV_CONFIG.BADGES_METADATA_BASE.replace(/\/$/, '')}/${slug}-${refValue.trim()}.json`
      : `${slug}-${refValue.trim()}.json`
    writeContract({
      address: badgesAddr,
      abi: criptoUnamBadgesAbi,
      functionName: 'mint',
      args: [address, kind, refValue.trim(), uri],
      chain,
      account: address,
    })
  }

  /* ---- claim con código (endpoint serverless) ---- */
  const submitClaimWithCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !refValue.trim() || !claimCode.trim()) return
    if (!claimEndpoint) {
      setStatus({
        state: 'error',
        message:
          'Aún no configuramos el endpoint de reclamos. Comparte tu wallet con el equipo para que te emitan el NFT.',
      })
      return
    }
    setStatus({ state: 'submitting' })
    try {
      const res = await fetch(claimEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          kind,
          ref: refValue.trim(),
          code: claimCode.trim(),
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Error ${res.status}`)
      }
      const data = (await res.json()) as { tokenId?: string; txHash?: `0x${string}` }
      setStatus({ state: 'success', tokenId: data.tokenId, txHash: data.txHash })
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : 'No pudimos validar tu código.',
      })
    }
  }

  const slugLabel: Record<SlugKind, string> = {
    sesion: 'sesión de embajadores',
    evento: 'evento',
    embajador: 'embajador',
    curso: 'curso',
    certificacion: 'certificación',
  }

  /* ============================================================ */
  return (
    <>
      <div style={{ maxWidth: 960, margin: '0 auto 1.5rem' }} className="puma-fade-in">
        <button
          type="button"
          onClick={() => navigate('/claim')}
          className="puma-breadcrumb"
          style={{ background: 'none', cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver a reclamos
        </button>
      </div>

      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* ---- PREVIEW ---- */}
        <div className="puma-fade-in-up" style={{ position: 'relative' }}>
          <div className="puma-nft-preview puma-float">
            <FontAwesomeIcon icon={icon} className="puma-nft-preview__icon" />
            <div className="puma-nft-preview__overlay">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <strong style={{ color: '#F4D03F', fontFamily: 'Chakra Petch', fontSize: '0.95rem' }}>
                  {BADGE_KIND_LABEL[kind]}
                </strong>
                {isSoulbound ? (
                  <span className="puma-chip puma-chip--amber">
                    <FontAwesomeIcon icon={faLock} /> Soulbound
                  </span>
                ) : (
                  <span className="puma-chip puma-chip--blue">Transferible</span>
                )}
              </div>
              <p style={{ color: '#ccc', fontSize: '0.83rem', margin: '0.45rem 0 0', lineHeight: 1.4 }}>
                {BADGE_KIND_DESCRIPTION[kind]}
              </p>
            </div>
            {status.state === 'success' && <Confetti />}
          </div>
        </div>

        {/* ---- FORM ---- */}
        <div className="puma-card puma-card--rainbow puma-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: '1.1rem',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.1rem',
              }}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'Chakra Petch',
                  color: '#fff',
                  fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Reclamar {slugLabel[slug]}
              </h2>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {refValue || 'Ingresa el identificador'}
              </span>
            </div>
          </div>

          {!tokenOk && (
            <div className="puma-alert puma-alert--warn" style={{ marginBottom: '1rem' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
              <span>
                Contrato de credenciales aún no configurado en esta red. Pídele al equipo el
                contrato deployado.
              </span>
            </div>
          )}

          {tokenOk && !isConnected && (
            <>
              <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
                Conecta tu wallet para asociar este NFT a tu dirección.
              </p>
              <button
                type="button"
                className="puma-btn puma-btn--gold"
                onClick={() => connectWallet()}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                Conectar wallet
              </button>
            </>
          )}

          {tokenOk && isConnected && status.state === 'success' && (
            <div className="puma-alert puma-alert--success puma-pop-in">
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3, fontSize: '1.1rem' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#bbf7d0' }}>¡Reclamado!</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem' }}>
                  {status.tokenId && (
                    <>
                      Token #{status.tokenId} acuñado para tu wallet.
                      <br />
                    </>
                  )}
                  {status.txHash && (
                    <a
                      href={`${explorerBase}/tx/${status.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#86efac',
                        fontWeight: 600,
                        marginTop: 4,
                      }}
                    >
                      Ver transacción
                      <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.72rem' }} />
                    </a>
                  )}
                </p>
              </div>
            </div>
          )}

          {tokenOk && isConnected && status.state !== 'success' && (
            <>
              <form onSubmit={hasMinterRole ? submitSelfMint : submitClaimWithCode}>
                <label className="puma-label">Identificador (ref)</label>
                <input
                  className="puma-input"
                  value={refValue}
                  onChange={(e) => setRefValue(e.target.value)}
                  placeholder={
                    slug === 'sesion'
                      ? 'embajadores-2026-05-26'
                      : slug === 'curso'
                      ? 'solidity-101-2026-Q2'
                      : 'evento-eth-mexico-2026'
                  }
                  style={{ marginBottom: '0.85rem' }}
                  required
                />

                {!hasMinterRole && (
                  <>
                    <label className="puma-label">Código de reclamo</label>
                    <input
                      className="puma-input"
                      value={claimCode}
                      onChange={(e) => setClaimCode(e.target.value)}
                      placeholder="El equipo te lo compartió en la sesión"
                      style={{ marginBottom: '0.85rem' }}
                      required
                    />
                  </>
                )}

                {hasMinterRole && (
                  <div className="puma-alert puma-alert--info" style={{ marginBottom: '1rem' }}>
                    <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
                    <span>
                      Detectamos que tu wallet tiene <code>MINTER_ROLE</code>. Vas a firmar el mint
                      directamente desde tu wallet (sin código).
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="puma-btn puma-btn--gold"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={busy || !refValue.trim() || (!hasMinterRole && !claimCode.trim())}
                >
                  <FontAwesomeIcon icon={busy ? faPaperPlane : faGift} />
                  {busy ? 'Procesando…' : hasMinterRole ? 'Acuñar NFT (self-mint)' : 'Reclamar NFT'}
                </button>
              </form>

              {status.state === 'error' && (
                <div className="puma-alert puma-alert--error" style={{ marginTop: '1rem' }}>
                  <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
                  <span style={{ wordBreak: 'break-word' }}>{status.message}</span>
                </div>
              )}

              <p
                style={{
                  color: '#777',
                  fontSize: '0.8rem',
                  marginTop: '1.1rem',
                  marginBottom: 0,
                  lineHeight: 1.55,
                }}
              >
                Tu wallet conectada: <code style={{ color: '#aaa' }}>{address?.slice(0, 10)}…{address?.slice(-4)}</code>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

/* ============================================================
   ENTRY
   ============================================================ */
const Claim: React.FC = () => {
  const { kindSlug, ref } = useParams<{ kindSlug?: string; ref?: string }>()
  const navigate = useNavigate()

  const slug = (kindSlug ?? '').toLowerCase() as SlugKind | ''
  const validSlug = (Object.keys(SLUG_TO_KIND) as SlugKind[]).includes(slug as SlugKind)

  useEffect(() => {
    if (kindSlug && !validSlug) navigate('/claim', { replace: true })
  }, [kindSlug, validSlug, navigate])

  return (
    <>
      <SEOHead
        title="Reclamar NFTs - CriptoUNAM"
        description="Reclama tus POAPs, certificados y badges on-chain de CriptoUNAM."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/claim"
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
        {validSlug ? <ClaimView slug={slug as SlugKind} ref={ref} /> : <ClaimLanding />}
        <div style={{ display: 'none' }}>{KIND_TO_DEFAULT_SLUG[BadgeKind.EventAttendance]}</div>
      </div>
    </>
  )
}

export default Claim
