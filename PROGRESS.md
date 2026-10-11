# dsh-vscode-themes2 — Project Knowledge & Progress

A VS Code theme switcher plugin for the DeepSeek Harness (DSH) Web UI.
**This is a private dev repo — only agents and its author work on it; no release
process.** Update this file at the end of every working session so future sessions
can resume from here.

## Current status — 2026-10-10

**State: FULLY WORKING + lean-design pass + card-accuracy pass (UNCOMMITTED). The four
fixes are pushed (commit 94cc366) and the repo is PUBLIC:
https://github.com/zxbc/dsh-vscode-themes2. On top of that, a **lean/compact redesign**
(smaller rendered previews, one consolidated search with Installed + Marketplace
sections, a prominent ring+pill "Active" indicator, dropped the redundant colour-scheme
badge) plus a **card-accuracy pass** (each card's background/border/title now bound to
that theme's OWN tokens, the "Apply" text dropped, and the count line now reads
"N themes installed · click on a theme card to preview/apply") are done in `client.js`
only and **delivered locally for the user to test — do NOT push yet.** See the 2026-10-10
(lean design) and (card-accuracy) entries in the session log.**

- Marketplace search: uncontrolled input polled every 1 s with change detection —
  no per-keystroke queries.
- Single-letter queries never sent; a hint ("Type at least 2 characters to search.")
  is shown instead (the VS Marketplace API answers 1-letter queries with HTTP 401).
- Install: downloads the `.vsix`, parses the theme's colors, maps them onto the 14
  DSW tokens, registers and applies the theme; installed themes persist and sort to
  the top (most recent first).
- Preview of both bundled and installed marketplace themes works.
- Verified themes: 6 Tokyo-Night-family + 4 light themes all convert with 14 tokens.

**FIX 1 — persistence + remove (2026-10-10).** Installed themes now survive a
refresh AND closing/reopening the settings page. Root cause was that
`installedList` initialized from the `installed` closure variable captured once at
`apply()` time (stale after an install). Both `installedList` and the new
`removedIds` now use lazy `useState(() => …)` initializers that re-read
`localStorage` on every mount. A new **Remove** (×) button on every card removes a
bundled or installed theme (persisted to `dsh.vscodeThemes.removed`); removing the
applied theme auto-falls-back to the first available one. Re-installing a removed
theme un-removes it.

**FIX 2 — marketplace card swatches (2026-10-10).** Marketplace (not-yet-fetched)
theme cards now show a live color-swatch preview. A `useEffect` eagerly fetches each
search result's `.vsix` definition in the background (3 at a time, de-duplicated via
`marketFetchedRef` + the existing `fetchedCache`), storing the token sets in
`marketTokens`; each card renders `previewStrip(def)` once available, a subtle
shimmer strip until then. The `fetchedCache` fallback in `marketCard` covers the
cancelled-fetch edge case.

**FIX 3 — applied theme persists across refresh (2026-10-10).** The applied theme
reverted to the default DSH theme on refresh even though the selection was saved.
Root cause: `ThemeRuntime.adopt()` re-runs when the DSH settings scope loads
asynchronously AFTER boot and overwrites our `setTheme(selectedId)` with the
built-in preference — and a custom id can never persist there (`setTheme(id)` writes
the scope only when `id` is `light`/`dark`/`system`; the scope's `preference` field
schema is a union of those three). Fix = a grace-window re-assertion: poll
`ctx.theme.getTheme().active.id` every 200 ms for a 6 s window; whenever the resolved
theme is not ours (`activeId !== currentSelected` and the id is registered) re-assert
`setTheme(currentSelected)`, then stop. `currentSelected` is a mutable var updated by
`persistSelected()` BEFORE the caller applies, so a user's own switch is never fought
(all four switch functions were reordered to persist-before-setTheme). Polling was
chosen over `ctx.on('theme/change')` because cross-plugin event-bus sharing is not
guaranteed for our context. The timer is cleared on dispose. After the window the DSH
appearance controls work again. The applied indicator was also strengthened to
`✓ Applied` on both card kinds.

**FIX 4 — rendered theme samples replace flat swatches (2026-10-10).** The 6-flat-
swatch strip was too literal. `previewStrip` was replaced by `themeSample(theme)`, a
mini DSH chat mock rendered in the theme's ACTUAL colors: a brand-dot header with the
theme name + scheme badge, a user message bubble in the brand color (auto-contrast
text), an assistant bubble in the layer color with primary + secondary text, a primary
button, and success/warn/error chips tinted via `withAlpha`, plus an input field.
Every color is bound with an inline `style` to the target theme's real tokens — a
`.vst-*` class would resolve `var(--dsw-alias-*)` to the currently-applied theme, not
the card's theme, so inline binding is mandatory. Pure color helpers `parseRGB` /
`contrastOn` / `withAlpha` handle hex3/6/8, rgb()/rgba() and alpha composition. The
existing background `getDef`/`marketTokens`/prefetch is reused, so marketplace cards
also get rendered samples (shimmer until fetched). Both `card()` and `marketCard()`
call `themeSample` now.

## Architecture (two halves, one plugin identity)

- **`client.js`** (browser half, object form `{inject, apply(ctx)}`) — renders the
  settings section: search box, bundled + installed theme cards (rendered `themeSample`
  preview, badges, apply, Remove ×, `✓ Applied` indicator), "From VS Code Marketplace"
  section with Install buttons. Every card shows a mini DSH chat mock rendered in the
  theme's actual colors via inline `style` bound to its tokens (user bubble in brand,
  assistant bubble in layer color, primary/secondary text, primary button,
  success/warn/error chips, input field) — a `.vst-*` class would resolve
  `var(--dsw-alias-*)` to the applied theme, not the card's theme, so inline binding is
  mandatory. Marketplace result cards get a rendered sample from a background `useEffect`
  that fetches each result's `.vsix` definition (3 concurrent; shimmer until fetched).
  A 6 s grace-window re-assertion makes the applied custom theme survive a refresh
  (see FIX 3). Persists
  `dsh.vscodeThemes.selected`, `dsh.vscodeThemes.installed`, and
  `dsh.vscodeThemes.removed` in `localStorage`; `installedList`/`removedIds` use lazy
  `useState(() => …)` initializers so they re-read localStorage on every mount (this
  is what makes installed/removed themes survive a refresh and a settings-page
  remount). Registers themes with `ctx.theme.register` on demand.
- **`index.js`** (host half) — `VscodeThemes extends TypertRemoteService`
  (`super(ctx, "vscodeThemes")`), `@Remote search(query)` and `@Remote fetchTheme(ext)`
  delegating to the pure logic module. The `@Remote` decorator is applied the same
  way `@deepseek-ai/dsh-api-workspace-files` does it (`__esDecorate` static block) —
  do not hand-roll it.
- **`marketplace.js`** — pure host logic, no Cordis wiring, unit-testable with plain
  `node`: `searchMarketplace(query)`, `vsixUrl(ext)`, `fetchThemeDefinition(ext)`,
  `mapToDswTokens`, `stripJsonc`, color + minimal-ZIP helpers.
- **`package.json`** — `main: ./index.js`, `exports["./client"]: ./client.js`,
  `dsh.bundle.patch: ./cordis.patch.yml`, `dsh.client` = web, inject
  `@deepseek-ai/dsh-client-ui-theme`.
- **`cordis.patch.yml`** — inserts bundle entry `vscode-themes2` named
  `@local/dsh-vscode-themes2`.
- **`locale/en.json`**, **`icon.svg`** — display strings and icon.

## Why the marketplace needs the host half

The browser is network-restricted (CORS/egress); it cannot reach the VS Code
Marketplace. The host (Node) process can, with real `fetch`. All external calls and
`.vsix` downloads run host-side and are exposed through the `vscodeThemes` remote
service. UI, theming, and persistence stay client-side.

## Marketplace protocol facts

- **Search**: POST to `https://marketplace.visualstudio.com/_apis/public/gallery/...`
  (extensionquery) with `filterType: 5` (Themes) and `filterType: 10` (query text).
  2+ chars return results fine; **1 char → HTTP 401** (handled client-side with a hint).
- **VSIX download**:
  `https://<publisher>.gallery.vsassets.io/_apis/public/gallery/publishers/<p>/vsextensions/<n>/<v>/vspackage`.
- **ZIP parsing**: central-directory reader + `DecompressionStream('deflate-raw')`.
  The theme entry path is `pkg.contributes.themes[0].path` under `extension/`.
- **JSONC**: VS Code theme `.json` files are JSONC — they may contain comments AND
  **trailing commas**. `stripJsonc` must be string-aware, comment-aware, and drop a
  `,` only when the next meaningful char is `}` or `]`. A `JSON.parse` failure here
  surfaces in the UI as a red error ("Expected double-quoted property name in JSON at
  position N (line X column Y)") — the position points into the theme file.
- **DSW tokens** a theme maps onto (14): `--dsw-alias-bg-base`, `bg-layer-1`,
  `bg-layer-2`, `bg-overlay`, `border-l1`, `border-l2`, `brand-primary`,
  `label-primary`, `label-secondary`, `state-error/idle/success/warn-primary`,
  `--dsw-specific-sidebar-fill`.

## Search UX design (proven, keep it)

In `client.js`: constants `MARKET_POLL_MS = 1000`, `MARKET_MIN_QUERY_LEN = 2`.

- Uncontrolled input (`defaultValue` + `marketInputRef`); typing never re-renders.
- `setInterval` tick reads `input.value.trim()`; acts only when it changed since the
  last tick (`marketSeenRef`).
- `runSearch` bumps `searchTokenRef`; stale in-flight results are ignored.
- Empty → reset to idle; 1 char → `marketShort` hint; 2+ chars → search.
- The input is never disabled while searching.

## Critical contracts & pitfalls (learned the hard way)

1. **Self-mount contract**: the `vscodeThemes` namespace is mounted by the client via
   `ctx.remote.$mount(...)` and must **NOT** be declared in `inject` (apply-gating
   deadlock — the fiber parks at state 0 forever). Access it per call with
   `ctx.get('remote.vscodeThemes')` + undefined guard. Direct `ctx.remote.<ns>` reads
   only walk the ancestor inject snapshot and throw "without inject". Proven with a
   real-Cordis regression harness at `/workspace/browser/remote-access-test.mjs`.
2. **`apply` must return void/Promise** — returning a Service instance throws
   `TypeError: Invalid effect` (cordis lib:1166). Construct services in block bodies.
3. **TDZ in `apply`** (e.g. `localeDisposer` used before declaration) crashes the
   client module at runtime with no error in `node --check`. Verify manually.
4. **Host files don't hot-reload by default** (`dsh-hmr` `root: []`). This deployment
   has the fix in `$DSH_HOME/cordis.patch.yml`:
   ```yaml
   - id: hmr
     config:
       root:
         - /workspace/dsh-vscode-themes2
   ```
   So host edits to `index.js`/`marketplace.js` now hot-reload; if that override is
   ever reverted, host edits need a container restart. `client.js` always
   hot-reloads via `dsh-client-hmr` (500 ms poll).
5. **Browser refresh ≠ re-read of local `client.js`** — HMR pushes it; verify with:
   SSE graph frame from `GET http://127.0.0.1:3080/plugins/events` for the current
   `rev`, then fetch `http://127.0.0.1:3080/plugins/??@local/dsh-vscode-themes2/client.js&rev=<rev>`
   (the double `?` is literal; use `curl -sg`) and grep for new symbols.

## Local verification recipes

- Marketplace logic in Node (no Cordis needed):
  ```bash
  node -e "import('./marketplace.js').then(async m => {
    const res = await m.searchMarketplace('tokyo night');
    const def = await m.fetchThemeDefinition(res.value[0]);
    console.log(Object.keys(def.tokens)); })"
  ```
- Syntax: `node --check client.js && node --check marketplace.js` (catches syntax
  only — see pitfalls 2–3).

## Session log

- **2026-10-10 (card-accuracy)** — Four follow-ups requested by the user, all in
  `client.js` only:
  - **Card background/border/title bound to the theme's OWN colours.** Previously the
    card chrome used the *applied* theme's tokens (a `.vst-*` class resolves
    `var(--dsw-alias-*)` to the currently-applied theme), so every card looked tinted by
    whichever theme was applied — inaccurate and misleading. Added a new
    `cardSurfaceStyle(tokens, isSelected)` helper that returns an inline `style` with
    `background: <theme bg-base>`, `borderColor: <theme border-l1>`, and the 3px brand
    ring for the active card; both `card()` and `marketCard()` now pass it to the card
    `div`. The title span gets an inline `style={{ color: <theme label-primary> }}` in
    both. `marketCard` guards with `(def && def.tokens) || {}` — before the definition is
    fetched the tokens are `{}` so those styles are `undefined` and React omits them
    (the card falls back to the applied-theme colours while the shimmer shows).
  - **Preview de-boxed so a card reads as a real DSH chat surface.** The preview
    (`.vst-sample`) previously had its own `border:1px solid` + background; now that the
    card background equals the preview background (`bg-base`) that produced a redundant
    nested box. Removed the preview's border + inline background and zeroed its padding
    (`.vst-sample{…padding:0;…}`), so the user/assistant bubbles sit directly on the card's
    own surface. The assistant bubble keeps its own 1px border (a real chat message).
  - **"Apply" text dropped** from both `card()` and `marketCard()` action rows
    (`: h('span',{…},t('apply'))` → `: null`). The action row is never empty because the
    Remove/Uninstall (installed/bundled) or Install (marketplace) button always renders;
    the dead `apply` locale key was removed.
  - **Count line made explicit.** `'count'` locale changed from `"{n} themes"` to
    `"{n} themes installed"`, and a new `'apply.hint'` key (`"click on a theme card to
    preview/apply"`) is appended to the subtitle line, joined with a `"   ·   "`
    separator — e.g. *"28 themes installed   ·   click on a theme card to preview/apply"*.
    (`localThemes` = installed + bundled themes, i.e. the themes the user applies from.)
  - **Verification:** standalone test page (`/tmp/gen-vst.js` — re-synced to the new card
    chrome) + Playwright measurements: every card's bg/border/title now match its theme's
    real tokens (all 14 checked), title-on-background contrast ≥ 4.1:1 (the low ones are
    the theme's own inherent contrast, e.g. Solarized Light+ #657b83 on #fdf6e3 — that IS
    how the theme looks, and accuracy was the goal), preview border = 0px, no "Apply"
    text, assistant-bubble body text contained (overflow=false — a vision claim of
    "text escaping the bubble" was **disproven** by measurement). A generator bug caught
    here: a `${…}` template interpolation had been written as `+(…)+'` JS concatenation,
    silently emitting literal broken `style` text. **Uncommitted, unpushed — delivered
    locally for the user to verify.**

- **2026-10-10 (card polish, follow-up)** — Three small follow-ups on the lean design, all
  in `client.js` only:
  - **Removed the redundant per-card kind labels** (`marketplace` / `installed` badges in
    `marketCard`). The cards already sit in their own "Installed" / "Marketplace" sections,
    so the labels were noise that was truncating the name. The `vst-badge*` CSS was removed
    (dead). The name now gets the full card width (146px) and never truncates.
  - **`×` remove button → a text button** in the same empty-with-border style
    (`.vst-remove-btn` font 14px→11px, `padding 3px 8px`→`4px 9px`). Label is context-aware:
    **"Remove"** for a bundled theme, **"Uninstall"** for an installed (marketplace) theme —
    via a new `removeButton(id, label)` param and locale keys `remove.label` /
    `uninstall.label`. Measured worst case (installed + active card = "Active" pill +
    "Uninstall"): fits on one line, no wrap.
  - **Richer hover tooltip**: each card's `title` is now the **full theme name on line 1**
    and the **description on line 2** (`name + '\n' + description`), so a name that was too
    long to show in full can be read on hover. Applied to both `card()` and `marketCard()`.
  - Verified with Playwright (name full-width 146px, no truncation, Remove button 61px and
    not clipped, all previews exactly 146px wide, worst-case row no-wrap). The OpenRouter
    vision pass flagged "clipped button / uneven preview widths" — **disproven** by the
    objective measurements (button 1px inside padding; preview width uniform). **Uncommitted,
    unpushed — delivered locally for the user to verify.**

- **2026-10-10 (lean design)** — On user request, made the theme cards **lean and compact
  so many more are visible at a glance**. Goal was density (fit more cards without
  scrolling), while **keeping the rendered preview** (a flat colour strip was explicitly
  rejected). All changes are in `client.js` only; host half (`index.js`/`marketplace.js`)
  untouched.
  - **Rendered preview shrunk, not replaced.** `themeSample` now renders just the user
    bubble + AI bubble (with its body text, "Go" button, and ok/warn/err state chips); the
    header row (brand dot/name/badge) and the input row were dropped, and padding/fonts
    shrank (msg 12→10px, btn 11→10px, chip 10→9px, sample padding 8→5px). Preview is 79px
    tall (was ~96px). Every colour is still inline-bound to the card's own tokens.
  - **One search field, two result sections.** The installed/bundled search and the
    marketplace search are consolidated into a single input (`value={query}`,
    `onChange:setQuery`, `ref:marketInputRef`). The controlled state drives the
    client-side filter of local themes; the 1s poll reads the same input via
    `marketInputRef.current.value` (= `query`) to drive marketplace search. Results are
    delineated into **"Installed"** and **"Marketplace"** sections. `market.search.
    placeholder` and the unused `applied` key were removed from the locale.
  - **Prominent active indicator (designed, not inherited).** The applied card gets an
    inline **3px brand ring + glow** (`activeRingStyle`, `box-shadow:0 0 0 3px brand,
    0 4px 18px withAlpha(brand,0.35)`) **plus a filled "● Active" pill** (`activePill`,
    brand background + `contrastOn` text + subtle outline) replacing the old "✓ Applied"
    text. Works for both installed and marketplace cards.
  - **Redundant `colorScheme` badge dropped** from installed cards (the preview background
    already conveys light/dark); names now get full width and no longer truncate
    ("Cappuccin M…" → "Cappuccin Mocha"). The `badges()` helper was removed (market cards
    have their own badges). The description line was removed and moved to the card's
    `title` tooltip.
  - **Density CSS:** `.vst-grid` gap 16→8px, min-col 180→150px; `.vst-card` padding 12→8px,
    gap 8→6px. Result: **card 164×148px**, **5 columns @ 900px**, all 14 bundled cards
    visible without scrolling.
  - **Verification:** standalone test page (`/tmp/gen-vst.js` re-extracts the EXACT CSS +
    `BUNDLED_THEMES` from `client.js`, renders all 14 themes) + Playwright element-box
    measurement (card 164×148, preview 79px, actions row one line, no overflow, no name
    truncation, 5 cols) + OpenRouter vision pass (lean, readable, active indicator clear).
  - **Status: UNCOMMITTED, UNPUSHED** — delivered locally for the user to test; do **not**
    push to the github remote.

- **2026-10-10 (final)** — On user request (lifting the no-push constraint): committed
  the two fixes as `94cc366`, pushed to `origin/main`, and made the repo PUBLIC via the
  GitHub API (`PATCH /repos/… {"private":false}`). Now live at
  https://github.com/zxbc/dsh-vscode-themes2 (unauthenticated access returns 200).
  Auth used the existing PAT stored by the git `store` credential helper; `gh` CLI was
  not installed, so the visibility flip went through `curl` against the REST API.
- **2026-10-10 (later)** — Implemented two more fixes (local only, NOT pushed at the
  time; pushed in the (final) entry above): (3)
  applied-theme persistence across refresh — grace-window (6 s / 200 ms tick)
  re-assertion of `setTheme(currentSelected)` to defeat the async `ThemeRuntime.adopt()`
  override, with `persistSelected` updating `currentSelected` before each apply so a
  user's own switch is never fought, and a stronger `✓ Applied` indicator; (4) rendered
  theme samples replacing the flat swatch strip — `themeSample(theme)` renders a mini
  DSH chat mock in the theme's actual colors via inline `style` token binding, with pure
  `parseRGB`/`contrastOn`/`withAlpha` helpers; marketplace cards reuse the existing
  background prefetch. Verified: `node --check` on all files, 19/19 color-helper unit
  tests, `themeSample` render assertions (all inline-style bindings + empty-token
  fallback), old `previewStrip`/`.vst-swatch` symbols gone.
- **2026-10-10** — Implemented two fixes (local only, NOT pushed): (1) persistence +
  remove — fixed the stale-closure bug (`installedList`/`removedIds` now use lazy
  `useState(() => …)` initializers re-reading localStorage on every mount) and added
  a Remove (×) button + `dsh.vscodeThemes.removed` persistence with applied-theme
  fall-back and re-install un-remove; (2) marketplace card swatches — a `useEffect`
  eagerly fetches each result's `.vsix` definition in the background (3 concurrent,
  de-duplicated) and each card renders a live `previewStrip` from the fetched tokens
  (shimmer until ready). Verified: `node --check` on all files, host imports, all new
  symbols present in the SHIPPED live client bundle (rev a91b282168fc), old
  stale-closure pattern gone, entry enabled (`disabled: false`).
- **2026-10-09** — Full session: wired the marketplace through a correct
  `TypertRemoteService` host half + client self-mount; fixed the
  "cannot get property without inject" deadlock (self-mount contract), the TDZ crash,
  the `Invalid effect` apply return, the per-keystroke search lag (1 s polling +
  change detection), the single-letter 401s (2-char hint gate), and the install JSON
  parse failure (JSONC trailing commas in `stripJsonc`). All confirmed working by the
  user: search, install, preview. Deferred: marketplace card swatches before fetch.
- **2026-10-09 (earlier)** — Restored to working client-only state (14 bundled
  themes) after a broken host rewrite halted web boot; preserved verified marketplace
  logic in `marketplace.js`; reinstalled via `install_bundle`.

## File map

```
client.js        browser UI: search, cards, marketplace section, persistence
index.js         host half: VscodeThemes remote service (search/fetchTheme)
marketplace.js   pure host logic: search/fetch/parse/map (+ stripJsonc, ZIP, colors)
package.json     main=index.js, ./client=client.js, dsh.client web
cordis.patch.yml bundle entry vscode-themes2
locale/en.json   UI strings
icon.svg         bundle icon
PROGRESS.md      this file
```
