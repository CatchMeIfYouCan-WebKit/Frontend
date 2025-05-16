// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // 빌드 시점에 global → window 로 치환
    define: {
        global: 'window',
    },
    plugins: [react()],
    server: {
        proxy: {
            // REST API 호출 프록시
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            // SockJS WebSocket 엔드포인트 프록시
            '/ws': {
                target: 'http://localhost:8080',
                ws: true,
            },
        },
    },
});
