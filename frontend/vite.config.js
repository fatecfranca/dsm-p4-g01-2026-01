import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'https://dsm-p4-g01-2026-01.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
