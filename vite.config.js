import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import styleX from 'vite-plugin-stylex';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), styleX(), , visualizer()],
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        '@mantine/core',           // Added Mantine
        '@tabler/icons-react',     // Added Tabler 
        'mantine-react-table'
      ],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
