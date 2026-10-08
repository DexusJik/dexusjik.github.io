'use strict';
const REPO = require('./repo');
/*
 * Placement content validator.
 *
 * Structural checks only. Whether a distractor is *semantically* defensible is
 * a human judgement, so this prints every option of the reviewed items for a
 * human to adjudicate rather than guessing at it.
 */
global.window = {};
require(REPO.ap('placement.js'));
const items = window.PLACEMENT_ITEMS;

const norm = (s) => String(s).toLowerCase()
    .replace(/[¿?¡!.,;:"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const problems = [];
const REVIEW = new Set([10, 14, 18, 20]);

items.forEach((it, i) => {
    const n = i + 1;
    const at = `Q${n}`;
    if (!it.q || !it.q.trim()) problems.push(`${at}: empty q`);
    if (!it.a || !it.a.trim()) problems.push(`${at}: empty a`);
    if (!Array.isArray(it.w)) { problems.push(`${at}: w is not an array`); return; }
    if (it.w.length !== 2) problems.push(`${at}: ${it.w.length} distractors, header contract says 2`);
    const seen = new Set([norm(it.a)]);
    it.w.forEach((d, j) => {
        if (typeof d !== 'string' || !d.trim()) { problems.push(`${at} w${j + 1}: empty`); return; }
        if (norm(d) === norm(it.a)) problems.push(`${at} w${j + 1}: EQUALS the answer -> "${d}"`);
        if (seen.has(norm(d))) problems.push(`${at} w${j + 1}: DUPLICATE -> "${d}"`);
        seen.add(norm(d));
    });
    if (!it.why || !it.why.trim()) problems.push(`${at}: empty why`);
    // wrong-language distractor check: same language as the answer
    const esCount = (s) => (String(s).match(/[¿áéíóúñ]/gi) || []).length;
    const esA = esCount(it.a);
    it.w.forEach((d, j) => {
        const esD = esCount(d);
        if (it.dir === 'en' && esA > 2 && esD === 0) problems.push(`${at} w${j + 1}: looks English inside a Spanish set -> "${d}"`);
        if (it.dir === 'es' && esA === 0 && esD > 2) problems.push(`${at} w${j + 1}: looks Spanish inside an English set -> "${d}"`);
    });
});

/* band shape: 6/8/8/8 items, weighted toward the upper bands */
const EXPECT_BANDS = { 2: 6, 3: 8, 4: 8, 5: 8 };
const counts = {};
items.forEach((it) => { counts[it.lv] = (counts[it.lv] || 0) + 1; });
Object.keys(EXPECT_BANDS).forEach((lv) => {
    if (counts[lv] !== EXPECT_BANDS[lv]) {
        problems.push(`band lv${lv}: ${counts[lv] || 0} items, expected ${EXPECT_BANDS[lv]}`);
    }
});

/* maximum is recomputed from the data, never trusted from a constant */
const maxScore = items.reduce((s, i) => s + i.pts, 0);
console.log('items: ' + items.length);
console.log('max score (from data): ' + maxScore);
console.log('guessing floor (max/3): ' + (maxScore / 3).toFixed(1) + ' (' + ((maxScore / 3) / maxScore * 100).toFixed(0) + '%)');
console.log('structural problems: ' + problems.length);
problems.forEach((p) => console.log('  ' + p));

console.log('\n--- items for human review (semantic ambiguity) ---');
items.forEach((it, i) => {
    const n = i + 1;
    if (!REVIEW.has(n)) return;
    console.log(`\nQ${n}  [dir=${it.dir} lv${it.lv} ${it.pts}pts]`);
    console.log('  q  : ' + it.q);
    console.log('  a  : ' + it.a);
    it.w.forEach((w, j) => console.log(`  w${j + 1}: ${w}`));
    console.log('  why: ' + it.why);
});
