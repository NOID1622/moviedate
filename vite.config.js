import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // opsional
      manifest: {
        name: 'MovieDate',
        short_name: 'MovieDate',
        description: 'Our Couple Watchlist & Review',
        theme_color: '#0f0f1a',
        background_color: '#0f0f1a',
        display: 'standalone', // 👈 Ini yang membuatnya tampil full screen tanpa URL bar seperti aplikasi asli
        icons: [
          {
            src: '/logo.png', // 👈 Pastikan Anda punya gambar logo.png di folder "public"
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})