import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { localApiPlugin } from './plugins/local-api';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), localApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['react-tilt'],
      exclude: ['lucide-react'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost:3000/',
        },
      },
      setupFiles: ['./src/test-setup.ts'],
      css: false,
    },
  };
});
