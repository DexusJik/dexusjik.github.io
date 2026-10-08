'use strict';
const REPO = require('./repo');
/* Asserts the band thresholds hardcoded in game.js match the tested values,
 * so the two cannot drift apart without the test failing. */
const fs = require('fs');
const APP = REPO.APP + '/';
global.window = {};
eval(fs.readFileSync(APP + 'placement.js', 'utf8'));
const items = window.PLACEMENT_ITEMS;

const src = fs.readFileSync(APP + 'game.js', 'utf8');
const m = src.match(/var PLACEMENT_CUTS = \[([\s\S]*?)\];/);
if (!m) { console.log('FAIL: could not find PLACEMENT_CUTS in game.js'); process.exit(1); }
const cuts = [...m[1].matchAll(/min: (\d+), level: (\d+)/g)].map((x) => ({ min: +x[1], level: +x[2] }));

const testSrc = fs.readFileSync(require('path').join(__dirname, 'test-placement-bands.js'), 'utf8');
const tm = testSrc.match(/const CUTS = \[([\s\S]*?)\];/);
const tcuts = [...tm[1].matchAll(/min: (\d+), level: (\d+)/g)].map((x) => ({ min: +x[1], level: +x[2] }));

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  PASS ' + name); return; }
    failures++; console.log('  FAIL ' + name + (detail ? ' -> ' + detail : ''));
}

check('game.js and the band test declare identical cuts',
    JSON.stringify(cuts) === JSON.stringify(tcuts),
    JSON.stringify(cuts) + ' vs ' + JSON.stringify(tcuts));

const max = items.reduce((s, i) => s + i.pts, 0);

/* PLACEMENT_MAX is now derived from the items; confirm no stale literal */
check('game.js derives the maximum from the items', /function placementMax\(\)/.test(src));
const literal = src.match(/PLACEMENT_MAX\s*=\s*(\d+)/);
check('no hardcoded PLACEMENT_MAX literal remains', !literal || +literal[1] === max,
    literal ? 'literal ' + literal[1] + ' but items sum to ' + max : '');

/* every cut must be reachable and in range */
check('every cut is within the achievable range', cuts.every((c) => c.min >= 0 && c.min <= max));
check('there is a cut for every level 1..5',
    [1, 2, 3, 4, 5].every((lv) => cuts.some((c) => c.level === lv)));

console.log('max from items: ' + max);
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);
