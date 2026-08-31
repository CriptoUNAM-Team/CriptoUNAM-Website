# 📸 Guía para Convertir Imágenes HEIC a JPG

## Problema
Los archivos HEIC no se pueden mostrar directamente en navegadores web. Necesitan convertirse a JPG o PNG.

## Solución

### Opción 1: Script Automático (Recomendado)

Ejecuta el script Python desde la terminal:

```bash
python3 scripts/convert-heic-to-jpg.py
```

Este script:
- ✅ Convierte automáticamente todos los archivos HEIC/HEIF a JPG
- ✅ Mantiene el mismo nombre (solo cambia la extensión)
- ✅ Calidad 90% (buena calidad, tamaño razonable)
- ✅ Omite archivos que ya están convertidos

### Opción 2: Conversión Manual con macOS

Si el script no funciona, puedes usar la herramienta nativa de macOS:

```bash
# Convertir un archivo individual
sips -s format jpeg imagen.HEIC --out imagen.jpg

# Convertir todos los archivos HEIC en una carpeta
for file in *.HEIC; do
    sips -s format jpeg "$file" --out "${file%.HEIC}.jpg"
done
```

### Opción 3: Usar la App Fotos de macOS

1. Abre la app **Fotos**
2. Selecciona las imágenes HEIC
3. Archivo → Exportar → Exportar [X] fotos
4. Formato: JPEG
5. Guarda en la carpeta correspondiente

## Nota Importante

Una vez convertidos los archivos, el código automáticamente:
- ✅ Buscará las versiones JPG de los archivos HEIC
- ✅ Las mostrará en la galería
- ✅ No necesitas cambiar el código

## Verificar Conversión

Para ver cuántos archivos se han convertido:

```bash
# Contar archivos JPG
find public/images -name "*.jpg" -o -name "*.JPG" | wc -l

# Ver archivos HEIC pendientes
find public/images -name "*.heic" -o -name "*.HEIC" | wc -l
```
