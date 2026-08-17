#!/usr/bin/env bash
#
# Otorga a una wallet los DOS roles que necesita `api/courses/auto-certificate`
# para emitir certificados de curso en Fuji (43113):
#
#   Badges.MINTER_ROLE          — acuñar el NFT soulbound del certificado
#   PUMA.REWARD_MANAGER_ROLE    — entregar la recompensa en PUMA (CERT_PUMA_REWARD)
#
# POR QUÉ NO LA DEPLOYER
# ----------------------
# La deployer (0x2101…d5fE) es DEFAULT_ADMIN en PUMA, Badges y Drops: con su
# llave se otorgan y revocan roles, se mintea PUMA sin límite y se pausa el
# token. Poner esa llave en una variable de entorno de Vercel significa que una
# sola fuga —un log, una dependencia curiosa, un prefijo VITE_ mal puesto— entrega
# la economía entera del proyecto.
#
# Una wallet con estos dos roles y nada más solo puede hacer lo que el endpoint
# hace de todos modos, y si se filtra se revoca con un `revokeRole` y a otra cosa.
#
# CÓMO
# ----
#   1. Crear la wallet:            cast wallet new
#      (guarda la private key; es la que va en Vercel como MINTER_PRIVATE_KEY,
#       nunca en el repositorio)
#   2. Fondearla con algo de AVAX de Fuji: https://faucet.avax.network
#   3. export AVAX_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
#      export MINTER_ADDRESS=0x…            # la dirección del paso 1
#      bash script/grant-minter-fuji.sh
#
# Requiere el keystore de la deployer importado en foundry:
#   cast wallet import deployer-criptounam --interactive
set -euo pipefail

RPC="${AVAX_FUJI_RPC_URL:?Define AVAX_FUJI_RPC_URL}"
ACCOUNT="${DEPLOYER_ACCOUNT:-deployer-criptounam}"
MINTER="${MINTER_ADDRESS:?Define MINTER_ADDRESS con la wallet que va a acuñar}"

# --- Direcciones v2 en Fuji (43113) ---
PUMA=0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F
BADGES=0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2

MINTER_ROLE=$(cast keccak "MINTER_ROLE")
REWARD_MANAGER_ROLE=$(cast keccak "REWARD_MANAGER_ROLE")

send() {
  echo ">> $1"
  cast send "$2" "grantRole(bytes32,address)" "$3" "$4" \
    --rpc-url "$RPC" --account "$ACCOUNT"
}

echo "=== Roles de emisión de certificados para $MINTER ==="
send "Badges.MINTER_ROLE       -> minter" "$BADGES" "$MINTER_ROLE"        "$MINTER"
send "PUMA.REWARD_MANAGER_ROLE -> minter" "$PUMA"   "$REWARD_MANAGER_ROLE" "$MINTER"

echo
echo "=== Verificación (ambas deben decir true) ==="
printf "%-34s " "Badges.MINTER"
cast call "$BADGES" "hasRole(bytes32,address)(bool)" "$MINTER_ROLE" "$MINTER" --rpc-url "$RPC"
printf "%-34s " "PUMA.REWARD_MANAGER"
cast call "$PUMA" "hasRole(bytes32,address)(bool)" "$REWARD_MANAGER_ROLE" "$MINTER" --rpc-url "$RPC"

echo
echo "Listo. Ahora en Vercel (Production y Preview, sin prefijo VITE_):"
echo "  MINTER_PRIVATE_KEY = la llave de $MINTER"
echo "  AVAX_RPC_URL       = $RPC"
echo "  BADGES_CONTRACT    = $BADGES"
echo "  PUMA_TOKEN         = $PUMA"
