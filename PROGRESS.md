# dsh-vscode-themes2 — Project Knowledge & Progress

A VS Code theme switcher plugin for the DeepSeek Harness (DSH) Web UI.
**This is a private dev repo — only agents and its author work on it; no release
process.** Update this file at the end of every working session so future sessions
can resume from here.

## Current status — 2026-10-09

**State: FULLY WORKING — user-confirmed.**

- Marketplace search: uncontrolled input polled every 1 s with change detection —
  no per-keystroke queries.
- Single-letter queries never sent; a hint ("Type at least 2 characters to search.")
  is shown instead (the VS Marketplace API answers 1-letter queries with HTTP 401).
- Install: downloads the `.vsix`, parses the theme's colors, maps them onto the 14
  DSW tokens, registers and applies the theme; installed themes persist and sort to
  the top (most recent first).
- Preview of both bundled and installed marketplace themes works.
- Verified themes: 6 Tokyo-Night-family + 4 light themes all convert with 14 tokens.

**Known deferred refinement:** marketplace (not-yet-fetched) theme cards don't show
a color swatch until the theme is fetched; installed/bundled cards already do.

## Architecture (two halves, one plugin identity)

- **`client.js`** (browser half, object form `{inject, apply(ctx)}`) — renders the
  settings section: search box, bundled + installed theme cards (swatch preview,
  badges, apply), "From VS Code Marketplace" section with Install buttons. Persists
  `dsh.vscodeThemes.selected` and `dsh.vscodeThemes.installed` in `localStorage`.
  Registers themes with `ctx.theme.register` on demand.
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
