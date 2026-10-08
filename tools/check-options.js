'use strict';
const REPO = require('./repo');
/* Verifies the data contract game.js depends on, for all 365 sentences:
 *   - optionsFor() must yield exactly 4 options (1 correct + 3 distractors)
 *   - the correct answer must be in the set
 *   - no duplicates after normalize() (game.js compares with normalize())
 *   - the word bank must get enough fillers to pad the bank
 * Reimplements optionsFor/fillerWords exactly as game.js does, minus shuffle.
 */
global.window = {};
const dir = REPO.APP + '/';
eval(require('fs').readFileSync(dir + 'sentences.js', 'utf8'));
const LESSONS = window.DAILY_LESSONS;
const P = require('./personalize-corpus.js')(LESSONS, process.env.TEST_NAME || 'Sofía');
console.log(`personalized as ${P.name} (other: ${P.other}, marked: ${P.marked}, leftovers: ${P.leftovers.length})`);
if (P.leftovers.length) { console.log('LEFTOVER MARKERS: ' + P.leftovers.join(', ')); process.exitCode = 1; }

const normalize = (x) => String(x).toLowerCase()
    .replace(/[.,!?;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function optionsFor(s, key) {
    const authored = key === 'en' ? s.we : s.ws;
    const correct = s[key];
    const seen = new Set([correct]);
    const source = (authored && authored.length) ? authored : [];
    const options = [correct];
    for (const opt of source) {
        if (options.length >= 4) continue;
        if (!opt || seen.has(opt)) continue;
        seen.add(opt);
        options.push(opt);
    }
    return options;
}

function fillerPool(s) {
    const lesson = LESSONS.find(l => l.sentences.indexOf(s) >= 0);
    const seen = new Set([s.en]);
    const pool = [];
    if (lesson) {
        for (const other of lesson.sentences) {
            if (other === s) continue;
            for (const word of String(other.en).replace(/[.,!?;:]/g, '').split(/\s+/)) {
                if (word.length < 2 || seen.has(word) || pool.includes(word)) continue;
                pool.push(word);
            }
        }
    }
    return pool;
}

const bad = [];
let choiceChecks = 0, bankChecks = 0;

for (const [li, lesson] of LESSONS.entries()) {
    for (const [si, s] of lesson.sentences.entries()) {
        const at = `L${li + 1} s${si + 1} "${s.en.slice(0, 40)}"`;

        for (const key of ['en', 'es']) {
            const opts = optionsFor(s, key);
            choiceChecks++;
            if (opts.length !== 4) bad.push(`${at} ${key}: ${opts.length} options (want 4)`);
            if (!opts.includes(s[key])) bad.push(`${at} ${key}: correct answer not in options`);
            const n = opts.map(normalize);
            if (new Set(n).size !== n.length) bad.push(`${at} ${key}: duplicate after normalize`);
        }

        // word bank needs target words + at least 3 fillers
        const target = s.en.replace(/\.$/, '').split(/\s+/).filter(Boolean);
        const fillers = fillerPool(s).filter(w => !target.some(t => normalize(t) === normalize(w)));
        const need = target.length + 3;
        const have = new Set([...target, ...fillers]).size;
        bankChecks++;
        if (have < need) {
            bad.push(`${at} bank: need ${need} tiles, have ${have} (target ${target.length}, fillers ${fillers.length})`);
        }
    }
}

console.log(`choice exercises checked : ${choiceChecks}  (365 x en/es)`);
console.log(`word banks checked       : ${bankChecks}`);
console.log(`problems                 : ${bad.length}`);
console.log('');
bad.slice(0, 40).forEach(b => console.log('  ' + b));
if (bad.length > 40) console.log(`  ... and ${bad.length - 40} more`);
