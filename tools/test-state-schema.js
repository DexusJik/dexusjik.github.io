/* Tests state-schema.js against corrupt and hostile saved state.
   Run: node test-state-schema.js   */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = require('./repo');
const ROOT = REPO.p('english-daily') + path.sep;
const src = fs.readFileSync(ROOT + 'state-schema.js', 'utf8');

let failures = 0;
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (!ok) failures++;
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label +
        (ok ? '' : '   got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(expected)));
}
function repairsAre(result, needle) {
    return result.repairs.some((r) => r.indexOf(needle) >= 0);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(src, sandbox, { filename: 'state-schema.js' });
const S = sandbox.window.DailyStateSchema;

/* mirrors game.js defaultState() */
function defaults() {
    return {
        xp: 0, gems: 50, streak: 0, lastStudyDate: null, bestStreak: 0,
        streakFreeze: 0, studyHistory: {}, dailyXp: 0, dailyXpDate: null,
        lessonsDone: 0, perfectLessons: 0, seenSentences: 0, hearts: 5,
        heartsTs: 1700000000000, currentLesson: 0, completed: {}, missed: {},
        badges: {}, nickname: '', rivals: [], placement: null,
        placementSkipped: false, dailyLessonDoneDate: null,
        storageNoticeDismissed: false, features: {},
    };
}

console.log('state-schema: clean state passes through untouched');
{
    const d = defaults();
    const r = S.repair(JSON.parse(JSON.stringify(d)), d);
    check('no repairs on clean state', r.repairs.length, 0);
    check('xp preserved', r.state.xp, 0);
    check('hearts preserved', r.state.hearts, 5);
    check('deep equal to input', r.state, d);
}

console.log('\nstate-schema: wrong types are repaired, not propagated');
{
    const d = defaults();
    const r = S.repair({
        xp: '980', hearts: '5', streak: true, completed: [],
        missed: 'nope', badges: 42, nickname: { first: 'C' },
        placementSkipped: 'yes', features: null, dailyXp: 12.7,
    }, d);
    check('numeric string becomes a number', r.state.xp, 980);
    check('hearts string becomes a number', r.state.hearts, 5);
    check('boolean where a number belongs resets', r.state.streak, 0);
    check('array where a map belongs resets', r.state.completed, {});
    check('string where a map belongs resets', r.state.missed, {});
    check('number where a map belongs resets', r.state.badges, {});
    check('object where text belongs resets', r.state.nickname, '');
    check('string where a boolean belongs resets', r.state.placementSkipped, false);
    check('null features takes the default', r.state.features, {});
    check('fractional dailyXp rounds to an integer', r.state.dailyXp, 13);
    /* exactly eight of the ten fields are wrong; features was null, which takes
       the default silently and correctly, and dailyXp only needed rounding */
    check('every wrong field was reported', r.repairs.length, 8);
    ['xp', 'streak', 'hearts', 'completed', 'missed', 'badges', 'nickname',
        'placementSkipped'].forEach((k) => {
        check('reported: ' + k, repairsAre(r, k), true);
    });
}

console.log('\nstate-schema: out-of-range values are clamped');
{
    const d = defaults();
    const r = S.repair({ hearts: 99, xp: -50, currentLesson: 1e9, gems: -1 }, d);
    check('hearts clamped to MAX_HEARTS', r.state.hearts, 5);
    check('negative xp raised to 0', r.state.xp, 0);
    check('absurd currentLesson lowered', r.state.currentLesson, 9999);
    check('negative gems raised to 0', r.state.gems, 0);
}

console.log('\nstate-schema: dates');
{
    const d = defaults();
    const r = S.repair({
        lastStudyDate: '2026-10-7', dailyXpDate: 'yesterday',
        dailyLessonDoneDate: 20261007,
    }, d);
    check('valid unpadded date kept', r.state.lastStudyDate, '2026-10-7');
    check('word date cleared', r.state.dailyXpDate, null);
    check('number date cleared', r.state.dailyLessonDoneDate, null);
}

console.log('\nstate-schema: placement is validated, or dropped so the test re-offers');
{
    const d = defaults();
    const good = { score: 44, max: 78, correct: 17, total: 30, level: 4, v: 5 };
    check('valid placement kept', S.repair({ placement: good }, d).state.placement.level, 4);
    check('string placement cleared', S.repair({ placement: 'B2' }, d).state.placement, null);
    check('placement with no max cleared',
        S.repair({ placement: { score: 44, level: 4 } }, d).state.placement, null);
    check('placement with level 9 cleared',
        S.repair({ placement: { score: 44, max: 78, level: 9 } }, d).state.placement, null);
    const clamped = S.repair({ placement: { score: 90, max: 78, level: 4 } }, d);
    check('score above max is clamped, placement kept', clamped.state.placement.score, 78);
    check('clamping was reported', repairsAre(clamped, 'exceeds max'), true);
}

console.log('\nstate-schema: never loses progress it can keep');
{
    const d = defaults();
    /* a big, real profile with one bad field among many good ones */
    const established = {
        xp: 1040, gems: 210, streak: 17, bestStreak: 31,
        lessonsDone: 19, perfectLessons: 7, seenSentences: 95,
        completed: { 0: true, 1: true, 2: true }, badges: { streak3: true },
        nickname: 'Camila',
        placement: { score: 78, max: 78, total: 30, level: 5, v: 5 },
        hearts: 'corrupt',
    };
    const r = S.repair(established, d);
    check('xp survived the bad field', r.state.xp, 1040);
    check('gems survived', r.state.gems, 210);
    check('streak survived', r.state.streak, 17);
    check('bestStreak survived', r.state.bestStreak, 31);
    check('lessonsDone survived', r.state.lessonsDone, 19);
    check('completed map survived', r.state.completed, { 0: true, 1: true, 2: true });
    check('badges survived', r.state.badges, { streak3: true });
    check('nickname survived', r.state.nickname, 'Camila');
    check('placement survived', r.state.placement.level, 5);
    check('only hearts was repaired', r.repairs.length, 1);
    check('and it was hearts', repairsAre(r, 'hearts'), true);
}

console.log('\nstate-schema: junk and hostile input');
{
    const d = defaults();
    const cases = [
        ['empty object', {}],
        ['null prototype-ish', { xp: NaN, gems: Infinity }],
        ['array as whole state', []],
        ['string as whole state', 'corrupt'],
        ['deeply wrong completed', { completed: { 0: 'yes', 1: 3, 2: null } }],
        ['huge nickname', { nickname: 'x'.repeat(500) }],
        ['nested bomb', { features: { a: { b: { c: 1 } } } }],
        ['numeric string key', { xp: 0, '0': 'not a field' }],
        ['key with a space', { xp: 0, 'my key': 1 }],
    ];
    cases.forEach(([name, input]) => {
        let r;
        try {
            r = S.repair(input, d);
        } catch (e) {
            check(name + ' does not throw', 'threw: ' + e.message, 'no throw');
            return;
        }
        check(name + ' returns a full state', Object.keys(r.state).length, Object.keys(d).length);
        check(name + ' has usable xp', typeof r.state.xp, 'number');
    });
}

console.log('\nstate-schema: forward-compatible keys survive, prototype keys do not');
{
    const d = defaults();
    /* a state written by a NEWER app must not be silently downgraded */
    const future = S.repair({ xp: 10, futureFeatureFlag: true, newCounter: 7 }, d);
    check('unknown valid field is kept', future.state.futureFeatureFlag, true);
    check('and its value is intact', future.state.newCounter, 7);
    check('keeping it is not reported as a repair', future.repairs.length, 0);

    /* but assigning __proto__ would rewrite the object's prototype */
    const parsed = JSON.parse('{"xp":5,"__proto__":{"polluted":true},"ok":1}');
    const hostile = S.repair(parsed, d);
    check('__proto__ key did not pollute the result', hostile.state.polluted, undefined);
    check('Object.prototype is clean', ({}).polluted, undefined);
    check('xp still read correctly', hostile.state.xp, 5);
    check('a sibling field still survived', hostile.state.ok, 1);
    check('dropping __proto__ was reported', repairsAre(hostile, '__proto__'), true);
}

console.log('\nstate-schema: idempotent, so a repair cannot drift');
{
    const d = defaults();
    const messy = { xp: '1040', hearts: 99, completed: [], nickname: '  Camila  ', dailyXpDate: 'x' };
    const once = S.repair(messy, d).state;
    const twice = S.repair(once, d).state;
    check('repairing twice equals repairing once', twice, once);
    const third = S.repair(twice, d).state;
    check('repairing three times equals repairing once', third, once);
}

console.log('\nstate-schema: trims whitespace and caps nickname length');
{
    const d = defaults();
    const r = S.repair({ nickname: '   Camila   ' }, d);
    check('nickname trimmed', r.state.nickname, 'Camila');
    const long = S.repair({ nickname: 'a'.repeat(100) }, d);
    check('nickname capped at 24', long.state.nickname.length, 24);
}

console.log('\nstate-schema: a valid placement must never be cleared by accident');
{
    /* the v5 shape exactly as migrations.js writes it */
    const d = defaults();
    const real = { score: 44, max: 78, correct: 17, total: 30, level: 4, date: '2026-10-8', v: 5 };
    const r = S.repair({ placement: real }, d);
    check('placement survives intact', r.state.placement, real);
    check('and reports no repair', r.repairs.length, 0);
}

console.log('');
console.log(failures ? 'failures: ' + failures : 'failures: 0');
process.exit(failures ? 1 : 0);