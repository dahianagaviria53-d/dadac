import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: Cambia 'dadac' por el nombre exacto de tu repositorio en GitHub
// Ejemplo: si tu repo se llama "mi-juego-mat", pon base: '/mi-juego-mat/'
export default defineConfig({
  plugins: [react()],
  base: '/dadac/',
})
