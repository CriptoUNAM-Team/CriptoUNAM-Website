#!/bin/bash

# Script para convertir todas las imágenes HEIC a JPG
# Usa sips (herramienta nativa de macOS)

echo "🔄 Convirtiendo imágenes HEIC a JPG..."

# Directorio base de imágenes
IMAGES_DIR="$(cd "$(dirname "$0")/.." && pwd)/criptounam/public/images"

# Contador
converted=0
skipped=0
errors=0

# Función para convertir un archivo
convert_file() {
    local file="$1"
    local dir=$(dirname "$file")
    local filename=$(basename "$file")
    local name_without_ext="${filename%.*}"
    local jpg_file="$dir/$name_without_ext.jpg"
    
    # Si ya existe el JPG, saltar
    if [ -f "$jpg_file" ]; then
        echo "⏭️  Ya existe: $jpg_file"
        ((skipped++))
        return
    fi
    
    # Intentar convertir usando diferentes métodos
    success=false
    
    # Método 1: ImageMagick (magick) - mejor soporte para HEIC
    if command -v magick &> /dev/null; then
        if magick "$file" -quality 90 "$jpg_file" 2>/dev/null; then
            if [ -f "$jpg_file" ] && [ -s "$jpg_file" ]; then
                success=true
            fi
        fi
    fi
    
    # Método 2: sips con formato explícito (fallback)
    if [ "$success" = false ] && command -v sips &> /dev/null; then
        if sips -s format jpeg -s formatOptions 100 "$file" --out "$jpg_file" 2>/dev/null; then
            if [ -f "$jpg_file" ] && [ -s "$jpg_file" ]; then
                success=true
            fi
        fi
    fi
    
    if [ "$success" = true ]; then
        echo "✅ Convertido: $file -> $jpg_file"
        ((converted++))
    else
        echo "❌ Error al convertir: $file"
        ((errors++))
    fi
}

# Buscar y convertir todos los archivos HEIC
find "$IMAGES_DIR" -type f \( -iname "*.heic" -o -iname "*.HEIC" -o -iname "*.heif" -o -iname "*.HEIF" \) | while read -r file; do
    convert_file "$file"
done

echo ""
echo "📊 Resumen:"
echo "   ✅ Convertidos: $converted"
echo "   ⏭️  Omitidos (ya existen): $skipped"
echo "   ❌ Errores: $errors"
echo ""
echo "✨ Conversión completada!"

