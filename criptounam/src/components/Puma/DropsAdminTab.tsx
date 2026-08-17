import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faStop,
  faShieldHalved,
  faGift,
  faTriangleExclamation,
  faClock,
  faCoins,
  faAward,
  faCopy,
} from '@fortawesome/free-solid-svg-icons'
import { criptoUnamDropsAbi, type DropRow } from '../../constants/criptoUnamDropsAbi'
import {
  DROPS_ADDRESS,
  dropsContractConfigured,
  useAllDrops,
  useIsDropManager,
} from '../../hooks/useDrops'
import { BadgeKind, BADGE_KIND_LABEL } from '../../constants/criptoUnamBadgesAbi'
import { EMBAJADORES_MAY_13_2026 } from '../../constants/dropPresets'
import FaucetButton from './FaucetButton'

type Props = {
  isAdmin: boolean
}

const DropsAdminTab: React.FC<Props> = ({ isAdmin }) => {
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()

  // Red destino de los contratos (43113 Fuji por defecto). useEnsureNetwork
  // sincroniza AppKit + wagmi y valida el cambio antes de firmar.
  const { ensure: ensureTargetChain, wrongNetwork, currentChainId, targetChainId } =
    useEnsureNetwork()
  const targetChain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const { data: hasDropRole, isLoading: roleLoading } = useIsDropManager(address)
  const { data: drops = [], isLoading: dropsLoading, refetch } = useAllDrops()

  const canManage = Boolean(isAdmin || hasDropRole)

  /* ---- Form state ---- */
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [pumaReward, setPumaReward] = useState('50')
  const [badgeKind, setBadgeKind] = useState<BadgeKind>(BadgeKind.Ambassador)
  const [badgeRef, setBadgeRef] = useState('')
  const [badgeUri, setBadgeUri] = useState('')
  const [deadlineHours, setDeadlineHours] = useState<'24' | '48' | '168' | 'custom'>('48')
  const [customDeadlineLocal, setCustomDeadlineLocal] = useState('')

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } =
    useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txOk) {
      refetch()
      reset()
      // limpiamos sólo después de crear con éxito
      setCode('')
      setBadgeRef('')
    }
  }, [txOk, refetch, reset])

  const computeDeadline = (): bigint | null => {
    if (deadlineHours === 'custom') {
      if (!customDeadlineLocal) return null
      const sec = Math.floor(new Date(customDeadlineLocal).getTime() / 1000)
      if (sec <= Math.floor(Date.now() / 1000)) return null
      return BigInt(sec)
    }
    const h = parseInt(deadlineHours, 10)
    return BigInt(Math.floor(Date.now() / 1000) + h * 3600)
  }

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetChain || !address) return
    if (!code.trim() || !title.trim()) return
    const deadline = computeDeadline()
    if (!deadline) return

    let pumaWei = 0n
    if (pumaReward.trim() && pumaReward !== '0') {
      try {
        pumaWei = parseEther(pumaReward.trim())
      } catch {
        return
      }
    }

    if (!(await ensureTargetChain())) return

    writeContract({
      address: DROPS_ADDRESS,
      abi: criptoUnamDropsAbi,
      functionName: 'createDrop',
      args: [
        code.trim(),
        title.trim(),
        pumaWei,
        badgeKind,
        badgeRef.trim(),
        badgeUri.trim(),
        deadline,
      ],
      chain: targetChain,
      account: address,
    })
  }

  const submitDeactivate = async (codeStr: string) => {
    if (!targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: DROPS_ADDRESS,
      abi: criptoUnamDropsAbi,
      functionName: 'deactivateDrop',
      args: [codeStr],
      chain: targetChain,
      account: address,
    })
  }

  const busy = isPending || confirming

  /* ============================================================ */
  if (!dropsContractConfigured) {
    return (
      <div className="puma-alert puma-alert--warn">
        <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
        <span>
          Aún no enlazamos el contrato <code>CriptoUNAMDrops</code> en esta red. Configura{' '}
          <code>VITE_DROPS_CONTRACT_ADDRESS</code> después del deploy.
        </span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="puma-alert puma-alert--info">
        Conecta tu wallet para gestionar drops.
      </div>
    )
  }

  if (!roleLoading && !canManage) {
    return (
      <div className="puma-alert puma-alert--error">
        <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
        <span>
          Necesitas <code>DROP_MANAGER_ROLE</code> en el contrato de Drops para crear o cerrar drops.
        </span>
      </div>
    )
  }

  return (
    <div className="puma-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
      {/* ============= CREAR DROP ============= */}
      <div className="puma-card puma-card--rainbow">
        <h3
          style={{
            fontFamily: 'Chakra Petch',
            color: '#fff',
            fontSize: '1.05rem',
            marginTop: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesomeIcon icon={faGift} style={{ color: '#D4AF37' }} />
          Crear drop con código
        </h3>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.88rem',
            lineHeight: 1.55,
            marginTop: 0,
            marginBottom: '1rem',
          }}
        >
          El código se dicta en la sesión. Quien lo escriba en{' '}
          <code style={{ color: '#fff' }}>/recompensas/misiones</code> recibe PUMA + POAP. Una sola tx por wallet.
        </p>

        <button
          type="button"
          className="puma-btn puma-btn--ghost"
          style={{ width: '100%', marginBottom: '1rem', justifyContent: 'center' }}
          onClick={() => {
            setCode(EMBAJADORES_MAY_13_2026.code)
            setTitle(EMBAJADORES_MAY_13_2026.title)
            setPumaReward(EMBAJADORES_MAY_13_2026.pumaReward)
            setBadgeRef('')
            setBadgeUri('')
            setDeadlineHours('custom')
            setCustomDeadlineLocal(EMBAJADORES_MAY_13_2026.deadlineLocal)
          }}
        >
          Plantilla: Sesión Embajadores 13 mayo 2026 (5,000 PUMA)
        </button>

        <form onSubmit={submitCreate}>
          <label className="puma-label">Código (se dirá en la sesión)</label>
          <input
            className="puma-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="sesion-26-mayo"
            required
            style={{ marginBottom: '0.75rem' }}
          />

          <label className="puma-label">Título visible</label>
          <input
            className="puma-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sesión Embajadores · 26 mayo 2026"
            required
            style={{ marginBottom: '0.75rem' }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <label className="puma-label">Recompensa $PUMA</label>
              <input
                className="puma-input"
                value={pumaReward}
                onChange={(e) => setPumaReward(e.target.value)}
                inputMode="decimal"
                placeholder="50"
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label className="puma-label">Tipo de POAP</label>
              <select
                className="puma-select"
                value={badgeKind}
                onChange={(e) => setBadgeKind(Number(e.target.value) as BadgeKind)}
                style={{ marginBottom: 0 }}
              >
                <option value={BadgeKind.Ambassador}>{BADGE_KIND_LABEL[BadgeKind.Ambassador]}</option>
                <option value={BadgeKind.EventAttendance}>
                  {BADGE_KIND_LABEL[BadgeKind.EventAttendance]}
                </option>
                <option value={BadgeKind.CourseCompletion}>
                  {BADGE_KIND_LABEL[BadgeKind.CourseCompletion]}
                </option>
                <option value={BadgeKind.Certification}>
                  {BADGE_KIND_LABEL[BadgeKind.Certification]}
                </option>
              </select>
            </div>
          </div>

          <label className="puma-label">
            Ref único del NFT <span style={{ color: '#777' }}>(vacío = drop solo PUMA)</span>
          </label>
          <input
            className="puma-input"
            value={badgeRef}
            onChange={(e) => setBadgeRef(e.target.value)}
            placeholder="ambassador-2026-05-26"
            style={{ marginBottom: '0.75rem' }}
          />

          <label className="puma-label">URI de metadata (IPFS o https)</label>
          <input
            className="puma-input"
            value={badgeUri}
            onChange={(e) => setBadgeUri(e.target.value)}
            placeholder="ipfs://CID/sesion-26-mayo.json"
            style={{ marginBottom: '0.75rem' }}
          />

          <label className="puma-label">Vence en</label>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: deadlineHours === 'custom' ? '0.75rem' : '1rem',
            }}
          >
            {(['24', '48', '168', 'custom'] as const).map((v) => {
              const labels: Record<typeof v, string> = {
                '24': '24 horas',
                '48': '48 horas',
                '168': '7 días',
                custom: 'Personalizado',
              }
              const active = deadlineHours === v
              return (
                <button
                  type="button"
                  key={v}
                  onClick={() => setDeadlineHours(v)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: 10,
                    border: `1px solid ${active ? '#F4D03F' : 'rgba(212,175,55,0.3)'}`,
                    background: active
                      ? 'linear-gradient(135deg, #F4D03F, #D4AF37)'
                      : 'rgba(212,175,55,0.08)',
                    color: active ? '#0a0a0a' : '#D4AF37',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {labels[v]}
                </button>
              )
            })}
          </div>
          {deadlineHours === 'custom' && (
            <input
              type="datetime-local"
              className="puma-input"
              value={customDeadlineLocal}
              onChange={(e) => setCustomDeadlineLocal(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />
          )}

          {wrongNetwork && (
            <div className="puma-alert puma-alert--warn" style={{ marginBottom: '0.85rem' }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
              <span style={{ fontSize: '0.85rem' }}>
                Tu wallet está en la red {currentChainId}. Al crear el drop se cambiará automáticamente a{' '}
                <strong>{targetChain?.name ?? `chain ${targetChainId}`}</strong>, donde viven los
                contratos. Acepta el cambio de red en tu wallet.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="puma-btn puma-btn--gold"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faPlus} />
            {busy ? 'Procesando…' : wrongNetwork ? `Cambiar a ${targetChain?.name ?? 'red correcta'} y crear` : 'Crear drop'}
          </button>

          {/* Crear/cerrar drops cuesta gas. En testnet ofrecemos AVAX gratis. */}
          <div
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>¿Sin AVAX para el gas?</span>
            <FaucetButton compact style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }} />
          </div>

          {writeError && (
            <div className="puma-alert puma-alert--error" style={{ marginTop: '0.85rem' }}>
              <span style={{ wordBreak: 'break-word' }}>{writeError.message.slice(0, 220)}</span>
            </div>
          )}
        </form>

        <div className="puma-alert puma-alert--info" style={{ marginTop: '1.25rem' }}>
          <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
          <span style={{ fontSize: '0.85rem' }}>
            Para que <code>claimDrop</code> funcione, este contrato debe tener{' '}
            <code>REWARD_MANAGER_ROLE</code> en PUMA y <code>MINTER_ROLE</code> en Badges. Si los
            falta, los reclamos fallarán al intentar mintear.
          </span>
        </div>
      </div>

      {/* ============= LISTA DE DROPS ============= */}
      <div className="puma-card">
        <h3 style={{ fontFamily: 'Chakra Petch', color: '#fff', fontSize: '1.05rem', marginTop: 0 }}>
          Drops registrados
        </h3>
        {dropsLoading && <p style={{ color: '#888' }}>Cargando…</p>}
        {!dropsLoading && drops.length === 0 && (
          <p style={{ color: '#888' }}>Ninguno todavía. Crea el primero arriba.</p>
        )}
        <div
          className="puma-stagger"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {drops.map((d: DropRow & { codeHash: `0x${string}` }, idx: number) => {
            const expired = Number(d.deadline) * 1000 < Date.now()
            return (
              <div
                key={d.codeHash}
                style={
                  {
                    '--i': idx,
                    padding: '0.95rem 1rem',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.3)',
                  } as React.CSSProperties
                }
              >
                <div style={{ color: '#E0E0E0', fontWeight: 600, marginBottom: 4 }}>{d.title}</div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    color: '#777',
                    marginBottom: 8,
                  }}
                >
                  hash: {d.codeHash.slice(0, 18)}…
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  {d.pumaReward > 0n && (
                    <span className="puma-chip puma-chip--gold">
                      <FontAwesomeIcon icon={faCoins} />
                      {formatEther(d.pumaReward)} PUMA
                    </span>
                  )}
                  {d.badgeRef && (
                    <span className="puma-chip puma-chip--blue">
                      <FontAwesomeIcon icon={faAward} />
                      {BADGE_KIND_LABEL[d.badgeKind as BadgeKind]}
                    </span>
                  )}
                  <span
                    className={`puma-chip ${
                      d.active && !expired
                        ? 'puma-chip--green'
                        : expired
                        ? 'puma-chip--amber'
                        : 'puma-chip--red'
                    }`}
                  >
                    <FontAwesomeIcon icon={faClock} />
                    {d.active && !expired ? 'Activo' : expired ? 'Expirado' : 'Desactivado'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#777', marginBottom: 8 }}>
                  Vence: {new Date(Number(d.deadline) * 1000).toLocaleString()}
                </div>
                {d.active && !expired && (
                  <button
                    type="button"
                    onClick={() => {
                      const codeInput = prompt(
                        `Confirma el código (texto original que se dictó) para desactivar "${d.title}":`
                      )
                      if (codeInput) submitDeactivate(codeInput.trim())
                    }}
                    disabled={busy}
                    className="puma-btn puma-btn--danger"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <FontAwesomeIcon icon={faStop} />
                    Desactivar
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DropsAdminTab
