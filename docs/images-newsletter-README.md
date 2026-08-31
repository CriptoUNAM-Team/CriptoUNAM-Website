# Imágenes del Newsletter / Blog

Todas las fotos e ilustraciones de las **notas de blog** van en `public/images/newsletter/`. El sitio las sirve desde esa carpeta para que se vean igual en local y en Vercel.

## Regla de nombres

- **Nombre del archivo = `id` de la entrada + extensión**
- El `id` es el que usas en `src/data/newsletterData.ts` y en la URL: `/newsletter/<id>`
- Extensiones válidas: `.jpg`, `.jpeg`, `.png`, `.webp`

Ejemplos:

| id de la entrada        | Archivo a colocar aquí                    |
|-------------------------|-------------------------------------------|
| `intro-blockchain-2024` | `intro-blockchain-2024.jpg` o `.png`      |
| `recap-hackathon-2025`  | `recap-hackathon-2025.png`                |
| `mi-nueva-nota`         | `mi-nueva-nota.jpg`                       |

## Cómo publicar una nota nueva (Community Manager / Agente)

1. **Añade la imagen** en `public/images/newsletter/` con el nombre que será el `id` de la entrada (ej. `mi-nueva-nota.png`).
2. **Edita** `src/data/newsletterData.ts` y agrega un objeto al array `newsletterData`:
   - `id`: mismo nombre que el archivo (sin extensión), en minúsculas y con guiones (ej. `mi-nueva-nota`).
   - `imagen`: `'/images/newsletter/mi-nueva-nota.png'` (misma ruta que el archivo).
   - `titulo`, `autor`, `fecha`, `contenido`, `tags` según la nota.
3. **Commit y push** (o abre un PR). Tras el deploy en Vercel, la nota y la imagen se verán en el sitio.

Ver también: [GUIA_NEWSLETTER_AGENTE.md](GUIA_NEWSLETTER_AGENTE.md) (guía paso a paso para el agente / Community Manager).

---

## Nota para deploy en Vercel

Todas las imágenes del newsletter deben estar **solo en** `public/images/newsletter/`. Si antes había fotos en `public/images/` (p. ej. `ethereum-verge.png`, `hackathon-2025.png`), ya están copiadas ahí con los nombres que usa cada entrada. Así el sitio muestra las fotos igual en local y en Vercel.
