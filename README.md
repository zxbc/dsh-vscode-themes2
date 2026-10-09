# VS Code Themes for DeepSeek Harness

Browse, search, install, and apply VS Code color themes to the Harness Web UI. Inspired by the
Hermes agent's trick of making itself compatible with the vast ecosystem of user-created
VS Code themes.

## What it does

- Adds a **"VS Code Themes"** section to **Settings** in the Harness Web UI.
- Shows a curated catalog of **14 popular VS Code themes** (One Dark Pro, Dracula,
  GitHub Light, Nord, Catppuccin Mocha, Tokyo Night, Monokai, Solarized, Kanagawa, …).
- Each theme card shows a **live color-swatch preview** and its light/dark scheme.
- **Search** filters the local (installed + bundled) themes by name **and** searches the
  official **VS Code Marketplace** for more themes.
- **Marketplace themes** appear in a separate "From VS Code Marketplace" section, clearly
  marked as **not installed**, with a live swatch preview and an **Install** button.
- **Install** downloads the theme's `.vsix`, extracts its color palette, maps it onto the
  DSW design tokens, and adds it to the top of the list (most recently installed first).
  Installed themes persist across restarts.
- Clicking any theme **applies it immediately** — the whole UI re-skins live.
- Your selection **persists across restarts** (stored in browser `localStorage`).
- A theme that fails to download, parse, or map (e.g. format incompatibility) shows an
  **error message** and is left alone — it never breaks the plugin or the rest of the UI.

## How it works

This is a **two-half** DSH plugin: the browser is network-restricted, so everything that
talks to the VS Code Marketplace runs in the Host half and is exposed to the browser
through a `TypertRemoteService` named `vscodeThemes` (self-mounted by the client via
`ctx.remote.$mount`; never declared in `inject` — see PROGRESS.md for the contract).

- **Browser half (`client.js`)** — renders the settings section, registers themes with
  `ctx.theme.register({ id, colorScheme, tokens })`, applies the persisted selection on
  load, and persists state in `localStorage` (`dsh.vscodeThemes.selected`,
  `dsh.vscodeThemes.installed` — JSON array, most recent first). Marketplace search uses an
  uncontrolled input polled every 1 s with change detection and token-based cancellation;
  queries shorter than 2 characters show a hint instead of hitting the API.
- **Host half (`index.js` + `marketplace.js`)** — `VscodeThemes extends TypertRemoteService`
  exposes `@Remote search(query)` and `@Remote fetchTheme(ext)`, delegating to the pure,
  unit-testable logic in `marketplace.js` (no Cordis wiring).

### Marketplace search

The official source is the **VS Code Marketplace** (`marketplace.visualstudio.com`):

- **Search:** `POST https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`
  with `Accept: application/json;api-version=3.0-preview`. Filters use
  `filterType 5` (category `Themes`) and `filterType 10` (search text).
  Note: the API answers single-letter queries with HTTP 401 — the client gates on
  2+ characters instead.
- **Download:** `GET https://{publisher}.gallery.vsassets.io/_apis/public/gallery/publishers/
  {publisher}/vsextensions/{name}/{version}/vspackage` — returns a `.vsix`.

### Theme extraction

The **host** downloads the `.vsix`, parses the ZIP (central directory +
`DecompressionStream('deflate-raw')`), reads `extension/package.json`
(`contributes.themes[0].path`) and the theme JSON (which is **JSONC** — comments and
trailing commas are stripped before `JSON.parse`), then maps the VS Code `colors` table
onto the 14 `--dsw-alias-*` design tokens. If `editor.background` / `editor.foreground`
are missing or unparseable, the theme is reported as incompatible and skipped.

## For developers: read PROGRESS.md

[`PROGRESS.md`](PROGRESS.md) is the project knowledge base for this private dev repo
(agent-maintained, not release material): current status, full architecture notes, the
marketplace protocol facts, the proven search-UX design, the critical contracts and
pitfalls learned while building it (self-mount contract, `apply` return value, HMR
asymmetry, JSONC), local verification recipes, and the session log. Update it at the end
of every working session.

## Files

| File | Purpose |
|---|---|
| `index.js` | Host half: `VscodeThemes` remote service (`search` / `fetchTheme`). |
| `client.js` | Browser half: theme catalog, marketplace search UI, install, persistence, settings UI. |
| `marketplace.js` | Pure host logic: marketplace search, vsix fetch/parse, token mapping. |
| `cordis.patch.yml` | Inserts the `vscode-themes2` entry into the profile tree. |
| `locale/en.json` | Display title/description for the Plugin Manager. |
| `icon.svg` | Plugin icon. |
| `PROGRESS.md` | Project knowledge base & session log (see above). |

## Install

```bash
# from the profile directory
dsh plugin install /path/to/dsh-vscode-themes2
```

or via the `plugin_manager` tool: `install_bundle target:/path/to/dsh-vscode-themes2`.

> Note: the package is named `@local/dsh-vscode-themes2` (with a trailing `2`) because
> the original `@local/dsh-vscode-themes` specifier got cached as failed in the running
> harness process during development. After a harness restart the clean name could be
> restored.
