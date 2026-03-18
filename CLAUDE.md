# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (proxies /api to http://localhost:3000)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint with auto-fix
npm run format    # Prettier formatting on src/
```

No test framework is configured.

## Architecture

**Satu Undangan** is a digital wedding invitation platform built with Vue 3 + Vite + Tailwind CSS v4.

### Tech Stack
- **Vue 3** with Composition API (`<script setup>` syntax throughout)
- **Pinia** for state management (single auth store)
- **Vue Router 4** with navigation guards
- **Axios** + custom `apiFetch` for HTTP requests
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Path alias: `@` → `src/`
- API base URL: `VITE_API_URL` env var (defaults to `http://localhost:3000`)

### Layer Structure

```
src/
├── api/          # API client modules (one file per domain)
├── stores/       # Pinia stores (auth.js only)
├── router/       # Vue Router with auth guards
├── views/        # Page-level components
│   ├── admin/    # Admin panel pages
│   ├── dashboard/# User dashboard pages
│   └── create-form/ # Multi-step form sub-views
├── components/   # Reusable components
│   ├── admin/    # Admin layout (AdminShell, AdminSidebar)
│   ├── dashboard/# Dashboard layout components
│   ├── invitation/
│   └── modal/
└── templates/    # Invitation template components (dark-elegant.vue, light-modern.vue)
```

### API Layer (`src/api/`)

`client.js` exports `apiFetch(path, options)` — the base HTTP wrapper that:
- Automatically injects `Authorization: Bearer <token>` from `localStorage`
- Handles JSON serialization and error response parsing
- Dev proxy forwards `/api/*` to `localhost:3000`

Each domain has its own module: `auth.js`, `invitation.js`, `admin.js`, `master.js`, `guest.js`, `guestMessage.js`, `payment.js`, `file.js`, `templateDesign.js`.

### Authentication

- JWT token stored in `localStorage` under key `'token'`
- Pinia `authStore` (`src/stores/auth.js`) manages `user`, `token`, `redirectPath`
- `authStore.init()` is called in `App.vue` on mount to restore session
- Route protection via `meta.requiresAuth` and `meta.requiresAdmin` flags in the router
- OAuth callback handled at `/auth/callback` → `AuthCallback.vue`

### Routing

Route categories:
- `/` — Public landing page
- `/:slug` — Public invitation viewer
- `/create/*` — Multi-step invitation wizard (Step 1: template selection, Step 2: data entry)
- `/dashboard/*` — Authenticated user area
- `/admin/*` — Admin panel (requires `user.isAdmin`)
- `/checkout/:id` — Payment flow

### Invitation Creation Flow

Multi-step wizard: `CreateDesign.vue` (template selection) → `CreateForm.vue` (data entry). Draft state is persisted to `localStorage`. File uploads use parallel requests via `src/api/file.js`.

### Code Style

- No semicolons, single quotes, 100-char line width (`.prettierrc.json`)
- 2-space indentation, LF line endings (`.editorconfig`)
- ESLint flat config (`eslint.config.js`) with Vue essential rules + Prettier skip-formatting
