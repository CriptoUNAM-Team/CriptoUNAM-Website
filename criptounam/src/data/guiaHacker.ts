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

export interface GuiaLink {
  label: string
  url: string
}

export interface GuiaSection {
  id: string
  /** Nombre del icono de Font Awesome soportado en la página (ver ICONS en HackathonGuia). */
  icon: 'rocket' | 'code' | 'upload' | 'microphone' | 'shield'
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
      'Todo pasa en este sitio: aquí te registras, formas o te unes a un equipo y entregas tu proyecto. Los equipos son de una a cinco personas y puedes llegar sin equipo — en la inauguración hay dinámica para formarlos. Eliges un track al registrarte y puedes cambiarlo hasta el momento de la entrega.',
  },
  {
    id: 'que-llevar',
    icon: 'code',
    title: 'Qué llevar',
    texto:
      'Tu laptop y el entorno que vayas a usar ya instalado: las primeras horas se van rapidísimo y no querrás gastarlas configurando. Si tu proyecto toca contratos, ten una wallet lista con la testnet activada. El stack lo eliges tú; no hay tecnología obligatoria más allá de lo que pida cada track.',
  },
  {
    id: 'entrega',
    icon: 'upload',
    title: 'Qué se entrega',
    texto:
      'Desde tu panel, antes del cierre: repositorio público, un video demo de máximo tres minutos con el producto funcionando, y la descripción del proyecto con su track y su equipo. Si desplegaste algo, agrega la dirección o la URL. Revisa que los enlaces sean públicos: un repo privado no se puede evaluar.',
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
      'El código se escribe durante el hackathon. Puedes apoyarte en librerías, plantillas y asistentes de IA, pero declara lo que reutilizas. Un proyecto por equipo y un equipo por persona, y todos sus integrantes registrados en la plataforma para poder recibir premio. Cero tolerancia al acoso, en la sede y en los canales.',
  },
]

/**
 * Enlaces útiles, en un solo bloque al final.
 *
 * Van juntos y sin instrucciones alrededor a propósito: son puntos de partida
 * para quien los necesite, no un camino a seguir.
 */
export const GUIA_RECURSOS: GuiaLink[] = [
  { label: 'Avalanche Builder Hub', url: 'https://build.avax.network/?ref=WHXSX' },
  { label: 'Docs de Avalanche', url: 'https://build.avax.network/docs' },
  { label: 'Faucet Fuji (testnet)', url: 'https://faucet.avax.network/' },
  { label: 'Core Wallet', url: 'https://core.app/' },
  { label: 'Vercel AI SDK', url: 'https://ai-sdk.dev/docs' },
]

/** Canal de dudas durante el evento (antes vivía en el foro del sitio). */
export const GUIA_SOPORTE = {
  telegram: 'https://t.me/+US3WLlw1uuU0ZjUx',
  descripcion:
    'Dudas técnicas, mentorías y anuncios durante el hackathon se resuelven en el Telegram de CriptoUNAM y en la sección de Dudas del sitio.',
}
