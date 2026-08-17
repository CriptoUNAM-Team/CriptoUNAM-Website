import React, { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faGift, faShieldHalved, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import { BadgeKind, BADGE_KIND_LABEL } from '../../constants/criptoUnamBadgesAbi'
import { useWallet } from '../../context/WalletContext'
import ENV_CONFIG from '../../config/env'

type ClaimStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success'; tokenId?: string; txHash?: string }
  | { state: 'error'; message: string }

const KIND_OPTIONS: Array<{ value: BadgeKind; label: string }> = [
  { value: BadgeKind.CourseCompletion, label: BADGE_KIND_LABEL[BadgeKind.CourseCompletion] },
  { value: BadgeKind.EventAttendance, label: BADGE_KIND_LABEL[BadgeKind.EventAttendance] },
  { value: BadgeKind.Ambassador, label: BADGE_KIND_LABEL[BadgeKind.Ambassador] },
  { value: BadgeKind.Certification, label: BADGE_KIND_LABEL[BadgeKind.Certification] },
]

const BadgeCodeClaimPanel: React.FC = () => {
  const claimEndpoint = ENV_CONFIG.BADGES_CLAIM_ENDPOINT
  const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://testnet.snowtrace.io'
  const { address, isConnected } = useAccount()
  const { connectWallet } = useWallet()

  const [kind, setKind] = useState<BadgeKind>(BadgeKind.EventAttendance)
  const [refValue, setRefValue] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<ClaimStatus>({ state: 'idle' })

  const busy = status.state === 'submitting'

  const placeholder = useMemo(() => {
    if (kind === BadgeKind.CourseCompletion) return 'solidity-101-2026-q2'
    if (kind === BadgeKind.Certification) return 'certificacion-defi-2026'
    if (kind === BadgeKind.Ambassador) return 'embajadores-13-mayo-2026'
    return 'evento-web3-unam-2026'
  }, [kind])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !claimEndpoint || !refValue.trim() || !code.trim()) return
    setStatus({ state: 'submitting' })
    try {
      const res = await fetch(claimEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          kind,
          ref: refValue.trim(),
          code: code.trim(),
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Error ${res.status}`)
      }
      const data = (await res.json()) as { tokenId?: string; txHash?: string }
      setStatus({ state: 'success', tokenId: data.tokenId, txHash: data.txHash })
      setCode('')
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message.slice(0, 220) : 'No se pudo validar tu código.',
      })
    }
  }

  return (
    <div className="puma-card puma-card--featured">
      <h2
        style={{
          color: '#fff',
          fontFamily: 'Chakra Petch',
          fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
          margin: '0 0 0.65rem',
        }}
      >
        Reclamar credenciales con código
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1rem', lineHeight: 1.55 }}>
        Usa este formulario para códigos de curso, evento, embajador o certificación.
      </p>

      {!claimEndpoint && (
        <div className="puma-alert puma-alert--warn" style={{ marginBottom: '0.9rem' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span>
            Falta configurar <code>VITE_BADGES_CLAIM_ENDPOINT</code>. Sin ese endpoint no se puede
            validar el código de credenciales.
          </span>
        </div>
      )}

      {!isConnected ? (
        <button type="button" className="puma-btn puma-btn--gold" onClick={() => connectWallet()}>
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          Conectar wallet
        </button>
      ) : (
        <form onSubmit={submit}>
          <label className="puma-label">Tipo</label>
          <select
            className="puma-input"
            value={String(kind)}
            onChange={(e) => setKind(Number(e.target.value) as BadgeKind)}
            style={{ marginBottom: '0.85rem' }}
          >
            {KIND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <label className="puma-label">Identificador (ref)</label>
          <input
            className="puma-input"
            value={refValue}
            onChange={(e) => setRefValue(e.target.value)}
            placeholder={placeholder}
            style={{ marginBottom: '0.85rem' }}
            required
          />

          <label className="puma-label">Código de reclamo</label>
          <input
            className="puma-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código compartido por el equipo"
            style={{ marginBottom: '0.85rem' }}
            required
          />

          <button
            type="submit"
            className="puma-btn puma-btn--gold"
            style={{ width: '100%' }}
            disabled={busy || !claimEndpoint || !refValue.trim() || !code.trim()}
          >
            <FontAwesomeIcon icon={busy ? faWandMagicSparkles : faGift} />
            {busy ? 'Validando código…' : 'Reclamar credencial'}
          </button>
        </form>
      )}

      {status.state === 'success' && (
        <div className="puma-alert puma-alert--success" style={{ marginTop: '0.9rem' }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3 }} />
          <span>
            ¡Reclamo exitoso! {status.tokenId ? `Token #${status.tokenId}. ` : ''}
            {status.txHash && (
              <a
                href={`${explorerBase}/tx/${status.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#86efac', fontWeight: 600 }}
              >
                Ver transacción
              </a>
            )}
          </span>
        </div>
      )}

      {status.state === 'error' && (
        <div className="puma-alert puma-alert--error" style={{ marginTop: '0.9rem' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span style={{ wordBreak: 'break-word' }}>{status.message}</span>
        </div>
      )}
    </div>
  )
}

export default BadgeCodeClaimPanel
