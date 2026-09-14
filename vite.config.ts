import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this as a project site under /basketball/; Netlify serves it from
  // the domain root. The Pages workflow sets VITE_BASE_PATH; everywhere else defaults to '/'.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
