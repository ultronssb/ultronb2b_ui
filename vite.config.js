import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import styleX from 'vite-plugin-stylex';

// Capture the mode passed by Vite
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), styleX()],
    server: {
      host: '0.0.0.0',
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
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
});
