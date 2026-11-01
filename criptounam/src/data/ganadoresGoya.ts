/**
 * Ganadores oficiales de GOYA HACK 2026 (podios del 16 de octubre de 2026).
 *
 * Los podios no están marcados en la base de datos: viven aquí. Los nombres
 * son los del *proyecto* (AuraCafe), no los del equipo (Gollajacs) — son los
 * que se anunciaron. `projectId` enlaza a la ficha pública
 * /hackathon/proyectos/:id y `logo` es el que el equipo subió en su entrega.
 *
 * Los montos no se escriben a mano: salen de los `PREMIOS_*` de hackathonInfo.
 */
import {
  PREMIOS_AVALANCHE,
  PREMIOS_CRIPTOUNAM,
  PREMIOS_POLLAR,
  PREMIOS_STELLAR,
  PREMIOS_TANGEM,
  textoPremioLugar,
  type LugarPremio,
} from './hackathonInfo'

export interface ProyectoGanador {
  projectId: string
  proyecto: string
  equipo: string
  tagline: string
  logo: string
  /** Wordmark transparente: se ajusta dentro de la placa en vez de llenarla. */
  logoContain?: boolean
  /** Tinta oscura: necesita placa clara para leerse sobre el negro. */
  placaClara?: boolean
}

export interface LugarGanador extends ProyectoGanador {
  lugar: 1 | 2 | 3
  premio: string
}

export interface PodioGanadores {
  id: string
  titulo: string
  rotulo: string
  /** Logo del patrocinador del track, en /public. */
  logo: string
  /** El logo trae color propio (no aplicar silueta blanca). */
  logoColor?: boolean
  nota?: string
  ganadores: LugarGanador[]
}

const STORAGE =
  'https://cnbugkudgsfzbbzrdizg.supabase.co/storage/v1/object/public/hackathon/uploads'

const P = {
  auracafe: {
    projectId: 'ed63b23b-1bc9-4e4b-a245-bef5f5c55ddb',
    proyecto: 'AuraCafe',
    equipo: 'Gollajacs',
    tagline: 'Pide comida en el campus y paga seguro.',
    logo: `${STORAGE}/muewjz7d00600cjhbq660b9r/1790573401574-quap0hax.png`,
  },
  cumpleCobra: {
    projectId: 'ce61c779-a9d6-42c5-9e8b-c4569e7f8ed4',
    proyecto: 'Cumple&Cobra',
    equipo: 'cumple&cobra',
    tagline: 'Pagos freelance en Stellar que se liberan solo si el código cumple lo acordado, verificado por IA.',
    logo: `${STORAGE}/mu6hd6vs008w0clarqskol95/1790578017699-khl5j6ib.jpg`,
  },
  paperpay: {
    projectId: '2e37ca56-1b03-4c92-89c2-118979ae1785',
    proyecto: 'PaperPay',
    equipo: 'Stroops',
    tagline: 'Micropagos sobre Stellar para leer ciencia por centavos.',
    logo: `${STORAGE}/mug13sef00il0dl8l4ltgfbc/1790540108583-ej3s4rgp.png`,
    logoContain: true,
    placaClara: true,
  },
  gremium: {
    projectId: 'a269b1d0-4a00-4710-99c9-6b8f3c20ac78',
    proyecto: 'Gremium',
    equipo: 'Genesis',
    tagline: 'El marketplace universitario donde el trueque renace con saldo digital y garantía de prueba entre estudiantes.',
    logo: `${STORAGE}/muc0k3jm001t0cjm7kzj2jc6/1790566581647-w8nv6lpu.png`,
    logoContain: true,
  },
  cryptotrace: {
    projectId: '35ed8312-7be2-4169-a859-abbf133f1408',
    proyecto: 'CryptoTrace Insight',
    equipo: 'CryptoTrace Insight',
    tagline: 'La blockchain es transparente. Nosotros la hacemos comprensible.',
    logo: `${STORAGE}/muc03ad700160cl86p5gbbml/1790571336818-2379q5gr.png`,
    logoContain: true,
    placaClara: true,
  },
  nodo: {
    projectId: '19ffc32c-ac89-42e9-bea0-04723d42e837',
    proyecto: 'Nodo',
    equipo: 'Nodo',
    tagline: 'Delivery descentralizado con 0% de comisión, impulsado por IA y Stellar.',
    logo: `${STORAGE}/mukrlz7e006i0cl83tppl7rx/1790572227917-09l1i2kd.jpg`,
    logoContain: true,
  },
  goyapay: {
    projectId: 'e1e60993-d19f-4fb4-a4a4-886690b5d13b',
    proyecto: 'GoyaPay AI',
    equipo: 'Gemapay ai',
    tagline: 'Gestión de wallet desde una llamada.',
    logo: `${STORAGE}/mu6fzl7w006o0cldlmwbf1f2/1790139932540-0qp7f14b.png`,
  },
  brevik: {
    projectId: '81c8bacf-8f27-4e38-999b-6a200fd8c8a7',
    proyecto: 'Brevik',
    equipo: 'MictlanFC',
    tagline: '«De lo dicho a lo hecho, un solo clic».',
    logo: `${STORAGE}/mud24f8601p40ckzgrbqe138/1790488216270-4gf3hikq.jpg`,
  },
  metztli: {
    projectId: 'a0021a81-223b-43af-b5e5-d8a44706441c',
    proyecto: 'Metztli',
    equipo: 'Los Copy Paste',
    tagline: 'Certifica con IA si un texto o imagen es auténtico y sella la evidencia en Stellar.',
    logo: `${STORAGE}/muc3dpwl004w0cif1snmk9s3/1790564580663-9f0pemjg.png`,
    logoContain: true,
  },
  micopay: {
    projectId: 'bb16037a-5f73-41ec-8f9a-47d6c68fce81',
    proyecto: 'Micopay App',
    equipo: 'Micopay',
    tagline: 'Cambia efectivo y cripto con alguien de tu colonia, sin arriesgar tu dinero.',
    logo: `${STORAGE}/muh00aef00l00cjphngc6x4d/1790556908483-c28c1gyp.png`,
  },
  cuentasClaras: {
    projectId: 'e0133b87-0acc-462c-a893-46fce465ea7d',
    proyecto: 'Cuentas Claras',
    equipo: 'Palabra',
    tagline: 'La libreta de fiado de la Central de Abasto, co-firmada en Stellar.',
    logo: `${STORAGE}/mujfb1zu000m0ckt7kwzrka2/1790492819652-ol3pwfy1.png`,
  },
} satisfies Record<string, ProyectoGanador>

/** Une el podio de proyectos con la tabla de premios por lugar. */
const podio = (premios: LugarPremio[], proyectos: ProyectoGanador[]): LugarGanador[] =>
  proyectos.map((p, i) => {
    const lugar = (i + 1) as 1 | 2 | 3
    const premio = premios.find((x) => x.lugar === lugar)
    return { ...p, lugar, premio: premio ? textoPremioLugar(premio) : '' }
  })

export const PODIOS_GOYA: PodioGanadores[] = [
  {
    id: 'stellar',
    titulo: 'Stellar',
    rotulo: 'Track Stellar · con BAF',
    logo: '/images/hackathon/sponsors/stellar.png',
    ganadores: podio(PREMIOS_STELLAR, [P.auracafe, P.cumpleCobra, P.paperpay]),
  },
  {
    id: 'avalanche',
    titulo: 'Avalanche',
    rotulo: 'Track Avalanche',
    logo: '/images/hackathon/sponsors/avalanche.png',
    ganadores: podio(PREMIOS_AVALANCHE, [P.gremium, P.cryptotrace, P.nodo]),
  },
  {
    id: 'ia',
    titulo: 'Inteligencia Artificial',
    rotulo: 'Track IA · CriptoUNAM',
    logo: '/images/puma-token-v2.png',
    logoColor: true,
    ganadores: podio(PREMIOS_CRIPTOUNAM, [P.goyapay, P.brevik, P.metztli]),
  },
  {
    id: 'contenido',
    titulo: 'Contenido',
    rotulo: 'Track Contenido · Tangem',
    logo: '/images/hackathon/sponsors/tangem.png',
    ganadores: podio(PREMIOS_TANGEM, [P.micopay, P.goyapay, P.cuentasClaras]),
  },
  {
    id: 'pollar',
    titulo: 'Pollar',
    rotulo: 'Pollar · mejor integración',
    logo: '/images/hackathon/sponsors/pollar.png',
    nota: 'Pollar premió la mejor integración de su SDK: este podio es de dos lugares.',
    ganadores: podio(PREMIOS_POLLAR, [P.gremium, P.cuentasClaras]),
  },
]

/** Cifras del cierre, para el resumen de la sección. */
export const RESUMEN_GOYA = {
  proyectosEntregados: 21,
  proyectosPremiados: new Set(PODIOS_GOYA.flatMap((t) => t.ganadores.map((g) => g.projectId))).size,
}
