#!/bin/bash

# Script para migrar imágenes de Git LFS a Git normal
# Ejecuta este script desde la raíz del proyecto

set -e

echo "🔄 Migrando imágenes de Git LFS a Git normal..."
echo ""

# 1. Descargar archivos reales de LFS
echo "📥 Paso 1: Descargando archivos reales de Git LFS..."
git lfs pull || echo "⚠️ Algunos archivos LFS no se pudieron descargar (continuando...)"

# 2. Remover JPG/PNG del tracking de LFS
echo ""
echo "🗑️ Paso 2: Removiendo JPG/PNG del tracking de Git LFS..."
git lfs untrack "*.jpg" 2>/dev/null || true
git lfs untrack "*.JPG" 2>/dev/null || true
git lfs untrack "*.png" 2>/dev/null || true
git lfs untrack "*.PNG" 2>/dev/null || true
git lfs untrack "*.jpeg" 2>/dev/null || true
git lfs untrack "*.JPEG" 2>/dev/null || true

echo "✅ Archivos removidos del tracking de LFS"

# 3. Agregar .gitattributes actualizado
echo ""
echo "📝 Paso 3: Agregando .gitattributes actualizado..."
git add .gitattributes

# 4. Agregar todas las imágenes a Git normal
echo ""
echo "📦 Paso 4: Agregando imágenes a Git normal..."
git add criptounam/public/images/

# 5. Verificar estado
echo ""
echo "📊 Estado actual:"
git status --short | head -20

echo ""
echo "✅ Migración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Revisa los cambios con: git status"
echo "   2. Haz commit: git commit -m 'Remove JPG/PNG from Git LFS, use normal Git'"
echo "   3. Push: git push"
echo ""
echo "⚠️  Nota: El push puede tardar si hay muchas imágenes,"
echo "   pero después funcionará perfectamente en Vercel sin Git LFS."

