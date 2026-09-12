import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://bojankocijan.github.io/basketball/ as a GitHub Pages project site.
  base: '/basketball/',
  plugins: [react(), tailwindcss()],
})
