import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.playwright,
        dataLayer: 'readonly',
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      'no-unused-vars': [
        'error',
        { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Cloudflare Pages Functions run on workerd, which exposes runtime globals not present in
    // Node or the browser (e.g. HTMLRewriter for streaming HTML transforms).
    files: ['functions/**/*.js'],
    languageOptions: {
      globals: {
        HTMLRewriter: 'readonly',
      },
    },
  },
  skipFormatting,
])
