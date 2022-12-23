import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '#types',
        replacement: path.resolve(__dirname, 'types'),
      },
      {
        find: '#src',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [
    preact(),
    Icons({
      autoInstall: true,
      compiler: 'jsx',
      jsx: 'preact',
    }),
    AutoImport({
      imports: [
        'preact',
        {
          'react-use': ['useEffectOnce', 'useMount', 'useUnmount'],
          preact: ['FunctionComponent'],
          clsx: ['clsx'],
          'react-helmet': ['Helmet'],
        },
      ],
      dirs: ['./src/hooks'],
    }),
    Pages({
      dirs: 'src/pages',
      importMode: 'sync',
      resolver: 'react',
    }),
  ],
})
