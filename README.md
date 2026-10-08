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
npm test               # 15 validators, exits non-zero on failure
npm run test:quiet     # only failures and the summary
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
| `check-tokens` | a `var(--x)` reference to a token nothing defines |
| `check-contrast` | a text/background pair below WCAG AA, in **either** theme |
| `test-theme-resolve` | the theme preference resolving wrongly for any preference × OS combination |
| `audit-dark-risk` | a light literal used as a background, or a `--navy` used as text colour |
| `test-migration` | a state migration that loses or corrupts learner progress |

Fifteen checks, all gates. `audit-dark-risk` was a report while dark mode was
unbuilt — it listed 73 known sites and was deliberately excluded. Now that dark
mode ships, those are real defects, so it gates like the rest.

The three theme checks exist because dark mode fails in ways light mode hides.
`check-contrast` reads both token blocks straight out of the CSS, so it cannot
drift from the stylesheet.

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
must run before `game.js` reads state.

`theme.js` is the exception: it lives at the site root and is loaded from
`<head>`, **synchronously and before paint**, because a dark-mode visitor must
not see a flash of the light theme. It must never be deferred and must never be
inlined — the CSP is `script-src 'self'`. Both pages load the same file; each
defines its own tokens.

### Dark mode

Preference lives in `localStorage['theme-pref']` as `auto` | `light` | `dark`,
absent meaning `auto`. `theme.js` resolves it against the OS setting and writes
a **concrete** `light`/`dark` to `data-theme` on `<html>`, so CSS needs only one
`[data-theme="dark"]` block rather than duplicating every token in a media query.
It also rewrites `<meta name="theme-color">` and re-resolves on an OS change,
but only while the preference is `auto` — otherwise a deliberate choice would be
overridden at sunset.

The key is separate from `igsg_daily_v1` on purpose: a display preference is not
learning progress, a corrupt app state must not be able to reset it, and sharing
it means picking Dark in the app also darkens the marketing site. No migration is
needed and no version bump.

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
- **Spanish strings are hardcoded** in markup and JS. No i18n.
- **The main site has no offline support**; only the app has a service worker.

---

## Deployment

GitHub Pages, from `main`. `/` is the repository root.

`.gitattributes` marks `package.json`, `tools/` and `.github/` as
`export-ignore` so they stay out of a `git archive` tarball. That does not affect
what Pages serves, which is the branch content rather than an archive; those
files are harmless in either case.

`HANDOFF.md` was untracked, so Pages no longer serves it. It stays on disk as
local working notes and is gitignored. It previously contained the maintainer's
local path and OS username at a publicly reachable URL. `robots.txt` keeps the
rule as a backstop.

Never commit or push without the owner saying so. They review the live site
before deciding.