import { useQuery } from '@tanstack/react-query'
import { useReadContract, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import type { Config } from '@wagmi/core'
import { isAddress, keccak256, toBytes, toHex, zeroAddress } from 'viem'
import ENV_CONFIG from '../config/env'
import { criptoUnamDropsAbi, type DropRow } from '../constants/criptoUnamDropsAbi'

const dropsAddr = ENV_CONFIG.DROPS_CONTRACT_ADDRESS as `0x${string}`
export const dropsContractConfigured = isAddress(dropsAddr) && dropsAddr !== zeroAddress

/**
 * Red donde viven los contratos. Todas las lecturas la fijan explícitamente: sin
 * esto wagmi consulta la red activa del wallet y, si está en otra (mainnet, por
 * ejemplo), `hasRole` no encuentra contrato y devuelve undefined — lo que se veía
 * como "no tienes DROP_MANAGER_ROLE" aun siendo admin.
 */
const expectedChainId = ENV_CONFIG.CHAIN_ID

export const DROP_MANAGER_ROLE = keccak256(toBytes('DROP_MANAGER_ROLE'))

const rc = readContract as (config: Config, params: Record<string, unknown>) => Promise<unknown>

/** Sólo el admin/manager puede crear o desactivar drops. */
export function useIsDropManager(address: `0x${string}` | undefined) {
  return useReadContract({
    address: dropsContractConfigured ? dropsAddr : undefined,
    abi: criptoUnamDropsAbi,
    functionName: 'hasRole',
    args: address ? [DROP_MANAGER_ROLE, address] : undefined,
    chainId: expectedChainId,
    query: { enabled: dropsContractConfigured && !!address },
  })
}

/** Lee un drop por código (string crudo). Devuelve undefined si no existe. */
export function useDropByCode(code: string) {
  return useReadContract({
    address: dropsContractConfigured ? dropsAddr : undefined,
    abi: criptoUnamDropsAbi,
    functionName: 'getDropByCode',
    args: code ? [code] : undefined,
    chainId: expectedChainId,
    query: { enabled: dropsContractConfigured && code.length > 0 },
  })
}

/** ¿La wallet `user` ya reclamó este drop? */
export function useHasClaimed(code: string, user: `0x${string}` | undefined) {
  return useReadContract({
    address: dropsContractConfigured ? dropsAddr : undefined,
    abi: criptoUnamDropsAbi,
    functionName: 'hasClaimed',
    args: code && user ? [code, user] : undefined,
    chainId: expectedChainId,
    query: { enabled: dropsContractConfigured && code.length > 0 && !!user },
  })
}

export type DropWithHash = DropRow & { codeHash: `0x${string}` }

/** Lista TODOS los drops (admin). */
export function useAllDrops() {
  const config = useConfig()
  return useQuery({
    queryKey: ['allDrops', dropsAddr, expectedChainId],
    queryFn: async (): Promise<DropWithHash[]> => {
      if (!dropsContractConfigured) return []
      const len = (await rc(config, {
        address: dropsAddr,
        abi: criptoUnamDropsAbi,
        functionName: 'dropHashesLength',
        chainId: expectedChainId,
      })) as bigint
      const n = Number(len)
      if (n === 0) return []
      const hashes = (await Promise.all(
        Array.from({ length: n }, (_, i) =>
          rc(config, {
            address: dropsAddr,
            abi: criptoUnamDropsAbi,
            functionName: 'dropHashes',
            args: [BigInt(i)],
            chainId: expectedChainId,
          })
        )
      )) as `0x${string}`[]
      const drops = await Promise.all(
        hashes.map(async (h) => {
          const d = (await rc(config, {
            address: dropsAddr,
            abi: criptoUnamDropsAbi,
            functionName: 'getDropByHash',
            args: [h],
            chainId: expectedChainId,
          })) as DropRow
          return { ...d, codeHash: h }
        })
      )
      return drops
    },
    enabled: dropsContractConfigured,
    staleTime: 15_000,
  })
}

/** Helpers */
export const DROPS_ADDRESS = dropsAddr
export const codeHash = (code: string) => toHex(keccak256(toBytes(code)))
