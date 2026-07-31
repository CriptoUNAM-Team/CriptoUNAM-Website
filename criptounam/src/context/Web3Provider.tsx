import { http, createStorage, WagmiProvider as StandardWagmiProvider, createConfig as createStandardConfig } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider, createConfig } from '@privy-io/wagmi'
import ENV_CONFIG from '../config/env'
import { PRIVY_LOGO_DATA_URI } from '../config/privy-logo'

/**
 * Proveedor Web3 con login vía Privy (email/OTP) sobre wagmi.
 *
 * Privy gestiona la sesión y la wallet:
 *  - Login con email + código; crea automáticamente una wallet embebida para
 *    quien no tenga una, de modo que las operaciones on-chain existentes
 *    (PUMA, badges, claims, arcade) siguen funcionando sin cambios.
 *  - Login con wallet externa (MetaMask, Coinbase, Rainbow, detectadas por
 *    EIP-6963 y WalletConnect al final de la lista): quien ya tenía saldo PUMA
 *    en su wallet entra con ella y ve su balance, en vez de recibir una wallet
 *    embebida nueva y vacía. Con wallet externa Privy NO crea embebida
 *    (`createOnLogin: 'users-without-wallets'`).
 *  - Los admins/usuarios avanzados pueden vincular una wallet externa
 *    desde el perfil de Privy.
 *
 * wagmi sigue siendo la capa on-chain: todos los `useAccount`/`useReadContract`/
 * `useWriteContract` del resto de la app no se tocan. El bridge `@privy-io/wagmi`
 * mantiene sincronizada la wallet activa de Privy con wagmi.
 *
 * No usa Reown/WalletConnect (Privy ≠ WalletConnect).
 */

const queryClient = new QueryClient()

// Fuente única de verdad: ENV_CONFIG.CHAIN_ID (default 43113 Fuji).
// Registramos ambas redes Avalanche (la primaria primero) para que el cambio de
// red siempre tenga la cadena destino disponible.
const chainId = ENV_CONFIG.CHAIN_ID
const primaryChain = chainId === 43113 ? avalancheFuji : avalanche
const secondaryChain = chainId === 43113 ? avalanche : avalancheFuji
const chains = [primaryChain, secondaryChain] as [typeof primaryChain, typeof secondaryChain]

// Configuración estándar para cuando Privy no está activo (fallback sin crash)
const standardWagmiConfig = createStandardConfig({
  chains,
  transports: {
    [avalancheFuji.id]: http(
      ENV_CONFIG.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    ),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
  ssr: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : (undefined as any),
    key: 'criptounam.wagmi.fallback',
  }),
})

// createConfig del bridge de Privy: NO recibe `connectors` (Privy los gestiona).
export const wagmiConfig = createConfig({
  chains,
  transports: {
    [avalancheFuji.id]: http(
      ENV_CONFIG.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    ),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
  ssr: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : (undefined as any),
    key: 'criptounam.wagmi',
  }),
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const appId = ENV_CONFIG.PRIVY_APP_ID

  // Sin App ID configurado no podemos montar Privy. Renderizamos solo wagmi estándar para
  // no romper la app en entornos sin la env (dev sin configurar / previews).
  if (!appId) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ VITE_PRIVY_APP_ID no configurado. El login con Privy está deshabilitado.')
    }
    return (
      <QueryClientProvider client={queryClient}>
        <StandardWagmiProvider config={standardWagmiConfig}>{children}</StandardWagmiProvider>
      </QueryClientProvider>
    )
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // 'wallet' requiere tener habilitado el método "Wallet" en el dashboard de Privy.
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#D4AF37',
          logo: PRIVY_LOGO_DATA_URI,
          landingHeader: 'CriptoUNAM',
          loginMessage: 'Accede a tu cuenta de CriptoUNAM y al Hackathon UNAM 2026',
          walletChainType: 'ethereum-only',
          // Email primero (onboarding sin fricción); la wallet es para quien ya
          // tiene cuenta/saldo PUMA.
          showWalletLoginFirst: false,
          // Orden de los botones de wallet. WalletConnect al final: es el único
          // camino para móviles sin extensión, pero no queremos que sea el
          // método primario (ver decisión "sin Reown/WalletConnect primario").
          walletList: [
            'detected_ethereum_wallets',
            'metamask',
            'coinbase_wallet',
            'rainbow',
            'wallet_connect',
          ],
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
          showWalletUIs: true,
        },
        defaultChain: primaryChain,
        supportedChains: [avalancheFuji, avalanche],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
