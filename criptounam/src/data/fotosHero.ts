/**
 * Fotos del círculo de la portada (entre CRIPTO y UNAM).
 *
 * Miniaturas cuadradas de 360 px en public/images/hero/, sacadas de las
 * carpetas de cada mes (public/images/<MES>_CRIPTOUNAM). Para añadir más,
 * recorta la foto en cuadrado, guárdala como `<mes>-NN.jpg` y sube el número
 * del mes aquí. Enero, junio y diciembre tienen pocas porque es todo lo que
 * hay en sus carpetas.
 */
const POR_MES: [mes: string, cantidad: number][] = [
  ['enero', 5],
  ['febrero', 11],
  ['marzo', 11],
  ['abril', 11],
  ['mayo', 12],
  ['junio', 3],
  ['julio', 11],
  ['agosto', 10],
  ['septiembre', 11],
  ['octubre', 11],
  ['noviembre', 10],
  ['diciembre', 2],
]

const EMBLEMA = '/images/emblema-criptounam.png'
/** Cada cuántas fotos vuelve a salir el puma. */
const CADA = 10

export type FotoHero = { src: string; foto: boolean }

/**
 * Se reparten en ronda (una de cada mes, luego la segunda de cada mes…) para
 * que el círculo pase por todo el año en vez de quedarse en un mes seguido.
 */
function armar(): FotoHero[] {
  const listas = POR_MES.map(([mes, n]) =>
    Array.from({ length: n }, (_, k) => `/images/hero/${mes}-${String(k + 1).padStart(2, '0')}.jpg`)
  )
  const fotos: string[] = []
  const max = Math.max(...listas.map((l) => l.length))
  for (let r = 0; r < max; r++) for (const l of listas) if (l[r]) fotos.push(l[r])

  const salida: FotoHero[] = [{ src: EMBLEMA, foto: false }]
  fotos.forEach((src, k) => {
    salida.push({ src, foto: true })
    if ((k + 1) % CADA === 0) salida.push({ src: EMBLEMA, foto: false })
  })
  return salida
}

export const FOTOS_HERO = armar()
