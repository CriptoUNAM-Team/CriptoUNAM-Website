/** Nombres legibles de las redes que usa la app (Avalanche). */
const CHAIN_NAMES: Record<number, string> = {
  43113: 'Avalanche Fuji (testnet)',
  43114: 'Avalanche C-Chain',
}

export const chainDisplayName = (chainId: number): string =>
  CHAIN_NAMES[chainId] ?? `chain ${chainId}`

/** Las testnets exigen "modo prueba" en wallets como Core; útil para avisos. */
export const isTestnetChain = (chainId: number): boolean => chainId === 43113
