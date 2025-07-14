import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // 👈 This makes assets load properly on Vercel
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
