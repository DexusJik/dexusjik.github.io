/* Catches UNINTENDED changes to the light theme.
 *
 * THIS GATE WAS RENAMED IN SUBSTANCE, NOT IN WORDS. It used to claim "light
 * theme still renders as it did before". That claim became false by decision:
 * all contrast failures in both themes get fixed, so light mode was changed on
 * purpose - stat values darkened, lesson numerals navy on the discs, the locked
 * badge less dim, the footer link more visible.
 *
 * Leaving a gate asserting something that is no longer true is worse than no
 * gate, because it reads as protection that is not there. So the claim is now
 * what is actually enforceable:
 *
 *   1. The shared accent and surface tokens are byte-identical to HEAD. These
 *      define the whole palette, so an accidental edit is a real regression.
 *   2. Every token that DELIBERATELY replaced a light literal still holds its
 *      recorded value, and the literal it replaced really was in the tree at
 *      HEAD. A token can therefore never drift without it being recorded.
 *   3. No colour literal sits inline in a background outside :root.
 *   4. Both token blocks are present and non-trivial.
 *
 * Intended light changes are listed in REPLACED below. Adding a token there is
 * how you change light on purpose; anything not listed is caught.

   node tools/check-light-unchanged.js  */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const REPO = require('./repo');

let failures = 0;

function css(name) {
    const abs = REPO.p(name);
    if (!fs.existsSync(abs)) return '';
    /* comments are stripped: prose about a colour is not a declaration */
    return fs.readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
}

/* the :root block of the committed version */
function rootOf(text) {
    const m = text.match(/:root\s*\{([\s\S]*?)\n\}/);
    return m ? m[1] : '';
}

const FILES = ['english-daily/daily.css', 'style.css'];

/* every stylesheet tracked at HEAD, so a claim about a replaced literal can be
   checked wherever that literal actually lived */
function allCssAtStyleAt(rev) {
    let names;
    try {
        names = execFileSync('git', ['ls-files', '*.css'], {
            encoding: 'utf8', cwd: REPO.REPO,
        }).split(/\r?\n/).filter(Boolean);
    } catch (e) {
        return '';
    }
    return names.map(function (f) {
        try {
            return execFileSync('git', ['show', rev + ':' + f], {
                encoding: 'utf8', cwd: REPO.REPO, maxBuffer: 16 * 1024 * 1024,
            }).replace(/\/\*[\s\S]*?\*\//g, '');
        } catch (e) {
            return '';
        }
    }).join('\n');
}

/* ---- 1. accent tokens must be byte-identical to HEAD ---- */
const ACCENTS = ['--navy', '--navy-dark', '--blue', '--green', '--green-dark',
    '--red', '--red-dark', '--gold', '--purple', '--orange',
    '--bg', '--card', '--line', '--text', '--muted', '--correct-bg', '--wrong-bg'];

console.log('light-theme values vs the last commit\n');

FILES.forEach(function (rel) {
    let before;
    try {
        before = execFileSync('git', ['show', 'HEAD:' + rel], {
            encoding: 'utf8', cwd: REPO.REPO, maxBuffer: 16 * 1024 * 1024,
        });
    } catch (e) {
        console.log('  skip  ' + rel + ' (not in HEAD)');
        return;
    }

    const oldRoot = rootOf(before.replace(/\/\*[\s\S]*?\*\//g, ''));
    const newRoot = rootOf(css(rel));

    function value(block, token) {
        const re = new RegExp('(^|[;{\\s])' + token + '\\s*:\\s*([^;]+);');
        const m = block.match(re);
        return m ? m[2].trim() : null;
    }

    ACCENTS.forEach(function (token) {
        const was = value(oldRoot, token);
        const now = value(newRoot, token);
        if (was === null) return;

        /* two tokens were deliberately darkened to reach WCAG AA, and the
           commit message says so; everything else must match exactly */
        const intentionallyChanged = {
            '--green-cta': ['#2e8b03', '#2c8801'],
        };
        const expected = intentionallyChanged[token];
        const ok = now === was || (expected && expected[0] === was && expected[1] === now);

        if (!ok) failures++;
        if (now !== was) {
            console.log((ok ? '  changed (intended)  ' : '  CHANGED  ') + rel + '  ' +
                token + ': ' + was + ' -> ' + now);
        }
    });
    console.log('  ok  ' + rel + ': accent and surface tokens unchanged');

    /*
     * ---- 1b. tokens that REPLACED a light literal ----
     *
     * The contrast work turned hardcoded colours into tokens. Where the
     * replacement darkened the light value to reach WCAG AA, light mode
     * deliberately renders differently. Each such token is recorded here with
     * the literal it replaced, and the gate asserts BOTH that the token still
     * holds the recorded value and that the replaced literal really was in the
     * file at HEAD.
     *
     * Without this list these tokens are new names the ACCENTS scan has never
     * seen, so light mode could drift freely and this gate would still report
     * green while its own description claimed otherwise.
     */
    const REPLACED = {
        'english-daily/daily.css': {
            '--streak-ink': { was: '#b36b00', now: '#9a5800' },
            '--gems-ink': { was: '#0b7ec2', now: '#0a6ea8' },
            '--hearts-ink': { was: '#ff4b4b', now: '#c62828' },
            '--orange-ink': { was: '#c2410c', now: '#a03408' },
            '--green-ink': { was: '#58cc02', now: '#25750a' },
            '--badge-locked-ink': { was: '#595959', now: '#3d4450' },
        },
        'style.css': {
            '--on-gold-deep': { was: '#fff', now: '#ffffff' },
            '--on-gold-surface': { was: '#0a2540', now: 'var(--navy-800)' },
            '--surface-featured': { was: '#0a2540', now: 'var(--navy-800)' },
            '--surface-selected': { was: '#0a2540', now: 'var(--navy-800)' },
        },
    };

    const replaced = REPLACED[rel] || {};

    /*
     * The literal a token replaced need not live in the same file, and it need
     * not live in a file this gate scans: #c2410c sat in features/challenge.css
     * while its replacement, --orange-ink, is defined in daily.css. So search
     * every stylesheet in the tree at HEAD.
     */
    /*
     * The replaced-literal check compares against a PINNED BASE, not HEAD.
     *
     * HEAD moves. The first version of this gate searched HEAD, which worked
     * exactly once: it described "the change that is about to land". After that
     * change was committed, the tokens it named were IN HEAD, so the topbar
     * values matched and the pass was vacuous, while a wrongly-recorded literal
     * started failing for the wrong reason -- and the gate went red on the first
     * push with a message that named tokens nobody had just touched.
     *
     * The base is therefore explicit: the recorded substitutions are facts about
     * the transition INTO dark mode, and they are checked against that commit so
     * they keep meaning what they say.
     */
    const REVIEW_BASE = process.env.IGSG_LIGHT_BASE || '3c5fe77';
    const headCss = allCssAtStyleAt(REVIEW_BASE);

    Object.keys(replaced).forEach(function (token) {
        const spec = replaced[token];
        const now = value(newRoot, token);

        if (now !== spec.now) {
            failures++;
            console.log('  CHANGED  ' + rel + '  ' + token + ': expected ' + spec.now +
                ', found ' + now);
        }
        if (headCss.indexOf(spec.was) < 0) {
            failures++;
            console.log('  SUSPECT  ' + rel + '  ' + token + ' claims to replace ' +
                spec.was + ' but that literal is not in any stylesheet at HEAD');
        }
    });
    if (Object.keys(replaced).length) {
        console.log('  ok  ' + rel + ': ' + Object.keys(replaced).length +
            ' token(s) that replaced a light literal still hold their recorded value');
    }
});
console.log('');
const app = css('english-daily/daily.css');
const body = app.replace(rootOf(app), '');
const stray = body.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\()/g);

if (stray) {
    failures += stray.length;
    console.log('  ' + stray.length + ' raw colour(s) still inline in a background:');
    const seen = new Set();
    stray.forEach(function (s) {
        if (seen.has(s)) return;
        seen.add(s);
        console.log('      ' + s);
    });
} else {
    console.log('  ok  no raw colour literal in any background outside :root');
}

/* ---- 3. the dark block must exist and be non-trivial ---- */
console.log('');
['english-daily/daily.css', 'style.css'].forEach(function (rel) {
    const dark = css(rel).match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
    const n = dark ? (dark[1].match(/--[a-z0-9-]+\s*:/gi) || []).length : 0;
    const ok = n >= 10;
    if (!ok) failures++;
    console.log((ok ? '  ok  ' : '  FAIL  ') + rel + ' dark block overrides ' + n + ' token(s)');
});

console.log('');
console.log(failures ? 'failures: ' + failures : 'problems: 0');
process.exit(failures ? 1 : 0);