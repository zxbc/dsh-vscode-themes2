# dsh-vscode-themes2 — Project Knowledge & Progress

A VS Code theme switcher plugin for the DeepSeek Harness (DSH) Web UI.
**The repo is PUBLIC (github.com/zxbc/dsh-vscode-themes2) and is being prepared for
submission to the DSH Plugin Hub (dsh-plugin.org) — this file is the agent-maintained
development log, not release material.** Update this file at the end of every working
session so future sessions can resume from here.

## Current status — 2026-10-11

**State: FULLY WORKING — user-verified, everything pushed (repo PUBLIC:
https://github.com/zxbc/dsh-vscode-themes2). `origin/main` is up to date with
local `main`. **Hub submission (dsh-plugin.org) — Phase 1 done:** MIT LICENSE +
`"license"` field, public README (install command, screenshots, permissions,
compatibility), all three gallery screenshots committed under `screenshots/`; the full
plan lives in untracked `SUBMISSION_PLAN.md`, remaining phases (GitHub topic,
submission issue) await user review. Since the original four fixes (commit 94cc366): a **lean/compact redesign** (smaller rendered previews, one consolidated
search with Installed + Marketplace sections, a prominent ring+pill "Active"
indicator, dropped the redundant colour-scheme badge) plus a **card-accuracy pass**
(each card's background/border/title bound to that theme's OWN tokens) in
`client.js`; **include-inheritance & shiki tokenColors mapping** in host
`marketplace.js`; **popularity sort + stale-error clearing**; **Active pill restored
across settings-panel close/reopen** (lazy localStorage re-read on every mount); and
**card Install/Uninstall buttons bound to the card's own theme** (element-scoped
`--vst-tk-*` custom properties, incl. hover states). See the 2026-10-10 and
2026-10-11 entries in the session log.**

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

- **2026-10-11 (Hub submission: repo prep, Phase 1)** — User approved the
  dsh-plugin.org submission plan (see untracked `SUBMISSION_PLAN.md`): **MIT**
  license, category **UI & Experience**, commit **all three** screenshots. Executed
  Phase 1 (repo prep):
  - Added `LICENSE` (MIT, © 2026 zxbc) and `"license": "MIT"` in package.json (kept
    `"private": true` — inert for git-spec installs, conservative choice).
  - Moved the gallery screenshots into `screenshots/` with public names:
    `theme-gallery.png` (1280×800, current — Remove action + Active pill),
    `theme-gallery-v2.png` (2240×1800, Apply/Remove pills), `theme-gallery-v1.png`
    (2240×1800, Apply/× text buttons).
  - Rewrote `README.md` as public release material: one-line value, category/license/
    compatibility line, hero + iteration screenshots with captions, the public install
    command `dsh plugin --profile web add github:zxbc/dsh-vscode-themes2` (verified
    working in a scratch profile), local-path install, trimmed dev internals (protocol
    facts live here), Permissions & external services, Compatibility (DSH
    0.2.1-alpha.1; Node 18+ host half), file table incl. LICENSE/screenshots. Fixed
    the "private dev repo" wording here and in this file's header.
  - Fact-check while writing: the bundled catalog is **14** themes (re-counted in
    `client.js`) — the plan draft's "18 bundled" was wrong; corrected in
    SUBMISSION_PLAN.md.
  - Committed + pushed (Phase 1). Remaining: **Phase 2** GitHub topic `dsh-plugin`
    via API, **Phase 3** submission issue in `dshplugin/dsh-plugin-hub` — both only
    after the user reviews SUBMISSION_PLAN.md.
- **2026-10-11 (UX: card buttons obey the card's own theme)** — User-reported nitpick:
  the "Uninstall" button outline on each card rendered in the *applied* theme's
  palette, not the card's — jarring when the two palettes clash. The same clash
  existed on the marketplace "Install" button; both fixed.
  - **Fix (client.js only):** new `themeButtonVars(tokens)` helper exposes the card
    theme's palette as element-scoped CSS custom properties (`--vst-tk-label2`,
    `--vst-tk-border`, `--vst-tk-error`, `--vst-tk-brand`, `--vst-tk-bg`), set inline
    on the button. The `.vst-remove-btn` / `.vst-install-btn` rules (incl. the
    `:hover` states, which previously resolved `--dsw-alias-*` against the applied
    theme) now reference those per-element vars with baked-in fallbacks. This is the
    same inline-binding rationale as the card surface/sample/pill/ring: a plain
    stylesheet `var(--dsw-alias-*)` resolves against the *applied* theme, not the
    card's. `removeButton(id, label)` gained a `tokens` param; call sites pass
    `tk` (marketCard) / `theme.tokens` (installed+bundled cards), and the install
    button gets `style: themeButtonVars(tk)` (null `def` before the background
    fetch lands → CSS fallbacks). Install hover already used the palette-agnostic
    `filter:brightness(1.1)` and is unchanged.
  - **Verified with the extended DOM harness:** pre-seed installed "One Dark"
    (brand #61afef / border #3a3f4b / label2 #9aa4b2), search "dark", then apply a
    bundled theme with a clearly different palette (One Dark Pro: #4d78cc /
    #3e4452 / #abb2bf). Post-switch invariants all PASS: every card's remove-button
    border == its own card border (15 installed + market "One Dark"), and the
    market "Dark Plus" install button's background == its own brand colour and its
    text colour == its own bg-base. Pill regression (stays on the applied theme
    after close+reopen) still passes; zero console errors; `node --check` clean.
  - **Harness gotcha (not a plugin bug):** a bare `input.value = 'x'` on the
    controlled search field is reverted by React on the next render, so the 1 s
    poller saw '' on its following tick and cleared the search again — the harness
    must type via the native value setter + dispatched `input` event (React's
    onChange path) so the value prop tracks it.
  - Live: client-HMR rebuilt the bundle (rev 15791e3c5ca8 → c45cd3a87b7d).
- **2026-10-11 (UX: Active pill lost after closing/reopening the settings panel)** —
  User-reported kink: the "Active" pill appeared correctly right after clicking a
  theme card, but after closing the settings panel and reopening it, the currently
  applied theme no longer showed as active.
  - **Root cause:** `selected` (React state) was initialised from the `selectedId`
    closure variable, which `apply()` reads from localStorage exactly ONCE at plugin
    activation. Closing/reopening the section remounts `ThemeBrowser` WITHOUT
    re-running `apply()` (same shape as the earlier stale-`installed` bug fixed with
    a lazy initializer for `installedList`), so the pill re-anchored to whichever
    theme was selected at activation — or vanished if that theme was since removed.
  - **Fix:** `selected` now uses a lazy `useState` initializer that re-reads
    `STORAGE_KEY` (`dsh.vscodeThemes.selected`, kept in sync by `persistSelected` on
    every apply/preview/install) on every mount, falling back to `selectedId` only
    if localStorage is unavailable. One change in `client.js`; no host changes.
  - **Verified with a DOM harness** (React 18 UMD + the real `client.js`, stubbed
    ctx/remote, Playwright): pre-seed an installed theme as the selection → click a
    different card → unmount/remount (close+reopen). BEFORE: pill reverted to the
    pre-seeded theme while `persisted`/`activeTheme` correctly tracked the clicked
    one; AFTER: pill follows the persisted selection across remounts. Zero console
    errors; `node --check` clean.
  - Live: client-HMR rebuilt the bundle (rev 78cb79fa30b5 → 15791e3c5ca8).
- **2026-10-11 (UX: stale errors + popularity sort)** — Two follow-ups:
  - **Stale error cleared by any successful action.** `marketError` (rendered in
    the slot under the "Marketplace" heading) was only ever set, never cleared on
    success — so a failed apply/preview kept its red error on screen forever until
    the next search. Now `setMarketError('')` runs on every successful apply
    (`selectTheme`), preview (`previewTheme`) and install (`installTheme`), so the
    error always reflects the most recent action only.
  - **Marketplace results sorted by popularity.** Verified first: the API request
    sent no `Sort` and the API *ignores* `Sort` fields anyway (tested
    `Sort=DownloadCount` / `Sort=AvgRating` — identical order); the default order
    is relevance-ish and buries popular themes (e.g. a 79k-install theme ranked #2
    above a 7.3M-install one). Also discovered: `flags: 255` omits popularity data,
    while the **0x100 bit (flags 511)** switches on the per-extension `statistics`
    array (`install`, `averagerating`, `ratingcount`, `trending*`,
    `downloadCount`, ...). `searchMarketplace` now sends `flags: 511`, adds
    `installs` + `averageRating` to each result, and sorts installs desc → rating
    desc → display name asc (host-side, client untouched). E2E: "dark" now leads
    with One Dark Pro (12.8M) / Atom One Dark (7.3M) / Nomo Dark (1.2M); "light"
    with Monokai Pro (4.1M) / Winter is Coming (3.8M). Order-check PASS on both.
  - Note: the API also ignores `size` and returns up to 1000 items per search
    (pre-existing behaviour; popularity sort now puts the good ones first — capping
    the result count is a possible follow-up if the user wants it).
  - Live: client.js rebuilt by client-HMR (bundle rev b816cd2409a6 →
    78cb79fa30b5); marketplace.js hot-swapped via the host partialReload.
- **2026-10-11** — Ported the include-inheritance + shiki tokenColors prototype into
  the real plugin (host-side `marketplace.js` only; `client.js`, `index.js` and the
  `{id,name,colorScheme,tokens,publisher,version}` return contract unchanged):
  - **`resolveIncludes(themeObj, themePath, readFile)`** — follows the VS Code
    `include` chain (path relative to the theme file's directory inside the .vsix;
    child wins on `colors`; `tokenColors` = [base..., child...] so later rules win;
    cycle-guarded, depth-capped at 8; a missing target warns and stops the chain
    instead of crashing). Base files are read from the same in-memory zip buffer —
    no second download.
  - **`mapTokenColorsToShiki(theme)`** — maps tokenColors onto the nine
    `--shiki-token-*` vars (keyword, string, string-expression, comment, constant,
    function, parameter, punctuation, link) the web shiki highlighter consumes;
    they ride in the same `tokens` map as the dsw aliases and are applied as inline
    body styles by ThemePresenter (no runtime/theme-sheet changes needed).
  - `fetchThemeDefinition` now: parse → resolve includes → map dsw aliases on the
    MERGED colors → return dsw aliases + shiki tokens (no key collision:
    `--dsw-alias-*` vs `--shiki-token-*`).
  - Why: include-dependent packages (fresh-material, wow-bundle, railgun,
    ocean-space, Amethyst Dark HC, kanagawa-black, ...) previously installed with
    empty/partial palettes or crashed. Prototype E2E over 11 real .vsix archives /
    38 themes: 18 OK before → 37 OK after. Only remaining failure: One Dark Pro
    Monokai Darker (no `editor.foreground` anywhere — pre-existing
    `mapToDswTokens` strictness, intentionally unchanged).
  - Verified: `node --check`; unit tests (child-wins, chain depth 3, later-rule-
    wins); E2E through the INSTALLED profile path — dracula dsw=13 shiki=9,
    wow-bundle "Dark+ (WoW)" dsw=13 shiki=8, fresh-material shiki=7, kanagawa-
    black bg=#000 (child override) — every number matches the prototype's
    prediction. Live server: the `hmr.root` entry in $DSH_HOME/cordis.patch.yml
    already covers this repo; touching the file triggers partialReload, which
    re-imports the entry (index.js) and recreates the service fiber with the new
    module graph (verified against dsh-hmr source — a changed dependency is
    enough to pull its importer entry into the re-import).
  - Committed locally on `main`; NOT pushed (user tests first).
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
