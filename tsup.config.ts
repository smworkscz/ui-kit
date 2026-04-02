import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // Generate .d.ts files
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'], // Exclude React from the bundle
  minify: true,
  treeshake: true,
});
