import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api requests during development to the Azure Functions host on 7071.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        secure: false,
        // keep the /api prefix so the functions routes continue to match
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
