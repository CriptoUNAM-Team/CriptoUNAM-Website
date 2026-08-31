# CriptoUNAM

Sitio web y plataforma educativa Web3 de CriptoUNAM. Construido con **Vite + React + TypeScript**, integrado con **Avalanche C-Chain** (mainnet) / **Fuji** (testnet) vía **wagmi + viem + Reown AppKit**, persistencia en **Supabase**, y stack de contratos propios en Solidity (Foundry).

- **Documentación:** [docs/](../docs/)
- **Schema Supabase:** [supabase/schema.sql](../supabase/schema.sql) + [supabase/cursos.sql](../supabase/cursos.sql)
- **Contratos (Foundry):** [../criptounam-contracts/](../criptounam-contracts/)
- **Playbook de deploy:** [docs/DEPLOY_AVALANCHE.md](../docs/DEPLOY_AVALANCHE.md)

---

## Contratos on-chain

Stack de 3 contratos que componen el modelo económico/credencial:

| Contrato | Rol |
|---|---|
| **PUMAToken** (ERC-20) | Token de recompensas y pago. Misiones, pagos de cursos, transferencias. |
| **CriptoUNAMBadges** (ERC-721) | NFTs educativos: certificados soulbound + POAPs transferibles. |
| **CriptoUNAMDrops** | Coordinador: en sesión/evento se comparte un código → cualquier wallet reclama PUMA + NFT POAP. |

### Direcciones desplegadas

#### Avalanche **Fuji** testnet (chainId 43113)

| Contrato | Address | Estado |
|---|---|---|
| **PUMAToken v2** ⭐ | `0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F` | ✅ Activo — incluye `payCourse()` pública |
| PUMAToken v1 (deprecado) | `0x9e220F8672c2A6345C5Bf012777Aa97CF2c66434` | ⛔ No usar — sin `payCourse()`, sin migración de balances |
| **CriptoUNAMBadges** | `0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2` | ✅ Activo |
| **CriptoUNAMDrops** | `0x39Dc95686ca780D7067a709055FDBeeA4da14B83` | ✅ Activo — apunta al **PUMAToken v1** (ver nota más abajo) |

Explorer: https://testnet.snowtrace.io/

#### Avalanche **C-Chain** mainnet (chainId 43114)

| Contrato | Address | Estado |
|---|---|---|
| PUMAToken | _pendiente de deploy_ | — |
| CriptoUNAMBadges | _pendiente de deploy_ | — |
| CriptoUNAMDrops | _pendiente de deploy_ | — |

Explorer: https://snowtrace.io/

> **Antes de tocar mainnet:** generar una seed phrase nueva y limpia para el deployer (ver §"Mainnet" más abajo).

---

## Historial de cambios on-chain

### 2025 (despliegue inicial Fuji)
1. **PUMAToken v1** desplegado (`0x9e22...c66434`) con el flujo original `approve + burnReward` que requiere `REWARD_MANAGER_ROLE` en una wallet operativa.
2. **CriptoUNAMBadges** desplegado (`0x44F1...768b2`).
3. **CriptoUNAMDrops** desplegado (`0x39Dc...14B83`) apuntando a PUMA v1 + Badges.
4. Roles cruzados otorgados:
   - `REWARD_MANAGER_ROLE` en PUMA v1 → Drops contract
   - `MINTER_ROLE` en Badges → Drops contract

### 2025-Q2 (refactor del flujo de pago)
**Problema:** `burnReward()` solo lo puede llamar una wallet con `REWARD_MANAGER_ROLE`. Para pagar un curso, el alumno tenía que:
1. Firmar `approve(PUMA, monto)`
2. Esperar a que el backend (con wallet operativa + rol) ejecutara `burnReward(alumno, monto, "Pago curso X")`

Esto requería endpoint serverless + wallet operativa con clave privada en Vercel. Complejo y con punto único de falla.

**Solución:** se añadió `payCourse(string cursoId, uint256 amount)` al contrato. Es **pública**, cualquier wallet puede llamarla:
- Quema sus propios tokens (no requiere approve)
- Emite evento `CoursePaid(user, cursoId, amount)` con registro on-chain del pago
- Cero backend, cero endpoint, cero clave operativa custodiada

**Cambio incompatible**: la función nueva exigía redesplegar el contrato. Se desplegó **PUMAToken v2** (`0xF5F8...Ee1F`). El v1 quedó desactivado (no migramos balances — en testnet no importa).

### Pendiente
- [ ] Re-otorgar `REWARD_MANAGER_ROLE` al **Drops contract** en PUMA v2 para que las claims de drops sigan funcionando.
- [ ] Decidir si el Drops contract se redespliega con `puma` apuntando al v2, o si se queda con el v1 (y el Drops del v1 simplemente deja de usarse mientras llega el redeploy).
- [ ] Cuando vayamos a mainnet, desplegar **directamente con `payCourse()`**, sin pasar por v1.

---

## Modelo económico de cursos

| Nivel del curso | Precio |
|---|---|
| Principiante | **100 PUMA** |
| Intermedio | **500 PUMA** |
| Avanzado | **1,000 PUMA** |
| Introducción a Blockchain | Gratis (entry point) |

El precio está en `precioPuma` de cada curso en `src/constants/cursos*.ts`. La regla anterior se aplicó programáticamente al asignar precios — para cambiar uno individual, edita el archivo directamente.

### Flujo de pago end-to-end

```
Alumno conecta wallet (Core/MetaMask en Avalanche)
  ↓
Entra al curso, click "Inscribirse" → modal con nombre + email
  ↓
Click "Pagar 500 PUMA"
  ↓
Wallet firma payCourse("blockchain-stack", 500e18)
  ↓
Contrato PUMA quema 500 del alumno + emite CoursePaid
  ↓
Front confirma tx, registra inscripción en Supabase (curso_inscripciones)
  ↓
Alumno entra al contenido del curso
  ↓
Al completar 100% → endpoint /api/courses/auto-certificate
  ↓
Endpoint (con MINTER_ROLE en Badges) mintea NFT soulbound CourseCompletion
```

### ¿Cuánto cobra el equipo?

**Cero**. Los PUMA pagados se queman (van a address(0)). El equipo no recibe nada en tesorería. Esto:
- Reduce supply circulante → mecánica deflacionaria
- No requiere wallet de tesorería custodiada
- El registro de quién pagó qué queda 100% on-chain (eventos `CoursePaid`)

---

## Para producción (mainnet)

Cuando vayamos a desplegar en Avalanche C-Chain mainnet, replicar el proceso de [docs/DEPLOY_AVALANCHE.md](docs/DEPLOY_AVALANCHE.md) con estos cambios:

### 1. Seed phrase nueva, limpia
La wallet de Fuji **no se puede usar** en mainnet — su seed quedó expuesta en logs durante el desarrollo. Generar otra:
```
cast wallet new-mnemonic --words 24
```
Guardar la frase en papel o gestor seguro. Importar como `deployer-criptounam-main` (otro nombre, otro keystore).

### 2. Deploy del PUMAToken v2 directo
Saltarse v1 — desplegar la versión actual del contrato (con `payCourse()`) desde el inicio. El script ya está actualizado.

### 3. Roles cruzados desde el deploy
- `REWARD_MANAGER_ROLE` en PUMA → wallet del endpoint de misiones (si aplica) **y** → Drops contract
- `MINTER_ROLE` en Badges → wallet del endpoint `/api/courses/auto-certificate` **y** → Drops contract

### 4. Multisig recomendado
Para `INITIAL_ADMIN` usar un Safe multisig (no la wallet del deployer). Eso evita que un único compromiso de wallet pueda pausar el contrato o cambiar roles.

### 5. Verificación on-chain
Añadir `--verify --etherscan-api-key $SNOWTRACE_API_KEY` a cada `forge script`. En mainnet la API key sí importa (sin ella hay rate limits agresivos).

### 6. Backend de certificados auto-emitidos
- Vercel: `MINTER_PRIVATE_KEY` = wallet **dedicada** (no la del deployer) con `MINTER_ROLE` en Badges.
- Mantener poco gas (~0.1 AVAX) en esa wallet — solo cubre los mints.

---

## Stack técnico

### Frontend
- **Vite 5** + **React 18** + **TypeScript**
- **wagmi v2** + **viem v2** + **@reown/appkit** para wallet & on-chain
- **@supabase/supabase-js v2** para persistencia
- **react-router-dom** para routing
- **Framer Motion** + **Recharts** + **tsparticles** para visuales

### Smart contracts
- **Solidity 0.8.19** + **OpenZeppelin v4.9** (ERC20, ERC721, AccessControl, Pausable, ReentrancyGuard)
- **Foundry** para build, test, deploy (`forge`, `cast`)

### Deploy
- **Vercel** para frontend + serverless functions (`api/`)
- **Supabase** para DB (Postgres + RLS + Storage)
- **Pinata** para IPFS (metadata de NFTs)
- **Avalanche C-Chain / Fuji** para contratos

---

## Variables de entorno

Ver [.env.example](.env.example) para la lista completa. Resumen rápido:

### Front (`.env` local o Vercel, con prefijo `VITE_`)
- `VITE_CHAIN_ID` — 43113 (Fuji) o 43114 (mainnet)
- `VITE_RPC_URL`, `VITE_EXPLORER_URL`
- `VITE_PUMA_TOKEN_ADDRESS`, `VITE_BADGES_CONTRACT_ADDRESS`, `VITE_DROPS_CONTRACT_ADDRESS`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_WALLET_CONNECT_PROJECT_ID`
- `VITE_BADGES_CLAIM_ENDPOINT` (para auto-mint de certificados)

### Backend (Vercel functions, **sin** prefijo VITE)
- `MINTER_PRIVATE_KEY` — wallet con `MINTER_ROLE` en Badges (solo para `/api/courses/auto-certificate`)
- `AVAX_RPC_URL` — RPC de la red usada
- `PUMA_TOKEN`, `BADGES_CONTRACT`
- `SUPABASE_SERVICE_ROLE_KEY` — para writes en Supabase desde el endpoint
- `BADGES_METADATA_BASE` — ej. `ipfs://CID/`
- `CERT_PUMA_REWARD` — opcional, PUMA extra al completar curso

### Deploy de contratos (`.env.deploy.*` local, gitignored)
- `AVAX_RPC_URL` o `AVAX_FUJI_RPC_URL`
- `DEPLOYER_ADDRESS`, `INITIAL_ADMIN`
- `DEPLOYER_ACCOUNT` — nombre del keystore en `~/.foundry/keystores/`
- `SNOWTRACE_API_KEY` — para verificación

---

## Estructura de carpetas

```
api/                Vercel serverless functions
src/
  pages/            Páginas (Home, Cursos, Recompensas, RegistroCurso, ...)
  components/       Componentes React reutilizables
  components/Puma/  UI del ecosistema PUMA
  components/Cursos/ Pago de cursos, CTAs de certificado
  context/          AppKitProvider (wagmi), WalletContext, ...
  config/           env, supabase, api endpoints
  hooks/            usePumaMissions, usePumaPayment, useCriptoUnamBadges, ...
  services/         progresoCurso.service (inscripciones, progreso, certs)
  constants/        cursos*.ts (data + ABI helpers)
  data/             Datos estáticos (eventos, partners, proyectos)
public/             Assets estáticos
```

Contratos: `../criptounam-contracts/`. Docs: `../docs/`. SQL: `../supabase/`.

---

## Cómo correr local

```bash
npm install
cp .env.example .env.local        # llenar con tus credenciales
npm run dev                       # solo front
npx vercel dev                    # front + serverless (necesario para /api/*)
```

Para test del flow de pago en local, necesitas:
- Wallet Core/MetaMask conectada a Fuji
- PUMA en tu wallet (transfiere desde el deployer o reclama una misión)
- `VITE_PUMA_TOKEN_ADDRESS` en `.env.local` apuntando a **v2** (`0xF5F8...Ee1F`)
- Vercel dev para que `/api/courses/auto-certificate` funcione

## Cómo contribuir al Newsletter (Blog)

¡Aceptamos propuestas de la comunidad para publicar en nuestro Newsletter! Si quieres escribir un artículo, tutorial o nota sobre Web3, puedes enviar un Pull Request (PR) siguiendo estos lineamientos:

### 1. Dónde guardar la información
- **Datos de la nota**: Agrega tu entrada en el archivo `src/data/newsletterData.ts`. Sigue la estructura de las notas existentes (necesitarás un `id` único, `titulo`, `fecha`, `autor`, `contenido`, `imagen`, `tags`, etc.).
- **Imágenes y Media**: Guarda las imágenes de tu nota en la carpeta `public/images/newsletter/`. Nombra los archivos de forma descriptiva y en minúsculas (ej. `mi-articulo-cover.png`). En tu entrada de `newsletterData.ts`, haz referencia a la imagen como `'/images/newsletter/mi-articulo-cover.png'`.

### 2. Cómo escribir la nota
- **Formato**: El campo `contenido` soporta texto plano o HTML básico si necesitas estructurar párrafos. Mantén un tono educativo, objetivo y alineado con los valores de CriptoUNAM.
- **Fuentes y Citas**: Si utilizas información de terceros, incluye una sección de "Fuentes" al final de tu contenido. Usa enlaces directos a las fuentes originales.
- **Etiquetas (Tags)**: Usa 2 o 3 tags relevantes (ej. `DeFi`, `Educación`, `Avalanche`) para categorizar tu nota.

### 3. Proceso de PR
1. Haz un fork del repositorio y crea una rama para tu nota (ej. `feat/newsletter-mi-nota`).
2. Agrega la imagen en `public/images/newsletter/` y el contenido en `src/data/newsletterData.ts`.
3. Haz commit de tus cambios y abre un Pull Request hacia la rama principal.
4. El equipo de CriptoUNAM revisará tu propuesta, te dará feedback si es necesario, y la publicará.

---

## Tareas pendientes

- [ ] Re-otorgar `REWARD_MANAGER_ROLE` al Drops en PUMA v2 (`cast send $PUMA_TOKEN "grantRole(bytes32,address)" $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_CONTRACT --account deployer-criptounam --from $DEPLOYER_ADDRESS`)
- [ ] Transferir PUMA desde el deployer a wallets de prueba para validar `payCourse()` end-to-end
- [ ] Subir metadata real de cursos/badges a IPFS via Pinata
- [ ] Endpoint de pago `api/courses/payment.ts` queda **deprecado** (el front llama directo on-chain) — eliminar si no se necesita
- [ ] Deploy en mainnet (replicar §"Para producción")
