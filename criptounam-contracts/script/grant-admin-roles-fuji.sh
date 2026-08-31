#!/usr/bin/env bash
#
# Otorga a una wallet los roles que necesita para firmar desde el panel de admin.
# Las firma el deployer (0x2101bB…d5fE), que es DEFAULT_ADMIN en los tres
# contratos de Fuji.
#
#   ./script/grant-admin-roles-fuji.sh 0xLaWalletDelEquipo
#
# Sólo hace falta si quieres operar el panel con una wallet distinta al deployer.
# Pide la contraseña del keystore `deployer-criptounam` una vez por transacción.
# Es idempotente: volver a otorgar un rol que ya se tiene se omite.
#
set -euo pipefail

RPC="https://api.avax-test.network/ext/bc/C/rpc"
ACCOUNT="deployer-criptounam"

GRANTEE="${1:-}"
if [ -z "$GRANTEE" ]; then
  echo "Uso: $0 <direccion-a-autorizar>" >&2
  exit 1
fi

PUMA="0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F"
BADGES="0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2"
DROPS="0x98BfbdBfE5626c391f56B324b01B00f310A70370"

DROP_MANAGER_ROLE="$(cast keccak 'DROP_MANAGER_ROLE')"
MISSION_MANAGER_ROLE="$(cast keccak 'MISSION_MANAGER_ROLE')"
REWARD_MANAGER_ROLE="$(cast keccak 'REWARD_MANAGER_ROLE')"
MINTER_ROLE="$(cast keccak 'MINTER_ROLE')"

grant() {
  local contract="$1" role="$2" label="$3"
  if [ "$(cast call "$contract" 'hasRole(bytes32,address)(bool)' "$role" "$GRANTEE" --rpc-url "$RPC")" = "true" ]; then
    echo "✓ $label — ya lo tiene, se omite"
    return
  fi
  echo "→ Otorgando $label…"
  cast send "$contract" 'grantRole(bytes32,address)' "$role" "$GRANTEE" \
    --rpc-url "$RPC" --account "$ACCOUNT" >/dev/null
  echo "✓ $label — listo"
}

echo "Otorgando roles a $GRANTEE en Avalanche Fuji"
echo

grant "$DROPS"  "$DROP_MANAGER_ROLE"    "Drops · DROP_MANAGER_ROLE (crear/cerrar drops)"
grant "$PUMA"   "$MISSION_MANAGER_ROLE" "PUMA · MISSION_MANAGER_ROLE (crear misiones)"
grant "$PUMA"   "$REWARD_MANAGER_ROLE"  "PUMA · REWARD_MANAGER_ROLE (mint de recompensas)"
grant "$BADGES" "$MINTER_ROLE"          "Badges · MINTER_ROLE (mintear POAPs)"

echo
echo "Hecho. Recarga el panel de admin y vuelve a intentar crear el drop."
