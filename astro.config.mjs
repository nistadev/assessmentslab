import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxDev: false,
      jsxImportSource: 'react',
    },
    plugins: [tailwindcss()],
  },
});
