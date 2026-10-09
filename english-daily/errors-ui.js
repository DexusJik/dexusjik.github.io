/*
 * errors-ui.js — surfaces the error buffer on the path screen.
 *
 * Separated from errors.js so the capture path stays dependency-free and cannot
 * itself throw: errors.js only ever touches localStorage.
 *
 * The notice appears only when errors were recorded since the learner last
 * dismissed it. It is deliberately quiet: the app keeps working, because most
 * faults here are non-fatal, and a learner should not be blocked by a banner.
 */
(function () {
    'use strict';

    var DISMISS_KEY = 'igsg_errors_dismissed_at';

    function $(id) { return document.getElementById(id); }

    function dismissedAt() {
        try {
            var raw = window.localStorage.getItem(DISMISS_KEY);
            return raw ? parseInt(raw, 10) || 0 : 0;
        } catch (e) {
            return 0;
        }
    }

    function mount() {
        var box = $('error-notice');
        var text = $('error-notice-text');
        var details = $('error-details-btn');
        var dismiss = $('error-dismiss-btn');
        if (!box || !text || !window.DailyErrors) return;

        var list = window.DailyErrors.read();
        if (!list.length) { box.hidden = true; return; }

        /* only the newest matters for the summary line */
        var newest = list[list.length - 1];
        var sinceDismiss = list.filter(function (e) { return e.t > dismissedAt(); });

        if (!sinceDismiss.length) { box.hidden = true; return; }

        var when = new Date(newest.t);
        var whenText = when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        text.textContent = sinceDismiss.length === 1
            ? 'Ocurrió un problema a las ' + whenText + '. Tu progreso está a salvo.'
            : 'Ocurrieron ' + sinceDismiss.length + ' problemas, el último a las ' + whenText +
              '. Tu progreso está a salvo.';

        box.hidden = false;

        if (details) {
            details.addEventListener('click', function () {
                window.DailyErrors.panel();
            });
        }

        if (dismiss) {
            dismiss.addEventListener('click', function () {
                try {
                    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
                } catch (e) { /* private mode: the notice will show again */ }
                box.hidden = true;
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

    /* Re-check after each exercise, so an error raised during a lesson is
       reported when the learner is back on the path screen. This uses the real
       event name; there is no 'screen' event. */
    if (window.DailyGame && window.DailyGame.on) {
        window.DailyGame.on('sessionFinish', function () {
            setTimeout(mount, 0);
        });
        window.DailyGame.on('pathRender', function () {
            setTimeout(mount, 0);
        });
    }
})();
