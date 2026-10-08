# HANDOFF — 1 Oración al Día / teaching webpage

Date: 2026-10-07. Repo: `C:\Users\Dexus\Projects\Teaching\Webpage`.
Last pushed commit: `f0f9215` (v5 placement reset). This session's fixes are
committed on top and pushed.

**Never commit or push without the user saying so.** They have been
approving each step explicitly, and they review the live site before deciding.

## Site-wide audit and fixes (2026-10-07, later)

Three audit agents swept links/assets, SEO/security, and interactions. 37
findings; the substantive ones are fixed and browser-verified. **One commit
covers both the behaviour fixes and the asset/metadata changes**, because
`index.html` carries both kinds of edit and splitting it by file would have
produced two incoherent commits.

**WhatsApp URL was off-spec.** `site.js` built `wa.me/+56952148204`. WhatsApp
wants digits only ("Omit any zeroes, brackets, or dashes"; the `+` is
explicitly unwanted), so every booking CTA on the site was off-spec. The `+`
now lives only in `waNumberDisplay()`. Verified live: `wa.me` resolved it to
"+56 9 5214 8204".

**Mobile drawer anchors landed ~312px above the viewport.** Clicking a link in
`#mobile-nav` scrolled while the drawer was still open; the drawer's own
bubbling handler then closed it and the document shrank, shifting the target
off-screen. `initNav` now dispatches `drawer:close` first, then scrolls on a
`setTimeout(0)`. **`setTimeout`, not `requestAnimationFrame` on purpose** —
rAF is paused in a backgrounded tab and does not fire in headless at all, which
would silently drop the scroll. Now lands at 88px, the correct
`scroll-padding-top` offset.

**Scrollspy highlighted the wrong item.** `sections` is built in *nav* order
(Metodología, Planes, Sobre mí) while document order differs, so "keep the last
match" always resolved to Sobre mí from y≈1250 to the footer. Now picks the
section with the **greatest `offsetTop` already passed**, which is
order-independent. First attempt only rewrote the loop without sorting and was
still broken — the browser probe caught it.

**Quiz had no way back.** Once a step advanced it was `display:none`, so a
mis-tap could not be revised and the result could not be retaken without a full
reload. Added "Atrás" (`gotoStep(step - 1)`) and "Repetir" (clears `answers`,
returns to step 0). Going back restores the previous choice for that question.

**Quiz accessibility.** `#quiz-result` gets `aria-live="polite"`;
`#quiz-progress-bar` becomes `role="progressbar"` with `aria-valuenow/max/label`;
options become `role="radio"` + `aria-checked` inside `role="radiogroup"` groups;
and `gotoStep` moves focus to the new question heading. Focus previously stayed
on "Siguiente", so Tab skipped the new question entirely.

**Icons were a 372 KB portrait photo.** `image4.webp` is 3136x4224 and was used
as the favicon, the `apple-touch-icon` and a 40-44px avatar on every page, and
was also in the service worker precache (half the install weight). Generated real
derivatives from `image5.webp` (already a square 812x812 crop of the same photo):
`avatar-96.webp` **1.4 KB**, `favicon-32.png`, `favicon-16.png`,
`apple-touch-icon.png`. iOS silently ignores WebP for `apple-touch-icon`, so the
home-screen icon was missing on iPhone/iPad. Same treatment applied to
`pangal-esports` (its `p_sports.webp` was 230 KB for a 44px logo).

**Metadata overstated the product.** The app advertised "A1 a C2" and "cuatro
ejercicios por lección". Real ceiling is C1 (`game.js` LEVEL_META stops at 5) and
there are five sentences per lesson drawn from six exercise types. Corrected in
the meta description, the JSON-LD description and `featureList`. JSON-LD `logo`
now points at the square `image5.webp` instead of the full portrait.

**Privacy.** `HANDOFF.md` is tracked, so GitHub Pages publishes this file, which
contains the maintainer's local path and OS username. Added `Disallow:
/HANDOFF.md` and `Disallow: /docs/` to `robots.txt`. Note honestly: robots.txt
only keeps a file out of search indexes, it does not stop Pages serving it.
Untracking the file is the real fix and has not been done.

**Placement copy.** The modal said "No se puede repetir", which v5 made
self-contradictory. Reworded to explain that the level is set once and cannot be
repeated to raise it, but a corrected paper can require a retake.

**`sw.js`**: `CACHE_VERSION` had never been bumped since it was written, across 9
later commits that changed precached files, so `install` never re-ran. Bumped to
`daily-v5` and pointed the precache at `avatar-96.webp`.

### New guard

`validate-placement-count.js` (temp dir) derives the item count and max points
from `placement.js` and fails if any user-facing string disagrees. It exists
because the modal and the JSON-LD both advertised "20 preguntas" while the test
had 30. It also asserts the band split is 6/8/8/8 and that every item has an
answer, two wrong options and a `why`.

### Verification

- 26/26 browser assertions on the main site (drawer, scrollspy, quiz back,
  restart, aria state, focus) via a real headless Edge run.
- 9/9 node validators pass, including the new count guard.
- Placement probe: 30 questions, 210 assertions, 0 failures.
- Migration e2e: v4 holder reset, placement stamped `v:5`, 73 lessons intact,
  XP 980 → 1040, no second prompt.

**Headless testing notes that cost real time, so they are written down:**
`--dump-dom` snapshots before an async chain finishes, so probe output must be
flushed into the DOM incrementally and the page must **not** wait for `window.load`
(the Google Fonts request stalls and load never fires). `requestAnimationFrame`
does not fire in `headless=new` — use `setTimeout` in probes and in app code that
must work in a background tab. `--dump-dom` output is lost when piped through
PowerShell redirection; use node's `spawnSync`. Pass
`--force-prefers-reduced-motion` when asserting scroll positions so smooth
scrolling is instant and measurable.

### Still open

- `frame-ancestors` cannot be set from a `<meta>` CSP, so every page is framable.
  Needs a real HTTP header, i.e. Cloudflare or another host in front of Pages.
- `/english-daily/` reuses the main site's `og-card.jpg`, so shares of the app
  show the consultancy card. Needs a dedicated 1200x630 app card.
- `HANDOFF.md` is still served; only disallowed to crawlers.
- Formspree endpoint `xzdklrdv` is still live in git history; user must deactivate
  it in the Formspree dashboard.

## Earlier session: v5 placement reset

Started from `94877cb`, which had shipped a "prominent banner contact
section" that printed the phone number in plain text and left a missing
closing brace in `style.css` that swallowed the `.hero__lead` rule, so the
whole hero rendered unstyled.

**Contact button.** Removed all four WhatsApp surfaces (top banner, header
number button, mobile drawer button, hero contact box). Replaced with one
green "Contacto" button in the header that opens WhatsApp. The number is not
in the HTML or CSS at all; `site.js` holds it in split parts and assembles the
link on click. Note honestly: this obscures rather than hides the number, and
it also appeared in plain text in the pushed commit `94877cb`, so git history
still contains it. See "Open items".

**Security pass.** Tightened CSP on all four pages — `index.html` was missing
`object-src` and `base-uri`; added `form-action 'self'` and a referrer meta
tag everywhere. Audited the whole repo: no third-party JavaScript, no `eval`,
no `document.write`, no inline event handlers, `script-src 'self'` on every
page, no secrets tracked, all images have alt text, no `target="_blank"`
without `rel="noopener"`. The 3 npm advisories in the agent config dir
predate this work and come from `@opencode-ai/plugin`; `npm audit fix` wants
a breaking downgrade, so it was left alone.

**Sentence bank.** Reviewed all 365 sentences with four parallel reviewers,
verified every claim myself, fixed 19. Most were wrong Spanish. The four
worst: lesson 67 taught concession but translated `Granted` as "Ciertamente"
(asserts, not concedes); lesson 61 mixed subjunctive and future in one
conditional; lesson 10 dropped the modal it was teaching; lesson 72 pasted a
literal baseball image in as an idiom's translation. Also fixed a grading
bug where "She works in a hospital" was offered as a wrong answer while being
valid English.

**Three answer leaks closed.** All were found by audit, not reported:
1. `game.js:635` used `it.a` (the answer) as the prompt for `dir:'es'`
   placement items, so Q5 and Q18 printed the answer as the question. Up to
   5 free points, which could place someone a full level too high.
2. Four placement distractors were also defensible answers; Q14 had three
   distractors where the file header specifies two.
3. Tip cards reused a sentence from their own lesson, so all 73 leaked the
   next exercise's answer; 5 lessons were hit twice via fill-blank.

**One-time re-offer.** Learners who took the placement test under the bug
were locked in permanently (`state.placement` was written once, never
cleared, and no reset existed anywhere). `english-daily/migrations.js` now
stamps results with a version and clears stale ones on boot. It is a separate
pure file, not inside `game.js`, because it mutates saved data on every boot
and therefore has to be unit-testable outside a DOM.

**`lang="en"` app-wide.** The document is `lang="es"`, so all English content
was read aloud with a Spanish voice. `choiceList` gained a language argument,
and every English sentence, option, word-bank tile, review paragraph and
phrasebook row now declares its language. A `renderStep` fallback marks
anything a future feature forgets.

## Verification instruments

All in `%TEMP%\opencode\`, throwaway, not in the repo. Reproduce before
trusting any change.

| Script | What it proves |
|---|---|
| `validate-sentences.js` | 365 sentences, `we`/`ws` complete, no leaks; runs `personalize-corpus.js` over `TEST_NAME` |
| `check-options.js` | 730 choice sets and 365 word banks yield 4 options, correct answer present |
| `validate-placement.js` | 20 items structurally sound; prints 4 items for human review |
| `validate-tip-examples.js` | no tip example matches any corpus sentence (73 leaks → 0) |
| `validate-tip-fillblank.js` | fill-blank answer word not visible on its own tip card |
| `test-migration.js` | migration clears stale placements, preserves progress byte-identical |
| `run-placement-probe.js` | walks all 20 placement questions in headless Edge |
| `run-lang-probe.js` | lesson + phrasebook modes, every English leaf declares `lang="en"` |
| `check-seo.js` | per-page SEO report |

**Run:** `node validate-sentences.js`, `node validate-placement.js`,
`node validate-tip-examples.js`, `node validate-tip-fillblank.js`,
`node test-migration.js`. All currently report 0 problems / 0 failures.

**Browser probes** need a temporary server and headless Edge. Two hard-won
constraints: the app's CSP is `script-src 'self'`, so **injected scripts must
be external same-origin files, never inline** (inline ones are silently
refused); and `python -m http.server <PORT> --bind 127.0.0.1` from the repo
root, then `node run-<x>-probe.js`. Delete every `zz_*` file and stop the
server afterwards. `Start-Process` + `RedirectStandardOutput` is the only
reliable way to read Edge's stdout on this machine.

## Placement test (30 questions, re-cut scoring)

The test grew from 20 questions / 50 points to **30 questions / 78 points**,
distributed 6/8/8/8 across A2/B1/B2/C1 so the upper bands carry most of the
weight (32 of 78 points are C1).

**The real cause of "placement feels too generous" was a threshold bug, not
question quality.** Every item offers three options, so a learner choosing at
random scores an expected `max/3` = 26 of 78, about **33%**. The old level-3
cut was `>=14 of 50` = **28%, below that floor**, so answering everything at
random placed someone in B1. With 30 questions the old cuts were worse: a
guesser landed in level 4.

| Level | Old cut | New cut | Share |
|---|---|---|---|
| 5 | 36 of 50 (72%) | **60 of 78 (77%)** | harder |
| 4 | 24 of 50 (48%) | **44 of 78 (56%)** | harder |
| 3 | 14 of 50 (28%) | **34 of 78 (44%)** | **above the 33% floor** |
| 2 | 5 of 50 (10%) | **10 of 78 (13%)** | slightly higher |

`PLACEMENT_MAX` is now summed from the item data on boot rather than
hardcoded, so adding a question cannot silently invalidate every cut.

Two guards keep this honest: `test-placement-bands.js` asserts a random
guesser lands below level 3 **and** that honest B1, B2 and C1 learners each
still reach their own level (over-correcting would lock capable learners below
their level on a one-shot test); `check-cuts-in-sync.js` asserts `game.js` and
the band test declare identical thresholds.

`migrations.js` is at **CURRENT_VERSION 4**: every stored placement is
discarded so the whole cohort retakes the corrected paper. Only the placement
is re-earned — xp, gems, streak, completed lessons, badges, first name and
feature state all survive, verified on a seeded learner with 24 lessons and a
21-day streak. Skippers are never nagged.

## Quality process that caught the placement defects

The first batch of 10 questions shipped in `de6517c` and was **wrong in ways
my own review did not catch**. An independent native-level review then found
six real defects, worst of all a **mistranslation**: "El resultado depende del
clima." was answered "depends on the weather", but Spanish `el clima` is
*climate* and `el tiempo` is *weather*, so a learner who answered correctly
would have been marked wrong on a one-shot permanent test.

The lesson worth carrying forward: **agent-authored content needs independent
review by a different reviewer, not a second pass by the same author.** Three
defects were false grammar rules stated in `why` fields, which read fluently
and were wrong. On a placement test the cost of shipping those is a learner
permanently mis-placed.

Fixed in `65d26d1`: six defects corrected, four items replaced outright
because they duplicated a topic or tested a point the app never teaches.
Conditional items went from 7 of 30 to 5, each a distinct subtype.

Second-round review then found two more defects in the *replacements*
themselves, including one I wrote myself. Both fixed. The band comment and
file header, which still said 20 questions, were corrected too.

## Open items

1. **Deactivate the Formspree form.** Endpoint ID `xzdklrdv` is in four
   pushed commits (`eae1a85`, `45608f4`, `7ea5202`, `1d1bee3`). The current
   code makes no network requests at all, so the form is unused, but the ID
   is public in repo history. Only the user can deactivate it in the
   Formspree dashboard. Rewriting history would not reliably help: GitHub
   keeps unreachable commits reachable by SHA.
2. **Real-device testing.** Everything above was verified in headless Edge.
   Untested: iPhone speech synthesis and the WhatsApp hand-off, Pangal below
   768px, and how the fade-up animations feel on a real screen. Headless Edge
   clamps viewports to ~476px and does not fire `IntersectionObserver`.
3. **Two residual tip leaks, accepted.** Lesson 5's tip teaches "I like", so
   its example must contain "like", which is also the blanked word; lesson 26
   is the same with much/many. Avoiding them means removing the word the tip
   exists to teach. Fixing properly would need fill-blank's sentence choice
   decoupled from the tip's topic — worth a spec, not a patch.
4. **Review the 73 new tip examples.** Authored fresh; the C1 band (tips
   55–72, inversion and mixed conditionals) deserves a native-speaker eye.
5. **The browser probe for tip cards never worked** across multiple lessons.
   The two validators are deterministic and exhaustive, so they are the
   stronger evidence, but that feature was verified statically rather than by
   walking it.

## Not done

Nothing is specced yet for these; all need a written plan first:

- **App dark mode** — follow the OS plus a persistent manual toggle.
  `daily.css` has 19 tokens but also **115 hardcoded hex values**, so this is
  an audit, not a token flip. Feature stylesheets are token-driven and mostly
  free. Must also swap the PWA `theme-color`.
- **PWA polish** — install prompt, update-available toast, offline indicator.
  `beforeinstallprompt` is currently unhandled.
- **Fluid type scale** — the app has zero `clamp()` font sizes, so it ignores
  the OS font-size setting.
- **Two-column path layout** above ~1080px; the app is a single 44rem column.
- **Main site + Pangal dark mode.** User asked for it despite my advice: the
  main site is built on a light sand palette, so this is the largest and most
  invasive piece and needs its own contrast pass.
- **Main site accessibility** — only 4 `:focus-visible` rules and no
  `min-height` on any control, so tap targets may be under 44px.
- Gems economy (streak freezes, heart refills), study calendar heatmap,
  English version of the consultancy pages.

## Learner State Protection (Mandatory Rule)

Learner state lives only in localStorage under the key `igsg_daily_v1`.
- Never clear or overwrite that key.
- Never rename it; `STORAGE_KEY` must remain `'igsg_daily_v1'`.
- Only additive migrations are permitted in `load()`.
- Bumping `sw.js` cache versions does not affect localStorage.
- `migrations.js` may only ever touch the keys it owns.

## Plans

Written plans live in `docs/superpowers/plans/` (gitignored). Completed:
`2026-10-07-placement-correctness.md`, `2026-10-07-app-wide-lang.md`,
`2026-10-07-tip-card-leak.md`. Superpowers is installed **for this project
only**, via `opencode.jsonc` (also gitignored); the global config is
untouched.

## Testing rules that keep wasting time if forgotten

- Use a temporary `python -m http.server` on a free port. Never
  `serve.py` / `start-site.cmd`.
- PowerShell has no `&&`; use `; if ($?) { }`.
- `$_.Filename` drops the directory, so group test files by prefix.
- Delete all `zz_*` artifacts and stop the server after every browser run.
- For bulk corpus edits, read the exact lines first, then make one precise
  edit and run the validators. Earlier failures came from generated garbage,
  never from the edit tool.
