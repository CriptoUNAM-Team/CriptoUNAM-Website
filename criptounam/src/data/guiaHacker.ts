/**
 * Contenido de la Guía del Hacker (/hackathon/guia).
 *
 * Todo el texto vive aquí: para actualizar la guía no hace falta tocar la
 * página.
 *
 * Es deliberadamente corta. La versión anterior traía checklist con progreso,
 * filtro por track, índice fijo y comandos listos para copiar, y acababa
 * dictando el proyecto: qué versión de Node, qué plantilla, qué comando de
 * despliegue. Eso ni es una guía ni es lo que se evalúa — el jurado premia lo
 * que el equipo decide. Aquí se responde solo lo que nadie puede averiguar por
 * su cuenta: cómo funciona el evento, qué hay que entregar y cómo se califica.
 * Las decisiones técnicas son del equipo.
 */

import { STELLAR_APEX_GOYA_URL } from './hackathonInfo'

export interface GuiaLink {
  label: string
  url: string
}

export interface GuiaSection {
  id: string
  /** Nombre del icono de Font Awesome soportado en la página (ver ICONS en HackathonGuia). */
  icon: 'rocket' | 'code' | 'upload' | 'microphone' | 'shield' | 'wallet'
  title: string
  /** Un párrafo. Si hace falta más, es que la sección sobra o va en otro sitio. */
  texto: string
}

export const GUIA_SECTIONS: GuiaSection[] = [
  {
    id: 'como-funciona',
    icon: 'rocket',
    title: 'Cómo funciona',
    texto:
      'Todo pasa en este sitio: aquí te registras, formas o te unes a un equipo y entregas tu proyecto. Los equipos son de una a cinco personas y puedes llegar sin equipo. Eliges uno o más tracks (AI, Blockchain, Contenido) y, aparte, el sponsor: en Blockchain son Stellar, Pollar y Avalanche. Puedes cambiarlos hasta el deadline. El evento es híbrido: construyes en el CIA o en línea con los mismos premios.',
  },
  {
    id: 'primer-dia',
    icon: 'rocket',
    title: 'Martes 22 · primer día',
    texto:
      '10:00–11:00 kickoff en el Auditorio Javier Barros Sierra (Edificio Principal de la Facultad). Después del kickoff, el registro es en el CIA de 11:00 a 14:00. A partir de las 14:00 entramos al CIA para armar equipos, generar ideas y empezar a buildear. La jornada del martes cierra a las 17:00.',
  },
  {
    id: 'miercoles',
    icon: 'code',
    title: 'Miércoles en adelante',
    texto:
      'El miércoles abrimos el CIA a las 09:00 (hasta las 17:00): área de hack, mentorías y talleres (Stellar, Pollar, modelo de negocio, Avalanche L1, etc.). Jueves igual, 09:00–17:00. Viernes el CIA abre 09:00–14:00 y la clausura con ganadores es a las 18:00. La entrega en plataforma sigue abierta hasta el domingo 27 a las 23:59 (CDMX).',
  },
  {
    id: 'tangem',
    icon: 'wallet',
    title: 'Requisito Tangem',
    texto:
      'Obligatorio para todas las personas participantes, presenciales y en línea: descarga la app de Tangem desde el enlace de GOYA HACK —criptounam.xyz/hackathon#tangem, donde está el enlace y el QR—, crea tu wallet y activa la tarjeta en línea de TangemPay completando la verificación de identidad. Tiene que ser desde ese enlace: si instalas la app desde la App Store o Google Play la descarga no queda asociada al hackathon y el requisito no cuenta. Hazlo antes del kickoff, que la verificación tarda.',
  },
  {
    id: 'que-llevar',
    icon: 'code',
    title: 'Qué llevar',
    texto:
      'Tu laptop y el entorno que vayas a usar ya instalado: las primeras horas se van rapidísimo y no querrás gastarlas configurando. Si tu proyecto toca contratos, ten una wallet lista con la testnet activada. El stack lo eliges tú; no hay tecnología obligatoria más allá de lo que pida cada track.',
  },
  {
    id: 'equipos',
    icon: 'shield',
    title: 'Condiciones de equipos',
    texto:
      'Equipos de 1 a 5 personas. Una persona solo puede estar en un equipo. Eliges uno o más tracks (AI, Blockchain, Contenido) al crear el equipo o al entregar; puedes cambiarlos hasta el deadline. Todos los integrantes deben estar registrados en la plataforma para optar a premios. El líder administra invitaciones y el proyecto del equipo.',
  },
  {
    id: 'entrega',
    icon: 'upload',
    title: 'Qué se entrega',
    texto:
      `Desde tu panel, antes del domingo 27 a las 23:59 (hora CDMX): repositorio público, un video demo de máximo tres minutos con el producto funcionando, y la descripción del proyecto con sus tracks y su equipo. Si desplegaste algo, agrega la dirección o la URL. Revisa que los enlaces sean públicos: un repo privado no se puede evaluar. Si compites en Stellar, el paso obligatorio extra es subir el mismo proyecto en Stellar Apex, en el hackathon GOYA HACK (${STELLAR_APEX_GOYA_URL}): Stellar elige a los ganadores desde ahí.`,
  },
  {
    id: 'codigo',
    icon: 'code',
    title: 'Código, commits y open source',
    texto:
      'No se permiten commits al repositorio después del deadline (domingo 27 · 23:59 CDMX): el jurado evalúa el estado del repo en ese corte. Sí puedes usar código abierto, librerías, plantillas y asistentes de IA, siempre que lo declares en la descripción del proyecto (qué reutilizaste y de dónde). El trabajo propio del equipo debe construirse durante el hackathon.',
  },
  {
    id: 'pitch',
    icon: 'microphone',
    title: 'El pitch',
    texto:
      'Cinco minutos ante el jurado en el Demo Day. Se califican cuatro ejes con el mismo peso: implementación técnica, innovación, impacto y demo funcional. Enseña el producto funcionando antes de explicar la arquitectura, y ten grabado un plan B por si falla el internet de la sede.',
  },
  {
    id: 'reglas',
    icon: 'shield',
    title: 'Reglas',
    texto:
      'Un proyecto por equipo y un equipo por persona. Declara dependencias y código reutilizado. Cero tolerancia al acoso, en la sede y en los canales. Incumplir el deadline de commits o entregar un repo privado deja el proyecto fuera de evaluación.',
  },
]

/**
 * Enlaces útiles, en un solo bloque al final.
 *
 * Van juntos y sin instrucciones alrededor a propósito: son puntos de partida
 * para quien los necesite, no un camino a seguir.
 */
export const GUIA_RECURSOS: GuiaLink[] = [
  { label: 'Calendario Luma · GOYA HACK', url: 'https://luma.com/goyahack' },
  { label: 'Docs Stellar / Soroban', url: 'https://developers.stellar.org/' },
  { label: 'Stellar Apex · GOYA HACK', url: STELLAR_APEX_GOYA_URL },
  { label: 'Avalanche Builder Hub', url: 'https://build.avax.network/?ref=WHXSX' },
  { label: 'Docs de Avalanche', url: 'https://build.avax.network/docs' },
  { label: 'Faucet Fuji (testnet)', url: 'https://faucet.avax.network/' },
  { label: 'Pollar', url: 'https://www.pollar.xyz/' },
  { label: 'Core Wallet', url: 'https://core.app/' },
  { label: 'Vercel AI SDK', url: 'https://ai-sdk.dev/docs' },
]

/** Canal de dudas durante el evento (antes vivía en el foro del sitio). */
export const GUIA_SOPORTE = {
  telegram: 'https://t.me/+US3WLlw1uuU0ZjUx',
  descripcion:
    'Dudas técnicas, mentorías y anuncios durante el hackathon se resuelven en el Telegram de CriptoUNAM y en la sección de Dudas del sitio.',
}
