# External Integrations

**Analysis Date:** 2026-04-05

## APIs & External Services

**Payment Processing:**
- Midtrans (Snap.js) - Payment gateway integration
  - SDK/Client: Snap.js dynamically loaded at `https://app.sandbox.midtrans.com/snap/snap.js`
  - Auth: Client key hardcoded as `Mid-client-KK-xRAA_WfaMnsHO` in `src/views/CheckoutPage.vue`
  - Method: `window.snap.pay(snapToken, {...callbacks})`
  - Implementation file: `src/views/CheckoutPage.vue` (lines 346-357, 389-412)
  - API endpoint: `/payment/create` via `src/api/payment.js`

**Authentication & OAuth:**
- Google OAuth 2.0 - Social authentication
  - Backend endpoint: `{API_BASE}/auth/google`
  - Implementation: `src/components/modal/AuthModal.vue` (lines 239-240)
  - Method: Redirect to backend OAuth callback URL
  - Token handling: JWT returned by backend, stored in localStorage

## Data Storage

**Backend Database:**
- Connected via custom `apiFetch()` wrapper
- Implementation: `src/api/client.js`
- Connection: Backend API at `VITE_API_URL` environment variable (defaults to `http://localhost:3000`)

**Client-Side State:**
- localStorage - JWT token storage (key: `token`)
- localStorage - Invitation draft state (implementation in creation flow)

**File Storage:**
- Backend file upload endpoint: `/upload`
- Implementation: `src/api/file.js`
- Method: FormData POST to backend `/upload` endpoint
- Used for: Image uploads (couple photos, gallery images)

## Authentication & Identity

**Auth Provider:**
- Custom backend with JWT tokens
- OAuth integration: Google via backend at `{API_BASE}/auth/google`

**JWT Implementation:**
- Token flow in `src/stores/auth.js`:
  1. Login/Register at `/auth/login` or `/auth/register` returns `access_token`
  2. Token stored in `localStorage` under key `token`
  3. Automatically injected into all API calls via `Authorization: Bearer <token>` header in `src/api/client.js`
  4. Axios defaults also set in auth store (`axios.defaults.headers.common['Authorization']`)
  5. Session restoration via `authStore.init()` in `App.vue` on mount

**Auth API Endpoints:**
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `GET /user/me` - Fetch current user profile
- `GET /auth/google` - Google OAuth redirect endpoint

## Monitoring & Observability

**Error Tracking:**
- Not detected - Errors logged to browser console only

**Logs:**
- Browser console via `console.error()` and `console.log()`
- Example: Payment flow logs in `src/views/CheckoutPage.vue`

## CI/CD & Deployment

**Hosting:**
- Static site hosting (SPA with client-side routing)
- Build output in `dist/` directory
- Preview available via `npm run preview`

**CI Pipeline:**
- Not detected - No CI config found in repo

**Build Process:**
- `npm run build` - Vite production build
- `npm run dev` - Vite dev server with API proxy
- Dev proxy: `/api/*` → `http://localhost:3000` (configured in `vite.config.js`)

## Environment Configuration

**Required env vars:**
- `VITE_API_URL` - Backend API base URL
  - Development: `http://localhost:3000`
  - Production: Production API URL (not detected in repo, likely set via deployment)

**Secrets location:**
- `.env.development` - Development config
- `.env.production` - Production config
- Midtrans client key currently hardcoded in `src/views/CheckoutPage.vue` line 352 (should be env var)

**Environment Files:**
- `.env.development` - Present, contains `VITE_API_URL=http://localhost:3000`
- `.env.production` - Present, contains `VITE_API_URL=http://localhost:3000`

## Webhooks & Callbacks

**Incoming:**
- Midtrans payment webhook - Backend handles at payment completion
- Google OAuth callback - Backend OAuth endpoint redirects to `/auth/callback`

**Outgoing:**
- Frontend doesn't make outgoing webhooks directly
- Payment confirmation forwarded to backend via `updateInvitation()` call after successful payment in `src/views/CheckoutPage.vue`

## API Domain Structure

All backend APIs accessed via `src/api/` modules using `apiFetch()` wrapper:

**Domain Modules:**
- `auth.js` - Login, register, profile fetch
- `invitation.js` - Create, read, update, delete invitations; fetch by slug
- `payment.js` - Create payment transaction
- `promo.js` - Validate promo codes
- `guest.js` - Create guests, import guests, get guest share link
- `guestMessage.js` - Create and fetch guest messages
- `file.js` - Upload files (separate from apiFetch, uses native fetch)
- `admin.js` - CRUD operations for: users, invitations, guests, guest messages, templates, categories, promo codes, palette colors
- `master.js` - CRUD for: audio tracks, bank/payment methods, sections
- `category.js` - Fetch categories
- `templateDesign.js` - CRUD template designs

---

*Integration audit: 2026-04-05*
