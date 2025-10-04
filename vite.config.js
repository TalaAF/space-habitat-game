// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/space-habitat-game/',   // 🔴 required for GitHub Project Pages
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'docs',               // 🔴 build into /docs on main
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
