# Development Todo List - SatuUndangan Frontend

Status: ✅ Completed (Phase 1)

## 🚨 Critical Fixes (High Priority)

- [x] **Fix Z-Index for Alerts/Toasts**
    - **Issue:** Alert error/success notifications are hidden behind the Login Modal.
    - **Fix:** Update global CSS or the Alert component styles. Ensure the Alert container has a `z-index` higher than the Modal (typically > 1050 or 9999).
    - **Status:** Fixed in `main.js` using `z-[10000]`.

- [x] **Fix Google Login Redirect**
    - **Issue:** Redirects to Checkout immediately after Google Login.
    - **Fix:** Check `AuthCallback.vue` or the auth store. The default redirect after successful login should be `Dashboard`, not `CheckoutPage`, unless the user explicitly came from a "Buy" action.
    - **Status:** Fixed in `AuthCallback.vue`.

- [x] **Fix Dashboard Logout**
    - **Issue:** Logout button in User Dashboard is unresponsive.
    - **Fix:** Check `SidebarDashboard.vue` or `TopbarDashboard.vue`. Ensure the `@click` event is bound to the `logout` action in `stores/auth.js` and correctly redirects to Home/Login.
    - **Status:** Implemented in `SidebarDashboard.vue`.

## 🛠 Dashboard & Layout

- [x] **Fix Sidebar Overlap (My Invitations & Settings)**
    - **Issue:** Content in "Undangan Saya" and "Pengaturan" is covered by the fixed Sidebar.
    - **Fix:** Adjust the CSS layout in `DashboardView.vue` or the specific views (`InvitationsView.vue`, `SettingsView.vue`). Add proper `margin-left` or `padding-left` to the main content area equal to the sidebar width (e.g., `pl-64` in Tailwind).
    - **Status:** Added `ml-64` to `InvitationsView.vue`, `SettingsView.vue`, and `TemplatesView.vue`.

- [x] **User Profile Picture**
    - **Issue:** Shows random default image.
    - **Fix:** Update `SidebarDashboard.vue` / `TopbarDashboard.vue` to bind the `src` to the user's actual avatar URL from the Auth Store. Fallback to a placeholder only if the user has no image.
    - **Status:** Implemented in `TopbarDashboard.vue`.

- [x] **Fix Navbar "+ New Invitation" Button**
    - **Issue:** The button is non-functional.
    - **Fix:** Add a router link or click handler to navigate to the "Create Design" or "Select Template" page.
    - **Status:** Linked to `/create` in `TopbarDashboard.vue`.

## 📝 Invitation Creation Flow

- [x] **Improve "Create New" Logic (Resume vs Start Over)**
    - **Issue:** Clicking "Buat Undangan" forces the user to resume the previous state.
    - **Fix:**
        1. When clicking "Create", check if a draft exists in LocalStorage/Pinia.
        2. If yes, show a Modal: "Lanjut edit undangan sebelumnya atau buat baru?".
        3. If "Baru" is selected: Clear the specific store state and redirect to Template Selection.
        4. If "Lanjut": Redirect to the last step of the form.
    - **Status:** Implemented confirmation logic in `CreateDesign.vue`.

- [x] **Quote/Verse Section Split**
    - **Issue:** Currently a single input field.
    - **Fix:** In `QuoteSection.vue` (Form), split the input into two fields:
        1. `Text` (The actual quote/verse).
        2. `Source` (Surah/Author name).
    - Update the preview component to render them separately for better styling.
    - **Status:** Updated `QuoteSection.vue` with an extra input for `quoteSource`.

## 👥 Guest Management

- [x] **Disable "Add Guest" without Invitation**
    - **Issue:** Adding a guest fails if no Invitation ID exists.
    - **Fix:** In `GuestsView.vue`, check if `invitationId` exists in the store. If null:
        - Disable the "Add Guest" button.
        - Show a tooltip or empty state message: "Buat undangan terlebih dahulu untuk menambahkan tamu."
    - **Status:** Added `:disabled="!selectedInvitationId"` in `GuestsView.vue`.

## 🎨 UI Improvements

- [x] **Template List Visualization**
    - **Issue:** Shows raw `ID: 123` text.
    - **Fix:** In `TemplatesView.vue` or `CreateDesign.vue`, hide the ID. Instead, display a small row of colored circles (Color Palette) representing the template's theme.
    - **Status:** Implemented in the template selection modal within `HomeView.vue`.

- [x] **Favicon**
    - **Issue:** Browser tab uses default logo.
    - **Fix:** Replace `public/favicon.ico` with the SatuUndangan logo.
    - **Status:** Favicon updated to `logo.svg` in `index.html`.

## 🧹 Cleanup & Content

- [x] **Remove Console Logs**
    - **Task:** Global search for `console.log` (especially usually containing sensitive info like `user`, `token`, `profile`) and remove them for production readiness.
    - **Status:** Cleaned up several files including `auth.js`, `CheckoutPage.vue`, and `HomeView.vue`.

- [x] **Add More Templates**
    - **Task:** Duplicate existing template files in `src/templates/` and create variations (e.g., distinct colors, fonts, or layouts) to allow better preview testing.
    - **Status:** Added `src/templates/light-modern.vue`.