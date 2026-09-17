/**
 * Exportar eventos a calendario: archivo `.ics` y enlaces de Google / Outlook.
 *
 * Sin dependencias: un `.ics` es texto plano con un formato muy acotado
 * (RFC 5545) y las dos webs de calendario aceptan el evento por query string.
 * Traer una librería para esto costaría más que las ~120 líneas que ocupa.
 */

export interface EventoCalendario {
  /** Identificador estable del evento. Si se reimporta, el calendario actualiza en vez de duplicar. */
  uid: string
  titulo: string
  descripcion?: string
  /** Texto del lugar: la sede física, o el nombre del canal si es en línea. */
  lugar?: string
  /** Enlace que se adjunta al evento (transmisión, panel, mapa). */
  url?: string
  inicio: Date
  fin: Date
}

/** `YYYYMMDDTHHMMSSZ` — la única forma de fecha que se usa aquí, siempre en UTC. */
const utc = (d: Date): string => `${d.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`

/** `YYYYMMDDTHHMMSSZ` sin separadores, que es lo que espera Google Calendar. */
const google = utc

/**
 * Escapa los cuatro caracteres con significado propio en un valor de campo.
 * El orden importa: la barra invertida se escapa primero o se duplicarían las
 * barras que introducen las demás sustituciones.
 */
const escapar = (texto: string): string =>
  texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

/**
 * Plegado de líneas a 75 octetos (RFC 5545 §3.1).
 *
 * Outlook y algunos clientes de escritorio descartan el evento entero si una
 * línea se pasa, así que se corta contando *bytes* en UTF-8 y no caracteres:
 * las tildes y el `·` de los títulos ocupan dos, y cortar por caracteres dejaba
 * líneas de más de 75 octetos en los títulos largos.
 */
const plegar = (linea: string): string => {
  const bytes = new TextEncoder().encode(linea)
  if (bytes.length <= 75) return linea

  const partes: string[] = []
  let actual = ''
  let cuenta = 0
  // La primera línea admite 75 octetos; las continuaciones llevan un espacio
  // inicial que también cuenta, así que solo les quedan 74.
  let limite = 75

  for (const caracter of linea) {
    const ancho = new TextEncoder().encode(caracter).length
    if (cuenta + ancho > limite) {
      partes.push(actual)
      actual = ''
      cuenta = 0
      limite = 74
    }
    actual += caracter
    cuenta += ancho
  }
  if (actual) partes.push(actual)

  return partes.join('\r\n ')
}

const campo = (clave: string, valor: string): string => plegar(`${clave}:${escapar(valor)}`)

/**
 * Serializa uno o varios eventos como calendario `.ics`.
 *
 * `nombre` es el rótulo con el que el calendario muestra la importación
 * (X-WR-CALNAME); los clientes que no lo entienden simplemente lo ignoran.
 */
export const construirICS = (eventos: EventoCalendario[], nombre = 'Goya Hack'): string => {
  const sello = utc(new Date())

  const lineas: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CriptoUNAM//Goya Hack//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    campo('X-WR-CALNAME', nombre),
    'X-WR-TIMEZONE:America/Mexico_City',
  ]

  for (const evento of eventos) {
    lineas.push(
      'BEGIN:VEVENT',
      `UID:${evento.uid}`,
      `DTSTAMP:${sello}`,
      `DTSTART:${utc(evento.inicio)}`,
      `DTEND:${utc(evento.fin)}`,
      campo('SUMMARY', evento.titulo)
    )
    if (evento.descripcion) lineas.push(campo('DESCRIPTION', evento.descripcion))
    if (evento.lugar) lineas.push(campo('LOCATION', evento.lugar))
    if (evento.url) lineas.push(campo('URL', evento.url))
    lineas.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      campo('DESCRIPTION', evento.titulo),
      'END:VALARM',
      'END:VEVENT'
    )
  }

  lineas.push('END:VCALENDAR')
  // CRLF obligatorio: con \n suelto, Outlook rechaza el archivo.
  return `${lineas.join('\r\n')}\r\n`
}

/** Descarga el `.ics` en el navegador. Devuelve `false` si no hay DOM (SSR). */
export const descargarICS = (
  eventos: EventoCalendario[],
  archivo: string,
  nombre?: string
): boolean => {
  if (typeof document === 'undefined' || eventos.length === 0) return false

  const blob = new Blob([construirICS(eventos, nombre)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = archivo.endsWith('.ics') ? archivo : `${archivo}.ics`
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  // Se libera en el siguiente tick: revocar de inmediato cancela la descarga
  // en Safari, que todavía no ha leído el blob cuando vuelve el click().
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

/** El cuerpo del evento: descripción + enlace, que es lo que se ve en el calendario. */
const cuerpo = (evento: EventoCalendario): string =>
  [evento.descripcion, evento.url].filter(Boolean).join('\n\n')

export const urlGoogleCalendar = (evento: EventoCalendario): string => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: evento.titulo,
    dates: `${google(evento.inicio)}/${google(evento.fin)}`,
    ctz: 'America/Mexico_City',
  })
  const detalles = cuerpo(evento)
  if (detalles) params.set('details', detalles)
  if (evento.lugar) params.set('location', evento.lugar)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const urlOutlookCalendar = (evento: EventoCalendario): string => {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: evento.titulo,
    startdt: evento.inicio.toISOString(),
    enddt: evento.fin.toISOString(),
  })
  const detalles = cuerpo(evento)
  if (detalles) params.set('body', detalles)
  if (evento.lugar) params.set('location', evento.lugar)
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/** Nombre de archivo seguro a partir de un título con tildes, puntos y `·`. */
export const nombreArchivo = (texto: string): string =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'evento'
