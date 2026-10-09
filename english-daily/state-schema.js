/*
 * state-schema.js — validates and repairs the saved learner state.
 *
 * WHY THIS EXISTS
 * ---------------
 * game.js `load()` merges saved values over `defaultState()` by key whitelist:
 *
 *     Object.keys(base).forEach(function (k) {
 *         if (saved[k] !== undefined && saved[k] !== null) base[k] = saved[k];
 *     });
 *
 * That protects against a MISSING key (it takes the default) and an UNKNOWN key
 * (it is ignored), but not against a key of the wrong TYPE. A hand-edited
 * `hearts: "5"`, a half-written `completed: []`, or a `nickname: {}` all pass
 * straight through into logic that then does arithmetic or `.length` on them.
 *
 * Learner progress is the product. Silently coercing a bad value must never mean
 * losing a good one, so every repair is either "use the default" or "keep what
 * is there", and anything unrecoverable is reported rather than thrown away.
 *
 * Nothing here mutates storage. game.js decides when to save.
 */
(function () {
    'use strict';

    /*
     * Per-field rules. `kind` drives the check:
     *   number   finite number, clamped to [min, max], integer where flagged
     *   string   string; `maxLen` truncates; `empty` says whether "" is valid
     *   bool     strictly true/false, else default
     *   date     string in YYYY-M-D form, or null
     *   map      plain object with optional numeric-or-true values
     *   list     array, optionally of objects
     *   placement null or a placement record
     */
    var RULES = {
        xp: { kind: 'number', min: 0, max: 9999999, int: true },
        gems: { kind: 'number', min: 0, max: 999999, int: true },
        streak: { kind: 'number', min: 0, max: 9999, int: true },
        lastStudyDate: { kind: 'date' },
        bestStreak: { kind: 'number', min: 0, max: 9999, int: true },
        streakFreeze: { kind: 'number', min: 0, max: 99, int: true },
        studyHistory: { kind: 'map' },
        dailyXp: { kind: 'number', min: 0, max: 100000, int: true },
        dailyXpDate: { kind: 'date' },
        lessonsDone: { kind: 'number', min: 0, max: 9999, int: true },
        perfectLessons: { kind: 'number', min: 0, max: 9999, int: true },
        seenSentences: { kind: 'number', min: 0, max: 99999, int: true },
        hearts: { kind: 'number', min: 0, max: 5, int: true },
        heartsTs: { kind: 'number', min: 0, max: 99999999999999, int: true },
        currentLesson: { kind: 'number', min: 0, max: 9999, int: true },
        completed: { kind: 'map' },
        missed: { kind: 'map' },
        badges: { kind: 'map' },
        nickname: { kind: 'string', maxLen: 24, empty: true },
        rivals: { kind: 'list' },
        placement: { kind: 'placement' },
        placementSkipped: { kind: 'bool' },
        dailyLessonDoneDate: { kind: 'date' },
        storageNoticeDismissed: { kind: 'bool' },
        features: { kind: 'map' },
    };

    function isPlainObject(v) {
        return v !== null && typeof v === 'object' && !Array.isArray(v);
    }

    /*
     * A date must round-trip. `2026-99-99` matches the digit-count pattern but
     * is not a date, and the streak logic compares these strings, so an
     * impossible date produces a bogus streak that never breaks.
     */
    function isRealDate(value) {
        if (!DATE_RE.test(value)) return false;
        var parts = value.split('-');
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10);
        var d = parseInt(parts[2], 10);
        if (m < 1 || m > 12 || d < 1 || d > 31) return false;
        var dt = new Date(Date.UTC(y, m - 1, d));
        return dt.getUTCFullYear() === y &&
            dt.getUTCMonth() === m - 1 &&
            dt.getUTCDate() === d;
    }

    var DATE_RE = /^\d{4}-\d{1,2}-\d{1,2}$/;

    function describe(v) {
        if (v === null) return 'null';
        if (Array.isArray(v)) return 'array';
        return typeof v;
    }

    /*
     * repair(raw, defaults) -> { state, repairs }
     * repairs is a list of human-readable strings, so game.js can surface
     * "we repaired your saved progress" instead of silently changing it.
     */
    function repair(raw, defaults) {
        var out = {};
        var repairs = [];

        /*
         * The whole saved blob may not be an object. A truncated write or a
         * half-restored backup can leave a bare string or array there, and
         * `Object.keys` over it yields string indices rather than fields, which
         * would smuggle them in as unknown keys below.
         */
        if (!isPlainObject(raw)) {
            if (raw !== undefined && raw !== null) {
                repairs.push('saved state was ' + describe(raw) + ', not an object; started fresh');
            }
            raw = {};
        }

        Object.keys(defaults).forEach(function (key) {
            var rule = RULES[key];
            var fallback = defaults[key];
            var value = raw[key];

            /* absent or null: the existing whitelist behaviour, take the default */
            if (value === undefined || value === null) {
                out[key] = fallback;
                return;
            }

            /* unknown key with no rule and no default: drop it */
            if (!rule) {
                out[key] = value;
                return;
            }

            switch (rule.kind) {
                case 'number': {
                    /*
                     * A boolean is NOT a number here. `Number(true)` is 1, so
                     * `streak: true` would silently become a 1-day streak and
                     * read as legitimate progress. Reset it instead.
                     */
                    if (typeof value === 'boolean') {
                        repairs.push(key + ': true/false is not a number, reset to ' + fallback);
                        out[key] = fallback;
                        return;
                    }

                    /*
                     * A blank or whitespace-only string is REJECTED, not
                     * coerced. `Number("")` is 0 and isFinite, so `hearts: ""`
                     * used to become 0 with the repair message suppressed by
                     * the trim() check on the line below. Nothing was
                     * reported, nothing was persisted, and the learner lost
                     * hearts on every single load.
                     */
                    if (typeof value === 'string' && value.trim() === '') {
                        repairs.push(key + ': was blank, reset to ' + fallback);
                        out[key] = fallback;
                        return;
                    }

                    var n = typeof value === 'number' ? value : Number(value);
                    if (typeof value === 'string' && isFinite(n)) {
                        repairs.push(key + ': read "' + value + '" as the number ' + n);
                    }
                    if (!isFinite(n)) {
                        repairs.push(key + ': ' + describe(value) + ' is not a number, reset to ' + fallback);
                        out[key] = fallback;
                        return;
                    }
                    if (rule.int) n = Math.round(n);
                    if (rule.min !== undefined && n < rule.min) {
                        repairs.push(key + ': ' + n + ' is below ' + rule.min + ', raised');
                        n = rule.min;
                    }
                    if (rule.max !== undefined && n > rule.max) {
                        repairs.push(key + ': ' + n + ' is above ' + rule.max + ', lowered');
                        n = rule.max;
                    }
                    out[key] = n;
                    return;
                }

                case 'string': {
                    if (typeof value !== 'string') {
                        repairs.push(key + ': ' + describe(value) + ' is not text, reset');
                        out[key] = fallback;
                        return;
                    }
                    var s = value.trim();
                    if (!rule.empty && s === '') {
                        repairs.push(key + ': empty text not allowed, reset');
                        out[key] = fallback;
                        return;
                    }
                    if (rule.maxLen && s.length > rule.maxLen) {
                        repairs.push(key + ': ' + s.length + ' characters is over ' + rule.maxLen + ', trimmed');
                        s = s.slice(0, rule.maxLen);
                    }
                    out[key] = s;
                    return;
                }

                case 'bool': {
                    if (value !== true && value !== false) {
                        repairs.push(key + ': ' + describe(value) + ' is not true/false, reset to ' + fallback);
                        out[key] = fallback;
                        return;
                    }
                    out[key] = value;
                    return;
                }

                case 'date': {
                    if (typeof value !== 'string' || !isRealDate(value)) {
                        repairs.push(key + ': ' + JSON.stringify(value) +
                            ' is not a real calendar date, reset to null');
                        out[key] = null;
                        return;
                    }
                    out[key] = value;
                    return;
                }

                case 'map': {
                    if (!isPlainObject(value)) {
                        repairs.push(key + ': ' + describe(value) + ' is not an object, reset to {}');
                        out[key] = {};
                        return;
                    }
                    out[key] = value;
                    return;
                }

                case 'list': {
                    if (!Array.isArray(value)) {
                        repairs.push(key + ': ' + describe(value) + ' is not an array, reset to []');
                        out[key] = [];
                        return;
                    }
                    out[key] = value;
                    return;
                }

                case 'placement': {
                    if (!isPlainObject(value)) {
                        repairs.push(key + ': ' + describe(value) + ' is not a placement, cleared');
                        out[key] = null;
                        return;
                    }
                    var score = Number(value.score);
                    var max = Number(value.max);
                    if (typeof value.score === 'string' && value.score.trim() !== '' && isFinite(score)) {
                        repairs.push('placement: score was text "' + value.score + '"');
                    }
                    if (typeof value.max === 'string' && value.max.trim() !== '' && isFinite(max)) {
                        repairs.push('placement: max was text "' + value.max + '"');
                    }
                    if (!isFinite(score) || !isFinite(max) || max <= 0 || score < 0) {
                        repairs.push('placement: score/max are not usable numbers, cleared');
                        out[key] = null;
                        return;
                    }
                    if (score > max) {
                        repairs.push('placement: score ' + score + ' exceeds max ' + max + ', clamped');
                        score = max;
                    }
                    var level = Number(value.level);
                    if (typeof value.level === 'string' && value.level.trim() !== '' && isFinite(level)) {
                        repairs.push('placement: level was text "' + value.level + '"');
                    }
                    if (!isFinite(level) || level < 1 || level > 5) {
                        repairs.push('placement: level is not 1-5, cleared so the test is re-offered');
                        out[key] = null;
                        return;
                    }
                    /*
                     * WRITE THE COERCED NUMBERS BACK. Validating score/max/level
                     * into local variables and then storing the original `value`
                     * let `"44"` survive into state as a string — the exact
                     * wrong-type leak this file exists to stop.
                     */
                    var fixed = Object.assign({}, value);
                    fixed.score = score;
                    fixed.max = max;
                    fixed.level = level;
                    out[key] = fixed;
                    return;
                }

                default:
                    out[key] = value;
            }
        });

        /*
         * Carry through forward-compatible keys the saved state has but these
         * rules do not describe, so a state written by a NEWER app version is not
         * silently downgraded. Keys that only exist because the blob was not an
         * object have already been excluded above.
         */
        Object.keys(raw).forEach(function (key) {
            /*
             * `key in defaults` walks the prototype chain, so '__proto__' would
             * test true and be treated as a known field. Compare own keys only.
             */
            if (Object.prototype.hasOwnProperty.call(defaults, key)) return;

            if (key === '__proto__') {
                /* a valid-looking identifier, but assigning it would rewrite
                   this object's prototype rather than add a field */
                repairs.push('dropped unusable key "' + key + '"');
                return;
            }
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
                repairs.push('dropped unusable key "' + key + '"');
                return;
            }
            out[key] = raw[key];
        });

        return { state: out, repairs: repairs };
    }

    window.DailyStateSchema = {
        repair: repair,
        rules: RULES,
    };
})();