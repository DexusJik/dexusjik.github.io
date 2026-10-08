'use strict';
const REPO = require('./repo');
/* Guards the placement test's advertised numbers against the real data.
   The count used to be hardcoded as "20" in two places while the test actually
   had 30 items, so this derives the truth from placement.js and fails if any
   user-facing string disagrees.

   Run: node validate-placement-count.js   (from the repo root) */
const fs = require('fs');
const path = require('path');

const APP = REPO.APP + '/';

let failures = 0;
function check(label, actual, expected) {
    const ok = String(actual) === String(expected);
    if (!ok) failures++;
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label +
        (ok ? '' : '  (got ' + actual + ', want ' + expected + ')'));
}

/* ---- derive the truth from the data ---- */
const placementSrc = fs.readFileSync(APP + 'placement.js', 'utf8');

/* count the items in the PLACEMENT_ITEMS array */
const start = placementSrc.indexOf('PLACEMENT_ITEMS');
if (start < 0) {
    console.log('  FAIL  could not find PLACEMENT_ITEMS in placement.js');
    process.exit(1);
}
const arrayBody = placementSrc.slice(start);
const open = arrayBody.indexOf('[');
let depth = 0, end = open;
for (let i = open; i < arrayBody.length; i++) {
    if (arrayBody[i] === '[') depth++;
    else if (arrayBody[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
}
const itemsSrc = arrayBody.slice(open, end + 1);

/* each item is an object literal starting with q: */
const qCount = (itemsSrc.match(/\bq\s*:/g) || []).length;

/* total points */
const ptsMatches = itemsSrc.match(/pts\s*:\s*(\d+)/g) || [];
const maxPts = ptsMatches.reduce((sum, m) => sum + parseInt(m.replace(/\D+/g, ''), 10), 0);

/* each item offers one correct answer 'a' plus two wrong ones in 'w' */
const aCount = (itemsSrc.match(/\ba\s*:\s*'/g) || []).length;
const wCount = (itemsSrc.match(/\bw\s*:\s*\[/g) || []).length;
const whyCount = (itemsSrc.match(/\bwhy\s*:\s*'/g) || []).length;

/* distribution of items per level band */
const lvCount = {};
(itemsSrc.match(/\blv\s*:\s*(\d+)/g) || []).forEach((m) => {
    const lv = parseInt(m.replace(/\D+/g, ''), 10);
    lvCount[lv] = (lvCount[lv] || 0) + 1;
});

console.log('placement test, derived from placement.js');
console.log('  items: ' + qCount + ', max points: ' + maxPts);
console.log('');

/* ---- user-facing strings that quote the count ---- */
const files = [
    APP + 'index.html',
    APP + 'game.js',
    REPO.p('index.html'),
];

let found = 0;
files.forEach((f) => {
    if (!fs.existsSync(f)) return;
    const src = fs.readFileSync(f, 'utf8');
    const lines = src.split(/\r?\n/);

    lines.forEach((line, i) => {
        /* "N preguntas" and "N questions" */
        const m = line.match(/\b(\d+)\s+(preguntas|questions)\b/gi);
        if (!m) return;
        m.forEach((hit) => {
            const n = parseInt(hit, 10);
            found++;
            check(
                path.basename(f) + ':' + (i + 1) + '  "' + hit.trim() + '"',
                n,
                qCount
            );
        });
    });
});

if (found === 0) {
    console.log('  WARN  no "N preguntas" string found to check');
}

/* the placement test must not be described with a stale max score either */
files.forEach((f) => {
    if (!fs.existsSync(f)) return;
    const src = fs.readFileSync(f, 'utf8');
    const m = src.match(/(\d+)\s*\/\s*(\d+)\s*(puntos|pts)/gi);
    if (!m) return;
    m.forEach((hit) => {
        const nums = hit.match(/\d+/g);
        if (nums.length !== 2) return;
        check(path.basename(f) + '  "' + hit.trim() + '"', nums[1], maxPts);
    });
});

/* ---- sanity: the distribution the spec promises ---- */
console.log('');
check('every item has a correct answer', aCount, qCount);
check('every item has two wrong options', wCount, qCount);
check('every item explains the distractors', whyCount, qCount);
check('max points matches 78', maxPts, 78);

console.log('');
console.log('items per band: ' + JSON.stringify(lvCount));
console.log('band spread should be 6/8/8/8 across lv 2..5');
Object.keys(lvCount).sort().forEach((lv) => {
    const expected = lv === '2' ? 6 : 8;
    check('band lv=' + lv + ' has ' + expected + ' items', lvCount[lv], expected);
});

console.log('');
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);