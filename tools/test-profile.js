'use strict';
const REPO = require('./repo');
/*
 * Learner-profile rules.
 *
 * These are the decisions that adapt the app to different people: how much a
 * daily goal is worth, how the week is bucketed, which exercise belongs to
 * which skill, when practice gets harder, and when a broken streak is
 * repairable. They live in profile.js precisely so they can be tested without
 * a browser.
 */
global.window = {};
require(REPO.ap('profile.js'));
require(REPO.ap('sentences.js'));
const P = window.DailyProfile;
const lessons = window.DAILY_LESSONS;

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  PASS ' + name); return; }
    failures++;
    console.log('  FAIL ' + name + (detail ? ' -> ' + detail : ''));
}

/* ---- daily and weekly goals ---- */
check('goal presets are 20, 50 and 100', P.GOAL_PRESETS.join(',') === '20,50,100',
    P.GOAL_PRESETS.join(','));
check('a valid goal is kept', P.goal(100) === 100, P.goal(100));
check('a missing goal falls back to 50', P.goal(undefined) === 50, P.goal(undefined));
check('an unknown goal falls back to 50', P.goal(37) === 50, P.goal(37));
check('weekly target is five study days', P.weeklyTarget(50) === 250, P.weeklyTarget(50));
check('weekly target follows the chosen goal', P.weeklyTarget(100) === 500, P.weeklyTarget(100));

/* ---- week bucketing (local dates, Monday start) ---- */
const wed = P.weekStartKey(new Date(2026, 10, 11));   // Wed 11 Nov 2026
const mon = P.weekStartKey(new Date(2026, 10, 9));    // Mon 9 Nov 2026
const sun = P.weekStartKey(new Date(2026, 10, 15));   // Sun 15 Nov 2026
const nextMon = P.weekStartKey(new Date(2026, 10, 16)); // Mon 16 Nov 2026
check('Wednesday starts the Monday before', wed === '2026-11-9', wed);
check('Monday is its own week start', mon === '2026-11-9', mon);
check('Sunday belongs to the same week', sun === '2026-11-9', sun);
check('the next Monday starts a new week', nextMon === '2026-11-16', nextMon);

/* ---- skill coverage ---- */
const typeToSkill = {};
P.skills().forEach((s) => s.types.forEach((t) => { typeToSkill[t] = s.id; }));
['listen', 'multipleChoice', 'translate', 'wordBank', 'speakBack', 'spanishToEnglish', 'fillBlank']
    .forEach((type) => {
        check('exercise type "' + type + '" has a skill', !!typeToSkill[type], typeToSkill[type]);
    });
const ids = P.skills().map((s) => s.id);
check('skill ids are unique', new Set(ids).size === ids.length, ids.join(','));
check('every skill has a name and icon', P.skills().every((s) => s.name && s.icon));

/* ---- typing-free mode ---- */
check('typing-free replaces free text with word bank',
    P.comfortableType('translate', true) === 'wordBank',
    P.comfortableType('translate', true));
check('typing-free leaves choice exercises alone',
    P.comfortableType('multipleChoice', true) === 'multipleChoice',
    P.comfortableType('multipleChoice', true));
check('normal mode keeps free text',
    P.comfortableType('translate', false) === 'translate',
    P.comfortableType('translate', false));

/* ---- adaptive practice level ---- */
check('a strong sample moves one level up',
    P.targetLevel(3, 18, 20) === 4, P.targetLevel(3, 18, 20));
check('a weak sample moves one level down',
    P.targetLevel(3, 2, 10) === 2, P.targetLevel(3, 2, 10));
check('a small sample stays put',
    P.targetLevel(3, 2, 3) === 3, P.targetLevel(3, 2, 3));
check('level never exceeds 5', P.targetLevel(5, 20, 20) === 5, P.targetLevel(5, 20, 20));
check('level never drops below 1', P.targetLevel(1, 0, 20) === 1, P.targetLevel(1, 0, 20));

/* ---- streak repair ---- */
check('one missed day is repairable', P.canRepair(0, 5, 2) === true);
check('a current streak is not repairable', P.canRepair(4, 5, 2) === false);
check('a two-day gap is not repairable', P.canRepair(0, 5, 3) === false);
check('a one-day gap is not repairable', P.canRepair(0, 5, 1) === false);
check('a one-day streak is not worth repairing', P.canRepair(0, 1, 2) === false);
check('repair cost is 20 gems', P.REPAIR_COST === 20, P.REPAIR_COST);

/* ---- focus areas ---- */
check('every focus id resolves', P.focusIds().every((id) => P.focus(id).id === id));
check('an unknown focus falls back to general', P.focus('nope').id === 'general', P.focus('nope').id);
check('work focus has recommendations', P.focus('work').lessons.length > 0);
check('focus lessons point at real lessons', P.focusIds().every((id) =>
    P.focus(id).lessons.every((i) => lessons[i] && !!lessons[i].title)),
    P.focusIds().map((id) => id + ':' + P.focus(id).lessons.length).join(' '));

console.log('');
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);
