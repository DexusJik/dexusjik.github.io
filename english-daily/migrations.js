/*
 * migrations.js — additive upgrades for saved state.
 *
 * Pure functions over a state object. Runs once on boot, before anything
 * reads the fields it touches.
 *
 * Two rules this file must never break:
 *   1. Never clear or rename learner progress. A migration only touches the
 *      keys it owns.
 *   2. Never punish a deliberate choice. If a learner skipped the placement
 *      test, no migration may nag them about it later.
 */
(function (root) {
    'use strict';

    /*
     * Bump when a migration below changes meaning. Each saved record carries
     * the version it was written under; anything older gets upgraded.
     */
    var CURRENT_VERSION = 3;

    /*
     * v2: the placement test used to render the correct answer as the prompt
     * for Spanish-direction questions, so Q5 and Q18 were free points. Up to 5
     * inflated points could place someone a full level too high — a strong-B2
     * learner scoring a true 34 landed in C1 content instead. Those results
     * cannot be trusted, and the test is one attempt with no reset anywhere in
     * the app, so the stored result is cleared and the test is offered again.
     *
     * progression, gems, streak and completed lessons are untouched.
     *
     * v3: two changes made a v2 score mean something different, so a v2
     * result is as stale as an unstamped one.
     *   - the test grew from 20 questions / 50 points to 30 / 78, and
     *   - the cut bands moved, most importantly level 3 from 14 to 34.
     * A learner placed at B2 under the old bands may well belong in C1, and
     * one placed at C1 under the old bands may not. Both are re-offered the
     * test once rather than left with a level the current scoring would not
     * produce.
     */
    function migratePlacement(state) {
        if (!state.placement) return false;
        if (state.placement.v === CURRENT_VERSION) return false;
        state.placement = null;
        return true;
    }

    function run(state) {
        var changed = [];
        if (migratePlacement(state)) changed.push('placement');
        return changed;
    }

    var api = {
        CURRENT_VERSION: CURRENT_VERSION,
        PLACEMENT_VERSION: CURRENT_VERSION,
        run: run,
        migratePlacement: migratePlacement
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.DailyMigrations = api;
})(typeof window !== 'undefined' ? window : this);
