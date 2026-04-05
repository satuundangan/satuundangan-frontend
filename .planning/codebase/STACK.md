# Technology Stack

**Analysis Date:** 2026-04-05

## Languages

**Primary:**
- JavaScript (ES2022+) - All source code, utilities, and configuration
- Vue 3 (Single File Components with Composition API) - UI and views
- CSS 4 with Tailwind CSS v4 - Styling

## Runtime

**Environment:**
- Node.js (LTS)
- Modern browser (ES2022 support required)

**Package Manager:**
- npm (preferred)
- `package-lock.json` present - locked dependency versions

## Frameworks

**Core UI:**
- Vue 3 ^3.5.13 - Progressive web UI framework
- Vue Router 4 ^4.5.0 - Client-side routing with navigation guards and meta fields
- Pinia 3 ^3.0.3 - State management (single `auth` store at `src/stores/auth.js`)
- Composition API with `<script setup>` syntax throughout

**Styling:**
- Tailwind CSS v4 ^4.1.8 - Utility-first CSS via `@tailwindcss/vite` plugin
- PostCSS 8 ^8.5.4 - CSS transformation
- Autoprefixer ^10.4.21 - Browser vendor prefix support

**HTTP & Network:**
- Axios ^1.11.0 - Primarily used for auth store integration
- Fetch API - Primary HTTP mechanism via custom `apiFetch()` wrapper in `src/api/client.js`

**UI Components & Utilities:**
- Vue ToastNotification ^2.0.0-rc.5 - Toast notifications (imported in `src/components/modal/AuthModal.vue`)
- SweetAlert2 ^11.22.2 - Modal alerts and confirmations
- VueUse Core ^13.4.0 - Composable utilities library
- Font Awesome 6.5.0 - Icon library (via CDN link in component styles)

**Build & Development:**
- Vite ^6.2.4 - Fast build tool and dev server
- @vitejs/plugin-vue ^5.2.4 - Vue 3 SFC support
- vite-plugin-vue-devtools ^7.7.2 - Vue DevTools integration

## Configuration

**Environment:**
- Vite environment variables via `import.meta.env`
- `.env.development` and `.env.production` files
- `VITE_API_URL` - Backend API base URL (defaults to `http://localhost:3000`)

**Build Configuration:**
- `vite.config.js` - Vite configuration with Vue plugin, dev proxy, and path alias
- `.editorconfig` - 2-space indentation, UTF-8, LF line endings, 100-char max line length
- `.prettierrc.json` - No semicolons, single quotes, 100-char print width

**Code Quality:**
- ESLint 9 ^9.22.0 - Flat config (`eslint.config.js`)
- ESLint plugin-vue ~10.0.0 - Vue 3 essential rules
- Prettier 3.5.3 - Code formatter
- @vue/eslint-config-prettier ^10.2.0 - Prettier skip-formatting integration

**Path Resolution:**
- Path alias: `@` → `src/` (configured in `vite.config.js`)

## Key Dependencies

**Critical:**
- `vue` ^3.5.13 - Framework core
- `vue-router` ^4.5.0 - Routing (meta-driven guards, `requiresAuth`, `requiresAdmin`)
- `pinia` ^3.0.3 - Auth state (`user`, `token`, `redirectPath`)
- `@tailwindcss/vite` ^4.1.8 - Styling via Vite plugin
- `axios` ^1.11.0 - Used by auth store for setting default headers

**API & Network:**
- Fetch API (built-in) - Primary HTTP transport via `src/api/client.js`
- Custom `apiFetch()` wrapper - Adds `Authorization: Bearer <token>` header from localStorage

**Utilities:**
- `@vueuse/core` ^13.4.0 - Reusable composition functions
- `sweetalert2` ^11.22.2 - Alert dialogs
- `vue-toastification` ^2.0.0-rc.5 - Toast notifications

## Testing Infrastructure

**Test Runners:**
- Vitest ^4.1.0 - Unit test framework (configured in `vite.config.js`)
- @playwright/test ^1.59.1 - E2E testing framework
- @vue/test-utils ^2.4.6 - Vue component testing utilities
- jsdom ^29.0.0 - DOM emulation environment

**Test Configuration:**
- `playwright.config.js` - Playwright setup with auth storage state and Chrome project
- Vitest globals enabled, jsdom environment
- Tests in `tests/` directory with Playwright E2E tests

## Platform Requirements

**Development:**
- Node.js (LTS recommended)
- npm package manager
- Modern terminal with git
- Modern browser for testing

**Production:**
- Static hosting (SPA with client-side routing)
- Backend API at configurable `VITE_API_URL`
- HTTPS recommended for token-based auth
- Browser support: ES2022+ capable browsers

---

*Stack analysis: 2026-04-05*
