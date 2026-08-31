// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/CriptoUNAMBadges.sol";

/**
 * Minteo on-chain con la wallet que tenga MINTER_ROLE (validación directa en cadena).
 *
 * Variables de entorno:
 *   BADGES_CONTRACT — dirección desplegada de CriptoUNAMBadges
 *   MINT_TO         — destinatario del NFT
 *   BADGE_KIND      — 0 CourseCompletion, 1 EventAttendance, 2 Ambassador, 3 Certification
 *   BADGE_REF       — referencia única (ej. curso-xyz-2026 o evento-luma-id)
 *   TOKEN_URI       — metadata (ej. ipfs://... o https://...)
 *
 * Firmante por CLI: --account <keystore> --sender <address>.
 *
 * Avalanche Fuji testnet (ejemplo):
 *   export BADGES_CONTRACT=0x...
 *   export MINT_TO=0x...
 *   export BADGE_KIND=1
 *   export BADGE_REF="meetup-2026-05"
 *   export TOKEN_URI="ipfs://Qm..."
 *   forge script script/MintCriptoUNAMBadge.s.sol:MintCriptoUNAMBadge \
 *     --rpc-url $AVAX_FUJI_RPC_URL \
 *     --account deployer-criptounam --sender $DEPLOYER_ADDRESS \
 *     --broadcast
 *
 * Avalanche C-Chain mainnet (chainId 43114): mismo comando con AVAX_RPC_URL.
 */
contract MintCriptoUNAMBadge is Script {
    function run() external returns (uint256 tokenId) {
        address badgesAddr = vm.envAddress("BADGES_CONTRACT");
        address to = vm.envAddress("MINT_TO");
        uint256 kindRaw = vm.envUint("BADGE_KIND");
        string memory ref = vm.envString("BADGE_REF");
        string memory uri = vm.envString("TOKEN_URI");

        require(kindRaw <= uint256(type(uint8).max), "BADGE_KIND out of range");
        CriptoUNAMBadges.BadgeKind kind = CriptoUNAMBadges.BadgeKind(uint8(kindRaw));

        vm.startBroadcast();
        tokenId = CriptoUNAMBadges(badgesAddr).mint(to, kind, ref, uri);
        vm.stopBroadcast();

        console2.log("Minted tokenId:", tokenId);
        console2.log("to:", to);
        console2.log("kind:", kindRaw);
    }
}
