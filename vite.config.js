import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import styleX from 'vite-plugin-stylex';

export default defineConfig({
  plugins: [react(), styleX()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
})
