import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import AutoImport from 'unplugin-auto-import/vite'
// import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '#types',
        replacement: './types',
      },
      {
        find: '#src',
        replacement: './src',
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
          '@preact/signals': [
            'signal',
            'computed',
            'batch',
            'effect',
            'useSignal',
            'useComputed',
          ],
          'react-use': ['useEffectOnce'],
          preact: ['FunctionComponent'],
          classnames: [['default', 'classnames']],
        },
      ],
      dirs: ['./src/hooks'],
    }),
  ],
})
