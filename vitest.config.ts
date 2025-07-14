// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/integration/**/*.spec.ts'],
    environment: 'node', // For Next.js API route tests
    globals: true, // Enables describe, it, expect without imports
    setupFiles: ['./tests/setup.ts'], // Path to setup file
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // Matches tsconfig.test.json
    },
  },
});