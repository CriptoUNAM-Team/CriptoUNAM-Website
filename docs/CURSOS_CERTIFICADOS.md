# Flujo Cursos → Certificado NFT (Entregable 2 extendido)

Este documento describe el ciclo completo de un alumno desde que entra al catálogo
de cursos hasta que recibe su credencial NFT soulbound en `CriptoUNAMBadges`.

---

## 1. Modelo de datos

### Frontend — `src/constants/cursosData.ts`

```ts
export interface Curso {
  id: string                // ej. "1"
  titulo: string
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  precio: number            // legacy (USD/MXN; no usado on-chain)
  precioPuma?: number       // 0 = gratuito, >0 = se paga con $PUMA
  cohorteRef?: string       // ej. "v1", "2026-Q2". Default: "v1"
  capitulos?: Capitulo[]
  lecciones?: Leccion[]
  …
}

cursoBadgeRef(cursoId, cohorteRef) → `course-${cursoId}-${cohorteRef}`
```

### Supabase — tablas

```sql
-- existente
curso_inscripciones (wallet_address, curso_id, inscrito_en, nombre_completo, email)
curso_progreso       (wallet_address, curso_id, leccion_index, completado_en)
perfiles_puntos      (wallet_address, puntos)

-- nueva (crear en Supabase para tracking de certificados)
create table curso_certificados (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  curso_id       text not null,
  badge_ref      text not null,
  token_id       numeric,
  tx_hash        text,
  claimed_at     timestamptz not null default now(),
  unique (wallet_address, badge_ref)
);

create index curso_certificados_wallet_idx on curso_certificados (wallet_address);
create index curso_certificados_curso_idx  on curso_certificados (curso_id);
```

> Si la tabla no existe, las funciones del servicio devuelven estado vacío sin tirar
> errores; el reclamo on-chain sigue funcionando.

### Smart contract — `CriptoUNAMBadges`

```solidity
function mint(address to, BadgeKind kind, string calldata ref, string calldata uri)
  external onlyRole(MINTER_ROLE) returns (uint256 tokenId);

enum BadgeKind { CourseCompletion, EventAttendance, Ambassador, Certification }
```

- `BadgeKind.CourseCompletion` → **soulbound** (no transferible).
- `ref` debe coincidir con `cursoBadgeRef(id, cohorteRef)`. Esto evita doble emisión
  porque el contrato hashea `(to, kind, ref)` y rechaza duplicados.

---

## 2. Ciclo del alumno (flujo completo)

```
┌────────────────────────────────────────────────────────────────────┐
│  CATÁLOGO  /cursos                                                 │
│  ─ Filtros, búsqueda, chips de nivel y precio PUMA.                │
│  ─ Cada card muestra chip "NFT al completar".                      │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│  REGISTRO  /registro-curso/:id   (no inscrito todavía)             │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐    │
│  │ curso.precioPuma === 0       │  │ curso.precioPuma > 0     │    │
│  │ → solo firma + Supabase      │  │ → CoursePumaPayment      │    │
│  │   (handleInscribirse)        │  │   approve → burnReward   │    │
│  └──────────────────────────────┘  └──────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼ inscripcionCurso() en Supabase
┌────────────────────────────────────────────────────────────────────┐
│  PLATAFORMA  /registro-curso/:id   (ya inscrito)                   │
│  ─ Header con progress bar prominente                              │
│  ─ Lección activa: guía/video + cuestionario (carrusel)            │
│  ─ Sidebar con capítulos/lecciones e indicador done/active         │
│  ─ Bottom nav: lección anterior / siguiente                        │
│  ─ "Marcar como completada" → marcarLeccionCompletada()            │
│                                                                    │
│  CourseCertificateCTA (siempre visible)                            │
│    ─ Progreso < 100% → muestra barra "tu certificado te espera"    │
│    ─ Progreso = 100% → tarjeta dorada con CTA "Reclamar NFT"       │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼ Link a /claim/curso/{badgeRef}
┌────────────────────────────────────────────────────────────────────┐
│  RECLAMO  /claim/curso/course-{id}-v1                              │
│  ─ Preview del NFT con kind=CourseCompletion (soulbound chip)      │
│  ─ Si wallet con MINTER_ROLE → self-mint (firma directa)           │
│  ─ Si no → claim-code → POST /api/badges/claim                     │
└────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼ mint() on-chain
┌────────────────────────────────────────────────────────────────────┐
│  EVENTO BadgeMinted(to, tokenId, kind, ref)                        │
│  ─ Frontend muestra confetti + tokenId + link al explorer          │
│  ─ Backend registra en curso_certificados (token_id, tx_hash)      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Cómo el backend valida el reclamo

Endpoint sugerido: `POST /api/badges/claim` (Vercel serverless).

```ts
export default async function handler(req, res) {
  const { wallet, kind, ref, code } = req.body

  // 1. Validar wallet
  if (!isAddress(wallet)) return res.status(400).json({ error: 'wallet inválida' })

  // 2. Si es CourseCompletion, validar progreso en Supabase
  if (kind === BadgeKind.CourseCompletion) {
    // ref = "course-{cursoId}-{cohorteRef}"
    const match = /^course-(.+)-([^-]+)$/.exec(ref)
    if (!match) return res.status(400).json({ error: 'ref inválida' })
    const [, cursoId, cohorteRef] = match

    const curso = cursosData.find(c => c.id === cursoId)
    if (!curso) return res.status(404).json({ error: 'curso no encontrado' })

    const totalLecciones = getLeccionesFlat(curso).length
    const completado = await cursoCompletado(wallet, cursoId, totalLecciones)
    if (!completado) return res.status(403).json({ error: 'curso no completado' })
  }

  // 3. Para otras kinds, validar code contra Supabase claim_codes
  //    (tabla aparte que el equipo genera por sesión/evento)

  // 4. Ejecutar mint on-chain con MINTER_ROLE
  const tx = await minterClient.writeContract({
    address: badgesContractAddress,
    abi: criptoUnamBadgesAbi,
    functionName: 'mint',
    args: [wallet, kind, ref, `${metadataBase}/${ref}.json`],
  })

  // 5. Registrar en Supabase
  await registrarCertificadoEmitido({
    walletAddress: wallet,
    cursoId,
    badgeRef: ref,
    tokenId: String(tokenIdFromReceipt),
    txHash: tx,
  })

  res.json({ tokenId: String(tokenIdFromReceipt), txHash: tx })
}
```

**Vars de entorno del backend (NUNCA en el front):**
- `MINTER_PRIVATE_KEY`
- `RPC_URL`
- `BADGES_CONTRACT_ADDRESS`
- `SUPABASE_SERVICE_KEY` (lectura/escritura con bypass de RLS)

---

## 4. Self-mint para staff

Para emisiones manuales sin endpoint, cualquier wallet con `MINTER_ROLE` puede:

1. Conectarse en `/claim/curso/<ref>`.
2. La UI detecta `hasRole(MINTER_ROLE)` y oculta el campo de claim-code.
3. Botón "Acuñar NFT (self-mint)" llama a `mint(wallet, kind, ref, uri)` directamente
   desde la wallet del staff.

Esto es útil mientras no exista backend.

---

## 5. Convenciones de nomenclatura

| Tipo de credencial | Slug en URL  | BadgeKind          | Soulbound | `ref` ejemplo                       |
|--------------------|--------------|--------------------|-----------|-------------------------------------|
| Certificado curso  | `curso`      | `CourseCompletion` | ✅        | `course-1-v1`                       |
| Certificación      | `certificacion` | `Certification` | ✅        | `cert-web3-2026`                    |
| POAP sesión        | `sesion`     | `EventAttendance`  | ❌        | `embajadores-2026-05-26`            |
| POAP evento        | `evento`     | `EventAttendance`  | ❌        | `evento-eth-mexico-2026`            |
| Embajador          | `embajador`  | `Ambassador`       | ❌        | `embajador-2026-Q2`                 |

**Importante:** una vez emitido un NFT con `(to, kind, ref)`, el contrato lo bloquea
con `AlreadyClaimed`. Si necesitas relanzar un curso (cambios al material), cambia
`cohorteRef` (ej. `v2`) y los nuevos alumnos recibirán certificados con `ref` distinto.

---

## 6. Metadata JSON sugerida

```json
{
  "name": "CriptoUNAM · Smart Contracts con Solidity",
  "description": "Certificado soulbound de finalización del curso Smart Contracts con Solidity en CriptoUNAM. Cohorte v1.",
  "image": "ipfs://CID/course-2-v1.png",
  "external_url": "https://criptounam.xyz/cursos",
  "attributes": [
    { "trait_type": "Tipo", "value": "Course Completion" },
    { "trait_type": "Curso", "value": "Smart Contracts con Solidity" },
    { "trait_type": "Nivel", "value": "Intermedio" },
    { "trait_type": "Cohorte", "value": "v1" },
    { "trait_type": "Soulbound", "value": "Sí" }
  ]
}
```

Almacenar en `ipfs://CID/{badgeRef}.json` o en `https://criptounam.xyz/badges/{badgeRef}.json`.
El frontend resuelve esa URL automáticamente vía `useBadgeMetadata`.

---

## 7. Próximos pasos para producción

1. Deploy de `CriptoUNAMBadges` y otorgar `MINTER_ROLE` a la wallet del backend (idealmente multisig).
2. Crear tabla `curso_certificados` en Supabase y los índices.
3. Subir metadata JSON + imágenes a IPFS (Pinata).
4. Implementar endpoint `/api/badges/claim` con la validación de progreso.
5. Probar end-to-end en Sepolia con un curso de pago y uno gratuito.
6. Monitorear el evento `BadgeMinted` en un indexador o webhook para mantener Supabase sincronizado.
