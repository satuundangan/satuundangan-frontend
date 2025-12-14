# Application Summary: Satu Undangan Frontend

## Overview
This is a Vue.js-based frontend application for creating and managing digital wedding invitations. It features a user dashboard, an admin panel, a multi-step invitation creation wizard, and a public-facing invitation view system that supports dynamic templates.

## Existing Features

### 1. Authentication
- **User Types:** Supports Regular Users and Admins.
- **Methods:**
  - Email/Password login and registration.
  - Google OAuth integration.
- **State Management:** managed via Pinia (`stores/auth.js`) and persisted in local storage.
- **UI:** modal-based authentication (`AuthModal.vue`).

### 2. Invitation Creation Flow
- **Wizard Approach:** A multi-step process for creating invitations.
  - **Step 1:** Template/Design selection (`CreateDesign.vue`).
  - **Step 2:** Data Entry (`CreateForm.vue`) with sections for:
    - Couple Details
    - Event Information
    - Love Story
    - Gallery/Media
    - Quote
    - Social Links
    - Gift/Bank Info
- **File Upload:** Handles parallel uploads for images (gallery, couple photos).
- **Draft Saving:** Currently uses `localStorage` to persist state between steps.

### 3. Dashboard
- **User Dashboard:**
  - Sidebar navigation.
  - Stats overview (Total Invitations, Active, Responses).
  - List of invitations with status (Active/Draft).
- **Admin Dashboard:**
  - Comprehensive stats (Total Users, Invitations, Guests, Messages).
  - Lists recent invitations and guest messages.
  - Navigation to manage Users, Invitations, Guests, and Templates.

### 4. Checkout & Payment
- **Integration:** Midtrans Snap (embedded popup).
- **Logic:**
  - Differentiates between Free and Premium templates.
  - Hardcoded pricing (Rp 49.000 for Premium).
  - Successful payment redirects to a success page.

### 5. Public Invitation View
- **Dynamic Routing:** Routes based on `/:slug`.
- **Template Loading:** Dynamically imports the correct Vue component (template) based on the invitation's configured template.
- **Fallback:** Handles loading states and errors (e.g., invitation not found).

## Missing or Incomplete Features (Technical Debt)

### 1. API Integration & Mock Data
- **Dashboard:** The user dashboard (`DashboardView.vue`, `InvitationsView.vue`) currently displays **static mock data**. It is not yet connected to the backend API.
- **Checkout:** The payment initiation in `CheckoutPage.vue` points to `http://localhost:3000`, which might be a hardcoded dev URL, and uses hardcoded invitation details instead of fetching the actual invitation state.
- **Public View:** `InvitationView.vue` has the `getInvitationBySlug` API call **commented out** and relies on the route param acting directly as the template name, which will break for real usage (where slug != template name).

### 2. State Persistence
- **Creation Flow:** Reliance on `localStorage` for the invitation draft is fragile. If the user clears cache or switches devices, their progress is lost. A server-side draft saving mechanism is recommended.

### 3. Template Variety
- Only one template (`dark-elegant.vue`) is explicitly referenced in the file structure, though the system supports dynamic loading.

### 4. Code Quality & Hardcoding
- Several components contain hardcoded strings (e.g., pricing, URLs) that should be moved to configuration or fetched from the API.
