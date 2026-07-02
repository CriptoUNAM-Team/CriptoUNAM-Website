import { useEffect, useMemo } from 'react'
import { useConnect, useAccount } from 'wagmi'
import type { Connector } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faTimes, faSpinner, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Modal nativo de conexión de wallet (wagmi puro, sin Reown/WalletConnect).
 * Lista los conectores inyectados detectados (EIP-6963) y conecta al hacer clic.
 */
const ConnectWalletModal = ({ open, onClose }: Props) => {
  const { connectors, connect, isPending, error, variables } = useConnect()
  const { isConnected } = useAccount()

  // Cerrar automáticamente al conectar.
  useEffect(() => {
    if (isConnected && open) onClose()
  }, [isConnected, open, onClose])

  // Cerrar con Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Dedup por nombre (el conector genérico "Injected" se oculta si ya hay
  // wallets con nombre descubiertas por EIP-6963).
  const wallets = useMemo(() => {
    const named = connectors.filter((c) => c.id !== 'injected')
    const list = named.length > 0 ? named : connectors
    const seen = new Set<string>()
    return list.filter((c) => {
      const key = c.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [connectors])

  if (!open) return null

  const pendingConnectorId =
    isPending && variables?.connector && 'id' in variables.connector
      ? (variables.connector as Connector).id
      : undefined

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'linear-gradient(160deg, rgba(24,24,28,0.98) 0%, rgba(14,14,18,0.98) 100%)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesomeIcon icon={faWallet} style={{ color: '#0a0a0a', fontSize: '1.2rem' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.15rem', margin: 0, color: '#fff' }}>
              Conectar wallet
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '2px 0 0' }}>
              Elige tu wallet para continuar
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: 4,
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {wallets.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#cbd5e1',
              fontSize: '0.9rem',
              padding: '1rem 0.5rem',
              lineHeight: 1.6,
            }}
          >
            <FontAwesomeIcon
              icon={faCircleExclamation}
              style={{ color: '#D4AF37', fontSize: '1.6rem', marginBottom: 10 }}
            />
            <p style={{ margin: 0 }}>
              No detectamos ninguna wallet en tu navegador. Instala{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#F4D03F', fontWeight: 600 }}
              >
                MetaMask
              </a>{' '}
              (u otra wallet) y vuelve a intentar. En móvil, abre esta página desde el navegador
              interno de tu wallet.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wallets.map((connector) => {
              const connecting = pendingConnectorId === connector.id
              return (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    opacity: isPending && !connecting ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
                  }}
                >
                  {connector.icon ? (
                    <img
                      src={connector.icon}
                      alt=""
                      width={28}
                      height={28}
                      style={{ borderRadius: 6 }}
                    />
                  ) : (
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: 'rgba(212,175,55,0.15)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FontAwesomeIcon icon={faWallet} style={{ color: '#D4AF37', fontSize: '0.85rem' }} />
                    </span>
                  )}
                  <span style={{ flex: 1, textAlign: 'left' }}>{connector.name}</span>
                  {connecting && <FontAwesomeIcon icon={faSpinner} spin style={{ color: '#D4AF37' }} />}
                </button>
              )
            })}
          </div>
        )}

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
            {error.message.includes('rejected') || error.message.includes('denied')
              ? 'Conexión cancelada.'
              : 'No se pudo conectar. Intenta de nuevo.'}
          </p>
        )}

        <p style={{ color: '#666', fontSize: '0.72rem', marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
          Red: Avalanche Fuji · Solo firmas cuando reclamas o pagas.
        </p>
      </div>
    </div>
  )
}

export default ConnectWalletModal
