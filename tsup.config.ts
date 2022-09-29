import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: ['src/index.ts'],
    splitting: false,
    target: 'esnext',
    format: ['esm', 'cjs'],
    clean: true,
    minify: false,
    dts: true,
    bundle: true,
    skipNodeModulesBundle: true,
})
