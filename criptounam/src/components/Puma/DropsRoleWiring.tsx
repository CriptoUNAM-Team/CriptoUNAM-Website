import React, { useEffect } from 'react'
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { keccak256, toBytes } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faCheckCircle,
  faTriangleExclamation,
  faLink,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'
import { pumaTokenAbi } from '../../constants/pumaTokenAbi'
import { criptoUnamBadgesAbi } from '../../constants/criptoUnamBadgesAbi'
import { DROPS_ADDRESS } from '../../hooks/useDrops'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'

const PUMA_ADDRESS = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const BADGES_ADDRESS = ENV_CONFIG.BADGES_CONTRACT_ADDRESS as `0x${string}`

const REWARD_MANAGER_ROLE = keccak256(toBytes('REWARD_MANAGER_ROLE'))
const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'))

/**
 * Cablea los roles que el contrato Drops necesita para mintear al reclamar:
 *  - REWARD_MANAGER_ROLE en PUMA  (para acuñar PUMA)
 *  - MINTER_ROLE en Badges        (para acuñar el POAP)
 *
 * Quien firma debe tener DEFAULT_ADMIN_ROLE en cada contrato (la wallet que
 * desplegó). No otorga roles a humanos: el destinatario es la dirección del
 * contrato Drops.
 */
const DropsRoleWiring: React.FC = () => {
  const { address, isConnected } = useAccount()
  const wagmiConfig = useConfig()

  const { ensure: ensureTargetChain, wrongNetwork, currentChainId, targetChainId } =
    useEnsureNetwork()
  const targetChain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const {
    data: pumaRole,
    isLoading: pumaRoleLoading,
    refetch: refetchPuma,
  } = useReadContract({
    address: PUMA_ADDRESS,
    abi: pumaTokenAbi,
    functionName: 'hasRole',
    args: [REWARD_MANAGER_ROLE, DROPS_ADDRESS],
    chainId: targetChainId,
  })

  const {
    data: badgesRole,
    isLoading: badgesRoleLoading,
    refetch: refetchBadges,
  } = useReadContract({
    address: BADGES_ADDRESS,
    abi: criptoUnamBadgesAbi,
    functionName: 'hasRole',
    args: [MINTER_ROLE, DROPS_ADDRESS],
    chainId: targetChainId,
  })

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txOk) {
      refetchPuma()
      refetchBadges()
      reset()
    }
  }, [txOk, refetchPuma, refetchBadges, reset])

  const grantPumaRole = async () => {
    if (!targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: PUMA_ADDRESS,
      abi: pumaTokenAbi,
      functionName: 'grantRole',
      args: [REWARD_MANAGER_ROLE, DROPS_ADDRESS],
      chain: targetChain,
      account: address,
    })
  }

  const grantBadgesRole = async () => {
    if (!targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: BADGES_ADDRESS,
      abi: criptoUnamBadgesAbi,
      functionName: 'grantRole',
      args: [MINTER_ROLE, DROPS_ADDRESS],
      chain: targetChain,
      account: address,
    })
  }

  const busy = isPending || confirming
  const allWired = pumaRole === true && badgesRole === true

  if (!isConnected) {
    return (
      <div className="puma-alert puma-alert--info">
        Conecta la wallet <strong>admin</strong> (la que desplegó los contratos) para cablear los
        roles del Drops.
      </div>
    )
  }

  return (
    <div className="puma-card" style={{ display: 'grid', gap: '1rem' }}>
      <h3
        style={{
          fontFamily: 'Orbitron',
          color: '#fff',
          fontSize: '1.05rem',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <FontAwesomeIcon icon={faLink} style={{ color: '#D4AF37' }} />
        Cablear permisos del Drops
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
        El contrato Drops necesita permiso para acuñar PUMA y POAPs cuando un usuario reclama. Sin
        estos roles, <code>claimDrop</code> revierte. Debes firmar con la wallet{' '}
        <strong>admin</strong> que desplegó los contratos.
      </p>

      {allWired && (
        <div className="puma-alert puma-alert--success">
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3 }} />
          <span>Listo: el Drops tiene ambos roles. Los reclamos ya pueden mintear.</span>
        </div>
      )}

      {wrongNetwork && (
        <div className="puma-alert puma-alert--warn">
          <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
          <span style={{ fontSize: '0.85rem' }}>
            Estás en la red {currentChainId}. Al firmar se cambiará a{' '}
            <strong>{targetChain?.name ?? `chain ${targetChainId}`}</strong>.
          </span>
        </div>
      )}

      {/* PUMA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '0.85rem 1rem',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.3)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#E0E0E0', fontWeight: 600 }}>REWARD_MANAGER en PUMA</div>
          <div style={{ color: '#777', fontSize: '0.8rem' }}>Permite al Drops acuñar PUMA</div>
        </div>
        {pumaRoleLoading ? (
          <span className="puma-chip">Cargando…</span>
        ) : pumaRole ? (
          <span className="puma-chip puma-chip--green">
            <FontAwesomeIcon icon={faCheckCircle} /> Otorgado
          </span>
        ) : (
          <button
            type="button"
            onClick={grantPumaRole}
            disabled={busy}
            className="puma-btn puma-btn--gold"
            style={{ flex: '0 0 auto' }}
          >
            <FontAwesomeIcon icon={faKey} />
            {busy ? 'Firmando…' : 'Otorgar'}
          </button>
        )}
      </div>

      {/* Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '0.85rem 1rem',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.3)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#E0E0E0', fontWeight: 600 }}>MINTER en Badges</div>
          <div style={{ color: '#777', fontSize: '0.8rem' }}>Permite al Drops acuñar el POAP</div>
        </div>
        {badgesRoleLoading ? (
          <span className="puma-chip">Cargando…</span>
        ) : badgesRole ? (
          <span className="puma-chip puma-chip--green">
            <FontAwesomeIcon icon={faCheckCircle} /> Otorgado
          </span>
        ) : (
          <button
            type="button"
            onClick={grantBadgesRole}
            disabled={busy}
            className="puma-btn puma-btn--gold"
            style={{ flex: '0 0 auto' }}
          >
            <FontAwesomeIcon icon={faKey} />
            {busy ? 'Firmando…' : 'Otorgar'}
          </button>
        )}
      </div>

      {writeError && (
        <div className="puma-alert puma-alert--error">
          <span style={{ wordBreak: 'break-word', fontSize: '0.85rem' }}>
            {writeError.message.slice(0, 240)}
          </span>
        </div>
      )}
    </div>
  )
}

export default DropsRoleWiring
