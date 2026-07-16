import React, { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useConfig, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import { pumaCompleteMissionAbi, type PumaMissionRow } from '../../constants/pumaTokenAbi'
import { usePumaMissionClaims, isGameMission } from '../../hooks/usePumaMissions'
import { pumaBalanceQueryKey } from '../../hooks/usePumaTokenBalance'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'
import ENV_CONFIG from '../../config/env'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`

type Props = {
  missions: PumaMissionRow[]
  isLoading: boolean
  onTxConfirmed: () => void
  /** Textos en lenguaje claro para la comunidad. */
  tone?: 'embajador' | 'neutral'
  /** 'list' (default) = columna vertical · 'carousel' = scroll horizontal con snap. */
  layout?: 'list' | 'carousel'
}

const PumaMissionsSection: React.FC<Props> = ({
  missions,
  isLoading,
  onTxConfirmed,
  tone = 'neutral',
  layout = 'list',
}) => {
  const queryClient = useQueryClient()
  const { address } = useAccount()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const targetChain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const { data: claimedMap, refetch: refetchClaims } = usePumaMissionClaims(missions, address)

  const {
    writeContract,
    data: txHash,
    isPending: isSendingTx,
    error: writeError,
    reset,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txSuccess) {
      refetchClaims()
      onTxConfirmed()
      if (address) {
        queryClient.invalidateQueries({ queryKey: pumaBalanceQueryKey(address) })
      }
      reset()
    }
  }, [txSuccess, refetchClaims, onTxConfirmed, reset, queryClient, address])

  const busy = isSendingTx || isConfirming

  const claim = async (missionId: string, canClaim: boolean) => {
    if (!canClaim || !targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: tokenAddr,
      abi: pumaCompleteMissionAbi,
      functionName: 'completeMission',
      args: [missionId],
      chain: targetChain,
      account: address,
    })
  }

  const loadingMsg =
    tone === 'embajador'
      ? 'Estamos trayendo la lista de misiones…'
      : 'Cargando misiones desde el contrato…'
  const emptyMsg =
    tone === 'embajador' ? (
      <span>
        Todavía no hay misiones publicadas en esta red. Cuando el equipo publique una, la verás aquí al instante.
      </span>
    ) : (
      <span>
        Aún no hay misiones registradas en esta red. Cuando el equipo cree una con{' '}
        <code style={{ color: '#777' }}>createMission</code>, aparecerá aquí (también puedes usar el{' '}
        <strong style={{ color: '#D4AF37' }}>panel admin PUMA</strong>).
      </span>
    )

  if (isLoading) {
    return (
      <p style={{ color: '#888', textAlign: 'center', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>
        <FontAwesomeIcon icon={faClock} style={{ marginRight: 8 }} />
        {loadingMsg}
      </p>
    )
  }

  const displayMissions = missions.filter((m) => !isGameMission(m.missionId))

  if (displayMissions.length === 0) {
    return (
      <p style={{ color: '#888', textAlign: 'center', margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1rem)' }}>{emptyMsg}</p>
    )
  }

  const nowSec = Math.floor(Date.now() / 1000)

  const isCarousel = layout === 'carousel'
  const containerStyle: React.CSSProperties = isCarousel
    ? {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.85rem',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollPadding: '0 1rem',
        paddingBottom: '0.5rem',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
      }
    : { display: 'flex', flexDirection: 'column', gap: '1rem' }

  const cardLayoutStyle: React.CSSProperties = isCarousel
    ? {
        flex: '0 0 clamp(260px, 80vw, 320px)',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.85rem',
        padding: '1rem 1.1rem',
        minHeight: 200,
      }
    : {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: 'clamp(0.9rem, 3vw, 1.15rem) clamp(1rem, 3vw, 1.35rem)',
      }

  return (
    <div className="puma-stagger" style={containerStyle}>
      {displayMissions.map((m, idx) => {
        const expired = m.deadline > 0n ? nowSec > Number(m.deadline) : false
        const claimed = claimedMap?.[m.missionId] === true
        const canClaim =
          !!targetChain && !!address && m.exists && m.active && !expired && !claimed

        let statusChip: React.ReactNode = null
        if (!m.exists || !m.active) {
          statusChip = (
            <span className="puma-chip puma-chip--amber">
              {tone === 'embajador' ? 'Cerrada por el equipo' : 'No disponible'}
            </span>
          )
        } else if (expired) {
          statusChip = <span className="puma-chip puma-chip--red">Expirada</span>
        } else if (claimed) {
          statusChip = (
            <span className="puma-chip puma-chip--green">
              <FontAwesomeIcon icon={faCheck} />
              {tone === 'embajador' ? 'Ya cobraste' : 'Reclamada'}
            </span>
          )
        } else {
          statusChip = <span className="puma-chip puma-chip--green">Disponible</span>
        }

        const missionColors = [
          { border: '#F4D03F', bg: 'linear-gradient(90deg, rgba(244,208,63,0.12) 0%, rgba(20,20,30,0.88) 100%)', badgeColor: '#F4D03F' },
          { border: '#60A5FA', bg: 'linear-gradient(90deg, rgba(96,165,250,0.12) 0%, rgba(20,20,30,0.88) 100%)', badgeColor: '#60A5FA' },
          { border: '#4ADE80', bg: 'linear-gradient(90deg, rgba(74,222,128,0.12) 0%, rgba(20,20,30,0.88) 100%)', badgeColor: '#4ADE80' },
          { border: '#A78BFA', bg: 'linear-gradient(90deg, rgba(167,139,250,0.12) 0%, rgba(20,20,30,0.88) 100%)', badgeColor: '#A78BFA' },
          { border: '#FB923C', bg: 'linear-gradient(90deg, rgba(251,146,60,0.12) 0%, rgba(20,20,30,0.88) 100%)', badgeColor: '#FB923C' },
        ]
        const cTheme = missionColors[idx % missionColors.length]

        return (
          <div
            key={m.missionId}
            className={`puma-card ${canClaim ? 'puma-glow' : ''}`}
            style={
              {
                '--i': idx,
                ...cardLayoutStyle,
                background: cTheme.bg,
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: `5px solid ${cTheme.border}`,
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                minHeight: 'auto',
              } as React.CSSProperties
            }
          >
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    color: cTheme.badgeColor,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {m.missionId}
                </span>
                {statusChip}
              </div>
              <div
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  marginBottom: '0.4rem',
                  fontSize: 'clamp(0.92rem, 2.3vw, 1.02rem)',
                  lineHeight: 1.3,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    color: cTheme.badgeColor,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <FontAwesomeIcon icon={faCoins} />
                  +{formatEther(m.reward)} PUMA
                </span>
              </div>
            </div>
            <div>
              <button
                type="button"
                disabled={!canClaim || busy}
                onClick={() => claim(m.missionId, canClaim)}
                className={canClaim ? 'puma-btn puma-btn--gold' : 'puma-btn puma-btn--ghost'}
                style={{ whiteSpace: 'nowrap', padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
              >
                {busy ? 'Procesando…' : claimed ? 'Listo' : 'Reclamar PUMA'}
              </button>
            </div>
          </div>
        )
      })}
      {writeError && (
        <div className="puma-alert puma-alert--error">
          <span>{writeError.message.slice(0, 220)}</span>
        </div>
      )}
      {!address && (
        <p
          style={{
            color: '#888',
            fontSize: 'clamp(0.85rem, 2.4vw, 0.95rem)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {tone === 'embajador'
            ? 'Conecta tu wallet para reclamar y para que podamos marcar si ya cobraste esta misión.'
            : 'Conecta tu wallet para ver si ya reclamaste y para reclamar recompensas.'}
        </p>
      )}
    </div>
  )
}

export default PumaMissionsSection
