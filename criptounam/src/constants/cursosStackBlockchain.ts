import type { Curso } from './cursosData'
import { IMAGES } from './images.js'

/**
 * Tanda 1 · Stack Blockchain
 * 6 cursos: Solana, Arbitrum, Avalanche, Stellar/Soroban, Sui, Ethereum L2.
 * Cada curso tiene 3 lecciones con guía didáctica + cuestionario.
 * Los videos son placeholders (reemplazar por contenido oficial CriptoUNAM).
 */

// Placeholder de video (reemplazar por video oficial de cada lección)
const VIDEO_PLACEHOLDER = 'https://www.youtube.com/embed/SSo_EIwHSd4'

/* ============================================================
   CURSO · Solana con Rust + Anchor
   ============================================================ */
const cursoSolana: Curso = {
  id: 'solana-rust-anchor',
  titulo: 'Programación en Solana (Rust + Anchor)',
  nivel: 'Avanzado',
  duracion: '1.5 horas',
  imagen: IMAGES.CURSOS.SOLANA,
  descripcion:
    'Aprende el modelo de cuentas de Solana, escribe tus primeros programas con el framework Anchor y despliega en devnet con un cliente web.',
  precio: 0,
  precioPuma: 5000,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Solana', 'Desarrollo', 'Rust', 'Smart Contracts'],
  requisitos:
    'Familiaridad con Rust o disposición de aprenderlo. Conocimientos básicos de blockchain y línea de comandos.',
  lecciones: [
    {
      id: 1,
      titulo: 'Arquitectura de Solana: cuentas, programas y PDAs',
      descripcion: 'Entiende cómo Solana separa código y estado y por qué eso cambia tu forma de pensar.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Arquitectura de Solana

A diferencia de Ethereum, donde un **contrato** guarda su propio estado, en **Solana** el código y los datos viven en **cuentas separadas**:

- **Programas (programs)**: son ejecutables inmutables. Contienen la lógica.
- **Cuentas de datos (accounts)**: cualquier dato (balances, configuración) vive en una cuenta. Los programas leen y escriben en ellas.
- **PDAs (Program Derived Addresses)**: cuentas derivadas determinísticamente desde un programa + seeds. Permiten a un programa "ser dueño" de cuentas sin manejar claves privadas.

### Lamports y rent

La unidad mínima de SOL es el **lamport** (1 SOL = 1e9 lamports). Toda cuenta paga **rent** proporcional a su tamaño; si depositas suficiente SOL para estar **rent-exempt**, no se cobra.

### ¿Por qué importa?

Esta separación habilita **paralelismo**: si dos transacciones tocan cuentas distintas, pueden ejecutarse al mismo tiempo. Es la base del alto throughput de Solana.`,
      cuestionario: [
        {
          pregunta: '¿Dónde vive el estado en Solana?',
          opciones: [
            'Dentro del programa, como en Ethereum',
            'En cuentas separadas que los programas leen y escriben',
            'En la cadena pero sin estructura definida',
            'Solo en memoria del validador',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué es una PDA?',
          opciones: [
            'Una wallet pública del usuario',
            'Una dirección derivada de un programa + seeds, sin clave privada',
            'Un protocolo de DeFi en Solana',
            'Una herramienta de testing',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué significa que una cuenta sea "rent-exempt"?',
          opciones: [
            'Que no necesita SOL para existir',
            'Que tiene suficiente SOL depositado para no pagar renta',
            'Que la cierra el validador',
            'Que es solo lectura',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la unidad mínima de SOL?',
          opciones: ['gwei', 'lamport', 'satoshi', 'wei'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué habilita la separación entre programas y cuentas en Solana?',
          opciones: [
            'Mining más eficiente',
            'Ejecución paralela cuando dos tx no comparten cuentas',
            'Smart contracts más baratos pero secuenciales',
            'Anonimato total del usuario',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Tu primer programa con Anchor',
      descripcion: 'Anchor reduce drásticamente el boilerplate para escribir programas en Solana.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Anchor

**Anchor** es un framework Rust para Solana que añade:

- Macros (\`#[program]\`, \`#[account]\`) que generan boilerplate
- Validación automática de cuentas pasadas a una instrucción
- Un IDL (Interface Definition Language) que tu cliente JS puede usar para llamar al programa con tipos

### Estructura mínima

\`\`\`rust
use anchor_lang::prelude::*;

#[program]
pub mod counter {
    use super::*;
    pub fn init(ctx: Context<Init>) -> Result<()> {
        ctx.accounts.counter.count = 0;
        Ok(())
    }
    pub fn increment(ctx: Context<Inc>) -> Result<()> {
        ctx.accounts.counter.count += 1;
        Ok(())
    }
}

#[account]
pub struct Counter { pub count: u64 }
\`\`\`

Cada instrucción declara su \`Context\` con las cuentas que necesita; Anchor las valida antes de ejecutar tu código.`,
      cuestionario: [
        {
          pregunta: '¿Qué problema resuelve Anchor?',
          opciones: [
            'Permite usar Solidity en Solana',
            'Reduce boilerplate y valida cuentas automáticamente',
            'Reemplaza al runtime de Solana',
            'Hace mining más eficiente',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Para qué sirve el IDL que genera Anchor?',
          opciones: [
            'Para compilar Rust más rápido',
            'Para que clientes JS/TS llamen al programa con tipos',
            'Para firmar transacciones',
            'Es solo documentación',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué declara el atributo `#[account]`?',
          opciones: [
            'Una estructura que se guardará en una cuenta',
            'Un endpoint HTTP',
            'Un test',
            'La wallet del programa',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué atributo macro marca el módulo principal de un programa Anchor?',
          opciones: ['#[derive(Program)]', '#[program]', '#[main]', '#[anchor]'],
          correcta: 1,
        },
        {
          pregunta: 'En Anchor, ¿qué representa el `Context<...>` de una instrucción?',
          opciones: [
            'El logger del programa',
            'La lista de cuentas que la instrucción necesita; Anchor las valida antes',
            'El historial de versiones',
            'Solo el firmante',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Desplegar en devnet y consumir desde el front',
      descripcion: 'Build → deploy → llamar desde un cliente web3.js / Anchor.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Devnet + cliente

Flujo típico para probar tu programa:

1. \`solana config set --url devnet\` para apuntar al cluster de pruebas.
2. \`solana airdrop 2\` te da SOL ficticio para pagar fees.
3. \`anchor build\` compila el programa.
4. \`anchor deploy\` lo sube; te devuelve el **Program ID**.
5. \`anchor idl init\` publica el IDL on-chain (opcional).

### Cliente JS

\`\`\`ts
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import idl from './counter.json'

const provider = AnchorProvider.env()
const program = new Program(idl, provider)
await program.methods.increment().rpc()
\`\`\`

Para mainnet repites el proceso con \`--url mainnet-beta\` y SOL real. Considera que cada deploy gasta SOL en función del tamaño del binario.`,
      cuestionario: [
        {
          pregunta: '¿Qué cluster usas para probar sin gastar SOL real?',
          opciones: ['mainnet-beta', 'devnet', 'localnet (no existe)', 'testnet-prod'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué comando de Anchor sube el programa al cluster configurado?',
          opciones: ['anchor build', 'anchor deploy', 'anchor publish', 'anchor send'],
          correcta: 1,
        },
        {
          pregunta: '¿Para qué se publica el IDL on-chain?',
          opciones: [
            'Para reducir el costo del programa',
            'Para que cualquier cliente pueda recuperarlo y construir instrucciones',
            'Es obligatorio',
            'Para firmar transacciones',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cómo apuntas la CLI de Solana al cluster devnet?',
          opciones: [
            'solana set-network devnet',
            'solana config set --url devnet',
            'solana --devnet',
            'export SOLANA_NETWORK=devnet',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué comando te da SOL ficticio en devnet para pagar fees?',
          opciones: [
            'solana mint',
            'solana airdrop 2',
            'solana faucet',
            'solana fund',
          ],
          correcta: 1,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: 'Solana separa código y estado. ¿Cómo se llaman las "piezas ejecutables"?',
      opciones: ['Contratos', 'Programas', 'Módulos', 'Cuentas'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué hace única a una PDA frente a una cuenta común?',
      opciones: [
        'Es más rápida',
        'No tiene clave privada; se deriva desde un programa + seeds',
        'No paga renta',
        'Solo la puede leer el dueño',
      ],
      correcta: 1,
    },
    {
      pregunta: '1 SOL equivale a:',
      opciones: ['10^6 lamports', '10^9 lamports', '10^12 lamports', '10^18 lamports'],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es la razón principal del alto throughput de Solana?',
      opciones: [
        'Mining intensivo',
        'Ejecución paralela: tx que no comparten cuentas corren simultáneo',
        'No tiene consenso',
        'Validadores con CPUs especiales',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué genera Anchor además del binario del programa?',
      opciones: [
        'Un certificado SSL',
        'Un IDL que permite a clientes invocar el programa con tipos',
        'Un test runner',
        'Un wallet',
      ],
      correcta: 1,
    },
    {
      pregunta: 'En un programa Anchor, ¿quién valida que las cuentas pasadas son las correctas?',
      opciones: [
        'El propio programador a mano',
        'Anchor mediante macros y el Context<...>',
        'Solana runtime',
        'El cliente JS',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué cluster usarías para producción con SOL real?',
      opciones: ['devnet', 'testnet', 'mainnet-beta', 'localnet'],
      correcta: 2,
    },
    {
      pregunta: '¿Cómo subes el binario al cluster con Anchor?',
      opciones: ['anchor publish', 'anchor deploy', 'cargo run', 'solana upload'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué sucede si una cuenta no es rent-exempt y se queda sin saldo?',
      opciones: [
        'Pasa a solo lectura',
        'El runtime puede cerrarla y se pierde su estado',
        'Se replica en otra cadena',
        'Nada, dura para siempre',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué librería JS oficial se usa para hablar con un programa Anchor desde un front?',
      opciones: [
        'ethers.js',
        '@coral-xyz/anchor + @solana/web3.js',
        'viem',
        'wagmi',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Arbitrum: desarrollo en L2
   ============================================================ */
const cursoArbitrum: Curso = {
  id: 'arbitrum-l2-dev',
  titulo: 'Desarrollo en Arbitrum (Layer 2)',
  nivel: 'Intermedio',
  duracion: '45 min',
  imagen: IMAGES.CURSOS.ARBITRUM,
  descripcion:
    'Aprende qué son los optimistic rollups, despliega tu contrato Solidity en Arbitrum One y entiende bridging, gas y herramientas L2.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Arbitrum', 'Ethereum', 'L2', 'Desarrollo', 'Smart Contracts'],
  requisitos: 'Conocer Solidity básico, MetaMask y haber desplegado al menos un contrato en testnet.',
  lecciones: [
    {
      id: 1,
      titulo: 'Optimistic rollups: cómo funciona Arbitrum',
      descripcion: 'La idea de "ejecutar fuera, asentar en Ethereum" explicada paso a paso.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. ¿Qué es un optimistic rollup?

Ethereum L1 es seguro pero **caro** y **lento**. Los **rollups** mueven la ejecución fuera de L1 y publican un **resumen** + datos en Ethereum. Así heredan la seguridad de L1 sin pagar su precio completo.

### "Optimistic"

Arbitrum **asume** que las transacciones son válidas por defecto. Cualquiera puede impugnar (challenge) durante un periodo de **~7 días**; si nadie lo hace, el batch queda firme.

- ✅ Compatible con la EVM (mismo Solidity, mismas herramientas)
- ✅ Gas barato (10×–50× menos que L1)
- ⚠️ Retiros tardan ~7 días (a menos que uses un puente con liquidez)

### Arbitrum One vs Nova vs Sepolia

- **Arbitrum One**: red principal, rollup sobre Ethereum.
- **Arbitrum Nova**: AnyTrust (más barato, menos seguro), pensada para gaming/social.
- **Arbitrum Sepolia**: testnet de Arbitrum, ancla a Sepolia.`,
      cuestionario: [
        {
          pregunta: '¿Qué significa "optimistic" en Arbitrum?',
          opciones: [
            'Que las tx siempre son válidas y no se pueden impugnar',
            'Que las tx se asumen válidas y hay un periodo para impugnarlas',
            'Que el contrato siempre devuelve true',
            'Que paga el usuario optimista',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuánto dura el periodo de impugnación estándar en Arbitrum One?',
          opciones: ['1 hora', '7 días', '24 horas', '30 días'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la principal diferencia entre Arbitrum One y Arbitrum Nova?',
          opciones: [
            'Nova es testnet',
            'Nova usa AnyTrust: más barato, modelo de confianza distinto',
            'One es zk rollup, Nova optimista',
            'Son la misma red',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué se dice que Arbitrum "hereda la seguridad de Ethereum"?',
          opciones: [
            'Porque corre en mainnet directamente',
            'Porque publica datos suficientes en L1 para reconstruir/impugnar el estado',
            'Porque usa la misma EVM',
            'Por marketing',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la testnet pública de Arbitrum ancla a Sepolia?',
          opciones: ['Arbitrum Goerli', 'Arbitrum Sepolia', 'Arbitrum Mumbai', 'Arbitrum Fuji'],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Desplegar y verificar tu contrato en Arbitrum',
      descripcion: 'Foundry/Hardhat → Arbitrum One. Verificación en Arbiscan.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Deploy en Arbitrum

El flujo es **idéntico** al de Ethereum: cambias la URL del RPC.

### Foundry

\`\`\`bash
forge create src/Counter.sol:Counter \\
  --rpc-url https://arb1.arbitrum.io/rpc \\
  --private-key $PRIVATE_KEY \\
  --etherscan-api-key $ARBISCAN_KEY \\
  --verify
\`\`\`

### Hardhat

En \`hardhat.config.ts\`:

\`\`\`ts
networks: {
  arbitrum: { url: 'https://arb1.arbitrum.io/rpc', accounts: [PK] }
}
\`\`\`

Luego \`npx hardhat run scripts/deploy.ts --network arbitrum\`.

### Verificación

Usa **Arbiscan** (mismo flujo que Etherscan). Si verificas con Foundry/Hardhat, automatizado: pasa el API key.

### Costos típicos

Un deploy ronda **$0.05–$0.50 USD** (vs $20–$100 USD en mainnet). Mucha más libertad para iterar.`,
      cuestionario: [
        {
          pregunta: '¿Hay que cambiar el código Solidity para Arbitrum?',
          opciones: [
            'Sí, hay que reescribirlo en Rust',
            'No, Arbitrum es compatible con la EVM',
            'Sí, hay que usar Vyper',
            'Solo si el contrato usa eventos',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Dónde verificas un contrato en Arbitrum?',
          opciones: ['Etherscan', 'Arbiscan', 'BscScan', 'Polygonscan'],
          correcta: 1,
        },
        {
          pregunta: 'Aproximadamente, ¿cuánto barato es deployar en Arbitrum vs Ethereum L1?',
          opciones: ['Igual', '10×–50× más barato', '2× más caro', '100× más caro'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué URL típica corresponde al RPC público de Arbitrum One?',
          opciones: [
            'https://mainnet.infura.io/v3/...',
            'https://arb1.arbitrum.io/rpc',
            'https://rpc.arbitrum.com',
            'https://api.arbitrum.org/rpc',
          ],
          correcta: 1,
        },
        {
          pregunta: 'Con Foundry, ¿qué bandera dispara la verificación automática al deployar?',
          opciones: ['--auto-verify', '--verify', '--etherscan', '--scan'],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Bridging, gas y herramientas L2',
      descripcion: 'Cómo mover assets entre L1 y L2, fees en Arbitrum y librerías útiles.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Bridging y gas

### El puente oficial

[bridge.arbitrum.io](https://bridge.arbitrum.io) mueve assets entre L1 y Arbitrum:

- **L1 → L2**: rápido (~10 min).
- **L2 → L1**: tarda ~7 días por el periodo de impugnación. Hay puentes de terceros con liquidez (Hop, Across, Stargate) para retiros rápidos por una fee.

### Gas en Arbitrum

El gas que pagas tiene **dos componentes**:

1. **L2 execution gas**: barato, similar a EVM normal.
2. **L1 calldata cost**: pagas por los datos que se publican en Ethereum como blob/calldata.

Por eso, **funciones con muchos parámetros calldata cuestan más** en L2 que en L1 normalizado. Optimiza el calldata (usa \`bytes\` compactos, paquetes de estructuras).

### Herramientas

- **Stylus**: ejecuta contratos en WASM (Rust, C++) en Arbitrum además de la EVM.
- **Nitro**: el cliente actual, escrito en Go.
- **Arbitrum SDK**: librería JS para interactuar con el bridge y mensajes L1↔L2.`,
      cuestionario: [
        {
          pregunta: '¿Por qué un retiro estándar L2 → L1 tarda ~7 días?',
          opciones: [
            'Por el periodo de impugnación del rollup optimista',
            'Por el tiempo de minado de Ethereum',
            'Por trámites legales',
            'Por validación de KYC',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué componentes paga el gas en Arbitrum?',
          opciones: [
            'Solo execution L2',
            'L2 execution + L1 calldata',
            'Solo L1 calldata',
            'Gas y commission al validador',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué permite hacer Stylus?',
          opciones: [
            'Ejecutar contratos WASM (Rust, C++) además de EVM en Arbitrum',
            'Hacer bridging rápido',
            'Verificar contratos automáticamente',
            'Tradear NFTs',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Cómo puedes retirar de L2 a L1 sin esperar 7 días?',
          opciones: [
            'Usar un puente de terceros con liquidez (Hop, Across, Stargate) por una fee',
            'No es posible',
            'Pagar gas extra al validador',
            'Cambiar a Arbitrum Nova',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Cuál es el cliente principal de nodos actualmente en Arbitrum One?',
          opciones: ['Nitro (escrito en Go)', 'Geth', 'Erigon', 'Besu'],
          correcta: 0,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Qué tipo de rollup es Arbitrum One?',
      opciones: ['Validium', 'Optimistic', 'zk-SNARK', 'Hybrid'],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es la principal ventaja de un L2 sobre Ethereum L1?',
      opciones: [
        'Mayor descentralización',
        'Mover la ejecución fuera de L1 hereda seguridad pero baja drásticamente fees',
        'Mejor privacidad',
        'Tokens nativos distintos',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Dónde publican los rollups los datos para que cualquiera reconstruya el estado?',
      opciones: ['Off-chain', 'En Ethereum L1 (calldata o blobs)', 'En IPFS', 'No los publica'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué hace AnyTrust en Arbitrum Nova?',
      opciones: [
        'Aumenta la descentralización',
        'Reduce costos al delegar la disponibilidad de datos a un comité de confianza',
        'Cambia el algoritmo de consenso',
        'No tiene efecto',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué tooling Ethereum sigue funcionando 1:1 en Arbitrum?',
      opciones: [
        'Hardhat, Foundry, ethers, viem, wagmi',
        'Solo Foundry',
        'Ninguno',
        'Solo Hardhat',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿En qué bloque incurre el costo "L1 calldata" de una tx en Arbitrum?',
      opciones: [
        'En la ejecución del opcode',
        'En la publicación de los datos en Ethereum L1',
        'En el gas del wallet',
        'En la verificación del contrato',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué problema NO te resuelve Stylus?',
      opciones: [
        'Escribir contratos en Rust o C++',
        'Aumentar la descentralización del rollup',
        'Compilar a WASM',
        'Aprovechar librerías de Rust',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué chain ID tiene Arbitrum One?',
      opciones: ['1', '10', '42161', '137'],
      correcta: 2,
    },
    {
      pregunta: 'Si deployas el mismo contrato en L1 y Arbitrum, ¿qué cambia principalmente?',
      opciones: [
        'El código Solidity',
        'El RPC y el chain ID; el bytecode es el mismo',
        'El ABI',
        'El compilador',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué riesgo principal añade depender exclusivamente del puente oficial de Arbitrum?',
      opciones: [
        'Ninguno',
        'Latencia de retiro de ~7 días para movimientos grandes',
        'Que cobra demasiado gas',
        'Que requiere KYC',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Avalanche: C-Chain + Subnets
   ============================================================ */
const cursoAvalanche: Curso = {
  id: 'avalanche-subnets',
  titulo: 'Avalanche: C-Chain y Subnets',
  nivel: 'Intermedio',
  duracion: '45 min',
  imagen: IMAGES.CURSOS.AVALANCHE,
  descripcion:
    'Domina la arquitectura de tres cadenas de Avalanche, lanza un contrato en C-Chain y crea tu propia subnet con Avalanche-CLI.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Avalanche', 'Subnets', 'Desarrollo', 'Smart Contracts'],
  requisitos: 'Bases de blockchain, wallets y línea de comandos.',
  lecciones: [
    {
      id: 1,
      titulo: 'Arquitectura Avalanche: P, X y C',
      descripcion: 'Tres cadenas con propósitos distintos en una sola red.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. P-Chain, X-Chain, C-Chain

Avalanche es una **red de redes**. La primary network corre tres cadenas:

- **P-Chain (Platform)**: coordina validadores y subnets. Aquí se hace staking de AVAX.
- **X-Chain (Exchange)**: optimizada para crear y mover assets (UTXO).
- **C-Chain (Contract)**: EVM-compatible. Aquí desplegas Solidity como si fuera Ethereum.

### Consenso Snowball/Snowman

Avalanche no usa PoW ni PoS clásico de Tendermint: usa **Snowball / Snowman**, un consenso probabilístico que se basa en muestreo aleatorio repetido entre validadores. Es **rápido** (finality < 2 s) y **escalable** (>4 500 tps).

### AVAX

El token nativo:

- Paga gas en C-Chain.
- Se stakea en P-Chain (mínimo ~25 AVAX para validar, 2 AVAX para delegar).
- Premia a validadores activos y honestos.`,
      cuestionario: [
        {
          pregunta: '¿Qué cadena de Avalanche es EVM-compatible?',
          opciones: ['P-Chain', 'X-Chain', 'C-Chain', 'Z-Chain (no existe)'],
          correcta: 2,
        },
        {
          pregunta: '¿Para qué sirve la P-Chain?',
          opciones: [
            'Hacer pagos en stablecoin',
            'Coordinar validadores y subnets, y hacer staking',
            'Ejecutar contratos Solidity',
            'Almacenar metadata de NFTs',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué característica define el consenso Snowman/Snowball?',
          opciones: [
            'PoW intensivo',
            'Muestreo aleatorio repetido entre validadores',
            'Líder fijo elegido cada época',
            'No tiene consenso',
          ],
          correcta: 1,
        },
        {
          pregunta: 'En Avalanche, ¿cuál es la finality típica?',
          opciones: ['~13 segundos', '< 2 segundos', '~1 hora', '~10 minutos'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la X-Chain de Avalanche?',
          opciones: [
            'Una EVM',
            'Cadena UTXO optimizada para crear y mover assets',
            'La cadena de gobernanza',
            'Un subnet',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Desplegar en C-Chain',
      descripcion: 'C-Chain se siente exactamente como Ethereum, solo cambia el RPC.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Deploy en C-Chain

C-Chain corre la EVM. Tooling familiar:

### Foundry

\`\`\`bash
forge create src/MyToken.sol:MyToken \\
  --rpc-url https://api.avax.network/ext/bc/C/rpc \\
  --private-key $PK
\`\`\`

Para **Fuji** (testnet): \`https://api.avax-test.network/ext/bc/C/rpc\` y obtienes AVAX en el [faucet](https://faucet.avax.network).

### Verificación

Usa **Snowtrace** (equivalente a Etherscan). Con Hardhat:

\`\`\`ts
etherscan: {
  apiKey: { avalanche: SNOWTRACE_API_KEY }
}
\`\`\`

### Diferencias con Ethereum

- **Chain ID**: 43114 (mainnet), 43113 (Fuji).
- **Block time**: ~2 s.
- **Gas**: barato y predecible.
- **Stack idéntico**: web3.js, ethers.js, wagmi, viem — todo funciona.`,
      cuestionario: [
        {
          pregunta: '¿Qué chain ID tiene Avalanche C-Chain mainnet?',
          opciones: ['1', '137', '43114', '42161'],
          correcta: 2,
        },
        {
          pregunta: '¿Dónde verificas un contrato en C-Chain?',
          opciones: ['Etherscan', 'Snowtrace', 'Arbiscan', 'Solscan'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la testnet pública de Avalanche?',
          opciones: ['Sepolia', 'Fuji', 'Mumbai', 'Goerli'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué chain ID tiene Fuji (testnet)?',
          opciones: ['43113', '43114', '11155111', '80001'],
          correcta: 0,
        },
        {
          pregunta: '¿Qué librería JS NO funciona en C-Chain?',
          opciones: ['ethers.js', '@solana/web3.js', 'viem', 'wagmi'],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Crear una Subnet con Avalanche-CLI',
      descripcion: 'Tu propia EVM con reglas custom: gas token, validadores, gobernanza.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Subnets

Una **subnet** en Avalanche es un conjunto de validadores que corren una o más blockchains custom. Puedes:

- Elegir el **VM** (Subnet-EVM por defecto).
- Definir tu **gas token** (no tiene que ser AVAX).
- Establecer reglas de KYC, permissioning, etc.

### Flujo con Avalanche-CLI

\`\`\`bash
avalanche subnet create misubnet
avalanche subnet deploy misubnet --local
\`\`\`

El wizard te pregunta:

- **Chain ID** (elige uno único)
- **Initial allocations** (cuántos tokens y a quién al inicio)
- **Permissioning** (mainnet permissioned = solo wallets autorizadas pueden tx)

### Mainnet

Para producción haces \`avalanche subnet deploy misubnet --mainnet\`. Necesitas:

- Un validador (o pagar a Avalanche para que valide por ti, modelo "subnet-as-a-service").
- Pagar la **subscription fee** en AVAX.`,
      cuestionario: [
        {
          pregunta: '¿Qué es una Avalanche Subnet?',
          opciones: [
            'Una L2 sobre la C-Chain',
            'Un conjunto de validadores que corre una o más blockchains custom',
            'Una wallet HD',
            'Un protocolo DeFi',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿El gas token de tu subnet tiene que ser AVAX?',
          opciones: ['Sí, siempre', 'No, puedes definir el tuyo', 'Solo en mainnet', 'Solo en testnet'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué comando crea localmente una nueva subnet?',
          opciones: [
            'avalanche subnet new',
            'avalanche subnet create <nombre>',
            'avalanche new subnet',
            'avax subnet init',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué significa "permissioned subnet"?',
          opciones: [
            'Cualquiera puede transaccionar',
            'Solo wallets autorizadas pueden enviar tx en esa subnet',
            'Solo lectura',
            'Está cerrada para siempre',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué bandera de deploy se usa para producción mainnet?',
          opciones: ['--local', '--testnet', '--mainnet', '--prod'],
          correcta: 2,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Cuáles son las tres cadenas de la primary network de Avalanche?',
      opciones: ['L1, L2, L3', 'P, X y C', 'Alpha, Beta, Gamma', 'A, B, C'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué cadena ejecuta contratos Solidity en Avalanche?',
      opciones: ['P-Chain', 'X-Chain', 'C-Chain', 'Una subnet por default'],
      correcta: 2,
    },
    {
      pregunta: '¿Qué hace la P-Chain principalmente?',
      opciones: [
        'Tradear NFTs',
        'Coordinar validadores y subnets, gestionar staking',
        'Ejecutar EVM',
        'Hostear DEX',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿En qué se basa el consenso Snowman/Snowball?',
      opciones: [
        'PoW',
        'Muestreo aleatorio repetido entre validadores',
        'Round-robin',
        'Líder fijo',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué token paga el gas en C-Chain?',
      opciones: ['ETH', 'AVAX', 'BTC', 'MATIC'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué chain ID identifica a Avalanche C-Chain mainnet?',
      opciones: ['1', '137', '43114', '42161'],
      correcta: 2,
    },
    {
      pregunta: '¿Qué herramienta es la oficial para crear y gestionar subnets?',
      opciones: ['Avalanche-CLI', 'Foundry', 'Hardhat', 'Solana-CLI'],
      correcta: 0,
    },
    {
      pregunta: '¿Qué se puede customizar en una subnet?',
      opciones: [
        'Solo el logo',
        'VM, gas token, permissioning, allocations iniciales',
        'Solo el chain ID',
        'Nada',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Para qué se usa la X-Chain?',
      opciones: [
        'Para gobernanza',
        'Para crear y mover assets (modelo UTXO)',
        'Para ejecutar contratos EVM',
        'Para staking',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Cuál es la finality aproximada de Avalanche?',
      opciones: ['~13 s', '< 2 s', '~10 min', '~1 hora'],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Stellar / Soroban
   ============================================================ */
const cursoStellar: Curso = {
  id: 'stellar-soroban',
  titulo: 'Stellar y Soroban (smart contracts en Rust)',
  nivel: 'Intermedio',
  duracion: '60 min',
  imagen: IMAGES.CURSOS.STELLAR,
  descripcion:
    'De anchors y trustlines en Stellar clásico a smart contracts en Soroban con Rust. Despliegue en Futurenet y SDK JS.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Stellar', 'Soroban', 'Rust', 'Desarrollo', 'Smart Contracts'],
  requisitos: 'Programación básica. No necesitas Rust avanzado: lo introducimos.',
  lecciones: [
    {
      id: 1,
      titulo: 'Stellar clásico: anchors, assets y trustlines',
      descripcion: 'Lo que hace especial a Stellar como red de pagos cross-border.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Modelo de Stellar

Stellar fue diseñado para **mover valor entre divisas y mundos diferentes** rápido y barato. Tres conceptos clave:

- **Assets**: cualquier representación de valor. \`USDC\`, \`MXNT\` (Bitso Token), tokens custom — todos son assets emitidos por un **issuer**.
- **Trustlines**: para recibir un asset no nativo (no XLM) debes **abrir una trustline** con el issuer. Es tu autorización de "confío en este emisor".
- **Anchors**: empresas que emiten assets respaldados por dinero real off-chain (ej. un anchor emite \`USDC\` y custodia los dólares en banco).

### XLM y fees

**XLM** (Lumens) es el token nativo. Las fees son **muy bajas** (~0.00001 XLM por operación). Una transacción puede tener hasta **100 operaciones** atómicas.

### Comparativa rápida

| Red       | Tx/s | Fee típica   | Finality |
|-----------|-----:|--------------|---------:|
| Stellar   | ~3 000 | <$0.0001 USD | 5 s    |
| Ethereum  |   ~30  | $1–$30 USD   | ~13 s  |
| Bitcoin   |    ~7  | $1–$10 USD   | ~60 min|`,
      cuestionario: [
        {
          pregunta: '¿Para qué sirve una trustline en Stellar?',
          opciones: [
            'Para tener una clave privada',
            'Para autorizar recibir un asset no-nativo emitido por un issuer',
            'Para enviar transacciones más rápido',
            'Para hacer staking',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué es un "anchor" en Stellar?',
          opciones: [
            'Un nodo validador',
            'Una empresa que emite assets respaldados por valor off-chain',
            'Una wallet hardware',
            'Un protocolo de gobernanza',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es el token nativo de Stellar?',
          opciones: ['STR', 'XLM (Lumens)', 'SOR', 'STC'],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Soroban: smart contracts en Rust sobre Stellar',
      descripcion: 'Soroban añade una capa de contratos WASM/Rust a Stellar.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Soroban

Stellar clásico no tenía smart contracts arbitrarios (solo operaciones predefinidas). **Soroban** añadió una **VM WASM** que ejecuta contratos en **Rust**.

### Contrato mínimo

\`\`\`rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol};

#[contract]
pub struct Greeter;

#[contractimpl]
impl Greeter {
    pub fn hello(env: Env, name: Symbol) -> Symbol {
        name
    }
}
\`\`\`

### Storage

Soroban tiene tres tipos de storage:

- **Temporary**: barato, expira pronto.
- **Persistent**: tu estado "normal" entre llamadas.
- **Instance**: ligado al contrato; ideal para configuración.

Cada tipo tiene su propio modelo de **rent** (igual que Solana: pagas por almacenar). Optimiza usando temporary cuando puedas.`,
      cuestionario: [
        {
          pregunta: '¿En qué lenguaje se escriben los contratos Soroban?',
          opciones: ['Solidity', 'Rust (compilado a WASM)', 'Move', 'JavaScript'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué tipos de storage tiene Soroban?',
          opciones: [
            'Solo persistent',
            'Temporary, persistent e instance',
            'Hot y cold',
            'Stack y heap',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué macro define una función pública del contrato?',
          opciones: ['#[contract]', '#[contractimpl]', '#[program]', '#[derive]'],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Despliegue en Futurenet + SDK JS',
      descripcion: 'CLI de Soroban, claves, deploy en Futurenet/Testnet y front en JS.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Deploy y cliente

### CLI

\`\`\`bash
# Compilar
cargo build --target wasm32-unknown-unknown --release

# Deploy a futurenet
soroban contract deploy \\
  --wasm target/wasm32-unknown-unknown/release/greeter.wasm \\
  --source ALICE \\
  --network futurenet
\`\`\`

Te devuelve el **Contract ID**.

### Invocar

\`\`\`bash
soroban contract invoke \\
  --id <CONTRACT_ID> \\
  --source ALICE \\
  --network futurenet \\
  -- hello --name CriptoUNAM
\`\`\`

### Cliente JS

\`\`\`ts
import { Contract, SorobanRpc } from '@stellar/stellar-sdk'

const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')
const contract = new Contract('CONTRACT_ID')
// ...build tx, sign, submit
\`\`\`

Para production usas \`mainnet\` y XLM real para pagar fees.`,
      cuestionario: [
        {
          pregunta: '¿Qué target de Rust necesitas para compilar para Soroban?',
          opciones: [
            'x86_64-unknown-linux-gnu',
            'wasm32-unknown-unknown',
            'aarch64-apple-darwin',
            'riscv32imc-unknown',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué red de Stellar se usa para experimentar con Soroban?',
          opciones: ['Mainnet', 'Futurenet/Testnet', 'Localnet', 'Sepolia'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué librería JS oficial se usa con Soroban?',
          opciones: ['ethers.js', '@stellar/stellar-sdk', 'web3.js', 'viem'],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   CURSO · Sui + Move
   ============================================================ */
const cursoSui: Curso = {
  id: 'sui-move',
  titulo: 'Sui y Move: el modelo de objetos',
  nivel: 'Avanzado',
  duracion: '60 min',
  imagen: IMAGES.CURSOS.SUI,
  descripcion:
    'Sui cambia la forma de modelar estado: todo es un objeto. Aprende Move adaptado a Sui, abilities, transfer y publica tu primer módulo.',
  precio: 0,
  precioPuma: 5000,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Sui', 'Move', 'Desarrollo', 'Smart Contracts'],
  requisitos: 'Haber programado en algún lenguaje tipado (Rust, TypeScript, Go o similar).',
  lecciones: [
    {
      id: 1,
      titulo: 'Modelo de objetos en Sui vs accounts en EVM',
      descripcion: 'Lo que cambia tu mental model cuando todo es un objeto identificable.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. Sui: object-centric

En EVM piensas en **cuentas** (\`address\`) y **mappings** dentro de un contrato. En **Sui** todo es un **objeto** con:

- **ID único** (\`UID\`)
- **Owner** (una address, un objeto padre o "shared")
- **Tipo** definido en un módulo Move

### Tipos de owner

- **Address-owned**: pertenece a una wallet. Solo esa wallet lo puede mover.
- **Shared**: cualquiera puede usarlo (ej. una pool de DEX).
- **Immutable**: nunca cambia (ej. metadata).
- **Object-owned**: hijo de otro objeto.

### ¿Para qué sirve?

El runtime sabe **qué objetos toca cada transacción**, así que puede paralelizar al máximo. Si dos tx no comparten objetos, se ejecutan al mismo tiempo. Resultado: throughput muy alto.`,
      cuestionario: [
        {
          pregunta: '¿Qué es la unidad básica de estado en Sui?',
          opciones: ['Cuenta (address)', 'Objeto con UID', 'Contract storage slot', 'Account info'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué owner se usa para un objeto que cualquier wallet debe poder consumir (ej. una pool)?',
          opciones: ['Address-owned', 'Shared', 'Immutable', 'Object-owned'],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué Sui puede paralelizar tantas tx?',
          opciones: [
            'Porque tiene más validadores',
            'Porque el runtime conoce qué objetos toca cada tx',
            'Porque usa PoW eficiente',
            'Porque no valida firmas',
          ],
          correcta: 1,
        },
        {
          pregunta: 'Si un objeto es "immutable", ¿qué quiere decir?',
          opciones: [
            'Tiene un dueño temporal',
            'Nunca cambia su estado y cualquiera lo puede leer',
            'Está vacío',
            'Solo lo puede ver el creador',
          ],
          correcta: 1,
        },
        {
          pregunta: 'En EVM piensas en mappings dentro de un contrato. En Sui piensas en:',
          opciones: [
            'Lo mismo',
            'Objetos con UID que pertenecen a alguien o son shared',
            'Tablas SQL',
            'Buckets de S3',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Move para Sui: módulos, structs y abilities',
      descripcion: 'Recursos lineales y abilities (key, store, copy, drop).',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Move

**Move** es un lenguaje diseñado para representar **recursos digitales** sin riesgo de duplicación. Una de sus ideas clave: las **abilities**.

### Las cuatro abilities

- **\`key\`**: el tipo puede ser una entrada en storage (tener UID).
- **\`store\`**: puede vivir dentro de otro objeto.
- **\`copy\`**: se puede duplicar.
- **\`drop\`**: se puede descartar sin transferir.

Un **NFT** típicamente tiene \`key, store\` (no copy, no drop): no se puede duplicar ni borrar accidentalmente.

### Módulo mínimo

\`\`\`move
module mi_pkg::counter {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    struct Counter has key { id: UID, count: u64 }

    public entry fun new(ctx: &mut TxContext) {
        let c = Counter { id: object::new(ctx), count: 0 };
        transfer::transfer(c, tx_context::sender(ctx));
    }

    public entry fun inc(c: &mut Counter) { c.count = c.count + 1; }
}
\`\`\``,
      cuestionario: [
        {
          pregunta: '¿Qué ability debe tener un struct para ser almacenado en Sui?',
          opciones: ['copy', 'drop', 'key', 'store'],
          correcta: 2,
        },
        {
          pregunta: '¿Por qué un NFT en Move típicamente NO tiene la ability `copy`?',
          opciones: [
            'Para que no se pueda duplicar',
            'Para que sea más barato',
            'Para que use menos gas',
            'Es opcional, no afecta',
          ],
          correcta: 0,
        },
        {
          pregunta: '¿Qué hace `transfer::transfer(obj, addr)`?',
          opciones: [
            'Borra el objeto',
            'Asigna la propiedad del objeto a una address',
            'Lo convierte en shared',
            'Lo copia',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué ability permite que un struct pueda descartarse implícitamente?',
          opciones: ['key', 'store', 'copy', 'drop'],
          correcta: 3,
        },
        {
          pregunta: 'Un struct con abilities `key, store` pero NO `copy` ni `drop` representa típicamente:',
          opciones: [
            'Un token fungible barato',
            'Un recurso único (ej. NFT, certificado soulbound)',
            'Una constante de configuración',
            'Una variable temporal',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Publicar y llamar un módulo en Sui devnet',
      descripcion: 'sui CLI: build, publish, ejecutar call.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Deploy en Sui

### Setup

\`\`\`bash
sui client new-address ed25519
sui client switch --env devnet
sui client faucet
\`\`\`

### Build y publicar

\`\`\`bash
sui move build
sui client publish --gas-budget 100000000
\`\`\`

Sui devuelve el **Package ID** y los **objetos creados**.

### Llamar una función

\`\`\`bash
sui client call \\
  --package <PKG_ID> \\
  --module counter \\
  --function new \\
  --gas-budget 10000000
\`\`\`

### Cliente TS

\`\`\`ts
import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'

const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io' })
const tx = new TransactionBlock()
tx.moveCall({
  target: \`\${PKG}::counter::inc\`,
  arguments: [tx.object(COUNTER_ID)],
})
\`\`\``,
      cuestionario: [
        {
          pregunta: '¿Qué comando publica tu paquete Move a la red en Sui?',
          opciones: [
            'sui client deploy',
            'sui client publish',
            'sui move release',
            'sui upload',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué te entrega Sui al publicar un paquete?',
          opciones: [
            'Una address EOA',
            'Un Package ID + objetos creados',
            'Un contrato Solidity',
            'Un hash de bloque',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Cómo obtienes SUI ficticio en devnet?',
          opciones: [
            'Minando',
            'Pidiendo al faucet (sui client faucet)',
            'Comprando',
            'No se puede',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué SDK oficial JS/TS se usa para Sui?',
          opciones: [
            'ethers.js',
            '@mysten/sui.js',
            'web3.js',
            '@solana/web3.js',
          ],
          correcta: 1,
        },
        {
          pregunta: 'Para invocar una función Move, ¿qué objeto JS usas?',
          opciones: [
            'TransactionBlock con tx.moveCall',
            'Contract.method().send()',
            'Connection.send()',
            'Wallet.execute()',
          ],
          correcta: 0,
        },
      ],
    },
  ],
  examenFinal: [
    {
      pregunta: '¿Qué identifica únicamente a un objeto en Sui?',
      opciones: ['Su nombre', 'Su UID', 'Su tipo Move', 'Su gas'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué owner tendría un objeto que NUNCA debe cambiar (ej. metadata)?',
      opciones: ['address-owned', 'shared', 'immutable', 'object-owned'],
      correcta: 2,
    },
    {
      pregunta: 'Una pool de un DEX que cualquiera puede tocar suele ser:',
      opciones: ['address-owned', 'shared', 'immutable', 'object-owned'],
      correcta: 1,
    },
    {
      pregunta: '¿En qué lenguaje se programan los módulos de Sui?',
      opciones: ['Rust', 'Move', 'Cairo', 'Solidity'],
      correcta: 1,
    },
    {
      pregunta: 'Para que un struct sea storable como objeto en Sui, requiere mínimo la ability:',
      opciones: ['copy', 'drop', 'key', 'store'],
      correcta: 2,
    },
    {
      pregunta: 'Un NFT canónicamente Move tiene abilities:',
      opciones: ['copy, drop', 'key, store (sin copy ni drop)', 'solo drop', 'todas'],
      correcta: 1,
    },
    {
      pregunta: '¿Qué hace `transfer::transfer(obj, addr)`?',
      opciones: [
        'Borra el objeto',
        'Asigna la propiedad del objeto a una address específica',
        'Lo convierte en shared',
        'Lo copia',
      ],
      correcta: 1,
    },
    {
      pregunta: '¿Qué comando despliega un paquete Move a la red?',
      opciones: ['sui client deploy', 'sui client publish', 'sui move release', 'cargo publish'],
      correcta: 1,
    },
    {
      pregunta: 'Para construir una tx desde JS y llamar funciones Move, usas:',
      opciones: [
        'TransactionBlock con moveCall',
        'web3.eth.contract',
        'Anchor IDL',
        'fetch directo',
      ],
      correcta: 0,
    },
    {
      pregunta: '¿Por qué Sui logra alto throughput?',
      opciones: [
        'Por marketing',
        'Porque el runtime detecta qué objetos toca cada tx y paraleliza las que no se cruzan',
        'Por mining intensivo',
        'Por validadores con CPUs especiales',
      ],
      correcta: 1,
    },
  ],
}

/* ============================================================
   CURSO · Ethereum Layer 2 (panorama)
   ============================================================ */
const cursoEthereumL2: Curso = {
  id: 'ethereum-l2-panorama',
  titulo: 'Ethereum Layer 2: rollups y escalado',
  nivel: 'Intermedio',
  duracion: '45 min',
  imagen: IMAGES.CURSOS.ETHEREUM_L2,
  descripcion:
    'Por qué Ethereum necesita L2. Tipos (optimistic, zk, validium), comparativa Arbitrum/Optimism/Base/zkSync/Scroll y cuándo elegir cada uno.',
  precio: 0,
  precioPuma: 1500,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Ethereum', 'L2', 'Rollups', 'Fundamentos'],
  requisitos: 'Conocer Ethereum básico (wallets, gas, contratos).',
  lecciones: [
    {
      id: 1,
      titulo: '¿Por qué Layer 2? Throughput, fees y descentralización',
      descripcion: 'El trilema del escalado y por qué no se resuelve en L1.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 1. El trilema y los L2

Vitalik propuso el **trilema**: una blockchain busca tres propiedades pero **no puede tener las tres** sin compromisos:

- **Descentralización**: cualquier persona puede correr un nodo.
- **Seguridad**: resistente a ataques.
- **Escalabilidad**: throughput alto.

Ethereum L1 prioriza descentralización + seguridad. Por eso es lento (~15 tps). Subir mucho ese número rompería la descentralización (nodos solo para data centers).

### La estrategia: rollup-centric

Ethereum decidió: la **L1 garantiza seguridad y datos**; el cómputo masivo va a **L2**. Los rollups:

1. Ejecutan tx fuera de L1.
2. Publican un **state root** en L1 + los **datos** necesarios para reconstruir el estado.
3. Cualquiera puede impugnar o verificar.

Resultado: heredas la seguridad de L1 sin pagar su costo.`,
      cuestionario: [
        {
          pregunta: '¿Cuáles son las tres propiedades del trilema?',
          opciones: [
            'Velocidad, latencia, costo',
            'Descentralización, seguridad, escalabilidad',
            'Privacidad, anonimato, abierto',
            'Token, gas, fees',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Qué publica un rollup en L1?',
          opciones: [
            'Solo el state root',
            'State root + datos suficientes para reconstruir el estado',
            'Nada, todo queda en L2',
            'El bytecode completo de cada contrato',
          ],
          correcta: 1,
        },
        {
          pregunta: '¿Por qué Ethereum no escala simplemente subiendo el gas limit en L1?',
          opciones: [
            'Es ilegal',
            'Reduciría la descentralización: menos gente puede correr nodos',
            'No haría diferencia',
            'El protocolo no lo permite',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Tipos de L2: optimistic, zk y validium',
      descripcion: 'Cómo se prueban las transacciones y qué implica cada modelo.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 2. Familias de L2

### Optimistic rollups

- Asumen tx válidas; permiten **fraud proofs** durante ~7 días.
- Ejemplos: **Arbitrum**, **Optimism**, **Base**.
- ✅ EVM-compatible casi 1:1.
- ⚠️ Retiros tardan ~7 días.

### zk rollups

- Cada batch incluye una **prueba criptográfica** (SNARK/STARK) de validez.
- Ejemplos: **zkSync Era**, **Scroll**, **Polygon zkEVM**, **Linea**, **Starknet**.
- ✅ Retiros casi inmediatos.
- ⚠️ Generar las pruebas es caro y a veces hay restricciones en opcodes.

### Validium / Volition

- Como zk pero los **datos** se publican off-chain (no en L1). Más barato, menos seguro.
- Ejemplos: **Immutable X**, **Polygon Miden**.

### Cuándo elegir cada uno

- DeFi con muchos retiros rápidos → **zk rollup**.
- App existente en Solidity que quiere fees bajos → **optimistic** (Arbitrum/Optimism/Base).
- Gaming con throughput masivo y assets recurrentes → **Validium**.`,
      cuestionario: [
        {
          pregunta: '¿Qué prueba la validez de un zk rollup?',
          opciones: ['Un fraud proof', 'Un SNARK/STARK', 'Un validador', 'Un signature'],
          correcta: 1,
        },
        {
          pregunta: '¿Dónde publica los datos un validium?',
          opciones: ['En L1', 'Off-chain (no en L1)', 'En IPFS siempre', 'En la mempool'],
          correcta: 1,
        },
        {
          pregunta: '¿Cuál es la ventaja principal de un zk rollup sobre uno optimistic?',
          opciones: [
            'Es más barato siempre',
            'Retiros inmediatos sin ventana de impugnación',
            'No tiene fees',
            'Es centralizado',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Comparativa: Arbitrum, Optimism, Base, zkSync, Scroll',
      descripcion: 'Diferencias prácticas para decidir dónde lanzar tu app.',
      video: VIDEO_PLACEHOLDER,
      guia: `## 3. Mapa de los grandes L2

| L2          | Tipo         | TVL aprox. | EVM compat. | Token nativo |
|-------------|--------------|-----------:|:-----------:|:------------:|
| Arbitrum    | Optimistic   | ⭐⭐⭐      | 1:1         | ARB (gobernanza), gas = ETH |
| Optimism    | Optimistic   | ⭐⭐⭐      | 1:1         | OP (gobernanza), gas = ETH |
| Base        | Optimistic   | ⭐⭐⭐      | 1:1         | gas = ETH |
| zkSync Era  | zk           | ⭐⭐        | ~95%        | gas = ETH |
| Scroll      | zk (zkEVM)   | ⭐         | 1:1         | gas = ETH |
| Polygon zkEVM | zk         | ⭐⭐        | 1:1         | gas = ETH |
| Starknet    | zk (Cairo)   | ⭐⭐        | NO          | STRK |

### Cómo elegir

- ¿Necesitas el ecosistema más maduro y compatible? → **Arbitrum** u **Optimism**.
- ¿Te integras con el ecosistema Coinbase / Farcaster? → **Base**.
- ¿Quieres tiempos de retiro cortos? → cualquier **zk**.
- ¿Estás dispuesto a aprender un lenguaje nuevo a cambio de tooling potente? → **Starknet** con Cairo.

### Stack de tools

Para todos: **wagmi**, **viem**, **ethers**, **Foundry**, **Hardhat**. Solo cambia el RPC y el chain ID.`,
      cuestionario: [
        {
          pregunta: '¿Cuál de estos NO es EVM-compatible 1:1?',
          opciones: ['Arbitrum', 'Optimism', 'Starknet', 'Scroll'],
          correcta: 2,
        },
        {
          pregunta: '¿Qué L2 está fuertemente asociado a Coinbase?',
          opciones: ['Optimism', 'Base', 'Arbitrum', 'Linea'],
          correcta: 1,
        },
        {
          pregunta: '¿Qué cambia entre desplegar en L1 y en cualquiera de estos L2 EVM?',
          opciones: [
            'Hay que reescribir todo el contrato',
            'Básicamente solo el RPC y el chain ID',
            'Hay que usar otro lenguaje',
            'El framework de tests',
          ],
          correcta: 1,
        },
      ],
    },
  ],
}

/* ============================================================
   EXPORT
   ============================================================ */
export const cursosStackBlockchain: Curso[] = [
  cursoSolana,
  cursoArbitrum,
  cursoAvalanche,
  cursoStellar,
  cursoSui,
  cursoEthereumL2,
]
