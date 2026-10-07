# HANDOFF — 1 Oración al Día / teaching webpage

Date: 2026-10-07. Repo: `C:\Users\Dexus\Projects\Teaching\Webpage` (git, last pushed `1d1bee3`). Do NOT commit/push until user explicitly approves.

## Done this session

### 1. English Daily — Duolingo-Inspired Visual Redesign
- **Typography**: Swapped font family to Google Font **Nunito** (weights 400, 600, 700, 800, 900) across `index.html` and `daily.css`. Nunito provides the rounded, playful, friendly aesthetic equivalent to Duolingo's custom Feather Bold and DIN Next Rounded.
- **Color Palette & Tokens**:
  - `--green`: `#58cc02` (Duolingo Feather Green), `--green-dark`: `#58a700`
  - `--navy`: `#1b1464`, `--navy-dark`: `#110e40`
  - `--blue`: `#1cb0f6` (Duolingo Sky Blue)
  - `--gold`: `#ffc200`
  - `--purple`: `#a560e8`
  - `--orange`: `#ff9600` (for streak flame)
  - `--bg`: `#f7f7f7` (warm neutral, replacing template-style blue wash)
  - `--correct-bg`: `#d7ffb8`, `--wrong-bg`: `#ffdfe0`
- **Removed AI Red Flags**:
  - Completely hid `.bg-blob` (the blurred gradient circles).
  - Cleaned up topbar: solid `#fff` background, removed blur filter, crisp 2px border.
  - Replaced plain text stats emojis with Duolingo-style colored badge circles (`#fff3e0` for streak, `#e3f2fd` for gems, `#fce4ec` for hearts).
- **Tactile 3D Buttons & Cards**:
  - Standardized on Duolingo's signature 16px (`1rem`) border-radius and `border-bottom: 4px solid` on cards (`.goal-strip`, `.level-card`, `.rivals`, `.stat-card`, `.badge`, `.tips-card`, `.dc-card`, `.srs-card`, `.pb-entry`).
  - Buttons (`.btn`): chunky padding, uppercase, with true tactile press-down (`transform: translateY(4px); box-shadow: none !important;`).
  - Multiple choice buttons (`.choice`) & Word Bank tiles (`.word-chip`): 3D bottom borders, active press states, staggered entrance slide animations.
  - Progress bar: thickened to `1rem` with rounded ends and top highlight shine.
- **Path & Map Layout**:
  - Path nodes enlarged to `5rem` with deep 8px 3D bottom shadows.
  - Current node animated with bouncy `bounce-node` scale keyframe.
  - Unit markers styled as clean pill badges.
- **Interactive Feedback & Celebrations**:
  - Lesson footer animates into `.ok-state` (soft green) and `.bad-state` (soft red) upon submitting answers.
  - Result screen: bouncy pop-in emoji, animated XP count-up (`animateCount`), and pure CSS confetti burst (`spawnConfetti`) with 35 colorful pieces.
  - `sw.js` cache bumped to `daily-v3` to ensure immediate precache refresh.

### 2. Main Site ("Inglés Sin Guion") — De-AI Overhaul
- **Removed the 4-Pillar Generic Grid**: Replaced the standard 4-box card grid in Methodology with an editorial numbered process timeline (`.process`):
  - `01`: Diagnóstico con tus propios documentos (emails, presentations, contracts).
  - `02`: Sesiones sobre situaciones reales (meetings, calls, exhibitions).
  - `03`: Feedback escrito post-sesión (clear summary and action items).
  - `04`: Ritmo y flexibilidad que tú defines (100% online, flexible schedule).
- **Testimonials Polish**:
  - Removed the AI-looking letter-initial circle avatars ("M", "T").
  - Grounded quote cards with clean text hierarchy and gold accent metadata.
  - Kept the requested 3-column pricing structure.

### 3. SEO Pass (All 3 Sites)
- All 3 `index.html`: canonical, full OG/Twitter, correct favicon MIME, absolute `og:image` (1200×630 jpgs), JSON-LD (WebSite, ProfessionalService+EducationalOrganization+3 Offers, Person, FAQPage / SportsTeam / EducationalApplication).
- `robots.txt` + `sitemap.xml` validated.
- Pangal esports: in-joke page kept quiet (noindex, tiny footer link).

### 4. Integration Test Suite & Verification Results
- **Full Browser Integration Suite** (`test_full_integration.js` on headless Edge):
  - Phase 1 (Legacy bad nickname): "Seba 99" re-ask modal works, updates state and chip ✅
  - Phase 2 (Personalization): `{name}` and `{other}` markers localized in sentences, tips, and phrasebook ✅
  - Phase 3 (Lesson 1 walk): Tip -> Listen -> MultipleChoice -> Translate -> WordBank -> FillBlank -> Result Screen (100% accuracy) ✅
  - Phase 4 (Challenge): 5 items scored 5/5; gems verified 50 → 58 (custom session fix verified) ✅
  - Phase 5 (Review): Leitner due state and session run cleanly ✅
  - Viewport: 480px mobile verified with 0px horizontal overflow (`scrollWidth === clientWidth`) ✅
- **Validators Pass Clean**:
  - `node validate-sentences.js`: 365 sentences, 0 problems.
  - `node check-options.js`: 730 choice exercises, 365 word banks, 0 problems.
  - `node check-seo.js`: 0 problems across `index.html`, `english-daily/index.html`, and `pangal-esports/index.html`.

---

## Master Project TODO List

### Priority 0 — Pre-deployment & Approval
1. **User Approval for Git**: Explicit user confirmation before any `git commit` or `git push`.
2. **Physical Device Check**: Test `english-daily/` and main site on an actual mobile device (iOS Safari and Android Chrome).

### Priority 1 — Quality & Polish
3. **Real Testimonial Photos**: If the user obtains actual photos of María or Tane in the future, embed them; otherwise the current clean quote format without avatars is optimal.
4. **404 Page Font Sync**: Optionally sync the 404 page fonts to match the updated typography.

### Priority 2 — Phase 4 Features (Future Work)
5. **Gems Economy**: Store/shop for streak freezes and heart refills using accumulated gems.
6. **Study Calendar / Heatmap**: Visual streak and activity tracker.
7. **Dark Mode Toggle**: CSS theme switcher for night learning.
8. **English Site Version (i18n)**: English translation of the consultancy pages.

---

## Learner State Protection (Mandatory Rule)
Learner state lives only in localStorage under the key `igsg_daily_v1`.
- Never clear or overwrite that key.
- Never rename it; `STORAGE_KEY` must remain `'igsg_daily_v1'`.
- Only additive migrations are permitted in `load()`.
- Bumping `sw.js` cache versions does not affect localStorage.
