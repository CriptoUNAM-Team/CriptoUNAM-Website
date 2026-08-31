import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { handleWalletNotification } from '../api/telegram'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useSetActiveWallet } from '@privy-io/wagmi'
import { useAccount, useDisconnect } from 'wagmi'

interface ConnectedWallet {
  address: string
  timestamp: string
  provider: string
}

interface WalletContextType {
  walletAddress: string
  /** Sesión Privy activa (email o wallet). No abre modales sola al cargar. */
  isConnected: boolean
  /** wagmi sincronizado y con dirección — necesario para firmar on-chain. */
  isWalletReady: boolean
  error?: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  connectedWallets: ConnectedWallet[]
  email?: string | null
  privyId?: string | null
  ready: boolean
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  isWalletReady: false,
  walletAddress: '',
  connectedWallets: [],
  email: null,
  privyId: null,
  ready: false,
})

export const useWallet = () => useContext(WalletContext)

const sendTelegramNotification = async (address: string, provider: string) => {
  try {
    const result = await handleWalletNotification(address, provider)
    if (!result.success) {
      console.error('Error al enviar notificación:', result.message)
    }
  } catch (error) {
    console.error('Error al enviar notificación a Telegram:', error)
  }
}

const walletProviderName = (walletClientType?: string): string => {
  if (!walletClientType) return 'Privy'
  if (walletClientType === 'privy') return 'Privy Embedded'
  if (walletClientType === 'metamask') return 'MetaMask'
  if (walletClientType === 'coinbase_wallet') return 'Coinbase Wallet'
  return walletClientType
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null)
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([])
  const notifiedAddresses = useRef<Set<string>>(new Set())
  const isDisconnectingRef = useRef(false)
  const activationAttemptedRef = useRef<string | null>(null)
  /** Solo true tras un clic explícito en "Conectar/Acceder". Evita popups al hidratar. */
  const userInitiatedAuthRef = useRef(false)

  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    connectWallet: privyConnectWallet,
  } = usePrivy()
  const { wallets } = useWallets()
  const { setActiveWallet } = useSetActiveWallet()
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
  const { disconnect: disconnectWagmi } = useDisconnect()

  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy')
  const externalWallet = wallets.find((w) => w.walletClientType !== 'privy')

  /**
   * Sincronizamos wagmi en silencio solo con la wallet embebida de Privy.
   * Las extensiones (MetaMask, Core, …) solo se activan tras un clic del
   * usuario; si no, al entrar al sitio saltaba el modal de "conectar wallet".
   */
  const walletForWagmiSync =
    embeddedWallet ?? (userInitiatedAuthRef.current ? externalWallet : undefined)

  const walletAddress =
    wagmiAddress || walletForWagmiSync?.address || externalWallet?.address || embeddedWallet?.address || user?.wallet?.address || ''

  const isConnected = ready && authenticated
  const isWalletReady = isConnected && wagmiConnected && Boolean(wagmiAddress)

  const syncWagmi = useCallback(
    (wallet: (typeof wallets)[number]) => {
      const target = wallet.address.toLowerCase()
      if (wagmiConnected && wagmiAddress?.toLowerCase() === target) return
      if (activationAttemptedRef.current === target) return
      activationAttemptedRef.current = target
      setActiveWallet(wallet).catch((e) => {
        console.error('No se pudo activar la wallet en wagmi:', e)
        activationAttemptedRef.current = null
      })
    },
    [wagmiConnected, wagmiAddress, setActiveWallet]
  )

  useEffect(() => {
    if (isDisconnectingRef.current || !ready || !authenticated || !walletForWagmiSync) return
    syncWagmi(walletForWagmiSync)
  }, [ready, authenticated, walletForWagmiSync, syncWagmi])

  useEffect(() => {
    const savedWallets = localStorage.getItem('connectedWallets')
    if (savedWallets) {
      try {
        const parsed: ConnectedWallet[] = JSON.parse(savedWallets)
        setConnectedWallets(parsed)
        parsed.forEach((w) => notifiedAddresses.current.add(w.address))
      } catch {
        /* ignore JSON corrupto */
      }
    }
  }, [])

  useEffect(() => {
    if (!isConnected || !walletAddress) return
    if (notifiedAddresses.current.has(walletAddress)) return

    const providerName = walletProviderName(
      walletForWagmiSync?.walletClientType ?? externalWallet?.walletClientType ?? embeddedWallet?.walletClientType
    )
    const newWallet: ConnectedWallet = {
      address: walletAddress,
      timestamp: new Date().toISOString(),
      provider: providerName,
    }

    setConnectedWallets((prev) => {
      const updated = [...prev, newWallet]
      localStorage.setItem('connectedWallets', JSON.stringify(updated))
      return updated
    })

    sendTelegramNotification(walletAddress, providerName)
    notifiedAddresses.current.add(walletAddress)
  }, [isConnected, walletAddress, walletForWagmiSync, externalWallet, embeddedWallet])

  const connectWallet = async () => {
    setError(null)
    if (!ready) return

    userInitiatedAuthRef.current = true
    activationAttemptedRef.current = null

    try {
      if (!authenticated) {
        login()
        return
      }

      if (externalWallet && !wagmiConnected) {
        syncWagmi(externalWallet)
        return
      }

      if (!walletAddress) {
        privyConnectWallet()
      }
    } catch (err) {
      console.error('No se pudo abrir el modal de Privy:', err)
      setError('No se pudo abrir el inicio de sesión. Recarga la página e intenta de nuevo.')
    }
  }

  const disconnectWallet = async () => {
    isDisconnectingRef.current = true
    userInitiatedAuthRef.current = false

    try {
      disconnectWagmi()
    } catch {
      /* ignore */
    }

    try {
      if (ready && authenticated) {
        await logout()
      }
    } catch (e) {
      console.warn('Sesión remota Privy ya expirada o cerrada (400). Limpiando estado local:', e)
      if (typeof window !== 'undefined') {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('privy:')) window.localStorage.removeItem(key)
        })
      }
    } finally {
      try {
        if (typeof window !== 'undefined') {
          Object.keys(window.localStorage).forEach((key) => {
            if (key.startsWith('criptounam.wagmi') || key.includes('wagmi')) {
              window.localStorage.removeItem(key)
            }
          })
        }
      } catch {
        /* ignore */
      }
      setError(null)
      activationAttemptedRef.current = null
      setTimeout(() => {
        isDisconnectingRef.current = false
      }, 600)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress: walletAddress || '',
        isConnected,
        isWalletReady,
        error,
        connectWallet,
        disconnectWallet,
        connectedWallets,
        email: user?.email?.address ?? null,
        privyId: user?.id ?? null,
        ready,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
