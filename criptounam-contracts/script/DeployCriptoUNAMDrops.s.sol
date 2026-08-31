// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/CriptoUNAMDrops.sol";

/**
 * Deploy de CriptoUNAMDrops (coordinador PUMA + Badges con código compartido).
 *
 * Variables de entorno:
 *   INITIAL_ADMIN      — opcional, default: el sender que firma. USAR MULTISIG en mainnet.
 *   PUMA_TOKEN         — dirección de PUMAToken ya desplegado
 *   BADGES_CONTRACT    — dirección de CriptoUNAMBadges ya desplegado
 *
 * Firmante por CLI: --account <keystore> --sender <address> (recomendado).
 *
 * Dry-run:
 *   forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops --rpc-url $AVAX_RPC_URL
 *
 * Avalanche C-Chain (chainId 43114):
 *   forge script script/DeployCriptoUNAMDrops.s.sol:DeployCriptoUNAMDrops \
 *     --rpc-url $AVAX_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     --verifier etherscan \
 *     --verifier-url https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan \
 *     --etherscan-api-key $SNOWTRACE_API_KEY \
 *     --slow
 *
 * Tras el deploy hay que otorgar roles cruzados (NO los hace este script para no
 * forzar que el deployer sea el admin de PUMA/Badges):
 *   cast send $PUMA_TOKEN "grantRole(bytes32,address)" \
 *     $(cast keccak "REWARD_MANAGER_ROLE") $DROPS_ADDRESS \
 *     --rpc-url $AVAX_RPC_URL --private-key $ADMIN_KEY
 *
 *   cast send $BADGES_CONTRACT "grantRole(bytes32,address)" \
 *     $(cast keccak "MINTER_ROLE") $DROPS_ADDRESS \
 *     --rpc-url $AVAX_RPC_URL --private-key $ADMIN_KEY
 *
 * Sin esos dos roles, claimDrop() revertirá al intentar mintear.
 */
contract DeployCriptoUNAMDrops is Script {
    function run() external returns (CriptoUNAMDrops drops) {
        address pumaToken = vm.envAddress("PUMA_TOKEN");
        address badgesContract = vm.envAddress("BADGES_CONTRACT");

        require(pumaToken != address(0), "PUMA_TOKEN required");
        require(badgesContract != address(0), "BADGES_CONTRACT required");

        vm.startBroadcast();
        address initialAdmin = vm.envOr("INITIAL_ADMIN", msg.sender);
        drops = new CriptoUNAMDrops(initialAdmin, pumaToken, badgesContract);
        vm.stopBroadcast();

        console2.log("CriptoUNAMDrops deployed at:", address(drops));
        console2.log("initialAdmin:", initialAdmin);
        console2.log("puma:", pumaToken);
        console2.log("badges:", badgesContract);
        console2.log("");
        console2.log("Next: grant REWARD_MANAGER_ROLE on PUMA and MINTER_ROLE on Badges to Drops:");
        console2.log("  cast send <PUMA>   grantRole(bytes32,address) <REWARD_MANAGER_ROLE> <DROPS>");
        console2.log("  cast send <BADGES> grantRole(bytes32,address) <MINTER_ROLE>         <DROPS>");
    }
}
