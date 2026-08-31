# Deploy en Avalanche — CriptoUNAM

Guía operativa para desplegar PUMAToken, CriptoUNAMBadges y CriptoUNAMDrops en
Avalanche Fuji (testnet) y C-Chain (mainnet). Pensada para que cualquiera del
equipo pueda repetir el proceso sin sorpresas.

> **Cambio importante (2025-Q2):** PUMAToken ahora incluye `payCourse(string, uint256)`
> público para que los alumnos paguen cursos sin necesidad de backend. Este es el
> **flujo activo**. El v1 desplegado antes (`0x9e22…c66434` en Fuji) no se usa.
> Para mainnet, desplegar directamente la versión actual del contrato.

> **Regla #1:** todas las wallets de prueba se quedan en Fuji. Para mainnet se
> genera una seed nueva, limpia, que jamás haya tocado un chat ni un archivo
> plano. Ver [§9](#9-de-fuji-a-mainnet).

---

## 1. Prerrequisitos

| Herramienta | Cómo instalar |
|---|---|
| Foundry (forge + cast) | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |
| Submódulos del repo | `forge install` (la primera vez) |
| AVAX en la wallet deployer | Fuji: faucet gratuito · Mainnet: comprado en exchange |
| API key Snowtrace/Routescan | Opcional en Fuji, **recomendado en mainnet** — https://routescan.io |

El proyecto Foundry está en **`criptounam-contracts/`** (no en la app web).

```bash
cd criptounam-contracts
forge install     # la primera vez
forge --version   # >= 1.5
cast --version
forge build       # tiene que decir "Compiler run successful!"
```

---

## 2. Importar la wallet del deployer a un keystore

Foundry encripta la clave con AES en `~/.foundry/keystores/<nombre>`. La
password se pregunta interactivamente al firmar — no queda en disco ni en
shell history.

### Si tienes seed phrase (12 / 24 palabras)

```bash
# 1. Archivo seguro
umask 077 && touch /tmp/.cu_seed && chmod 600 /tmp/.cu_seed

# 2. Abre nano y pega las palabras EN UNA SOLA LÍNEA, separadas por un espacio
nano /tmp/.cu_seed

# 3. Importa al keystore (te pide password nueva — anótala bien)
cast wallet import deployer-criptounam --mnemonic "$(cat /tmp/.cu_seed)"

# 4. Borrado seguro del temp
rm -P /tmp/.cu_seed
```

⚠️ **No pongas las palabras como argumento del comando**, queda en `~/.zsh_history`.
⚠️ **No las pegues en un chat con asistentes/IA**, queda en logs externos. Si
   pasa, esa wallet queda comprometida — usar sólo en testnet, generar otra
   para mainnet.

### Si tienes private key

```bash
cast wallet import deployer-criptounam --interactive
# Te pide la PK hex y luego la password.
```

### Si necesitas generar una nueva (recomendado para mainnet)

```bash
cast wallet new-mnemonic --words 24
# Imprime la seed UNA vez. Anótala en papel/keepass YA.
# Luego la importas con el flujo anterior.
```

---

## 3. Variables de entorno

Crea `.env.deploy.fuji` (o `.env.deploy.mainnet`) en la raíz del repo. Ya están
en `.gitignore` (`.env.deploy.*`), no se commitean.

```bash
# RPC público de Fuji (testnet, 43113)
export AVAX_FUJI_RPC_URL="https://api.avax-test.network/ext/bc/C/rpc"

# Address del deployer (la que imprimió `cast wallet import`)
export DEPLOYER_ADDRESS="0x..."
export INITIAL_ADMIN="0x..."

# Nombre del keystore importado
export DEPLOYER_ACCOUNT="deployer-criptounam"

# Se llenan paso a paso después de cada deploy
export PUMA_TOKEN=""
export BADGES_CONTRACT=""
export DROPS_CONTRACT=""

# Snowtrace API key (opcional en Fuji, recomendado en mainnet)
export SNOWTRACE_API_KEY=""
```

Para mainnet usa `AVAX_RPC_URL="https://api.avax.network/ext/bc/C/rpc"` (sin
`-test`) y separa el archivo (`.env.deploy.mainnet`).

Carga las vars antes de cada sesión:

```bash
source .env.deploy.fuji
```

---

## 4. Fondear el deployer

### Fuji
- Faucet oficial: https://core.app/tools/testnet-faucet/
- Pide AVAX a tu `$DEPLOYER_ADDRESS`. Llegan ~2 AVAX, sobra para los 3
  deploys + 4 grantRoles (consumen <0.001 AVAX en total).

### Mainnet
- Transfiere desde exchange (Binance, OKX, etc.) directamente a tu
  `$DEPLOYER_ADDRESS` en red C-Chain.
- Con 0.5 AVAX te alcanza para todo el proceso con margen.

Verifica:

```bash
cast balance $DEPLOYER_ADDRESS --rpc-url $AVAX_FUJI_RPC_URL --ether
```

---

## 5. Flujo de cada deploy (patrón general)

Cada script se ejecuta en **dos pasos**: primero dry-run (no firma, no cobra),
luego broadcast (firma real, gasta AVAX). Esto evita sorpresas.

### Patrón

```bash
# Dry-run
forge script <ruta>:<contrato> \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --sender $DEPLOYER_ADDRESS

# Broadcast
forge script <ruta>:<contrato> \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --sender $DEPLOYER_ADDRESS \
  --broadcast --slow
```

> **Mainnet:** añade `--verify --verifier etherscan --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan --etherscan-api-key $SNOWTRACE_API_KEY`

### El comando broadcast SIEMPRE se lanza desde Terminal real

`forge script` pide la password del keystore **interactivamente**. Si lo lanzas
desde dentro de un asistente/chat (Claude Code, IDE inline) o en CI sin TTY,
falla con `Device not configured (os error 6)`. Solución: abre Terminal.app /
iTerm, `cd` al repo, `source .env.deploy.fuji`, y corre ahí.

---

## 6. Deploy paso a paso

### 6.1 PUMAToken

```bash
# Dry-run
forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
  --rpc-url $AVAX_FUJI_RPC_URL --sender $DEPLOYER_ADDRESS

# Broadcast (en Terminal real)
forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --sender $DEPLOYER_ADDRESS \
  --broadcast --slow
```

Output esperado al final:
```
##### fuji
✅  [Success] Hash: 0x...
Contract Address: 0x...
```

Guarda la address en `.env.deploy.fuji`:
```bash
export PUMA_TOKEN="0x..."
```

Y vuelve a `source .env.deploy.fuji`.

### 6.2 CriptoUNAMBadges

Mismo patrón, otro script:

```bash
forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
  --rpc-url $AVAX_FUJI_RPC_URL --sender $DEPLOYER_ADDRESS

forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --sender $DEPLOYER_ADDRESS \
  --broadcast --slow
```

Guarda `BADGES_CONTRACT=0x...`.

### 6.3 CriptoUNAMDrops

Este script lee `PUMA_TOKEN` y `BADGES_CONTRACT` del env (constructor args):

```bash
forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops \
  --rpc-url $AVAX_FUJI_RPC_URL --sender $DEPLOYER_ADDRESS

forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --sender $DEPLOYER_ADDRESS \
  --broadcast --slow
```

Guarda `DROPS_CONTRACT=0x...`.

---

## 7. Roles cruzados (sin esto, claimDrop() revierte)

Drops necesita poder mintear PUMA y Badges en nombre del usuario que reclama.
Le otorgamos los dos roles necesarios.

`cast send` también necesita TTY para la password — corre en Terminal real.

```bash
# REWARD_MANAGER_ROLE en PUMA → Drops
cast send $PUMA_TOKEN "grantRole(bytes32,address)" \
  $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_CONTRACT \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS

# MINTER_ROLE en Badges → Drops
cast send $BADGES_CONTRACT "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE") $DROPS_CONTRACT \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS
```

Si vas a usar el endpoint serverless `/api/courses/auto-certificate` para mintear
certificados de cursos al completar 100%, también otorga los roles al **minter
operativo** (otra wallet dedicada, no la del deployer):

```bash
export MINTER_WALLET="0x..."   # wallet operativa del endpoint

cast send $BADGES_CONTRACT "grantRole(bytes32,address)" \
  $(cast keccak "MINTER_ROLE") $MINTER_WALLET \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS

cast send $PUMA_TOKEN "grantRole(bytes32,address)" \
  $(cast keccak "REWARD_MANAGER_ROLE") $MINTER_WALLET \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS
```

Verificación:

```bash
cast call $PUMA_TOKEN "hasRole(bytes32,address)(bool)" \
  $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_CONTRACT \
  --rpc-url $AVAX_FUJI_RPC_URL
# debe imprimir: true

cast call $BADGES_CONTRACT "hasRole(bytes32,address)(bool)" \
  $(cast keccak "MINTER_ROLE") $DROPS_CONTRACT \
  --rpc-url $AVAX_FUJI_RPC_URL
# debe imprimir: true
```

---

## 8. Configurar el frontend

### En `.env` local (para desarrollo)

```
VITE_CHAIN_ID=43113
VITE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_EXPLORER_URL=https://testnet.snowtrace.io
VITE_PUMA_TOKEN_ADDRESS=0x...
VITE_BADGES_CONTRACT_ADDRESS=0x...
VITE_DROPS_CONTRACT_ADDRESS=0x...
VITE_BADGES_METADATA_BASE=ipfs://<CID>/
VITE_BADGES_CLAIM_ENDPOINT=/api/courses/auto-certificate
```

### En Vercel (production)

Mismas variables `VITE_*` en **Project → Settings → Environment Variables**.

Además, las del backend serverless (sin prefijo `VITE_`):

```
MINTER_PRIVATE_KEY=0x...           # PK de la $MINTER_WALLET (NO la del deployer)
AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
BADGES_CONTRACT=0x...
PUMA_TOKEN=0x...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
BADGES_METADATA_BASE=ipfs://<CID>/
CERT_PUMA_REWARD=100
```

Redeploy en Vercel tras agregar las vars.

---

## 9. De Fuji a mainnet

Después de validar el flujo completo en Fuji (crear drop, hacer claim, mint
de certificado), el deploy a C-Chain mainnet es **el mismo proceso** con tres
cambios:

1. **Wallet nueva.** Genera otra seed con `cast wallet new-mnemonic --words 24`,
   guarda la frase en papel/gestor seguro, impórtala como
   `deployer-criptounam-main`. La wallet de Fuji **jamás** pasa a mainnet —
   diferente seed, diferente keystore, diferente fondeo.
2. **`.env.deploy.mainnet`** apuntando a `https://api.avax.network/ext/bc/C/rpc`,
   con `INITIAL_ADMIN` idealmente apuntando a un **Safe multisig** (no a la
   wallet del deployer).
3. **Verificación on-chain.** Añade `--verify --verifier etherscan
   --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan
   --etherscan-api-key $SNOWTRACE_API_KEY` a cada `forge script`.

Resto idéntico al flujo Fuji.

---

## 10. Troubleshooting

| Síntoma | Causa | Solución |
|---|---|---|
| `Device not configured (os error 6)` al broadcast | No hay TTY (estás dentro de un chat / IDE inline) | Lanza el comando desde Terminal.app real |
| `Error: odd number of digits` en `cast wallet import --interactive` | El flag interactive espera private key hex, no mnemonic | Usa `--mnemonic` con archivo temporal (ver §2) |
| `incorrect password` al firmar | Password del keystore equivocada | Reintenta; no se cobra gas |
| `insufficient funds for gas` | Wallet sin AVAX | Faucet (Fuji) o transferencia (mainnet) |
| `Keystore file already exists` | Ya importaste antes con ese nombre | `rm ~/.foundry/keystores/<nombre>` y reimporta — o usa otro nombre |
| Verification failed en Routescan | Rate limit o api key inválida | Reintenta sin `--etherscan-api-key`; Routescan permite anónimo con throttle |
| `nonce too low / too high` | Tx pendiente en mempool con nonce conflictivo | `cast nonce $DEPLOYER_ADDRESS --rpc-url $RPC` y espera o cancela |

---

## 11. Direcciones desplegadas

### Fuji (43113) — ACTIVO

| Contrato | Address | Notas |
|---|---|---|
| **PUMAToken v2** ⭐ | `0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F` | Con `payCourse()` pública. Activo en el front. |
| CriptoUNAMBadges | `0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2` | Sin cambios |
| CriptoUNAMDrops | `0x39Dc95686ca780D7067a709055FDBeeA4da14B83` | Apunta a **PUMA v1** todavía. Para que claims sigan funcionando hay que re-otorgar `REWARD_MANAGER_ROLE` en v2 a Drops (ver §12). |

### Fuji — históricos / deprecados

| Contrato | Address | Razón |
|---|---|---|
| PUMAToken v1 | `0x9e220F8672c2A6345C5Bf012777Aa97CF2c66434` | Sin `payCourse()`. Requería approve + endpoint backend. |

#### Tx clave del despliegue inicial

| Acción | Tx hash | Block |
|---|---|---|
| Deploy PUMA v1 | `0xda56a5a5...142d715d` | 55,877,858 |
| Deploy Badges | `0x29effb8c...e56d5dbe` | 55,877,974 |
| Deploy Drops | _ver broadcast/_ | ~55,878,000 |
| GrantRole REWARD_MANAGER_ROLE (v1 → Drops) | `0x4f6722a5...e24a4b3` | 55,878,061 |
| GrantRole MINTER_ROLE (Badges → Drops) | `0xfaf4a65d...52c76ba` | 55,878,064 |
| **Deploy PUMA v2** (con payCourse) | _ver broadcast/_ | ~55,9xx,xxx |

### Mainnet (43114) — PENDIENTE

| Contrato | Address |
|---|---|
| PUMAToken | _por desplegar (directamente v2)_ |
| CriptoUNAMBadges | _por desplegar_ |
| CriptoUNAMDrops | _por desplegar_ |

Explorer: https://snowtrace.io/

---

## 12. Post-deploy de PUMA v2 (Fuji) — tareas

### a) Re-otorgar rol al Drops contract

Drops fue desplegado apuntando a PUMA v1 (constructor immutable). En PUMA v2 el contrato Drops aún **no tiene** `REWARD_MANAGER_ROLE`. Sin esto, las claims de drops fallarán al intentar mintear PUMA.

```bash
source .env.deploy.fuji
cast send $PUMA_TOKEN "grantRole(bytes32,address)" \
  $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_CONTRACT \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account deployer-criptounam --from $DEPLOYER_ADDRESS
```

> ⚠️ **Pero ojo:** Drops sigue apuntando a v1 (`puma immutable`). Aunque le des el rol en v2, Drops va a intentar mintear en v1. Para arreglarlo de raíz hay que **redesplegar Drops** apuntando al nuevo PUMA. En Fuji puedes hacerlo cuando lo necesites; mientras tanto, los drops no funcionan en v2.

### b) Probar `payCourse()` end-to-end

1. Transfiere PUMA a una wallet de prueba: `cast send $PUMA_TOKEN "transferReward(address,uint256)" <dest> 100000000000000000000 --account deployer-criptounam --from $DEPLOYER_ADDRESS`
2. Desde el front, conecta esa wallet, entra a un curso de 100 PUMA, click "Pagar".
3. Verifica el evento `CoursePaid` en el explorer.

### c) Verificar contrato en Snowtrace
```bash
forge verify-contract \
  $PUMA_TOKEN \
  contracts/PUMAToken.sol:PUMAToken \
  --chain-id 43113 \
  --verifier etherscan \
  --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan \
  --constructor-args $(cast abi-encode "constructor(address,uint256)" $DEPLOYER_ADDRESS 10000000000000000000000000)
```

Explorer: https://testnet.snowtrace.io/

### Mainnet (43114)

| Contrato | Address | Tx hash | Block |
|---|---|---|---|
| PUMAToken | _pendiente_ | | |
| CriptoUNAMBadges | _pendiente_ | | |
| CriptoUNAMDrops | _pendiente_ | | |

Explorer: https://snowtrace.io/

---

## 12. Comandos útiles post-deploy

### Crear una misión (PUMA)
```bash
DEADLINE=$(($(date +%s) + 86400 * 30))   # 30 días desde ahora
cast send $PUMA_TOKEN "createMission(string,string,uint256,uint256)" \
  "welcome" "Misión de bienvenida" 100000000000000000000 $DEADLINE \
  --rpc-url $AVAX_FUJI_RPC_URL --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS
```

### Crear un drop (PUMA + POAP con código)
```bash
DEADLINE=$(($(date +%s) + 86400 * 7))
cast send $DROPS_CONTRACT \
  "createDrop(string,string,uint256,uint8,string,string,uint256)" \
  "meetup-cdmx-1" "Meetup CDMX #1" 50000000000000000000 1 \
  "evento-meetup-cdmx-1" "ipfs://CID/meetup-1.json" $DEADLINE \
  --rpc-url $AVAX_FUJI_RPC_URL --account $DEPLOYER_ACCOUNT --from $DEPLOYER_ADDRESS
```

### Mintear un certificado manualmente
```bash
export BADGES_CONTRACT=0x...
export MINT_TO=0x...
export BADGE_KIND=0   # 0=CourseCompletion, 1=EventAttendance, 2=Ambassador, 3=Certification
export BADGE_REF="course-intro-blockchain-v1"
export TOKEN_URI="ipfs://CID/course-intro-blockchain-v1.json"

forge script script/MintCriptoUNAMBadge.s.sol:MintCriptoUNAMBadge \
  --rpc-url $AVAX_FUJI_RPC_URL \
  --account $DEPLOYER_ACCOUNT --sender $DEPLOYER_ADDRESS \
  --broadcast
```

### Leer estado on-chain
```bash
# Balance PUMA de una wallet
cast call $PUMA_TOKEN "balanceOf(address)(uint256)" 0x... \
  --rpc-url $AVAX_FUJI_RPC_URL

# Total supply
cast call $PUMA_TOKEN "totalSupply()(uint256)" --rpc-url $AVAX_FUJI_RPC_URL

# Si una wallet ya completó una misión
cast call $PUMA_TOKEN "missionCompletedBy(string,address)(bool)" \
  "welcome" 0x... --rpc-url $AVAX_FUJI_RPC_URL
```
