# Scripts de mantenimiento

No forman parte del build de Vercel. Úsalos desde la raíz del repo o ajustando rutas a `criptounam/public/images`.

| Script | Uso |
|---|---|
| `convert-heic-to-jpg.sh` / `.py` / `convert-batch.sh` | Convertir fotos HEIC |
| `scan-images.js` | Inventario de imágenes |
| `setup-git-lfs.sh` / `migrate-from-lfs.sh` / `remove-lfs-and-optimize.sh` | Git LFS |
| `vercel-build.sh` | Build con LFS (si el proyecto en Vercel lo invoca) |
| `generate-blog-data.mjs` | Datos del newsletter |
| `patch_cursos_v2.cjs`, `test_accents.js` | One-offs |

Imágenes y LFS: [docs/CONVERTIR_IMAGENES.md](../docs/CONVERTIR_IMAGENES.md).
