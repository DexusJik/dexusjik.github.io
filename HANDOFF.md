# HANDOFF — 1 Oración al Día / teaching webpage

Date: 2026-10-07. Repo: `C:\Users\Dexus\Projects\Teaching\Webpage`.
Last pushed commit: `27249d0` (main, in sync with origin). Working tree clean.

**Never commit or push without the user saying so.** They have been
approving each step explicitly, and they review the live site before deciding.

## What this session did

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
