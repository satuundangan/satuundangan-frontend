import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:3000'
  // Vue DevTools injects a floating inspector widget into every rendered page. Normal `npm run
  // dev` always wants it, so it stays on by default. It must be off for any headless capture
  // (e.g. scripts/generate-template-covers.js) since the widget bakes itself into screenshots.
  // Opt-out only, never opt-in by default: unset VITE_DISABLE_DEVTOOLS changes nothing.
  const devToolsDisabled = env.VITE_DISABLE_DEVTOOLS === 'true'

  return {
    plugins: [vue(), ...(devToolsDisabled ? [] : [vueDevTools()]), tailwindcss()],
    test: {
      globals: true,
      environment: 'jsdom',
      // Vitest = unit tests only. Playwright e2e (tests/) and worktree copies are excluded
      // so `npm test` doesn't try to run browser specs.
      include: ['src/**/*.{test,spec}.{js,ts}'],
      exclude: ['node_modules', 'dist', 'tests', 'e2e', '**/.claude/**'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
