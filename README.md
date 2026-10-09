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
npm test                    # 21 gates, exits non-zero on failure
npm run test:quiet          # only failures and the summary
npm run test:browser         # 21 gates plus the measured contrast probe
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
| `check-light-unchanged` | a colour in the light theme changed without being recorded as intended |
| `test-theme-resolve` | the theme preference resolving wrongly for any preference × OS combination |
| `audit-dark-risk` | a light literal used as a background, or a `--navy` used as text colour |
| `test-migration` | a state migration that loses or corrupts learner progress |
| `test-state-schema` | a corrupt saved field flowing into logic as the wrong type |
| `test-errors-buffer` | an error buffer that grows without bound or loses entries |
| `probe-contrast-browser` | **measured** contrast on every visible text element: both themes, every screen, mobile and desktop, hover and focus states |
| `check-secret-scan` | the CI secret scan quietly ceasing to match real credentials |
| `check-line-endings` | a file that would commit CRLF and break the CI diff |

Nineteen gates in `npm test`, plus the contrast probe in CI. `audit-dark-risk`
was a report while dark mode was unbuilt — it listed 73 known sites and was
deliberately excluded. Now that dark mode ships, those are real defects, so it
gates like the rest.

The theme checks exist because dark mode fails in ways light mode hides.

### `probe-contrast-browser` is the contrast gate

It replaced `check-contrast.js`, which compared ~35 token pairs chosen by hand.
**That hand-picking was the defect, not the tool.** A rule that paints text with
a *raw palette step* instead of a token is invisible to a pair check by
construction: the bug is precisely that the token is not used. Every gate was
green while 19 dark-mode elements on the main site sat below AA, several at
1.00:1, because `h1, h2, h3, h4` set `color: var(--navy-800)` and `--surface`
becomes that same navy in dark mode. The headings were invisible, not faint.

It runs in CI on `ubuntu-latest`, where Chrome is preinstalled, and **fails**
rather than passing quietly if no browser is found — a contrast gate that
silently stops running is the exact failure this work was about.

It drives the browser over the DevTools Protocol and reads computed styles, so
the CSP does not block it (`Runtime.evaluate` injects without writing a file).
The static server is in Node and the browser is discovered across Windows, macOS
and Linux, so there is no Python or PowerShell dependency.

**Coverage, and each piece is there because its absence hid a defect:**

| What it covers | What it caught |
|---|---|
| 1280px and 390px | the mobile drawer links navy-on-navy at 1.00:1 in dark. Invisible, because the drawer is `display: none` above 62rem and a desktop-only sweep reported them as passing |
| every screen, drawer open, quiz step, modals | only the landing state was ever measured |
| hover and focus-visible, via dispatched input events | colour bugs live in hover states, where the background changes under text chosen for a different background |
| pre- AND post-animation | the probe skips `opacity: 0` and force-finishes reveals, so an opacity-multiplied bug like the locked badge (1.96:1) was invisible. Measuring twice catches anything that only passes once animations finish |
| pixel sampling of a screenshot | 16 elements sit over the portrait photo and a gradient, which the DOM genuinely cannot resolve. Each is scrolled to, its text hidden, and the real rendered pixel behind it sampled |

**Things it must not do, each learned the hard way.** Client-to-server WebSocket
frames must be masked or the server silently drops them and the first command
hangs forever. The screenshot is in device pixels while the collector reports
CSS pixels, and the viewport is narrower than the window because of the scrollbar
— so coordinates must be scaled by `devicePixelRatio` read from the page, never
compared against the requested window width. Elements must be re-found by
**index**, not by selector: `p.eyebrow` matches the first eyebrow on the page,
which is in a different light section, and sampling that produced a confident,
completely fictional "1.36:1 failure" for text that was fine. And
`scrollIntoView` must pass `behavior: "instant"`, or the position read back is
still in flight and the sampler measures the page background instead.

**What it cannot measure is reported rather than hidden:** disabled controls, which
WCAG 1.4.3 exempts, and emoji, which render from a colour font that ignores the
CSS colour property entirely. Both are counted and listed on every run.
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

**Dark mode is 100% token-driven on both sites.** `daily.css` was always; the
main site was not, and the gap caused this whole episode. It carried 20
hand-written `[data-theme="dark"] .selector` overrides, each one a place where a
foreground had been themed while the surface behind it was not. They existed
because 14 base rules wrote a raw palette step as a text colour — `color:
var(--navy-800)` — which does not follow the theme, because `--navy-800` is a
fixed palette entry. So the sweep was finished instead of the overrides being
patched. One survives, and cannot be removed: the tick in `.about__list
li::before` is an inline SVG data URI, and `url()` cannot take `var()`.

`style.css` now has exactly one `[data-theme="dark"]` block, redefining tokens.
To check that the per-selector overrides have not crept back:

```bash
grep -c '^\[data-theme="dark"\] \.' style.css   # must print 1
```

(`git grep` searches the index rather than the working tree, so it will report
nothing for a change you have not staged. Use `grep`.)

**Dark surfaces are a ladder, not one value.** `--bg`, `--section-band`,
`--surface`, `--surface-featured` and `--surface-selected` are five steps. On a
dark ground elevation reads as going *lighter*, so the ordering is deliberately
inverted from light mode. Adjacent steps separate at 1.09 / 1.22 / 1.14:1, and
every text token clears AA on all five. Before this, the section band, the plan
cards and the featured card were all the same navy and merged into the page.

### Known weaknesses

- **`game.js` is one ~2600-line file.** Everything reaches shared state through a
  global `DailyGame` hook. It works, but it is hard to test and hard to delete
  features from. Splitting it is the biggest refactor available.
- **Errors are captured but not sent anywhere.** `errors.js` buffers the last 20
  in `localStorage`, aged out at 14 days, and shows them on demand behind a
  "Ver detalles" button. That fixes diagnosability without a third party, which
  the CSP forbids. It does mean nobody is *told*: you only see faults a learner
chooses to report.
- **One dead CSS block remains by decision.** `.card`, `.card--lift` and
  `.card__icon` in `style.css` match no element in `index.html` or `404.html`,
  and the matching `[data-theme="dark"] .card__icon` override was removed as a
  no-op. The block was kept deliberately in case those classes are wanted back;
  it is roughly 35 lines and renders nothing.
- **Two raw-navy text sites had no dark override at all** when the sweep
  finished: `.nav-link:hover` and `.nav-drawer a`. Both put navy-800 on the navy
  header or drawer. They are fixed now, and `audit-dark-risk` covers the class,
  but the audit only checks backgrounds and `var(--navy)`, so a raw
  `color: var(--navy-800)` in *text* is caught by the browser probe alone.
- **`frame-ancestors` is not set**, because it cannot be sent from a `<meta>`
  CSP. Every page is framable. Needs a host in front of Pages.
- **Spanish strings are hardcoded** in markup and JS. No i18n.
- **The main site has no offline support**; only the app has a service worker.
- **The 404 has no dark mode.** It ships `script-src 'none'` and contains no
  script at all, so `theme.js` cannot run there. That is deliberate — a static
  error page has nothing to execute — but a visitor who chose Dark sees a light
  404. The contrast probe prints this on every run rather than hiding it.

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