# 🚀 Despliegue en Arbitrum One — Runbook

Red destino: **Arbitrum One (mainnet)** · Chain ID: **42161** · Explorer: https://arbiscan.io

> ⚠️ Vas directo a mainnet sin pasar por testnet. **Léelo todo y haz un dry-run** antes
> de cada `--broadcast`. Cada error en mainnet cuesta gas real y puede dejar el supply
> de PUMA en un estado inconsistente.

---

## 0. Prerrequisitos (una sola vez)

### Cuentas y wallets
- [ ] **Wallet deployer**: hardware wallet (Ledger/Trezor) o keystore cifrado en disco.
  - **NUNCA** usar la wallet del front-end ni un private key en `.env` plano.
  - Fondear con ETH en Arbitrum (~0.005 ETH suficiente para los dos contratos).
- [ ] **Multisig admin** (recomendado): Gnosis Safe en Arbitrum.
  - Esta wallet será `DEFAULT_ADMIN_ROLE` del PUMAToken y del Badges.
  - Sin multisig pierdes rotación de roles si comprometen al admin.
- [ ] **Wallet operativa**: la que tendrá `MINTER_ROLE` (Badges) y `REWARD_MANAGER_ROLE`
  (PUMA) para mintear desde el backend. Hot wallet aceptable, con saldo de gas controlado.

### Cuentas externas
- [ ] **Arbiscan API key** — https://arbiscan.io/myapikey (gratis, registro con email).
  Va en `ARBISCAN_API_KEY`. La misma key funciona para Arbitrum One y Sepolia.
- [ ] **RPC** — puedes usar:
  - Público (lento): `https://arb1.arbitrum.io/rpc`
  - Recomendado: Alchemy (https://www.alchemy.com/) o QuickNode (gratis hasta cierto cap).

### Software
```bash
foundryup           # instala foundry
forge --version     # >= 0.2.0
```

---

## 1. Configurar variables locales

Crea `~/.criptounam-deploy.env` (fuera del repo):

```bash
# Wallet
export PRIVATE_KEY=0x...                 # SOLO para deploy. Olvídalo después con `unset PRIVATE_KEY`
export INITIAL_ADMIN=0xGnosisSafeAddress  # multisig en Arbitrum
export INITIAL_MINT=10000000000000000000000000  # 10M PUMA con 18 dec

# RPC + verificación
export ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
export ARBISCAN_API_KEY=tuApiKey

# (Opcional, si usas Alchemy/Infura)
# export ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/TU_KEY
```

Cárgalo en cada terminal donde vayas a deployar:

```bash
source ~/.criptounam-deploy.env
```

---

## 2. Build y tests locales (obligatorio antes del deploy)

```bash
cd criptounam
forge build
forge test -vv
```

- [ ] **0 warnings** de Solidity y **todos los tests pasan**.
- [ ] Revisa `out/PUMAToken.sol/PUMAToken.json` y `out/CriptoUNAMBadges.sol/CriptoUNAMBadges.json` existen.

---

## 3. Dry-run en Arbitrum (simulación contra estado real)

Esto NO emite ninguna transacción. Te dice qué pasaría, gas estimado, dirección que se
ocuparía, balances necesarios.

### 3.1 PUMAToken
```bash
forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
  --rpc-url $ARBITRUM_RPC_URL \
  -vvv
```

Verifica en la salida:
- ✅ `INITIAL_ADMIN` es el multisig (no tu wallet personal).
- ✅ `INITIAL_MINT` no excede `MAX_SUPPLY = 1_000_000_000e18`.
- ✅ Gas estimado total < 5M unidades.
- ✅ La dirección donde se desplegará (CREATE address).

### 3.2 CriptoUNAMBadges
```bash
forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
  --rpc-url $ARBITRUM_RPC_URL \
  -vvv
```

---

## 4. Deploy real — PUMAToken

```bash
forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
  --rpc-url $ARBITRUM_RPC_URL \
  --broadcast \
  --verify \
  --verifier etherscan \
  --verifier-url https://api.arbiscan.io/api \
  --etherscan-api-key $ARBISCAN_API_KEY \
  --slow
```

- `--slow` espera confirmación entre transacciones (más seguro en mainnet).
- `--verify` envía la metadata a Arbiscan para que el código quede público.

Al terminar copia:
```
PUMAToken deployed at: 0xAAA...
```

Guárdalo. **Esa es la dirección que va a `VITE_PUMA_TOKEN_ADDRESS`.**

Verifica manualmente:
- [ ] Visita `https://arbiscan.io/address/0xAAA...` → tab "Contract" debe mostrar "Source Code Verified ✓".
- [ ] Tab "Read Contract" → llama `totalSupply()` y debe devolver `INITIAL_MINT`.
- [ ] `hasRole(DEFAULT_ADMIN_ROLE, INITIAL_ADMIN)` → `true`.

---

## 5. Deploy real — CriptoUNAMBadges

```bash
forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
  --rpc-url $ARBITRUM_RPC_URL \
  --broadcast \
  --verify \
  --verifier etherscan \
  --verifier-url https://api.arbiscan.io/api \
  --etherscan-api-key $ARBISCAN_API_KEY \
  --slow
```

Guarda:
```
CriptoUNAMBadges deployed at: 0xBBB...
```

→ `VITE_BADGES_CONTRACT_ADDRESS`.

Verifica:
- [ ] Tab "Contract" verificado en Arbiscan.
- [ ] `name()` → `"CriptoUNAM Credentials"`.
- [ ] `hasRole(DEFAULT_ADMIN_ROLE, INITIAL_ADMIN)` → `true`.

---

## 5bis. Deploy real — CriptoUNAMDrops

Este contrato coordina PUMA + Badges con código compartido (sesiones de embajadores,
eventos presenciales). Requiere las direcciones de los dos contratos anteriores.

```bash
export PUMA_TOKEN=0xAAA...        # del paso 4
export BADGES_CONTRACT=0xBBB...   # del paso 5

forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops \
  --rpc-url $ARBITRUM_RPC_URL \
  --broadcast \
  --verify \
  --verifier etherscan \
  --verifier-url https://api.arbiscan.io/api \
  --etherscan-api-key $ARBISCAN_API_KEY \
  --slow
```

Guarda:
```
CriptoUNAMDrops deployed at: 0xCCC...
```

→ `VITE_DROPS_CONTRACT_ADDRESS`.

Verifica en Arbiscan:
- [ ] Contract verificado.
- [ ] `puma()` → 0xAAA…
- [ ] `badges()` → 0xBBB…
- [ ] `hasRole(DEFAULT_ADMIN_ROLE, INITIAL_ADMIN)` → `true`.

---

## 6. Otorgar roles operativos

Ahora desde el **multisig** (o desde la wallet `INITIAL_ADMIN`):

### 6.1 PUMA — REWARD_MANAGER_ROLE y MISSION_MANAGER_ROLE

```bash
# Desde la wallet INITIAL_ADMIN
export PUMA_TOKEN=0xAAA...
export OPS_WALLET=0xWalletOperativa...

# Hash del rol REWARD_MANAGER_ROLE
REWARD_ROLE=$(cast keccak "REWARD_MANAGER_ROLE")
MISSION_ROLE=$(cast keccak "MISSION_MANAGER_ROLE")

cast send $PUMA_TOKEN "grantRole(bytes32,address)" $REWARD_ROLE $OPS_WALLET \
  --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_PRIVATE_KEY

cast send $PUMA_TOKEN "grantRole(bytes32,address)" $MISSION_ROLE $OPS_WALLET \
  --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_PRIVATE_KEY
```

### 6.2 Badges — MINTER_ROLE

```bash
export BADGES_CONTRACT=0xBBB...
MINTER_ROLE=$(cast keccak "MINTER_ROLE")

cast send $BADGES_CONTRACT "grantRole(bytes32,address)" $MINTER_ROLE $OPS_WALLET \
  --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_PRIVATE_KEY
```

### 6.3 Roles cruzados al contrato Drops (CRÍTICO)

El contrato `CriptoUNAMDrops` necesita roles en los dos contratos anteriores para poder
mintear PUMA y NFTs cuando un alumno reclama un drop. SIN esto, `claimDrop()` revertirá.

```bash
export DROPS_CONTRACT=0xCCC...

# Permitir que Drops mintee PUMA
cast send $PUMA_TOKEN "grantRole(bytes32,address)" $REWARD_ROLE $DROPS_CONTRACT \
  --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_PRIVATE_KEY

# Permitir que Drops emita Badges
cast send $BADGES_CONTRACT "grantRole(bytes32,address)" $MINTER_ROLE $DROPS_CONTRACT \
  --rpc-url $ARBITRUM_RPC_URL --private-key $ADMIN_PRIVATE_KEY
```

### 6.4 Verificación

```bash
# La wallet operativa tiene los roles correctos
cast call $PUMA_TOKEN "hasRole(bytes32,address)" $REWARD_ROLE $OPS_WALLET --rpc-url $ARBITRUM_RPC_URL
# → true

# El contrato Drops tiene los roles correctos
cast call $PUMA_TOKEN "hasRole(bytes32,address)" $REWARD_ROLE $DROPS_CONTRACT --rpc-url $ARBITRUM_RPC_URL
# → true
cast call $BADGES_CONTRACT "hasRole(bytes32,address)" $MINTER_ROLE $DROPS_CONTRACT --rpc-url $ARBITRUM_RPC_URL
# → true
```

> Si el admin es multisig, lanza estas transacciones desde Gnosis Safe en
> https://app.safe.global, no con `cast`.

---

## 7. Subir metadata de NFTs a IPFS (Pinata)

Para cada `BadgeKind` necesitas un JSON ERC-721 con imagen.

### 7.1 Crear archivos

`public/badges-metadata/course-1-v1.json`:
```json
{
  "name": "CriptoUNAM · Introducción a Blockchain",
  "description": "Certificado soulbound de finalización del curso introducción a blockchain en CriptoUNAM. Cohorte v1.",
  "image": "ipfs://CID-IMAGEN/course-1-v1.png",
  "external_url": "https://criptounam.xyz/cursos",
  "attributes": [
    { "trait_type": "Tipo", "value": "Course Completion" },
    { "trait_type": "Cohorte", "value": "v1" },
    { "trait_type": "Soulbound", "value": "Sí" }
  ]
}
```

### 7.2 Subir a Pinata
1. https://app.pinata.cloud → File browser → "Add Files" → sube imágenes PNG.
2. Anota el CID de la carpeta de imágenes → reemplaza `CID-IMAGEN` en cada JSON.
3. Crea otra carpeta y sube los JSON → anota el CID de los metadata.
4. Configura `VITE_BADGES_METADATA_BASE=ipfs://CID-METADATA/`.

---

## 8. Configurar Vercel (frontend prod)

### 8.1 Variables públicas (frontend, prefijo VITE_)

Settings → Environment Variables (Production):

```
VITE_CHAIN_ID=42161
VITE_RPC_URL=https://arb1.arbitrum.io/rpc
VITE_EXPLORER_URL=https://arbiscan.io
VITE_PUMA_TOKEN_ADDRESS=0xAAA...          # del paso 4
VITE_BADGES_CONTRACT_ADDRESS=0xBBB...     # del paso 5
VITE_DROPS_CONTRACT_ADDRESS=0xCCC...      # del paso 5bis
VITE_BADGES_METADATA_BASE=ipfs://CID-METADATA/
VITE_WALLET_CONNECT_PROJECT_ID=...        # Reown ProjectId
```

### 8.2 Variables PRIVADAS para la Vercel Function de auto-certificate

> ⚠️ **NO uses prefijo `VITE_` en estas.** Si lo haces, terminan en el bundle del cliente.
> Estas viven sólo en el runtime serverless.

```
MINTER_PRIVATE_KEY=0x...                  # wallet operativa con MINTER (Badges) + REWARD_MGR (PUMA)
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
BADGES_CONTRACT=0xBBB...
PUMA_TOKEN=0xAAA...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # service role, NO la anon key
BADGES_METADATA_BASE=ipfs://CID-METADATA/
CERT_PUMA_REWARD=100                      # opcional: PUMA al emitir certificado (0 = ninguno)
```

> En Vercel, marca cada variable como "Production" (no Preview, salvo que quieras testear
> en branches). El SUPABASE_SERVICE_ROLE_KEY se saca de Supabase → Settings → API → service_role.

### 8.3 Crear tabla `curso_certificados` en Supabase

```sql
create table curso_certificados (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  curso_id       text not null,
  badge_ref      text not null,
  token_id       numeric,
  tx_hash        text,
  claimed_at     timestamptz not null default now(),
  unique (wallet_address, badge_ref)
);
create index curso_certificados_wallet_idx on curso_certificados (wallet_address);
```

Redeploy: Vercel → Deployments → Redeploy último commit.

---

## 9. Smoke test post-deploy

Conéctate al sitio en producción con una wallet **distinta** al admin y verifica:

### 9.1 Contratos básicos
- [ ] `/recompensas` — saldo PUMA del admin se muestra correcto.
- [ ] `/admin/puma` — admin ve el panel (tabs General/Misiones/Recompensas/Drops).
- [ ] `/admin/puma` (Misiones) — crear misión `test-arbitrum-go-live` con 1 PUMA, +7d.
- [ ] Cambia a otra wallet → `/recompensas/misiones` lista la misión → reclama → recibe 1 PUMA.
- [ ] En Arbiscan los 3 contratos siguen "Verified ✓".

### 9.2 Drops con código
- [ ] `/admin/puma` (Drops) — crear drop con código `test-drop-001`, 5 PUMA, badge `EventAttendance`, ref `test-event-001`, deadline 24h.
- [ ] Con otra wallet → `/claim` → escribe `test-drop-001` → ve el preview → reclama → recibe 5 PUMA + 1 NFT.
- [ ] Intenta reclamar de nuevo → debe mostrar "Ya reclamado".
- [ ] `/admin/puma` (Drops) → desactivar drop → otra wallet no puede reclamar.

### 9.3 Auto-certificate de curso
- [ ] Una wallet de prueba se inscribe a un curso corto y completa todas las lecciones.
- [ ] Al completar la última, `CourseCertificateCTA` muestra "Emitiendo tu certificado on-chain…".
- [ ] En ~10 segundos cambia a "¡Certificado emitido!" con link al tx en Arbiscan.
- [ ] La fila aparece en `curso_certificados` de Supabase.
- [ ] Si el endpoint falla, fallback muestra "Reclamar manualmente" → `/claim/curso/...`.

---

## 10. Costos estimados en Arbitrum (referencia)

| Operación                            | Gas       | Costo USD (ETH @ 3500, gas 0.01 gwei) |
|--------------------------------------|-----------|---------------------------------------|
| Deploy PUMAToken                     | ~3.5M     | ~$0.12                                |
| Deploy CriptoUNAMBadges              | ~2.5M     | ~$0.09                                |
| grantRole                            | ~50k      | ~$0.002                               |
| createMission                        | ~100k     | ~$0.004                               |
| completeMission (alumno)             | ~80k      | ~$0.003                               |
| mint badge                           | ~150k     | ~$0.005                               |

Total deploy + setup inicial: **< $0.50 USD**.

---

## 11. Si algo sale mal

### "Insufficient funds for gas"
- Tu wallet en Arbitrum no tiene ETH. Bridge desde mainnet con
  https://bridge.arbitrum.io (toma ~10 min) o compra ETH directo en Arbitrum
  desde una rampa fiat.

### "Nonce too low"
- Reusaste una tx. Espera 1 minuto y reintenta. El `--slow` ayuda.

### "Contract creation failed"
- Revisa el dry-run otra vez. Probablemente el constructor revirtió por
  `MAX_SUPPLY_EXCEEDED` o por `INITIAL_MINT` en 0.

### "Verification failed"
- A veces tarda. Espera 5 min y corre manualmente:
  ```bash
  forge verify-contract --watch \
    --verifier etherscan \
    --verifier-url https://api.arbiscan.io/api \
    --etherscan-api-key $ARBISCAN_API_KEY \
    --chain 42161 \
    --num-of-optimizations 200 \
    0xAAA... contracts/PUMAToken.sol:PUMAToken \
    --constructor-args $(cast abi-encode "constructor(address,uint256)" $INITIAL_ADMIN $INITIAL_MINT)
  ```

### "He desplegado pero la wallet del admin se perdió"
- Si ya transferiste `DEFAULT_ADMIN_ROLE` al multisig, no pasa nada: el multisig sigue funcionando.
- Si no transferiste, **no hay recuperación**. Redeploy de cero.

---

## 12. Checklist de cierre

- [ ] PUMAToken deployed y verificado en Arbiscan.
- [ ] CriptoUNAMBadges deployed y verificado en Arbiscan.
- [ ] Roles `DEFAULT_ADMIN_ROLE` en multisig (no en hot wallet).
- [ ] Roles operativos otorgados a la wallet del backend.
- [ ] Metadata subida a IPFS y `VITE_BADGES_METADATA_BASE` configurado.
- [ ] Vercel env vars actualizados y redeploy ejecutado.
- [ ] Smoke test OK con dos wallets distintas.
- [ ] Adresses guardadas en este doc y compartidas con el equipo.

---

## Direcciones de producción

> Llenar después del deploy:

| Contrato            | Dirección | Verificado |
|---------------------|-----------|------------|
| PUMAToken           | `0x…`     | https://arbiscan.io/address/0x… |
| CriptoUNAMBadges    | `0x…`     | https://arbiscan.io/address/0x… |
| CriptoUNAMDrops     | `0x…`     | https://arbiscan.io/address/0x… |
| Multisig admin      | `0x…`     | https://app.safe.global/arb1:0x… |
| Wallet operativa    | `0x…`     | (hot, monitoreada)                |
