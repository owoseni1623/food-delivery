import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://roadrunner-food-ordering-api-4.onrender.com',  // Replace with your backend server address
        changeOrigin: true,
        secure: false,
      }
    }
  }
})