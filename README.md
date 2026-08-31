# CriptoUNAM

Plataforma educativa Web3: [criptounam.xyz](https://criptounam.xyz/)

## Estructura del repo

| Carpeta | Qué es |
|---|---|
| [`criptounam/`](criptounam/) | App web (Vite + React + TypeScript) y funciones de Vercel (`api/`) |
| [`criptounam-contracts/`](criptounam-contracts/) | Contratos Solidity (Foundry): PUMA, badges, drops |
| [`docs/`](docs/) | Guías de deploy, admin, PUMA, newsletter, SQL |
| [`supabase/`](supabase/) | Esquema y políticas RLS de la base de datos |
| [`scripts/`](scripts/) | Utilidades (imágenes, Git LFS, one-offs) |
| [`pinata-backend/`](pinata-backend/) | API Express antigua (Pinata). El sitio actual usa Vercel + Supabase |

Vercel despliega **`criptounam/`** (no muevas esa carpeta sin actualizar el proyecto en Vercel).

## Arranque rápido (web)

```bash
cd criptounam
cp .env.example .env.local   # rellena credenciales
npm install
npm run dev
```

## Contratos

```bash
cd criptounam-contracts
forge install                # la primera vez (OpenZeppelin + forge-std)
forge build
forge test
```

Playbook de Avalanche: [docs/DEPLOY_AVALANCHE.md](docs/DEPLOY_AVALANCHE.md).

## Documentación

Índice en [docs/README.md](docs/README.md). Overview del producto: [docs/README_PROYECTO.md](docs/README_PROYECTO.md).
