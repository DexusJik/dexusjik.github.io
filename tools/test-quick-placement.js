'use strict';
const REPO = require('./repo');
/*
 * Quick placement test.
 *
 * The forced 30-question test was replaced by an optional 8-item calibration.
 * It still has to behave like a test: cover every band, resist guessing, and
 * place an honest B1/B2/C1 learner in the right level. The full test keeps its
 * own gate; this one protects the short path.
 */
const fs = require('fs');

global.window = {};
require(REPO.ap('placement.js'));
const items = window.PLACEMENT_QUICK_ITEMS;

const src = fs.readFileSync(REPO.ap('game.js'), 'utf8');
const m = src.match(/var PLACEMENT_QUICK_CUTS = \[([\s\S]*?)\];/);
if (!m) {
    console.log('FAIL: could not find PLACEMENT_QUICK_CUTS in game.js');
    process.exit(1);
}
const CUTS = [...m[1].matchAll(/min: (\d+), level: (\d+)/g)]
    .map((x) => ({ min: +x[1], level: +x[2] }));

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  PASS ' + name); return; }
    failures++;
    console.log('  FAIL ' + name + (detail ? ' -> ' + detail : ''));
}

const byLv = {};
items.forEach((i) => {
    byLv[i.lv] = byLv[i.lv] || { count: 0, points: 0, dirs: { en: 0, es: 0 } };
    byLv[i.lv].count++;
    byLv[i.lv].points += i.pts;
    byLv[i.lv].dirs[i.dir] = (byLv[i.lv].dirs[i.dir] || 0) + 1;
});

const max = items.reduce((s, i) => s + i.pts, 0);
const floor = max / 3;

function levelFor(score) {
    for (const c of CUTS) if (score >= c.min) return c.level;
    return 1;
}
function solid(upTo) {
    return items.filter((i) => i.lv <= upTo).reduce((s, i) => s + i.pts, 0);
}
function honest(upTo) {
    const harder = items.filter((i) => i.lv > upTo).reduce((s, i) => s + i.pts, 0);
    return solid(upTo) + harder / 3;
}
function perfect(upTo) {
    return solid(upTo);
}

console.log('quick items: ' + items.length + '   max: ' + max);
Object.keys(byLv).sort().forEach((lv) => {
    console.log('  band ' + lv + ': ' + byLv[lv].count + ' items, ' +
        byLv[lv].points + ' points, dirs ' + JSON.stringify(byLv[lv].dirs));
});

check('quick test has 8 items', items.length === 8, 'got ' + items.length);
check('quick test covers every level band 2..5', [2, 3, 4, 5].every((lv) => byLv[lv]), Object.keys(byLv).join(','));
check('two items per band', [2, 3, 4, 5].every((lv) => byLv[lv] && byLv[lv].count === 2),
    JSON.stringify(Object.keys(byLv).map((lv) => [lv, byLv[lv].count])));
check('each band covers both directions', [2, 3, 4, 5].every((lv) =>
    byLv[lv] && byLv[lv].dirs.en === 1 && byLv[lv].dirs.es === 1));
check('quick maximum is 20', max === 20, 'got ' + max);
check('every cut is reachable', CUTS.every((c) => c.min >= 0 && c.min <= max));
check('there is a cut for every level 1..5',
    [1, 2, 3, 4, 5].every((lv) => CUTS.some((c) => c.level === lv)));

const randomLevel = levelFor(floor);
check('a random guesser lands below level 3 (actually level ' + randomLevel + ')',
    randomLevel <= 2, 'random expected score ' + floor.toFixed(1) + ' maps to level ' + randomLevel);

const b1 = honest(3);
const b2 = honest(4);
const c1 = perfect(4) + byLv[5].points * 0.75;
console.log('  honest B1 = ' + b1.toFixed(1) + ' -> level ' + levelFor(b1));
console.log('  honest B2 = ' + b2.toFixed(1) + ' -> level ' + levelFor(b2));
console.log('  honest C1 = ' + c1.toFixed(1) + ' -> level ' + levelFor(c1));
check('an honest B1 learner reaches level 3', levelFor(b1) >= 3, 'score ' + b1.toFixed(1));
check('an honest B2 learner reaches level 4', levelFor(b2) >= 4, 'score ' + b2.toFixed(1));
check('an honest C1 learner reaches level 5', levelFor(c1) >= 5, 'score ' + c1.toFixed(1));

let mono = true;
for (let i = 1; i < CUTS.length; i++) {
    if (CUTS[i - 1].min <= CUTS[i].min) mono = false;
}
check('cuts decrease monotonically', mono);
check('every cut from level 3 up is above the guessing floor',
    CUTS.filter((c) => c.level >= 3).every((c) => c.min > floor),
    CUTS.filter((c) => c.level >= 3).map((c) => c.min).join(',') +
    ' vs floor ' + floor.toFixed(1));

console.log('');
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);
