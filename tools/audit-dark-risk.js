'use strict';
const REPO = require('./repo');
/* Finds hardcoded colours that will look wrong in dark mode.
   Three classes of problem:
     - light literals used as a background (they glare on a dark page)
     - light literals used as a border or outline colour, which the
       background-only pass missed
     - --navy / #1b1464 used as TEXT (it is unreadable on dark)
   Reports file, line, the literal, and the selector that owns it. */
const fs = require('fs');
const path = require('path');

const ROOT = REPO.p('');
const FILES = [
    /* style.css is here because the whole main-site dark-mode failure class was
       14 rules in style.css painting text with a raw navy palette step. This gate
       reported 0 problems for that file because it never read it. */
    'style.css',
    'english-daily/daily.css',
    'english-daily/features/challenge.css',
    'english-daily/features/fillblank.css',
    'english-daily/features/phrasebook.css',
    'english-daily/features/review.css',
    'english-daily/features/tips.css',
];

function lum(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6) return null;
    const c = [0, 2, 4].map((i) => {
        const v = parseInt(h.substr(i, 2), 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/* selector owning a given line: walk back to the previous line ending in { */
function owner(lines, i) {
    for (let j = i; j >= 0 && j > i - 60; j--) {
        const t = lines[j].trim();
        if (t.endsWith('{')) {
            return t.slice(0, -1).trim().replace(/\s+/g, ' ');
        }
    }
    return '(unknown)';
}

const lightSurfaces = [];
const lightBorders = [];
const navyText = [];
let total = 0;

FILES.forEach((rel) => {
    const abs = path.join(ROOT, rel);
    const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);

    lines.forEach((line, i) => {
        /* accept both multi-line rules ("  background: #fff;") and
           single-line rules (".stat-streak .stat-icon { background: #fff3e0; }") */
        const isDecl = /^[-a-z]+\s*:/.test(line.trim()) && !/^\s*\/\*/.test(line);
        const oneLiner = /\{[^}]*:[^}]*\}/.test(line);
        if (!isDecl && !oneLiner) return;

        /* on a one-liner the selector precedes the brace */
        const sel = oneLiner && !isDecl
            ? line.slice(0, line.indexOf('{')).trim().replace(/\s+/g, ' ')
            : owner(lines, i);

        /*
         * Match every raw navy-family step, not just `--navy`. `--navy-700`,
         * `--navy-800` and `--navy-900` are fixed palette entries too, and using
         * one as TEXT is exactly the bug that put 14 rules below AA in dark
         * mode. Matching only `var(--navy)` meant a new raw navy-as-text rule
         * passed this gate instantly and then waited 4 minutes for the browser
         * probe to catch it, if it did at all.
         */
        const hits = line.match(/#[0-9a-fA-F]{3,8}\b|\bvar\(--navy(?:-\d+)?\)/g);
        if (!hits) return;
        const isBackground = /(^|[\s;{])(background|background-color)\s*:/i.test(line);

        hits.forEach((raw) => {
            total++;
            /*
             * Any raw navy-family step used as TEXT is the defect. The guard
             * used to be `raw === 'var(--navy)'`, so widening the match alone
             * changed nothing: `var(--navy-800)` reached the luminance branch
             * below and was treated as a hex colour, which it is not.
             */
            if (/^var\(--navy/.test(raw)) {
                /*
                 * TEXT means a `color:` property — and `border-color:`,
                 * `outline-color:` and `--btn-bg:` are not text. An earlier
                 * version of this check used /color\s*:/, which matches the
                 * tail of `border-color:` and so flagged four background and
                 * border rules as invisible text. Requiring the property to
                 * start a declaration fixes that.
                 */
                const isText = /(^|[;{\s])color\s*:\s*var\(--navy/.test(line) &&
                    !/(border|outline|shadow|fill|stroke|btn-bg|background)/i.test(line);
                if (isText) {
                    navyText.push({ rel, line: i + 1, sel, raw });
                }
                return;
            }
            const L = lum(raw);
            if (L === null) return;

            /* border and outline colours were not covered: a pale 1px border is
               a bright hairline on a dark surface, which is exactly the kind of
               thing a background-only pass misses */
            const isBorder = /(border|border-color|outline)[^;]*:/.test(line) &&
                !/background/.test(line);
            const isBg = /(^|[\s;{])(background|background-color)\s*:/i.test(line);

            if (L > 0.65 && isBg) {
                lightSurfaces.push({ rel, line: i + 1, sel, raw, L });
            } else if (L > 0.65 && isBorder) {
                lightBorders.push({ rel, line: i + 1, sel, raw, L });
            }
        });
    });
});

console.log('scanned ' + FILES.length + ' files, ' + total + ' colour references\n');

console.log('=== A. LIGHT literals used as a background (' + lightSurfaces.length + ') ===');
console.log('    these render as bright patches on a dark page\n');
lightSurfaces.forEach((f) => {
    console.log('  ' + f.rel + ':' + f.line + '  ' + f.raw + '  L=' + f.L.toFixed(2) + '  ' + f.sel);
});

console.log('\n=== C. LIGHT literals used as a border or outline (' + lightBorders.length + ') ===');
console.log('    a pale hairline is still a bright hairline on a dark surface\n');
lightBorders.forEach((f) => {
    console.log('  ' + f.rel + ':' + f.line + '  ' + f.raw + '  L=' + f.L.toFixed(2) + '  ' + f.sel);
});

console.log('\n=== B. var(--navy) used as TEXT (' + navyText.length + ') ===');
console.log('    #1b1464 is unreadable on any dark background\n');
navyText.forEach((f) => {
    console.log('  ' + f.rel + ':' + f.line + '  ' + f.raw + '  ' + f.sel);
});

/*
 * The exit is LAST. It sat above this section, so these findings set the exit
 * code to non-zero but were never printed: the gate failed in CI with an empty
 * report, and run-all's failure filter drops the "problems: N" line too, so
 * there was nothing at all to diagnose from.
 */
const problems = lightSurfaces.length + lightBorders.length + navyText.length;
console.log('');
console.log('problems: ' + problems);
process.exit(problems ? 1 : 0);
