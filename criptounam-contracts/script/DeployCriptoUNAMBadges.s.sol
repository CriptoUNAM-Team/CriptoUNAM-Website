// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/CriptoUNAMBadges.sol";

/**
 * Variables de entorno:
 *   INITIAL_ADMIN  — opcional, default: el sender que firma. USAR MULTISIG en mainnet.
 *
 * Firmante por CLI: --account <keystore> --sender <address> (recomendado).
 *
 * Dry-run:
 *   forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
 *     --rpc-url $AVAX_FUJI_RPC_URL --sender $DEPLOYER_ADDRESS
 *
 * Fuji testnet (chainId 43113):
 *   forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
 *     --rpc-url $AVAX_FUJI_RPC_URL \
 *     --account deployer-criptounam --sender $DEPLOYER_ADDRESS \
 *     --broadcast --slow
 *
 * Avalanche C-Chain mainnet (chainId 43114) — añade verificación:
 *   forge script script/DeployCriptoUNAMBadges.s.sol:DeployCriptoUNAMBadges \
 *     --rpc-url $AVAX_RPC_URL \
 *     --account deployer-criptounam --sender $DEPLOYER_ADDRESS \
 *     --broadcast --verify --verifier etherscan \
 *     --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan \
 *     --etherscan-api-key $SNOWTRACE_API_KEY --slow
 *
 * Tras desplegar, otorga MINTER_ROLE a la wallet operativa (idealmente multisig) y
 * usa `MintCriptoUNAMBadge.s.sol` para emisiones on-chain.
 */
contract DeployCriptoUNAMBadges is Script {
    function run() external returns (CriptoUNAMBadges badges) {
        vm.startBroadcast();
        address initialAdmin = vm.envOr("INITIAL_ADMIN", msg.sender);
        badges = new CriptoUNAMBadges(initialAdmin);
        vm.stopBroadcast();

        console2.log("CriptoUNAMBadges deployed at:", address(badges));
        console2.log("initialAdmin:", initialAdmin);
    }
}
