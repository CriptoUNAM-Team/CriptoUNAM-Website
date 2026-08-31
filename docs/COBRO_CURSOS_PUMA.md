# Cobro de cursos en $PUMA (Entregable 3A)

## Visión general

Los cursos de CriptoUNAM pueden tener un precio en `$PUMA`. La inscripción usa un patrón
**pull-payment**: el alumno autoriza al contrato PUMA y el backend con `REWARD_MANAGER_ROLE`
ejecuta `burnReward()` para registrar el pago on-chain como quema.

No hay intermediario "tesorería": el pago se quema, reduciendo el suministro circulante y dejando
trazabilidad en el evento `RewardBurned`.

---

## Cómo marcar un curso como de pago

En `src/constants/cursosData.ts`, añade `precioPuma` al curso:

```ts
{
  id: '2',
  titulo: 'Smart Contracts con Solidity',
  precio: 0,           // legacy
  precioPuma: 150,     // ← este curso cuesta 150 PUMA
  …
}
```

Si `precioPuma` es `undefined` o `0`, el curso sigue siendo gratuito y usa el flujo de firma.

---

## Flujo de pago para el alumno

1. **Conectar wallet** en `/registro-curso/:id`.
2. **Aprobar** (paso 1): firma `approve(pumaToken, precio)`.
   - El spender es el propio token PUMA (porque `burnReward` usa `allowance(from, address(this))`).
3. **Pagar** (paso 2): el frontend hace `POST` al endpoint `VITE_COURSE_PAYMENT_ENDPOINT` con:
   ```json
   {
     "wallet": "0xAlumno",
     "cursoId": "2",
     "amount": 150,
     "reason": "Pago curso 2"
   }
   ```
4. **Backend** (que tiene `REWARD_MANAGER_ROLE`):
   - Verifica `allowance(wallet, pumaToken) >= amount`.
   - Ejecuta `burnReward(wallet, parseEther(amount), reason)`.
   - Responde `{ txHash, status: "ok" }`.
5. **Frontend** muestra confirmación con link al explorer y llama automáticamente a
   `handleInscribirse()` (firma off-chain + Supabase + Telegram).

Si `VITE_COURSE_PAYMENT_ENDPOINT` está vacío, el componente muestra instrucciones para que el
equipo registre el pago manualmente (ejecutando `burnReward` desde `/admin/puma`).

---

## Implementación backend (a desarrollar)

Endpoint sugerido: `api/courses/pay.ts` (Vercel serverless o Pinata backend).

Pseudocódigo:

```ts
export default async function handler(req, res) {
  const { wallet, cursoId, amount, reason } = req.body
  // 1. validaciones (cursoId existe, amount > 0, wallet checksum)
  // 2. lee precio esperado de cursosData[cursoId].precioPuma
  // 3. verifica allowance on-chain
  const allowance = await pumaToken.read.allowance([wallet, pumaTokenAddress])
  if (allowance < parseEther(amount)) return res.status(400).json({ error: 'allowance insuficiente' })
  // 4. ejecuta burnReward con la wallet REWARD_MANAGER
  const tx = await rewardManagerClient.writeContract({
    address: pumaTokenAddress,
    abi: pumaTokenAbi,
    functionName: 'burnReward',
    args: [wallet, parseEther(amount), reason],
  })
  // 5. responde tx hash
  res.json({ txHash: tx })
}
```

**Variables de entorno del backend (NUNCA en el front):**
- `REWARD_MANAGER_PRIVATE_KEY`
- `RPC_URL`
- `PUMA_TOKEN_ADDRESS`

---

## Casos especiales

- **Saldo insuficiente:** el componente lo detecta y muestra cuánto le falta.
- **Allowance ya autorizada:** si el alumno ya autorizó suficiente PUMA, se salta el paso 1.
- **Doble pago:** el backend debe revisar Supabase antes de quemar (no quemar si ya está inscrito).
- **Reembolso:** no hay flujo automático. Si se necesita, `mintReward(alumno, monto, "Reembolso curso X")` desde admin.

---

## Pruebas en Sepolia

1. Deploy `PUMAToken` y un curso con `precioPuma: 10`.
2. `mintReward(alumno, 50e18, "Saldo inicial test")` desde admin.
3. Alumno entra a `/registro-curso/<id>`, ejecuta los dos pasos.
4. Verifica en explorer:
   - `Approval(alumno, pumaToken, 10e18)` en el step 1.
   - `RewardBurned(alumno, 10e18, "Pago curso <id>")` en el step 2.
