/* Tests the state-schema fixes made after the second code review. Each covers
 * a defect that shipped in the first version of the file, found by a reviewer,
 * not by us.
 *
 * Run: node tools/test-state-schema-2.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = require('./repo');
const ROOT = REPO.p('english-daily') + path.sep;

const src = fs.readFileSync(ROOT + 'state-schema.js', 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'state-schema.js' });
const S = sandbox.window.DailyStateSchema;

let failures = 0;
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (!ok) failures++;
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label +
        (ok ? '' : '   got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(expected)));
}
function rule(form, needle) {
    return form.some(function (r) { return String(r).indexOf(needle) >= 0; });
}

function defaults() {
    return {
        xp: 0, gems: 50, streak: 0, lastStudyDate: null, bestStreak: 0,
        streakFreeze: 0, studyHistory: {}, dailyXp: 0, dailyXpDate: null,
        lessonsDone: 0, perfectLessons: 0, seenSentences: 0, hearts: 5,
        heartsTs: 1, currentLesson: 0, completed: {}, missed: {},
        badges: {}, nickname: '', rivals: [], placement: null,
        placementSkipped: false, dailyLessonDoneDate: null,
        storageNoticeDismissed: false, features: {},
    };
}

console.log('FIX 1 — a blank or whitespace-only string is REJECTED, not coerced to 0\n');
{
    /* Number("") is 0 and isFinite, so hearts:"" became 0 with nothing reported.
       The learner lost hearts on every load and nothing indicated it. */
    const r = S.repair({ hearts: '', xp: '   ', streak: '\t' }, defaults());
    check('hearts "" takes the default, not 0', r.state.hearts, 5);
    check('and it is reported', rule(r.repairs, 'hearts'), true);
    check('xp "   " takes the default', r.state.xp, 0);
    check('streak "\t" takes the default', r.state.streak, 0);
    check('three repairs reported', r.repairs.length, 3);
}

console.log('\nFIX 2 — a date must be a real calendar date\n');
{
    /* 2026-99-99 matched the digit-count pattern, and the streak logic compares
       these strings, so an impossible date produced a bogus streak. */
    const d = defaults();
    const r = S.repair({
        lastStudyDate: '2026-99-99', dailyXpDate: '9999-00-00',
        dailyLessonDoneDate: '2026-02-30',
    }, d);
    check('impossible month/day rejected', r.state.lastStudyDate, null);
    check('zero month rejected', r.state.dailyXpDate, null);
    check('Feb 30 rejected', r.state.dailyLessonDoneDate, null);
}
{
    /* and a real one still passes, unpadded as the app writes it */
    const r = S.repair({ lastStudyDate: '2026-10-9', dailyXpDate: '2026-1-5' }, defaults());
    check('valid unpadded date kept', r.state.lastStudyDate, '2026-10-9');
    check('valid single-digit month/day kept', r.state.dailyXpDate, '2026-1-5');
    check('nothing reported for valid dates', r.repairs.length, 0);
}

console.log('\nFIX 3 — placement coerces its fields AND writes them back\n');
{
    /* Validating score/max/level into locals and then storing the original
       object let "44" survive into state as a string — the exact wrong-type
       leak this file exists to stop. */
    const r = S.repair({
        placement: { score: '44', max: '78', total: 30, level: '4', v: 5 },
    }, defaults());
    check('score written back as a number', typeof r.state.placement.score, 'number');
    check('max written back as a number', typeof r.state.placement.max, 'number');
    check('level written back as a number', typeof r.state.placement.level, 'number');
    check('score value correct', r.state.placement.score, 44);
    check('level value correct', r.state.placement.level, 4);
    check('unrelated field untouched', r.state.placement.v, 5);
    check('every coercion reported', r.repairs.length >= 3, true);
}
{
    /* a score above max is clamped, and the CLAMPED value is what is stored */
    const r = S.repair({ placement: { score: 90, max: 78, level: 4 } }, defaults());
    check('score clamped to max', r.state.placement.score, 78);
    check('clamping reported', rule(r.repairs, 'exceeds max'), true);
}

console.log('\nFIX 4 — isPlainObject is defined (it was deleted, and repair() threw)\n');
{
    /* Deleting the helper while inserting isRealDate made repair() throw
       ReferenceError. load()'s catch swallowed it and returned DEFAULTS, which
       save() then persisted — the whole data-loss path. */
    let threw = null;
    let r;
    try {
        r = S.repair({
            hearts: 'corrupt', completed: [], missed: 'x', badges: 1, features: null,
            placement: { score: 44, max: 78, level: 4 },
        }, defaults());
    } catch (e) {
        threw = e.message;
    }
    check('repair does not throw', threw, null);
    check('hearts repaired', r.state.hearts, 5);
    check('completed repaired', r.state.completed, {});
    check('missed repaired', r.state.missed, {});
    check('badges repaired', r.state.badges, {});
    check('placement kept', r.state.placement.level, 4);
}

console.log('\nFIX 5 — progress is never lost when it can be kept\n');
{
    const established = {
        xp: 1040, gems: 210, streak: 17, bestStreak: 31,
        lastStudyDate: '2026-10-9',
        studyHistory: { '2026-10-9': true },
        lessonsDone: 19, perfectLessons: 7, seenSentences: 95,
        completed: { 0: true, 1: true, 2: true }, badges: { streak3: true },
        nickname: 'Camila',
        placement: { score: 44, max: 78, total: 30, level: 4, v: 5 },
        hearts: 'corrupt',
    };
    const r = S.repair(established, defaults());
    check('xp survived', r.state.xp, 1040);
    check('gems survived', r.state.gems, 210);
    check('streak survived', r.state.streak, 17);
    check('bestStreak survived', r.state.bestStreak, 31);
    check('lessonsDone survived', r.state.lessonsDone, 19);
    check('completed survived', r.state.completed, { 0: true, 1: true, 2: true });
    check('badges survived', r.state.badges, { streak3: true });
    check('nickname survived', r.state.nickname, 'Camila');
    check('valid placement survived', r.state.placement, {
        score: 44, max: 78, total: 30, level: 4, v: 5,
    });
    check('only hearts was repaired', r.repairs.length, 1);
}

console.log('\nidempotent: repairing twice changes nothing\n');
{
    const messy = {
        hearts: '', xp: '1040', completed: [], nickname: '  Camila  ',
        dailyXpDate: 'nope', placement: { score: '44', max: '78', level: '4' },
    };
    const once = S.repair(messy, defaults()).state;
    const twice = S.repair(once, defaults()).state;
    check('repair is idempotent', twice, once);
    const third = S.repair(twice, defaults()).state;
    check('and idempotent a third time', third, once);
}

console.log('');
console.log(failures ? 'failures: ' + failures : 'failures: 0');
process.exit(failures ? 1 : 0);
