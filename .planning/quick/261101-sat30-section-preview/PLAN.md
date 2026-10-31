# SAT-30 ADM-045 section preview

## Goal

Let an admin inspect the selected sample template's section output using seeded demo data, without opening or changing a customer invitation.

## Evidence and scope

- `AdminSections.vue` currently links `samplePreviewTemplate.previewUrl`, which is an image/thumbnail field reused by the template catalog.
- `/demo/:templateSlug` renders a local demo invitation from `demoData` and a template demo preset.
- Template section anchors are mostly consistent, with verified exceptions for `event`, `gallery`, `quote`, `dress-code`, `wishes`, and `story`.
- Only show a focused preview link when the selected renderer has a verified anchor for that section. Keep the unavailable state explicit where no safe anchor exists.
- Extend the backend sample-template payload with its slug and renderer key, then use those values to open the isolated demo route at the section anchor.

## Implementation tasks

1. Add `slug` and `componentKey` (or a normalized renderer key) to `samplePreviewTemplate` in the sections API.
2. Build a frontend helper that validates the sample renderer and resolves a verified section anchor, including known template exceptions.
3. Replace the thumbnail URL link with a link to `/demo/<template-slug>#<section-anchor>`; label it as a demo preview and explain unsupported anchors.
4. Verify with backend/frontend builds and `git diff --check`. Do not run tests unless requested.
5. Commit and push only to `development`; confirm dev workflow success. Do not deploy production.

## Acceptance criteria

- Preview opens a renderer using demo seed data, never a customer invitation record.
- Supported sections open at their actual section anchor for the selected sample renderer.
- Unsupported or unverified section/renderer pairs do not claim to provide a focused preview.
- Existing sample template name and usage context remain visible in the section list.
