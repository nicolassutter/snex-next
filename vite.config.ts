import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    AutoImport({
      imports: [
        'preact',
        {
          '@preact/signals': ['signal', 'computed', 'batch', 'effect'],
          classnames: ['classnames'],
        },
      ],
      dirs: ['./src/hooks'],
    }),
    Pages({
      dirs: 'src/pages',
      resolver: 'react',
    }),
  ],
})
