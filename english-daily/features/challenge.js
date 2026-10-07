/*
 * features/challenge.js — Desafío del día
 * Once-per-day 5-sentence review drawn from completed lessons, with a small
 * gem bonus. Selection is seeded by date + nickname so a reload gives the
 * same five sentences all day.
 */
(function () {
    'use strict';

    var G = window.DailyGame;
    if (!G) return;

    var NAME = 'challenge';
    var TITLE = 'Desafío del día';
    var SIZE = 5;
    var MISSED_SLOTS = 2;
    var TYPES = ['listen', 'multipleChoice', 'spanishToEnglish', 'translate', 'wordBank'];
    var GEMS_GOOD = 5;
    var GEMS_PERFECT = 8;

    function hashString(str) {
        var h = 2166136261;
        for (var i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }

    function mulberry32(seed) {
        var a = seed >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) >>> 0;
            var t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function seededShuffle(arr, rand) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(rand() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* 'YYYY-M-D' keys are not ISO, so parse the parts instead of new Date(key) */
    function dayNumber(key) {
        var p = String(key || '').split('-');
        if (p.length !== 3) return NaN;
        var d = new Date(+p[0], +p[1] - 1, +p[2]);
        return Math.round(d.getTime() / 86400000 - d.getTimezoneOffset() / 1440);
    }

    function dayDiff(a, b) {
        var n = dayNumber(b) - dayNumber(a);
        if (isFinite(n)) return n;
        var fallback = G.daysBetween(a, b);
        return isFinite(fallback) ? fallback : NaN;
    }

    function completedLessons(state, lessons) {
        return Object.keys(state.completed || {})
            .filter(function (k) { return state.completed[k]; })
            .map(Number)
            .filter(function (i) { return i >= 0 && lessons[i] && lessons[i].sentences; })
            .sort(function (a, b) { return a - b; });
    }

    function idsFor(indices, lessons) {
        var out = [];
        indices.forEach(function (li) {
            lessons[li].sentences.forEach(function (s, si) {
                if (s && s.en && s.es) out.push(li + ':' + si);
            });
        });
        return out;
    }

    /* pure: returns sentence ids ('lesson:sentence'), deterministic per date + name */
    function select(state, dateKey, lessons) {
        var done = completedLessons(state, lessons);
        if (done.length < 2) return [];
        var rand = mulberry32(hashString(dateKey + '|' + (state.nickname || '')));
        var missed = state.missed || {};
        var weak = done.filter(function (i) { return missed[i] > 0; });

        var picked = [];
        seededShuffle(idsFor(weak, lessons), rand).forEach(function (id) {
            if (picked.length < MISSED_SLOTS) picked.push(id);
        });
        seededShuffle(idsFor(done, lessons), rand).forEach(function (id) {
            if (picked.length < SIZE && picked.indexOf(id) === -1) picked.push(id);
        });
        return picked;
    }

    function sentenceFor(id, lessons) {
        var p = id.split(':');
        var lesson = lessons[+p[0]];
        return lesson && lesson.sentences[+p[1]];
    }

    function buildItems(ids, lessons) {
        return ids.map(function (id, i) {
            return { sentence: sentenceFor(id, lessons), type: TYPES[i % TYPES.length], tag: 'challenge' };
        }).filter(function (it) { return !!it.sentence; });
    }

    function eligible(state) {
        return Object.keys(state.completed || {}).length >= 2;
    }

    function doneToday(store) {
        return store.date === G.todayKey();
    }

    function finish(summary) {
        var store = G.store(NAME);
        var state = G.state;
        var today = G.todayKey();
        if (store.date === today) return;

        var gems = 0;
        if (summary.total >= SIZE && summary.correct === summary.total) gems = GEMS_PERFECT;
        else if (summary.correct >= 4) gems = GEMS_GOOD;

        var streak = (store.date && dayDiff(store.date, today) === 1) ? (store.streak || 0) + 1 : 1;

        store.date = today;
        store.correct = summary.correct;
        store.total = summary.total;
        store.gems = gems;
        store.streak = streak;

        if (gems > 0) state.gems += gems;
        G.save();
        G.refresh();
        if (gems > 0) G.toast('💎 +' + gems + ' gemas por el desafío');
    }

    function start() {
        var state = G.state;
        if (!eligible(state) || doneToday(G.store(NAME))) return;
        var items = buildItems(select(state, G.todayKey(), G.lessons), G.lessons);
        if (!items.length) return;
        G.startCustomSession({ title: TITLE, items: items, onFinish: finish });
    }

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }

    function render() {
        var slot = G.slot('top');
        if (!slot) return;
        var card = document.getElementById('dc-card');
        var state = G.state;

        if (!eligible(state)) {
            if (card && card.parentNode) card.parentNode.removeChild(card);
            return;
        }

        if (!card) {
            card = el('section');
            card.id = 'dc-card';
            card.setAttribute('aria-label', TITLE);
            slot.appendChild(card);
        }
        card.innerHTML = '';

        var store = G.store(NAME);
        var done = doneToday(store);
        card.className = 'dc-card' + (done ? ' dc-card--done' : '');

        var icon = el('span', 'dc-icon', done ? '✓' : '⚡');
        icon.setAttribute('aria-hidden', 'true');
        card.appendChild(icon);

        var copy = el('div', 'dc-copy');
        if (done) {
            var line = 'Desafío completado · ' + store.correct + '/' + store.total;
            if (store.gems > 0) line += ' · +' + store.gems + '\u00a0💎';
            copy.appendChild(el('p', 'dc-title', line));
            copy.appendChild(el('p', 'dc-sub', 'Vuelve mañana'));
            if (store.streak >= 2) {
                copy.appendChild(el('p', 'dc-streak', '🔥 ' + store.streak + ' días seguidos'));
            }
        } else {
            copy.appendChild(el('p', 'dc-title', TITLE));
            copy.appendChild(el('p', 'dc-sub', '5 oraciones de lo que ya viste · hasta 8\u00a0💎'));
        }
        card.appendChild(copy);

        if (!done) {
            var btn = el('button', 'btn btn-secondary dc-play', 'Jugar');
            btn.type = 'button';
            btn.addEventListener('click', start);
            card.appendChild(btn);
        }
    }

    G.on('pathRender', function () {
        try { render(); } catch (e) {
            if (window.console && console.error) console.error('[challenge] render failed', e);
        }
    });

    /* read-only hook for tests */
    window.DailyChallenge = { select: select, dayDiff: dayDiff, types: TYPES.slice() };
})();
