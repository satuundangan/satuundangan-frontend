# Codebase Concerns

**Analysis Date:** 2026-04-05

## Security

### XSS Vulnerability - v-html with User Input

**Risk:** Direct use of `v-html` binding with user-supplied data (couple names, FAQ content) allows potential XSS attacks.

**Files:**
- `src/templates/dark-elegant.vue:55-57` — `v-html="data.groomName"` and `v-html="data.brideName"`
- `src/templates/light-modern.vue:49-51` — Same couple name bindings
- `src/components/landing/FaqSection.vue:25` — `v-html="faq.answer"`

**Impact:** Attackers could inject malicious JavaScript through couple names or FAQ content, compromising guest data and hijacking invitations.

**Fix Approach:**
- Use `{{ }}` interpolation for couple names instead of `v-html` (safe in Vue 3 with proper escaping)
- For FAQ content, implement a whitelist-based HTML sanitizer (e.g., `DOMPurify`) if HTML formatting is required
- Add input validation on form submission to reject HTML/script content in names

---

### Sensitive Client Key Exposed

**Risk:** Midtrans Sandbox client key hardcoded in frontend code.

**Files:**
- `src/views/CheckoutPage.vue:352` — `data-client-key: "Mid-client-KK-xRAA_WfaMnsHO"` in `loadSnapScript()`

**Impact:** While this is a sandbox key (lower risk), it establishes a pattern that could lead to production keys being exposed. Client keys should be requested from backend endpoints, not embedded.

**Fix Approach:**
- Create backend endpoint `/payment/snap-token` that returns the appropriate client key based on environment
- Fetch client key dynamically from backend before initializing Snap.js
- Ensure production environment only uses non-sandbox keys

---

### localStorage Misuse for Sensitive Session Data

**Risk:** JWT token stored in `localStorage` with no expiration handling, vulnerable to XSS exploitation of the entire session.

**Files:**
- `src/api/client.js:4` — Token retrieved from `localStorage` on every request
- `src/stores/auth.js:22,29,49,68` — Token persisted and removed from localStorage
- `src/router/index.js:173-174` — Token manually restored from localStorage on route guard execution

**Impact:** If XSS is exploited, attacker gains indefinite access to user account. No token refresh mechanism or expiration enforcement visible.

**Fix Approach:**
- Implement token refresh using HTTP-only cookies (requires backend support)
- Add token expiration time tracking with automatic logout
- Store only non-sensitive identifiers in localStorage; move actual token to cookie with `httpOnly` flag
- Implement refresh token rotation with silent re-authentication

---

### No CSRF Protection Observable

**Risk:** No CSRF token mechanism detected in API requests or form submissions.

**Files:**
- `src/api/client.js` — `apiFetch()` sends POST/PUT/DELETE without CSRF tokens
- `src/views/CreateForm.vue:1059-1067` — Form submission without CSRF mitigation
- `src/views/CheckoutPage.vue:359-419` — Payment submission without CSRF tokens

**Impact:** Cross-site request forgery attacks possible on state-changing operations (create invitation, apply promo, payment).

**Fix Approach:**
- Implement backend CSRF token generation and validation
- Add token extraction from response headers or meta tags
- Include CSRF token in all non-GET API requests via `apiFetch()`
- Use SameSite cookie attribute (backend) as secondary defense

---

## Tech Debt

### CreateForm Component Size and Complexity

**Risk:** Single file component containing 1268 lines with mixed concerns — validation logic, file uploads, form handling, API calls all in one scope.

**Files:**
- `src/views/CreateForm.vue` (1268 lines)

**Impact:** Difficult to test, maintain, and debug. High cognitive load. Brittle for changes. Hard to reuse validation or upload logic.

**Fix Approach:**
- Extract validation logic into composable: `useInvitationValidation.js`
- Extract file upload handling into composable: `useFileUpload.js`
- Break form sections into sub-components (CoupleSection already exists as `src/views/create-form/components/*`, but parent not refactored)
- Move API calls to dedicated service layer

---

### Template Components Overloaded (dark-elegant.vue, light-modern.vue)

**Risk:** Template files (768 lines, 658 lines respectively) contain both invitation display logic and excessive conditional rendering for different content types.

**Files:**
- `src/templates/dark-elegant.vue` (768 lines)
- `src/templates/light-modern.vue` (658 lines)

**Impact:** Difficult to maintain template styles. Complex nested conditionals make it hard to follow data flow. Any template change risks breaking invitation rendering.

**Fix Approach:**
- Extract invitation sections into separate sub-components (e.g., `TemplateHero.vue`, `TemplateCountdown.vue`)
- Move data transformation logic to template-specific composables
- Reduce conditional rendering depth by using component composition

---

### Inconsistent Error Handling

**Risk:** Error handling varies significantly across codebase. Some async operations use try/catch, others silently fail or use generic alerts.

**Examples:**
- `src/views/CreateForm.vue:1050-1078` — Uses try/catch with generic alert
- `src/views/CheckoutPage.vue:314-326` — Generic console.error without user feedback
- `src/api/client.js:16-18` — Throws errors, but consumer handling is inconsistent
- `src/api/file.js:23-29` — Logs errors but doesn't propagate context

**Impact:** Users get inconsistent feedback. Silent failures (e.g., failed file uploads) may go unnoticed. Debugging is harder without structured error logging.

**Fix Approach:**
- Create error handling utility: `src/utils/errorHandler.js`
- Standardize on error notification: `toast.error()` for user-facing, structured logging for debugging
- Implement error boundaries at route level
- Add user-friendly error messages with actionable guidance

---

### localStorage Overuse Without Sync Strategy

**Risk:** Multiple localStorage keys used for state persistence without coordination or cleanup strategy.

**Files:**
- `src/views/CreateForm.vue` — Uses `selectedSections`, `finalPayload`, `editInvitationId`, `selectedTemplate`
- `src/views/CreateDesign.vue` — Uses `selectedTemplate`, `selectedSections`, `finalPayload`
- `src/views/PreviewInvitation.vue:115,148,176-177,186` — Reads from `editInvitationId` and `finalPayload`
- `src/templates/dark-elegant.vue:692-694` — Fallback read from `finalPayload`

**Impact:** No cache invalidation strategy. Stale draft data could cause confusion. Multiple sources of truth. No version management if API schema changes.

**Fix Approach:**
- Implement draft store (Pinia) instead of scattered localStorage keys
- Add metadata (timestamp, API version) to drafts for validation
- Implement cleanup routine (clear outdated drafts after X days)
- Use single source of truth: either API or store, not both

---

## Data Handling Issues

### File Upload State Management

**Risk:** File uploads handled with multiple data structures (raw file, data URL, URL from API) causing synchronization problems.

**Files:**
- `src/views/CreateForm.vue:661-696` — Files stored as both `.File` and data URL in formData
- `src/views/CreateForm.vue:749-757` — Payload generation uses `bridePhotoUrl || bridePhoto` fallback chain

**Impact:** Inconsistent state. Unclear which source is authoritative. Data duplication wastes memory. Hard to track upload status.

**Fix Approach:**
- Use single representation: store File object, compute preview URL on demand
- Create `FileUploadState` interface with fields: `file`, `previewUrl`, `uploadedUrl`, `uploadStatus`
- Track upload progress per file in reactive object
- Clear local data URL after successful upload

---

### Form Data Validation Incomplete

**Risk:** No comprehensive validation schema. Validation scattered across component with basic field-level checks.

**Files:**
- `src/views/CreateForm.vue:900+` — `validateField()` function only checks presence, not format
- No validation for: date ranges, image dimensions/formats, music file size, gallery size limits
- Manual alert() usage instead of structured validation feedback

**Impact:** Invalid data could reach API. User submits incomplete forms with no clear feedback. No validation on edit mode.

**Fix Approach:**
- Implement schema validation library (e.g., Zod or Vee-Validate)
- Define `InvitationSchema` with field-level and cross-field rules
- Add async validation (e.g., slug uniqueness check)
- Provide real-time validation feedback as user types
- Validate on mount if loading draft data

---

### Base64 Data URLs in localStorage

**Risk:** File previews stored as base64 data URLs in localStorage can be 10-100MB per file, exceeding storage limits.

**Files:**
- `src/views/CreateForm.vue:707-714` — Gallery images stored as preview data URLs
- `src/views/CreateForm.vue:850` — Full payload including all data URLs saved to localStorage

**Impact:** localStorage quota exceeded (typically 5-10MB). App becomes non-functional. Cannot create invitations with large image galleries.

**Fix Approach:**
- Never persist data URLs to localStorage
- Use IndexedDB for large binary data (gallery previews)
- Store only file metadata (name, size, upload status) in localStorage
- Regenerate preview URLs in-memory when component mounts

---

## Performance Concerns

### No Pagination in Admin Tables

**Risk:** Admin views load all records without pagination or virtual scrolling.

**Files:**
- `src/views/admin/AdminUsers.vue` — Loads all users
- `src/views/admin/AdminInvitations.vue` — Loads all invitations
- `src/views/admin/AdminGuestMessages.vue` — Loads all messages

**Impact:** Slow page load and high memory usage as dataset grows. API response time increases. Rendering 1000+ rows causes UI lag.

**Fix Approach:**
- Implement cursor-based pagination or limit/offset
- Add virtual scrolling (e.g., `vue-virtual-scroller`)
- Load 20-50 rows initially, fetch more on scroll
- Implement server-side filtering and sorting

---

### No Image Optimization

**Risk:** Large uncompressed images uploaded directly to API and served without resizing/compression.

**Files:**
- `src/views/CreateForm.vue:77-78` — Displays bride/groom photos at full size
- `src/templates/dark-elegant.vue:45` — Loads couple photo at full dimensions
- Midtrans client key loads snap.js on every checkout (no caching strategy)

**Impact:** Slow invitation loading for guests on 4G. High bandwidth costs. Poor SEO due to page load time.

**Fix Approach:**
- Implement image upload with automatic resizing (backend or client-side with Sharp/ImageMagick)
- Serve images via CDN with cache headers
- Use srcset for responsive images
- Implement lazy loading for gallery photos

---

## Testing Gaps

### No Unit Test Coverage

**Risk:** Codebase has no unit tests. Only E2E tests exist (Playwright), no Jest/Vitest configuration active.

**Files:**
- `package.json:10` — `"test": "vitest"` defined but no vitest config
- `src/__tests__/InvitationView.spec.js` — Single abandoned test file
- No tests for: validation logic, API client, Pinia store, utility functions

**Impact:** Regressions go undetected. Validation logic untested. Store state mutations risky to refactor. No quick feedback loop during development.

**Fix Approach:**
- Set up Vitest with Vue component testing utilities
- Write unit tests for: `useAuthStore`, `apiFetch()`, validation functions
- Aim for 80% coverage on critical paths (auth, payment, form submission)
- Run tests in CI/CD pipeline before deployment

---

### E2E Tests Fragile and Incomplete

**Risk:** E2E tests use brittle selectors and skip critical flows.

**Files:**
- `tests/golden-path.spec.js:19-35` — Mocks `/promo/validate` endpoint (suggests backend not fully implemented)
- Tests use text-based selectors like `button:has-text("Masuk")` (fragile if button text changes)
- No tests for: error paths, payment failure recovery, image upload failures
- `test.setTimeout(240000)` indicates flaky tests with 4-minute timeout

**Impact:** Tests pass but code breaks in production. False confidence. New contributor changes button text and breaks tests.

**Fix Approach:**
- Add test IDs to interactive elements (`data-testid="login-submit"`)
- Use IDs/test IDs instead of text selectors
- Add error path tests: invalid login, network failure, payment decline
- Reduce timeout to 30-60s, fix underlying flakiness
- Parallelize tests to reduce total runtime

---

## Known Issues

### Missing OAuth Callback Implementation

**Risk:** OAuth flow defined in router but callback handler incomplete or untested.

**Files:**
- `src/router/index.js:67-70` — Route `/auth/callback` exists pointing to `AuthCallback.vue`
- Component implementation not reviewed (file not in provided context, likely minimal)

**Impact:** OAuth login may not persist tokens correctly. User redirected to callback URL but doesn't authenticate properly.

**Fix Approach:**
- Implement `AuthCallback.vue` to extract auth code from URL
- Call backend `/auth/callback?code=...` to exchange code for token
- Store token and redirect to dashboard on success
- Handle error states (invalid code, expired session)

---

### File Upload Without Progress Tracking

**Risk:** Large file uploads (music, images) provide no progress feedback to user.

**Files:**
- `src/api/file.js:12-14` — Uses basic `fetch()` without progress events
- `src/views/CreateForm.vue:1000-1009` — Uses `Promise.all()` without per-file progress

**Impact:** User doesn't know if upload is happening or stuck. Network timeout appears like app freeze.

**Fix Approach:**
- Implement XMLHttpRequest or fetch with `ReadableStream` for upload progress
- Show progress bar per file
- Add upload timeout with user-friendly retry option
- Implement resumable uploads for large files

---

### Promo Code Validation Backend Gap

**Risk:** Promo code validation endpoint mocked in test, suggesting backend not fully implemented.

**Files:**
- `tests/golden-path.spec.js:18-35` — Routes `/promo/validate` to mock, not backend

**Impact:** Feature works in tests but may fail in production. No discount actually applied if backend endpoint missing.

**Fix Approach:**
- Implement backend `/promo/validate` endpoint
- Add validation: code existence, expiration date, usage limits, eligibility
- Return discount details to frontend
- Test with real backend before deployment

---

## Scaling Concerns

### No API Rate Limiting or Debouncing

**Risk:** Frontend sends unbounded API requests. No rate limiting on validation checks or file operations.

**Files:**
- `src/views/CreateForm.vue:54,63,105` — `@input="validateField()"` fires on every keystroke
- No debounce on slug uniqueness checks (if implemented)

**Impact:** Backend could be overwhelmed by rapid requests. DoS vector for malicious clients.

**Fix Approach:**
- Add debounce to validation: 300ms delay on input events
- Implement request throttling in `apiFetch()`: abort duplicate in-flight requests
- Add backend rate limiting: 100 requests/minute per user/IP

---

### No Caching Strategy for Master Data

**Risk:** Categories, templates, audio, palettes loaded fresh on every page navigation.

**Files:**
- `src/api/category.js` — No caching mechanism
- Admin pages reload all data on mount with no cache invalidation strategy

**Impact:** Slow navigation. Increased backend load. No offline support.

**Fix Approach:**
- Implement Pinia store for master data with manual cache invalidation
- Add HTTP cache headers (ETag, Last-Modified) on backend
- Use Service Worker for offline support
- Pre-load critical data (templates, categories) at app startup

---

## Potential Runtime Errors

### Unsafe JSON Parsing from localStorage

**Risk:** JSON.parse() called on localStorage without try/catch in critical paths.

**Files:**
- `src/views/CreateForm.vue:1100` — `JSON.parse(stored || '[]')` could fail if corrupted data
- `src/views/CreateDesign.vue:150` — `localStorage.getItem('selectedTemplate')` parsed without guard

**Impact:** App crash if localStorage data corrupted. Browser auto-recovery time adds latency.

**Fix Approach:**
- Wrap all localStorage access in try/catch
- Validate parsed data against schema
- Clear corrupted data and show recovery message
- Add localStorage data versioning/migration

---

### Unhandled Promise Rejections in API Calls

**Risk:** Some async operations don't have catch blocks or error boundaries.

**Files:**
- `src/views/PreviewInvitation.vue:176-177` — Silently falls back to localStorage on API failure without logging
- `src/views/CheckoutPage.vue:378-380` — `updateInvitation()` wrapped in catch but continues anyway

**Impact:** Silent failures mask real errors. Debugging harder. Users don't know if operation succeeded.

**Fix Approach:**
- Add `.catch()` to all promises
- Implement error boundary component for route-level error handling
- Log all errors to monitoring service
- Show toast notification for user-facing errors

---

### Route Parameter Type Coercion Issues

**Risk:** Route params from URL treated as strings but used as numbers without validation.

**Files:**
- `src/router/index.js:50-54` — Edit route uses `route.params.id` from URL (string) directly
- `src/views/CreateForm.vue:1056` — `route.params.id` passed to API without type conversion

**Impact:** API may reject string ID when expecting number. Edit mode fails silently.

**Fix Approach:**
- Add route parameter type validation in router guards
- Convert and validate IDs before API calls
- Show error if ID invalid format (non-numeric)
- Use strongly typed route definitions (TypeScript)

---

## Fragile Areas

### Template-Specific Data Mapping

**Risk:** No standardized format. Template receives `data` prop but internal structure inconsistent.

**Files:**
- `src/templates/dark-elegant.vue:55-57,61` — Expects `data.groomName`, `data.brideName`, `data.akadLocation.dateTime`
- `src/templates/light-modern.vue:49-51` — Same expectations
- Payload generation in CreateForm may use different keys

**Impact:** Mismatch between generated payload and template expectations. Invitation displays blank/broken fields.

**Fix Approach:**
- Define `InvitationData` TypeScript interface
- Validate payload against interface before saving
- Add template adapter layer to normalize data
- Unit test each template with various data shapes

---

### Payment Flow State Management

**Risk:** Payment status tracked implicitly through `isPublished` flag and localStorage. No state machine.

**Files:**
- `src/views/CheckoutPage.vue:334,378,394` — Updates `isPublished` on payment success, but no transaction ID stored
- No way to verify which payment is pending vs completed

**Impact:** User confusion about payment status. Duplicate charges possible if webhook fails and user retries.

**Fix Approach:**
- Add `paymentStatus` field: `pending`, `completed`, `failed`, `refunded`
- Store Midtrans transaction ID for reconciliation
- Implement webhook verification for payment updates
- Add idempotency key to payment requests

---

## Dependency & Build Concerns

### Axios Imported But Not Used Consistently

**Risk:** Axios imported in `src/stores/auth.js:4` and used for header management, but `apiFetch()` uses native `fetch()`.

**Files:**
- `src/stores/auth.js:23,30,50,56,69` — Sets `axios.defaults.headers.common['Authorization']`
- `src/api/client.js:11` — Uses native `fetch()` which doesn't read axios defaults
- `src/api/file.js:12` — Uses native `fetch()` for file upload

**Impact:** Token management has two paths. Confusion about which is authoritative. OAuth login might set axios header but API calls use fetch without header.

**Fix Approach:**
- Remove axios, use only `fetch()` and `apiFetch()`
- Or standardize on axios for all HTTP requests
- Update `apiFetch()` to use axios instance
- Remove axios from dependencies if not used

---

### No Error Monitoring

**Risk:** console.error() is only error reporting. No Sentry or similar monitoring.

**Files:**
- 41 console.* calls throughout codebase
- No structured logging

**Impact:** Production errors invisible until user reports. Cannot analyze crash patterns. Slow incident response.

**Fix Approach:**
- Integrate Sentry or similar for error tracking
- Track errors with context: user ID, session, page, action
- Set up alerts for critical errors
- Add breadcrumb tracking for user actions

---

## Summary Table

| Concern | Severity | Component | Notes |
|---------|----------|-----------|-------|
| XSS via v-html | **HIGH** | Templates, FAQ | User data binding without escaping |
| Missing CSRF | **HIGH** | API client | No state-change protection |
| localStorage XSS exposure | **HIGH** | Auth store | Token persisted insecurely |
| CreateForm 1268 lines | **MEDIUM** | Form component | Technical debt, hard to test |
| No unit tests | **MEDIUM** | Entire app | Only E2E tests |
| v-html FAQ | **MEDIUM** | Landing | Static content, manageable risk |
| File upload base64 | **MEDIUM** | CreateForm | localStorage quota risk |
| No pagination admin | **MEDIUM** | Admin views | Performance at scale |
| E2E test fragility | **LOW** | Tests | Text-based selectors |
| Missing OAuth callback | **LOW** | Auth | Likely works but untested |

