import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 8080,
  },
  build: {
    target: 'esnext',
    minify: false,
  },
  esbuild: {
    jsx: 'automatic',
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      name: 'vite-plugin-node',
      buildStart() {
        // You can add additional logic here if needed
      }
    }
  ]
});
