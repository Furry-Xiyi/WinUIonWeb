import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    // XAML-style bindings inside controls read the component setup state.
    features: { prodDevtools: true }
  })],
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'system-accent-color': fileURLToPath(new URL('./src/systemAccentColor.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue', 'mathlive/ssr', 'rtf.js'],
      output: { exports: 'named' }
    }
  }
})
