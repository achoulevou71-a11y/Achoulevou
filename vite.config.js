import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Achou Levou',
        short_name: 'Achou Levou',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/'
      }
    })
  ]
})
