# Refda–Tiara Noir: live media and editor recovery

## Problem

The published invitation used broken default portrait URLs, had no prewedding video section, and showed a dead Doa navigation item when its quote was empty. At narrow widths, the light sections caused horizontal overflow. The editor could open an existing invitation without initializing section choices.

## Cause

The live renderer consumed placeholder URLs from the invitation record. `videoPrewedding` existed in the API and Studio payload but Noir did not render it. The edit path initialized `sectionOptions` only when a template had been selected in local storage.

## Changes

- Use the couple's supplied portraits for old placeholder URLs while honoring future custom uploads.
- Add a responsive video section for MP4/WebM and validated YouTube links; upload replacement video immediately in Studio so its URL survives local draft recovery.
- Restore section choices on direct edit, remove dead navigation, make map placeholders open a venue search, and fix mobile horizontal overflow.
- Ship the supplied short video as H.264/AAC MP4 with a grayscale poster for Safari compatibility.

## Verification

- Frontend production build succeeds.
- Local 320px and 390px views have no page overflow; both portraits load, and video metadata reports 720×1280.
- Local 1440px cover and video section render without horizontal overflow.
- Production record update and deployed-site verification are tracked in the release notes for this task.
