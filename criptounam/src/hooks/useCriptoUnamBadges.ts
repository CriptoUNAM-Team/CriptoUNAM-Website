import { useQuery } from '@tanstack/react-query'
import { useReadContract, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import type { Config } from '@wagmi/core'
import { isAddress, keccak256, toBytes, zeroAddress } from 'viem'
import ENV_CONFIG from '../config/env'
import {
  criptoUnamBadgesAbi,
  BadgeKind,
  type BadgeMetadata,
} from '../constants/criptoUnamBadgesAbi'

const badgesAddr = ENV_CONFIG.BADGES_CONTRACT_ADDRESS as `0x${string}`
export const badgesContractConfigured =
  isAddress(badgesAddr) && badgesAddr !== zeroAddress

export const MINTER_ROLE = keccak256(toBytes('MINTER_ROLE'))

/** Red de los contratos: se fija en cada lectura para no depender de la red del wallet. */
const expectedChainId = ENV_CONFIG.CHAIN_ID

const rc = readContract as (config: Config, params: Record<string, unknown>) => Promise<unknown>

/** Si la wallet conectada tiene MINTER_ROLE, puede mintear directamente desde el sitio. */
export function useIsBadgeMinter(address: `0x${string}` | undefined) {
  return useReadContract({
    address: badgesContractConfigured ? badgesAddr : undefined,
    abi: criptoUnamBadgesAbi,
    functionName: 'hasRole',
    args: address ? [MINTER_ROLE, address] : undefined,
    chainId: expectedChainId,
    query: { enabled: badgesContractConfigured && !!address },
  })
}

/** Resuelve la URL de metadata (admite ipfs:// y rutas relativas a BADGES_METADATA_BASE). */
export function resolveMetadataUrl(uri: string): string {
  if (!uri) return ''
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${cid}`
  }
  const base = ENV_CONFIG.BADGES_METADATA_BASE
  if (base) {
    const sep = base.endsWith('/') ? '' : '/'
    return `${base}${sep}${uri}`
  }
  return uri
}

/** Carga JSON ERC-721 metadata desde URI (ipfs/http). */
export function useBadgeMetadata(tokenUri: string | undefined) {
  return useQuery({
    queryKey: ['badgeMetadata', tokenUri],
    queryFn: async (): Promise<BadgeMetadata | null> => {
      if (!tokenUri) return null
      const url = resolveMetadataUrl(tokenUri)
      try {
        const res = await fetch(url)
        if (!res.ok) return null
        return (await res.json()) as BadgeMetadata
      } catch {
        return null
      }
    },
    enabled: !!tokenUri,
    staleTime: 60_000,
  })
}

export type BadgeOwned = {
  tokenId: bigint
  kind: BadgeKind
  ref: string
  uri: string
  isSoulbound: boolean
}

/**
 * Lista badges propiedad de `owner`. Recorre desde tokenId=1 buscando coincidencias por ownerOf.
 * Como el contrato no implementa enumerable, escaneamos hasta `maxScan` (sube si crece el supply).
 */
export function useBadgesOf(
  owner: `0x${string}` | undefined,
  options: { maxScan?: number } = {}
) {
  const config = useConfig()
  const maxScan = options.maxScan ?? 200

  return useQuery({
    queryKey: ['badgesOf', badgesAddr, owner, maxScan, expectedChainId],
    queryFn: async (): Promise<BadgeOwned[]> => {
      if (!badgesContractConfigured || !owner) return []
      const owned: BadgeOwned[] = []
      for (let i = 1; i <= maxScan; i++) {
        try {
          const ownerAddr = (await rc(config, {
            address: badgesAddr,
            abi: criptoUnamBadgesAbi,
            functionName: 'ownerOf',
            args: [BigInt(i)],
            chainId: expectedChainId,
          })) as `0x${string}`
          if (ownerAddr.toLowerCase() !== owner.toLowerCase()) continue

          const [kindRaw, ref, uri] = await Promise.all([
            rc(config, {
              address: badgesAddr,
              abi: criptoUnamBadgesAbi,
              functionName: 'tokenKind',
              args: [BigInt(i)],
              chainId: expectedChainId,
            }),
            rc(config, {
              address: badgesAddr,
              abi: criptoUnamBadgesAbi,
              functionName: 'tokenRef',
              args: [BigInt(i)],
              chainId: expectedChainId,
            }),
            rc(config, {
              address: badgesAddr,
              abi: criptoUnamBadgesAbi,
              functionName: 'tokenURI',
              args: [BigInt(i)],
              chainId: expectedChainId,
            }),
          ])
          const kind = Number(kindRaw) as BadgeKind
          owned.push({
            tokenId: BigInt(i),
            kind,
            ref: ref as string,
            uri: uri as string,
            isSoulbound: kind === BadgeKind.CourseCompletion || kind === BadgeKind.Certification,
          })
        } catch {
          break
        }
      }
      return owned
    },
    enabled: badgesContractConfigured && !!owner,
    staleTime: 30_000,
  })
}
