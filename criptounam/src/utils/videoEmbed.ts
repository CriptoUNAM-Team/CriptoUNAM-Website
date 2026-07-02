/**
 * Normaliza URLs de video a su forma "embed" para usar en <iframe>.
 *
 * Acepta cualquier formato común de YouTube/Vimeo (watch, youtu.be, shorts,
 * embed, vimeo.com/ID) y devuelve la URL embebible. Si no reconoce el patrón
 * (p. ej. un .mp4 directo u otra plataforma), devuelve la URL tal cual.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return url

  // Archivos de video directos: no se embeben, se reproducen con <video>.
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return url

  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube: youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname.startsWith('/embed/')) return url
      const watchId = u.searchParams.get('v')
      if (watchId) return `https://www.youtube.com/embed/${watchId}`
      const shortsMatch = u.pathname.match(/^\/shorts\/([^/]+)/)
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`
    }

    // Vimeo: vimeo.com/ID -> player.vimeo.com/video/ID
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }
  } catch {
    /* URL malformada: la devolvemos tal cual */
  }

  return url
}
