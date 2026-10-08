# Inglés Sin Guion

Three static sites in one repository, deployed to GitHub Pages.

| Path | What it is |
|---|---|
| `/` | Consultancy marketing page. Hero, method, pricing, FAQ, contact. |
| `/english-daily/` | **1 Oración al Día** — a daily English practice app. 365 sentences, 73 lessons, a 30-question placement test, XP, streaks, gems, and five extra practice modes. |
| `/pangal-esports/` | Pangal e-sports roster page. Quiet footer link only, `noindex`, not in the sitemap. |

No build step. No bundler. No framework. Open the HTML and it works.

---

## Running it locally

```bash
npm run serve          # python -m http.server 8000 --bind 127.0.0.1
# then open http://127.0.0.1:8000/
```

A server is required rather than `file://` because the app uses
`localStorage`, the service worker, and same-origin fetches.

## Tests

```bash
npm test               # 11 validators, exits non-zero on failure
npm run test:quiet     # only failures and the summary
npm run test:dark      # adds the dark-mode report (see below)
```

Runs in CI on every push to `main` and on every pull request.

| Validator | Catches |
|---|---|
| `validate-sentences` | distractor identical to the answer, duplicate distractors, missing `we`/`ws`, garbage text, cross-language leakage |
| `check-options` | the same for the personalised corpus |
| `validate-placement` | placement items missing an answer, wrong options or an explanation |
| `test-placement-bands` | a band cutoff that no longer matches the documented points |
| `check-cuts-in-sync` | cutoffs disagreeing between `placement.js` and `game.js` |
| `validate-tip-examples` | a tip whose example gives away a whole answer |
| `validate-tip-fillblank` | a tip teaching the exact word a blank expects |
| `validate-placement-count` | **a number shown to users disagreeing with `placement.js`** |
| `check-jsonld` | malformed structured data, and product claims that overstate reality |
| `check-asset-refs` | a page pointing at an image, icon or stylesheet that is not on disk |
| `test-migration` | a state migration that loses or corrupts learner progress |

`audit-dark-risk` is a **report, not a gate**: it lists colours that will look
wrong in dark mode and currently reports 73 sites. It is excluded from
`npm test` on purpose — dark mode is not built yet, so those findings are known
and expected. `npm run test:dark` includes it.

`validate-placement-count` exists because of a specific bug: the placement modal
and the JSON-LD both advertised "20 preguntas" while the test actually had 30.
Real numbers now live in one place, and the validator fails if any user-facing
string drifts away from them.

### Icons

```bash
npm run icons          # regenerate (needs Pillow: pip install pillow)
npm run icons:check    # verify only, fails if missing or oversized
```

`image4.webp` is a 372 KB, 3136×4224 portrait photo. It was being served as the
favicon, as the `apple-touch-icon` and as a 40–44 px avatar on every page, and
accounted for half the service worker precache. The derivatives are generated
from `image5.webp`, an existing 812×812 square crop of the same photo. iOS
ignores WebP for `apple-touch-icon`, so that one must stay PNG.

---

## The rules that matter

**Never rename or clear `localStorage['igsg_daily_v1']`.** It holds everything a
learner has done. It is one JSON object. `load()` merges saved values over
`defaultState()` by whitelist, so a *missing* field safely takes its default and
an *unknown* field is ignored. That is what makes adding a field safe and
removing one destructive.

**Only `state.placement` may be cleared by a migration.** XP, gems, streak,
completed lessons, badges and the first name are never touched by a migration.
When the placement test content changed, `migrations.js` moved
`CURRENT_VERSION` up and every learner re-sat the test while keeping all
progress. That is the pattern.

**A migration version means "the questions changed", not "the app changed".**
`game.js` stamps new placements with the current version, and `migrations.js`
discards any placement not stamped with it.

**`sw.js` `CACHE_VERSION` must be bumped whenever a precached file changes.**
Otherwise `install` never re-runs and users keep stale assets. It was missed for
nine commits once already.

**No third-party JavaScript, ever.** The CSP is `script-src 'self'` on all four
pages, and that only works because nothing loads code from elsewhere. Adding a
tag manager or analytics would require weakening it. If you need error
visibility, add a `window.onerror` handler first and keep it same-origin.

**No inline `<script>` or `on*` attributes.** CSP blocks them, which is the
point. Test code must be an external same-origin file loaded with
`<script src>`.

**Dark mode token rule.** A token may not serve two roles across two themes. A
single token used as both a surface and as text cannot be themed correctly; it
has to be split. `audit-dark-risk` exists to catch this.

---

## Layout

```
index.html              marketing page
style.css               its styles (38 tokens, semantic roles named)
site.js                 nav, scrollspy, drawer, quiz, WhatsApp links
404.html
robots.txt  sitemap.xml

english-daily/
  index.html            app shell, script load order matters
  daily.css             20 tokens in :root
  game.js               all app logic, one IIFE, ~2600 lines
  sentences.js          365 sentences, 128 KB, the largest file
  placement.js          30 placement items, hand-written distractors
  migrations.js         CURRENT_VERSION + state migrations
  sw.js                 network-first with a 4s timeout, precache manifest
  manifest.webmanifest
  features/             tips, fillblank, challenge, phrasebook, review
  icons/

pangal-esports/         independent, own CSS and JS, noindex

tools/                  validators, run-all, icon generator, path helper
.github/workflows/      CI
```

### Load order in the app

`sentences.js` → `placement.js` → `migrations.js` → `game.js`. `migrations.js`
must run before `game.js` reads state. In `index.html` the theme script would go
in `<head>` when dark mode is built.

### Known weaknesses

- **`game.js` is one ~2600-line file.** Everything reaches shared state through a
  global `DailyGame` hook. It works, but it is hard to test and hard to delete
  features from. Splitting it is the biggest refactor available.
- **`localStorage` state has no schema validation.** `load()` whitelists keys but
  does not check types, so a hand-edited `hearts: "5"` flows into logic.
- **No error reporting.** 7 `console.error` calls, no global handler. A fault on a
  user's phone is invisible.
- **`frame-ancestors` is not set**, because it cannot be sent from a `<meta>`
  CSP. Every page is framable. Needs a host in front of Pages.
- **`HANDOFF.md` is tracked and therefore published.** It contains the
  maintainer's local path and OS username. `robots.txt` disallows it, which keeps
  it out of search indexes but does not stop Pages serving it. Untrack it.
- **Spanish strings are hardcoded** in markup and JS. No i18n.
- **The main site has no offline support**; only the app has a service worker.

---

## Deployment

GitHub Pages, from `main`. `/` is the repository root.

`.gitattributes` marks `HANDOFF.md`, `package.json`, `tools/` and `.github/` as
`export-ignore` so they stay out of a `git archive` tarball.

**That does not protect the deployed site.** GitHub Pages publishes the branch
content, not an archive, so `export-ignore` changes nothing about what is served.
`package.json`, `tools/` and `.github/` being visible is harmless — they are not
secrets. `HANDOFF.md` is not harmless: it is still published and still contains
the maintainer's local path and OS username. The only things that actually work
are untracking it, or hosting from a build step that excludes it. It has not been
done, because untracking is an owner decision.

Never commit or push without the owner saying so. They review the live site
before deciding.