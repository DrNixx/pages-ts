import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    publicDir: false,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'pages',
        fileName: () => 'pages.core.js',
        formats: ['umd'],
      },
      outDir: isDev ? 'dist-dev' : 'dist',
      sourcemap: true,
      minify: !isDev,
      rollupOptions: {
        output: {
          exports: 'named',
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
