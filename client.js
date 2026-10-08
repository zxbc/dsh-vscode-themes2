window.__ModuleLoader__.load({
  id: '@local/dsh-vscode-themes2',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // Curated VS Code themes pre-mapped to DSH tokens (built at authoring time).
    const THEMES = [
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

    const NS = 'vscode-themes';
    const ENTRY_ID = 'vscode-themes';

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        const t = ctx.locale.bind(NS);

        // Register locale strings for this plugin's UI.
        ctx.locale.register(NS, 'en', {
          'section.title': 'VS Code Themes',
          'search.placeholder': 'Search themes…',
          'applied': 'Applied',
          'apply': 'Apply',
          'no.results': 'No themes match your search.',
          'count': '{n} themes',
          'scheme.dark': 'dark',
          'scheme.light': 'light',
        });

        const STORAGE_KEY = 'dsh.vscodeThemes.selected';
        let selectedId = '';
        try { selectedId = localStorage.getItem(STORAGE_KEY) || ''; } catch (_) {}

        // Register every bundled theme with the theme runtime.
        const themeDisposers = [];
        for (const theme of THEMES) {
          try {
            themeDisposers.push(
              ctx.theme.register({
                id: theme.id,
                colorScheme: theme.colorScheme,
                tokens: theme.tokens,
              }),
            );
          } catch (err) {
            console.error('vscode-themes register failed', theme.id, err);
          }
        }

        // Apply the persisted selection (if any) for this session.
        if (selectedId && THEMES.some((th) => th.id === selectedId)) {
          ctx.theme.setTheme(selectedId);
        }

        function persistSelected(id) {
          try {
            if (id) localStorage.setItem(STORAGE_KEY, id);
            else localStorage.removeItem(STORAGE_KEY);
          } catch (err) {
            console.error('vscode-themes persist failed', err);
          }
        }

        function ThemeBrowser(props) {
          const [query, setQuery] = React.useState('');
          const [selected, setSelected] = React.useState(selectedId);

          const q = query.trim().toLowerCase();
          const filtered = q
            ? THEMES.filter((th) => th.name.toLowerCase().indexOf(q) !== -1)
            : THEMES;

          function selectTheme(id) {
            if (id === selected) return;
            ctx.theme.setTheme(id);
            setSelected(id);
            persistSelected(id);
          }

          function previewStrip(theme) {
            const tk = theme.tokens;
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
                h('span', { key: i, className: 'vst-swatch', style: { background: c } }),
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
                  '.vst-search{width:100%;max-width:420px;box-sizing:border-box;padding:8px 12px;font-size:14px;' +
                  'color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);' +
                  'border:1px solid var(--dsw-alias-border-l1);border-radius:8px;outline:none;}' +
                  '.vst-search:focus{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}' +
                  '.vst-card{display:flex;flex-direction:column;gap:8px;padding:14px;cursor:pointer;text-align:left;' +
                  'background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;' +
                  'color:var(--dsw-alias-label-primary);font:inherit;transition:border-color .12s,transform .06s;}' +
                  '.vst-card:hover{border-color:var(--dsw-alias-brand-primary);}' +
                  '.vst-card:active{transform:scale(.99);}' +
                  '.vst-card.selected{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary);}' +
                  '.vst-card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;}' +
                  '.vst-name{font-size:14px;font-weight:600;}' +
                  '.vst-badge{font-size:11px;padding:2px 8px;border-radius:999px;' +
                  'background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);}' +
                  '.vst-preview{display:flex;gap:4px;height:18px;border-radius:6px;overflow:hidden;}' +
                  '.vst-swatch{flex:1;display:block;}' +
                  '.vst-state{font-size:12px;color:var(--dsw-alias-label-secondary);}' +
                  '.vst-state.is-selected{color:var(--dsw-alias-brand-primary);font-weight:600;}' +
                  '.vst-empty{padding:32px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:14px;}',
              },
            }),
            h(
              'div',
              { className: 'vst-header' },
              h('h2', { className: 'vst-title' }, t('section.title')),
              h('p', { className: 'vst-subtitle' }, t('count', { n: THEMES.length })),
            ),
            h('input', {
              className: 'vst-search',
              type: 'search',
              placeholder: t('search.placeholder'),
              value: query,
              onChange: (e) => setQuery(e.target.value),
            }),
            filtered.length === 0
              ? h('div', { className: 'vst-empty' }, t('no.results'))
              : h(
                  'div',
                  { className: 'vst-grid' },
                  filtered.map((theme) => {
                    const isSelected = theme.id === selected;
                    return h(
                      'button',
                      {
                        key: theme.id,
                        type: 'button',
                        className: 'vst-card' + (isSelected ? ' selected' : ''),
                        onClick: () => selectTheme(theme.id),
                        'aria-pressed': isSelected,
                      },
                      h(
                        'div',
                        { className: 'vst-card-top' },
                        h('span', { className: 'vst-name' }, theme.name),
                        h(
                          'span',
                          { className: 'vst-badge' },
                          t('scheme.' + theme.colorScheme),
                        ),
                      ),
                      previewStrip(theme),
                      h(
                        'span',
                        { className: 'vst-state' + (isSelected ? ' is-selected' : '') },
                        isSelected ? t('applied') : t('apply'),
                      ),
                    );
                  }),
                ),
          );
        }

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            { name: 'settings.section', id: ENTRY_ID, order: 30, label: () => t('section.title') },
            ThemeBrowser,
          ),
        );

        return () => {
          for (const d of themeDisposers) {
            try { d(); } catch (err) { /* ignore */ }
          }
        };
      },
    };
  },
});
