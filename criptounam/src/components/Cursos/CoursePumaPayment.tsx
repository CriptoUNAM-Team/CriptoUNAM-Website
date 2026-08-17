import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faShieldHalved,
  faGraduationCap,
  faExternalLinkAlt,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'
import { pumaPayCourseAbi } from '../../constants/pumaTokenAbi'
import {
  PUMA_TOKEN_ADDRESS,
  pumaPaymentConfigured,
  usePumaBalance,
} from '../../hooks/usePumaPayment'
import { useWallet } from '../../context/WalletContext'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'

const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'

type Props = {
  cursoId: string
  cursoTitulo: string
  precioPuma: number
  isBusy?: boolean
  /** Se llama cuando el pago queda confirmado y se puede continuar con la inscripción. */
  onPaid: () => Promise<void> | void
}

/**
 * Pago de curso con $PUMA. Llama directamente a `payCourse(cursoId, amount)`
 * en el contrato PUMAToken (función pública desde v2). Cero backend, cero
 * approve. Una sola transacción que el alumno firma con su wallet y quema
 * sus PUMA dejando registro on-chain del curso pagado.
 */
const CoursePumaPayment: React.FC<Props> = ({
  cursoId,
  cursoTitulo,
  precioPuma,
  isBusy,
  onPaid,
}) => {
  const { isConnected, connectWallet } = useWallet()
  const { address } = useAccount()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const chain = wagmiConfig.chains.find((c) => c.id === targetChainId)

  const precioWei = parseEther(String(precioPuma))

  const { data: balance = 0n, refetch: refetchBalance } = usePumaBalance(address)
  const balanceBig = balance as bigint
  const enoughBalance = balanceBig >= precioWei

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash })

  const [calledOnPaid, setCalledOnPaid] = useState(false)

  useEffect(() => {
    if (txOk && !calledOnPaid) {
      setCalledOnPaid(true)
      refetchBalance()
      void onPaid()
      reset()
    }
  }, [txOk, calledOnPaid, refetchBalance, onPaid, reset])

  const pagar = async () => {
    if (!chain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: PUMA_TOKEN_ADDRESS,
      abi: pumaPayCourseAbi,
      functionName: 'payCourse',
      args: [cursoId, precioWei],
      chain,
      account: address,
    })
  }

  if (!pumaPaymentConfigured) {
    return (
      <div className="puma-alert puma-alert--warn">
        <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
        <span>
          Este curso cuesta {precioPuma.toLocaleString('en-US')} $PUMA, pero el contrato del token aún no está enlazado
          en esta red.
        </span>
      </div>
    )
  }

  return (
    <div
      className="puma-card puma-card--featured puma-card--shimmer puma-fade-in-up"
      style={{ maxWidth: 520, margin: '0 auto', textAlign: 'left' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div className="puma-coin">PU</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily: 'Chakra Petch',
              color: '#fff',
              fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
              margin: 0,
            }}
          >
            Inscripción con $PUMA
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
            {cursoTitulo}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.1rem',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            padding: '0.75rem 0.9rem',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Precio
          </div>
          <div
            style={{
              color: '#F4D03F',
              fontFamily: 'Chakra Petch',
              fontSize: '1.25rem',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {precioPuma.toLocaleString('en-US')} $PUMA
          </div>
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            padding: '0.75rem 0.9rem',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Tu saldo
          </div>
          <div
            style={{
              color: enoughBalance ? '#86efac' : '#fca5a5',
              fontFamily: 'Chakra Petch',
              fontSize: '1.25rem',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {address ? Number(formatEther(balanceBig)).toFixed(2) : '—'}
          </div>
        </div>
      </div>

      {!isConnected && (
        <>
          <p style={{ color: '#cbd5e1', lineHeight: 1.55, marginBottom: '1rem' }}>
            Conecta tu wallet para pagar con $PUMA.
          </p>
          <button
            type="button"
            className="puma-btn puma-btn--gold"
            onClick={() => connectWallet()}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Conectar wallet
          </button>
        </>
      )}

      {isConnected && !enoughBalance && (
        <div className="puma-alert puma-alert--warn" style={{ marginBottom: '0.85rem' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span>
            Te faltan {(precioPuma - Number(formatEther(balanceBig))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $PUMA. Reclama
            misiones o pide a un embajador que te apoye.
          </span>
        </div>
      )}

      {isConnected && enoughBalance && !txOk && (
        <button
          type="button"
          onClick={pagar}
          disabled={isPending || confirming || isBusy}
          className="puma-btn puma-btn--gold"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.85rem 1.25rem',
            fontSize: '1rem',
            fontWeight: 700,
          }}
        >
          <FontAwesomeIcon icon={faCoins} />
          {isPending
            ? 'Firma en tu wallet…'
            : confirming
            ? 'Confirmando on-chain…'
            : `Pagar ${precioPuma.toLocaleString('en-US')} $PUMA`}
        </button>
      )}

      {txOk && (
        <div
          className="puma-alert puma-alert--success puma-pop-in"
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <FontAwesomeIcon icon={faGraduationCap} style={{ marginTop: 3 }} />
            <strong>¡Inscripción pagada con $PUMA!</strong>
          </div>
          {txHash && (
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
                fontSize: '0.88rem',
                marginTop: '0.4rem',
              }}
            >
              Ver transacción
              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.72rem' }} />
            </a>
          )}
        </div>
      )}

      {writeError && (
        <div className="puma-alert puma-alert--error" style={{ marginTop: '0.75rem' }}>
          <span style={{ wordBreak: 'break-word' }}>{writeError.message.slice(0, 220)}</span>
        </div>
      )}

      <p style={{ color: '#777', fontSize: '0.78rem', marginTop: '1rem', marginBottom: 0, lineHeight: 1.5 }}>
        Tu wallet firma <code>payCourse({'{cursoId}, amount'})</code>. Tus PUMA se queman como
        pago y el evento <code>CoursePaid</code> queda registrado en cadena.
      </p>
    </div>
  )
}

export default CoursePumaPayment
