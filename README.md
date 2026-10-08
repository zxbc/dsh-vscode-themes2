# VS Code Themes for DeepSeek Harness

Browse and apply popular VS Code color themes to the Harness Web UI. Inspired by the
Hermes agent's trick of making itself compatible with the vast ecosystem of user-created
VS Code themes.

## What it does

- Adds a **"VS Code Themes"** section to **Settings** in the Harness Web UI.
- Shows a curated catalog of **14 popular VS Code themes** (One Dark Pro, Dracula,
  GitHub Light, Nord, Catppuccin Mocha, Tokyo Night, Monokai, Solarized, Kanagawa, …).
- Each theme card shows a **live color-swatch preview** and its light/dark scheme.
- **Search** filters themes by name.
- Clicking a theme **applies it immediately** — the whole UI re-skins live.
- Your selection **persists across restarts** (stored in browser `localStorage`).

## How it works

This is a **Client-only** DSH plugin. The Host half (`index.js`) is a no-op placeholder;
all work happens in the browser half (`client.js`):

1. Registers each bundled theme with `ctx.theme.register({ id, colorScheme, tokens })`.
2. Applies the persisted selection on load via `ctx.theme.setTheme(id)`.
3. Injects a `settings.section` slot containing the theme browser UI.
4. Persists the chosen theme id in `localStorage` under `dsh.vscodeThemes.selected`.

Theme colors are mapped from VS Code's token palette onto DSH's 14 `--dsw-alias-*`
design tokens (backgrounds, borders, brand, labels, and state colors).

## Files

| File | Purpose |
|---|---|
| `index.js` | No-op Host half (satisfies the bundle loader). |
| `client.js` | Browser half: theme catalog, registration, persistence, settings UI. |
| `cordis.patch.yml` | Inserts the `vscode-themes2` entry into the profile tree. |
| `locale/en.json` | Display title/description for the Plugin Manager. |
| `icon.svg` | Plugin icon. |

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
