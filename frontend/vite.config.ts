import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],

  server: {
    port: 5173,

    proxy: {
      // /api로 시작하는 요청을 Spring Boot로 전달
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
