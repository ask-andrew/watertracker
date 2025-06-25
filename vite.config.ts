import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/watertracker/', // Set base path for GitHub Pages
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          // Update alias if src directory is now the primary source root
          // For now, keeping simple '@' as project root, specific imports use relative paths or 'src/'
        }
      },
      build: {
        outDir: 'dist', // Default, but good to be explicit
      }
    };
});
