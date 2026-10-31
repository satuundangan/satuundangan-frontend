---
quick_id: 261031-sat30
mode: quick
date: 2026-10-31
---

# Quick 261031-sat30 Summary

The category table now links its invitation count to the admin invitation list with the existing `category` query filter. The destination keeps the category visible and applies it to the server-side invitation query.

Validation: `git diff --check` passed; `CI=1 npm run build` passed (existing large bundle warning only). No tests or deployment were run. Target is `development` only.
