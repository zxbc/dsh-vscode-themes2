// Pure update-check / update-apply logic for the VS Code Themes plugin.
//
// Runs Host-side (Node): the browser is network-restricted and cannot write to
// disk. `checkUpdate` compares the locally installed version against the live
// GitHub repo's package.json; `applyUpdate` brings the local source directory
// up to date with `origin/main`. Because the profile installs this plugin as a
// symlink onto this directory, the symlink stays valid after an update and the
// client half hot-reloads the new files via dsh-client-hmr.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';

const pExecFile = promisify(execFile);

export const REPO_URL = 'https://github.com/zxbc/dsh-vscode-themes2';
const LIVE_MANIFEST_URL =
  'https://raw.githubusercontent.com/zxbc/dsh-vscode-themes2/main/package.json';
const TARBALL_URL =
  'https://codeload.github.com/zxbc/dsh-vscode-themes2/tar.gz/refs/heads/main';

const FETCH_TIMEOUT_MS = 8000;
const WORK_TIMEOUT_MS = 60000;

function parseVersion(v) {
  return String(v || '')
    .split('.')
    .map((part) => parseInt(String(part).split(/[-+]/)[0], 10) || 0);
}

/** True when `latest` is strictly newer than `local` (numeric semver compare). */
export function isNewerVersion(latest, local) {
  const a = parseVersion(latest);
  const b = parseVersion(local);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x !== y) return x > y;
  }
  return false;
}

async function fetchJson(url, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) throw new Error('HTTP ' + resp.status + ' fetching ' + url);
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

async function readLocalVersion(pluginDir) {
  const manifest = JSON.parse(
    await fs.readFile(path.join(pluginDir, 'package.json'), 'utf8'),
  );
  return String(manifest.version || '');
}

/**
 * Compare the installed version against the live GitHub repo.
 * @param {string} pluginDir - absolute path of the plugin source directory.
 * @returns {{ local: string, latest: string, hasUpdate: boolean, repoUrl: string }}
 */
export async function checkUpdate(pluginDir) {
  const local = await readLocalVersion(pluginDir);
  const live = await fetchJson(LIVE_MANIFEST_URL, FETCH_TIMEOUT_MS);
  const latest = String(live.version || '');
  return {
    local,
    latest,
    hasUpdate: Boolean(latest) && isNewerVersion(latest, local),
    repoUrl: REPO_URL,
  };
}

/**
 * Update the plugin in place.
 *   1. Prefer `git pull --ff-only` in the source directory (the profile symlink
 *      points straight at this checkout, so the pull updates the live plugin).
 *   2. Fall back to downloading the main-branch tarball and copying its files
 *      over when the checkout is not pullable (dirty tree, no origin, …).
 * @param {string} pluginDir - absolute path of the plugin source directory.
 * @returns {{ ok: true, version: string, method: string }} | {{ ok: false, error: string }}
 */
export async function applyUpdate(pluginDir) {
  // 1. Preferred path: fast-forward the checkout that the profile symlinks.
  try {
    await pExecFile(
      'git',
      ['-C', pluginDir, 'pull', '--ff-only', 'origin', 'main'],
      { timeout: WORK_TIMEOUT_MS, maxBuffer: 1024 * 1024 },
    );
    const version = await readLocalVersion(pluginDir);
    return { ok: true, version, method: 'git' };
  } catch (gitError) {
    const gitMsg = String((gitError && gitError.message) || gitError);
    // 2. Fall back to the tarball path ONLY when the checkout is clean — a dirty
    //    tree means uncommitted local work that a blind overwrite would destroy.
    let dirty = true;
    try {
      const { stdout } = await pExecFile(
        'git',
        ['-C', pluginDir, 'status', '--porcelain'],
        { timeout: 10000, maxBuffer: 1024 * 1024 },
      );
      dirty = stdout.trim().length > 0;
    } catch (_statusError) {
      dirty = true; // not a git checkout (or status failed): treat as unsafe.
    }
    if (dirty) {
      return {
        ok: false,
        error:
          'The plugin directory has uncommitted local changes; commit or stash them before updating. (' +
          gitMsg +
          ')',
      };
    }
    try {
      const version = await applyUpdateViaTarball(pluginDir);
      return { ok: true, version, method: 'tarball' };
    } catch (err) {
      return { ok: false, error: String((err && err.message) || err) };
    }
  }
}

async function applyUpdateViaTarball(pluginDir) {
  const tmpRoot = await fs.mkdtemp('/tmp/dst-themes-update-');
  const tgzPath = path.join(tmpRoot, 'latest.tar.gz');
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), WORK_TIMEOUT_MS);
    let resp;
    try {
      resp = await fetch(TARBALL_URL, { signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!resp.ok) {
      throw new Error('HTTP ' + resp.status + ' downloading the update tarball');
    }
    await fs.writeFile(tgzPath, Buffer.from(await resp.arrayBuffer()));
    await pExecFile('tar', ['-xzf', tgzPath, '-C', tmpRoot], { timeout: WORK_TIMEOUT_MS });

    // The archive unpacks into a single top-level directory.
    const entries = await fs.readdir(tmpRoot, { withFileTypes: true });
    const top = entries.find((e) => e.isDirectory());
    if (!top) throw new Error('unexpected tarball layout: no top-level directory');
    const src = path.join(tmpRoot, top.name);

    // Copy each top-level entry over the live checkout, keeping the local
    // .git directory (and anything git-ignored, like node_modules) untouched.
    for (const name of await fs.readdir(src)) {
      if (name === '.git') continue;
      const from = path.join(src, name);
      const to = path.join(pluginDir, name);
      await fs.rm(to, { recursive: true, force: true });
      await fs.cp(from, to, { recursive: true });
    }
    return readLocalVersion(pluginDir);
  } finally {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  }
}
