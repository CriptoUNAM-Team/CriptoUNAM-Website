import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
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
  isConnected: boolean
  error?: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  connectedWallets: ConnectedWallet[]
  /** Email verificado del usuario Privy (para gating de admin y prefills). */
  email?: string | null
  /** ID de usuario de Privy (did:privy:...), útil como clave estable. */
  privyId?: string | null
  /** Privy ya terminó de hidratar la sesión. */
  ready: boolean
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
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

  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const { setActiveWallet } = useSetActiveWallet()
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount()
  const { disconnect: disconnectWagmi } = useDisconnect()

  // Wallet activa: preferimos la que ya tiene wagmi; si no, la primera de Privy.
  const activeWallet = wallets[0]
  const walletAddress = wagmiAddress || activeWallet?.address || user?.wallet?.address || ''
  const isConnected = authenticated && Boolean(walletAddress)

  // Sincronizar la wallet de Privy con wagmi para que las lecturas/escrituras
  // on-chain (useAccount, useReadContract, ...) del resto de la app funcionen.
  useEffect(() => {
    if (isDisconnectingRef.current || !ready || !authenticated || !activeWallet) return
    if (wagmiConnected) return
    setActiveWallet(activeWallet).catch((e) => {
      console.error('No se pudo activar la wallet en wagmi:', e)
    })
  }, [ready, authenticated, activeWallet, wagmiConnected, setActiveWallet])

  // Cargar wallets guardadas al montar.
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

  // Registrar + notificar nuevas wallets conectadas.
  useEffect(() => {
    if (!isConnected || !walletAddress) return
    if (notifiedAddresses.current.has(walletAddress)) return

    const providerName = walletProviderName(activeWallet?.walletClientType)
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
  }, [isConnected, walletAddress, activeWallet])

  const connectWallet = async () => {
    try {
      setError(null)
      login()
    } catch (err) {
      setError('Error al iniciar sesión')
    }
  }

  const disconnectWallet = async () => {
    isDisconnectingRef.current = true

    // 1. Desconectar Wagmi para liberar cualquier sesión de conector en la capa on-chain
    try {
      disconnectWagmi()
    } catch (e) {
      /* ignore */
    }

    // 2. Intentar cerrar sesión en Privy solo si estamos autenticados y listos
    try {
      if (ready && authenticated) {
        await logout()
      }
    } catch (e) {
      console.warn('Sesión remota Privy ya expirada o cerrada (400). Limpiando estado local:', e)
      // Si falló con 400 o error (sesión expirada/huérfana), limpiamos las llaves locales de privy
      if (typeof window !== 'undefined') {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('privy:')) window.localStorage.removeItem(key)
        })
      }
    } finally {
      // 3. Limpiar siempre caché y almacenamiento de wagmi para un desconectado 100% limpio
      try {
        if (typeof window !== 'undefined') {
          Object.keys(window.localStorage).forEach((key) => {
            if (key.startsWith('criptounam.wagmi') || key.includes('wagmi')) {
              window.localStorage.removeItem(key)
            }
          })
        }
      } catch (e) {
        /* ignore */
      }
      setError(null)
      // Liberamos el ref después de que los estados y re-renders de desconexión terminen
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
