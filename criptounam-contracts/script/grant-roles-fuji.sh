#!/usr/bin/env bash
#
# Cableado post-deploy del set de contratos v2 en Avalanche Fuji (chainId 43113).
#
# Otorga:
#   A) Roles cruzados que necesita el Drops v2 para mintear (sin esto claimDrop revierte).
#   B) Roles OPERATIVOS a la wallet secundaria (NO admin: no puede revocar roles ni cambiar admins).
#
# Requisitos:
#   - foundry (cast) instalado
#   - keystore de la deployer/admin importado:  cast wallet import deployer-criptounam --interactive
#   - export AVAX_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
#
# Uso:
#   export AVAX_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
#   bash script/grant-roles-fuji.sh
#
set -euo pipefail

RPC="${AVAX_FUJI_RPC_URL:?Define AVAX_FUJI_RPC_URL}"
ACCOUNT="${DEPLOYER_ACCOUNT:-deployer-criptounam}"   # keystore de la admin (0x2101...d5fE)

# --- Direcciones v2 en Fuji (43113) ---
PUMA=0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F
BADGES=0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2
DROPS=0x98BfbdBfE5626c391f56B324b01B00f310A70370

# Wallet secundaria con permisos OPERATIVOS
OP_WALLET=0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217

# --- Hashes de roles ---
REWARD_MANAGER_ROLE=$(cast keccak "REWARD_MANAGER_ROLE")
MISSION_MANAGER_ROLE=$(cast keccak "MISSION_MANAGER_ROLE")
MINTER_ROLE=$(cast keccak "MINTER_ROLE")
DROP_MANAGER_ROLE=$(cast keccak "DROP_MANAGER_ROLE")

send() {
  echo ">> $1"
  cast send "$2" "grantRole(bytes32,address)" "$3" "$4" \
    --rpc-url "$RPC" --account "$ACCOUNT"
}

echo "=== A) Cableado del Drops v2 (obligatorio para claimDrop) ==="
send "PUMA.REWARD_MANAGER_ROLE -> Drops"  "$PUMA"   "$REWARD_MANAGER_ROLE" "$DROPS"
send "Badges.MINTER_ROLE       -> Drops"  "$BADGES" "$MINTER_ROLE"         "$DROPS"

echo "=== B) Roles operativos para $OP_WALLET ==="
send "PUMA.REWARD_MANAGER_ROLE  -> opWallet" "$PUMA"   "$REWARD_MANAGER_ROLE"  "$OP_WALLET"
send "PUMA.MISSION_MANAGER_ROLE -> opWallet" "$PUMA"   "$MISSION_MANAGER_ROLE" "$OP_WALLET"
send "Badges.MINTER_ROLE        -> opWallet" "$BADGES" "$MINTER_ROLE"          "$OP_WALLET"
send "Drops.DROP_MANAGER_ROLE   -> opWallet" "$DROPS"  "$DROP_MANAGER_ROLE"    "$OP_WALLET"

echo
echo "=== Verificacion ==="
check() {
  printf "%-40s " "$1"
  cast call "$2" "hasRole(bytes32,address)(bool)" "$3" "$4" --rpc-url "$RPC"
}
check "PUMA.REWARD_MANAGER  Drops"     "$PUMA"   "$REWARD_MANAGER_ROLE"  "$DROPS"
check "Badges.MINTER       Drops"      "$BADGES" "$MINTER_ROLE"          "$DROPS"
check "PUMA.REWARD_MANAGER  opWallet"  "$PUMA"   "$REWARD_MANAGER_ROLE"  "$OP_WALLET"
check "PUMA.MISSION_MANAGER opWallet"  "$PUMA"   "$MISSION_MANAGER_ROLE" "$OP_WALLET"
check "Badges.MINTER       opWallet"   "$BADGES" "$MINTER_ROLE"          "$OP_WALLET"
check "Drops.DROP_MANAGER  opWallet"   "$DROPS"  "$DROP_MANAGER_ROLE"    "$OP_WALLET"

echo
echo "Listo. Si todas las verificaciones dicen 'true', el set v2 esta cableado."
