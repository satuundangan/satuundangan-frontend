# Admin Panel Analysis: Shortcomings & Areas for Improvement

## 1. User Experience & Navigation
- **Static Profile Data:** The `AdminSidebar.vue` component displays hardcoded user details ("Admin User", "admin@undangdong.com") instead of the actual logged-in admin's information.
- **Navigation Flow:** There is no easy way to navigate back to the main public site or user dashboard from the admin panel.

## 2. Feature Gaps
### Invitations Management (`AdminInvitations.vue`)
- **No Detail View:** Admins can only see a list and delete items. There is no interface to view the full details of an invitation or preview it as a user would see it.
- **No Edit Capability:** Admins cannot edit invitations (e.g., for moderation purposes, fixing typos for users, or adjusting settings).
- **Limited Actions:** The only available action is "Delete".

### Advanced Filtering
- **Basic Search:** The search functionality is limited to a single text input.
- **Missing Filters:** There are no filters for:
  - **Status:** Active vs. Draft vs. Expired.
  - **Payment:** Premium vs. Free / Paid vs. Unpaid.
  - **Date:** Created within a specific range.

## 3. Dashboard Insights
- While the dashboard shows stats, they are high-level. It lacks:
  - Revenue charts (if payments are processed).
  - User growth trends over time.
  - Template popularity metrics.

## 4. Code Maintenance
- **Hardcoded Values:** As noted in the sidebar, but also potentially in other areas not deeply inspected, keeping UI labels and config separate would be better.
