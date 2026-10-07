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
    var CURRENT_VERSION = 2;

    /*
     * v2: the placement test used to render the correct answer as the prompt
     * for Spanish-direction questions, so Q5 and Q18 were free points. Bands
     * are >=36 level 5, >=24 level 4, >=14 level 3, >=5 level 2, so up to 5
     * inflated points could place someone a full level too high — a strong-B2
     * learner scoring a true 34 landed in C1 content instead. Those results
     * cannot be trusted, and the test is one attempt with no reset anywhere in
     * the app, so the stored result is cleared and the test is offered again.
     *
     * progression, gems, streak and completed lessons are untouched.
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
