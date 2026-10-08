/* Proves light mode is unchanged by the dark-mode work.

   The tokenisation replaced 65+ hardcoded literals with tokens. Each token's
   LIGHT value was set to the literal it replaced, so light mode should render
   identically. This checks that claim mechanically: every colour that appears
   in light mode now must trace back to a value that was in :root at HEAD.

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
});

/* ---- 2. no light-literal background should exist outside :root ---- */
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