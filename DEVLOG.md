# Dev Log

## 2026-03-25

### Bugfix pass: browser fit + hydration warning handling

### Bugfix pass: true flex shell layout + dev indicator cleanup

Issues reported:
- Center Mission Control content was bleeding underneath the left/right rails.
- A bottom-left issue badge was still visible in local dev.

Findings:
- The shell still relied on offset spacing rather than a true three-column layout.
- That made the center area visually overlap under fixed sidebars.
- The bottom-left badge was Next.js dev indicators, which add noise during local review.

Fixes applied:
- Rebuilt the shell as a real flex layout.
- Left sidebar is now a fixed-width flex child.
- Center workspace is now `flex: 1` with `min-width: 0` and overflow protection.
- Right activity rail is now a fixed-width flex child on `xl+`.
- Sidebars use sticky positioning instead of floating over the center content.
- Disabled Next dev indicators in `next.config.mjs` for cleaner local review.

Validation:
- Layout structure now respects sidebar boundaries by construction.
- Center content can shrink without bleeding under the rails.
- The local dev screen should no longer show the bottom-left Next issue badge.


Issues reported:
- Mission Control felt too wide/dense for a normal laptop browser window.
- Console showed a hydration mismatch warning in Next.js.

Findings:
- The app is running through Next.js (`app/`) on localhost:3000, not the older Vite-only scaffold.
- Layout density was too aggressive: fixed left nav + right activity rail + roomy header spacing caused a cramped center workspace.
- The hydration warning was consistent with browser-extension DOM mutation (`Dark Reader` attributes visible in the screenshot), which can trigger harmless Next hydration mismatch warnings.

Fixes applied:
- Reduced left nav width on smaller screens.
- Reduced right activity rail width and only show it from `xl` upward.
- Tightened header spacing/button sizing for laptop widths.
- Reduced main content padding and enabled overflow protection.
- Added `suppressHydrationWarning` to root `html` and `body` to avoid noisy extension-induced mismatch warnings.

Validation:
- Next build passes successfully.
- Verified core task flows still exist after layout changes:
  - create task
  - edit task
  - delete task
  - drag/drop status moves
  - task detail panel
  - checklist toggle
  - import/export JSON
  - local persistence

Next likely step:
- continue improving responsive behavior for smaller heights/widths
- optionally add collapsible activity rail / nav
