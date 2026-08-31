# Contratos CriptoUNAM (Foundry)

Solidity 0.8.19 + OpenZeppelin. Red: **Avalanche** (Fuji `43113` / C-Chain `43114`).

| Contrato | Rol |
|---|---|
| `contracts/PUMAToken.sol` | ERC-20 de recompensas y pago de cursos |
| `contracts/CriptoUNAMBadges.sol` | ERC-721 (certificados + POAPs) |
| `contracts/CriptoUNAMDrops.sol` | Reclamo con código → mint PUMA (+ badge) |

`archive/` guarda contratos viejos que **no** se compilan ni despliegan.

## Setup

```bash
cd criptounam-contracts
forge install
forge build
forge test
```

Deploy: [docs/DEPLOY_AVALANCHE.md](../docs/DEPLOY_AVALANCHE.md). Scripts en `script/`.

Direcciones desplegadas (Fuji y notas de v1/v2): [criptounam/README.md](../criptounam/README.md).
