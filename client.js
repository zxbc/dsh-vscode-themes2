window.__ModuleLoader__.load({
  id: 'dsh-vscode-themes2',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // ---- color helpers for the rendered theme sample (pure, no React) -------
    // Parse a CSS color into [r, g, b] (0–255) or null. Handles #rgb, #rrggbb,
    // #rrggbbaa, rgb() and rgba(). Used to derive legible contrast text + tints.
    function parseRGB(color) {
      if (!color) return null;
      const s = String(color).trim();
      if (s[0] === '#') {
        let hex = s.slice(1);
        if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
        if (hex.length < 6) return null;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if ([r, g, b].some((v) => Number.isNaN(v))) return null;
        return [r, g, b];
      }
      const m = s.match(/rgba?\(\s*(\d+)\s*[\s,]+\s*(\d+)\s*[\s,]+\s*(\d+)/);
      if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
      return null;
    }
    // Pick legible text color (near-black or white) for a given background.
    function contrastOn(color) {
      const rgb = parseRGB(color);
      if (!rgb) return '#ffffff';
      const [r, g, b] = rgb;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.62 ? '#111318' : '#ffffff';
    }
    // Legible text colour for the applied theme's brand colour, read live from
    // the CSS custom property so the Update button stays readable on any theme.
    function onBrandColor() {
      try {
        // The DSW tokens are scoped to <body>, not <html> — check both.
        for (const root of [document.body, document.documentElement]) {
          const brand = getComputedStyle(root)
            .getPropertyValue('--dsw-alias-brand-primary').trim();
          if (brand) return contrastOn(brand);
        }
        return contrastOn('#4d78cc');
      } catch (_) {
        return '#ffffff';
      }
    }
    // Return `color` with an explicit alpha (hex → 8-digit, rgb → rgba).
    function withAlpha(color, alpha) {
      if (!color) return 'transparent';
      const s = String(color).trim();
      const a = Math.max(0, Math.min(1, alpha));
      const aa = Math.round(a * 255).toString(16).padStart(2, '0');
      if (s[0] === '#') {
        let hex = s.slice(1);
        if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
        if (hex.length < 6) return s;
        return '#' + hex.slice(0, 6) + aa;
      }
      if (s.startsWith('rgba(')) {
        const parts = s.slice(5, -1).split(',');
        parts[3] = String(a);
        return 'rgba(' + parts.join(',') + ')';
      }
      if (s.startsWith('rgb(')) {
        const parts = s.slice(4, -1).split(',');
        parts.push(String(a));
        return 'rgba(' + parts.join(',') + ')';
      }
      return s;
    }

    // Marketplace bridge: the host exposes `search` and `fetchTheme` as a Typert
    // Remote service (namespace `vscodeThemes`). We mount a strict codec for each
    // method so the gateway validates our inputs and the results pass through as
    // plain JSON. `create()` only needs to return `{ parse }` — the registry does
    // not require a zod instance for hand-written contributions — so we use a
    // pass-through schema and avoid importing zod into the client bundle.
    const PKG = 'dsh-vscode-themes2';
    const REPO_URL = 'https://github.com/zxbc/dsh-vscode-themes2';
    const PASS_THROUGH = { parse: (v) => v };
    const codec = (typeSymbol) => ({ mode: 'strict', typeSymbol, create: () => PASS_THROUGH });
    const MARKETPLACE_CONTRIBUTION = {
      package: PKG,
      descriptors: [
        {
          id: PKG + '#vscodeThemes/search',
          service: 'vscodeThemes',
          namespace: 'vscodeThemes',
          method: 'search',
          invocation: { kind: 'direct' },
          parameters: [
            { name: 'query', wire: 'query', source: 'json', codec: codec(PKG + '#vscodeThemes/search:query') },
          ],
          result: codec(PKG + '#vscodeThemes/search:result'),
        },
        {
          id: PKG + '#vscodeThemes/fetchTheme',
          service: 'vscodeThemes',
          namespace: 'vscodeThemes',
          method: 'fetchTheme',
          invocation: { kind: 'direct' },
          parameters: [
            { name: 'ext', wire: 'ext', source: 'json', codec: codec(PKG + '#vscodeThemes/fetchTheme:ext') },
          ],
          result: codec(PKG + '#vscodeThemes/fetchTheme:result'),
        },
        // Update feature: no-parameter methods, so the self-mount needs no strict
        // parameter codecs — results pass through as plain JSON.
        {
          id: PKG + '#vscodeThemes/checkUpdate',
          service: 'vscodeThemes',
          namespace: 'vscodeThemes',
          method: 'checkUpdate',
          invocation: { kind: 'direct' },
          parameters: [],
          result: codec(PKG + '#vscodeThemes/checkUpdate:result'),
        },
        {
          id: PKG + '#vscodeThemes/applyUpdate',
          service: 'vscodeThemes',
          namespace: 'vscodeThemes',
          method: 'applyUpdate',
          invocation: { kind: 'direct' },
          parameters: [],
          result: codec(PKG + '#vscodeThemes/applyUpdate:result'),
        },
      ],
    };

    // Curated VS Code themes pre-mapped to DSW tokens (built at authoring time).
    const BUNDLED_THEMES = [
  {
    "id": "vscode-zhuangtongfa-material-theme",
    "name": "One Dark Pro",
    "source": "zhuangtongfa.Material-theme",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#282c34",
      "--dsw-alias-bg-layer-1": "#21252b",
      "--dsw-alias-bg-layer-2": "#21252b",
      "--dsw-alias-bg-overlay": "#21252b",
      "--dsw-alias-border-l1": "#3e4452",
      "--dsw-alias-border-l2": "#3e4452",
      "--dsw-alias-brand-primary": "#4d78cc",
      "--dsw-alias-label-primary": "#abb2bf",
      "--dsw-alias-label-secondary": "#abb2bf",
      "--dsw-alias-state-error-primary": "#c24038",
      "--dsw-alias-state-idle-primary": "#abb2bf8c",
      "--dsw-alias-state-success-primary": "#109868",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#21252b"
    }
  },
  {
    "id": "vscode-dracula-theme-theme-dracula",
    "name": "Dracula",
    "source": "dracula-theme.theme-dracula",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#282A36",
      "--dsw-alias-bg-layer-1": "#21222C",
      "--dsw-alias-bg-layer-2": "#21222C",
      "--dsw-alias-bg-overlay": "#282A36",
      "--dsw-alias-border-l1": "#6272A4",
      "--dsw-alias-border-l2": "#BD93F9",
      "--dsw-alias-brand-primary": "#FF79C6",
      "--dsw-alias-label-primary": "#F8F8F2",
      "--dsw-alias-label-secondary": "#F8F8F2",
      "--dsw-alias-state-error-primary": "#FF5555",
      "--dsw-alias-state-idle-primary": "#F8F8F28c",
      "--dsw-alias-state-success-primary": "#50FA7B80",
      "--dsw-alias-state-warn-primary": "#8BE9FD",
      "--dsw-specific-sidebar-fill": "#21222C"
    }
  },
  {
    "id": "vscode-github-github-vscode-theme",
    "name": "GitHub Light",
    "source": "GitHub.github-vscode-theme",
    "colorScheme": "light",
    "tokens": {
      "--dsw-alias-bg-base": "#fff",
      "--dsw-alias-bg-layer-1": "#f6f8fa",
      "--dsw-alias-bg-layer-2": "#f6f8fa",
      "--dsw-alias-bg-overlay": "#f6f8fa",
      "--dsw-alias-border-l1": "#2188ff",
      "--dsw-alias-border-l2": "#e1e4e8",
      "--dsw-alias-brand-primary": "#2188ff",
      "--dsw-alias-label-primary": "#24292e",
      "--dsw-alias-label-secondary": "#6a737d",
      "--dsw-alias-state-error-primary": "#cb2431",
      "--dsw-alias-state-idle-primary": "#6a737d8c",
      "--dsw-alias-state-success-primary": "#28a745",
      "--dsw-alias-state-warn-primary": "#f9c513",
      "--dsw-specific-sidebar-fill": "#f6f8fa"
    }
  },
  {
    "id": "vscode-arcticicestudio-nord-visual-studio-code",
    "name": "Nord",
    "source": "arcticicestudio.nord-visual-studio-code",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#2e3440",
      "--dsw-alias-bg-layer-1": "#2e3440",
      "--dsw-alias-bg-layer-2": "#2e3440",
      "--dsw-alias-bg-overlay": "#3b4252",
      "--dsw-alias-border-l1": "#3b4252",
      "--dsw-alias-border-l2": "#3b4252",
      "--dsw-alias-brand-primary": "#88c0d0",
      "--dsw-alias-label-primary": "#d8dee9",
      "--dsw-alias-label-secondary": "#d8dee9e6",
      "--dsw-alias-state-error-primary": "#bf616a",
      "--dsw-alias-state-idle-primary": "#d8dee98c",
      "--dsw-alias-state-success-primary": "#a3be8c",
      "--dsw-alias-state-warn-primary": "#ebcb8b",
      "--dsw-specific-sidebar-fill": "#2e3440"
    }
  },
  {
    "id": "vscode-catppuccin-catppuccin-vsc",
    "name": "Catppuccin Mocha",
    "source": "Catppuccin.catppuccin-vsc",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#1e1e2e",
      "--dsw-alias-bg-layer-1": "#181825",
      "--dsw-alias-bg-layer-2": "#181825",
      "--dsw-alias-bg-overlay": "#181825",
      "--dsw-alias-border-l1": "#cba6f7",
      "--dsw-alias-border-l2": "#585b70",
      "--dsw-alias-brand-primary": "#cba6f7",
      "--dsw-alias-label-primary": "#cdd6f4",
      "--dsw-alias-label-secondary": "#cdd6f4",
      "--dsw-alias-state-error-primary": "#f38ba8",
      "--dsw-alias-state-idle-primary": "#cdd6f48c",
      "--dsw-alias-state-success-primary": "#a6e3a1",
      "--dsw-alias-state-warn-primary": "#fab387",
      "--dsw-specific-sidebar-fill": "#181825"
    }
  },
  {
    "id": "vscode-avetis-tokyo-night",
    "name": "Tokyo Gogh Alt",
    "source": "Avetis.tokyo-night",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#1a1b26",
      "--dsw-alias-bg-layer-1": "#1d1f2d",
      "--dsw-alias-bg-layer-2": "#1d1f2d",
      "--dsw-alias-bg-overlay": "#141520",
      "--dsw-alias-border-l1": "#414868",
      "--dsw-alias-border-l2": "#8d92ab10",
      "--dsw-alias-brand-primary": "#b8364f",
      "--dsw-alias-label-primary": "#c0caf5",
      "--dsw-alias-label-secondary": "#c0caf5",
      "--dsw-alias-state-error-primary": "#f77676",
      "--dsw-alias-state-idle-primary": "#c0caf58c",
      "--dsw-alias-state-success-primary": "#5b8430",
      "--dsw-alias-state-warn-primary": "#d79a42",
      "--dsw-specific-sidebar-fill": "#1d1f2d"
    }
  },
  {
    "id": "vscode-monokai-theme-monokai-pro-vscode",
    "name": "Monokai Classic",
    "source": "monokai.theme-monokai-pro-vscode",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#272822",
      "--dsw-alias-bg-layer-1": "#1d1e19",
      "--dsw-alias-bg-layer-2": "#3b3c35",
      "--dsw-alias-bg-overlay": "#3b3c35",
      "--dsw-alias-border-l1": "#6e7066",
      "--dsw-alias-border-l2": "#161613",
      "--dsw-alias-brand-primary": "#e6db74",
      "--dsw-alias-label-primary": "#fdfff1",
      "--dsw-alias-label-secondary": "#919288",
      "--dsw-alias-state-error-primary": "#f92672",
      "--dsw-alias-state-idle-primary": "#9192888c",
      "--dsw-alias-state-success-primary": "#a6e22e",
      "--dsw-alias-state-warn-primary": "#fd971f",
      "--dsw-specific-sidebar-fill": "#1d1e19"
    }
  },
  {
    "id": "vscode-solarizedone-solarized-one",
    "name": "Solarized One",
    "source": "SolarizedOne.solarized-one",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#1f2126",
      "--dsw-alias-bg-layer-1": "#1f2126",
      "--dsw-alias-bg-layer-2": "#1f2126",
      "--dsw-alias-bg-overlay": "#21252B",
      "--dsw-alias-border-l1": "#21252B",
      "--dsw-alias-border-l2": "#21252B",
      "--dsw-alias-brand-primary": "#21252B",
      "--dsw-alias-label-primary": "#839496",
      "--dsw-alias-label-secondary": "#93a1a1",
      "--dsw-alias-state-error-primary": "#ffeaea",
      "--dsw-alias-state-idle-primary": "#93a1a18c",
      "--dsw-alias-state-success-primary": "#4ed17e",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#1f2126"
    }
  },
  {
    "id": "vscode-cweijan-onedark-modern",
    "name": "One Dark Modern",
    "source": "cweijan.onedark-modern",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#282c34",
      "--dsw-alias-bg-layer-1": "#21252b",
      "--dsw-alias-bg-layer-2": "#21252b",
      "--dsw-alias-bg-overlay": "#21252b",
      "--dsw-alias-border-l1": "#3e4452",
      "--dsw-alias-border-l2": "#3e4452",
      "--dsw-alias-brand-primary": "#4d78cc",
      "--dsw-alias-label-primary": "#abb2bf",
      "--dsw-alias-label-secondary": "#6f7784",
      "--dsw-alias-state-error-primary": "#c45f56",
      "--dsw-alias-state-idle-primary": "#6f77848c",
      "--dsw-alias-state-success-primary": "#109868",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#21252b"
    }
  },
  {
    "id": "vscode-qufiwefefwoyn-kanagawa",
    "name": "Kanagawa",
    "source": "qufiwefefwoyn.kanagawa",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#1F1F28",
      "--dsw-alias-bg-layer-1": "#1F1F28",
      "--dsw-alias-bg-layer-2": "#1f1f28",
      "--dsw-alias-bg-overlay": "#1F1F28",
      "--dsw-alias-border-l1": "#223249",
      "--dsw-alias-border-l2": "#16161D",
      "--dsw-alias-brand-primary": "#658594",
      "--dsw-alias-label-primary": "#DCD7BA",
      "--dsw-alias-label-secondary": "#DCD7BA",
      "--dsw-alias-state-error-primary": "#E82424",
      "--dsw-alias-state-idle-primary": "#DCD7BA8c",
      "--dsw-alias-state-success-primary": "#76946A",
      "--dsw-alias-state-warn-primary": "#FF9E3B",
      "--dsw-specific-sidebar-fill": "#1F1F28"
    }
  },
  {
    "id": "vscode-ryanolsonx-solarized",
    "name": "Solarized Light+",
    "source": "ryanolsonx.solarized",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#fdf6e3",
      "--dsw-alias-bg-layer-1": "#00212b",
      "--dsw-alias-bg-layer-2": "#00212b",
      "--dsw-alias-bg-overlay": "#004052",
      "--dsw-alias-border-l1": "#2aa19899",
      "--dsw-alias-border-l2": "#2b2b4a",
      "--dsw-alias-brand-primary": "#2aa19899",
      "--dsw-alias-label-primary": "#657b83",
      "--dsw-alias-label-secondary": "#93a1a1",
      "--dsw-alias-state-error-primary": "#ffeaea",
      "--dsw-alias-state-idle-primary": "#93a1a18c",
      "--dsw-alias-state-success-primary": "#4ed17e",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#00212b"
    }
  },
  {
    "id": "vscode-whizkydee-material-palenight-theme",
    "name": "Palenight Italic",
    "source": "whizkydee.material-palenight-theme",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#292D3E",
      "--dsw-alias-bg-layer-1": "#292D3E",
      "--dsw-alias-bg-layer-2": "#31364a",
      "--dsw-alias-bg-overlay": "#292D3E",
      "--dsw-alias-border-l1": "#282B3C",
      "--dsw-alias-border-l2": "#282B3C",
      "--dsw-alias-brand-primary": "#7e57c2",
      "--dsw-alias-label-primary": "#BFC7D5",
      "--dsw-alias-label-secondary": "#6C739A",
      "--dsw-alias-state-error-primary": "#EF5350",
      "--dsw-alias-state-idle-primary": "#6C739A8c",
      "--dsw-alias-state-success-primary": "#9CCC65",
      "--dsw-alias-state-warn-primary": "#FFCA28",
      "--dsw-specific-sidebar-fill": "#292D3E"
    }
  },
  {
    "id": "vscode-vscode-theme-solarized-dark",
    "name": "Solarized (dark)",
    "source": "vscode.theme-solarized-dark",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#002B36",
      "--dsw-alias-bg-layer-1": "#00212B",
      "--dsw-alias-bg-layer-2": "#00212B",
      "--dsw-alias-bg-overlay": "#004052",
      "--dsw-alias-border-l1": "#2AA19899",
      "--dsw-alias-border-l2": "#2b2b4a",
      "--dsw-alias-brand-primary": "#2AA19899",
      "--dsw-alias-label-primary": "#839496",
      "--dsw-alias-label-secondary": "#93A1A1",
      "--dsw-alias-state-error-primary": "#ffeaea",
      "--dsw-alias-state-idle-primary": "#93A1A18c",
      "--dsw-alias-state-success-primary": "#4ed17e",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#00212B"
    }
  },
  {
    "id": "vscode-vscode-theme-kimbie-dark",
    "name": "Kimbie Dark",
    "source": "vscode.theme-kimbie-dark",
    "colorScheme": "dark",
    "tokens": {
      "--dsw-alias-bg-base": "#221a0f",
      "--dsw-alias-bg-layer-1": "#362712",
      "--dsw-alias-bg-layer-2": "#131510",
      "--dsw-alias-bg-overlay": "#221a14",
      "--dsw-alias-border-l1": "#a57a4c",
      "--dsw-alias-border-l2": "#a57a4c",
      "--dsw-alias-brand-primary": "#6e583b",
      "--dsw-alias-label-primary": "#d3af86",
      "--dsw-alias-label-secondary": "#CCCCCC",
      "--dsw-alias-state-error-primary": "#f48771",
      "--dsw-alias-state-idle-primary": "#d3af868c",
      "--dsw-alias-state-success-primary": "#4ed17e",
      "--dsw-alias-state-warn-primary": "#d19a66",
      "--dsw-specific-sidebar-fill": "#362712"
    }
  }
];


    function themeId(ext) {
      return 'vscode-' + String(ext.publisher).toLowerCase() + '-' + String(ext.name).toLowerCase();
    }


    // ------------------------------------------------------------------
    // Persistence of user-installed marketplace themes
    // ------------------------------------------------------------------
    const INSTALLED_KEY = 'dsh.vscodeThemes.installed';

    function loadInstalled() {
      try {
        const raw = localStorage.getItem(INSTALLED_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return [];
        return list
          .filter((x) => x && x.id && x.tokens)
          .sort((a, b) => (b.installedAt || 0) - (a.installedAt || 0));
      } catch (_) {
        return [];
      }
    }

    function saveInstalled(list) {
      try {
        localStorage.setItem(INSTALLED_KEY, JSON.stringify(list));
      } catch (err) {
        console.error('vscode-themes saveInstalled failed', err);
      }
    }

    // Recover the marketplace extension name from an installed theme's id. The
    // id is 'vscode-<publisher>-<name>' (both lowercased); the def stores the
    // publisher but not the bare extension name, so it is only recoverable from
    // the id. Returns '' if the id does not carry the expected prefix.
    function extNameFromId(th) {
      const prefix = 'vscode-' + String(th.publisher || '').toLowerCase() + '-';
      const id = String(th.id || '');
      return id.startsWith(prefix) ? id.slice(prefix.length) : '';
    }

    // ------------------------------------------------------------------
    // Persistence of themes the user has removed (bundled or installed).
    // Removing a theme filters it out of the list so the user can debloat
    // both the installed set and the bundled set.
    // ------------------------------------------------------------------
    const REMOVED_KEY = 'dsh.vscodeThemes.removed';

    function loadRemoved() {
      try {
        const raw = localStorage.getItem(REMOVED_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return [];
        return list.filter((x) => typeof x === 'string' && x);
      } catch (_) {
        return [];
      }
    }

    function saveRemoved(list) {
      try {
        localStorage.setItem(REMOVED_KEY, JSON.stringify(list));
      } catch (err) {
        console.error('vscode-themes saveRemoved failed', err);
      }
    }

    // ------------------------------------------------------------------
    // Favorites: themes the user starred. A starred theme gets a filled star
    // on its card and is listed at the front of the grid. Persisted to
    // localStorage like the installed list.
    // ------------------------------------------------------------------
    const FAVORITES_KEY = 'dsh.vscodeThemes.favorites';

    function loadFavorites() {
      try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return [];
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return [];
        return list.filter((x) => typeof x === 'string' && x);
      } catch (_) {
        return [];
      }
    }

    function saveFavorites(list) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
      } catch (err) {
        console.error('vscode-themes saveFavorites failed', err);
      }
    }

    const NS = 'vscode-themes';
    const ENTRY_ID = 'vscode-themes';

    // Marketplace search pacing: the input is uncontrolled and polled once a
    // second; a search fires only when the value changed since the last tick.
    // Queries shorter than 2 characters are never sent (the marketplace
    // answers single-letter searches with 401) — a hint is shown instead.
    const MARKET_POLL_MS = 1000;
    const MARKET_MIN_QUERY_LEN = 2;

    return {
      // Note: we deliberately do NOT declare `remote.vscodeThemes` in inject.
      // A plugin parks on unresolvable injects and only runs `apply` once every
      // inject resolves — but this plugin's own `apply` is what mounts the
      // namespace, so declaring it would deadlock activation. The namespace is
      // therefore resolved per call with `ctx.get('remote.vscodeThemes')`.
      inject: ['slots', 'theme', 'locale', 'timer', 'remote'],
      async apply(ctx) {
        // Hold the locale disposer so a re-activation (e.g. the `remote` host
        // service toggling during a settings-page sync) disposes the prior
        // registration before `apply` runs again. Without this, the second
        // `locale.register` throws "namespace already has locale".
        let localeDisposer = null;
        const t = ctx.locale.bind(NS);

        localeDisposer = ctx.locale.register(NS, 'en', {
          'section.title': 'VS Code Themes',
          'search.placeholder': 'Search installed & marketplace themes…',
          'active': 'Active',
          'installed': 'installed',
          'no.results': 'No themes match your search.',
          'count': '{n} themes installed',
          'apply.hint': 'click on a theme card to preview/apply',
          'scheme.dark': 'dark',
          'scheme.light': 'light',
          'installed.section': 'Installed',
          'market.section': 'Marketplace',
          'market.sort.label': 'Sort marketplace results',
          'market.sort.popular': 'Most popular',
          'market.sort.rated': 'Highest rated',
          'market.sort.trending': 'Trending',
          'market.sort.updated': 'Recently updated',
          'market.sort.newest': 'Newest',
          'market.empty': 'Search to discover themes from the VS Code Marketplace.',
          'market.busy': 'Searching…',
          'market.mountError': 'Marketplace search is unavailable right now.',
          'market.install': 'Install',
          'market.installing': 'Fetching…',
          'market.error': 'Could not fetch this theme.',
          'market.minChars': 'Type at least 2 characters to search.',
          'remove': 'Remove this theme',
          'remove.label': 'Remove',
          'favorite': 'Favorite this theme',
          'unfavorite': 'Remove favorite',
          'uninstall.label': 'Uninstall',
          'update.available': 'Update available: {version}',
          'update.upToDate': 'Up to date',
          'update.now': 'Update',
          'update.updating': 'Updating…',
          'update.success': 'Updated to {version}',
          'update.error': 'Update failed: {error}',
          'github.link': 'GitHub',
        });

        const themeDisposers = [];
        const registeredIds = new Set();

        function registerTheme(theme) {
          if (registeredIds.has(theme.id)) return;
          try {
            const d = ctx.theme.register({ id: theme.id, colorScheme: theme.colorScheme, tokens: theme.tokens });
            themeDisposers.push(d);
            registeredIds.add(theme.id);
          } catch (err) {
            registeredIds.add(theme.id);
            console.error('vscode-themes register failed', theme.id, err);
          }
        }

        let installed = loadInstalled();
        for (const theme of BUNDLED_THEMES) registerTheme(theme);
        for (const theme of installed) registerTheme(theme);

        const STORAGE_KEY = 'dsh.vscodeThemes.selected';
        // Tracks the latest persisted selection so the boot-race re-assertion
        // below never fights a user-initiated switch. Updated by persistSelected.
        let currentSelected = '';
        let selectedId = '';
        try { selectedId = localStorage.getItem(STORAGE_KEY) || ''; } catch (_) {}
        if (selectedId && registeredIds.has(selectedId)) {
          try { ctx.theme.setTheme(selectedId); } catch (_) {}
        }
        currentSelected = selectedId;

        // The theme service adopts its persisted built-in preference
        // (light/dark/system) from the settings scope asynchronously AFTER boot,
        // which reverts a custom selection — and a custom id never persists there
        // (the scope's `preference` field only accepts light/dark/system, and
        // setTheme() writes that scope only for built-in ids). So we make the
        // selection stick by re-asserting it, for a short grace window, whenever
        // the resolved theme is not ours. We poll the live snapshot (a
        // cross-plugin `theme/change` listener is not guaranteed to reach our
        // context) and compare against the LATEST selection so a user switch is
        // never fought. After the window the DSH appearance controls work again.
        const REASSERT_WINDOW_MS = 6000;
        const REASSERT_TICK_MS = 200;
        const reassertStarted = Date.now();
        const reassertTimer = setInterval(() => {
          if (Date.now() - reassertStarted >= REASSERT_WINDOW_MS) {
            clearInterval(reassertTimer);
            return;
          }
          const want = currentSelected;
          if (!want || !registeredIds.has(want)) return;
          let activeId = null;
          try {
            const snap = ctx.theme.getTheme && ctx.theme.getTheme();
            activeId = snap && snap.active && snap.active.id;
          } catch (_) { /* theme service not ready yet */ }
          if (activeId && activeId !== want) {
            try { ctx.theme.setTheme(want); } catch (_) {}
          }
        }, REASSERT_TICK_MS);

        // Mount the marketplace Remote service defensively. If the mount fails
        // (e.g. host service missing) we degrade to bundled-only themes instead
        // of breaking the whole section; `marketMountError` surfaces the reason.
        let unmountMarketplace = null;
        let marketplaceError = '';
        try {
          unmountMarketplace = await ctx.remote.$mount(MARKETPLACE_CONTRIBUTION);
        } catch (err) {
          marketplaceError = String(err && err.message || err);
        }
        const marketAvailable = unmountMarketplace !== null;
        const marketMountError = marketplaceError;

        // Update check on every plugin load: compare the installed version
        // against the live GitHub repo. A failure only hides the update UI; it
        // must never break the section. `updateInfo` is a closure `let` so the
        // update handler can refresh it and force a re-render via updateTick.
        let updateInfo = { local: '', latest: '', hasUpdate: false, repoUrl: REPO_URL, error: '' };
        try {
          const ns = ctx.get('remote.vscodeThemes');
          if (!ns) updateInfo.error = 'update namespace is not mounted';
          else {
            const res = await ns.checkUpdate();
            if (res.ok) updateInfo = { ...res.value, error: '' };
            else updateInfo.error = String(res.error && res.error.message || res.error);
          }
        } catch (err) {
          updateInfo.error = String(err && err.message || err);
        }

        function persistSelected(id) {
          // Update the re-assertion tracker FIRST, before the caller applies the
          // theme, so the boot-race re-assertion never reverts a fresh switch.
          currentSelected = id || '';
          try {
            if (id) localStorage.setItem(STORAGE_KEY, id);
            else localStorage.removeItem(STORAGE_KEY);
          } catch (err) {
            console.error('vscode-themes persist failed', err);
          }
        }

        function ThemeBrowser() {
          const [query, setQuery] = React.useState('');
          // Re-read localStorage on EVERY mount (lazy initializer), the same
          // pattern as `installedList` below: the `selectedId` closure variable
          // is captured once at apply() time and goes stale after an in-session
          // switch, so remounting the section (settings panel closed and
          // reopened) would show the Active pill on the theme that was selected
          // when the plugin first activated, not the one actually applied.
          const [selected, setSelected] = React.useState(() => {
            try { return localStorage.getItem(STORAGE_KEY) || selectedId; } catch (_) { return selectedId; }
          });
          // Re-read localStorage on EVERY mount (lazy initializer). The `installed`
          // closure variable is captured once at apply() time and is stale after an
          // install — initializing from it is why installed themes vanished when the
          // settings section was closed and reopened.
          const [installedList, setInstalledList] = React.useState(() => loadInstalled());
          const [removedIds, setRemovedIds] = React.useState(() => new Set(loadRemoved()));
          // Starred themes, re-read from localStorage on every mount (same
          // pattern as installedList) so reopening the section restores stars.
          const [favoriteIds, setFavoriteIds] = React.useState(() => new Set(loadFavorites()));

          function toggleFavorite(id) {
            const next = new Set(favoriteIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            saveFavorites([...next]);
            setFavoriteIds(next);
          }

          // Marketplace state (only active when the Remote mount succeeded).
          const [marketQuery, setMarketQuery] = React.useState('');
          const [marketResults, setMarketResults] = React.useState([]);
          // Marketplace result sort option. 'popular' is the default (the order
          // the host already returns: installs desc → rating desc → name asc).
          const [marketSort, setMarketSort] = React.useState('popular');
          const [marketBusy, setMarketBusy] = React.useState(false);
          const [marketError, setMarketError] = React.useState(marketMountError);
          const [marketShort, setMarketShort] = React.useState(false);
          const [pendingIds, setPendingIds] = React.useState(new Set());
          // Fetched token sets for marketplace results, keyed by theme id — used to
          // render a live color-swatch preview on each marketplace card.
          const [marketTokens, setMarketTokens] = React.useState(Object.create(null));
          const marketFetchedRef = React.useRef(Object.create(null));
          const fetchedCache = React.useRef(Object.create(null));
          const marketInputRef = React.useRef(null);
          const marketSeenRef = React.useRef('');
          const searchTokenRef = React.useRef(0);

          // Update-feature UI state. `updateAction` drives the button label and
          // the success/failure line; `updateTick` forces a re-render after the
          // closure `updateInfo` is refreshed by runUpdate().
          const [updateAction, setUpdateAction] = React.useState({ phase: 'idle', message: '' });
          const [updateTick, setUpdateTick] = React.useState(0);

          async function runUpdate() {
            setUpdateAction({ phase: 'updating', message: '' });
            try {
              const ns = ctx.get('remote.vscodeThemes');
              if (!ns) throw new Error('update namespace is not mounted');
              const res = await ns.applyUpdate();
              if (!res.ok) throw new Error(String(res.error && res.error.message || res.error));
              // Re-check so the "update available" alert reflects the fresh version.
              const chk = await ns.checkUpdate();
              if (chk.ok) updateInfo = { ...chk.value, error: '' };
              setUpdateTick((x) => x + 1);
              setUpdateAction({ phase: 'success', message: t('update.success', { version: res.value.version }) });
            } catch (err) {
              setUpdateAction({ phase: 'error', message: t('update.error', { error: String(err && err.message || err) }) });
            }
          }

          async function runSearch(mq) {
            // Token invalidates any in-flight search when a newer one starts.
            const token = ++searchTokenRef.current;
            setMarketQuery(mq);
            setMarketShort(false);
            setMarketBusy(true);
            setMarketError('');
            try {
              // `ctx.get` resolves the mounted namespace tree-wide; a direct
              // `ctx.remote.vscodeThemes` read would throw "without inject".
              const ns = ctx.get('remote.vscodeThemes');
              if (!ns) throw new Error('marketplace namespace is not mounted');
              const res = await ns.search(mq);
              if (token !== searchTokenRef.current) return;
              if (!res.ok) throw res.error;
              const themes = (res.value || []).map((e) => ({
                id: 'vscode-' + String(e.publisher).toLowerCase() + '-' + String(e.name).toLowerCase(),
                publisher: e.publisher,
                name: e.name,
                displayName: e.displayName,
                version: e.version,
                description: e.description,
                // Sort-relevant signals, carried through so the client can re-sort
                // the result set for the selected sort option without re-fetching.
                installs: e.installs || 0,
                averageRating: e.averageRating || 0,
                ratingCount: e.ratingCount || 0,
                trendingMonthly: e.trendingMonthly || 0,
                lastUpdated: e.lastUpdated || '',
                publishedDate: e.publishedDate || '',
              }));
              setMarketResults(themes);
            } catch (err) {
              if (token === searchTokenRef.current) setMarketError(String(err && err.message || err));
            } finally {
              if (token === searchTokenRef.current) setMarketBusy(false);
            }
          }

          // The marketplace input is uncontrolled: typing never re-renders the
          // section. A timer polls the field once a second and only reacts
          // when the trimmed value changed since the last tick.
          React.useEffect(() => {
            if (!marketAvailable) return undefined;
            const id = setInterval(() => {
              const input = marketInputRef.current;
              if (!input) return;
              const raw = input.value.trim();
              if (raw === marketSeenRef.current) return;
              marketSeenRef.current = raw;
              searchTokenRef.current += 1; // cancel any in-flight search
              if (!raw) {
                setMarketQuery('');
                setMarketShort(false);
                setMarketResults([]);
                setMarketBusy(false);
                setMarketError(marketMountError);
                return;
              }
              if (raw.length < MARKET_MIN_QUERY_LEN) {
                // The marketplace rejects single-letter queries with 401; show
                // a gentle hint instead of firing the request.
                setMarketQuery(raw);
                setMarketShort(true);
                setMarketResults([]);
                setMarketBusy(false);
                setMarketError('');
                return;
              }
              runSearch(raw);
            }, MARKET_POLL_MS);
            return () => clearInterval(id);
          }, [marketAvailable]);

          // One-time backfill: themes installed before the displayName/description
          // fields existed lack them, so the Installed section neither shows nor
          // searches their description. Look each stale theme up on the marketplace
          // (by publisher + extension name) and fill in the missing fields, then
          // persist. Guarded by a flag so it runs once per browser profile; if a
          // lookup fails the flag is still set (best-effort, never blocks boot).
          React.useEffect(() => {
            if (!marketAvailable) return undefined;
            const FLAG = 'dsh.vscodeThemes.backfilled.v1';
            let done = false;
            try { done = !!localStorage.getItem(FLAG); } catch (_) {}
            if (done) return undefined;
            let cancelled = false;
            (async () => {
              try {
                const ns = ctx.get('remote.vscodeThemes');
                if (!ns) return;
                const list = loadInstalled();
                const stale = list.filter((th) => !th.description || !th.displayName);
                for (const th of stale) {
                  if (cancelled) return;
                  const extName = extNameFromId(th);
                  if (!extName) continue;
                  try {
                    const res = await ns.search(extName);
                    if (!res.ok) continue;
                    const match = (res.value || []).find((e) => e.publisher === th.publisher && String(e.name).toLowerCase() === extName);
                    if (!match) continue;
                    th.displayName = th.displayName || match.displayName || th.name;
                    th.description = th.description || match.description || '';
                  } catch (_) { /* keep whatever we have */ }
                }
                if (cancelled) return;
                saveInstalled(list);
                try { localStorage.setItem(FLAG, '1'); } catch (_) {}
                setInstalledList(loadInstalled());
              } catch (_) { /* best-effort; retried on next mount */ }
            })();
            return () => { cancelled = true; };
          }, [marketAvailable]);

          // Eagerly fetch each marketplace result's theme definition in the
          // background so its card can show a live color-swatch preview — the
          // user gets a rough sense of each theme's palette at a glance without
          // having to click (apply) every theme. Fetches run 3 at a time and are
          // de-duplicated via marketFetchedRef + the getDef cache, so re-searches
          // and overlapping result sets never double-download.
          React.useEffect(() => {
            if (!marketAvailable) return undefined;
            if (!marketResults.length) return undefined;
            let cancelled = false;
            (async () => {
              const queue = marketResults.slice();
              const workers = Array.from({ length: 3 }, async () => {
                while (queue.length) {
                  const theme = queue.shift();
                  if (!theme || cancelled) break;
                  if (marketFetchedRef.current[theme.id]) continue;
                  marketFetchedRef.current[theme.id] = true; // mark in-flight
                  try {
                    const def = await getDef(theme);
                    if (cancelled) break;
                    setMarketTokens((prev) => (prev[theme.id] ? prev : { ...prev, [theme.id]: def }));
                  } catch (_) {
                    // Incompatible / unavailable theme: allow a later retry and
                    // the card simply shows no preview.
                    marketFetchedRef.current[theme.id] = null;
                  }
                }
              });
              await Promise.all(workers);
            })();
            return () => { cancelled = true; };
          }, [marketResults, marketAvailable]);

          const q = query.trim().toLowerCase();

          // The Marketplace's server-side search matches the FULL description
          // (and other fields), but we only store the shortDescription locally.
          // A term that appears only in the full description (e.g. "smart" for
          // "Dark Green Jungle") therefore never matches the local filter. To get
          // true parity, cross-reference the current marketplace result set: an
          // installed theme shows in the Installed section if it is in the
          // marketplace results for this query (matched by id), even when the
          // local substring filter does not match.
          // Re-sort the marketplace result set for the selected option. The host
          // already returns "most popular" order (installs desc → rating desc →
          // name asc), so 'popular' keeps that; the others re-order client-side
          // using the signals carried on each result. Sorts are stable and a
          // display-name tiebreak keeps the output deterministic.
          const byName = (a, b) => (a.displayName || '').localeCompare(b.displayName || '');
          const marketSorters = {
            popular: (a, b) => (b.installs - a.installs) || (b.averageRating - a.averageRating) || byName(a, b),
            rated: (a, b) =>
              // Rated themes first (an unrated theme has averageRating 0), then
              // by rating, then by how many ratings back it up (a 5-star/1-rating
              // theme ranks below a 4.9-star/56-rating one), then installs.
              (Number(b.averageRating > 0) - Number(a.averageRating > 0)) ||
              (b.averageRating - a.averageRating) || (b.ratingCount - a.ratingCount) ||
              (b.installs - a.installs) || byName(a, b),
            trending: (a, b) => (b.trendingMonthly - a.trendingMonthly) || (b.installs - a.installs) || byName(a, b),
            updated: (a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || '') || (b.installs - a.installs) || byName(a, b),
            newest: (a, b) => (b.publishedDate || '').localeCompare(a.publishedDate || '') || (b.installs - a.installs) || byName(a, b),
          };
          const sortedMarketResults = marketResults.slice().sort(marketSorters[marketSort] || marketSorters.popular);
          const marketResultIds = new Set(sortedMarketResults.map((m) => m.id));

          // Effective local list: installed (most recent first) then bundled, with
          // any removed themes filtered out, then filtered by the search query.
          const installedIds = new Set(installedList.map((x) => x.id));
          const seenIds = new Set();
          const localThemes = [
            ...installedList,
            ...BUNDLED_THEMES.filter((b) => !installedIds.has(b.id)),
          ].filter((th) => {
            if (removedIds.has(th.id) || seenIds.has(th.id)) return false;
            seenIds.add(th.id);
            // Match the display name and the description too: installed themes
            // store the extension display name (displayName) as their visible
            // name and the marketplace short description (description), so a
            // search for either must hit the Installed section as well as the
            // Marketplace (whose server-side search also matches descriptions).
            // `marketResultIds.has(th.id)` adds true parity for terms that only
            // appear in the marketplace's full description.
            return !q || th.name.toLowerCase().indexOf(q) !== -1 || (th.displayName || '').toLowerCase().indexOf(q) !== -1 || (th.description || '').toLowerCase().indexOf(q) !== -1 || th.id.toLowerCase().indexOf(q) !== -1 || marketResultIds.has(th.id);
          })
          // Starred themes float to the front; sort is stable, so the
          // installed-then-bundled order is kept within each group.
          .sort((a, b) => Number(favoriteIds.has(b.id)) - Number(favoriteIds.has(a.id)));

          function selectTheme(id) {
            if (id === selected) return;
            const th = localThemes.find((x) => x.id === id);
            if (th) registerTheme(th);
            // Persist before applying so the boot-race re-assertion sees the
            // new value and never reverts the switch we just made.
            persistSelected(id);
            try { ctx.theme.setTheme(id); } catch (_) {}
            setSelected(id);
            setMarketError(''); // a successful apply clears the previous action's error
          }

          // Fetch a marketplace theme's full definition (tokens), cached so
          // preview and install never double-fetch.
          async function getDef(theme) {
            if (fetchedCache.current[theme.id]) return fetchedCache.current[theme.id];
            const ns = ctx.get('remote.vscodeThemes');
            if (!ns) throw new Error('marketplace namespace is not mounted');
            const res = await ns.fetchTheme({
              publisher: theme.publisher,
              name: theme.name,
              version: theme.version,
              // Pass the marketplace short description through so the host can
              // attach it to the fetched definition (installed card tooltip +
              // description search). The host's fetchTheme forwards the whole
              // object to fetchThemeDefinition.
              description: theme.description,
            });
            if (!res.ok) throw res.error;
            fetchedCache.current[theme.id] = res.value;
            return res.value;
          }

          // Clicking a marketplace card previews (applies) the theme once.
          async function previewTheme(theme) {
            if (installedIds.has(theme.id)) {
              selectTheme(theme.id);
              return;
            }
            setPendingIds((prev) => new Set(prev).add(theme.id));
            try {
              const def = await getDef(theme);
              registerTheme(def);
              // Persist before applying so the boot-race re-assertion sees the
              // new value and never reverts the switch we just made.
              persistSelected(def.id);
              try { ctx.theme.setTheme(def.id); } catch (_) {}
              setSelected(def.id);
              setMarketError(''); // a working preview clears the previous error
            } catch (err) {
              setMarketError(String(err && err.message || err));
            } finally {
              setPendingIds((prev) => {
                const next = new Set(prev);
                next.delete(theme.id);
                return next;
              });
            }
          }

          // Installing persists the fetched definition to localStorage and adds
          // it to the front of the installed list (most-recent-first). Installing
          // a theme the user previously removed un-removes it so it shows again.
          async function installTheme(theme) {
            if (installedIds.has(theme.id) && !removedIds.has(theme.id)) return;
            setPendingIds((prev) => new Set(prev).add(theme.id));
            try {
              const def = await getDef(theme);
              const list = installedList.filter((x) => x.id !== def.id);
              // Keep the installed card's name identical to the marketplace
              // card's (the extension display name) so both sections show the
              // same name and a search for it matches in both. `def.name` is
              // the theme entry's label, which can differ from the display name.
              list.unshift({ ...def, displayName: theme.displayName || theme.name, installedAt: Date.now() });
              saveInstalled(list);
              registerTheme(def);
              setInstalledList(list);
              if (removedIds.has(def.id)) {
                const nextRemoved = new Set(removedIds);
                nextRemoved.delete(def.id);
                saveRemoved([...nextRemoved]);
                setRemovedIds(nextRemoved);
              }
              setMarketError(''); // a successful install clears the previous error
            } catch (err) {
              setMarketError(String(err && err.message || err));
            } finally {
              setPendingIds((prev) => {
                const next = new Set(prev);
                next.delete(theme.id);
                return next;
              });
            }
          }

          // Removing a theme filters it out of the list — works for both bundled
          // and installed themes, giving the user a way to debloat either set. For
          // installed themes the stored definition is dropped too, keeping
          // localStorage lean. If the applied theme is removed the selection falls
          // back to the first still-available theme.
          function removeTheme(id) {
            const nextRemoved = new Set(removedIds);
            nextRemoved.add(id);
            saveRemoved([...nextRemoved]);
            setRemovedIds(nextRemoved);
            const nextInstalled = installedList.filter((x) => x.id !== id);
            if (nextInstalled.length !== installedList.length) {
              saveInstalled(nextInstalled);
              setInstalledList(nextInstalled);
            }
            if (id === selected) {
              const fallback = localThemes.find((th) => th.id !== id);
              if (fallback) {
                persistSelected(fallback.id);
                try { ctx.theme.setTheme(fallback.id); } catch (_) {}
                setSelected(fallback.id);
              }
            }
          }

          function marketCard(theme) {
            const isSelected = theme.id === selected;
            const isInstalled = installedIds.has(theme.id);
            const isPending = pendingIds.has(theme.id);
            const def = marketTokens[theme.id] || fetchedCache.current[theme.id] || null;
            const tk = (def && def.tokens) || {};
            return h(
              'div',
              {
                key: theme.id,
                className: 'vst-card' + (isSelected ? ' selected' : '') + (isPending ? ' is-disabled' : ''),
                role: 'button',
                'aria-pressed': isSelected,
                title: (theme.displayName || theme.name) + (theme.description ? '\n' + theme.description : ''),
                onClick: () => previewTheme(theme),
                style: cardSurfaceStyle(tk, isSelected),
              },
              h(
                'div',
                { className: 'vst-card-top' },
                h('span', { className: 'vst-name', style: { color: tk['--dsw-alias-label-primary'] } }, theme.displayName || theme.name),
              ),
              // Rendered sample of the theme in its actual colors. Filled in
              // the definition is fetched in the background; a loading shimmer
              // strip until then.
              def
                ? themeSample(def)
                : h(
                    'div',
                    { className: 'vst-sample vst-sample-loading', 'aria-hidden': true },
                    h('span', { className: 'vst-sample-shimmer' }),
                  ),
              h(
                'div',
                { className: 'vst-card-actions' },
                isPending
                  ? h('span', { className: 'vst-state' }, t('market.installing'))
                  : isSelected
                    ? activePill(def && def.tokens)
                    : null,
                !isInstalled
                  ? h(
                      'button',
                      {
                        className: 'vst-install-btn',
                        style: themeButtonVars(tk),
                        disabled: isPending,
                        onClick: (e) => {
                          e.stopPropagation();
                          installTheme(theme);
                        },
                      },
                      t('market.install'),
                    )
                  : removeButton(theme.id, t('uninstall.label'), tk),
              ),
            );
          }

          // A miniature DSH-style UI rendered in the theme's ACTUAL colors, so
          // the card shows what the theme really looks like rather than a flat
          // swatch strip. Every color is bound via inline `style` to the target
          // theme's tokens — a `.vst-*` class would resolve `var(--dsw-alias-*)`
          // to the currently-applied theme, not this card's theme. The preview
          // is intentionally compact so a card stays small while still showing
          // the real look of the theme.
          function themeSample(theme) {
            const tk = theme.tokens || {};
            const bg = tk['--dsw-alias-bg-base'] || '#14151a';
            const layer = tk['--dsw-alias-bg-layer-1'] || bg;
            const label = tk['--dsw-alias-label-primary'] || '#e8e8ec';
            const label2 = tk['--dsw-alias-label-secondary'] || label;
            const brand = tk['--dsw-alias-brand-primary'] || '#4d78cc';
            const success = tk['--dsw-alias-state-success-primary'] || '#109868';
            const warn = tk['--dsw-alias-state-warn-primary'] || '#d19a66';
            const error = tk['--dsw-alias-state-error-primary'] || '#c24038';
            const border = tk['--dsw-alias-border-l2'] || tk['--dsw-alias-border-l1'] || '#3a3f4b';
            const onBrand = contrastOn(brand);
            return h(
              'div',
              { className: 'vst-sample', 'aria-hidden': true },
              // user message bubble (brand background, right-aligned)
              h('div', { className: 'vst-sample-msg vst-sample-user', style: { background: brand, color: onBrand } }, 'How does it look?'),
              // assistant bubble (layer background) with primary + secondary text,
              // a primary button, and success/warn/error chips
              h(
                'div',
                { className: 'vst-sample-msg vst-sample-ai', style: { background: layer, borderColor: border } },
                h('div', { className: 'vst-sample-body' },
                  h('span', { style: { color: label } }, 'Here it is, '),
                  h('span', { style: { color: label2 } }, 'in your colors.'),
                ),
                h('div', { className: 'vst-sample-actions' },
                  h('span', { className: 'vst-sample-btn', style: { background: brand, color: onBrand } }, 'Go'),
                  h('span', { className: 'vst-sample-chip', style: { color: success, background: withAlpha(success, 0.16) } }, 'ok'),
                  h('span', { className: 'vst-sample-chip', style: { color: warn, background: withAlpha(warn, 0.16) } }, 'warn'),
                  h('span', { className: 'vst-sample-chip', style: { color: error, background: withAlpha(error, 0.16) } }, 'err'),
                ),
              ),
            );
          }

          // Prominent "Active" indicator for the applied theme. Colors are
          // computed INLINE from the theme's own tokens — a `.vst-*` class would
          // resolve `var(--dsw-alias-brand-primary)` to the applied theme, which
          // happens to be this card only for the active one. `contrastOn` picks a
          // legible text colour and the subtle outline keeps the pill bounded
          // even when a theme's brand colour is very close to its background.
          function activePill(tokens) {
            const brand = (tokens && tokens['--dsw-alias-brand-primary']) || '#4d78cc';
            const text = contrastOn(brand);
            return h(
              'span',
              {
                className: 'vst-active-pill',
                style: {
                  background: brand,
                  color: text,
                  borderColor: withAlpha(text, 0.5),
                },
              },
              h('span', { className: 'vst-active-dot', style: { background: text } }),
              t('active'),
            );
          }

          // The applied card's ring + halo + glow, in the theme's own accent
          // colour. Set inline (not via a CSS var) so a weak brand colour can't
          // make the indicator vanish: the solid 3px ring is always visible, and
          // the outer 4px translucent halo (7px total spread) plus the wider
          // glow make the active card unmistakable at a glance.
          function activeRingStyle(tokens) {
            const brand = (tokens && tokens['--dsw-alias-brand-primary']) || '#4d78cc';
            return { boxShadow: '0 0 0 3px ' + brand + ', 0 0 0 7px ' + withAlpha(brand, 0.25) + ', 0 6px 24px ' + withAlpha(brand, 0.45) };
          }

          // The card's own surface colours, bound inline to the card's theme tokens so
          // each card looks like that theme in DSH chat rather than following the
          // applied theme. A class-based rule would resolve the design-token vars to
          // the applied theme, which is inaccurate and misleading.
          function cardSurfaceStyle(tokens, isSelected) {
            const tk = tokens || {};
            return {
              background: tk['--dsw-alias-bg-base'],
              borderColor: tk['--dsw-alias-border-l1'] || tk['--dsw-alias-border-l2'],
              ...(isSelected ? activeRingStyle(tk) : {}),
            };
          }

          // The card theme's palette exposed to the `.vst-*` button CSS as
          // element-scoped custom properties, so the buttons (including their
          // :hover states) render in the CARD's own colours instead of the
          // currently-applied theme's — a plain `var(--dsw-alias-*)` in the
          // stylesheet would resolve against the active theme, which clashes
          // when the card's palette is very different. Missing tokens fall
          // back to the defaults baked into the CSS rule.
          function themeButtonVars(tokens) {
            const tk = tokens || {};
            return {
              '--vst-tk-label2': tk['--dsw-alias-label-secondary'],
              '--vst-tk-border': tk['--dsw-alias-border-l1'] || tk['--dsw-alias-border-l2'],
              '--vst-tk-error': tk['--dsw-alias-state-error-primary'],
              '--vst-tk-brand': tk['--dsw-alias-brand-primary'],
              '--vst-tk-bg': tk['--dsw-alias-bg-base'],
            };
          }

          function removeButton(id, label, tokens) {
            return h(
              'button',
              {
                className: 'vst-remove-btn',
                title: label,
                'aria-label': label,
                style: themeButtonVars(tokens),
                onClick: (e) => {
                  e.stopPropagation();
                  removeTheme(id);
                },
              },
              trashIcon(),
            );
          }

          // Trashcan glyph for the uninstall/remove button: a Lucide-style
          // trashcan outline drawn in currentColor, so it follows the button's
          // own colour (label-secondary at rest, the card's error colour on
          // hover — see the .vst-remove-btn rules).
          function trashIcon() {
            return h(
              'svg',
              {
                viewBox: '0 0 24 24',
                width: 14,
                height: 14,
                'aria-hidden': true,
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 1.8,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              },
              h('path', { d: 'M3 6h18' }),
              h('path', { d: 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2' }),
              h('path', { d: 'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' }),
              h('line', { x1: 10, y1: 11, x2: 10, y2: 17 }),
              h('line', { x1: 14, y1: 11, x2: 14, y2: 17 }),
            );
          }

          // Star glyph for the favorite toggle: outline when not starred,
          // filled when starred. Sized for the card-top row.
          function starIcon(filled) {
            return h(
              'svg',
              {
                viewBox: '0 0 24 24',
                width: 14,
                height: 14,
                'aria-hidden': true,
                fill: filled ? 'currentColor' : 'none',
                stroke: 'currentColor',
                strokeWidth: 1.8,
                strokeLinejoin: 'round',
              },
              h('path', { d: 'M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.57l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z' }),
            );
          }

          function card(theme, kind) {
            const isSelected = theme.id === selected;
            const isFav = favoriteIds.has(theme.id);
            const tk = theme.tokens || {};
            return h(
              'div',
              {
                key: theme.id,
                className: 'vst-card' + (isSelected ? ' selected' : ''),
                role: 'button',
                'aria-pressed': isSelected,
                title: (theme.displayName || theme.name) + (theme.description ? '\n' + theme.description : ''),
                onClick: () => selectTheme(theme.id),
                style: cardSurfaceStyle(tk, isSelected),
              },
              h(
                'div',
                { className: 'vst-card-top' },
                h('span', { className: 'vst-name', style: { color: tk['--dsw-alias-label-primary'] } }, theme.displayName || theme.name),
                h(
                  'button',
                  {
                    className: 'vst-fav-star' + (isFav ? ' is-fav' : ''),
                    title: isFav ? t('unfavorite') : t('favorite'),
                    'aria-label': isFav ? t('unfavorite') : t('favorite'),
                    onClick: (e) => {
                      // Star toggle must not also select/apply the theme.
                      e.stopPropagation();
                      toggleFavorite(theme.id);
                    },
                  },
                  starIcon(isFav),
                ),
              ),
              themeSample(theme),
              h(
                'div',
                { className: 'vst-card-actions' },
                isSelected ? activePill(theme.tokens) : null,
                removeButton(theme.id, kind === 'bundled' ? t('remove.label') : t('uninstall.label'), theme.tokens),
              ),
            );
          }

          return h(
            'div',
            { className: 'vst-root' },
            h('style', {
              dangerouslySetInnerHTML: {
                __html:
                  '.vst-root{display:flex;flex-direction:column;gap:16px;padding:20px 24px;}' +
                  '.vst-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}' +
                   '.vst-header-left{display:flex;flex-direction:column;gap:4px;min-width:0;}' +
                   '.vst-header-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap;flex-shrink:0;}' +
                   '.vst-update-alert{font-size:12px;color:var(--dsw-alias-state-warn-primary);white-space:nowrap;}' +
                   '.vst-update-dim{font-size:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap;}' +
                   '.vst-update-success{font-size:12px;color:var(--dsw-alias-state-success-primary);}' +
                   '.vst-update-fail{font-size:12px;color:var(--dsw-alias-state-error-primary);}' +
                   '.vst-update-btn{font:inherit;font-size:12px;font-weight:600;line-height:1;padding:6px 12px;cursor:pointer;' +
                   'color:#fff;background:var(--dsw-alias-brand-primary);border:1px solid var(--dsw-alias-brand-primary);border-radius:6px;}' +
                   '.vst-update-btn:hover{filter:brightness(1.1);}' +
                   '.vst-update-btn:disabled{opacity:.6;cursor:default;filter:none;}' +
                   '.vst-github-link{font:inherit;font-size:12px;font-weight:600;line-height:1;padding:6px 10px;text-decoration:none;' +
                   'color:var(--dsw-alias-label-secondary);background:transparent;border:1px solid var(--dsw-alias-border-l1);' +
                   'border-radius:6px;white-space:nowrap;}' +
                   '.vst-github-link:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-secondary);}' +
                  '.vst-title{margin:0;font-size:18px;font-weight:600;color:var(--dsw-alias-label-primary);}' +
                  '.vst-subtitle{margin:0;font-size:13px;color:var(--dsw-alias-label-secondary);}' +
                  '.vst-search{width:100%;max-width:520px;box-sizing:border-box;padding:8px 12px;font-size:14px;' +
                  'color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);' +
                  'border:1px solid var(--dsw-alias-border-l1);border-radius:8px;outline:none;}' +
                  '.vst-search:focus{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-error{padding:10px 14px;font-size:13px;border-radius:8px;' +
                  'color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-bg-layer-1);' +
                  'border:1px solid var(--dsw-alias-state-error-primary);}' +
                  '.vst-section{display:flex;flex-direction:column;gap:10px;}' +
                  '.vst-section-title{margin:0;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;' +
                  'color:var(--dsw-alias-label-secondary);}' +
                  '.vst-market{display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--dsw-alias-border-l1);padding-top:16px;}' +
                  '.vst-market-body{display:flex;flex-direction:column;gap:10px;}' +
                  '.vst-market-head{display:flex;align-items:center;justify-content:space-between;gap:12px;}' +
                  '.vst-sort{margin:0;font-size:12px;font-weight:500;color:var(--dsw-alias-label-primary);' +
                  'background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);' +
                  'border-radius:6px;padding:4px 8px;cursor:pointer;outline:none;max-width:180px;}' +
                  '.vst-sort:focus{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;}' +
                  '.vst-card{display:flex;flex-direction:column;gap:6px;padding:8px;text-align:left;' +
                  'background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;' +
                  'color:var(--dsw-alias-label-primary);font:inherit;transition:border-color .12s,transform .06s;}' +
                  '.vst-card[role="button"]{cursor:pointer;}' +
                  '.vst-card[role="button"]:hover{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-card[role="button"]:active{transform:scale(.99);}' +
                  '.vst-card.selected{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-card.is-disabled{opacity:.6;}' +
                  '.vst-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}' +
                  '.vst-name{font-size:13px;font-weight:600;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
                   // Favorite star: top-right of the card, outline by default,
                   // gold-filled when starred.
                   '.vst-fav-star{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex-shrink:0;cursor:pointer;padding:0;' +
                   'color:var(--dsw-alias-label-secondary);background:transparent;border:1px solid var(--dsw-alias-border-l2);' +
                   'border-radius:6px;transition:color .12s,border-color .12s,background .12s;}' +
                   '.vst-fav-star:hover{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}' +
                   '.vst-fav-star.is-fav{color:#f5c518;border-color:#f5c518;background:rgba(245,197,24,.12);}' +
                   '.vst-sample{display:flex;flex-direction:column;gap:3px;padding:0;border-radius:7px;' +
                   'overflow:hidden;}' +
                   '.vst-sample-msg{max-width:88%;padding:4px 7px;border-radius:7px;font-size:10px;line-height:1.3;}' +
                   '.vst-sample-user{align-self:flex-end;border-radius:7px 7px 2px 7px;}' +
                   '.vst-sample-ai{align-self:flex-start;border-radius:7px 7px 7px 2px;border:1px solid;display:flex;flex-direction:column;gap:4px;}' +
                   '.vst-sample-body{display:flex;flex-wrap:wrap;gap:2px;}' +
                   '.vst-sample-actions{display:flex;align-items:center;gap:3px;flex-wrap:wrap;}' +
                   '.vst-sample-btn{font-size:10px;font-weight:600;padding:2px 6px;border-radius:5px;}' +
                   '.vst-sample-chip{font-size:9px;font-weight:600;padding:1px 5px;border-radius:999px;}' +
                   '.vst-sample-loading{background:var(--dsw-alias-bg-layer-2);position:relative;height:74px;}' +
                   '.vst-active-pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;' +
                   'padding:3px 10px;border-radius:999px;border:1px solid;letter-spacing:.01em;flex-shrink:0;}' +
                   '.vst-active-dot{width:7px;height:7px;border-radius:999px;flex-shrink:0;}' +
                  '.vst-sample-shimmer{position:absolute;inset:0;transform:translateX(-100%);' +
                  'background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);' +
                  'animation:vst-shimmer 1.2s infinite;}' +
                  '@keyframes vst-shimmer{100%{transform:translateX(100%);}}' +
                  // Button colours resolve the per-card `--vst-tk-*` custom
                  // properties set inline by themeButtonVars() — the card's own
                  // palette, not the applied theme's.
                  '.vst-remove-btn{display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:11px;font-weight:500;line-height:1;padding:4px 6px;cursor:pointer;' +
                  'color:var(--vst-tk-label2,#9aa4b2);background:transparent;' +
                  'border:1px solid var(--vst-tk-border,#3a3f4b);border-radius:6px;}' +
                  '.vst-remove-btn:hover{color:var(--vst-tk-error,#c24038);border-color:var(--vst-tk-error,#c24038);}' +
                  // margin-left:auto pins the action button to the bottom-right of
                  // the card even when the Active pill is absent (space-between
                  // alone left-aligns a lone child).
                  '.vst-card-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;}' +
                  '.vst-card-actions .vst-remove-btn,.vst-card-actions .vst-install-btn{margin-left:auto;}' +
                  '.vst-state{font-size:12px;color:var(--dsw-alias-label-secondary);}' +
                  '.vst-state.is-selected{color:var(--dsw-alias-brand-primary);font-weight:600;}' +
                  '.vst-state-error{color:var(--dsw-alias-state-error-primary);}' +
                  '.vst-install-btn{font:inherit;font-size:12px;font-weight:600;padding:4px 12px;cursor:pointer;' +
                  'color:var(--vst-tk-bg,#14151a);background:var(--vst-tk-brand,#4d78cc);' +
                  'border:1px solid var(--vst-tk-brand,#4d78cc);border-radius:6px;}' +
                  '.vst-install-btn:hover{filter:brightness(1.1);}' +
                  '.vst-install-btn.is-disabled{opacity:.5;cursor:default;filter:none;}' +
                  '.vst-empty{padding:32px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:14px;}',
              },
            }),
            h(
              'div',
              { className: 'vst-header' },
              h(
                'div',
                { className: 'vst-header-left' },
                h('h2', { className: 'vst-title' }, t('section.title')),
                h('p', { className: 'vst-subtitle' }, t('count', { n: localThemes.length }) + '   ·   ' + t('apply.hint')),
              ),
              h(
                'div',
                { className: 'vst-header-actions', 'data-tick': updateTick },
                updateInfo.hasUpdate
                  ? h('span', { className: 'vst-update-alert' }, t('update.available', { version: updateInfo.latest }))
                  : !updateInfo.error && updateInfo.local
                    ? h('span', { className: 'vst-update-dim' }, t('update.upToDate'))
                    : null,
                updateAction.phase === 'success'
                  ? h('span', { className: 'vst-update-success' }, updateAction.message)
                  : updateAction.phase === 'error'
                    ? h('span', { className: 'vst-update-fail' }, updateAction.message)
                    : null,
                updateInfo.hasUpdate
                  ? h(
                      'button',
                      {
                        className: 'vst-update-btn',
                        style: { color: onBrandColor() },
                        disabled: updateAction.phase === 'updating',
                        onClick: runUpdate,
                      },
                      updateAction.phase === 'updating' ? t('update.updating') : t('update.now'),
                    )
                  : null,
                h(
                  'a',
                  {
                    className: 'vst-github-link',
                    href: updateInfo.repoUrl || REPO_URL,
                    target: '_blank',
                    rel: 'noreferrer noopener',
                    title: 'View the source on GitHub',
                  },
                  t('github.link') + ' \u2197',
                ),
              ),
            ),
            h('input', {
              className: 'vst-search',
              type: 'search',
              placeholder: t('search.placeholder'),
              value: query,
              onChange: (e) => setQuery(e.target.value),
              ref: marketInputRef,
            }),
            h(
              'div',
              { className: 'vst-section' },
              h('h3', { className: 'vst-section-title' }, t('installed.section')),
              localThemes.length === 0
                ? h('div', { className: 'vst-empty' }, t('no.results'))
                : h('div', { className: 'vst-grid' }, localThemes.map((theme) => card(theme, installedIds.has(theme.id) ? 'installed' : 'bundled'))),
            ),
            h(
              'div',
              { className: 'vst-market' },
              h(
                'div',
                { className: 'vst-market-head' },
                h('h3', { className: 'vst-section-title' }, t('market.section')),
                marketAvailable && marketResults.length
                  ? h(
                      'select',
                      {
                        className: 'vst-sort',
                        value: marketSort,
                        onChange: (e) => setMarketSort(e.target.value),
                        'aria-label': t('market.sort.label'),
                      },
                      h('option', { value: 'popular' }, t('market.sort.popular')),
                      h('option', { value: 'rated' }, t('market.sort.rated')),
                      h('option', { value: 'trending' }, t('market.sort.trending')),
                      h('option', { value: 'updated' }, t('market.sort.updated')),
                      h('option', { value: 'newest' }, t('market.sort.newest')),
                    )
                  : null,
              ),
              marketAvailable
                ? h(
                    'div',
                    { className: 'vst-market-body' },
                    marketBusy ? h('p', { className: 'vst-state' }, t('market.busy')) : null,
                    !marketBusy && marketShort ? h('p', { className: 'vst-state' }, t('market.minChars')) : null,
                    !marketBusy && !marketShort && marketError ? h('div', { className: 'vst-error' }, marketError) : null,
                    !marketBusy && !marketShort && !marketError && !marketQuery
                      ? h('div', { className: 'vst-empty' }, t('market.empty'))
                      : null,
                    !marketBusy && !marketShort && !marketError && !!marketQuery && marketResults.length === 0
                      ? h('div', { className: 'vst-empty' }, t('no.results'))
                      : null,
                    sortedMarketResults.length ? h('div', { className: 'vst-grid' }, sortedMarketResults.map((theme) => marketCard(theme))) : null,
                  )
                : h('div', { className: 'vst-error' }, t('market.mountError')),
            ),
          );
        }

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: ENTRY_ID, order: 30, label: () => t('section.title') },
            ThemeBrowser,
          ),
        );

        return async () => {
          // Stop the boot-race re-assertion so it never touches a disposed ctx.
          try { clearInterval(reassertTimer); } catch (err) { /* ignore */ }
          if (localeDisposer) {
            try { localeDisposer(); } catch (err) { /* ignore */ }
            localeDisposer = null;
          }
          for (const d of themeDisposers) {
            try { d(); } catch (err) { /* ignore */ }
          }
          try {
            if (unmountMarketplace) await unmountMarketplace();
          } catch (err) {
            /* ignore */
          }
        };
      },
    };
  },
});
