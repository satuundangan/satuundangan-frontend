---
quick_id: 261031-sat9
mode: quick
date: 2026-10-31
---

# Quick 261031-sat9 Summary

Added one public URL builder and used it for Dashboard and Invitations link labels, copy actions, direct open, and preview. Published invitations with a valid custom subdomain use `https://<subdomain>.satuundangan.id` only from the production root host. Development and local environments stay on their active origin and `/inv/<slug>` route; unpublished invitations do not advertise their custom subdomain.

Validation: focused URL and InvitationsTable specs passed (10 tests), `CI=1 npm run build` passed, and `git diff --check` passed. Target is development only; production was not deployed or accessed.
