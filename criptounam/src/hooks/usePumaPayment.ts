import { useReadContract } from 'wagmi'
import { isAddress, zeroAddress } from 'viem'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi } from '../constants/pumaTokenAbi'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
export const pumaPaymentConfigured = isAddress(tokenAddr) && tokenAddr !== zeroAddress

/** Red de los contratos: se fija en cada lectura para no depender de la red del wallet. */
const expectedChainId = ENV_CONFIG.CHAIN_ID

/**
 * Lee el allowance que el alumno otorgó al contrato PUMA (spender = el propio token).
 * Esto se usa porque `burnReward(from, amount, reason)` necesita
 * `allowance(from, address(this)) >= amount`.
 */
export function usePumaAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: pumaPaymentConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'allowance',
    args: owner ? [owner, tokenAddr] : undefined,
    chainId: expectedChainId,
    query: { enabled: pumaPaymentConfigured && !!owner },
  })
}

export function usePumaBalance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: pumaPaymentConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: expectedChainId,
    query: { enabled: pumaPaymentConfigured && !!owner },
  })
}

export const PUMA_TOKEN_ADDRESS = tokenAddr
