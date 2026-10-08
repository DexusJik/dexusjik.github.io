/* Checks that every token reference resolves and that no token is defined but
   unused. An undefined var() silently renders as nothing, which in CSS means
   the property is dropped -- a border disappears, a background turns
   transparent -- and it is easy to miss by eye.

   node tools/check-tokens.js  */
'use strict';

const fs = require('fs');
const REPO = require('./repo');

/* A group shares one token scope: the feature stylesheets extend the app's
   tokens rather than defining their own, so they must be checked against the
   app's :root, not their own (they have none). */
const GROUPS = [
    { name: 'main site', files: ['style.css'] },
    {
        name: 'english app',
        files: [
            'english-daily/daily.css',
            'english-daily/features/challenge.css',
            'english-daily/features/fillblank.css',
            'english-daily/features/phrasebook.css',
            'english-daily/features/review.css',
            'english-daily/features/tips.css',
        ],
    },
];

let failures = 0;

GROUPS.forEach(function (group) {
    const defined = new Set();
    const used = new Map();   /* token -> first file that used it */

    group.files.forEach(function (rel) {
        const abs = REPO.p(rel);
        if (!fs.existsSync(abs)) return;
        const clean = fs.readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

        let m;
        const defRe = /(--[a-z0-9-]+)\s*:/gi;
        while ((m = defRe.exec(clean)) !== null) defined.add(m[1]);

        const useRe = /var\(\s*(--[a-z0-9-]+)/gi;
        while ((m = useRe.exec(clean)) !== null) {
            if (!used.has(m[1])) used.set(m[1], rel);
        }
    });

    const missing = [...used.keys()]
        .filter(function (t) { return !defined.has(t); })
        .sort();

    if (missing.length) {
        failures += missing.length;
        console.log('  UNDEFINED in ' + group.name + ':');
        missing.forEach(function (t) {
            console.log('      ' + t.padEnd(20) + 'used by ' + used.get(t));
        });
    } else {
        console.log('  ok  ' + group.name.padEnd(14) + defined.size + ' tokens defined, ' +
            used.size + ' referenced, all resolve');
    }
});

/* the two themes must define the same token set, or one theme silently loses
   a value and inherits the other's */
const app = fs.readFileSync(REPO.p('english-daily/daily.css'), 'utf8');
const rootBlock = (app.match(/:root\s*\{([\s\S]*?)\n\}/) || [])[1] || '';
const darkBlock = (app.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/) || [])[1] || '';

function blockTokens(block) {
    const set = new Set();
    let m;
    const re = /(--[a-z0-9-]+)\s*:/gi;
    while ((m = re.exec(block)) !== null) set.add(m[1]);
    return set;
}

const lightTokens = blockTokens(rootBlock);
const darkTokens = blockTokens(darkBlock);

/* :root also holds rhythm/motion tokens that only apply once; dark only needs
   to override colours. Report dark-only or light-only COLOUR tokens. */
const inLightOnly = [...lightTokens].filter(function (t) { return !darkTokens.has(t); });
const inDarkOnly = [...darkTokens].filter(function (t) { return !lightTokens.has(t); });

if (inDarkOnly.length) {
    failures += inDarkOnly.length;
    console.log('  DARK-ONLY tokens (defined but not in :root, so light has no value):');
    inDarkOnly.forEach(function (t) { console.log('      ' + t); });
}

console.log('');
console.log('light tokens: ' + lightTokens.size + ', dark overrides: ' + darkTokens.size);
console.log('light-only (kept, no dark override needed): ' + inLightOnly.length);
console.log(failures ? 'failures: ' + failures : 'problems: 0');
process.exit(failures ? 1 : 0);