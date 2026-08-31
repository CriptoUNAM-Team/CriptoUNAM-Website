# PUMAToken Guide - CriptoUNAM

## Objetivo del contrato

`PUMAToken` es un ERC20 orientado a **recompensas educativas** para CriptoUNAM:

- Reconocer asistencia y participación en sesiones.
- Incentivar a embajadores y alumnos activos.
- Premiar misiones académicas con reglas on-chain.
- Llevar trazabilidad de recompensas, niveles e insignias.

No está diseñado como activo especulativo, sino como un token de utilidad dentro del ecosistema educativo.

---

## Resumen técnico

Contrato: `contracts/PUMAToken.sol`  
Estándar base: `ERC20` (OpenZeppelin)  
Extensiones:

- `ERC20Burnable`
- `ERC20Pausable`
- `AccessControl`
- `ReentrancyGuard`

Parámetros relevantes:

- `name`: `PUMA Token`
- `symbol`: `PUMA`
- `decimals`: `18`
- `MAX_SUPPLY`: `1_000_000_000 * 10^18`

---

## Roles y permisos

El contrato usa `AccessControl` con tres roles:

1. `DEFAULT_ADMIN_ROLE`
   - Gobernanza principal.
   - Puede pausar/despausar.
   - Puede ajustar `xpPerTokenWei`.
   - Puede asignar/revocar roles de managers.

2. `REWARD_MANAGER_ROLE`
   - Emite recompensas con `mintReward`.
   - Puede quemar con `burnReward` (solo con allowance del usuario).
   - Actualiza niveles manualmente y otorga insignias.

3. `MISSION_MANAGER_ROLE`
   - Crea misiones con `createMission`.
   - Desactiva misiones con `deactivateMission`.

Recomendación CriptoUNAM:

- Admin en multisig.
- Reward manager para equipo de operaciones/sesiones.
- Mission manager para equipo académico.

---

## Modelo de recompensas

### 1) Recompensa directa por sesión o actividad

Función: `mintReward(address to, uint256 amount, string reason)`

Uso sugerido:

- Asistencia validada en workshop.
- Liderazgo en embajadores.
- Entrega de tarea fuera del flujo de misiones.

La función:

- Verifica `MAX_SUPPLY`.
- Minta al alumno.
- Guarda historial en `_userRewards`.
- Suma `totalRewardsDistributed`.
- Actualiza XP/nivel.

### 2) Misiones autogestionadas

Funciones:

- `createMission(...)`
- `completeMission(missionId)`

Cada wallet puede reclamar una misión **una sola vez**:

- `missionCompletedBy[missionId][user] = true`

La misión no se cierra tras el primer reclamo; se mantiene activa hasta:

- Deadline, o
- `deactivateMission`.

Esto permite que una misma misión educativa sea completada por muchos alumnos.

---

## Niveles, experiencia e insignias

Variables:

- `userExperience[user]`
- `userLevel[user]`
- `_userBadges[user]`
- `xpPerTokenWei`

Lógica:

- `XP = amountWei * xpPerTokenWei`
- Nivel automático aproximado:
  - `level = experience / (1000 * 10^18)`
  - Equivale a ~1 nivel por cada 1000 tokens (si `xpPerTokenWei = 1`).

Funciones de perfil:

- `setUserLevel(...)` (ajuste manual por reward manager)
- `grantBadge(...)`
- `getUserInfo(...)`
- `getUserBadges(...)`
- `getUserRewards(...)`

---

## Seguridad y controles

1. **Supply cap**
   - Ningún flujo de mint puede superar `MAX_SUPPLY`.

2. **Pausable**
   - `whenNotPaused` en flujos críticos:
     - `mintReward`
     - `burnReward`
     - `transferReward`
     - `createMission`
     - `completeMission`

3. **Quema con consentimiento**
   - `burnReward` exige `allowance(from, address(this)) >= amount`.
   - Evita quema arbitraria del saldo de alumnos.

4. **No reentrancy**
   - `nonReentrant` en funciones de estado críticas.

5. **Errores personalizados**
   - Menor gas y mejor trazabilidad (`ZeroAmount`, `MissionExpired`, etc.).

---

## Casos de uso para CriptoUNAM

### Caso A: Taller presencial (asistencia)

1. El staff valida lista de asistentes.
2. Reward manager llama:
   - `mintReward(alumno, 25e18, "Asistencia Taller DeFi - Abril 2026")`
3. Frontend consulta `getUserRewards` y actualiza perfil.

### Caso B: Sesión de embajadores

1. Embajador organiza meetup.
2. Se asigna recompensa especial:
   - `mintReward(embajador, 200e18, "Embajador - Organizacion meetup UNAM")`
3. Opcional:
   - `grantBadge(embajador, "Embajador Activo Q2 2026")`

### Caso C: Misión educativa abierta

1. Mission manager crea misión:
   - `"quiz-defi-modulo-2"`, recompensa `15e18`, deadline en 7 días.
2. Cada alumno que complete criterio on/off-chain llama `completeMission`.
3. Todos los alumnos elegibles pueden reclamar una vez.

### Caso D: Penalización con consentimiento

Si un flujo requiere ajuste/penalización:

1. Alumno hace `approve(tokenAddress, amount)` desde su wallet.
2. Reward manager ejecuta:
   - `burnReward(alumno, amount, "Ajuste por duplicado en carga de puntos")`

---

## Integración con backend/frontend CriptoUNAM

### Datos on-chain recomendados

- `address`
- transacciones de `RewardMinted`, `MissionClaimed`, `BadgeGranted`
- balance actual
- XP/nivel on-chain

### Datos off-chain recomendados

- Evidencia académica (links, rúbricas, repos, asistencia QR).
- Metadatos de sesiones y cohortes.
- Catálogo de insignias y su descripción.

### Patrón sugerido

- Backend valida requisitos académicos.
- Backend/operador ejecuta función on-chain.
- Front consume eventos y actualiza dashboard de progreso.

---

## Ejemplos de llamadas (cast)

> Ajusta `RPC_URL`, `PRIVATE_KEY` y `TOKEN`.

### Mint por sesión

```bash
cast send $TOKEN "mintReward(address,uint256,string)" \
  0xAlumno 25000000000000000000 "Asistencia Sesion Trading 01" \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Crear misión

```bash
cast send $TOKEN "createMission(string,string,uint256,uint256)" \
  "quiz-defi-01" "Quiz DeFi Intro" 15000000000000000000 1770000000 \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Completar misión (alumno)

```bash
cast send $TOKEN "completeMission(string)" "quiz-defi-01" \
  --rpc-url $RPC_URL --private-key $ALUMNO_KEY
```

### Otorgar insignia

```bash
cast send $TOKEN "grantBadge(address,string)" \
  0xAlumno "Top 10 Cohorte DeFi" \
  --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

---

## Flujo de deploy con Foundry

Script: `script/DeployPUMAToken.s.sol`

Variables:

- `PRIVATE_KEY` (obligatoria)
- `INITIAL_ADMIN` (opcional)
- `INITIAL_MINT` (opcional, default `10_000_000e18`)

Comando:

```bash
forge script script/DeployPUMAToken.s.sol:DeployPUMAToken \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## Buenas prácticas previas a producción

1. Usar multisig para `DEFAULT_ADMIN_ROLE`.
2. Definir política formal de emisiones por cohorte/sesión.
3. Añadir tests Foundry para:
   - `MAX_SUPPLY`
   - una sola reclamación por misión por usuario
   - pausas
   - quemas con/sin allowance
4. Revisar monitoreo de eventos (subgraphs o backend listeners).
5. Documentar proceso de rotación de roles en caso de incidentes.

---

## Limitaciones actuales (y mejoras futuras)

- No hay snapshots nativos para votaciones (se puede migrar a `ERC20Votes` si se requiere gobernanza).
- Insignias se almacenan como strings on-chain (costoso en gas para alto volumen).
  - Mejora posible: guardar hash/ID y resolver metadata off-chain.
- No hay límite por período en `mintReward`.
  - Mejora posible: presupuestos por manager/mes o cola de aprobación.

---

## Conclusión

`PUMAToken` ya está estructurado para un modelo real de **aprendizaje + reputación + recompensas** en CriptoUNAM:

- Emisión controlada por roles.
- Misiones multiusuario.
- Registro de XP, niveles e insignias.
- Mecanismos de seguridad para evitar abusos.

Es una buena base para arrancar pilotos con cohortes y embajadores antes de pasar a un esquema de gobernanza más avanzado.
