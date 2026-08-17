import React, { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAccount,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGift,
  faCoins,
  faAward,
  faShieldHalved,
  faCheckCircle,
  faExternalLinkAlt,
  faWandMagicSparkles,
  faClock,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { criptoUnamDropsAbi, type DropRow } from '../../constants/criptoUnamDropsAbi'
import {
  DROPS_ADDRESS,
  dropsContractConfigured,
  useDropByCode,
  useHasClaimed,
} from '../../hooks/useDrops'
import { useWallet } from '../../context/WalletContext'
import ENV_CONFIG from '../../config/env'
import { BadgeKind, BADGE_KIND_LABEL } from '../../constants/criptoUnamBadgesAbi'
import { pumaBalanceQueryKey } from '../../hooks/usePumaTokenBalance'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'
import FaucetButton from './FaucetButton'

const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'

const Confetti: React.FC = () => {
  const pieces = useMemo(() => {
    const colors = ['#F4D03F', '#D4AF37', '#60a5fa', '#a78bfa', '#4ade80']
    return Array.from({ length: 24 }, (_, i) => ({
      key: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.3}s`,
      color: colors[i % colors.length],
    }))
  }, [])
  return (
    <div className="puma-confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.key}
          style={{ left: p.left, background: p.color, animationDelay: p.delay }}
        />
      ))}
    </div>
  )
}

const DropCodeClaim: React.FC = () => {
  const queryClient = useQueryClient()
  const { isConnected, connectWallet } = useWallet()
  const { address } = useAccount()
  const wagmiConfig = useConfig()

  // La tx DEBE firmarse en la red de los contratos (43113 Fuji). useEnsureNetwork
  // sincroniza AppKit + wagmi y valida el cambio antes de firmar.
  const { ensure: ensureTargetChain, wrongNetwork, currentChainId, targetChainId } =
    useEnsureNetwork()
  const targetChain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const [codeInput, setCodeInput] = useState('')
  const [submittedCode, setSubmittedCode] = useState('')

  const { data: dropRaw, isFetching: dropFetching, refetch: refetchDrop } = useDropByCode(submittedCode)
  const drop = dropRaw as DropRow | undefined
  const { data: claimedBefore, refetch: refetchClaimed } = useHasClaimed(submittedCode, address)

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } =
    useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txOk) {
      refetchDrop()
      refetchClaimed()
      if (address) {
        queryClient.invalidateQueries({ queryKey: pumaBalanceQueryKey(address) })
      }
    }
  }, [txOk, refetchDrop, refetchClaimed, queryClient, address])

  const busy = isPending || confirming
  const now = Math.floor(Date.now() / 1000)
  const expired = !!drop && drop.exists && Number(drop.deadline) > 0 && now > Number(drop.deadline)
  const dropFound = !!drop && drop.exists
  const canClaim =
    dropFound &&
    drop.active &&
    !expired &&
    !claimedBefore &&
    isConnected &&
    !!targetChain &&
    !!address

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const c = codeInput.trim()
    if (!c) return
    reset()
    setSubmittedCode(c)
  }

  const claim = async () => {
    if (!canClaim || !targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: DROPS_ADDRESS,
      abi: criptoUnamDropsAbi,
      functionName: 'claimDrop',
      args: [submittedCode],
      chain: targetChain,
      account: address,
    })
  }

  /* ============================================================ */
  if (!dropsContractConfigured) {
    return (
      <div className="puma-card" style={{ textAlign: 'center' }}>
        <div className="puma-alert puma-alert--warn" style={{ display: 'inline-flex' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span>
            El contrato de drops aún no está enlazado en esta red. Pronto podrás reclamar PUMA +
            POAP con código.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="puma-card puma-card--featured puma-card--rainbow puma-fade-in-up"
      style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="puma-pulse-ring"
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 26px rgba(212,175,55,0.4)',
          }}
        >
          <FontAwesomeIcon icon={faGift} style={{ color: '#0a0a0a', fontSize: '1.3rem' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            className="puma-title-glow"
            style={{
              fontFamily: 'Chakra Petch',
              fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Reclamar con código
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
            ¿Estuviste en una sesión? Escribe el código que el equipo dictó.
          </p>
        </div>
      </div>

      <form onSubmit={search} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <input
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="ej. sesion-26-mayo"
          className="puma-input"
          style={{
            flex: '1 1 200px',
            marginBottom: 0,
            fontSize: '1.05rem',
            fontFamily: 'monospace',
          }}
        />
        <button
          type="submit"
          disabled={!codeInput.trim()}
          className="puma-btn puma-btn--gold"
          style={{ flex: '0 0 auto' }}
        >
          Ver drop
        </button>
      </form>

      {dropFetching && submittedCode && (
        <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.9rem' }}>Consultando código…</p>
      )}

      {submittedCode && !dropFetching && !dropFound && (
        <div className="puma-alert puma-alert--error" style={{ marginTop: '1rem' }}>
          <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
          <span>
            No encontramos un drop con el código <code>{submittedCode}</code>. Revisa que esté
            escrito tal cual lo dictó el equipo.
          </span>
        </div>
      )}

      {dropFound && (
        <div
          className="puma-fade-in-up"
          style={{
            marginTop: '1.25rem',
            padding: '1.1rem 1.2rem',
            borderRadius: 14,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(212,175,55,0.3)',
          }}
        >
          <h3
            style={{
              color: '#F4D03F',
              fontFamily: 'Chakra Petch',
              margin: '0 0 0.5rem',
              fontSize: '1.1rem',
            }}
          >
            {drop.title}
          </h3>

          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: '0.85rem',
            }}
          >
            {drop.pumaReward > 0n && (
              <span className="puma-chip puma-chip--gold">
                <FontAwesomeIcon icon={faCoins} />
                +{formatEther(drop.pumaReward)} PUMA
              </span>
            )}
            {drop.badgeRef && (
              <span className="puma-chip puma-chip--blue">
                <FontAwesomeIcon icon={faAward} />
                NFT · {BADGE_KIND_LABEL[drop.badgeKind as BadgeKind]}
              </span>
            )}
            <span
              className={`puma-chip ${
                drop.active && !expired
                  ? 'puma-chip--green'
                  : expired
                  ? 'puma-chip--amber'
                  : 'puma-chip--red'
              }`}
            >
              <FontAwesomeIcon icon={faClock} />
              {drop.active && !expired
                ? `Vence ${new Date(Number(drop.deadline) * 1000).toLocaleString()}`
                : expired
                ? 'Expirado'
                : 'Desactivado'}
            </span>
            {claimedBefore && (
              <span className="puma-chip puma-chip--green">
                <FontAwesomeIcon icon={faCheckCircle} />
                Ya lo reclamaste
              </span>
            )}
          </div>

          {!isConnected && (
            <>
              <p style={{ color: '#cbd5e1', marginBottom: '0.85rem', fontSize: '0.92rem' }}>
                Conecta tu wallet para reclamar.
              </p>
              <button
                type="button"
                onClick={() => connectWallet()}
                className="puma-btn puma-btn--gold"
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                Conectar wallet
              </button>
            </>
          )}

          {isConnected && txOk && (
            <div
              className="puma-alert puma-alert--success puma-pop-in"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3, fontSize: '1.1rem' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ color: '#bbf7d0' }}>¡Reclamado!</strong>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem' }}>
                  {drop.pumaReward > 0n &&
                    `${formatEther(drop.pumaReward)} PUMA acuñados a tu wallet.`}
                  {drop.badgeRef && drop.pumaReward > 0n && <br />}
                  {drop.badgeRef && `POAP "${drop.badgeRef}" minteado.`}
                  {txHash && (
                    <>
                      <br />
                      <a
                        href={`${explorerBase}/tx/${txHash}`}
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
                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
                      </a>
                    </>
                  )}
                </p>
              </div>
              <Confetti />
            </div>
          )}

          {isConnected && !txOk && (
            <>
              {wrongNetwork && (
                <div className="puma-alert puma-alert--warn" style={{ marginBottom: '0.75rem' }}>
                  <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
                  <span style={{ fontSize: '0.85rem' }}>
                    Tu wallet está en la red {currentChainId}. Al reclamar se cambiará a{' '}
                    <strong>{targetChain?.name ?? `chain ${targetChainId}`}</strong>; acepta el
                    cambio en tu wallet.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={claim}
                disabled={!canClaim || busy}
                className="puma-btn puma-btn--gold"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <FontAwesomeIcon icon={faGift} />
                {busy
                  ? 'Reclamando…'
                  : claimedBefore
                  ? 'Ya reclamado'
                  : expired
                  ? 'Expirado'
                  : !drop.active
                  ? 'Drop desactivado'
                  : wrongNetwork
                  ? `Cambiar a ${targetChain?.name ?? 'red correcta'} y reclamar`
                  : 'Reclamar ahora'}
              </button>

              {/* El claim cuesta gas. En testnet ofrecemos AVAX gratis. */}
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
                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                  ¿Sin AVAX para el gas?
                </span>
                <FaucetButton compact style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }} />
              </div>
            </>
          )}

          {writeError && (
            <div className="puma-alert puma-alert--error" style={{ marginTop: '0.85rem' }}>
              <span style={{ wordBreak: 'break-word', fontSize: '0.85rem' }}>
                {writeError.message.slice(0, 220)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DropCodeClaim
