#!/bin/bash

# Script para configurar Git LFS y migrar las imágenes

echo "🚀 Configurando Git LFS..."

# Verificar que Git LFS esté instalado
if ! command -v git-lfs &> /dev/null; then
    echo "❌ Git LFS no está instalado."
    echo "📦 Instálalo con: brew install git-lfs"
    echo "   O descarga desde: https://git-lfs.github.com/"
    exit 1
fi

echo "✅ Git LFS está instalado"

# Inicializar Git LFS
echo "📝 Inicializando Git LFS..."
git lfs install

# El .gitattributes ya está creado, solo agregarlo
echo "📋 Agregando .gitattributes..."
git add .gitattributes

# Migrar las imágenes existentes a LFS
echo "🔄 Migrando imágenes existentes a Git LFS..."
git lfs migrate import --include="*.HEIC,*.heic,*.JPG,*.jpg,*.PNG,*.png,*.HEIF,*.heif,*.MOV,*.mov" --everything

# Hacer commit de los cambios
echo "💾 Haciendo commit de la configuración..."
git commit -m "Configure Git LFS for images"

echo "✅ Git LFS configurado correctamente!"
echo ""
echo "📤 Ahora puedes hacer push con:"
echo "   git push origin main"
echo ""
echo "⚠️  Nota: El primer push con LFS puede tardar un poco, pero será más rápido que sin LFS"

