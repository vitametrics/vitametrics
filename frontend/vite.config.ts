/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

const loadEnv = (mode, root) => {
  const envPath = path.resolve(root, '../.env'); // Ensure the path points correctly outside your directory
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw result.error;
  }
  return result.parsed;
};

export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};


  return {
    plugins: [react(), viteCompression({
      algorithm: 'brotliCompress',
      filter: (assetFileName) => assetFileName.endsWith('.js') || assetFileName.endsWith('.css'),
    })],
    define: {
      'process.env': process.env
      
    }
  };
});