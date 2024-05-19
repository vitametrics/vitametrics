/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

const loadEnv = (mode, root) => {
  const envPath = path.resolve(__dirname, '../.env');
  const env = dotenv.config({ path: envPath }).parsed;
  const envWithPrefix = Object.keys(env).reduce((acc, key) => {
    if (key.startsWith('VITE_')) {
      acc[key] = env[key];
    }
    return acc;
  }, {});
  return envWithPrefix;
};

export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    plugins: [react(), viteCompression({
      algorithm: 'brotliCompress',
      filter: (assetFileName) => assetFileName.endsWith('.js') || assetFileName.endsWith('.css'),
    })],
    define: {
      'import.meta.env': env
    }
  };
});
