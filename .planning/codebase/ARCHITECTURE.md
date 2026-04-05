# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Client-Server MVC with Frontend-Focused Composition

**Key Characteristics:**
- Vue 3 Composition API with `<script setup>` syntax throughout
- Single Page Application (SPA) with dynamic routing
- RESTful API consumption with centralized HTTP layer
- Domain-driven API organization (one module per business domain)
- Component-based UI with reusable abstractions
- Flat store pattern (single Pinia store for auth)

## Layers

**API Layer:**
- Purpose: Centralized HTTP communication with JWT authentication
- Location: `src/api/`
- Contains: Domain-specific API modules (`auth.js`, `invitation.js`, `admin.js`, `payment.js`, `file.js`, etc.) + base HTTP wrapper (`client.js`)
- Depends on: Fetch API, localStorage (for JWT token), environment variables
- Used by: All views and components that require backend data

**State Management Layer:**
- Purpose: Global application state persistence (authentication, user session)
- Location: `src/stores/auth.js` (Pinia store)
- Contains: User object, JWT token, redirect path, session initialization logic
- Depends on: localStorage, API auth module
- Used by: Router guards, views, authentication flows

**Router Layer:**
- Purpose: Client-side navigation, route protection, page title management
- Location: `src/router/index.js`
- Contains: Route definitions with metadata (auth requirements, admin checks, titles), beforeEach guards
- Depends on: Vue Router 4, auth store
- Used by: Application navigation, meta tag injection

**View Layer:**
- Purpose: Page-level components handling route-specific logic
- Location: `src/views/` and subdirectories (`admin/`, `dashboard/`, `create-form/`)
- Contains: Feature-specific containers (CreateForm.vue, DashboardView.vue, AdminDashboard.vue)
- Depends on: Child components, API modules, router, stores
- Used by: Router

**Component Layer:**
- Purpose: Reusable UI elements and feature-specific sub-components
- Location: `src/components/` with subdirectories by domain (admin/, dashboard/, invitation/, modal/, landing/, layout/)
- Contains: Modal windows (AuthModal.vue), layout components (NavbarSection.vue, FooterSection.vue), table components (InvitationsTable.vue), UI widgets (StatCard.vue)
- Depends on: Child components, props/emits pattern, Tailwind CSS
- Used by: Views and other components

**Template Layer (Invitation Rendering):**
- Purpose: Dynamic invitation display with different visual designs
- Location: `src/templates/`
- Contains: Invitation template components (light-modern.vue, dark-elegant.vue) that render invitation data from API
- Depends on: Invitation data, component imports (MusicControl.vue, GalleryInvitation.vue)
- Used by: InvitationView.vue via dynamic component loading

## Data Flow

**Authentication Flow:**

1. User submits login/register form (AuthModal.vue)
2. API module `auth.js` calls `/auth/login` or `/auth/register` → backend returns JWT token
3. Auth store (`authStore`) receives token, stores in localStorage, sets axios header, calls `/user/me`
4. Profile response sets `authStore.user` (global state)
5. Router guard checks `authStore.user` on protected routes

**Invitation Creation Flow:**

1. User navigates to `/create` → CreateDesign.vue (template selection)
2. User selects template → routes to `/create/form` → CreateForm.vue
3. CreateForm.vue maintains form state in component `ref()`, saves draft to localStorage
4. On submit, API module `invitation.js` creates invitation via POST `/invitation`
5. Backend returns invitation ID and data
6. User redirected to payment/checkout with invitation reference

**Invitation Viewing Flow:**

1. User accesses public URL `/:slug` (InvitationView.vue)
2. Component fetches invitation data via `getInvitationBySlug()` from `invitation.js`
3. API response contains template design name + content data
4. Template selector dynamically imports matching template from `templateMap` object
5. Template component receives `invitationData` as prop, renders invitation UI
6. Guest interactions (RSVP, messages, gifts) handled within template component

**Admin Dashboard Flow:**

1. Admin accesses `/admin` → AdminDashboard.vue (requires `user.isAdmin` flag)
2. AdminShell.vue wraps content with AdminSidebar.vue navigation
3. Admin pages (AdminUsers.vue, AdminInvitations.vue, etc.) fetch data via `admin.js` API module
4. CRUD operations trigger API calls, update local state, display feedback via toast notifications

**State Management:**

- Authentication state persists globally via Pinia `authStore` and localStorage
- Form state (CreateForm.vue) uses local `ref()` with localStorage draft backup
- Table/list state (admin pages) loaded on component mount, mutated locally, API-synced on save
- No complex state mutations—simple data read/write pattern

## Key Abstractions

**API Client (apiFetch):**
- Purpose: HTTP wrapper that auto-injects JWT, handles responses, manages errors
- Examples: `src/api/client.js`
- Pattern: Pure function accepting path + options, returns Promise<JSON>
- Used by: All API domain modules

**API Domain Modules:**
- Purpose: Encapsulate API endpoints by business domain (users, invitations, payments, admin)
- Examples: `src/api/invitation.js` (create/read/update/delete invitations), `src/api/admin.js` (CRUD master data), `src/api/file.js` (file uploads)
- Pattern: Exported async functions that call `apiFetch()` with specific paths/methods
- Used by: Views and components via direct imports

**Pinia Auth Store:**
- Purpose: Single source of truth for user authentication and session
- Examples: `src/stores/auth.js`
- Pattern: defineStore with state, actions (login, logout, fetchProfile, init), computed getters
- Used by: Router guards (beforeEach), child components (auth checks)

**Dynamic Template Loading:**
- Purpose: Render different invitation designs without separate routes
- Examples: `InvitationView.vue` templateMap object
- Pattern: Map template slugs to dynamic import functions, resolve at runtime via `defineAsyncComponent`
- Used by: InvitationView.vue

**Form Component Decomposition:**
- Purpose: Break large multi-step forms into smaller sections for maintainability
- Examples: `CreateForm.vue` parent using `InvitationTitleSection.vue`, `CoupleSection.vue`, `EventSection.vue` children
- Pattern: Section child components emit events or modify parent data via v-model
- Used by: CreateForm.vue

## Entry Points

**Application Bootstrap:**
- Location: `src/main.js`
- Triggers: When app starts
- Responsibilities: Create Vue app instance, install Pinia, register Router, register Toast notification plugin, mount to DOM

**Root Component:**
- Location: `src/App.vue`
- Triggers: On app load
- Responsibilities: Initialize auth store on mount via `authStore.init()`, render router-view (page outlet)

**Home/Landing:**
- Location: `src/views/HomeView.vue`
- Triggers: User navigates to `/` or lands on app
- Responsibilities: Display landing page with feature sections, navigation, call-to-action

**Public Invitation Viewer:**
- Location: `src/views/InvitationView.vue`
- Triggers: User accesses `/:slug` or `/inv/:slug/:guestSlug`
- Responsibilities: Fetch invitation data, select template dynamically, render template with data, show preview button if unpublished

**Authenticated Dashboard:**
- Location: `src/views/dashboard/DashboardView.vue`
- Triggers: User navigates to `/dashboard` (requires auth)
- Responsibilities: Display user statistics, recent invitations, quick action buttons

**Admin Panel:**
- Location: `src/views/admin/AdminDashboard.vue`
- Triggers: Admin navigates to `/admin` (requires `isAdmin` flag)
- Responsibilities: Display admin overview, navigation to CRUD pages (users, invitations, templates, etc.)

## Error Handling

**Strategy:** Try-catch in async operations with user feedback via toast notifications

**Patterns:**

- API fetch errors caught in try-catch blocks, error message displayed to user
- Router beforeEach guards catch auth validation failures, redirect to login
- InvitationView.vue catches template loading errors, shows fallback error component
- Form validation errors accumulated in `validationErrors` object, displayed inline above fields
- Network errors logged to console, user shown generic "something went wrong" message

## Cross-Cutting Concerns

**Logging:** Console-based via `console.log()` and `console.error()` in development. Production logs handled client-side with browser console.

**Validation:** 
- Client-side form validation in CreateForm.vue (`validateField()` function)
- Validation errors stored in component `ref()`, displayed inline on inputs
- No shared validation schema (validation logic duplicated per form)

**Authentication:** 
- JWT token flow: login → token storage in localStorage → axios header injection → profile fetch
- Token auto-refresh via `router.beforeEach` guard (fetches profile if token exists but user is null)
- Logout clears localStorage, auth store state, and axios headers

**File Upload:**
- Parallel upload via `file.js` API module
- File selection triggers `handlePhotoUpload()` functions in forms
- Response URLs stored directly in form data, no separate file state management

**Notifications:**
- Vue Toastification plugin for temporary alerts (3s default)
- Configured at `main.js` with position, timeout, keyboard shortcuts
- Used for success/error feedback after API operations

---

*Architecture analysis: 2026-04-05*
