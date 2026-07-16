import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { isAddress, formatEther, parseEther, zeroAddress } from 'viem'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faCoins,
  faPlus,
  faStop,
  faUserShield,
  faGaugeHigh,
  faPause,
  faPlay,
  faFire,
  faGauge,
  faSliders,
  faClipboardList,
  faMedal,
  faShieldHalved,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi, type PumaMissionRow } from '../constants/pumaTokenAbi'
import {
  PUMA_MISSION_MANAGER_ROLE,
  PUMA_REWARD_MANAGER_ROLE,
  PUMA_DEFAULT_ADMIN_ROLE,
} from '../constants/pumaRoles'
import { usePumaMissionsList, pumaTokenConfigured } from '../hooks/usePumaMissions'
import { useAdmin } from '../hooks/useAdmin'
import DropsAdminTab from '../components/Puma/DropsAdminTab'
import DropsRoleWiring from '../components/Puma/DropsRoleWiring'
import { useEnsureNetwork } from '../hooks/useEnsureNetwork'
import { faGift, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import SuscripcionesAdminTab from '../components/Puma/SuscripcionesAdminTab'
import '../styles/global.css'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`

type AdminTab = 'general' | 'misiones' | 'recompensas' | 'drops' | 'suscripciones'

const AdminPuma: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { isAdmin: isLegacyAdmin } = useAdmin()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const chain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const { data: missions = [], isLoading: loadingMissions, refetch: refetchMissions } =
    usePumaMissionsList()

  const { data: hasMissionRole, isLoading: loadingMissionRole } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'hasRole',
    args: address ? [PUMA_MISSION_MANAGER_ROLE, address] : undefined,
    query: { enabled: pumaTokenConfigured && !!address },
  })
  const { data: hasRewardRole, isLoading: loadingRewardRole } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'hasRole',
    args: address ? [PUMA_REWARD_MANAGER_ROLE, address] : undefined,
    query: { enabled: pumaTokenConfigured && !!address },
  })
  const { data: hasDefaultAdmin, isLoading: loadingDefaultAdmin } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'hasRole',
    args: address ? [PUMA_DEFAULT_ADMIN_ROLE, address] : undefined,
    query: { enabled: pumaTokenConfigured && !!address },
  })
  const { data: tokenStats } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getTokenStats',
    query: { enabled: pumaTokenConfigured },
  })
  const { data: paused } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'paused',
    query: { enabled: pumaTokenConfigured },
  })
  const { data: xpPerTokenWei } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'xpPerTokenWei',
    query: { enabled: pumaTokenConfigured },
  })

  const [tab, setTab] = useState<AdminTab>('general')

  const [missionId, setMissionId] = useState('')
  const [title, setTitle] = useState('')
  const [rewardPuma, setRewardPuma] = useState('10')
  const [deadlineLocal, setDeadlineLocal] = useState('')

  const [mintTo, setMintTo] = useState('')
  const [mintAmount, setMintAmount] = useState('100')
  const [mintReason, setMintReason] = useState('Sesión / embajador')

  const [badgeUser, setBadgeUser] = useState('')
  const [badgeLabel, setBadgeLabel] = useState('embajador-2026')

  const [levelUser, setLevelUser] = useState('')
  const [levelValue, setLevelValue] = useState('2')

  const [xpInput, setXpInput] = useState('1')
  const [burnFrom, setBurnFrom] = useState('')
  const [burnAmount, setBurnAmount] = useState('1')
  const [burnReason, setBurnReason] = useState('Ajuste / corrección')

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txOk) {
      refetchMissions()
      reset()
    }
  }, [txOk, refetchMissions, reset])

  const tokenOk = isAddress(tokenAddr) && tokenAddr !== zeroAddress
  const rolesLoading =
    tokenOk && isConnected && !!address && (loadingMissionRole || loadingRewardRole || loadingDefaultAdmin)
  const hasOnchainAdminRole = Boolean(hasMissionRole || hasRewardRole || hasDefaultAdmin)
  const canViewAdminPanel = Boolean(isLegacyAdmin || hasOnchainAdminRole)

  const execWrite = async (functionName: string, args: readonly unknown[]) => {
    if (!chain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: tokenAddr,
      abi: pumaTokenAbi,
      functionName: functionName as never,
      args: args as never,
      chain,
      account: address,
    })
  }

  const submitCreateMission = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasMissionRole || !missionId.trim() || !title.trim() || !deadlineLocal) return
    const deadlineSec = Math.floor(new Date(deadlineLocal).getTime() / 1000)
    let rewardWei: bigint
    try {
      rewardWei = parseEther(rewardPuma || '0')
    } catch {
      return
    }
    if (rewardWei === 0n) return
    execWrite('createMission', [missionId.trim(), title.trim(), rewardWei, BigInt(deadlineSec)])
  }
  const deactivate = (id: string) => {
    if (!hasMissionRole) return
    execWrite('deactivateMission', [id])
  }
  const submitMint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasRewardRole || !isAddress(mintTo)) return
    let amount: bigint
    try {
      amount = parseEther(mintAmount || '0')
    } catch {
      return
    }
    if (amount === 0n) return
    execWrite('mintReward', [mintTo as `0x${string}`, amount, mintReason.trim() || 'reward'])
  }
  const submitBadge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasRewardRole || !isAddress(badgeUser) || !badgeLabel.trim()) return
    execWrite('grantBadge', [badgeUser as `0x${string}`, badgeLabel.trim()])
  }
  const submitLevel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasRewardRole || !isAddress(levelUser)) return
    const lv = BigInt(parseInt(levelValue, 10) || 0)
    if (lv === 0n) return
    execWrite('setUserLevel', [levelUser as `0x${string}`, lv])
  }
  const submitPause = () => {
    if (!hasDefaultAdmin) return
    execWrite('pause', [])
  }
  const submitUnpause = () => {
    if (!hasDefaultAdmin) return
    execWrite('unpause', [])
  }
  const submitXp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasDefaultAdmin) return
    const v = xpInput.trim()
    if (!/^\d+$/.test(v)) return
    execWrite('setXpPerTokenWei', [BigInt(v)])
  }
  const submitBurn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasRewardRole || !isAddress(burnFrom.trim())) return
    let amount: bigint
    try {
      amount = parseEther(burnAmount || '0')
    } catch {
      return
    }
    if (amount === 0n) return
    execWrite('burnReward', [burnFrom.trim() as `0x${string}`, amount, burnReason.trim() || 'burn'])
  }

  const statsTuple = tokenStats as [bigint, bigint, bigint, bigint] | undefined

  const RoleChip = ({ active, label }: { active: boolean | undefined; label: string }) => (
    <span className={`puma-chip ${active ? 'puma-chip--green' : 'puma-chip--gray'}`}>
      <FontAwesomeIcon icon={active ? faCircleCheck : faCircleXmark} />
      {label}
    </span>
  )

  return (
    <>
      <SEOHead
        title="Admin PUMA - CriptoUNAM"
        description="Gestión de misiones y recompensas PUMA on-chain."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/admin/puma"
        type="website"
      />

      <div
        className="section"
        style={{
          minHeight: '100vh',
          paddingTop: '1.5rem',
          paddingBottom: '4rem',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {/* breadcrumb */}
        <div className="puma-fade-in" style={{ marginBottom: '1rem' }}>
          <Link to="/recompensas" className="puma-breadcrumb">
            <FontAwesomeIcon icon={faArrowLeft} />
            Recompensas
          </Link>
        </div>

        {/* HEADER */}
        <header
          className="puma-hero-bg"
          style={{ marginBottom: '2rem', padding: '1rem 0.5rem', textAlign: 'center' }}
        >
          <div className="puma-hero-grid" />
          <div
            className="puma-pop-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
              marginBottom: '0.85rem',
            }}
          >
            <FontAwesomeIcon icon={faUserShield} style={{ color: '#fff', fontSize: '1.4rem' }} />
          </div>
          <h1
            className="puma-title-glow puma-fade-in-up"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.3rem)', marginBottom: '0.6rem' }}
          >
            Panel PUMA on-chain
          </h1>
          <p
            className="puma-fade-in-up"
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.92rem, 2.5vw, 1.05rem)',
              lineHeight: 1.6,
              maxWidth: 700,
              margin: '0 auto',
              animationDelay: '120ms',
            }}
          >
            Los permisos salen del contrato. Crea misiones semanales con un{' '}
            <code style={{ color: '#94a3b8' }}>missionId</code> nuevo y reparte $PUMA con trazabilidad.
          </p>
        </header>

        {/* AVISOS DE CONEXIÓN */}
        {!isConnected && (
          <div className="puma-alert puma-alert--error" style={{ marginBottom: '1.25rem' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span>Conecta una wallet que tenga roles en el contrato PUMA.</span>
          </div>
        )}
        {!tokenOk && (
          <div className="puma-alert puma-alert--warn" style={{ marginBottom: '1.25rem' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span>
              Configura <code style={{ color: '#fbbf24' }}>VITE_PUMA_TOKEN_ADDRESS</code> en el entorno.
            </span>
          </div>
        )}

        {/* WALLET INFO + ROLES */}
        {tokenOk && isConnected && address && (
          <div className="puma-card puma-card--rainbow puma-fade-in-up" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.85rem' }}>
              <FontAwesomeIcon icon={faUserShield} style={{ color: '#60a5fa', fontSize: '1.2rem' }} />
              <span style={{ color: '#E0E0E0', fontWeight: 600 }}>Tu wallet en este contrato</span>
            </div>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                color: '#cbd5e1',
                margin: '0 0 0.85rem',
                wordBreak: 'break-all',
                background: 'rgba(0,0,0,0.35)',
                padding: '0.6rem 0.85rem',
                borderRadius: 10,
              }}
            >
              {address}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <RoleChip active={isLegacyAdmin} label="Admin legacy" />
              <RoleChip active={hasDefaultAdmin as boolean} label="Default Admin" />
              <RoleChip active={hasMissionRole as boolean} label="Mission Manager" />
              <RoleChip active={hasRewardRole as boolean} label="Reward Manager" />
              {paused !== undefined && (
                <span className={`puma-chip ${paused ? 'puma-chip--red' : 'puma-chip--green'}`}>
                  Contrato: {paused ? 'en pausa' : 'activo'}
                </span>
              )}
            </div>
          </div>
        )}

        {tokenOk && isConnected && address && rolesLoading && (
          <div className="puma-alert puma-alert--info" style={{ marginBottom: '1.25rem' }}>
            <span>Verificando permisos de admin…</span>
          </div>
        )}

        {tokenOk && isConnected && address && !rolesLoading && !canViewAdminPanel && (
          <div className="puma-alert puma-alert--error">
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span>
              Acceso denegado. Solo entran wallets con <code>DEFAULT_ADMIN</code>,{' '}
              <code>MISSION_MANAGER</code>, <code>REWARD_MANAGER</code> o la allowlist interna.
            </span>
          </div>
        )}

        {/* TABS */}
        {tokenOk && canViewAdminPanel && (
          <>
            <div className="puma-tabs puma-fade-in-up" style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                className={`puma-tab ${tab === 'general' ? 'puma-tab--active' : ''}`}
                onClick={() => setTab('general')}
              >
                <FontAwesomeIcon icon={faGaugeHigh} />
                General
              </button>
              <button
                type="button"
                className={`puma-tab ${tab === 'misiones' ? 'puma-tab--active' : ''}`}
                onClick={() => setTab('misiones')}
              >
                <FontAwesomeIcon icon={faClipboardList} />
                Misiones
              </button>
              <button
                type="button"
                className={`puma-tab ${tab === 'recompensas' ? 'puma-tab--active' : ''}`}
                onClick={() => setTab('recompensas')}
              >
                <FontAwesomeIcon icon={faCoins} />
                Recompensas
              </button>
              <button
                type="button"
                className={`puma-tab ${tab === 'drops' ? 'puma-tab--active' : ''}`}
                onClick={() => setTab('drops')}
              >
                <FontAwesomeIcon icon={faGift} />
                Drops
              </button>
              <button
                type="button"
                className={`puma-tab ${tab === 'suscripciones' ? 'puma-tab--active' : ''}`}
                onClick={() => setTab('suscripciones')}
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Suscripciones
              </button>
            </div>

            {/* ==================== GENERAL ==================== */}
            {tab === 'general' && (
              <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
                {statsTuple && (
                  <div
                    className="puma-stagger"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
                      <div className="puma-stat__label">Suministro total</div>
                      <div className="puma-stat__value">{Number(formatEther(statsTuple[0])).toLocaleString()}</div>
                      <div className="puma-stat__hint">PUMA acuñados</div>
                    </div>
                    <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
                      <div className="puma-stat__label">Distribuidos</div>
                      <div className="puma-stat__value">
                        {Number(formatEther(statsTuple[1])).toLocaleString()}
                      </div>
                      <div className="puma-stat__hint">Contador histórico</div>
                    </div>
                    <div className="puma-stat" style={{ '--i': 2 } as React.CSSProperties}>
                      <div className="puma-stat__label">Quemados</div>
                      <div className="puma-stat__value">
                        {Number(formatEther(statsTuple[2])).toLocaleString()}
                      </div>
                      <div className="puma-stat__hint">Burn total</div>
                    </div>
                    <div className="puma-stat" style={{ '--i': 3 } as React.CSSProperties}>
                      <div className="puma-stat__label">Misiones registradas</div>
                      <div className="puma-stat__value">{statsTuple[3].toString()}</div>
                      <div className="puma-stat__hint">En el contrato</div>
                    </div>
                  </div>
                )}

                {hasDefaultAdmin && (
                  <div className="puma-card puma-card--featured">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: '0.85rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <FontAwesomeIcon icon={faPause} style={{ color: '#f87171' }} />
                      <h3 style={{ color: '#fff', fontFamily: 'Orbitron', margin: 0, fontSize: '1.05rem' }}>
                        Pausa global
                      </h3>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.55, marginTop: 0 }}>
                      Pausa mint, misiones y transferencias de recompensa. Úsalo solo ante incidentes.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={submitPause}
                        disabled={isPending || confirming || !!paused}
                        className="puma-btn puma-btn--danger"
                      >
                        <FontAwesomeIcon icon={faPause} />
                        Pausar
                      </button>
                      <button
                        type="button"
                        onClick={submitUnpause}
                        disabled={isPending || confirming || !paused}
                        className="puma-btn puma-btn--ghost"
                        style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.5)' }}
                      >
                        <FontAwesomeIcon icon={faPlay} />
                        Reanudar
                      </button>
                    </div>
                  </div>
                )}

                {hasDefaultAdmin && (
                  <div className="puma-card">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: '0.75rem',
                      }}
                    >
                      <FontAwesomeIcon icon={faGauge} style={{ color: '#D4AF37' }} />
                      <h3 style={{ color: '#fff', fontFamily: 'Orbitron', margin: 0, fontSize: '1.05rem' }}>
                        XP por token
                      </h3>
                    </div>
                    <p style={{ color: '#888', fontSize: '0.85rem', marginTop: 0 }}>
                      Valor actual:{' '}
                      <strong style={{ color: '#F4D03F' }}>
                        {xpPerTokenWei !== undefined ? String(xpPerTokenWei) : '—'}
                      </strong>
                    </p>
                    <form onSubmit={submitXp}>
                      <label className="puma-label">
                        Nuevo valor (entero, wei de XP por wei de token)
                      </label>
                      <input
                        className="puma-input"
                        value={xpInput}
                        onChange={(e) => setXpInput(e.target.value)}
                        inputMode="numeric"
                        style={{ marginBottom: '0.85rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--gold"
                      >
                        <FontAwesomeIcon icon={faSliders} />
                        Actualizar XP
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ==================== MISIONES ==================== */}
            {tab === 'misiones' && (
              <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
                {!hasMissionRole && (
                  <div className="puma-alert puma-alert--warn">
                    <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
                    <span>
                      Necesitas <code>MISSION_MANAGER_ROLE</code> para crear o cerrar misiones.
                    </span>
                  </div>
                )}

                {hasMissionRole && (
                  <div className="puma-card puma-card--rainbow">
                    <h3
                      style={{
                        fontFamily: 'Orbitron',
                        color: '#fff',
                        fontSize: '1.1rem',
                        marginTop: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} style={{ color: '#D4AF37' }} />
                      Nueva misión
                    </h3>
                    <form onSubmit={submitCreateMission}>
                      <label className="puma-label">missionId (único, ej. semana-2026-05-26)</label>
                      <input
                        className="puma-input"
                        value={missionId}
                        onChange={(e) => setMissionId(e.target.value)}
                        required
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Título visible</label>
                      <input
                        className="puma-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Recompensa (PUMA)</label>
                      <input
                        className="puma-input"
                        value={rewardPuma}
                        onChange={(e) => setRewardPuma(e.target.value)}
                        inputMode="decimal"
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Fecha límite (hora local)</label>
                      <input
                        className="puma-input"
                        type="datetime-local"
                        value={deadlineLocal}
                        onChange={(e) => setDeadlineLocal(e.target.value)}
                        required
                        style={{ marginBottom: '1rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--gold"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {isPending || confirming ? 'Enviando…' : 'Crear misión'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="puma-card">
                  <h3 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.05rem', marginTop: 0 }}>
                    Misiones existentes
                  </h3>
                  {loadingMissions && <p style={{ color: '#888' }}>Cargando…</p>}
                  {!loadingMissions && missions.length === 0 && (
                    <p style={{ color: '#888' }}>Ninguna misión todavía.</p>
                  )}
                  <div
                    className="puma-stagger"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                  >
                    {missions.map((m: PumaMissionRow, idx: number) => (
                      <div
                        key={m.missionId}
                        style={
                          {
                            '--i': idx,
                            padding: '0.9rem 1rem',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem',
                          } as React.CSSProperties
                        }
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#777' }}
                          >
                            {m.missionId}
                          </div>
                          <div style={{ color: '#E0E0E0', fontWeight: 600 }}>{m.title}</div>
                          <div
                            style={{
                              display: 'inline-flex',
                              gap: 8,
                              alignItems: 'center',
                              marginTop: 6,
                              flexWrap: 'wrap',
                            }}
                          >
                            <span className="puma-chip puma-chip--gold">
                              <FontAwesomeIcon icon={faCoins} /> {formatEther(m.reward)} PUMA
                            </span>
                            <span
                              className={`puma-chip ${
                                m.active ? 'puma-chip--green' : 'puma-chip--red'
                              }`}
                            >
                              {m.active ? 'activa' : 'desactivada'}
                            </span>
                          </div>
                        </div>
                        {m.active && hasMissionRole && (
                          <button
                            type="button"
                            onClick={() => deactivate(m.missionId)}
                            disabled={isPending || confirming}
                            className="puma-btn puma-btn--danger"
                            style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}
                          >
                            <FontAwesomeIcon icon={faStop} />
                            Desactivar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== RECOMPENSAS ==================== */}
            {tab === 'recompensas' && (
              <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
                {!hasRewardRole && (
                  <div className="puma-alert puma-alert--warn">
                    <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
                    <span>
                      Necesitas <code>REWARD_MANAGER_ROLE</code> para mintear, quemar, asignar
                      badge o nivel.
                    </span>
                  </div>
                )}

                {hasRewardRole && (
                  <div className="puma-card puma-card--rainbow">
                    <h3
                      style={{
                        fontFamily: 'Orbitron',
                        color: '#fff',
                        fontSize: '1.05rem',
                        marginTop: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <FontAwesomeIcon icon={faCoins} style={{ color: '#D4AF37' }} />
                      Mint directo de recompensa
                    </h3>
                    <form onSubmit={submitMint}>
                      <label className="puma-label">Wallet destino</label>
                      <input
                        className="puma-input"
                        value={mintTo}
                        onChange={(e) => setMintTo(e.target.value)}
                        placeholder="0x…"
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Cantidad (PUMA)</label>
                      <input
                        className="puma-input"
                        value={mintAmount}
                        onChange={(e) => setMintAmount(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Motivo (texto on-chain)</label>
                      <input
                        className="puma-input"
                        value={mintReason}
                        onChange={(e) => setMintReason(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--blue"
                      >
                        <FontAwesomeIcon icon={faCoins} />
                        {isPending || confirming ? 'Enviando…' : 'mintReward'}
                      </button>
                    </form>
                  </div>
                )}

                {hasRewardRole && (
                  <div className="puma-card">
                    <h3
                      style={{
                        fontFamily: 'Orbitron',
                        color: '#fff',
                        fontSize: '1.05rem',
                        marginTop: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <FontAwesomeIcon icon={faFire} style={{ color: '#fb923c' }} />
                      Quemar con allowance
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.55, marginTop: 0 }}>
                      La persona debe autorizar primero al contrato PUMA (
                      <code style={{ color: '#888' }}>approve</code>) por al menos la cantidad a
                      quemar.
                    </p>
                    <form onSubmit={submitBurn}>
                      <label className="puma-label">Wallet origen</label>
                      <input
                        className="puma-input"
                        value={burnFrom}
                        onChange={(e) => setBurnFrom(e.target.value)}
                        placeholder="0x…"
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Cantidad (PUMA)</label>
                      <input
                        className="puma-input"
                        value={burnAmount}
                        onChange={(e) => setBurnAmount(e.target.value)}
                        inputMode="decimal"
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Motivo</label>
                      <input
                        className="puma-input"
                        value={burnReason}
                        onChange={(e) => setBurnReason(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--danger"
                        style={{ color: '#fdba74', borderColor: 'rgba(251,146,60,0.5)' }}
                      >
                        <FontAwesomeIcon icon={faFire} />
                        burnReward
                      </button>
                    </form>
                  </div>
                )}

                {hasRewardRole && (
                  <div className="puma-card">
                    <h3
                      style={{
                        fontFamily: 'Orbitron',
                        color: '#fff',
                        fontSize: '1.05rem',
                        marginTop: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <FontAwesomeIcon icon={faMedal} style={{ color: '#F4D03F' }} />
                      Badge y nivel
                    </h3>
                    <form onSubmit={submitBadge} style={{ marginBottom: '1.5rem' }}>
                      <label className="puma-label">grantBadge — wallet</label>
                      <input
                        className="puma-input"
                        value={badgeUser}
                        onChange={(e) => setBadgeUser(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Etiqueta badge</label>
                      <input
                        className="puma-input"
                        value={badgeLabel}
                        onChange={(e) => setBadgeLabel(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--ghost"
                      >
                        <FontAwesomeIcon icon={faMedal} />
                        Otorgar badge
                      </button>
                    </form>
                    <form onSubmit={submitLevel}>
                      <label className="puma-label">setUserLevel — wallet</label>
                      <input
                        className="puma-input"
                        value={levelUser}
                        onChange={(e) => setLevelUser(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <label className="puma-label">Nivel</label>
                      <input
                        className="puma-input"
                        value={levelValue}
                        onChange={(e) => setLevelValue(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                      />
                      <button
                        type="submit"
                        disabled={isPending || confirming}
                        className="puma-btn puma-btn--ghost"
                      >
                        <FontAwesomeIcon icon={faSliders} />
                        Fijar nivel
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
            {/* ==================== DROPS ==================== */}
            {tab === 'drops' && (
              <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
                <DropsRoleWiring />
                <DropsAdminTab isAdmin={canViewAdminPanel} />
              </div>
            )}
            {/* ==================== SUSCRIPCIONES ==================== */}
            {tab === 'suscripciones' && (
              <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
                <SuscripcionesAdminTab isAdmin={canViewAdminPanel} />
              </div>
            )}
          </>
        )}

        {writeError && (
          <div className="puma-alert puma-alert--error" style={{ marginTop: '1.25rem' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span style={{ wordBreak: 'break-word' }}>{writeError.message.slice(0, 400)}</span>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminPuma
