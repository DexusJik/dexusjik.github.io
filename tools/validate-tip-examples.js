'use strict';
const REPO = require('./repo');
/*
 * Tip example validator.
 *
 * A tip card shows its example BEFORE the lesson's exercises. If that example
 * is a sentence from the same lesson, the learner has already been shown the
 * answer to whichever exercise comes next. This measures that leak as a number
 * and, after the fix, holds it at zero.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

global.window = {};
eval(fs.readFileSync(REPO.ap('sentences.js'), 'utf8'));
const L = window.DAILY_LESSONS;

const tipsSrc = fs.readFileSync(REPO.ap('features/tips.js'), 'utf8');
/* tips.js exports TIPS directly under module.exports, then returns */
const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
try {
    vm.runInContext(tipsSrc, sandbox);
} catch (e) {
    console.log('FAIL: tips.js threw while evaluating: ' + e.message);
    process.exit(1);
}
const TIPS = sandbox.module.exports;
if (!TIPS || !Object.keys(TIPS).length) {
    console.log('FAIL: tips.js exported nothing (' + tipsSrc.includes('module.exports') + ')');
    process.exit(1);
}

const norm = (s) => String(s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/* every corpus sentence, in both languages, keyed by normalised text */
const corpus = new Map();
L.forEach((l, li) => l.sentences.forEach((s, si) => {
    corpus.set(norm(s.en), `L${li + 1}s${si + 1} en`);
    corpus.set(norm(s.es), `L${li + 1}s${si + 1} es`);
}));

const keys = Object.keys(TIPS);
const problems = [];
const seen = new Map();
let collisions = 0;

keys.forEach((k) => {
    const t = TIPS[k];
    const idx = Number(k);
    if (!t || !t.example) { problems.push(`tip[${k}]: no example`); return; }
    const en = t.example.en, es = t.example.es;
    if (!en || !String(en).trim()) problems.push(`tip[${k}]: empty example.en`);
    if (!es || !String(es).trim()) problems.push(`tip[${k}]: empty example.es`);

    const enN = norm(en), esN = norm(es);

    /* the leak: this tip's example is a sentence from the lesson it precedes */
    const hitEn = corpus.get(enN);
    const hitEs = corpus.get(esN);
    if (hitEn || hitEs) {
        collisions++;
        problems.push(`tip[${k}] (lesson ${idx + 1}) example is corpus ${hitEn || hitEs}: "${en}"`);
    }

    if (seen.has(enN)) problems.push(`tip[${k}] duplicate example with tip[${seen.get(enN)}]: "${en}"`);
    else seen.set(enN, k);

    /* level sanity: examples must not be wildly long for their lesson */
    if (en.split(/\s+/).length > 22) problems.push(`tip[${k}] example is ${en.split(/\s+/).length} words, likely too long: "${en}"`);
});

console.log('lessons: ' + L.length + '   tips: ' + keys.length + '   corpus sentences: ' + L.length * 5);
console.log('answer leaks (example matches a corpus sentence): ' + collisions);
console.log('problems: ' + problems.length);
problems.forEach((p) => console.log('  ' + p));

if (process.argv[2] === '--list') {
    console.log('\n--- all tip examples ---');
    keys.forEach((k) => {
        const t = TIPS[k];
        if (!t || !t.example) return;
        const enN = norm(t.example.en), esN = norm(t.example.es);
        const flag = (corpus.has(enN) || corpus.has(esN)) ? '  <-- LEAK' : '';
        console.log(`tip[${k}] ${t.title}`);
        console.log(`   en: ${t.example.en}`);
        console.log(`   es: ${t.example.es}${flag}`);
    });
}
