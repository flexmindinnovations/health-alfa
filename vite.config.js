import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, 'src/components'),
            "@pages": path.resolve(__dirname, 'src/pages'),
            "@dashboard": path.resolve(__dirname, 'src/pages/dashobard'),
            "@styles": path.resolve(__dirname, 'src/styles'),
        }
    }
})
