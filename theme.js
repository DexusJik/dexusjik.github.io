/*
 * theme.js — resolves the colour-scheme preference and applies it.
 *
 * Loaded synchronously in <head>, after the stylesheet and BEFORE paint, so a
 * dark-mode visitor never sees a flash of the light theme. That is why it is
 * not deferred and why it must stay tiny.
 *
 * It is a plain external file rather than an inline <script> because every page
 * ships `script-src 'self'`; an inline script would be blocked.
 *
 * The preference lives in its own key, `theme-pref`, NOT inside the app's
 * `igsg_daily_v1` state. Three reasons: a display preference is not learning
 * progress; a corrupt app state must not be able to reset someone's theme; and
 * sharing the key means a learner who picks Dark here gets Dark on the marketing
 * site too. It also means no migration is needed and no version bump.
 *
 * Shared by the main site and the app. Both define their own tokens; only the
 * resolution logic is common.
 */
(function () {
    'use strict';

    var KEY = 'theme-pref';
    var ORDER = ['auto', 'light', 'dark'];
    var META = { light: '#fbf9f4', dark: '#0f172a' };

    function stored() {
        try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function write(value) {
        try { window.localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
    }

    /* anything unrecognised, missing or corrupt falls back to auto */
    function preference() {
        var v = stored();
        return ORDER.indexOf(v) >= 0 ? v : 'auto';
    }

    function osPrefersDark() {
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    function resolve(pref) {
        if (pref === 'dark') return 'dark';
        if (pref === 'light') return 'light';
        return osPrefersDark() ? 'dark' : 'light';
    }

    var current = resolve(preference());

    function apply(value) {
        current = value;
        var root = document.documentElement;
        root.setAttribute('data-theme', current);

        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', META[current]);
    }

    /* before-paint bootstrap: no FOUC, no toggle yet */
    apply(current);

    function next() {
        return ORDER[(ORDER.indexOf(preference()) + 1) % ORDER.length];
    }

    var LABEL = {
        auto: 'automático',
        light: 'claro',
        dark: 'oscuro'
    };
    var ICON = { auto: '🌗', light: '☀️', dark: '🌙' };

    function sync() {
        apply(resolve(preference()));
    }

    /* the toggle is injected per page, so this only runs if it exists */
    function mountToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        function label() {
            var p = preference();
            return 'Tema: ' + LABEL[p] + '. Cambiar a ' + LABEL[next()];
        }

        function paint() {
            btn.textContent = ICON[preference()];
            btn.setAttribute('aria-label', label());
            btn.title = label();
        }

        btn.addEventListener('click', function () {
            write(next());
            sync();
            paint();
        });

        /* DailyTheme.set() is used by the validators and tests, which change the
           preference without going through the click path */
        btn.addEventListener('repaint', paint);

        paint();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountToggle);
    } else {
        mountToggle();
    }

    /*
     * Follow the OS only while the preference is auto. Without the guard, a
     * learner who deliberately chose Light would have it overridden at sunset.
     */
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () {
            if (preference() !== 'auto') return;
            sync();
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    window.DailyTheme = {
        resolve: resolve,
        preference: preference,
        current: function () { return current; },
        set: function (value) {
            if (ORDER.indexOf(value) < 0) value = 'auto';
            write(value);
            sync();
            var btn = document.getElementById('theme-toggle');
            if (btn) btn.dispatchEvent(new Event('repaint'));
            return current;
        },
        cycle: next
    };
})();