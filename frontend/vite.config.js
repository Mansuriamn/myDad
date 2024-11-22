import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
     '/api': 'http://[2409:40c4:2014:fe1f:8000::]:4000'
    }
  }
})