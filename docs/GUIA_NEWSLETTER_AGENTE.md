# Guía para publicar notas en el Newsletter (Community Manager / Agente)

Esta guía está pensada para el **agente Community Manager** de CriptoUNAM (cuenta Git y X propias). Sigue estos pasos para publicar una nota en el blog sin tocar nada más del sitio.

---

## Resumen en 3 pasos

1. **Añadir la imagen** en la carpeta de newsletter.
2. **Añadir la entrada** en el archivo de datos.
3. **Commit, push y (opcional) PR.**

---

## Paso 1: Imagen de la nota

- **Carpeta:** `public/images/newsletter/`
- **Nombre del archivo:** debe ser exactamente el **id** de la entrada (que elegirás en el paso 2) + extensión.
  - Ejemplo: si el id será `nueva-charla-defi-2025`, el archivo debe llamarse `nueva-charla-defi-2025.jpg` o `nueva-charla-defi-2025.png`.
- **Formatos válidos:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Recomendado:** 1200×630 px o similar (16:9) para que se vea bien en redes y en la página.

Regla: **un archivo por nota, nombre = id de la nota.**

---

## Paso 2: Entrada en el código

- **Archivo:** `src/data/newsletterData.ts`
- **Qué hacer:** añadir un **nuevo objeto** al array `newsletterData` (por ejemplo al inicio, para que salga como “última entrada”).

### Plantilla de entrada

```ts
{
  id: 'tu-id-en-minusculas-con-guiones',
  titulo: 'Título que se verá en la web',
  autor: 'CriptoUNAM',
  fecha: 'YYYY-MM-DD',
  imagen: '/images/newsletter/tu-id-en-minusculas-con-guiones.jpg',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  contenido: `Texto de la nota.

Puedes usar varias líneas.

Cada párrafo separado por línea en blanco.`
}
```

### Campos obligatorios

| Campo    | Descripción |
|----------|-------------|
| `id`     | Identificador único, solo minúsculas y guiones (ej. `mi-nota-enero-2025`). Es la URL: `/newsletter/mi-nota-enero-2025` |
| `titulo` | Título que se muestra en listado y en la entrada |
| `autor`  | Quien firma la nota (ej. `CriptoUNAM`, `Comunidad CriptoUNAM`) |
| `fecha`  | Fecha en formato `YYYY-MM-DD` (ej. `2025-01-15`) |
| `imagen` | Siempre `'/images/newsletter/' + id + extensión` (ej. `'/images/newsletter/mi-nota-enero-2025.jpg'`) |
| `contenido` | Texto completo de la nota (puede ser largo, con párrafos) |

### Campo opcional

| Campo  | Descripción |
|--------|-------------|
| `tags` | Array de strings (ej. `['Blockchain', 'Eventos']`) para filtros en la página |

### Importante

- El **id** debe ser único y no cambiar (es la URL de la nota).
- La ruta de **imagen** debe coincidir con el archivo que pusiste en `public/images/newsletter/`.

---

## Paso 3: Subir cambios

- Haz **commit** de:
  - El archivo nuevo en `public/images/newsletter/<id>.<ext>`
  - Los cambios en `src/data/newsletterData.ts`
- Haz **push** a la rama correspondiente (o abre un **Pull Request** si usas flujo de revisión).

Tras el deploy en Vercel, la nota y la imagen se verán en el sitio (incluida la imagen en producción).

---

## Checklist rápido

- [ ] Imagen en `public/images/newsletter/<id>.<ext>`
- [ ] Objeto nuevo en `newsletterData` en `src/data/newsletterData.ts`
- [ ] `id` sin espacios, en minúsculas, con guiones
- [ ] `imagen`: `'/images/newsletter/<id>.<ext>'`
- [ ] `fecha` en formato `YYYY-MM-DD`
- [ ] Commit + push (o PR)

---

## Si las imágenes no se ven en Vercel

- Todas las imágenes del newsletter deben estar **solo** en `public/images/newsletter/`.
- Si antes tenías fotos en `public/images/` (por ejemplo `ethereum-verge.png`, `hackathon-2025.png`), **cópialas o muévelas** a `public/images/newsletter/` con el nombre que usa cada entrada en `newsletterData` (ej. `ethereum-verge-upgrade.png`, `recap-hackathon-2025.png`).
- Asegúrate de que esos archivos estén en el repositorio (no en `.gitignore`) y que hagas commit de ellos.

---

## Referencia de ids actuales (para no repetir)

Puedes revisar en `src/data/newsletterData.ts` los `id` que ya existen. Algunos actuales: `intro-blockchain-2024`, `fundamentos-blockchain-2024`, `defi-fundamentals-workshop`, `intro-smart-contracts-solidity`, `bitcoin-day-2024`, `frontend-dapps-web3`, `ethereum-verge-upgrade`, `recap-hackathon-2025`, `defi-regulation-2025`, `year-review-2025`, `trends-watch-2026`.

No uses un `id` que ya exista para una entrada nueva.
