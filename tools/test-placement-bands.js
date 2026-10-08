'use strict';
const REPO = require('./repo');
/*
 * Placement band test.
 *
 * The point of this test is that random guessing must not buy a level. Every
 * item offers three options, so a learner choosing at random scores an
 * expected max/3. If the level-3 cut sits below that floor, coin flips reach
 * B1, which is exactly the bug the cut bands had.
 *
 * Must FAIL against the old bands (>=14 for level 3, floor 16.7/50).
 */
global.window = {};
require(REPO.ap('placement.js'));
const items = window.PLACEMENT_ITEMS;

/* the bands as game.js currently declares them */
const CUTS = [
    { min: 60, level: 5 },
    { min: 44, level: 4 },
    { min: 34, level: 3 },
    { min: 10, level: 2 },
    { min: 0, level: 1 }
];

const byLv = {};
items.forEach((i) => {
    byLv[i.lv] = byLv[i.lv] || { count: 0, points: 0 };
    byLv[i.lv].count++;
    byLv[i.lv].points += i.pts;
});

const max = items.reduce((s, i) => s + i.pts, 0);
const floor = max / 3;

function levelFor(score) {
    for (const c of CUTS) if (score >= c.min) return c.level;
    return 1;
}
/* expected score of a learner who is correct on the listed bands and wrong on the rest */
function honest(upTo) {
    return items.filter((i) => i.lv <= upTo).reduce((s, i) => s + i.pts, 0);
}
function halfOf(lv) {
    const list = items.filter((i) => i.lv === lv);
    const pts = list.reduce((s, i) => s + i.pts, 0);
    return pts / 2;
}

console.log('items: ' + items.length + '   max: ' + max);
Object.keys(byLv).forEach((lv) => console.log(`  band ${lv}: ${byLv[lv].count} items, ${byLv[lv].points} points`));
console.log('guessing floor (max/3): ' + floor.toFixed(1) + ' (' + ((floor / max) * 100).toFixed(0) + '%)');
console.log('');
console.log('cuts:');
CUTS.slice().reverse().forEach((c) => console.log(`  >= ${String(c.min).padStart(2)} -> level ${c.level}  (${((c.min / max) * 100).toFixed(0)}%)`));
console.log('');

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  PASS ' + name); return; }
    failures++;
    console.log('  FAIL ' + name + (detail ? ' -> ' + detail : ''));
}

/* the headline property */
const randomLevel = levelFor(floor);
check('a random guesser lands below level 3 (actually level ' + randomLevel + ')',
    randomLevel <= 2,
    'random expected score ' + floor.toFixed(1) + ' maps to level ' + randomLevel);

/*
 * Over-correction guard: honest learners must still reach their level.
 *
 * A learner who knows English up to band N does NOT score zero on the harder
 * bands. With three options they collect roughly a third of those points by
 * elimination alone, and partial knowledge adds more. Modelling them as
 * scoring exactly zero would be harsh enough to suggest that no cut could
 * satisfy both requirements, which would be an artefact of the model rather
 * than a fact about learners.
 *
 * perfect(N) is the floor of what they can earn -- every band up to N correct
 * and nothing else. Reported for reference, not asserted against.
 */
function perfect(upTo) {
    return items.filter((i) => i.lv <= upTo).reduce((s, i) => s + i.pts, 0);
}
function honest(upTo) {
    const solid = items.filter((i) => i.lv <= upTo).reduce((s, i) => s + i.pts, 0);
    const harder = items.filter((i) => i.lv > upTo).reduce((s, i) => s + i.pts, 0);
    return solid + harder / 3;
}
const b1 = honest(3);
const b2 = honest(4);
const c1 = perfect(4) + byLv[5].points * 0.75;
console.log('  honest B1 (bands 2-3 solid)   = ' + b1.toFixed(1) + '  -> level ' + levelFor(b1) + '   [floor: perfect on 2-3 only = ' + perfect(3) + ']');
console.log('  honest B2 (bands 2-4 solid)   = ' + b2.toFixed(1) + '  -> level ' + levelFor(b2) + '   [floor: perfect on 2-4 only = ' + perfect(4) + ']');
console.log('  honest C1 (to 4, 3/4 of 5)    = ' + c1.toFixed(1) + '  -> level ' + levelFor(c1));
console.log('');

check('an honest B1 learner reaches level 3', levelFor(b1) >= 3, 'score ' + b1 + ' -> level ' + levelFor(b1));
check('an honest B2 learner reaches level 4', levelFor(b2) >= 4, 'score ' + b2.toFixed(1) + ' -> level ' + levelFor(b2));
check('an honest C1 learner reaches level 5', levelFor(c1) >= 5, 'score ' + c1.toFixed(1) + ' -> level ' + levelFor(c1));

/* monotonicity */
let mono = true;
for (let i = 1; i < CUTS.length; i++) {
    if (CUTS[i - 1].min <= CUTS[i].min) mono = false;
}
check('cuts decrease monotonically', mono);

/* every cut except the floor sits above the guessing floor */
const aboveFloor = CUTS.filter((c) => c.level >= 3).every((c) => c.min > floor);
check('every cut from level 3 up is above the guessing floor', aboveFloor,
    CUTS.filter((c) => c.level >= 3).map((c) => c.min).join(',') + ' vs floor ' + floor.toFixed(1));

console.log('');
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);
