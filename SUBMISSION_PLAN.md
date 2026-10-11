# Plan: submit dsh-vscode-themes2 to the DSH Plugin Hub (dsh-plugin.org)

Status: **INVESTIGATION DONE — awaiting user review. Nothing submitted, nothing changed.**
Investigated: 2026-10-11 (Atlantic/Reykjavik)

## 1. How the hub works (findings)

dsh-plugin.org is a community-maintained, unofficial plugin hub (repo: `dshplugin/dsh-plugin-hub`).
It lists plugins by **crawling GitHub**:

- It scans the GitHub topic **`dsh-plugin`** — repos carrying it are detected, auto-listed,
  then human-reviewed ("Verified" badge). Listings refresh daily (last refresh: Oct 10, 2026).
- To be listed faster, a developer may open an issue in `dshplugin/dsh-plugin-hub` using the
  hub's fixed submission template. The hub's own FAQ: "Publish your plugin as a public GitHub
  repository and add the dsh-plugin topic. This hub periodically scans that topic… For details,
  see the Submit page."

### Formal listing requirements (from dsh-plugin.org/submit)

| # | Requirement | Our status |
|---|---|---|
| 1 | Repo must be public | ✅ already public (`github.com/zxbc/dsh-vscode-themes2`) |
| 2 | GitHub topic `dsh-plugin` on the repo | ❌ missing (topics: `[]`) |
| 3 | README includes a copyable install command such as `dsh plugin --profile web add <package>` | ❌ README only documents the local-path install |
| 4 | Plugin exports an `apply(ctx)` module per the DSH plugin spec | ✅ both halves do (client.js L486; index.js host half); proven by the running profile |
| 5 | No impersonation of the official DeepSeek team | ✅ personal plugin, clearly named |

### Trust-signal checklist (same page — affects listing quality)

- One-line value ✅ (will be written)
- Copyable install command ❌ (will be added — verified working, see §3)
- Visible proof (screenshot/demo) ⚠️ (3 screenshots exist in repo root, untracked — will be committed)
- Clear risk (permissions, external services, compatibility) ⚠️ (will be documented)
- Accurate category ⚠️ (will state **UI & Experience** — matches the hub's own plugin's category)
- Clear license ❌ (no LICENSE file, `license` field null on GitHub — **user decision needed**)

### What a live listing shows (checked on the hub's own listing page)

Name, description, category, Verified badge, install command, platform, author, "key features"
(auto-extracted from the README), repo stats (stars/language/license/version/topics), and an
auto-generated repo summary. ⇒ A well-structured README directly improves the listing.

## 2. What needs to change in the GitHub repo

1. **README.md** — add:
   - One-line value at the top.
   - **Install section with the public command** (the hard requirement):
     ```bash
     dsh plugin --profile web add github:zxbc/dsh-vscode-themes2
     ```
     (Keep the local-path install as a secondary option.)
   - Screenshot embed(s) from a new `screenshots/` folder.
   - Category line: UI & Experience.
   - Compatibility: DSH 0.2.1-alpha.1, web profile; host half needs Node 18+ (uses `DecompressionStream`).
   - Permissions & external services: host half talks to the official VS Code Marketplace API
     (`marketplace.visualstudio.com`) and downloads `.vsix` files from `{publisher}.gallery.vsassets.io`
     only for themes the user explicitly installs; parsing is local; no telemetry; browser state is
     localStorage-only (`dsh.vscodeThemes.*`).
   - License section (matching the new LICENSE file).
   - Fix wording: README currently calls this a "private dev repo" — it is public now.
2. **LICENSE** — add the file (user picks: **MIT recommended**, Apache-2.0, or none) + `"license"` field in package.json.
3. **screenshots/** — commit `preview-themes.png` (1280×800 hero: card grid + Active pill) and
   `preview-lean-v2.png` (2240×1800, full panel). Drop `preview-lean.png` (superseded) — or commit all three if preferred.
4. **package.json** — add `"license": "<chosen>"`; optionally drop `"private": true`
   (harmless either way — git-spec installs ignore it, verified; dropping it also makes a future npm publish possible).
   No rename of `@local/dsh-vscode-themes2`: it works for public installs (verified) and renaming would
   break the installed profile's package name.
5. **GitHub topics** (API, not a repo file) — set `dsh-plugin` (+ descriptive: `vscode-themes`,
   `deepseek-harness`, `themes`).

> Note: `PROGRESS.md` is already committed and public (agent-maintained dev log). It's harmless for
> the listing; flag it here so the user can decide whether to trim it or leave it.

## 3. De-risking already done (empirical)

- **Install path tested end-to-end**: `pnpm add github:zxbc/dsh-vscode-themes2` in a scratch dir
  succeeded; the package resolves as `@local/dsh-vscode-themes2` (pnpm uses the repo's package.json
  name; `private: true` does not block git-spec installs). `dsh plugin --profile <name> add <pkg>`
  is a straight pnpm forwarder (verified via `dsh plugin --help`), and the running web profile already
  loads exactly this name/layout — so the README command will work for users.
- **GitHub API access**: authenticated as `zxbc`, `admin: true` on this repo ⇒ I can set topics
  (PATCH) and open issues.
- **Hub repo accepts issues** (`has_issues: true`, 9 open — the submission queue).
- **`dshTarget` is not a DSH runtime field** (absent from DSH lib and from the hub's own package.json)
  ⇒ compatibility is documented in README/issue text instead; no package.json invention needed.

## 4. Execution plan (phases)

### Phase 0 — user decisions (DECIDED 2026-10-11)
- [x] License: **MIT**
- [x] Category: **UI & Experience**
- [x] Screenshots: **all three** (committed to `screenshots/`: theme-gallery.png,
      theme-gallery-v2.png, theme-gallery-v1.png)
- [x] Scope: **repo prep only for now** (Phase 1 executed); phases 2–3 await review

### Phase 1 — repo prep (agent does; one commit, push)
1. Create `screenshots/`, move chosen PNGs in.
2. Update README per §2.1; add LICENSE; update package.json per §2.4.
3. Commit + push to `main`.

### Phase 2 — GitHub topic (agent does, API)
4. `PATCH /repos/zxbc/dsh-vscode-themes2` → topics `dsh-plugin`, `vscode-themes`, `deepseek-harness`, `themes`.
   (From this moment the crawler can list us on its own daily refresh.)

### Phase 3 — submission issue (agent does, API — only after go-ahead)
5. Create issue in `dshplugin/dsh-plugin-hub` using the hub's exact template:
   - Title: `[Plugin submission] zxbc/dsh-vscode-themes2 — Browse, install and apply VS Code color themes to the Harness Web UI`
   - Body (pre-drafted for review):

     ```markdown
     ### Repository
     https://github.com/zxbc/dsh-vscode-themes2

     ### One-line value
     Adds a "VS Code Themes" section to Settings where you can browse 14 bundled themes, search the
     official VS Code Marketplace, install themes with one click, and apply any of them live to the
     whole Harness Web UI.

     ### Category
     UI & Experience

     ### Install command
     dsh plugin --profile web add github:zxbc/dsh-vscode-themes2

     ### Compatibility
     DSH 0.2.1-alpha.1, web profile; host half requires Node 18+ (DecompressionStream).

     ### License
     MIT

     ### Screenshots / demo
     https://github.com/zxbc/dsh-vscode-themes2/blob/main/screenshots/theme-gallery.png

     ### Notes
     Permissions / external services: the host half queries the official VS Code Marketplace API
     (marketplace.visualstudio.com) and downloads .vsix packages from {publisher}.gallery.vsassets.io
     only for themes the user explicitly installs; all parsing is local; no telemetry; browser state
     is localStorage-only. Known limitation: themes without a parseable editor.background/foreground
     are skipped with a visible error message.

     ### Pre-submission checklist
     - [x] Repository is public
     - [x] GitHub topic `dsh-plugin` added
     - [x] README includes the install command
     - [x] Plugin exports an `apply(ctx)` module
     ```

### Phase 4 — post-listing (agent does, after listing appears)
6. Poll `https://dsh-plugin.org/plugins/zxbc/dsh-vscode-themes2` until the listing is live
   (daily refresh; the issue normally accelerates review).
7. Add the hub's "Listed on dsh-plugin.org" badge to the README (their badge template, slug
   `zxbc/dsh-vscode-themes2`), commit + push.
8. Report the live listing URL to the user.

## 5. What the agent can do alone vs. what the user must do

- **Agent (all of it):** repo edits, commit + push, topic via API, issue via API, post-listing
  polling, badge commit.
- **User:** the Phase 0 decisions above (license, category, screenshots, go-ahead) and the final
  visual check. No browser action is required from the user for any step.

## 6. Risks / caveats

- The hub is **community-run and unofficial** (not affiliated with DeepSeek AI); "Verified" is
  their human review, not an official endorsement. Neutral, but worth knowing.
- Screenshot `preview-themes.png` predates the final card-button fix; the button colours shown are
  one iteration old (subtle). A fresh capture is optional polish, not a blocker.
- Listing is not guaranteed on a timeline ("usually within one refresh cycle"); worst case we wait
  for the next daily crawl — the topic already makes the repo discoverable.
- Nothing in this plan modifies `client.js`/`index.js`/`marketplace.js` — no runtime impact on the
  installed profile.
