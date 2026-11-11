/*
 * profile.js - pure learner-profile rules: goals, skills, weekly targets and
 * streak-repair eligibility.
 *
 * No DOM, no storage, no dates read from the clock. Everything is passed in,
 * which is why tools/test-profile.js can test it directly in Node.
 *
 * Load order: sentences.js, placement.js, profile.js, game.js
 */
(function () {
    'use strict';

    var GOAL_PRESETS = [20, 50, 100];
    var DEFAULT_GOAL = 50;
    var WEEKLY_DAYS = 5;          /* a weekly goal is five study days, not seven */
    var REPAIR_COST = 20;
    var REPAIR_MIN_STREAK = 2;

    /*
     * Six skills instead of one global score. Types are the exercise builders
     * in game.js; `fillBlank` belongs to the optional feature but is listed so
     * its answers still feed the grammar profile.
     */
    var SKILLS = [
        { id: 'listening', name: 'Escuchar', icon: '🎧', types: ['listen'] },
        { id: 'reading', name: 'Leer', icon: '📖', types: ['multipleChoice'] },
        { id: 'translation', name: 'Traducir', icon: '🔁', types: ['spanishToEnglish'] },
        { id: 'writing', name: 'Escribir', icon: '✍️', types: ['translate'] },
        { id: 'grammar', name: 'Gramática', icon: '🧩', types: ['wordBank', 'fillBlank'] },
        { id: 'speaking', name: 'Hablar', icon: '🗣️', types: ['speakBack'] }
    ];

    var SKILL_BY_TYPE = {};
    SKILLS.forEach(function (skill) {
        skill.types.forEach(function (type) { SKILL_BY_TYPE[type] = skill.id; });
    });

    var SKILL_BY_ID = {};
    SKILLS.forEach(function (skill) { SKILL_BY_ID[skill.id] = skill; });

    /*
     * Goal-based recommendations. Indices are 0-based lesson positions in
     * sentences.js. The path itself stays linear and prerequisite-safe; these
     * are optional detours inside the lessons already unlocked.
     */
    var FOCUS = {
        general: { id: 'general', name: 'General', icon: '🌍', lessons: [] },
        work: {
            id: 'work', name: 'Trabajo', icon: '💼',
            lessons: [13, 22, 24, 39, 40, 41, 43, 52, 56, 57, 67]
        },
        travel: {
            id: 'travel', name: 'Viajes', icon: '✈️',
            lessons: [6, 8, 11, 12, 21, 25, 26, 32, 36, 46, 58]
        },
        daily: {
            id: 'daily', name: 'Día a día', icon: '🏠',
            lessons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 15, 16, 18, 19, 23, 25, 41, 68, 70]
        },
        study: {
            id: 'study', name: 'Estudios', icon: '🎓',
            lessons: [2, 13, 42, 49, 50, 54, 55, 60, 61, 62, 63, 64, 65, 66, 69, 70]
        }
    };

    function goal(value) {
        var n = Number(value);
        return GOAL_PRESETS.indexOf(n) >= 0 ? n : DEFAULT_GOAL;
    }

    function weeklyTarget(value) {
        return goal(value) * WEEKLY_DAYS;
    }

    /* Monday of the week containing `date`, in the same unpadded form as
       todayKey(). Sunday belongs to the week that started six days earlier. */
    function weekStartKey(date) {
        var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var offset = (d.getDay() + 6) % 7;
        d.setDate(d.getDate() - offset);
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function skillForType(type) {
        return SKILL_BY_TYPE[type] || null;
    }

    function skill(id) {
        return SKILL_BY_ID[id] || null;
    }

    function skills() {
        return SKILLS.slice();
    }

    /* Typing-free mode removes the only free-text exercise without changing
       what the sentence is teaching. */
    function comfortableType(type, typingFree) {
        if (typingFree && type === 'translate') return 'wordBank';
        return type;
    }

    /*
     * Difficulty adaptation from real answers. A learner above 85% after ten
     * attempts gets one level up; below 50% after six gets one level down.
     * Small samples stay at the current level so one lucky lesson cannot move
     * the whole practice set.
     */
    function targetLevel(level, correct, total) {
        var current = Math.min(5, Math.max(1, Number(level) || 1));
        var c = Number(correct) || 0;
        var t = Number(total) || 0;
        if (t >= 10 && c / t >= 0.85 && current < 5) return current + 1;
        if (t >= 6 && c / t < 0.5 && current > 1) return current - 1;
        return current;
    }

    /* A streak can be repaired only when exactly one day was missed, the lost
       streak was worth keeping, and the learner has not started a new one. */
    function canRepair(streak, lastStreak, gapDays) {
        return Number(streak) === 0 &&
            Number(lastStreak) >= REPAIR_MIN_STREAK &&
            Number(gapDays) === 2;
    }

    function focus(id) {
        return FOCUS[id] || FOCUS.general;
    }

    function focusIds() {
        return Object.keys(FOCUS);
    }

    window.DailyProfile = {
        GOAL_PRESETS: GOAL_PRESETS.slice(),
        DEFAULT_GOAL: DEFAULT_GOAL,
        WEEKLY_DAYS: WEEKLY_DAYS,
        REPAIR_COST: REPAIR_COST,
        REPAIR_MIN_STREAK: REPAIR_MIN_STREAK,
        goal: goal,
        weeklyTarget: weeklyTarget,
        weekStartKey: weekStartKey,
        skills: skills,
        skill: skill,
        skillForType: skillForType,
        comfortableType: comfortableType,
        targetLevel: targetLevel,
        canRepair: canRepair,
        focus: focus,
        focusIds: focusIds
    };
})();
