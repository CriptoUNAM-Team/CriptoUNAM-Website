# Build en Vercel

Si en **Vercel** el comando de build está configurado como:

```bash
node scripts/generate-blog-data.mjs && tsc -b && vite build
```

ese script **no debe sobrescribir** el archivo `src/data/newsletterData.ts`.

Las entradas del newsletter viven en ese archivo (con tipo `NewsletterEntryItem`: `titulo`, `contenido`, `autor`, `fecha`, `imagen`). Si el script genera o reemplaza ese archivo con otro formato (por ejemplo `NewsletterEntry` con `title`, `content`, `date`, `author`), el build fallará.

**Opciones:**

1. **Recomendado:** Usar solo `tsc -b && vite build` en el comando de build de Vercel (igual que en `package.json`).
2. Si necesitas el script para `blog-posts.json`: modificar `generate-blog-data.mjs` para que solo genere `blog-posts.json` y **no toque** `src/data/newsletterData.ts`.
