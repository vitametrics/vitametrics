import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression';
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env');
const envConfig = dotenv.config({ path: envPath });
if (envConfig.error) {
  throw envConfig.error; 
}

Object.assign(process.env, envConfig.parsed);

export default defineConfig({
  plugins: [react(),viteCompression({
    algorithm: 'brotliCompress',
    filter: (assetFileName) => assetFileName.endsWith('.js') || assetFileName.endsWith('.css'),
  })],
})
