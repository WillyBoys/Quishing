import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/my-vue-app/",
  plugins: [vue()],
  server: {
    proxy: {
      // Proxying the requests from /api to ipapi.co
      '/api': {
        target: 'https://ipapi.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

})
