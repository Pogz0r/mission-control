# Dev Log

## 2026-03-26

### Feature: Discord pipeline sync

**Task:** Build Discord → Mission Control live sync
- Pull from #decisions, #app-ideas, #dev-log
- Show pipeline status
- Task cards with status

**What was built:**

1. **API Route** (`app/api/discord/messages/route.ts`)
   - Fetches messages from Discord channels using bot token
   - Channels: #decisions (1486485471734534145), #app-ideas (1485126619202064535), #dev-log (1485126620325875733)
   - Returns transformed message data with author, timestamp, messageUrl

2. **DiscordSync Component** (`src/components/DiscordSync.tsx`)
   - Shows live feed from all three Discord channels
   - Auto-refreshes every 60 seconds
   - Displays task status indicators (Done, In Progress, Blocked, Active)
   - Links to Discord messages for full context

3. **Navigation Update**
   - Added "Discord" nav item to sidebar (uses MessagesSquare icon)
   - Click to switch to Discord pipeline view
   - Implemented via activeView state in MissionControlApp

4. **Environment Config** (`.env.example`)
   - Template for DISCORD_BOT_TOKEN
   - DISCORD_GUILD_ID setting

**To deploy on Vercel:**
1. Go to Vercel dashboard
2. Import Pogz0r/mission-control  
3. Add environment variable: `DISCORD_BOT_TOKEN` = your bot token
4. Redeploy

**Files changed:**
- app/api/discord/messages/route.ts (new)
- src/components/DiscordSync.tsx (new)
- app/MissionControlApp.jsx (modified)
- src/components/SidebarNav.jsx (modified)
- src/data/mockData.js (modified)
- .env.example (new)
- tsconfig.json (new, added by Next.js for TypeScript)

**Commit:** 3a13594

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

### Functionality pass: working control bar

Issues reported:
- Live Activity needed to be collapsible instead of simply disappearing.
- Search, Pause, Ping Sage, and the dropdown controls looked interactive but did nothing.

Fixes applied:
- Added a real Live Activity toggle in the header plus close control on the rail.
- Reworked Live Activity from a docked layout section into a right-side overlay drawer with backdrop and Escape-to-close behavior.
- Search now opens a command-palette style task search (`⌘K` / `Ctrl+K`).
- Pause now acts as a write lock / focus mode and blocks mutating actions.
- Ping Sage now opens a request modal and creates a real Sage task in Today.
- Focus dropdown now switches owner focus.
- Mission dropdown now scopes the board by project.
- Refresh now gives visible state feedback.
- Added a visible banner for dashboard state changes.

Validation:
- Control bar now has working first-pass behaviors instead of placeholders.
- Search can open task detail from results.
- Pause prevents task creation/edit/import/drag changes until resumed.
- Ping Sage creates a task and updates Live Activity.

Next likely step:
- continue improving responsive behavior for smaller heights/widths
- optionally add collapsible activity rail / nav
- move utility actions into a cleaner command/overflow menu later
