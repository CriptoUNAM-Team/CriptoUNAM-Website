#!/bin/bash
set -e

echo "🚀 Iniciando build para Vercel..."

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/criptounam" || exit 1

echo "📦 Instalando dependencias..."
npm install

echo "🔧 Verificando Git LFS..."
if command -v git-lfs &> /dev/null || command -v git lfs &> /dev/null; then
  echo "✅ Git LFS está disponible"
  git lfs install || echo "⚠️ git lfs install falló, continuando..."

  echo "📥 Descargando archivos de Git LFS..."
  git lfs pull || {
    echo "⚠️ git lfs pull falló"
    echo "📋 Verificando si hay archivos LFS..."
    git lfs ls-files | head -5 || echo "No se encontraron archivos LFS"
  }
else
  echo "⚠️ Git LFS no está disponible en este entorno"
  echo "📋 Verificando archivos en public/images..."
  ls -la public/images/ | head -10 || echo "No se encontraron archivos en public/images"
fi

echo "🏗️ Compilando TypeScript..."
npm run type-check || echo "⚠️ Type check falló, continuando..."

echo "🔨 Construyendo aplicación..."
npm run build

echo "✅ Build completado!"
echo "📊 Verificando archivos de salida..."
ls -la dist/ | head -10
