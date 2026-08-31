# 💰 Guía de Integración del Token PUMA

## 🎯 **¿Qué es PUMA Token?**

PUMA es el token de recompensas de CriptoUNAM. Los usuarios ganan tokens por participar en la comunidad.

---

## 📋 **Estado Actual vs Estado Futuro**

### **AHORA (Sin contrato desplegado)**
- ✅ Sistema de puntos **simulado** en Supabase
- ✅ Los usuarios ven su balance en el perfil
- ✅ Se otorgan "puntos" por acciones
- ⚠️ **NO son tokens reales en blockchain**

### **DESPUÉS (Con contrato desplegado)**
- ✅ Tokens **reales** en blockchain (Ethereum/Polygon)
- ✅ Los usuarios pueden **transferir** tokens
- ✅ Los tokens tienen **valor real**
- ✅ Se pueden **intercambiar** en DEXs

---

## 🔗 **Botones y Acciones Conectadas a PUMA**

### **1. Página de Perfil (`/perfil`)**

#### **Tab "Bonus" (Recompensas)**
📍 **Ubicación**: `/src/pages/Perfil.tsx` → `ProfileBonus.tsx`

**Acciones que otorgan PUMA:**

| Acción | Botón/Evento | Recompensa | Estado |
|--------|-------------|------------|--------|
| Conectar Wallet | Automático al conectar | 100 PUMA | ✅ Implementado |
| Completar Perfil | Guardar datos en perfil | 50 PUMA | ✅ Implementado |
| Dar Like a Newsletter | ❤️ en artículo | 10 PUMA | ✅ Implementado |
| Compartir en Twitter | 🐦 Botón compartir | 25 PUMA | ⚠️ Por implementar |
| Asistir a Evento | Check-in en evento | 200 PUMA | ⚠️ Por implementar |
| Completar Curso | Certificado de curso | 500 PUMA | ⚠️ Por implementar |
| Referir Amigo | Link de referido | 100 PUMA | ⚠️ Por implementar |

**Código actual (simulado)**:
```typescript
// src/components/ProfileBonus.tsx
const ganarRecompensa = async (tipo: string) => {
  // Actualmente guarda en Supabase
  await pumaApi.addTransaction({
    user_id: walletAddress,
    amount: cantidad,
    type: 'earn',
    reason: tipo
  })
}
```

**Código futuro (blockchain)**:
```typescript
// Con contrato desplegado
const ganarRecompensa = async (tipo: string) => {
  // Llamar al smart contract
  const tx = await pumaContract.mintReward(
    walletAddress,
    cantidad,
    tipo
  )
  await tx.wait()
}
```

---

### **2. Newsletter (`/newsletter`)**

#### **Botón de Like ❤️**
📍 **Ubicación**: `/src/pages/NewsletterEntry.tsx`

**Flujo actual**:
1. Usuario da click en ❤️
2. Se guarda en tabla `likes`
3. Se incrementa contador
4. **Se otorgan 10 PUMA** (simulado)

**Flujo futuro (con blockchain)**:
```typescript
const handleLike = async () => {
  // 1. Guardar like en Supabase
  await likesApi.toggle(newsletterId, walletAddress)
  
  // 2. Otorgar tokens reales en blockchain
  if (!yaLeGusto) {
    const tx = await pumaContract.mintReward(
      walletAddress,
      ethers.utils.parseEther('10'), // 10 PUMA
      'like_newsletter'
    )
    await tx.wait()
  }
}
```

---

### **3. Página de Comunidad (`/comunidad`)**

#### **Botón "Registrarme" en Eventos**
📍 **Ubicación**: `/src/pages/Comunidad.tsx`

**Recompensa**: 200 PUMA por asistir

**Flujo futuro**:
```typescript
const registrarseEvento = async (eventoId) => {
  // 1. Registrar asistencia
  await eventosApi.registrar(eventoId, walletAddress)
  
  // 2. Otorgar PUMA al confirmar asistencia (check-in)
  const tx = await pumaContract.mintReward(
    walletAddress,
    ethers.utils.parseEther('200'),
    `evento_${eventoId}`
  )
}
```

---

### **4. Página de Cursos (`/cursos`)**

#### **Botón "Inscribirse"**
📍 **Ubicación**: `/src/pages/Cursos.tsx`

**Recompensa**: 500 PUMA al completar

**Flujo futuro**:
```typescript
const completarCurso = async (cursoId) => {
  // 1. Marcar curso como completado
  await cursosApi.completar(cursoId, walletAddress)
  
  // 2. Emitir certificado NFT (opcional)
  
  // 3. Otorgar PUMA
  const tx = await pumaContract.mintReward(
    walletAddress,
    ethers.utils.parseEther('500'),
    `curso_${cursoId}`
  )
}
```

---

## 🚀 **Cómo Desplegar el Contrato PUMA**

### **Opción 1: Testnet (Recomendado para pruebas)**

#### **1. Instalar Hardhat**
```bash
cd criptounam
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

#### **2. Configurar Hardhat**
```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY] // Tu wallet privada (¡NUNCA la subas a Git!)
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY]
    }
  }
};
```

#### **3. Compilar el contrato**
```bash
# Copiar el contrato a la carpeta de Hardhat
cp contracts/PUMAToken.sol contracts/

# Compilar
npx hardhat compile
```

#### **4. Crear script de despliegue**
```javascript
// scripts/deploy.js
async function main() {
  const PUMAToken = await ethers.getContractFactory("PUMAToken");
  const puma = await PUMAToken.deploy();
  await puma.deployed();
  
  console.log("PUMAToken deployed to:", puma.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

#### **5. Desplegar**
```bash
# Testnet Sepolia (Ethereum)
npx hardhat run scripts/deploy.js --network sepolia

# Testnet Mumbai (Polygon)
npx hardhat run scripts/deploy.js --network polygon_mumbai
```

#### **6. Guardar la dirección del contrato**
```bash
# La consola mostrará algo como:
# PUMAToken deployed to: 0x1234567890abcdef...

# Agregar a .env:
echo "VITE_PUMA_TOKEN_ADDRESS=0x1234567890abcdef..." >> .env
```

---

### **Opción 2: Mainnet (Producción)**

⚠️ **ADVERTENCIA**: Mainnet usa dinero real. Asegúrate de:
- Auditar el contrato
- Probar en testnet primero
- Tener ETH/MATIC para gas fees

```bash
# Ethereum Mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Polygon Mainnet
npx hardhat run scripts/deploy.js --network polygon
```

---

## 🔧 **Configurar el Frontend para usar el Contrato**

### **1. Actualizar variables de entorno**

Agrega en Vercel o `.env`:
```bash
VITE_PUMA_TOKEN_ADDRESS=0xTuContratoDesplegado
VITE_CHAIN_ID=11155111  # 11155111 = Sepolia, 137 = Polygon Mainnet
VITE_RPC_URL=https://sepolia.infura.io/v3/TU_INFURA_ID
```

### **2. El código ya está listo**

El archivo `src/services/blockchain.service.ts` ya tiene toda la lógica:

```typescript
// Ya implementado ✅
export class BlockchainService {
  async mintReward(to: string, amount: string, reason: string) {
    // Conecta con el contrato y manda tokens
  }
  
  async getUserBalance(address: string) {
    // Obtiene balance del usuario
  }
  
  async transferReward(from: string, to: string, amount: string) {
    // Transferir tokens entre usuarios
  }
}
```

### **3. Conectar botones al servicio**

Ejemplo en `ProfileBonus.tsx`:
```typescript
import { BlockchainService } from '../services/blockchain.service'

const blockchain = new BlockchainService()

const ganarRecompensa = async () => {
  if (ENV_CONFIG.PUMA_TOKEN_ADDRESS) {
    // Si hay contrato desplegado, usar blockchain
    await blockchain.mintReward(
      walletAddress,
      '100', // 100 PUMA
      'connect_wallet'
    )
  } else {
    // Si no, usar sistema simulado
    await pumaApi.addTransaction(...)
  }
}
```

---

## 📊 **Tabla de Funciones del Contrato**

| Función | Qué hace | Quién puede llamarla |
|---------|----------|---------------------|
| `mintReward()` | Crear nuevos tokens | Solo admin |
| `burnReward()` | Quemar tokens | Solo admin |
| `transfer()` | Transferir entre usuarios | Cualquier usuario |
| `balanceOf()` | Ver balance | Cualquiera |
| `getUserLevel()` | Ver nivel del usuario | Cualquiera |
| `completeMission()` | Completar misión | Solo admin |
| `addBadge()` | Otorgar badge | Solo admin |

---

## 🎮 **Sistema de Niveles y Badges**

### **Niveles** (Implementado en contrato)

| Nivel | XP Requerido | Título |
|-------|-------------|--------|
| 1 | 0 | Novato |
| 2 | 100 | Aprendiz |
| 3 | 500 | Conocedor |
| 4 | 1000 | Experto |
| 5 | 5000 | Maestro |
| 6 | 10000 | Leyenda |

### **Badges** (Ejemplos)
- 🎓 "First Steps" - Primera conexión
- 📚 "Knowledge Seeker" - 5 artículos leídos
- 🤝 "Community Builder" - 3 eventos asistidos
- 💎 "Diamond Hands" - 1000 PUMA acumulados
- 🚀 "Early Adopter" - Usuario de los primeros 100

---

## 🔐 **Seguridad**

### **En el Smart Contract**:
- ✅ Solo admins pueden mintear tokens
- ✅ Límite de supply (opcional, actualmente ilimitado)
- ✅ Pausable en caso de emergencia
- ✅ Ownable (solo owner puede cambiar roles)

### **En el Frontend**:
- ✅ Verificar que el usuario sea admin antes de mintear
- ✅ Verificar firma de transacciones
- ✅ Validar direcciones antes de transferir

---

## 📈 **Roadmap de PUMA**

### **Fase 1: Sistema Simulado** (ACTUAL) ✅
- Base de datos con puntos
- UI de perfil con recompensas
- Acciones que otorgan puntos

### **Fase 2: Testnet** (PRÓXIMO)
- Desplegar en Sepolia/Mumbai
- Conectar frontend con contrato
- Probar mint/transfer/burn

### **Fase 3: Mainnet** (FUTURO)
- Auditoría del contrato
- Desplegar en Polygon/Ethereum
- Tokens reales y transferibles

### **Fase 4: DeFi** (FUTURO)
- Crear pool de liquidez en Uniswap
- Staking de PUMA
- Farming con APY

---

## 💡 **Respuestas a tus Preguntas**

### **1. ¿Debo desplegar el contrato para que funcione?**

**NO necesariamente**. Ahora mismo funciona con el sistema simulado:
- Los usuarios ven su balance
- Ganan "puntos PUMA"
- Todo se guarda en Supabase

**Pero para tokens REALES**, sí necesitas desplegarlo.

### **2. ¿Qué funciones van conectadas a qué botones?**

| Botón/Acción | Función del Contrato | Archivo Frontend |
|-------------|---------------------|------------------|
| ❤️ Like | `mintReward()` | `NewsletterEntry.tsx` |
| Conectar Wallet | `mintReward()` | `WalletContext.tsx` |
| Asistir Evento | `mintReward()` | `Comunidad.tsx` |
| Completar Curso | `mintReward()` + `addBadge()` | `Cursos.tsx` |
| Transferir PUMA | `transfer()` | `ProfileBonus.tsx` |
| Ver Balance | `balanceOf()` | `ProfileBonus.tsx` |

### **3. ¿Puedo usarlo sin blockchain ahora?**

**SÍ**, el sistema actual funciona sin blockchain:
```typescript
// Si no hay contrato configurado, usa Supabase
if (!ENV_CONFIG.PUMA_TOKEN_ADDRESS) {
  // Guardar en BD
  await pumaApi.addTransaction(...)
} else {
  // Usar blockchain
  await blockchain.mintReward(...)
}
```

---

## 🚀 **Próximos Pasos Recomendados**

1. **AHORA**: Usar sistema simulado (ya funciona)
2. **Esta semana**: Desplegar en testnet para pruebas
3. **Próximo mes**: Auditar y desplegar en mainnet
4. **Futuro**: Agregar más utilidades al token

---

**Commits completados**: 66/110 (60%)

