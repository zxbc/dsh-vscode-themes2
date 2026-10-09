window.__ModuleLoader__.load({
  id: '@local/dsh-vscode-themes2',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // Marketplace bridge: the host exposes `search` and `fetchTheme` as a Typert
    // Remote service (namespace `vscodeThemes`). We mount a strict codec for each
    // method so the gateway validates our inputs and the results pass through as
    // plain JSON. `create()` only needs to return `{ parse }` — the registry does
    // not require a zod instance for hand-written contributions — so we use a
    // pass-through schema and avoid importing zod into the client bundle.
    const PKG = '@local/dsh-vscode-themes2';
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
          'search.placeholder': 'Search themes…',
          'applied': 'Applied',
          'apply': 'Apply',
          'no.results': 'No themes match your search.',
          'count': '{n} themes',
          'scheme.dark': 'dark',
          'scheme.light': 'light',
          'market.search.placeholder': 'Search the VS Code Marketplace…',
          'market.section': 'Marketplace results',
          'market.empty': 'Search to discover themes from the VS Code Marketplace.',
          'market.busy': 'Searching…',
          'market.mountError': 'Marketplace search is unavailable right now.',
          'market.install': 'Install',
          'market.installing': 'Fetching…',
          'market.error': 'Could not fetch this theme.',
          'market.minChars': 'Type at least 2 characters to search.',
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
        let selectedId = '';
        try { selectedId = localStorage.getItem(STORAGE_KEY) || ''; } catch (_) {}
        if (selectedId && registeredIds.has(selectedId)) {
          try { ctx.theme.setTheme(selectedId); } catch (_) {}
        }

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

        function persistSelected(id) {
          try {
            if (id) localStorage.setItem(STORAGE_KEY, id);
            else localStorage.removeItem(STORAGE_KEY);
          } catch (err) {
            console.error('vscode-themes persist failed', err);
          }
        }

        function ThemeBrowser() {
          const [query, setQuery] = React.useState('');
          const [selected, setSelected] = React.useState(selectedId);
          const [installedList, setInstalledList] = React.useState(installed);

          // Marketplace state (only active when the Remote mount succeeded).
          const [marketQuery, setMarketQuery] = React.useState('');
          const [marketResults, setMarketResults] = React.useState([]);
          const [marketBusy, setMarketBusy] = React.useState(false);
          const [marketError, setMarketError] = React.useState(marketMountError);
          const [marketShort, setMarketShort] = React.useState(false);
          const [pendingIds, setPendingIds] = React.useState(new Set());
          const fetchedCache = React.useRef(Object.create(null));
          const marketInputRef = React.useRef(null);
          const marketSeenRef = React.useRef('');
          const searchTokenRef = React.useRef(0);

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

          const q = query.trim().toLowerCase();

          // Local list: installed (most recent first) then bundled, filtered by query.
          const installedIds = new Set(installedList.map((x) => x.id));
          const localThemes = [
            ...installedList,
            ...BUNDLED_THEMES.filter((b) => !installedIds.has(b.id)),
          ].filter((th) => !q || th.name.toLowerCase().indexOf(q) !== -1 || th.id.toLowerCase().indexOf(q) !== -1);

          function selectTheme(id) {
            if (id === selected) return;
            const th = localThemes.find((x) => x.id === id);
            if (th) registerTheme(th);
            ctx.theme.setTheme(id);
            setSelected(id);
            persistSelected(id);
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
              ctx.theme.setTheme(def.id);
              setSelected(def.id);
              persistSelected(def.id);
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
          // it to the front of the installed list (most-recent-first).
          async function installTheme(theme) {
            if (installedIds.has(theme.id)) return;
            setPendingIds((prev) => new Set(prev).add(theme.id));
            try {
              const def = await getDef(theme);
              const list = installedList.filter((x) => x.id !== def.id);
              list.unshift({ ...def, installedAt: Date.now() });
              saveInstalled(list);
              registerTheme(def);
              setInstalledList(list);
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

          function marketCard(theme) {
            const isSelected = theme.id === selected;
            const isInstalled = installedIds.has(theme.id);
            const isPending = pendingIds.has(theme.id);
            return h(
              'div',
              {
                key: theme.id,
                className: 'vst-card' + (isSelected ? ' selected' : '') + (isPending ? ' is-disabled' : ''),
                role: 'button',
                'aria-pressed': isSelected,
                onClick: () => previewTheme(theme),
              },
              h(
                'div',
                { className: 'vst-card-top' },
                h('span', { className: 'vst-name' }, theme.displayName || theme.name),
                h(
                  'span',
                  { className: 'vst-badges' },
                  h('span', { key: 'market', className: 'vst-badge vst-badge-market' }, 'marketplace'),
                  isInstalled ? h('span', { key: 'kind', className: 'vst-badge vst-badge-installed' }, t('installed')) : null,
                ),
              ),
              theme.description ? h('span', { className: 'vst-desc' }, theme.description) : null,
              h(
                'div',
                { className: 'vst-card-actions' },
                h(
                  'span',
                  { className: 'vst-state' + (isSelected ? ' is-selected' : '') },
                  isPending ? t('market.installing') : isSelected ? t('applied') : t('apply'),
                ),
                !isInstalled
                  ? h(
                      'button',
                      {
                        className: 'vst-install-btn',
                        disabled: isPending,
                        onClick: (e) => {
                          e.stopPropagation();
                          installTheme(theme);
                        },
                      },
                      t('market.install'),
                    )
                  : null,
              ),
            );
          }

          function previewStrip(theme) {
            const tk = theme.tokens || {};
            const colors = [
              tk['--dsw-alias-bg-base'],
              tk['--dsw-alias-brand-primary'],
              tk['--dsw-alias-label-primary'],
              tk['--dsw-alias-state-success-primary'],
              tk['--dsw-alias-state-warn-primary'],
              tk['--dsw-alias-state-error-primary'],
            ];
            return h(
              'div',
              { className: 'vst-preview', 'aria-hidden': true },
              colors.map((c, i) =>
                h('span', { key: i, className: 'vst-swatch' + (c ? '' : ' is-empty'), style: c ? { background: c } : {} }),
              ),
            );
          }

          function badges(theme, kind) {
            const list = [];
            if (theme.colorScheme) {
              list.push(h('span', { key: 'scheme', className: 'vst-badge' }, t('scheme.' + theme.colorScheme)));
            }
            if (kind === 'installed') {
              list.push(h('span', { key: 'kind', className: 'vst-badge vst-badge-installed' }, t('installed')));
            }
            return list;
          }

          function card(theme, kind) {
            const isSelected = theme.id === selected;
            return h(
              'div',
              {
                key: theme.id,
                className: 'vst-card' + (isSelected ? ' selected' : ''),
                role: 'button',
                'aria-pressed': isSelected,
                onClick: () => selectTheme(theme.id),
              },
              h(
                'div',
                { className: 'vst-card-top' },
                h('span', { className: 'vst-name' }, theme.name || theme.displayName),
                h('span', { className: 'vst-badges' }, badges(theme, kind)),
              ),
              previewStrip(theme),
              theme.description ? h('span', { className: 'vst-desc' }, theme.description) : null,
              h(
                'div',
                { className: 'vst-card-actions' },
                h(
                  'span',
                  { className: 'vst-state' + (isSelected ? ' is-selected' : '') },
                  isSelected ? t('applied') : t('apply'),
                ),
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
                  '.vst-header{display:flex;flex-direction:column;gap:4px;}' +
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
                  '.vst-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}' +
                  '.vst-card{display:flex;flex-direction:column;gap:8px;padding:14px;text-align:left;' +
                  'background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;' +
                  'color:var(--dsw-alias-label-primary);font:inherit;transition:border-color .12s,transform .06s;}' +
                  '.vst-card[role="button"]{cursor:pointer;}' +
                  '.vst-card[role="button"]:hover{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-card[role="button"]:active{transform:scale(.99);}' +
                  '.vst-card.selected{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary);}' +
                  '.vst-card.is-disabled{opacity:.6;}' +
                  '.vst-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}' +
                  '.vst-name{font-size:14px;font-weight:600;}' +
                  '.vst-badges{display:flex;gap:4px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;}' +
                  '.vst-badge{font-size:10px;padding:2px 7px;border-radius:999px;' +
                  'background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);}' +
                  '.vst-badge-installed{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary);}' +
                  '.vst-badge-market{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-badge-ni{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary);}' +
                  '.vst-preview{display:flex;gap:4px;height:18px;border-radius:6px;overflow:hidden;}' +
                  '.vst-swatch{flex:1;display:block;}' +
                  '.vst-swatch.is-empty{background:var(--dsw-alias-bg-layer-2);}' +
                  '.vst-desc{font-size:11px;line-height:1.35;color:var(--dsw-alias-label-secondary);' +
                  'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}' +
                  '.vst-card-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px;}' +
                  '.vst-state{font-size:12px;color:var(--dsw-alias-label-secondary);}' +
                  '.vst-state.is-selected{color:var(--dsw-alias-brand-primary);font-weight:600;}' +
                  '.vst-state-error{color:var(--dsw-alias-state-error-primary);}' +
                  '.vst-install-btn{font:inherit;font-size:12px;font-weight:600;padding:4px 12px;cursor:pointer;' +
                  'color:var(--dsw-alias-bg-base);background:var(--dsw-alias-brand-primary);' +
                  'border:1px solid var(--dsw-alias-brand-primary);border-radius:6px;}' +
                  '.vst-install-btn:hover{filter:brightness(1.1);}' +
                  '.vst-install-btn.is-disabled{opacity:.5;cursor:default;filter:none;}' +
                  '.vst-empty{padding:32px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:14px;}',
              },
            }),
            h(
              'div',
              { className: 'vst-header' },
              h('h2', { className: 'vst-title' }, t('section.title')),
              h('p', { className: 'vst-subtitle' }, t('count', { n: localThemes.length })),
            ),
            h('input', {
              className: 'vst-search',
              type: 'search',
              placeholder: t('search.placeholder'),
              value: query,
              onChange: (e) => setQuery(e.target.value),
            }),
            h(
              'div',
              { className: 'vst-section' },
              localThemes.length === 0
                ? h('div', { className: 'vst-empty' }, t('no.results'))
                : h('div', { className: 'vst-grid' }, localThemes.map((theme) => card(theme, installedIds.has(theme.id) ? 'installed' : 'bundled'))),
            ),
            h(
              'div',
              { className: 'vst-market' },
              h('h3', { className: 'vst-section-title' }, t('market.section')),
              marketAvailable
                ? h(
                    'div',
                    { className: 'vst-market-body' },
                    h('input', {
                      className: 'vst-search',
                      type: 'search',
                      placeholder: t('market.search.placeholder'),
                      defaultValue: '',
                      ref: marketInputRef,
                    }),
                    marketBusy ? h('p', { className: 'vst-state' }, t('market.busy')) : null,
                    !marketBusy && marketShort ? h('p', { className: 'vst-state' }, t('market.minChars')) : null,
                    !marketBusy && !marketShort && marketError ? h('div', { className: 'vst-error' }, marketError) : null,
                    !marketBusy && !marketShort && !marketError && !marketQuery
                      ? h('div', { className: 'vst-empty' }, t('market.empty'))
                      : null,
                    !marketBusy && !marketShort && !marketError && !!marketQuery && marketResults.length === 0
                      ? h('div', { className: 'vst-empty' }, t('no.results'))
                      : null,
                    marketResults.length ? h('div', { className: 'vst-grid' }, marketResults.map((theme) => marketCard(theme))) : null,
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
