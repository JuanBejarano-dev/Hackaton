import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fromSrc(''),
      '@atoms': fromSrc('components/atoms'),
      '@molecules': fromSrc('components/molecules'),
      '@organisms': fromSrc('components/organisms'),
      '@templates': fromSrc('components/templates'),
      '@pages': fromSrc('pages'),
      '@hooks': fromSrc('hooks'),
      '@context': fromSrc('context'),
      '@services': fromSrc('services'),
      '@utils': fromSrc('utils'),
    },
  },
});
