/*
 * features/review.js — spaced repetition ("Repaso") for 1 Oración al Día.
 * Leitner boxes 1-5. Every graded answer, from any session, moves a sentence
 * between boxes; due sentences are offered on the path as a review session.
 */
(function () {
    'use strict';

    var G = window.DailyGame;
    if (!G) return;

    var STORE_KEY = 'review';
    var INTERVAL_DAYS = [0, 0, 1, 3, 7, 21];
    var MAX_BOX = 5;
    var NEW_CORRECT_BOX = 3;
    var SESSION_SIZE = 10;
    var REVIEW_TAG = 'srs-review';
    var RECOGNITION_TYPES = ['multipleChoice', 'spanishToEnglish', 'listen'];
    var ALL_TYPES = ['multipleChoice', 'spanishToEnglish', 'listen', 'wordBank', 'translate'];

    /* ---------- dates ---------- */

    /* todayKey() is unpadded ('2026-10-9'), so it cannot be compared as text.
       All stored keys are zero-padded 'YYYY-MM-DD'. */
    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    function formatDate(d) {
        return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    }

    function parseKey(key) {
        var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(key));
        if (!m) return null;
        return { y: +m[1], m: +m[2], d: +m[3] };
    }

    function dayNumber(key) {
        var p = parseKey(key);
        if (!p) return NaN;
        return Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86400000);
    }

    function addDays(key, n) {
        var p = parseKey(key);
        return formatDate(new Date(p.y, p.m - 1, p.d + n));
    }

    function today() { return formatDate(new Date()); }

    /* ---------- sentence ids ---------- */

    var lessons = G.lessons || [];
    var sentenceById = {};
    var idByEnglish = {};
    var knownObjects = [];
    var knownIds = [];

    lessons.forEach(function (lesson, li) {
        (lesson.sentences || []).forEach(function (s, si) {
            var id = li + ':' + si;
            sentenceById[id] = s;
            knownObjects.push(s);
            knownIds.push(id);
            if (s && typeof s.en === 'string' && !idByEnglish[s.en]) idByEnglish[s.en] = id;
        });
    });

    function idOf(sentence) {
        if (!sentence) return null;
        var at = knownObjects.indexOf(sentence);
        if (at >= 0) return knownIds[at];
        if (typeof sentence.en === 'string' && idByEnglish[sentence.en]) return idByEnglish[sentence.en];
        return null;
    }

    /* ---------- store ---------- */

    function cardsStore() {
        var s = G.store(STORE_KEY);
        if (s.v !== 1 || !s.cards || typeof s.cards !== 'object') {
            s.v = 1;
            s.cards = {};
        }
        return s.cards;
    }

    /* tolerates hand-edited or older data: bad boxes clamp, bad dates become due today */
    function readCard(raw) {
        if (!raw || typeof raw.length !== 'number') return null;
        var box = Math.round(+raw[0]);
        if (!(box >= 1)) box = 1;
        if (box > MAX_BOX) box = MAX_BOX;
        var p = parseKey(raw[1]);
        var due = p ? p.y + '-' + pad2(p.m) + '-' + pad2(p.d) : today();
        return { box: box, due: due };
    }

    function isDue(card, todayKey) {
        return dayNumber(card.due) <= dayNumber(todayKey);
    }

    /* ---------- scheduling ---------- */

    function placeCard(cards, id, box, todayKey) {
        cards[id] = [box, addDays(todayKey, INTERVAL_DAYS[box])];
    }

    function applyAnswer(id, ok, inReview) {
        var cards = cardsStore();
        var t = today();
        var cur = readCard(cards[id]);

        if (!ok) {
            placeCard(cards, id, 1, t);
        } else if (!cur) {
            placeCard(cards, id, NEW_CORRECT_BOX, t);
        } else if (inReview) {
            placeCard(cards, id, Math.min(MAX_BOX, cur.box + 1), t);
        } else {
            return;
        }
    }

    function onAnswer(e) {
        if (!e || !e.item || e.item.graded === false) return;
        var id = idOf(e.sentence || e.item.sentence);
        if (!id) return;
        applyAnswer(id, !!e.ok, e.item.tag === REVIEW_TAG);
        G.save();
    }

    /* ---------- queries ---------- */

    function trackedCards() {
        var cards = cardsStore();
        var list = [];
        Object.keys(cards).forEach(function (id) {
            if (!sentenceById[id]) return;
            var c = readCard(cards[id]);
            if (c) list.push({ id: id, box: c.box, due: c.due });
        });
        return list;
    }

    function summarize() {
        var t = today();
        var all = trackedCards();
        var due = all.filter(function (c) { return isDue(c, t); });
        var next = null;
        all.forEach(function (c) {
            if (isDue(c, t)) return;
            if (next === null || dayNumber(c.due) < dayNumber(next)) next = c.due;
        });
        return {
            total: all.length,
            due: due,
            nextInDays: next === null ? null : dayNumber(next) - dayNumber(t)
        };
    }

    function byUrgency(a, b) {
        var da = dayNumber(a.due);
        var db = dayNumber(b.due);
        if (da !== db) return da - db;
        if (a.box !== b.box) return a.box - b.box;
        var pa = a.id.split(':');
        var pb = b.id.split(':');
        if (+pa[0] !== +pb[0]) return +pa[0] - +pb[0];
        return +pa[1] - +pb[1];
    }

    function buildItems(dueCards) {
        return dueCards.slice().sort(byUrgency).slice(0, SESSION_SIZE).map(function (c, i) {
            var pool = c.box === 1 ? RECOGNITION_TYPES : ALL_TYPES;
            return {
                sentence: sentenceById[c.id],
                type: pool[i % pool.length],
                tag: REVIEW_TAG
            };
        });
    }

    /* ---------- copy ---------- */

    function dueText(n) {
        return n === 1 ? '1 frase para repasar hoy' : n + ' frases para repasar hoy';
    }

    function nextText(days) {
        if (days === null || days <= 0) return 'hoy';
        return days === 1 ? 'mañana' : 'en ' + days + ' días';
    }

    /* ---------- session ---------- */

    function startReview() {
        var items = buildItems(summarize().due);
        if (!items.length) {
            render();
            return;
        }
        var total = items.length;
        G.startCustomSession({
            title: 'Repaso',
            items: items,
            onFinish: function (summary) {
                G.toast('🔁 Repaso: ' + summary.correct + ' de ' + total + ' correctas');
            }
        });
    }

    /* ---------- path card ---------- */

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function render() {
        var slot = G.slot('top');
        if (!slot) return;

        var card = document.getElementById('srs-card');
        var info = summarize();

        if (!info.total) {
            if (card && card.parentNode) card.parentNode.removeChild(card);
            return;
        }

        if (!card) {
            card = el('section');
            card.id = 'srs-card';
        }
        if (card.parentNode !== slot) slot.appendChild(card);
        card.textContent = '';

        if (info.due.length) {
            card.className = 'srs-card srs-card--due';
            card.setAttribute('aria-label', 'Repaso');

            var copy = el('div', 'srs-copy');
            var title = el('p', 'srs-title');
            title.appendChild(el('span', 'srs-icon', '🔁'));
            title.appendChild(document.createTextNode(' Repaso'));
            copy.appendChild(title);
            copy.appendChild(el('p', 'srs-sub', dueText(info.due.length)));

            var btn = el('button', 'btn btn-secondary srs-btn', 'Repasar');
            btn.type = 'button';
            btn.addEventListener('click', startReview);

            card.appendChild(copy);
            card.appendChild(btn);
        } else {
            card.className = 'srs-card srs-card--calm';
            card.setAttribute('aria-label', 'Repaso');
            card.appendChild(el('span', 'srs-icon', '🔁'));
            card.appendChild(el('p', 'srs-calm', 'Repaso al día · próximo: ' + nextText(info.nextInDays)));
        }
    }

    G.on('answer', onAnswer);
    G.on('pathRender', render);
})();
