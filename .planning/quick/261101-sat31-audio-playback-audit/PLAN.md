# SAT-31 ADM-050 — browser playback audit

## Objective
Give an admin an explicit, transient action to check whether every loaded audio URL can produce playable media in the current browser session.

## Scope
- Frontend only: `src/views/admin/AdminAudio.vue`.
- Use temporary browser `Audio` instances; do not autoplay or persist results.
- Check all loaded rows regardless of search/filter, show per-row status and aggregate summary.
- Support reruns, timeouts, cleanup, and stale-run protection.
- Preserve manual player and bulk-upload behavior.

## Acceptance
- A single action checks all loaded tracks, including filtered-out tracks.
- Each track reports checking, playable, failed, or timeout; totals update clearly.
- Reruns cancel/ignore older work; reloading the list resets transient states.
- No backend, database, production URL, or persistence change.

## Verification
- `git diff --check`
- Frontend `CI=1 npm run build`
- Do not add or run tests.
