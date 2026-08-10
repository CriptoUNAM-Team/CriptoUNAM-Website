import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { isAddress, formatEther, parseEther, zeroAddress } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faMedal, faStar, faPaperPlane, faClock } from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'
import { pumaTokenAbi, pumaTransferRewardAbi, type PumaRewardRecord } from '../../constants/pumaTokenAbi'
import { useWallet } from '../../context/WalletContext'
import { usePumaTokenBalance } from '../../hooks/usePumaTokenBalance'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'
import { chainDisplayName } from '../../utils/chainNames'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const tokenOk = isAddress(tokenAddr) && tokenAddr !== zeroAddress

const card: React.CSSProperties = {
  background: 'rgba(26,26,26,0.92)',
  borderRadius: 16,
  border: '1px solid rgba(212,175,55,0.28)',
  padding: '1.25rem 1.35rem',
  boxSizing: 'border-box',
}

const label: React.CSSProperties = { display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: 6 }
const input: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: 10,
  border: '1px solid rgba(212,175,55,0.35)',
  background: 'rgba(0,0,0,0.35)',
  color: '#E0E0E0',
  marginBottom: 10,
  boxSizing: 'border-box',
}

const PumaUserPanel: React.FC = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet()
  const { address } = useAccount()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const chain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const [toAddr, setToAddr] = useState('')
  const [sendAmt, setSendAmt] = useState('')

  const {
    formatted: balanceFormatted,
    refetch: refetchBalance,
    onExpectedChain,
    expectedChainId,
  } = usePumaTokenBalance()

  const { data: userInfo, refetch: refetchInfo } = useReadContract({
    address: tokenOk && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    chainId: ENV_CONFIG.CHAIN_ID,
    query: { enabled: tokenOk && !!address },
  })

  const { data: badges = [], refetch: refetchBadges } = useReadContract({
    address: tokenOk && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserBadges',
    args: address ? [address] : undefined,
    chainId: ENV_CONFIG.CHAIN_ID,
    query: { enabled: tokenOk && !!address },
  })

  const { data: rewardLog = [], refetch: refetchRewards } = useReadContract({
    address: tokenOk && address ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'getUserRewards',
    args: address ? [address] : undefined,
    chainId: ENV_CONFIG.CHAIN_ID,
    query: { enabled: tokenOk && !!address },
  })

  const { writeContract, data: txHash, isPending, error: wErr, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: ok } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (ok) {
      refetchBalance()
      refetchInfo()
      refetchBadges()
      refetchRewards()
      reset()
      setToAddr('')
      setSendAmt('')
    }
  }, [ok, refetchBalance, refetchInfo, refetchBadges, refetchRewards, reset])

  const sendTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chain || !address || !isAddress(toAddr.trim())) return
    let wei: bigint
    try {
      wei = parseEther(sendAmt || '0')
    } catch {
      return
    }
    if (wei === 0n) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: tokenAddr,
      abi: pumaTransferRewardAbi,
      functionName: 'transferReward',
      args: [toAddr.trim() as `0x${string}`, wei],
      chain,
      account: address,
    })
  }

  const tuple = userInfo as [bigint, bigint, bigint, bigint] | undefined
  const busy = isPending || confirming

  if (!tokenOk) {
    return (
      <div style={card}>
        <p style={{ color: '#888', margin: 0 }}>Aún no enlazamos el contrato PUMA en esta versión del sitio.</p>
      </div>
    )
  }

  if (!isConnected || !walletAddress) {
    return (
      <div style={card}>
        <h3 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.1rem', marginTop: 0 }}>Tu cuenta PUMA</h3>
        <p style={{ color: '#bbb', lineHeight: 1.6, marginBottom: '1rem' }}>
          Conecta tu wallet para ver tu saldo, nivel, insignias y movimientos.
        </p>
        <button
          type="button"
          onClick={() => connectWallet()}
          style={{
            padding: '0.65rem 1.2rem',
            borderRadius: 10,
            border: '1px solid #D4AF37',
            background: 'rgba(212,175,55,0.15)',
            color: '#D4AF37',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Acceder a mi perfil
        </button>
      </div>
    )
  }

  const rewards = (rewardLog as PumaRewardRecord[]) ?? []
  const recent = [...rewards].reverse().slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={card}>
        <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: 'clamp(1rem, 3vw, 1.15rem)', marginTop: 0 }}>
          Tu progreso
        </h3>
        {(tuple || address) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '1rem',
              color: '#ccc',
              fontSize: '0.95rem',
            }}
          >
            <div>
              <FontAwesomeIcon icon={faCoins} style={{ color: '#D4AF37', marginRight: 8 }} />
              Saldo
              <div style={{ color: '#fff', fontWeight: 700, marginTop: 4 }}>
                {balanceFormatted} PUMA
              </div>
              {!onExpectedChain && (
                <div style={{ color: '#fbbf24', fontSize: '0.78rem', marginTop: 4 }}>
                  Saldo real de {chainDisplayName(expectedChainId)}. Tu wallet está en otra red:
                  cámbiala para firmar transacciones.
                </div>
              )}
            </div>
            {tuple && (
              <>
                <div>
                  <FontAwesomeIcon icon={faStar} style={{ color: '#93c5fd', marginRight: 8 }} />
                  Nivel
                  <div style={{ color: '#fff', fontWeight: 700, marginTop: 4 }}>{tuple[1].toString()}</div>
                </div>
                <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
                  <FontAwesomeIcon icon={faMedal} style={{ color: '#fbbf24', marginRight: 8 }} />
                  Experiencia acumulada
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: 4, wordBreak: 'break-word' }}>
                    {formatEther(tuple[2])} (unidades on-chain)
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#777', marginBottom: 0, wordBreak: 'break-all' }}>
          {walletAddress}
        </p>
      </div>

      <div style={card}>
        <h4 style={{ color: '#fff', marginTop: 0, fontSize: '1rem' }}>Insignias</h4>
        {badges.length === 0 ? (
          <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>Aún no tienes insignias registradas en cadena.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#ddd', lineHeight: 1.6 }}>
            {(badges as string[]).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={card}>
        <h4 style={{ color: '#fff', marginTop: 0, fontSize: '1rem' }}>Últimos movimientos</h4>
        {recent.length === 0 ? (
          <p style={{ color: '#888', margin: 0 }}>Cuando recibas PUMA por misiones o por el equipo, aparecerá aquí.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map((r, i) => (
              <li
                key={`${r.timestamp}-${i}`}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.9rem',
                  color: '#ccc',
                }}
              >
                <div style={{ color: '#D4AF37', fontWeight: 600 }}>+{formatEther(r.amount)} PUMA</div>
                <div style={{ color: '#999', fontSize: '0.82rem' }}>{r.reason}</div>
                <div style={{ color: '#666', fontSize: '0.78rem', marginTop: 4 }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} />
                  {new Date(Number(r.timestamp) * 1000).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {address && (
        <div style={card}>
          <h4 style={{ color: '#fff', marginTop: 0, fontSize: '1rem' }}>Enviar PUMA a otra wallet</h4>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.55, marginTop: 0 }}>
            Si ya tienes PUMA, puedes pasarlos a un compañero usando la función del contrato (transferencia interna del
            token de recompensas).
          </p>
          <form onSubmit={sendTransfer}>
            <label style={label}>Wallet destino</label>
            <input style={input} value={toAddr} onChange={(e) => setToAddr(e.target.value)} placeholder="0x…" />
            <label style={label}>Cantidad (PUMA)</label>
            <input style={input} value={sendAmt} onChange={(e) => setSendAmt(e.target.value)} inputMode="decimal" />
            <button
              type="submit"
              disabled={busy}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 10,
                border: 'none',
                background: busy ? '#444' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                fontWeight: 700,
                cursor: busy ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              {busy ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
          {wErr && <p style={{ color: '#f87171', fontSize: '0.88rem', marginTop: 10 }}>{wErr.message.slice(0, 220)}</p>}
        </div>
      )}
    </div>
  )
}

export default PumaUserPanel
