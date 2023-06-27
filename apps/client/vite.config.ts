import path from 'node:path'

import ReactPlugin from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

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
    },
  },
  plugins: [
    EnvironmentPlugin(['API_PORT']),
    ReactPlugin(),
  ],
})
