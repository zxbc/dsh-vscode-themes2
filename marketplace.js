// Pure VS Code Marketplace logic, verified in isolation. Network access runs in
// the Host (Node) process: real fetch, DecompressionStream, Blob, Response,
// TextDecoder, DataView. No Cordis / Typert wiring here — the service wrapper is
// added on top by index.js once the plugin is restored to a working state.

// ------------------------------------------------------------------
// Color utilities
// ------------------------------------------------------------------
export function parseColor(str) {
  if (typeof str !== 'string') return null;
  const s = str.trim();
  if (s[0] === '#') {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) hex += 'ff';
    if (hex.length !== 8 || !/^[0-9a-fA-F]{8}$/.test(hex)) return null;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: parseInt(hex.slice(6, 8), 16),
    };
  }
  const m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return {
        r: Math.max(0, Math.min(255, Math.round(parts[0]))),
        g: Math.max(0, Math.min(255, Math.round(parts[1]))),
        b: Math.max(0, Math.min(255, Math.round(parts[2]))),
        a: parts[3] !== undefined ? Math.round(Math.max(0, Math.min(1, parts[3])) * 255) : 255,
      };
    }
  }
  return null;
}

function toHex(c) {
  const p = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + p(c.r) + p(c.g) + p(c.b) + (c.a < 255 ? p(c.a) : '');
}

function withAlpha(color, alpha) {
  const c = parseColor(color);
  if (!c) return color;
  c.a = Math.round(alpha * 255);
  return toHex(c);
}

function mix(c1, c2, t) {
  const a = parseColor(c1);
  const b = parseColor(c2);
  if (!a || !b) return c1;
  return toHex({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t, a: 255 });
}

// ------------------------------------------------------------------
// Map a VS Code theme (its `colors` table) onto the 14 DSW tokens.
// ------------------------------------------------------------------
export function mapToDswTokens(colors, uiTheme) {
  const bg = colors['editor.background'];
  const fg = colors['editor.foreground'];
  if (!parseColor(bg)) throw new Error('theme has no usable editor.background color');
  if (!parseColor(fg)) throw new Error('theme has no usable editor.foreground color');
  const pick = (...keys) => {
    for (const k of keys) if (colors[k] && parseColor(colors[k])) return colors[k];
    return null;
  };
  const border = pick('focusBorder', 'widget.border', 'panel.border') || mix(bg, fg, 0.18);
  const dark = uiTheme === 'vs-dark' ? true : uiTheme === 'vs' || uiTheme === 'vs-light' ? false : true;
  return {
    tokens: {
      '--dsw-alias-bg-base': bg,
      '--dsw-alias-bg-layer-1': pick('sideBar.background', 'titleBar.background', 'panel.background') || bg,
      '--dsw-alias-bg-layer-2': pick('input.background', 'editorWidget.background', 'dropdown.background') || bg,
      '--dsw-alias-bg-overlay': pick('editorWidget.background', 'panel.background') || bg,
      '--dsw-alias-border-l1': border,
      '--dsw-alias-border-l2': pick('focusBorder', 'panel.border') || border,
      '--dsw-alias-brand-primary': pick('button.background', 'list.activeSelectionForeground', 'focusBorder') || mix(bg, fg, 0.5),
      '--dsw-alias-label-primary': fg,
      '--dsw-alias-label-secondary': pick('descriptionForeground') || withAlpha(fg, 0.62),
      '--dsw-alias-state-error-primary': pick('errorForeground', 'editorError.foreground') || '#cb2431',
      '--dsw-alias-state-idle-primary': withAlpha(fg, 0.55),
      '--dsw-alias-state-success-primary': '#28a745',
      '--dsw-alias-state-warn-primary': '#f9c513',
      '--dsw-specific-sidebar-fill': pick('sideBar.background', 'activityBar.background', 'titleBar.background') || bg,
    },
    colorScheme: dark ? 'dark' : 'light',
  };
}

// ------------------------------------------------------------------
// JSONC → JSON. VS Code theme files are JSONC: they may contain // and
// /* */ comments AND trailing commas (`, }` / `, ]`), neither of which
// JSON.parse accepts. Both are stripped here.
// ------------------------------------------------------------------
function stripJsonc(s) {
  let out = '';
  let i = 0;
  let inStr = false;
  let esc = false;
  // Index of the next non-whitespace, non-comment character at/after `from`.
  const nextMeaningful = (from) => {
    let j = from;
    while (j < s.length) {
      const ch = s[j];
      if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') { j += 1; continue; }
      if (ch === '/' && s[j + 1] === '/') { while (j < s.length && s[j] !== '\n') j += 1; continue; }
      if (ch === '/' && s[j + 1] === '*') {
        j += 2;
        while (j < s.length && !(s[j] === '*' && s[j + 1] === '/')) j += 1;
        j += 2;
        continue;
      }
      return j;
    }
    return j;
  };
  while (i < s.length) {
    const c = s[i];
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      i += 1;
      continue;
    }
    if (c === '"') { inStr = true; out += c; i += 1; continue; }
    if (c === '/' && s[i + 1] === '/') { while (i < s.length && s[i] !== '\n') i += 1; continue; }
    if (c === '/' && s[i + 1] === '*') { i += 2; while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) i += 1; i += 2; continue; }
    if (c === ',') {
      // Drop trailing commas (`, }` / `, ]`), including ones separated by
      // whitespace or comments. String-aware by construction.
      const j = nextMeaningful(i + 1);
      if (s[j] === '}' || s[j] === ']') { i += 1; continue; }
      out += c;
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

// ------------------------------------------------------------------
// Minimal ZIP reader (central directory) for .vsix archives
// ------------------------------------------------------------------
function findEocd(view, len) {
  const start = Math.max(0, len - 22 - 65535);
  for (let i = len - 22; i >= start; i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) return i;
  }
  return -1;
}

function readZipEntries(view, u8, len) {
  const eocd = findEocd(view, len);
  if (eocd === -1) throw new Error('not a ZIP archive (end record not found)');
  const count = view.getUint16(eocd + 10, true);
  let off = view.getUint32(eocd + 16, true);
  const entries = new Map();
  for (let n = 0; n < count; n += 1) {
    if (view.getUint32(off, true) !== 0x02014b50) break;
    const method = view.getUint16(off + 10, true);
    const compSize = view.getUint32(off + 20, true);
    const nameLen = view.getUint16(off + 28, true);
    const extraLen = view.getUint16(off + 30, true);
    const commentLen = view.getUint16(off + 32, true);
    const localOff = view.getUint32(off + 42, true);
    const name = new TextDecoder().decode(u8.slice(off + 46, off + 46 + nameLen));
    entries.set(name, { method, compSize, localOff });
    off += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function inflateRaw(data) {
  const ds = new DecompressionStream('deflate-raw');
  const stream = new Blob([data]).stream().pipeThrough(ds);
  return new Response(stream).arrayBuffer();
}

async function extractZipEntry(view, u8, entries, name) {
  const e = entries.get(name);
  if (!e) throw new Error('ZIP entry not found: ' + name);
  if (view.getUint32(e.localOff, true) !== 0x04034b50) throw new Error('bad local header for ' + name);
  const nameLen = view.getUint16(e.localOff + 26, true);
  const extraLen = view.getUint16(e.localOff + 28, true);
  const dataStart = e.localOff + 30 + nameLen + extraLen;
  const data = u8.slice(dataStart, dataStart + e.compSize);
  if (e.method === 0) return data;
  if (e.method === 8) return new Uint8Array(await inflateRaw(data));
  throw new Error('unsupported ZIP compression method ' + e.method + ' for ' + name);
}

// ------------------------------------------------------------------
// VS Code Marketplace (network access runs in the Host process)
// ------------------------------------------------------------------
const MP_API = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';
const MP_ACCEPT = 'application/json;api-version=3.0-preview';
const MAX_RESULTS = 12;

export function themeId(ext) {
  return 'vscode-' + String(ext.publisher).toLowerCase() + '-' + String(ext.name).toLowerCase();
}

/** Search the VS Code Marketplace for theme extensions. */
export async function searchMarketplace(query) {
  const criteria = [{ filterType: 5, value: 'Themes' }];
  if (query) criteria.push({ filterType: 10, value: query });
  const resp = await fetch(MP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: MP_ACCEPT },
    body: JSON.stringify({
      filters: [{ criteria, page: 1, size: MAX_RESULTS }],
      assetTypes: [],
      flags: 255,
    }),
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const data = await resp.json();
  return (data.results || [])
    .flatMap((r) => r.extensions || [])
    .map((e) => ({
      publisher: e.publisher && e.publisher.publisherName,
      name: e.extensionName,
      displayName: e.displayName,
      version: e.versions && e.versions[0] && e.versions[0].version,
      description: e.shortDescription || '',
    }))
    .filter((e) => e.publisher && e.name && e.version);
}

function vsixUrl(publisher, name, version) {
  return 'https://' + publisher + '.gallery.vsassets.io/_apis/public/gallery/publishers/' +
    publisher + '/vsextensions/' + name + '/' + version + '/vspackage';
}

// Download a theme extension and convert its first color theme to DSW tokens.
// Returns { id, name, colorScheme, tokens, publisher, version }.
export async function fetchThemeDefinition(ext) {
  const resp = await fetch(vsixUrl(ext.publisher, ext.name, ext.version));
  if (!resp.ok) throw new Error('download failed (HTTP ' + resp.status + ')');
  const u8 = new Uint8Array(await resp.arrayBuffer());
  const view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const entries = readZipEntries(view, u8, u8.byteLength);
  const pkg = JSON.parse(new TextDecoder().decode(await extractZipEntry(view, u8, entries, 'extension/package.json')));
  const themes = (pkg.contributes && pkg.contributes.themes) || [];
  if (!themes.length) throw new Error('extension provides no color theme');
  const themeEntry = themes[0];
  const themePath = 'extension/' + String(themeEntry.path).replace(/^\.?\/+/, '');
  const themeJson = JSON.parse(stripJsonc(new TextDecoder().decode(await extractZipEntry(view, u8, entries, themePath))));
  const mapped = mapToDswTokens(themeJson.colors || {}, themeEntry.uiTheme);
  return {
    id: themeId(ext),
    name: themeEntry.label || ext.displayName || ext.name,
    colorScheme: mapped.colorScheme,
    tokens: mapped.tokens,
    publisher: ext.publisher,
    version: ext.version,
  };
}
