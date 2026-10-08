'use strict';
const REPO = require('./repo');
﻿/* Finds hardcoded colours in the app CSS that would look wrong in dark mode.
   Two classes of problem:
     - light literals used as a background (they glare on a dark page)
     - --navy / #1b1464 used as TEXT (it is unreadable on dark)
   Reports file, line, the literal, and the selector that owns it. */
const fs = require('fs');
const path = require('path');

const ROOT = REPO.p('');
const FILES = [
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

        const hits = line.match(/#[0-9a-fA-F]{3,8}\b|\bvar\(--navy\)/g);
        if (!hits) return;
        const isBackground = /(^|[\s;{])(background|background-color)\s*:/i.test(line);

        hits.forEach((raw) => {
            total++;
            if (raw === 'var(--navy)') {
                if (/color\s*:/i.test(line) && !/background/i.test(line)) {
                    navyText.push({ rel, line: i + 1, sel, raw });
                }
                return;
            }
            const L = lum(raw);
            if (L === null) return;
            if (L > 0.65 && isBackground) {
                lightSurfaces.push({ rel, line: i + 1, sel, raw, L });
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

console.log('\n=== B. var(--navy) used as TEXT (' + navyText.length + ') ===');
console.log('    #1b1464 is unreadable on any dark background\n');
navyText.forEach((f) => {
    console.log('  ' + f.rel + ':' + f.line + '  ' + f.raw + '  ' + f.sel);
});
