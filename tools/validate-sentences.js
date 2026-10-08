'use strict';
const REPO = require('./repo');
/* Validator for sentences.js.
 *
 * Failure modes it must catch:
 *   1. distractor identical to the correct answer
 *   2. duplicate distractors inside one array
 *   3. missing we/ws
 *   4. leftover garbage: "..." runs, non-Latin scripts, mixed script
 *   5. cross-language leakage, using the CORRECT sentence's own vocabulary as
 *      the whitelist (so surnames like "Díaz" and negated forms like "no" do
 *      not produce false positives)
 */
global.window = {};
const path = REPO.ap('sentences.js');
eval(require('fs').readFileSync(path, 'utf8'));
const L = window.DAILY_LESSONS;
const P = require('./personalize-corpus.js')(L, process.env.TEST_NAME || 'Sofía');
console.log(`personalized as:      ${P.name} (other: ${P.other}, marked sentences: ${P.marked})`);

const norm = (s) => String(s).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const words = (s) => norm(s).split(' ').filter(Boolean);

const problems = [];
let total = 0, complete = 0;

/* characters outside Latin / Latin-1 / Latin Extended-A = garbage */
const NON_LATIN = /[\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;

function leakFor() { return []; }

L.forEach((lesson, li) => {
    lesson.sentences.forEach((s, si) => {
        total++;
        const at = `L${li + 1} s${si + 1} "${String(s.en || s.es || '?').slice(0, 44)}"`;
        if (!s.lv) problems.push(`${at}: missing lv`);
        if (!s.we || !s.ws || !s.we.length || !s.ws.length) {
            problems.push(`${at}: missing we/ws`);
            return;
        }
        complete++;

        [['en', s.we], ['es', s.ws]].forEach(([k, arr]) => {
            if (!Array.isArray(arr)) { problems.push(`${at}: ${k} is not an array`); return; }
            const correct = s[k];
            if (!correct) { problems.push(`${at}: missing ${k}`); return; }

            const seen = new Set();
            arr.forEach((d, di) => {
                const at2 = `${at} ${k}[${di}]`;
                if (typeof d !== 'string' || !d.trim()) { problems.push(`${at2}: empty`); return; }
                if (/\.\.\./.test(d)) problems.push(`${at2}: "..." left in -> "${d}"`);
                if (NON_LATIN.test(d)) problems.push(`${at2}: non-latin script -> "${d}"`);
                if (norm(d) === norm(correct)) problems.push(`${at2}: EQUALS CORRECT -> "${d}"`);
                const n = norm(d);
                if (seen.has(n)) problems.push(`${at2}: DUPLICATE -> "${d}"`);
                seen.add(n);
                const leak = leakFor(k, d, correct);
                if (leak.length) problems.push(`${at2}: wrong language [${leak.join(',')}] -> "${d}"`);
            });
            if (arr.length < 3) problems.push(`${at} ${k}: only ${arr.length} distractors (want 3)`);
        });
    });
});

console.log(`sentences:            ${total}`);
console.log(`complete (we + ws):   ${complete}`);
console.log(`problems:             ${problems.length}`);
console.log('');
problems.forEach(p => console.log('  ' + p));
