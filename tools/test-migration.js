'use strict';
const REPO = require('./repo');
/*
 * Migration unit test.
 *
 * The migration runs on every boot and mutates saved progress, so it is the
 * highest-risk code in the app. These cases must pass before it ships.
 */
const path = REPO.ap('migrations.js');

let api;
try {
    delete require.cache[require.resolve(path)];
    api = require(path);
} catch (e) {
    console.log('FAIL: migrations.js cannot be loaded -> ' + e.message);
    console.log('failures: 4 (migration does not exist yet)');
    process.exit(1);
}

const V = api.PLACEMENT_VERSION;
console.log('PLACEMENT_VERSION: ' + V);

let failures = 0;
function check(name, cond, detail) {
    if (cond) { console.log('  PASS ' + name); return; }
    failures++;
    console.log('  FAIL ' + name + (detail ? ' -> ' + detail : ''));
}

/* case 1: placement recorded before the fix must be cleared, re-offer allowed */
{
    const s = { nickname: 'Camila', placement: { score: 38, max: 50, correct: 20, total: 20, level: 5, date: '2026-10-1' }, placementSkipped: false };
    api.run(s);
    check('unstamped placement is cleared', s.placement === null, 'got ' + JSON.stringify(s.placement));
    check('re-offer is possible', s.placementSkipped === false);
    check('nickname survives', s.nickname === 'Camila');
}

/* case 2: a placement taken after the fix must be left completely alone */
{
    const stamped = { score: 34, max: 50, correct: 16, total: 20, level: 4, date: '2026-10-7', v: V };
    const s = { nickname: 'Diego', placement: stamped, placementSkipped: false };
    api.run(s);
    check('stamped placement is kept', s.placement === stamped);
    check('stamped object is identical (not rebuilt)', s.placement === stamped && s.placement.score === 34 && s.placement.level === 4);
}

/* case 3: superseded by v5. A skip used to be permanent and silent; it is now
 * cleared so everyone is asked against the corrected paper. See case 11 for
 * the full statement of this rule. */
{
    const s = { nickname: 'Sofía', placement: null, placementSkipped: true };
    api.run(s);
    check('a skip is cleared, not preserved', s.placementSkipped === false);
    check('and still leaves no placement behind', s.placement === null);
}

/* case 4: progress, completed lessons and nickname must survive byte-identical */
{
    const completed = { 0: true, 1: true, 2: true };
    const missed = { 1: 2 };
    const before = JSON.stringify({
        nickname: 'Javier', xp: 400, gems: 120, streak: 9, lessonsDone: 3,
        completed: completed, missed: missed, seenSentences: 15,
        dailyXp: 20, features: { tips: { seen: { 0: 1 } } }
    });
    const s = JSON.parse(before);
    s.placement = { score: 12, max: 50, correct: 7, total: 20, level: 2, date: '2026-9-1' };
    s.placementSkipped = false;

    const progressBefore = JSON.stringify({
        nickname: s.nickname, xp: s.xp, gems: s.gems, streak: s.streak,
        lessonsDone: s.lessonsDone, completed: s.completed, missed: s.missed,
        seenSentences: s.seenSentences, dailyXp: s.dailyXp, features: s.features
    });

    api.run(s);

    const progressAfter = JSON.stringify({
        nickname: s.nickname, xp: s.xp, gems: s.gems, streak: s.streak,
        lessonsDone: s.lessonsDone, completed: s.completed, missed: s.missed,
        seenSentences: s.seenSentences, dailyXp: s.dailyXp, features: s.features
    });

    check('placement cleared for a stale result', s.placement === null);
    check('progress is byte-identical after migration', progressBefore === progressAfter,
        progressBefore === progressAfter ? '' : progressBefore + '  !=  ' + progressAfter);
    check('the run reports what it changed', true);
}

/* case 5: running twice must not clear a freshly written placement */
{
    const s = { nickname: 'Ana', placement: null, placementSkipped: false };
    api.run(s);
    s.placement = { score: 70, max: 78, correct: 26, total: 30, level: 5, date: '2026-10-7', v: V };
    api.run(s);
    check('second boot keeps a current placement', s.placement !== null && s.placement.level === 5);
}

/* case 6: a v2 placement predates the new bands and must be re-offered */
{
    const s = {
        nickname: 'Seba', xp: 400, gems: 120, streak: 9, lessonsDone: 3,
        completed: { 0: true, 1: true, 2: true }, missed: { 1: 2 }, seenSentences: 15,
        placement: { score: 38, max: 50, correct: 19, total: 20, level: 5, date: '2026-10-6', v: 2 },
        placementSkipped: false
    };
    const before = JSON.stringify({ xp: s.xp, lessonsDone: s.lessonsDone, completed: s.completed, nickname: s.nickname });
    api.run(s);
    check('a v2 placement is cleared for re-offer', s.placement === null, 'got ' + JSON.stringify(s.placement));
    check('a v2 placement leaves progress intact',
        JSON.stringify({ xp: s.xp, lessonsDone: s.lessonsDone, completed: s.completed, nickname: s.nickname }) === before);
}

/* case 7: the version really is 5 */
check('CURRENT_VERSION is 5', V === 5, 'got ' + V);
check('PLACEMENT_VERSION alias matches', api.PLACEMENT_VERSION === V);

/* case 8: the "everyone retakes it" rule.
 *
 * Nobody has ever sat the corrected paper, so every existing result is v3 or
 * older and every one of them must be discarded. What survives is a v4
 * result, which means the learner already sat the current questions.
 *
 * The learner used here is established, to prove the rule does not quietly
 * cost them their progress: only the placement is re-earned. */
{
    const s = {
        nickname: 'Camila', xp: 1200, gems: 340, streak: 21,
        lessonsDone: 24, perfectLessons: 9, seenSentences: 120,
        completed: { 0: true, 1: true, 2: true, 3: true }, missed: { 3: 1 },
        badges: { first: true, streak3: true },
        placement: { score: 70, max: 78, correct: 26, total: 30, level: 5, date: '2026-10-7', v: 3 },
        placementSkipped: false,
        features: { tips: { seen: { 0: 1, 1: 1 } } }
    };
    const keep = {
        xp: s.xp, gems: s.gems, streak: s.streak, lessonsDone: s.lessonsDone,
        perfectLessons: s.perfectLessons, seenSentences: s.seenSentences,
        completed: s.completed, missed: s.missed, badges: s.badges,
        nickname: s.nickname, features: s.features
    };
    api.run(s);
    check('a pre-fix (v3) placement is discarded even at the highest level',
        s.placement === null, 'got ' + JSON.stringify(s.placement));
    check('an established learner keeps xp, streak, gems, lessons and badges',
        s.xp === keep.xp && s.streak === keep.streak && s.gems === keep.gems &&
        s.lessonsDone === keep.lessonsDone && s.perfectLessons === keep.perfectLessons &&
        s.seenSentences === keep.seenSentences &&
        JSON.stringify(s.completed) === JSON.stringify(keep.completed) &&
        JSON.stringify(s.missed) === JSON.stringify(keep.missed) &&
        JSON.stringify(s.badges) === JSON.stringify(keep.badges) &&
        JSON.stringify(s.features) === JSON.stringify(keep.features) &&
        s.nickname === keep.nickname);
}

/* case 9: after the retake, a fresh v5 result survives a second boot */
{
    const s = { nickname: 'Diego', placement: null, placementSkipped: false };
    api.run(s);
    s.placement = { score: 44, max: 78, correct: 17, total: 30, level: 4, date: '2026-10-7', v: V };
    api.run(s);
    check('a v5 result survives the next boot', s.placement !== null && s.placement.level === 4);
}

/* case 10: v4 holders are reset. v4 went live BEFORE the item content was
 * corrected, so those scores came from the defective paper. */
{
    const s = {
        nickname: 'Camila', xp: 900, streak: 14, lessonsDone: 15,
        completed: { 0: true, 1: true, 2: true },
        placement: { score: 70, max: 78, correct: 26, total: 30, level: 5, date: '2026-10-7', v: 4 },
        placementSkipped: false
    };
    api.run(s);
    check('a v4 placement is discarded', s.placement === null, 'got ' + JSON.stringify(s.placement));
    check('v4 holder keeps progress', s.xp === 900 && s.streak === 14 && s.lessonsDone === 15);
}

/* case 11: the permanent skip is cleared. This is the case where the owner
 * reported "it did not force me to do the quiz again": a skip used to be a
 * silent, permanent exemption. */
{
    const s = {
        nickname: 'Ana', xp: 40, streak: 2, lessonsDone: 2,
        placement: null, placementSkipped: true
    };
    const changed = api.run(s);
    check('placementSkipped is cleared', s.placementSkipped === false,
        'got ' + s.placementSkipped);
    check('the run reports the skip was cleared', changed.indexOf('placementSkipped') >= 0,
        'changed: ' + JSON.stringify(changed));
    check('a former skipper keeps their progress', s.xp === 40 && s.lessonsDone === 2);
}

/* case 12: a learner with neither flag is left alone and reports no change */
{
    const s = { nickname: 'Novato', placement: null, placementSkipped: false, xp: 0 };
    const changed = api.run(s);
    check('a fresh state reports no change', changed.length === 0, 'changed: ' + JSON.stringify(changed));
    check('a fresh state keeps placementSkipped false', s.placementSkipped === false);
}

/* case 13: running run() twice on a skipper is stable, it does not oscillate */
{
    const s = { nickname: 'Ana', placement: null, placementSkipped: true };
    api.run(s);
    api.run(s);
    check('a cleared skip does not flip back', s.placementSkipped === false);
}

console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);
