# Codebase Structure

**Analysis Date:** 2026-04-05

## Directory Layout

```
satuundangan-frontend/
├── src/
│   ├── api/                    # API client modules (one per domain)
│   │   ├── client.js           # Base HTTP wrapper with JWT injection
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── invitation.js        # Invitation CRUD and queries
│   │   ├── admin.js            # Admin panel endpoints
│   │   ├── payment.js          # Payment processing
│   │   ├── file.js             # File upload
│   │   ├── guest.js            # Guest management
│   │   ├── guestMessage.js     # Guest messages/responses
│   │   ├── master.js           # Master data (banks, sections)
│   │   ├── promo.js            # Promo code validation
│   │   ├── templateDesign.js   # Template design endpoints
│   │   └── category.js         # Invitation categories
│   ├── stores/
│   │   └── auth.js             # Pinia authentication store
│   ├── router/
│   │   └── index.js            # Vue Router with guards
│   ├── views/                  # Page-level components
│   │   ├── HomeView.vue        # Landing/home page
│   │   ├── CreateDesign.vue    # Template selection (step 1)
│   │   ├── CreateForm.vue      # Invitation form (step 2)
│   │   ├── InvitationView.vue  # Public invitation viewer
│   │   ├── PreviewInvitation.vue # Preview before publish
│   │   ├── CheckoutPage.vue    # Payment checkout
│   │   ├── AuthCallback.vue    # OAuth callback handler
│   │   ├── admin/              # Admin pages (CRUD management)
│   │   │   ├── AdminLogin.vue
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── AdminUsers.vue
│   │   │   ├── AdminInvitations.vue
│   │   │   ├── AdminGuests.vue
│   │   │   ├── AdminGuestMessages.vue
│   │   │   ├── AdminTemplates.vue
│   │   │   ├── AdminAudio.vue
│   │   │   ├── AdminBanks.vue
│   │   │   ├── AdminSections.vue
│   │   │   ├── AdminCategories.vue
│   │   │   ├── AdminPalettes.vue
│   │   │   └── AdminPromoCodes.vue
│   │   ├── dashboard/          # Authenticated user pages
│   │   │   ├── DashboardView.vue
│   │   │   ├── InvitationsView.vue
│   │   │   ├── TemplatesView.vue
│   │   │   ├── GuestsView.vue
│   │   │   ├── GuestbookView.vue
│   │   │   └── SettingsView.vue
│   │   └── create-form/        # Multi-step form sub-components
│   │       └── components/     # Section components
│   │           ├── InvitationTitleSection.vue
│   │           ├── CoupleSection.vue
│   │           ├── EventSection.vue
│   │           ├── GiftSection.vue
│   │           ├── QuoteSection.vue
│   │           ├── MediaSection.vue
│   │           ├── LoveStorySection.vue
│   │           └── SocialSection.vue
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Admin-specific layout
│   │   │   ├── AdminShell.vue
│   │   │   └── AdminSidebar.vue
│   │   ├── dashboard/          # Dashboard-specific layout
│   │   │   ├── SidebarDashboard.vue
│   │   │   ├── TopbarDashboard.vue
│   │   │   ├── InvitationsTable.vue
│   │   │   └── StatCard.vue
│   │   ├── layout/             # Global layout components
│   │   │   ├── NavbarSection.vue
│   │   │   ├── FooterSection.vue
│   │   │   └── HeroSection.vue
│   │   ├── landing/            # Landing page components
│   │   │   ├── FeaturesSection.vue
│   │   │   ├── StepsSection.vue
│   │   │   └── FaqSection.vue
│   │   ├── invitation/         # Invitation display components
│   │   │   ├── GalleryInvitation.vue
│   │   │   └── MusicControl.vue
│   │   ├── modal/              # Modal dialogs
│   │   │   └── AuthModal.vue
│   │   └── icons/              # Icon components
│   │       └── Icon*.vue
│   ├── templates/              # Invitation design templates
│   │   ├── light-modern.vue
│   │   └── dark-elegant.vue
│   ├── assets/                 # Static assets
│   │   └── main.css            # Global styles (Tailwind)
│   ├── App.vue                 # Root component
│   └── main.js                 # Application bootstrap
├── index.html                  # HTML entry point
├── vite.config.js              # Vite build config with aliases/proxies
├── .prettierrc.json            # Prettier formatting rules
├── .editorconfig               # EditorConfig (indentation, line endings)
├── .eslintrc.js                # ESLint rules
├── eslint.config.js            # ESLint flat config
├── jsconfig.json               # JS path resolution
├── package.json                # Dependencies
├── package-lock.json           # Locked versions
├── .env.development            # Dev environment variables
├── .env.production             # Prod environment variables
├── playwright.config.js        # E2E test config
├── tests/                      # Test files
│   ├── golden-path.spec.js
│   ├── comprehensive-flow.spec.js
│   ├── midtrans-integration.spec.js
│   ├── midtrans-payment.spec.js
│   └── fixtures/               # Test fixtures and data
└── README.md                   # Project documentation
```

## Directory Purposes

**src/api/:**
- Purpose: HTTP client modules organized by business domain
- Contains: Exported async functions that wrap `apiFetch()` calls
- Key files: `client.js` (HTTP base layer), domain modules (auth.js, invitation.js, etc.)

**src/stores/:**
- Purpose: Global application state management via Pinia
- Contains: Store definitions with state, actions, getters
- Key files: `auth.js` (single auth store)

**src/router/:**
- Purpose: Client-side routing configuration and navigation guards
- Contains: Route definitions with metadata, beforeEach guard logic
- Key files: `index.js` (entire router config)

**src/views/:**
- Purpose: Page-level components mapped to routes
- Contains: Top-level feature containers that orchestrate child components
- Key files: HomeView.vue, CreateForm.vue, DashboardView.vue, admin/** pages

**src/components/:**
- Purpose: Reusable UI components and layout components
- Contains: Modal dialogs, table widgets, layout shells, navigation
- Organization: Subdirectories by feature/domain (admin/, dashboard/, layout/, invitation/)

**src/templates/:**
- Purpose: Dynamic invitation rendering templates with different designs
- Contains: Full-page invitation display components
- Key files: light-modern.vue, dark-elegant.vue

**src/assets/:**
- Purpose: Static assets (CSS, images, fonts)
- Contains: Global styles via main.css (Tailwind imports)

## Key File Locations

**Entry Points:**
- `src/main.js`: App initialization, Pinia/Router/Toast plugin setup, DOM mount
- `src/App.vue`: Root component, auth store initialization on mount, router-view outlet
- `index.html`: HTML shell with div#app target

**Configuration:**
- `vite.config.js`: Vite bundler config, alias (@), API proxy (/api), test environment
- `package.json`: Dependencies, build/dev commands
- `.env.development`, `.env.production`: Environment variables (VITE_API_URL)
- `.prettierrc.json`: Code formatting (no semicolons, single quotes, 100 char width)
- `.editorconfig`: Editor defaults (2-space indent, LF line endings)
- `eslint.config.js`: ESLint flat config with Vue and Prettier rules

**Core Logic:**
- `src/router/index.js`: Route definitions, auth guards, page title injection
- `src/stores/auth.js`: User session, JWT token, auth actions
- `src/api/client.js`: Base HTTP wrapper with JWT auto-injection
- `src/api/invitation.js`: Invitation CRUD operations
- `src/views/CreateForm.vue`: Multi-step invitation creation form
- `src/views/InvitationView.vue`: Public invitation viewer with template resolution
- `src/views/dashboard/DashboardView.vue`: Authenticated user dashboard

**Testing:**
- `tests/`: Playwright E2E test files (golden-path.spec.js, comprehensive-flow.spec.js)
- `tests/fixtures/`: Test data and helper factories
- `playwright.config.js`: Playwright test runner configuration

## Naming Conventions

**Files:**
- Vue components: PascalCase (e.g., `CreateForm.vue`, `AdminShell.vue`, `StatCard.vue`)
- API modules: camelCase (e.g., `auth.js`, `invitation.js`, `guestMessage.js`)
- Stores: camelCase (e.g., `auth.js`)
- Utilities: camelCase (not present, utilities inlined in components)
- Static files: kebab-case (e.g., `.prettierrc.json`, `.editorconfig`)

**Directories:**
- Feature directories: kebab-case (e.g., `create-form/`, `guest-message/`)
- Domain/domain-driven: lowercase (e.g., `api/`, `stores/`, `router/`)
- Component categories: lowercase (e.g., `admin/`, `dashboard/`, `layout/`)

**Code (inside files):**
- Variables: camelCase (e.g., `invitations`, `userData`, `formData`)
- Functions: camelCase (e.g., `getInvitations()`, `validateField()`)
- Constants: UPPER_SNAKE_CASE (e.g., `BASE_URL`)
- Props: camelCase (e.g., `:invitations`, `:showButton`)
- Emitted events: kebab-case (e.g., `@edit`, `@delete`, `@preview`)
- CSS classes: kebab-case (via Tailwind utilities)

## Where to Add New Code

**New Feature (multi-page flow):**
- Views: Create page component in `src/views/{feature}/` (e.g., `src/views/billing/BillingView.vue`)
- Components: Create reusable pieces in `src/components/{feature}/` (e.g., `src/components/billing/InvoiceTable.vue`)
- API: Add domain module at `src/api/{feature}.js` with endpoint wrappers
- Router: Add route entries in `src/router/index.js` with meta flags if auth required
- Tests: Add integration tests in `tests/{feature}.spec.js`

**New Component (reusable UI):**
- Implementation: Create file in appropriate `src/components/{category}/ComponentName.vue`
- Pattern: Use `<script setup>`, define `props` and `emits`, keep component single-responsibility
- Export: Components imported directly, no barrel files
- Tests: Co-locate tests in `tests/__components__/{feature}/` if testing at component level

**New API Endpoint:**
- Client module: Add export to existing `src/api/{domain}.js` if domain matches, else create new module
- Pattern: Export async function that calls `apiFetch(path, options)`
- Usage: Import function in view/component, call in `onMounted` or event handler

**Utilities/Helpers:**
- Location: Currently inlined in components; create `src/utils/` if shared
- Pattern: Pure functions, no side effects, export named functions
- Imports: Import with `@/utils/functionName`

**Global State:**
- Location: `src/stores/` (Pinia)
- Pattern: Define new store with `defineStore('storeName')`, export `useStoreName` function
- Usage: Import in components via `const store = useStoreName()`, access state via `store.property`

## Special Directories

**src/__tests__/:**
- Purpose: Unit/integration test files (currently minimal)
- Generated: No (manually written tests)
- Committed: Yes (test source files committed)

**tests/:**
- Purpose: Playwright E2E tests
- Generated: No (manually written, test-results/ auto-generated)
- Committed: Yes (test source files committed, results/ ignored)

**tests/fixtures/:**
- Purpose: Test data, mock responses, factory functions
- Generated: No (manually created)
- Committed: Yes

**playwright/:**
- Purpose: Playwright browser binaries and temporary files
- Generated: Yes (created by Playwright install)
- Committed: No (.gitignore includes)

**test-results/:**
- Purpose: Playwright test execution output (HTML reports, traces)
- Generated: Yes (created after test runs)
- Committed: No (.gitignore includes)

**node_modules/:**
- Purpose: Installed npm dependencies
- Generated: Yes (created by npm install)
- Committed: No (.gitignore includes)

---

*Structure analysis: 2026-04-05*
