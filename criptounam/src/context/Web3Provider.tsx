import { WagmiProvider, createConfig, http, createStorage } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ENV_CONFIG from '../config/env'

/**
 * Proveedor Web3 nativo (wagmi + viem), sin Reown/WalletConnect.
 *
 * Conexión 100% inyectada: usamos el conector `injected` + auto-descubrimiento
 * EIP-6963 (activo por defecto en wagmi v2), que expone cada wallet instalada
 * (MetaMask, Coinbase, Brave, Rabby, Trust…) como un conector propio.
 * No requiere projectId ni ninguna nube de terceros.
 */

const queryClient = new QueryClient()

// Fuente única de verdad: ENV_CONFIG.CHAIN_ID (default 43113 Fuji).
// Registramos ambas redes Avalanche (la primaria primero) para que el cambio de
// red siempre tenga la cadena destino disponible.
const chainId = ENV_CONFIG.CHAIN_ID
const primaryChain = chainId === 43113 ? avalancheFuji : avalanche
const secondaryChain = chainId === 43113 ? avalanche : avalancheFuji
const chains = [primaryChain, secondaryChain] as [typeof primaryChain, typeof secondaryChain]

export const wagmiConfig = createConfig({
  chains,
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [avalancheFuji.id]: http(
      ENV_CONFIG.RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    ),
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
  // SPA Vite (sin SSR). storage explícito en localStorage para persistir el
  // último conector entre refrescos y pestañas.
  ssr: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : (undefined as any),
    key: 'criptounam.wagmi',
  }),
})

// reconnectOnMount fuerza a wagmi a rehidratar la última sesión guardada al
// cargar/refrescar, en vez de quedarse desconectado.
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
