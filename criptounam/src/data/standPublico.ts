/**
 * Agenda pública de stands (Lun–Jue) para la landing Goya.
 */

export type StandDiaId = 'lun' | 'mar' | 'mie' | 'jue'

export interface StandBloque {
  hora: string
  titulo: string
  detalle?: string
  tipo: 'apertura' | 'actividad' | 'rifa' | 'cierre'
}

export interface StandDia {
  id: StandDiaId
  label: string
  fecha: string
  marca: string
  tema: string
  resumen: string
  bloques: StandBloque[]
  rifas?: boolean
}

export const STAND_PUBLICO: StandDia[] = [
  {
    id: 'lun',
    label: 'Lunes',
    fecha: '21 SEP',
    marca: 'CriptoUNAM',
    tema: 'VR + invitación al hackathon',
    resumen:
      'Stand CriptoUNAM: Realidad Virtual, tracks, registro y por qué entrar a GOYA HACK.',
    bloques: [
      { hora: '10:00', titulo: 'Apertura del stand', tipo: 'apertura' },
      {
        hora: 'Todo el día',
        titulo: 'Realidad Virtual',
        detalle: 'Demo inmersiva + charla corta sobre el hackathon.',
        tipo: 'actividad',
      },
      {
        hora: 'Continuo',
        titulo: 'Invitación al hackathon',
        detalle: 'Tracks, registro y cómo armar equipo.',
        tipo: 'actividad',
      },
    ],
  },
  {
    id: 'mar',
    label: 'Martes',
    fecha: '22 SEP',
    marca: 'Tangem',
    tema: 'Rifas + HackContenido + VR',
    resumen:
      'Stand Tangem con rifas de merch, Realidad Virtual y contenido del track.',
    rifas: true,
    bloques: [
      { hora: '10:00', titulo: 'Apertura stand Tangem', tipo: 'apertura' },
      {
        hora: 'Continuo',
        titulo: 'HackContenido + VR',
        detalle: 'Activa Tangem y explora el track de contenido.',
        tipo: 'actividad',
      },
      {
        hora: '13:00',
        titulo: 'Rifa Tangem 1',
        detalle: '5 ganadores de merch.',
        tipo: 'rifa',
      },
      {
        hora: '16:00',
        titulo: 'Rifa Tangem 2',
        detalle: '5 ganadores de merch.',
        tipo: 'rifa',
      },
    ],
  },
  {
    id: 'mie',
    label: 'Miércoles',
    fecha: '23 SEP',
    marca: 'Tangem',
    tema: 'Rifas + HackContenido + VR',
    resumen: 'Segundo día Tangem: mismas rifas, VR y acompañamiento en contenido.',
    rifas: true,
    bloques: [
      { hora: '10:00', titulo: 'Apertura stand Tangem', tipo: 'apertura' },
      {
        hora: 'Continuo',
        titulo: 'HackContenido + VR',
        tipo: 'actividad',
      },
      {
        hora: '13:00',
        titulo: 'Rifa Tangem 1',
        detalle: '5 ganadores de merch.',
        tipo: 'rifa',
      },
      {
        hora: '16:00',
        titulo: 'Rifa Tangem 2',
        detalle: '5 ganadores de merch.',
        tipo: 'rifa',
      },
    ],
  },
  {
    id: 'jue',
    label: 'Jueves',
    fecha: '24 SEP',
    marca: 'Avalanche',
    tema: 'Info + Realidad Virtual',
    resumen: 'Stand Avalanche: ecosistema, reto L1 y demos de Realidad Virtual.',
    bloques: [
      { hora: '10:00', titulo: 'Apertura stand Avalanche', tipo: 'apertura' },
      {
        hora: 'Continuo',
        titulo: 'Info del ecosistema',
        detalle: 'Reto Avalanche, Fuji / C-Chain y recursos.',
        tipo: 'actividad',
      },
      {
        hora: 'Continuo',
        titulo: 'Realidad Virtual',
        tipo: 'actividad',
      },
    ],
  },
]

export const RIFA_REGLAS = {
  inicio: '10:00',
  horas: ['13:00', '16:00'] as const,
  ganadores: 5,
  requisito:
    'Participan quienes crearon su wallet Tangem y solicitaron la tarjeta digital Tangem.',
}
