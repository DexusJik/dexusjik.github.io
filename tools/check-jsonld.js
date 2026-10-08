'use strict';
const REPO = require('./repo');
const fs = require('fs');
const files = ['index.html', 'english-daily/index.html', 'pangal-esports/index.html'];

let bad = 0;
files.forEach((f) => {
    const s = fs.readFileSync(REPO.p(f), 'utf8');
    const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m, n = 0;
    while ((m = re.exec(s)) !== null) {
        n++;
        try {
            JSON.parse(m[1]);
        } catch (e) {
            bad++;
            console.log('  INVALID JSON-LD in ' + f + ' block ' + n + ': ' + e.message);
        }
    }
    console.log('  ' + f + ': ' + n + ' JSON-LD block(s) parsed');
});

/* confirm no stale counts or over-claims remain anywhere user-facing */
const app = fs.readFileSync(REPO.ap('index.html'), 'utf8');
const claims = [
    ['20 preguntas', /20\s+preguntas/],
    ['A1 a C2', /A1 a C2/],
    ['A1 a C2 (JSON-LD)', /A1 a C2/],
    ['cuatro ejercicios', /cuatro ejercicios/],
];
claims.forEach(([label, re]) => {
    const hit = re.test(app);
    console.log((hit ? '  STILL PRESENT  ' : '  gone          ') + label);
    if (hit) bad++;
});

console.log(bad ? '\nproblems: ' + bad : '\nall clean');
process.exit(bad ? 1 : 0);