// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/PUMAToken.sol";

/**
 * Variables de entorno:
 *   INITIAL_ADMIN  — opcional, default: el sender que firma. USAR MULTISIG en mainnet.
 *   INITIAL_MINT   — opcional, default: 10_000_000e18 (wei). No superar MAX_SUPPLY (1_000_000_000e18).
 *
 * El firmante se pasa por CLI con --account <keystore> --sender <address>
 * (recomendado) o con --private-key. NO se lee PRIVATE_KEY del env para no
 * exigir clave plana en disco.
 *
 * Dry-run (no firma, simula contra el RPC):
 *   forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
 *     --rpc-url $AVAX_FUJI_RPC_URL --sender $DEPLOYER_ADDRESS
 *
 * Fuji testnet (chainId 43113):
 *   forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
 *     --rpc-url $AVAX_FUJI_RPC_URL \
 *     --account deployer-criptounam --sender $DEPLOYER_ADDRESS \
 *     --broadcast --slow
 *
 * Avalanche C-Chain mainnet (chainId 43114) — añade verificación:
 *   forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
 *     --rpc-url $AVAX_RPC_URL \
 *     --account deployer-criptounam --sender $DEPLOYER_ADDRESS \
 *     --broadcast \
 *     --verify --verifier etherscan \
 *     --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan \
 *     --etherscan-api-key $SNOWTRACE_API_KEY \
 *     --slow
 *
 * SIEMPRE ejecuta el dry-run primero y revisa: gas total, nonce, address resultante.
 */
contract DeployPUMAToken is Script {
    function run() external returns (PUMAToken token) {
        uint256 initialMint = vm.envOr("INITIAL_MINT", uint256(10_000_000 * 1e18));

        vm.startBroadcast();
        address initialAdmin = vm.envOr("INITIAL_ADMIN", msg.sender);
        token = new PUMAToken(initialAdmin, initialMint);
        vm.stopBroadcast();

        console2.log("PUMAToken deployed at:", address(token));
        console2.log("initialAdmin:", initialAdmin);
        console2.log("initialMint:", initialMint);
    }
}
