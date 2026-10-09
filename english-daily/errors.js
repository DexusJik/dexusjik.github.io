/*
 * errors.js — last-resort error capture.
 *
 * WHY
 * ---
 * The app has 6 `console.error` call sites, all of which need the console open
 * to be useful. A fault on a learner's phone is currently invisible to both of
 * us. That matters more here than in most apps: the state is a learner's
 * accumulated progress, and a failure mid-save or mid-migration is exactly the
 * kind of bug that destroys work silently.
 *
 * WHAT IT DOES, AND WHY NOT MORE
 * ------------------------------
 * There is no server to report to, and adding telemetry would mean a third-party
 * script, which the CSP (`script-src 'self'`) deliberately forbids and which
 * would leak learner behaviour to someone else. So this does NOT phone home.
 * It buffers the last N errors in localStorage and shows them on demand.
 *
 * That gives you the diagnostic value of a remote reporter with no third party
 * and no data leaving the device: the learner can open one panel and copy the
 * text.
 *
 * The buffer is deliberately capped and bounded by age. Progress lives in the
 * same storage, so an unbounded log here would eventually evict real state.
 */
(function () {
    'use strict';

    var KEY = 'igsg_errors_v1';
    var MAX = 20;
    var MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

    function isFresh(entry) {
        return entry && entry.t > Date.now() - MAX_AGE_MS;
    }

    /* stale entries are filtered on READ as well as on write, so a learner who
       never triggers a new error does not get month-old noise in the panel */
    function read() {
        try {
            var raw = window.localStorage.getItem(KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(isFresh);
        } catch (e) {
            return [];
        }
    }

    function write(list) {
        try {
            window.localStorage.setItem(KEY, JSON.stringify(list));
        } catch (e) {
            /* storage full or blocked: never let logging break the app */
        }
    }

    function record(entry) {
        var list = read().filter(isFresh);

        list.push(entry);
        if (list.length > MAX) list = list.slice(list.length - MAX);

        write(list);
    }

    function describe(value) {
        if (!value) return 'unknown';
        if (value.message) return String(value.message);
        try { return String(value); } catch (e) { return 'unprintable'; }
    }

    window.addEventListener('error', function (event) {
        /*
         * Skip resource-load failures. A capture-phase 'error' listener also
         * fires for a failed <img>, <script> or <link>, where both event.error
         * and event.message are undefined, so describe() records the literal
         * string "unknown". A missing font or avatar would record one "unknown"
         * per request and evict 20 genuine faults. Only real JS errors have
         * event.error or event.message, and only they name a line and column.
         */
        if (!event.error && !event.message) return;
        if (event.target && event.target !== window && event.target.tagName) return;

        record({
            t: Date.now(),
            kind: 'error',
            msg: describe(event.error || event.message),
            src: event.filename ? String(event.filename).split('/').pop() : '',
            line: event.lineno || 0,
            col: event.colno || 0,
            where: 'at ' + (window.location.pathname || '/'),
        });
    }, true);

    window.addEventListener('unhandledrejection', function (event) {
        record({
            t: Date.now(),
            kind: 'rejection',
            msg: describe(event.reason),
            where: 'at ' + (window.location.pathname || '/'),
        });
    });

    /*
     * A panel for reading the buffer. Not auto-shown: a learner who hits a
     * non-fatal bug should keep using the app, and a banner on every load would
     * train people to ignore it.
     */
    function panel() {
        var list = read();
        if (!list.length) {
            window.alert('No se han registrado errores.');
            return;
        }
        var lines = list.map(function (e) {
            var when = new Date(e.t).toLocaleString();
            var where = e.src ? ' (' + e.src + ':' + (e.line || 0) + ')' : '';
            return when + '  [' + e.kind + '] ' + e.msg + where;
        });
        window.alert('Errores registrados (' + list.length + '):\n\n' + lines.join('\n\n'));
    }

    function clear() {
        write([]);
    }

    window.DailyErrors = {
        record: record,
        read: read,
        panel: panel,
        clear: clear
    };
})();