---
phase: 20261101-sat27
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/views/admin/AdminUsers.vue
  - src/views/admin/AdminLeadsSupport.vue
autonomous: true
requirements: [ADM-030]
must_haves:
  truths:
    - "An admin can move from a customer profile to the support queue with that customer's email search prefilled."
    - "The support queue opens its tickets tab and queries the existing server-side search."
    - "No ticket or customer message is created or sent automatically."
  artifacts:
    - path: "satuundangan-frontend/src/views/admin/AdminUsers.vue"
      provides: "Customer-context support link"
    - path: "satuundangan-frontend/src/views/admin/AdminLeadsSupport.vue"
      provides: "Support queue route-query initialization"
---

<objective>
Finish the missing SAT-27 ADM-030 support handoff by adding an explicit, read-only link from a customer profile to the admin support queue, prefiltered by that customer's email.
</objective>

<context>
The backend support-ticket list already supports server-side search across customer email, name, and ticket subject. The existing support queue accepts a tab and search field internally but does not initialize them from the route. Keep the feature read-only: opening the queue must not create tickets, modify tickets, or send messages.
</context>

<tasks>
1. Add a button/link in the customer detail modal that navigates to `/admin/leads-support` with `tab=tickets` and the customer email as a `search` query parameter. Hide or disable it when email is absent.
2. Initialize the support queue tab/search from route query and load tickets using the existing server-side search parameter. Keep local filters and refresh behavior intact.
3. Verify with the frontend build and focused existing tests; run `git diff --check`.
</tasks>

<success_criteria>
The customer profile offers a no-send support handoff; the support page opens the ticket tab with the customer email populated and server-filtered. No sensitive details are appended to analytics or external links.
</success_criteria>
