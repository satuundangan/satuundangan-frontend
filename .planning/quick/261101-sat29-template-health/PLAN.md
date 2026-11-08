# SAT-29 ADM-039 — template preview and asset health

## Objective
Make browser-observable template preview and configured asset health explicit in the admin catalog without claiming live performance or persisting transient checks.

## Scope
- Frontend admin template list only.
- Preview a template in the same demo route at mobile and desktop viewport widths.
- Check the configured thumbnail and default music URL with temporary browser media elements; show checking, available, failed, timeout, or not configured.
- Keep renderer registry validity and metadata completeness separate from preview/asset status.
- No backend, analytics, persistence, or production changes.

## Acceptance
- Admin can open/close preview and switch mobile/desktop sizes.
- Asset checks cover all rows on the current server-paginated page, do not autoplay, time out, clean up, and ignore stale runs.
- Failures identify thumbnail vs audio; no claim of whole-template performance.

## Verification
- `git diff --check`
- Frontend `CI=1 npm run build`
- Do not add or run tests.
