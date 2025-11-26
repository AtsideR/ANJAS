import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    // disable automatic pwa asset generator to avoid requiring
    // @vite-pwa/assets-generator / sharp during dev installs
    pwaAssets: {
      disabled: true,
      config: false,
    },

    manifest: {
      name: 'Project-Anjas',
      short_name: 'Project-Anjas',
      description: 'antar jemput dan jasa titip',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'], 
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
  server: {
    proxy: {
      // proxy /api requests to the remote API to avoid CORS during development
      '/api': {
        target: 'https://api-anjas.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})