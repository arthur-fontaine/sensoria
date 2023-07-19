import path from 'node:path'

import ReactPlugin from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'



const CLIENT_PORT = Number.parseInt(process.env.CLIENT_PORT || '3000')
const API_PORT = Number.parseInt(process.env.API_PORT || '4000')

process.env.API_PORT = API_PORT.toString()

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: CLIENT_PORT,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
       path: 'rollup-plugin-node-polyfills/polyfills/path',
    },
  },
  plugins: [
    EnvironmentPlugin(['API_PORT']),
    ReactPlugin(),
  ],
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
            NodeGlobalsPolyfillPlugin({
                process: true,
                buffer: true
            }),
            NodeModulesPolyfillPlugin()
        ]
    }
  },
  build: {
      rollupOptions: {
          plugins: [
              // Enable rollup polyfills plugin
              // used during production bundling
              rollupNodePolyFill()
          ]
      }
  }
})
