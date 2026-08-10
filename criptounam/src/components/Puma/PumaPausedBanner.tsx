import React from 'react'
import { useReadContract } from 'wagmi'
import { isAddress, zeroAddress } from 'viem'
import ENV_CONFIG from '../../config/env'
import { pumaTokenAbi } from '../../constants/pumaTokenAbi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePause } from '@fortawesome/free-solid-svg-icons'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const tokenOk = isAddress(tokenAddr) && tokenAddr !== zeroAddress

const PumaPausedBanner: React.FC = () => {
  const { data: paused } = useReadContract({
    address: tokenOk ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'paused',
    chainId: ENV_CONFIG.CHAIN_ID,
    query: { enabled: tokenOk },
  })

  if (!tokenOk || !paused) return null

  return (
    <div
      role="alert"
      style={{
        margin: '0 auto 1.25rem',
        maxWidth: 960,
        padding: '0.85rem 1.1rem',
        borderRadius: 12,
        border: '1px solid rgba(248,113,113,0.5)',
        background: 'rgba(127,29,29,0.35)',
        color: '#fecaca',
        fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <FontAwesomeIcon icon={faCirclePause} style={{ marginTop: 3, flexShrink: 0 }} />
      <span>
        El token PUMA está en pausa: no se pueden reclamar misiones ni enviar recompensas hasta que el equipo la levante.
      </span>
    </div>
  )
}

export default PumaPausedBanner
