import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // Set base to the repository name so built assets use the correct path on GitHub Pages
    base: '/WinUIonWeb/',
    plugins: [
        plugin(),
        {
            name: 'update-manifest',
            apply: 'build',
            enforce: 'post',
            generateBundle() {
                // Update manifest.json start_url to match the base path
                const manifestPath = path.join(__dirname, 'dist/manifest.json');
                if (fs.existsSync(manifestPath)) {
                    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
                    manifest.start_url = '/WinUIonWeb/';
                    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                }
            }
        }
    ],
    server: {
        port: 63179,
    }
})
