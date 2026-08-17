/**
 * @deprecated Desde PUMAToken v2 (Fuji `0xF5F8...Ee1F`, ver README) el contrato
 * incluye `payCourse(cursoId, amount)` público. El front llama directamente
 * desde la wallet del alumno — este endpoint ya NO está enchufado al UI.
 *
 * Se conserva como respaldo para escenarios futuros donde sea útil tener
 * un cajero backend (ej. patrocinar gas del alumno, anti-spam con allowlist,
 * o si por alguna razón se redespliega un PUMA sin `payCourse`). Si se
 * decide retomarlo, también restaurar `VITE_COURSE_PAYMENT_ENDPOINT` en
 * el `.env.local` y revertir el refactor de `CoursePumaPayment.tsx`.
 *
 * Vercel Function: confirmación de pago de curso con $PUMA (modo legacy).
 *
 * Flujo:
 *   1. El alumno hace `approve(PUMA_TOKEN, precioWei)` desde el front
 *      (autoriza al propio contrato PUMA a quemar sus tokens).
 *   2. POST a este endpoint con { wallet, cursoId, amount, reason }.
 *   3. El endpoint, con MINTER_PRIVATE_KEY (que tiene REWARD_MANAGER_ROLE),
 *      ejecuta `burnReward(wallet, amountWei, reason)` en el contrato PUMA.
 *   4. El contrato verifica allowance, quema los tokens y emite RewardBurned.
 *   5. Devolvemos txHash al front para confirmar la inscripción.
 *
 * Variables de entorno (sin prefijo VITE_):
 *   MINTER_PRIVATE_KEY  — wallet con REWARD_MANAGER_ROLE en PUMAToken
 *   AVAX_RPC_URL        — RPC de Avalanche (C-Chain o Fuji)
 *   PUMA_TOKEN          — dirección del contrato PUMAToken
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  isAddress,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { avalanche, avalancheFuji } from 'viem/chains'
import { authenticate, assertWalletOwned } from '../_lib/privy.js'
import { enforceRateLimit } from '../_lib/ratelimit.js'
import { setCors, sendError, readBody } from '../_lib/http.js'

const pumaAbi = [
  {
    type: 'function',
    name: 'burnReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

type Body = {
  wallet?: string
  cursoId?: string
  amount?: number | string
  reason?: string
}

function jsonError(res: any, status: number, error: string, detail?: unknown) {
  res.status(status).json({ error, detail })
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') {
    return jsonError(res, 405, 'Method not allowed')
  }

  const body = readBody(req) as Body
  const wallet = (body.wallet || '').toLowerCase()
  const cursoId = String(body.cursoId || '').trim()
  const amountRaw = Number(body.amount || 0)
  const reason = (body.reason || `Pago curso ${cursoId}`).trim()

  if (!isAddress(wallet)) return jsonError(res, 400, 'wallet inválida')
  if (!cursoId) return jsonError(res, 400, 'cursoId requerido')
  if (!Number.isFinite(amountRaw) || amountRaw <= 0) {
    return jsonError(res, 400, 'amount inválido')
  }

  // ---- Autenticación: este endpoint firma con MINTER_PRIVATE_KEY ----
  // Sin esto, cualquiera podía disparar el burn de cualquier wallet que
  // tuviera allowance aprobada, solo escribiendo su dirección en el body.
  try {
    await enforceRateLimit(req, { name: 'courses:payment', limit: 10, windowSeconds: 600 })
    const user = await authenticate(req, { withProfile: true })
    assertWalletOwned(user, wallet)
  } catch (err) {
    return sendError(res, err)
  }

  const { MINTER_PRIVATE_KEY, AVAX_RPC_URL, PUMA_TOKEN } = process.env

  if (!MINTER_PRIVATE_KEY || !AVAX_RPC_URL || !PUMA_TOKEN) {
    return jsonError(res, 500, 'Backend mal configurado (faltan envs on-chain)')
  }

  // Selección de chain: detectar por RPC. Fuji incluye "avax-test" en el URL.
  const isFuji = AVAX_RPC_URL.includes('avax-test') || AVAX_RPC_URL.includes('fuji')
  const chain = isFuji ? avalancheFuji : avalanche

  const account = privateKeyToAccount(MINTER_PRIVATE_KEY as `0x${string}`)
  const transport = http(AVAX_RPC_URL)
  const walletClient = createWalletClient({ account, chain, transport })
  const publicClient = createPublicClient({ chain, transport })

  const amountWei = parseEther(String(amountRaw))

  // ---- Verifica que el alumno aprobó al contrato PUMA antes de quemar ----
  try {
    const allowance = await publicClient.readContract({
      address: PUMA_TOKEN as `0x${string}`,
      abi: pumaAbi,
      functionName: 'allowance',
      args: [wallet as `0x${string}`, PUMA_TOKEN as `0x${string}`],
    })
    if ((allowance as bigint) < amountWei) {
      return jsonError(res, 403, 'Allowance insuficiente. El alumno no aprobó el burn.', {
        allowance: String(allowance),
        amountWei: String(amountWei),
      })
    }
  } catch (e: any) {
    return jsonError(res, 500, 'No se pudo leer allowance', e?.shortMessage || e?.message)
  }

  // ---- Quema ----
  let txHash: `0x${string}`
  try {
    txHash = await walletClient.writeContract({
      chain,
      address: PUMA_TOKEN as `0x${string}`,
      abi: pumaAbi,
      functionName: 'burnReward',
      args: [wallet as `0x${string}`, amountWei, reason],
    })
  } catch (e: any) {
    return jsonError(res, 500, 'burnReward falló', e?.shortMessage || e?.message)
  }

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
  if (receipt.status !== 'success') {
    return jsonError(res, 500, 'Tx de burnReward revertida on-chain', { txHash })
  }

  return res.status(200).json({ ok: true, txHash, amount: amountRaw, cursoId })
}
