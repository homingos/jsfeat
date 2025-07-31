import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  target: 'es2020',
  platform: 'node',
  external: [],
  noExternal: [],
  banner: {
    js: '// JSFeat Computer Vision Library - TypeScript Wrapper'
  },
  esbuildOptions(options) {
    options.mainFields = ['module', 'main'];
    options.conditions = ['import', 'require', 'default'];
    options.platform = 'node';
    options.resolveExtensions = ['.ts', '.d.ts', '.js', '.mjs'];
  },
  onSuccess: async () => {
    console.log('✅ tsup build completed successfully!');
  }
});
