import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * Solo `VITE_`. Antes esto incluía `RESEND_`, lo que habría inyectado
   * `RESEND_API_KEY` en el bundle del cliente: una clave de envío de correo
   * queda expuesta a cualquiera que abra las herramientas del navegador. Las
   * credenciales de Resend viven en el servidor (api/), no aquí.
   */
  envPrefix: ['VITE_'],
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // @wagmi/connectors importa esto dinámicamente para WalletConnect, que
      // aquí no se usa y no está instalado. Sin el alias, Vite no resuelve el
      // import y la app no arranca en desarrollo.
      '@reown/appkit/core': path.resolve(__dirname, './src/stubs/reown-appkit.ts'),
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
    target: 'esnext',
    rollupOptions: {
      output: {
        /**
         * Solo se agrupan React y las librerías de gráficas.
         *
         * `@privy-io` queda deliberadamente fuera: trae su propio code
         * splitting (pantallas de onramp, teléfono, etc. cargan bajo demanda) y
         * agruparlo a mano fusionaba todos esos chunks en uno de 1159 KB gzip
         * que el usuario descargaba entero aunque nunca abriera el modal.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) {
            return 'react-vendor'
          }
          if (/[\\/]node_modules[\\/](recharts|d3-)/.test(id)) {
            return 'charts-vendor'
          }
        },
      },
    },
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
    // El alias de arriba se encarga de @reown/appkit; excluirlo aquí no evitaba
    // que Vite intentara resolver el import y rompía el arranque en dev.
    exclude: []
  },
  /**
   * En desarrollo NO se cachea. Antes mandaba `max-age=31536000`, así que el
   * navegador guardaba los módulos de dev durante un año: al reiniciar Vite o
   * limpiar `node_modules/.vite`, seguía pidiendo chunks que ya no existían y
   * la app no arrancaba hasta vaciar la caché a mano.
   */
  server: {
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  // Configuración de preview
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
})
