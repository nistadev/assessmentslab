import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/icon-maskable.svg'],
      manifest: {
        name: 'AssesLab',
        short_name: 'AssesLab',
        description: 'Practise software engineering assessments at your own pace.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0b1020',
        theme_color: '#0b1020',
        icons: [
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icons/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/',
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxDev: false,
      jsxImportSource: 'react',
    },
    plugins: [tailwindcss()],
  },
});
