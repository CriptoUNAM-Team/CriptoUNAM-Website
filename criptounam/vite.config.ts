import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'RESEND_'],
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'wagmi',
      'viem',
      '@privy-io/react-auth',
      '@privy-io/wagmi'
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext'
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp'],
  publicDir: 'public',
  base: '/',
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
      'wagmi',
      'viem',
      '@privy-io/react-auth',
      '@privy-io/wagmi'
    ],
    exclude: ['@reown/appkit']
  },
  // Configuración de servidor para desarrollo
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  // Configuración de preview
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
