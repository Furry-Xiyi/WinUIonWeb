import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    // Set base to the repository name so built assets use the correct path on GitHub Pages
    base: '/WinUIonWeb/',
    plugins: [plugin({
        // The XAML runtime resolves page bindings from Vue setupState.
        // Production template inlining otherwise hides that scope.
        features: { prodDevtools: true },
    })],
    server: {
        port: 63179,
    }
})
