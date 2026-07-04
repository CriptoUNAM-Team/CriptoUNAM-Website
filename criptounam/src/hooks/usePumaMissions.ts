import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import type { Config } from '@wagmi/core'
import { isAddress, zeroAddress } from 'viem'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi, type PumaMissionRow } from '../constants/pumaTokenAbi'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
export const pumaTokenConfigured = isAddress(tokenAddr) && tokenAddr !== zeroAddress

/** Evita choques de tipos con parámetros opcionales experimentales de viem/wagmi en esta versión. */
const rc = readContract as (config: Config, params: Record<string, unknown>) => Promise<unknown>

async function fetchAllMissions(config: Config): Promise<PumaMissionRow[]> {
  if (!pumaTokenConfigured) return []

  const len = await rc(config, {
    address: tokenAddr,
    abi: pumaTokenAbi,
    functionName: 'missionIdsLength',
  })

  const n = Number(len as bigint)
  if (n === 0) return []

  const ids = await Promise.all(
    Array.from({ length: n }, (_, i) =>
      rc(config, {
        address: tokenAddr,
        abi: pumaTokenAbi,
        functionName: 'missionIds',
        args: [BigInt(i)],
      })
    )
  )

  const rows: PumaMissionRow[] = []
  for (const missionId of ids as string[]) {
    const m = await rc(config, {
      address: tokenAddr,
      abi: pumaTokenAbi,
      functionName: 'missions',
      args: [missionId],
    })
    const tuple = m as readonly [string, bigint, boolean, bigint, boolean]
    rows.push({
      missionId,
      title: tuple[0],
      reward: tuple[1],
      active: tuple[2],
      deadline: tuple[3],
      exists: tuple[4],
    })
  }
  return rows
}

/** Verifica si una misión corresponde a un videojuego/arcade (ej. Puma Runner) para no mostrarla en listados generales. */
export function isGameMission(missionId: string): boolean {
  const id = (missionId || '').toUpperCase()
  return id.includes('RUNNER') || id.includes('JUEGO') || id.includes('ARCADE') || id.startsWith('CYBER')
}

export function usePumaMissionsList() {
  const config = useConfig()

  return useQuery({
    queryKey: ['pumaMissions', tokenAddr],
    queryFn: () => fetchAllMissions(config),
    enabled: pumaTokenConfigured,
    staleTime: 15_000,
  })
}

/** Mapa missionId -> ya reclamó (requiere wallet). */
export function usePumaMissionClaims(missions: PumaMissionRow[], userAddress: `0x${string}` | undefined) {
  const config = useConfig()

  return useQuery({
    queryKey: ['pumaMissionClaims', tokenAddr, userAddress, missions.map((m) => m.missionId).join('|')],
    queryFn: async () => {
      if (!pumaTokenConfigured || !userAddress || missions.length === 0) return {}
      const entries = await Promise.all(
        missions.map(async (m) => {
          const done = await rc(config, {
            address: tokenAddr,
            abi: pumaTokenAbi,
            functionName: 'missionCompletedBy',
            args: [m.missionId, userAddress],
          })
          return [m.missionId, done as boolean] as const
        })
      )
      return Object.fromEntries(entries) as Record<string, boolean>
    },
    enabled: pumaTokenConfigured && !!userAddress && missions.length > 0,
    staleTime: 10_000,
  })
}
