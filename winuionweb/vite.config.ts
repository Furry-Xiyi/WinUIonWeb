import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    // Set base to the repository name so built assets use the correct path on GitHub Pages
    base: '/WinUIonWeb/',
    plugins: [plugin()],
    server: {
        port: 63179,
    }
})
