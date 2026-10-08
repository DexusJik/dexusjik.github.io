/*
 * game.js — 1 Oración al Día
 * Duolingo-style daily English practice. 365 graded sentences.
 */
(function () {
    'use strict';

    /* ================= data ================= */

    var LESSONS = window.DAILY_LESSONS || [];
    var TOTAL_LESSONS = LESSONS.length;
    var XP_PER_SENTENCE = 2;
    var DAILY_GOAL_XP = 50;
    var MAX_HEARTS = 5;
    var HEART_REFILL_MS = 30 * 60 * 1000;

    var LEVEL_META = {
        1: { name: 'Nivel 1', label: 'A1 · Primeros pasos', emoji: '🌱' },
        2: { name: 'Nivel 2', label: 'A2 · Vida diaria', emoji: '🌿' },
        3: { name: 'Nivel 3', label: 'B1 · Mundo real', emoji: '🌳' },
        4: { name: 'Nivel 4', label: 'B2 · Matices', emoji: '🏔️' },
        5: { name: 'Nivel 5', label: 'C1 · Avanzado', emoji: '🚀' }
    };

    var BADGES = [
        { id: 'first', icon: '🌟', name: 'Primer día', test: function (s) { return s.lessonsDone >= 1; } },
        { id: 'streak3', icon: '🔥', name: 'Racha de 3', test: function (s) { return s.streak >= 3; } },
        { id: 'streak7', icon: '⚡', name: 'Racha de 7', test: function (s) { return s.streak >= 7; } },
        { id: 'streak30', icon: '💎', name: 'Racha de 30', test: function (s) { return s.streak >= 30; } },
        { id: 'xp100', icon: '💪', name: '100 XP', test: function (s) { return s.xp >= 100; } },
        { id: 'xp1000', icon: '👑', name: '1000 XP', test: function (s) { return s.xp >= 1000; } },
        { id: 'perfect', icon: '🎯', name: 'Lección perfecta', test: function (s) { return s.perfectLessons >= 1; } },
        { id: 'perfect5', icon: '🧠', name: '5 perfectas', test: function (s) { return s.perfectLessons >= 5; } },
        { id: 'sent50', icon: '📖', name: '50 oraciones', test: function (s) { return s.seenSentences >= 50; } },
        { id: 'sent150', icon: '📚', name: '150 oraciones', test: function (s) { return s.seenSentences >= 150; } },
        { id: 'sent365', icon: '🎓', name: 'Las 365', test: function (s) { return s.seenSentences >= 365; } },
        { id: 'allLessons', icon: '🏆', name: 'Ruta completa', test: function (s) { return s.lessonsDone >= TOTAL_LESSONS; } }
    ];

    /* ================= level ladder ================= */

    /*
     * XP ceiling is fixed: 365 sentences x XP_PER_SENTENCE.
     * These thresholds must sum to that ceiling so "Fluent" is
     * reachable exactly at 100% completion.
     */
    var TOTAL_XP = 365 * XP_PER_SENTENCE;

    var LADDER = [
        { key: 'newborn', name: 'Newborn', emoji: '👶', xp: 0, goal: 'Tu primera frase está esperando.' },
        { key: 'caveman', name: 'Caveman', emoji: '🪨', xp: 90, goal: 'Dices frases. Todavía con las manos.' },
        { key: 'teen', name: 'Teen', emoji: '🧑', xp: 250, goal: 'Armas frases propias y las defiendes.' },
        { key: 'adult', name: 'Adult', emoji: '🎓', xp: 450, goal: 'Manejas el idioma en serio.' },
        { key: 'fluent', name: 'Fluent', emoji: '🏆', xp: TOTAL_XP, goal: 'Ruta completa. Las 365.' }
    ];

    function levelFor(xp) {
        var found = LADDER[0];
        for (var i = 0; i < LADDER.length; i++) {
            if (xp >= LADDER[i].xp) found = LADDER[i];
        }
        return found;
    }

    function nextLevel(xp) {
        for (var i = 0; i < LADDER.length; i++) {
            if (xp < LADDER[i].xp) return LADDER[i];
        }
        return null;
    }

    /* ================= ghost rivals ================= */

    /*
     * Fixed-XP practice opponents. Not real people: the panel says so.
     * Seeded into saved state on first run and then never reshuffled,
     * so a learner's position does not jump around between sessions.
     * No rival may exceed TOTAL_XP (730), otherwise finishing the whole
     * route would still leave someone unreachable above you.
     */
    var RIVAL_SEED = [
        { id: 'r1', name: 'Rita', face: '🐿️', xp: 40 },
        { id: 'r2', name: 'Bruno', face: '🐢', xp: 120 },
        { id: 'r3', name: 'Nadia', face: '🦊', xp: 260 },
        { id: 'r4', name: 'Kai', face: '🐺', xp: 480 },
        { id: 'r5', name: 'Mora', face: '🐉', xp: 700 }
    ];

    function ensureRivals() {
        if (Array.isArray(state.rivals) && state.rivals.length === RIVAL_SEED.length) return;
        state.rivals = RIVAL_SEED.map(function (r) {
            return { id: r.id, name: r.name, face: r.face, xp: r.xp };
        });
        save();
    }

    /* ================= state ================= */

    var STORAGE_KEY = 'igsg_daily_v1';

    function defaultState() {
        return {
            xp: 0,
            gems: 50,
            streak: 0,
            lastStudyDate: null,
            bestStreak: 0,
            streakFreeze: 0,
            studyHistory: {},
            dailyXp: 0,
            dailyXpDate: null,
            lessonsDone: 0,
            perfectLessons: 0,
            seenSentences: 0,
            hearts: MAX_HEARTS,
            heartsTs: Date.now(),
            currentLesson: 0,
            completed: {},
            missed: {},
            badges: {},
            nickname: '',
            rivals: [],
            placement: null,
            placementSkipped: false,
            dailyLessonDoneDate: null,
            storageNoticeDismissed: false,
            features: {}
        };
    }

    var state = load();

    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState();
            var saved = JSON.parse(raw);
            var base = defaultState();
            Object.keys(base).forEach(function (k) {
                if (saved[k] !== undefined && saved[k] !== null) base[k] = saved[k];
            });
            if (base.lastStudyDate && (!base.studyHistory || !base.studyHistory[base.lastStudyDate])) {
                if (!base.studyHistory) base.studyHistory = {};
                base.studyHistory[base.lastStudyDate] = true;
            }
            return base;
        } catch (e) {
            return defaultState();
        }
    }

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* storage full or blocked: game still runs in memory */ }
    }

    function todayKey() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    /*
     * todayKey() is unpadded ('2026-10-7'), which `new Date('...T00:00:00')`
     * cannot parse (NaN), so the streak never advanced. Parse the parts and
     * compare in UTC to stay exact across daylight-saving changes.
     */
    function dayNumber(key) {
        var p = String(key).split('-');
        return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000;
    }

    function daysBetween(a, b) {
        return Math.round(dayNumber(b) - dayNumber(a));
    }

    /* daily rollover: resets daily XP, decays streak if a day was missed (unless freeze protects it) */
    function rollover() {
        var today = todayKey();
        if (state.dailyXpDate !== today) {
            state.dailyXpDate = today;
            state.dailyXp = 0;
        }
        if (state.lastStudyDate) {
            var diff = daysBetween(state.lastStudyDate, today);
            if (diff > 1) {
                var missed = diff - 1;
                if (state.streakFreeze && state.streakFreeze >= missed) {
                    state.streakFreeze -= missed;
                    var d = new Date();
                    for (var m = 1; m <= missed; m++) {
                        var pastDate = new Date(d.getTime() - m * 86400000);
                        var pKey = pastDate.getFullYear() + '-' + (pastDate.getMonth() + 1) + '-' + pastDate.getDate();
                        if (!state.studyHistory) state.studyHistory = {};
                        state.studyHistory[pKey] = 'freeze';
                    }
                    var yesterday = new Date(d.getTime() - 86400000);
                    state.lastStudyDate = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' + yesterday.getDate();
                    save();
                } else {
                    state.streak = 0;
                    state.streakFreeze = 0;
                }
            }
        }
    }

    /* hearts refill over time */
    function heartsNow() {
        var elapsed = Date.now() - (state.heartsTs || Date.now());
        var earned = Math.floor(elapsed / HEART_REFILL_MS);
        if (earned > 0) {
            state.hearts = Math.min(MAX_HEARTS, state.hearts + earned);
            state.heartsTs += earned * HEART_REFILL_MS;
            save();
        }
        return state.hearts;
    }

    function loseHeart() {
        var h = heartsNow();
        if (h <= 0) return false;
        if (state.hearts < MAX_HEARTS) state.heartsTs = Date.now();
        state.hearts = h - 1;
        save();
        renderStats();
        return true;
    }

    /* ================= dom ================= */

    var $ = function (id) { return document.getElementById(id); };

    var screenPath = $('screen-path');
    var screenLesson = $('screen-lesson');
    var screenResult = $('screen-result');
    var exerciseArea = $('exercise-area');
    var feedbackBox = $('feedback');
    var checkBtn = $('check-btn');

    /* ================= feature hooks ================= */

    /*
     * Extension points for optional features in features/*.js. A feature never
     * edits this file: it registers exercise types, queue transforms and event
     * listeners through window.DailyGame (exposed at the bottom).
     */
    var customBuilders = {};
    var queueTransforms = [];
    var listeners = {};
    var readyCallbacks = [];
    var booted = false;

    function emit(name, payload) {
        (listeners[name] || []).forEach(function (fn) {
            try { fn(payload); } catch (e) {
                if (window.console && console.error) console.error('[DailyGame] ' + name + ' listener failed', e);
            }
        });
    }

    /* ================= session ================= */

    var session = null;

    function showScreen(which) {
        var screens = [
            { id: 'path', el: screenPath },
            { id: 'lesson', el: screenLesson },
            { id: 'result', el: screenResult },
            { id: 'placement', el: $('screen-placement') },
            { id: 'placement-result', el: $('screen-placement-result') }
        ];
        screens.forEach(function (s) {
            if (!s.el) return;
            var isTarget = s.id === which;
            s.el.classList.toggle('hidden', !isTarget);
            if (isTarget) {
                s.el.removeAttribute('hidden');
            } else {
                s.el.setAttribute('hidden', '');
            }
        });
        window.scrollTo(0, 0);
    }

    /* ================= level + rivals render ================= */

    function renderLevel() {
        var xp = state.xp;
        var cur = levelFor(xp);
        var next = nextLevel(xp);

        $('level-emoji').textContent = cur.emoji;
        $('level-name').textContent = cur.name;
        $('level-xp').textContent = xp;

        var span = next ? next.xp - cur.xp : 1;
        var into = next ? xp - cur.xp : 1;
        var pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100;
        $('level-fill').style.width = pct + '%';

        $('level-goal').textContent = next
            ? Math.max(0, next.xp - xp) + ' XP para ser ' + next.name
            : 'Completaste la ruta. Las 365 oraciones.';

        var ladder = $('ladder');
        ladder.innerHTML = '';
        LADDER.forEach(function (rung) {
            var li = document.createElement('li');
            li.textContent = rung.name;
            if (xp >= rung.xp) li.classList.add('reached');
            if (rung.key === cur.key) li.classList.add('current');
            ladder.appendChild(li);
        });
    }

    function renderRivals() {
        ensureRivals();

        var rows = state.rivals.map(function (r) {
            return { name: r.name, face: r.face, xp: r.xp, you: false };
        });
        rows.push({
            name: state.nickname || 'Tú',
            face: '🙂',
            xp: state.xp,
            you: true
        });

        /* rank by XP desc; the player sits in true position among the bots */
        rows.sort(function (a, b) {
            if (b.xp !== a.xp) return b.xp - a.xp;
            return a.you ? 1 : -1;
        });

        var list = $('rivals-list');
        list.innerHTML = '';

        rows.forEach(function (row, i) {
            var li = document.createElement('li');
            li.className = 'rival' + (row.you ? ' rival--you' : (row.xp > state.xp ? ' rival--above' : ''));

            var rank = document.createElement('span');
            rank.className = 'rival__rank';
            rank.textContent = (i + 1) + '.';

            var face = document.createElement('span');
            face.className = 'rival__face';
            face.textContent = row.face;

            var name = document.createElement('span');
            name.className = 'rival__name';
            name.textContent = row.name;
            if (row.you) {
                var tag = document.createElement('span');
                tag.className = 'rival__tag';
                tag.textContent = 'Tú';
                name.appendChild(tag);
            }

            var xp = document.createElement('span');
            xp.className = 'rival__xp';
            xp.textContent = row.xp + ' XP';

            li.appendChild(rank);
            li.appendChild(face);
            li.appendChild(name);
            li.appendChild(xp);
            list.appendChild(li);
        });
    }

    /* ================= first name ================= */

    /*
     * The learner gives only a first name. It shows in the rivals list and is
     * written into the sentences that use the {name} marker (sentences.js), so
     * "Hello, my name is ___." uses the learner's own name everywhere: lessons,
     * phrasebook, review, tips. Names render through textContent only.
     */
    var NAME_MAX = 16;
    var NAME_FALLBACK = 'Alex';
    // {other}: a fixed second name for distractors, never equal to the learner's.
    var OTHER_NAMES = ['Janina', 'Camila', 'Diego'];
    var NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

    function cleanNickname(raw) {
        var name = String(raw || '').replace(/\s+/g, ' ').trim();
        if (!name) return '';
        // all-lowercase or ALL-CAPS gets normal casing; "DeShawn" stays as typed
        if (name === name.toLowerCase() || name === name.toUpperCase()) {
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
        return name;
    }

    function nicknameProblem(name) {
        if (!name) return 'Escribe tu primer nombre.';
        if (/\s/.test(name)) return 'Solo tu primer nombre, sin apellido ni segundo nombre.';
        if (name.length < 2) return 'Escribe al menos 2 letras.';
        if (name.length > NAME_MAX) return 'Máximo ' + NAME_MAX + ' letras.';
        if (!NAME_PATTERN.test(name)) return 'Usa solo letras, sin números ni símbolos.';
        return null;
    }

    function learnerName() {
        var n = state.nickname;
        return n && !nicknameProblem(n) ? n : NAME_FALLBACK;
    }

    function otherName(name) {
        var key = normalize(name);
        for (var i = 0; i < OTHER_NAMES.length; i++) {
            if (normalize(OTHER_NAMES[i]) !== key) return OTHER_NAMES[i];
        }
        return OTHER_NAMES[0];
    }

    function personalize(text) {
        if (typeof text !== 'string' || text.indexOf('{') < 0) return text;
        var name = learnerName();
        return text.split('{name}').join(name).split('{other}').join(otherName(name));
    }

    /*
     * Rewrites marked sentences in place, keeping each sentence object (review
     * ids and lessonOf() rely on object identity). The original templates are
     * kept on a non-enumerable property so a rename can re-apply cleanly.
     */
    var PERSONAL_FIELDS = ['en', 'es', 'we', 'ws'];

    function applyName() {
        LESSONS.forEach(function (lesson) {
            lesson.sentences.forEach(function (s) {
                if (!s.__tpl) {
                    var marked = PERSONAL_FIELDS.some(function (k) {
                        return JSON.stringify(s[k] || '').indexOf('{') >= 0;
                    });
                    if (!marked) return;
                    var tpl = {};
                    PERSONAL_FIELDS.forEach(function (k) {
                        tpl[k] = Array.isArray(s[k]) ? s[k].slice() : s[k];
                    });
                    Object.defineProperty(s, '__tpl', { value: tpl, enumerable: false });
                }
                PERSONAL_FIELDS.forEach(function (k) {
                    var t = s.__tpl[k];
                    s[k] = Array.isArray(t) ? t.map(personalize) : personalize(t);
                });
            });
        });
    }

    function shakeNickModal() {
        var panel = document.querySelector('#nick-modal .modal__panel');
        var input = $('nick-input');
        if (panel && typeof panel.animate === 'function') {
            panel.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-8px)' },
                { transform: 'translateX(8px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 320 });
        }
        if (input) input.focus();
    }

    function showNickModal(isEdit) {
        var modal = $('nick-modal');
        var input = $('nick-input');
        var err = $('nick-error');
        var submit = modal.querySelector('.modal__submit');

        var hasValidName = state.nickname && !nicknameProblem(state.nickname);
        var mandatory = !hasValidName;
        modal.dataset.mandatory = mandatory ? 'true' : 'false';

        if (isEdit && hasValidName) {
            input.value = String(state.nickname).trim();
            submit.textContent = 'Guardar';
        } else {
            input.value = '';
            submit.textContent = 'Empezar a practicar';
        }

        err.hidden = true;
        err.textContent = '';
        modal.hidden = false;
        setTimeout(function () {
            input.focus();
            if (input.value) input.select();
        }, 30);
    }

    function closeNickModal(force) {
        if (!force && (!state.nickname || nicknameProblem(state.nickname))) {
            shakeNickModal();
            return;
        }
        $('nick-modal').hidden = true;
    }

    function initNickname() {
        var modal = $('nick-modal');
        var form = $('nick-form');
        var input = $('nick-input');
        var err = $('nick-error');
        var chip = $('nick-chip');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = cleanNickname(input.value);

            var problem = nicknameProblem(name);
            if (problem) {
                err.textContent = problem;
                err.hidden = false;
                shakeNickModal();
                return;
            }

            var changed = name !== state.nickname;
            state.nickname = name;
            save();
            closeNickModal(true);
            $('nick-chip-name').textContent = name;
            if (changed) {
                applyName();
                emit('nameChange', { name: name });
                renderPath();
            }
            renderRivals();
            maybePromptPlacement();
        });

        // Click outside on modal backdrop: if mandatory, do not dismiss!
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                if (!state.nickname || nicknameProblem(state.nickname)) {
                    shakeNickModal();
                } else {
                    closeNickModal(true);
                }
            }
        });

        // Focus trap inside modal: cannot tab out to elements behind
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                var focusables = modal.querySelectorAll('input:not([disabled]), button:not([disabled])');
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        input.addEventListener('input', function () { err.hidden = true; });

        chip.addEventListener('click', function () { showNickModal(true); });

        /*
         * Mandatory first name on join: Block until a valid first name exists.
         */
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            if (state.nickname) {
                err.textContent = 'Ingresa tu primer nombre para continuar.';
                err.hidden = false;
            }
        } else {
            $('nick-chip-name').textContent = state.nickname;
            maybePromptPlacement();
        }
    }

    /* ================= placement test ================= */

    /*
     * Hard by construction rather than by luck: questions sit in four bands,
     * each a harder level than the last, and later bands are worth more. A
     * correct band-5 answer is worth 4x a band-2 one, so guessing early cannot
     * outscore real understanding late.
     *
     * Scoring low is a legitimate result, not a failure: it just means the
     * route starts at the beginning.
     */
    /*
     * Recomputed from the item data on every boot, never hardcoded: adding a
     * question changes the maximum and every cut below depends on it.
     */
    function placementMax() {
        var items = window.PLACEMENT_ITEMS || [];
        var sum = 0;
        for (var i = 0; i < items.length; i++) sum += items[i].pts || 0;
        return sum;
    }

    var PLACEMENT_MAX = placementMax();

    /*
     * Score -> starting level.
     *
     * Every item offers three options, so a learner choosing at random scores
     * an expected PLACEMENT_MAX/3 = 26 of 78, about 33%. Every cut from
     * level 3 upward therefore has to sit ABOVE that floor, or coin flips buy
     * a level. The old cuts (>=14 of 50, 28%) were below it, which is how a
     * random guesser ended up placed in B1.
     *
     * Cuts are verified by test-placement-bands.js, which asserts that a
     * guesser lands below level 3 while an honest B1, B2 and C1 learner each
     * still reach their own level.
     */
    var PLACEMENT_CUTS = [
        { min: 60, level: 5 },   // 77%
        { min: 44, level: 4 },   // 56%
        { min: 34, level: 3 },   // 44% - above the 33% guessing floor
        { min: 10, level: 2 },   // 13%
        { min: 0, level: 1 }
    ];

    function firstLessonOfLevel(lv) {
        for (var i = 0; i < LESSONS.length; i++) {
            if (LESSONS[i].sentences[0].lv === lv) return i;
        }
        return 0;
    }

    function levelForScore(score) {
        for (var i = 0; i < PLACEMENT_CUTS.length; i++) {
            if (score >= PLACEMENT_CUTS[i].min) return PLACEMENT_CUTS[i].level;
        }
        return 1;
    }

    /*
     * Questions come from placement.js, hand-authored so the two wrong options
     * are real grammar or vocabulary traps. Sampling the 365 at random produced
     * options with no relation to the question, which made the test trivial.
     */
    function buildPlacementQuestions() {
        var items = window.PLACEMENT_ITEMS || [];
        return items.map(function (it, n) {
            /* `q` is the prompt in the language named by `dir` (see placement.js).
               Using `a` here printed the correct answer as the prompt itself for
               every dir:'es' item. `showEn` stays the single source of truth for
               "the stem is English", and renderPlacementStep derives `lang` from it. */
            var stem = it.q;
            return {
                item: it,
                stem: stem,
                showEn: it.dir === 'en',
                options: shuffle([it.a].concat(it.w)),
                answer: it.a,
                points: it.pts,
                band: it.lv,
                order: n + 1
            };
        });
    }
        var questions = [];
    var placement = null;

    function startPlacement() {
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            return;
        }
        placement = {
            questions: buildPlacementQuestions(),
            step: 0,
            score: 0,
            correct: 0,
            startedAt: Date.now(),
            answered: false
        };
        closePlacementPrompt();
        showScreen('placement');
        renderPlacementStep();
    }

    function renderPlacementStep() {
        var ex = $('placement-exercise');
        var check = $('placement-check');
        var track = $('placement-progress');
        var fb = $('placement-feedback');
        var pfooter = fb.closest ? fb.closest('.lesson-footer') : null;
        if (pfooter) pfooter.classList.remove('ok-state', 'bad-state');
        placement.answered = false;
        fb.className = 'feedback';
        fb.innerHTML = '';

        if (placement.step >= placement.questions.length) return finishPlacement();

        var q = placement.questions[placement.step];
        track.style.width = (placement.step / placement.questions.length) * 100 + '%';

        ex.innerHTML = '';

        var prompt = document.createElement('p');
        prompt.className = 'ex-prompt';
        prompt.textContent = q.showEn ? '¿Qué significa esta oración?' : '¿Cómo se dice esta oración?';
        var sub = document.createElement('span');
        sub.className = 'ex-sub';
        sub.textContent = 'Pregunta ' + q.order + ' de ' + placement.questions.length +
            ' · nivel ' + q.band;
        prompt.appendChild(sub);
        ex.appendChild(prompt);

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var line = document.createElement('p');
        /* The stem is always the primary content, so it keeps the prominent
           sentence styling whatever the language. `lang` is what tells a screen
           reader which voice to use; the document default is Spanish. */
        line.className = 'sentence-en';
        line.lang = q.showEn ? 'en' : 'es';
        line.textContent = q.stem;
        card.appendChild(line);
        if (q.showEn) card.appendChild(speakButton(q.stem));
        ex.appendChild(card);

        ex.appendChild(choiceList(q.options, check, q.showEn ? 'en' : 'es'));
        enablePlacementCheck(q);
    }

    function enablePlacementCheck(q) {
        var check = $('placement-check');
        check.disabled = true;
        check.textContent = 'Comprobar';
        check.onclick = function () {
            var picked = $('placement-exercise').querySelector('.choice.selected');
            if (!picked || placement.answered) return;
            var ok = normalize(picked.dataset.value) === normalize(q.answer);
            placement.answered = true;

            if (ok) {
                picked.classList.add('correct');
                placement.score += q.points;
                placement.correct++;
            } else {
                picked.classList.add('wrong');
                revealCorrectAnswer(q.answer);
            }

            /* teach the trap, not just mark it */
            var fb = $('placement-feedback');
            fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
            var pfooter = fb.closest ? fb.closest('.lesson-footer') : null;
            if (pfooter) {
                pfooter.classList.remove('ok-state', 'bad-state');
                pfooter.classList.add(ok ? 'ok-state' : 'bad-state');
            }
            fb.innerHTML = '<span>' + (ok ? '✅' : '❌') + '</span><div><strong>' +
                (ok ? '¡Correcto!' : 'Incorrecto') + '</strong>' +
                '<span class="feedback-detail">' + escapeHtml(q.item.why) + '</span></div>';

            $('placement-progress').style.width =
                ((placement.step + 1) / placement.questions.length) * 100 + '%';

            check.textContent = 'Continuar';
            check.onclick = function () {
                if (pfooter) pfooter.classList.remove('ok-state', 'bad-state');
                placement.step++;
                renderPlacementStep();
            };
            check.focus();
        };
    }

    function revealCorrectAnswer(answer) {
        Array.prototype.forEach.call(
            $('placement-exercise').querySelectorAll('.choice'),
            function (b) {
                if (normalize(b.dataset.value) === normalize(answer)) b.classList.add('correct');
                b.disabled = true;
            }
        );
    }

    function finishPlacement() {
        var seconds = Math.max(1, Math.round((Date.now() - placement.startedAt) / 1000));
        var level = levelForScore(placement.score);
        var startLesson = firstLessonOfLevel(level);

        state.placement = {
            score: placement.score,
            max: PLACEMENT_MAX,
            correct: placement.correct,
            total: placement.questions.length,
            level: level,
            date: todayKey(),
            /* stamped so a future migration can tell current results from stale ones */
            v: (window.DailyMigrations && window.DailyMigrations.CURRENT_VERSION) || 2
        };
        state.seenSentences += placement.correct;

        /* counts as a lesson, per the agreed behaviour */
        var xp = placement.correct * XP_PER_SENTENCE;
        state.xp += xp;
        state.dailyXp += xp;
        state.gems += 3;

        if (state.lastStudyDate !== todayKey()) {
            state.streak = (state.lastStudyDate && daysBetween(state.lastStudyDate, todayKey()) === 1)
                ? state.streak + 1 : 1;
            state.lastStudyDate = todayKey();
            state.bestStreak = Math.max(state.bestStreak, state.streak);
        }

        save();

        var meta = LEVEL_META[level] || {};
        $('placement-result-emoji').textContent = meta.emoji || '🌱';
        $('placement-result-level').textContent = (meta.name || 'Nivel 1') + ' · ' + (meta.label || '');
        $('placement-result-score').textContent =
            placement.score + ' / ' + PLACEMENT_MAX + ' puntos · ' +
            placement.correct + ' de ' + placement.questions.length + ' correctas';
        $('placement-result-where').textContent =
            'Empiezas en la lección ' + (startLesson + 1) + ' de ' + TOTAL_LESSONS + '. ' +
            'Las lecciones anteriores quedan desbloqueadas por si quieres repasarlas.';

        var m = Math.floor(seconds / 60);
        var sec = seconds % 60;
        $('placement-result-time').textContent = m + ':' + (sec < 10 ? '0' : '') + sec;

        showScreen('placement-result');
    }

    function maybePromptPlacement() {
        if (state.placement || state.placementSkipped) return;
        if ($('nick-modal').hidden === false) return; // wait for the name first
        $('placement-prompt').hidden = false;
    }

    function closePlacementPrompt() {
        var p = $('placement-prompt');
        if (p) p.hidden = true;
    }

    function renderDiagnostic() {
        var box = $('diagnostic');
        if (!box) return;
        if (!state.placement) {
            box.hidden = true;
            return;
        }
        var meta = LEVEL_META[state.placement.level] || {};
        box.hidden = false;
        box.innerHTML = '<span class="diagnostic__emoji">' + (meta.emoji || '') + '</span>' +
            '<span>Nivel de diagnóstico <strong>' + (meta.label || meta.name || '') + '</strong> · ' +
            state.placement.score + '/' + state.placement.max + ' pts</span>';
    }

    function initPlacement() {
        var prompt = $('placement-prompt');
        if (!prompt) return;

        $('placement-start').addEventListener('click', function () {
            startPlacement();
        });

        /*
         * Skipping defers the offer, it does not waive it. Historically this
         * wrote a permanent flag that no migration ever cleared, so a learner
         * who pressed it once was never asked again and their level stayed
         * whatever it was. Now the flag is cleared by migrations.js on the
         * next version bump, and the prompt returns on a later visit.
         */
        $('placement-skip').addEventListener('click', function () {
            state.placementSkipped = true;
            save();
            closePlacementPrompt();
        });

        $('placement-quit').addEventListener('click', function () {
            closePlacementPrompt();
            showScreen('path');
            renderPath();
        });

        $('placement-continue').addEventListener('click', function () {
            showScreen('path');
            renderPath();
            renderLevel();
            renderRivals();
            renderStats();
            renderGoal();
        });
    }

    /* ================= path screen ================= */

    function flatIndex() {
        var rows = [];
        LESSONS.forEach(function (lesson, i) {
            var lv = lesson.sentences[0].lv;
            if (i === 0 || LESSONS[i - 1].sentences[0].lv !== lv) {
                rows.push({ marker: true, lv: lv });
            }
            rows.push({ marker: false, index: i });
        });
        return rows;
    }

    function renderPath() {
        var list = $('path-list');
        list.innerHTML = '';
        var doneCount = state.lessonsDone;
        var nextIndex = Math.min(doneCount, TOTAL_LESSONS - 1);

        /* placement opens the whole path up to the placed level; earlier lessons
           stay available as optional review rather than as the "next" step */
        var focusIndex = nextIndex;
        if (state.placement) {
            var placed = firstLessonOfLevel(state.placement.level);
            if (placed > focusIndex) focusIndex = placed;
        }
        var floor = focusIndex;

        flatIndex().forEach(function (row) {
            if (row.marker) {
                var m = document.createElement('div');
                m.className = 'unit-marker';
                m.innerHTML = (LEVEL_META[row.lv] || {}).emoji + ' ' + ((LEVEL_META[row.lv] || {}).name || '') +
                    '<span>' + ((LEVEL_META[row.lv] || {}).label || '') + '</span>';
                list.appendChild(m);
                return;
            }

            var i = row.index;
            var done = !!state.completed[i];
            var perfect = done && state.missed[i] === 0;
            var locked = i > floor;
            var isNext = !locked && !done && i === focusIndex;
            var isAvailable = !locked && !done && !isNext;

            var wrap = document.createElement('div');
            wrap.className = 'path-row';

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'node ' + (locked ? 'locked'
                : done ? (perfect ? 'perfect' : 'done')
                : isNext ? 'current'
                : 'available');
            btn.innerHTML = locked ? '🔒' : perfect ? '★' : done ? '✓' : String(i + 1);
            btn.title = locked ? 'Completa la lección anterior o haz el test de nivel'
                : isAvailable ? 'Disponible, opcional por ahora'
                : (LESSONS[i] ? LESSONS[i].title : '');
            btn.setAttribute('aria-label', 'Lección ' + (i + 1) + (locked ? ', bloqueada' : ''));
            if (locked) {
                btn.disabled = true;
            } else {
                btn.addEventListener('click', function () { startLesson(i); });
            }

            if (isNext) {
                var tip = document.createElement('div');
                tip.className = 'node-tooltip';
                var tipText = doneCount === 0 ? 'EMPEZAR' : 'CONTINUAR';
                tip.innerHTML = '<span class="node-tooltip__text">' + tipText + '</span><span class="node-tooltip__arrow"></span>';
                btn.appendChild(tip);
            }

            wrap.appendChild(btn);
            list.appendChild(wrap);
        });

        renderDiagnostic();

        var cur = LESSONS[Math.min(state.currentLesson, TOTAL_LESSONS - 1)] || LESSONS[0];
        var curLv = cur ? cur.sentences[0].lv : 1;
        var meta = LEVEL_META[curLv] || {};
        $('unit-eyebrow').textContent = meta.label || '';
        $('unit-title').textContent = cur ? cur.title : '';
        $('unit-sub').textContent = cur ? cur.sentences.length + ' oraciones · ' + (cur.sentences.length * XP_PER_SENTENCE) + ' XP' : '';

        var nextIdx = Math.min(state.lessonsDone, TOTAL_LESSONS - 1);
        var nextLesson = LESSONS[nextIdx];
        var cta = $('lesson-cta');
        if (state.lessonsDone >= TOTAL_LESSONS) {
            cta.textContent = 'Repetir';
        } else {
            cta.textContent = state.lessonsDone === 0 ? 'Empezar' : 'Seguir';
        }
        cta.onclick = function () {
            if (state.lessonsDone >= TOTAL_LESSONS) startLesson(0);
            else startLesson(nextIdx);
        };

        $('card-xp').textContent = state.xp;
        $('card-learned').textContent = state.seenSentences + '/365';
        $('card-perfect').textContent = state.perfectLessons;

        emit('pathRender', {});
    }

    function backToPath() {
        showScreen('path');
        renderPath();
        renderGoal();
        renderStats();
        renderLevel();
        renderRivals();
    }

    function renderGoal() {
        var pct = Math.min(1, state.dailyXp / DAILY_GOAL_XP);
        var circ = 2 * Math.PI * 18;
        var fill = $('goal-ring-fill');
        fill.style.strokeDasharray = circ;
        fill.style.strokeDashoffset = circ - circ * pct;
        $('goal-count').textContent = state.dailyXp;

        var done = state.dailyXp >= DAILY_GOAL_XP;
        $('goal-title').textContent = done ? '¡Meta cumplida!' : 'Meta diaria';
        $('goal-sub').textContent = done
            ? 'Vuelve mañana para mantener la racha.'
            : 'Te faltan ' + (DAILY_GOAL_XP - state.dailyXp) + ' XP hoy.';
    }

    function renderStats() {
        $('streak-value').textContent = state.streak;
        $('gems-value').textContent = state.gems;
        $('hearts-value').textContent = heartsNow();
    }

    function renderBadges() {
        var grid = $('badges-grid');
        grid.innerHTML = '';
        var newly = [];
        BADGES.forEach(function (b) {
            var earned = !!state.badges[b.id] || b.test(state);
            if (earned && !state.badges[b.id]) {
                state.badges[b.id] = true;
                newly.push(b);
            }
            var el = document.createElement('div');
            el.className = 'badge' + (earned ? ' earned' : '');
            el.innerHTML = '<div class="badge-icon">' + b.icon + '</div><p class="badge-name">' + b.name + '</p>';
            el.title = b.name + (earned ? ' — conseguido' : ' — bloqueado');
            grid.appendChild(el);
        });
        if (newly.length) save();
        return newly;
    }

    /* ================= lesson ================= */

    function startLesson(index) {
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            return;
        }
        var lesson = LESSONS[index];
        if (!lesson) return;
        rollover();
        session = {
            kind: 'lesson',
            index: index,
            lesson: lesson,
            title: lesson.title,
            queue: buildQueue(lesson, index),
            step: 0,
            correct: 0,
            mistakes: 0,
            startedAt: Date.now(),
            answered: false
        };
        state.currentLesson = index;
        save();
        beginSession();
    }

    /*
     * A session that is not one of the 73 path lessons (daily challenge,
     * review). It awards XP per correct answer and counts for the streak, but
     * never marks a path lesson as completed.
     *   opts.title     shown on the result screen
     *   opts.items     [{ sentence, type, graded? }]
     *   opts.onFinish  called with { correct, mistakes, total, perfect, session }
     */
    function startCustomSession(opts) {
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            return false;
        }
        if (!opts || !opts.items || !opts.items.length) return false;
        rollover();
        session = {
            kind: 'custom',
            index: -1,
            lesson: null,
            title: opts.title || 'Práctica',
            queue: opts.items.map(normalizeItem),
            step: 0,
            correct: 0,
            mistakes: 0,
            startedAt: Date.now(),
            answered: false,
            onFinish: typeof opts.onFinish === 'function' ? opts.onFinish : null
        };
        beginSession();
        return true;
    }

    function beginSession() {
        emit('sessionStart', { session: session });
        renderHeartsLive();
        showScreen('lesson');
        renderStep();
    }

    function normalizeItem(item) {
        return {
            sentence: item.sentence,
            type: item.type || 'multipleChoice',
            graded: item.graded !== false,
            data: item.data || null,
            tag: item.tag || null,
            result: null
        };
    }

    function gradedItems(s) {
        return s.queue.filter(function (it) { return it.graded; });
    }

    /*
     * Each of the five sentences in a lesson gets a different exercise type, so
     * a lesson never repeats a mechanic. `spanishToEnglish` closes the loop:
     * the learner reads Spanish and picks English, which is the reverse of
     * multipleChoice and the direction most tests actually use.
     */
    function buildQueue(lesson, index) {
        var types = ['listen', 'multipleChoice', 'translate', 'wordBank',
            'spanishToEnglish', 'speakBack'];
        var queue = lesson.sentences.map(function (s, i) {
            return normalizeItem({ sentence: s, type: types[i % types.length] });
        });
        queueTransforms.forEach(function (fn) {
            try {
                var next = fn(queue.slice(), lesson, index);
                if (Array.isArray(next) && next.length) queue = next.map(normalizeItem);
            } catch (e) {
                if (window.console && console.error) console.error('[DailyGame] queue transform failed', e);
            }
        });
        return queue;
    }

    function renderHeartsLive() {
        var box = $('hearts-live');
        var h = heartsNow();
        box.innerHTML = '';
        for (var i = 0; i < MAX_HEARTS; i++) {
            var s = document.createElement('span');
            s.textContent = '❤️';
            if (i >= h) s.className = 'heart-lost';
            box.appendChild(s);
        }
    }

    function updateProgress() {
        var pct = (session.step / session.queue.length) * 100;
        $('lesson-progress-fill').style.width = pct + '%';
    }

    /* exercise types whose option text is English */
    var EN_OPTION_TYPES = { listen: true, spanishToEnglish: true, fillBlank: true, wordBank: true };

    /*
     * Last line of defence for lang marking. Feature renderers register their
     * own exercises, and a feature may build options without saying what
     * language they are in; anything the render path missed is caught here
     * rather than left to be read aloud in the wrong voice.
     */
    function markOptionLanguage(item) {
        var area = exerciseArea;
        if (!area) return;
        var wants = EN_OPTION_TYPES[item && item.type];
        var chips = area.querySelectorAll('.choice, .word-chip');
        for (var i = 0; i < chips.length; i++) {
            if (!chips[i].getAttribute('lang')) chips[i].lang = wants ? 'en' : 'es';
        }
    }

    function renderStep() {
        session.answered = false;
        exerciseArea.innerHTML = '';
        feedbackBox.className = 'feedback';
        feedbackBox.innerHTML = '';
        var footer = feedbackBox.closest ? feedbackBox.closest('.lesson-footer') : null;
        if (footer) footer.classList.remove('ok-state', 'bad-state');
        checkBtn.className = 'btn btn-primary btn-check';
        checkBtn.textContent = 'Comprobar';
        checkBtn.disabled = true;
        checkBtn.onclick = null;
        updateProgress();

        if (session.step >= session.queue.length) return finishLesson();

        var item = session.queue[session.step];
        var s = item.sentence;
        var builders = {
            listen: renderListen,
            multipleChoice: renderMultipleChoice,
            translate: renderTranslate,
            wordBank: renderWordBank,
            speakBack: renderSpeakBack,
            spanishToEnglish: renderSpanishToEnglish
        };
        var build = customBuilders[item.type] || builders[item.type] || renderMultipleChoice;
        try {
            build(s, item);
        } catch (e) {
            if (window.console && console.error) console.error('[DailyGame] exercise "' + item.type + '" failed', e);
            if (!item.graded) return advance();
            exerciseArea.innerHTML = '';
            renderMultipleChoice(s);
        }
        markOptionLanguage(item);
    }

    /* moves past an ungraded step (tip card, intro) without touching score */
    function advance() {
        if (!session) return;
        session.step++;
        renderStep();
    }

    function prompt(text, sub) {
        var p = document.createElement('p');
        p.className = 'ex-prompt';
        p.textContent = text;
        if (sub) {
            var sp = document.createElement('span');
            sp.className = 'ex-sub';
            sp.textContent = sub;
            p.appendChild(sp);
        }
        return p;
    }

    function speak(text, rate) {
        try {
            if (!('speechSynthesis' in window)) return;
            var synth = window.speechSynthesis;
            // Safari can leave the queue paused after the tab was backgrounded.
            if (synth.paused) synth.resume();
            if (synth.speaking || synth.pending) synth.cancel();
            var u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            if (speechVoice) u.voice = speechVoice;
            u.rate = rate || 1;
            synth.speak(u);
        } catch (e) { /* speech unavailable: exercise still solvable by reading */ }
    }

    function normalize(s) {
        return String(s)
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[¿?¡!.,;:"']/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /*
     * Options come from the hand-authored `we` / `ws` arrays in sentences.js.
     * Nothing is drawn at random from the corpus: a distractor unrelated to the
     * question makes the exercise trivial, which is exactly what we stopped
     * doing. Sentences that predate the v2 data (levels 3-5, not yet
     * rewritten) fall back to siblings from the same lesson, which are at
     * least topically related, and that fallback is logged once in the console.
     */
    var legacyWarned = false;

    function lessonOf(sentence) {
        for (var i = 0; i < LESSONS.length; i++) {
            if (LESSONS[i].sentences.indexOf(sentence) >= 0) return LESSONS[i];
        }
        return null;
    }

    /*
     * Only reached when a sentence has no hand-authored `we`/`ws`. Kept as a
     * visible gap rather than a silent generator: the console reports it so the
     * missing static options get written. Never produces random content.
     */
    function fallbackDistractors(s, key) {
        var out = [];
        if (!legacyWarned) {
            legacyWarned = true;
            if (window.console && console.info) {
                console.info('[1 Oracion al Dia] faltan `we`/`ws` estaticos en ' +
                    '"' + s[key] + '". Se mostraran menos opciones hasta escribirlos.');
            }
        }
        return out;
    }

    function optionsFor(s, key) {
        var authored = key === 'en' ? s.we : s.ws;
        var correct = s[key];
        var seen = {};
        seen[correct] = true;

        var source = (authored && authored.length) ? authored : fallbackDistractors(s, key);
        var options = [correct];

        source.forEach(function (opt) {
            if (options.length >= 4) return;
            if (!opt || seen[opt]) return;
            seen[opt] = true;
            options.push(opt);
        });

        return shuffle(options);
    }

    /* --- type 1: listen (TTS + pick the correct English sentence) --- */
    function renderListen(s) {
        exerciseArea.appendChild(prompt('Escucha y elige la oración correcta'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        card.style.textAlign = 'center';
        card.innerHTML = '<div style="font-size:3rem;line-height:1">🔊</div>';
        var play = document.createElement('button');
        play.type = 'button';
        play.className = 'speak-btn';
        play.style.position = 'static';
        play.style.margin = '0.75rem auto 0';
        play.textContent = '▶';
        play.setAttribute('aria-label', 'Reproducir audio');
        play.onclick = function () { play.classList.add('playing'); speak(s.en); setTimeout(function () { play.classList.remove('playing'); }, 1200); };
        card.appendChild(play);
        exerciseArea.appendChild(card);
        setTimeout(function () { speak(s.en, 0.9); }, 300);
        exerciseArea.appendChild(choiceList(optionsFor(s, 'en'), null, 'en'));

        enableChoiceCheck(s.en, null, 'Escucha otra vez y fíjate en qué palabras cambian.');
    }

    /* --- type 2: read English, choose the Spanish --- */
    function renderMultipleChoice(s) {
        exerciseArea.appendChild(prompt('¿Qué significa esta oración?'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
        en.lang = 'en';
        en.textContent = s.en;
        card.appendChild(en);
        card.appendChild(speakButton(s.en));
        exerciseArea.appendChild(card);
        exerciseArea.appendChild(choiceList(optionsFor(s, 'es'), null, 'es'));

        enableChoiceCheck(s.es, null, 'Fíjate en el tiempo verbal y en si el sentido cambia.');
    }

    /* --- type 3: read Spanish, choose the English --- */
    function renderSpanishToEnglish(s) {
        exerciseArea.appendChild(prompt('¿Cómo se dice esta oración en inglés?'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var es = document.createElement('p');
        es.className = 'sentence-es';
        es.style.margin = '0';
        es.textContent = s.es;
        card.appendChild(es);
        exerciseArea.appendChild(card);
        exerciseArea.appendChild(choiceList(optionsFor(s, 'en'), null, 'en'));

        enableChoiceCheck(s.en, null, 'Varias opciones parecen traducidas: mira el tiempo verbal.');
    }

    /* --- type 3: type the Spanish translation --- */
    function renderTranslate(s) {
        exerciseArea.appendChild(prompt('Escribe la traducción', 'Tómate el tiempo que necesites'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
        en.lang = 'en';
        en.textContent = s.en;
        card.appendChild(en);
        card.appendChild(speakButton(s.en));
        exerciseArea.appendChild(card);

        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.placeholder = 'Escribe en español...';
        input.setAttribute('aria-label', 'Tu traducción');
        input.addEventListener('input', function () {
            checkBtn.disabled = input.value.trim().length === 0;
        });
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') checkBtn.click(); });
        exerciseArea.appendChild(input);

        checkBtn.onclick = function () {
            var ok = looseMatch(input.value, s.es);
            input.classList.remove('right', 'wrong');
            if (!ok) input.classList.add('wrong');
            resolve(ok, ok ? null : 'Correcto: ' + s.es);
        };
        checkBtn.disabled = true;
    }

    /* --- type 4: word bank (build the English sentence) --- */
        function renderWordBank(s) {
        var fillersSeen = [];
        exerciseArea.appendChild(prompt('Ordena las palabras para formar la oración', 'El orden importa'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var es = document.createElement('p');
        es.className = 'sentence-es';
        es.style.margin = '0';
        es.textContent = s.es;
        card.appendChild(es);
        exerciseArea.appendChild(card);

        var target = s.en.replace(/\.$/, '').split(/\s+/);

        /*
         * Filler tiles must never duplicate a word that is already in the
         * target sentence. If a filler repeated "the" while the target also had
         * "the", the learner could satisfy the count with the wrong tile and
         * the sentence could never be built correctly.
         */
        var targetWords = {};
        target.forEach(function (t) { targetWords[normalize(t)] = true; });

        var fillers = fillerWords(s, 6).filter(function (w) {
            if (targetWords[normalize(w)]) return false;
            return fillersSeen.indexOf(normalize(w)) === -1;
        }).filter(function (w, i, arr) {
            if (arr.indexOf(w) !== i) return false;   // de-dup by text
            fillersSeen.push(normalize(w));
            return true;
        }).slice(0, 3);

        var pool = shuffle(target.map(function (t, i) {
            return { text: t, correct: true, id: 'c' + i };
        }).concat(fillers.map(function (t, i) {
            return { text: t, correct: false, id: 'x' + i };
        })));
        var used = [];

        /* tile handlers re-arm the checker while the step is still unanswered */
        function armCheck() {
            checkBtn.onclick = function () {
                if (chosen.length !== target.length) return;
                grade();
            };
        }

        /* declared up front: paint() and the tile handlers all reference these,
           and paint() runs before the elements are appended below */
        var counter = document.createElement('p');
        counter.className = 'bank-counter';

        function setCounter() {
            counter.textContent = chosen.length + ' / ' + target.length;
        }

        /*
         * The learner needs to see why an attempt failed and be able to try
         * again without re-clicking every tile. A wrong order previously just
         * turned everything red with no per-word hint, which reads as a dead
         * exercise.
         */
        var attempt = null;

        var slots = document.createElement('div');
        slots.className = 'answer-slots empty';
        var bank = document.createElement('div');
        bank.className = 'word-bank';

        var chosen = [];

        function markAttempt() {
            if (!attempt) return;
            var placed = slots.querySelectorAll('.word-chip');
            for (var i = 0; i < placed.length; i++) {
                placed[i].classList.remove('slot-ok', 'slot-bad');
                if (i >= attempt.length) continue;
                placed[i].classList.add(attempt[i] ? 'slot-ok' : 'slot-bad');
            }
        }

        function paint() {
            setCounter();
            slots.innerHTML = '';
            slots.classList.toggle('empty', chosen.length === 0);
            chosen.forEach(function (entry, i) {
                var c = document.createElement('button');
                c.type = 'button';
                c.className = 'word-chip';
                /* set at creation so it travels with the tile when the learner
                   moves it between the bank and the answer slots */
                c.lang = 'en';
                c.textContent = entry.text;
                /* tapping a placed word returns it to the bank */
                c.title = 'Toca para devolver esta palabra';
                c.setAttribute('aria-label', entry.text + ', toca para quitar');
                c.onclick = function () {
                    if (session && session.answered) return;
                    chosen.splice(i, 1);
                    used = used.filter(function (u) { return u !== entry.id; });
                    attempt = null;
                    setCounter();
                    paint();
                    checkBtn.disabled = chosen.length !== target.length;
                    /* editing after a wrong answer counts as a fresh try */
                    if (checkBtn.textContent === 'Comprobar') armCheck();
                };
                slots.appendChild(c);
            });
            if (attempt) markAttempt();

            bank.innerHTML = '';
            pool.forEach(function (entry) {
                if (used.indexOf(entry.id) >= 0) return;
                var c = document.createElement('button');
                c.type = 'button';
                c.className = 'word-chip';
                c.lang = 'en';
                c.textContent = entry.text;
                c.onclick = function () {
                    if (session && session.answered) return;
                    used.push(entry.id);
                    chosen.push(entry);
                    attempt = null;
                    setCounter();
                    paint();
                    checkBtn.disabled = chosen.length !== target.length;
                    if (checkBtn.textContent === 'Comprobar') armCheck();
                };
                bank.appendChild(c);
            });
        }

        /* grades the current arrangement and either resolves or explains */
        function grade() {
            if (chosen.length !== target.length) return;

            var built = chosen.map(function (w) { return w.text; });

            /* compare against `target`, which has the trailing period stripped;
               comparing to s.en always failed even for a correct arrangement */
            var ok = normalize(built.join(' ')) === normalize(target.join(' '));

            if (ok) {
                attempt = null;
                resolve(true, null);
                return;
            }

            attempt = built.map(function (word, i) {
                return normalize(word) === normalize(target[i]);
            });

            var correctPlaces = attempt.filter(Boolean).length;
            var rightWords = attempt.filter(function (okAt, i) {
                return okAt || target.indexOf(normalize(built[i])) >= 0;
            }).length;

            var detail;
            if (correctPlaces === 0 && rightWords === target.length) {
                detail = 'Tienes todas las palabras, pero en otro orden. Revísalo.';
            } else if (rightWords < target.length) {
                detail = 'Faltan ' + (target.length - rightWords) + ' palabra(s) de la oración.';
            } else {
                detail = 'La palabra "' + built[attempt.indexOf(false)] + '" va en otro lugar.';
            }

            paint();
            /* The step is scored once. The per-word marks stay visible and
               "Continuar" moves on; overriding it here left learners stuck. */
            resolve(false, detail + ' Correcto: ' + s.en);
        }

        var hint = document.createElement('p');
        hint.className = 'bank-hint';
        hint.textContent = 'Toca una palabra puesta para devolverla.';

        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'bank-clear';
        clearBtn.textContent = 'Vaciar';
        clearBtn.onclick = function () {
            if (session && session.answered) return;
            chosen = [];
            used = [];
            attempt = null;
            setCounter();
            paint();
            checkBtn.disabled = true;
        };

        var bar = document.createElement('div');
        bar.className = 'bank-bar';
        bar.appendChild(counter);
        bar.appendChild(clearBtn);

        paint();
        exerciseArea.appendChild(bar);
        exerciseArea.appendChild(slots);
        exerciseArea.appendChild(bank);
        exerciseArea.appendChild(hint);

        armCheck();
        checkBtn.disabled = true;
    }

    /* --- type 5: speak back (repeat and self-check) --- */
    function renderSpeakBack(s) {
        exerciseArea.appendChild(prompt('Escucha y repite en voz alta', 'Después revela la traducción'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
        en.lang = 'en';
        en.textContent = s.en;
        card.appendChild(en);

        var btn = speakButton(s.en);
        btn.textContent = '▶';
        card.appendChild(btn);

        var es = document.createElement('p');
        es.className = 'sentence-es hidden-es';
        es.setAttribute('aria-hidden', 'true');
        es.textContent = s.es;
        card.appendChild(es);
        exerciseArea.appendChild(card);

        var reveal = document.createElement('button');
        reveal.type = 'button';
        reveal.className = 'btn btn-secondary';
        reveal.textContent = 'Revelar significado';
        reveal.style.marginBottom = '1.25rem';
        reveal.onclick = function () {
            es.classList.remove('hidden-es');
            es.removeAttribute('aria-hidden');
            reveal.remove();
        };
        exerciseArea.appendChild(reveal);

        checkBtn.onclick = function () { resolve(true, null); };
        checkBtn.disabled = false;
    }

    /* ================= shared widgets ================= */

    function speakButton(text) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'speak-btn';
        b.textContent = '🔊';
        b.setAttribute('aria-label', 'Escuchar la oración');
        b.onclick = function () { b.classList.add('playing'); speak(text); setTimeout(function () { b.classList.remove('playing'); }, 1200); };
        return b;
    }

    /*
     * enableTarget: the button that gets enabled when an option is picked.
     * Defaults to the lesson check button. The placement screen passes its own,
     * otherwise selecting an option would enable the wrong control.
     */
    /*
     * lang: the language of the option text, so screen readers do not read
     * English options with the page's Spanish voice. Omit it and nothing is
     * set, which keeps older call sites working unchanged.
     */
    function choiceList(options, enableTarget, lang) {
        var target = enableTarget || checkBtn;
        var list = document.createElement('div');
        list.className = 'choice-list';

        options.forEach(function (opt, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'choice';
            btn.dataset.value = opt;
            if (lang) btn.lang = lang;
            var kbd = document.createElement('span');
            kbd.className = 'choice-kbd';
            kbd.textContent = String(i + 1);
            var label = document.createElement('span');
            label.textContent = opt;
            if (lang) label.lang = lang;
            btn.appendChild(kbd);
            btn.appendChild(label);
            btn.onclick = function () {
                if (btn.disabled) return;
                Array.prototype.forEach.call(list.querySelectorAll('.choice'), function (b) {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                target.disabled = false;
            };
            list.appendChild(btn);
        });
        return list;
    }

    /*
     * Wires the Comprobar button for choice-based exercises.
     * session.pick holds the value of the option the learner selected.
     */
    function enableChoiceCheck(correctValue, successDetail, failDetail) {
        checkBtn.disabled = true;
        checkBtn.onclick = function () {
            var picked = exerciseArea.querySelector('.choice.selected');
            if (!picked || session.answered) return;
            var ok = normalize(picked.dataset.value) === normalize(correctValue);
            if (ok) {
                picked.classList.add('correct');
                revealCorrect(correctValue);
                resolve(true, successDetail || null);
            } else {
                picked.classList.add('wrong');
                loseHeart();
                renderHeartsLive();
                revealCorrect(correctValue);
                resolve(false, failDetail || 'La respuesta correcta está resaltada.');
            }
        };
    }

    /* marks the correct option green and locks further picking */
    function revealCorrect(correctValue) {
        var buttons = exerciseArea.querySelectorAll('.choice');
        Array.prototype.forEach.call(buttons, function (b) {
            if (normalize(b.dataset.value) === normalize(correctValue)) b.classList.add('correct');
            b.disabled = true;
        });
    }

    /*
     * Filler tiles for the word bank. Previously a handful of random function
     * words, which produced nonsense like "the the and". Now each filler is a
     * word that actually appears elsewhere in the same lesson's English, so the
     * learner can rule them out on meaning rather than guessing.
     */
    function fillerWords(s, count) {
        var lesson = lessonOf(s);
        var seen = {};
        seen[s.en] = true;

        var pool = [];
        if (lesson) {
            lesson.sentences.forEach(function (other) {
                if (other === s) return;
                String(other.en).replace(/[.,!?;:]/g, '').split(/\s+/).forEach(function (word) {
                    if (word.length < 2 || seen[word]) return;
                    if (pool.indexOf(word) >= 0) return;
                    pool.push(word);
                });
            });
        }

        if (pool.length < count) {
            ['the', 'a', 'to', 'and', 'is', 'not', 'we', 'you'].forEach(function (w) {
                if (pool.length >= count || seen[w] || pool.indexOf(w) >= 0) return;
                pool.push(w);
            });
        }

        return shuffle(pool).slice(0, count);
    }

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    function looseMatch(input, target) {
        var a = normalize(input);
        var b = normalize(target);
        if (a === b) return true;
        var strip = function (s) { return s.replace(/\b(el|la|los|las|un|una|de|del|que|y|o|a|en)\b/g, ' ').replace(/\s+/g, ' ').trim(); };
        return strip(a) !== '' && strip(a) === strip(b);
    }

    /* ================= resolve / feedback ================= */

    function resolve(ok, detail) {
        if (session.answered) return;
        session.answered = true;

        var xp = XP_PER_SENTENCE;
        var item = session.queue[session.step];
        if (item) item.result = ok;

        if (ok) {
            session.correct++;
            state.dailyXp += xp;
            state.xp += xp;
        } else {
            session.mistakes++;
            if (session.kind === 'lesson') {
                state.missed[session.index] = (state.missed[session.index] || 0) + 1;
            }
        }

        emit('answer', { item: item, sentence: item && item.sentence, ok: ok, session: session });

        var icon = ok ? '✅' : '❌';
        var title = ok ? '¡Correcto!' : 'Respuesta incorrecta';
        feedbackBox.className = 'feedback ' + (ok ? 'ok' : 'bad');
        var footer = feedbackBox.closest ? feedbackBox.closest('.lesson-footer') : null;
        if (footer) {
            footer.classList.remove('ok-state', 'bad-state');
            footer.classList.add(ok ? 'ok-state' : 'bad-state');
        }
        feedbackBox.innerHTML = '<span>' + icon + '</span><div><strong>' + title + '</strong>' +
            (detail ? '<span class="feedback-detail">' + escapeHtml(detail) + '</span>' : '') + '</div>';

        checkBtn.className = 'btn btn-primary btn-check';
        checkBtn.textContent = 'Continuar';
        checkBtn.disabled = false;
        checkBtn.onclick = function () {
            if (footer) footer.classList.remove('ok-state', 'bad-state');
            session.step++;
            renderStep();
        };
        checkBtn.focus();
        save();
        renderGoal();
        renderStats();
        renderLevel();
        renderRivals();
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    /* ================= finish ================= */

    function finishLesson() {
        var perfect = session.mistakes === 0;
        var idx = session.index;
        var seconds = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
        var isLesson = session.kind === 'lesson';

        if (isLesson) {
            if (!state.completed[idx]) {
                state.completed[idx] = true;
                state.lessonsDone++;
                state.seenSentences += session.lesson.sentences.length;
            }
            if (perfect) state.perfectLessons++;
            state.missed[idx] = session.mistakes;
        }

        if (heartsNow() < MAX_HEARTS) {
            state.hearts = Math.min(MAX_HEARTS, heartsNow() + 1);
            state.heartsTs = Date.now();
        }

        if (session.correct > 0) {
            var today = todayKey();
            if (!state.studyHistory) state.studyHistory = {};
            state.studyHistory[today] = true;
            if (state.lastStudyDate !== today) {
                state.streak = (state.lastStudyDate && daysBetween(state.lastStudyDate, today) === 1) ? state.streak + 1 : 1;
                state.lastStudyDate = today;
                state.bestStreak = Math.max(state.bestStreak, state.streak);
            }
            // custom sessions (challenge, review) set their own rewards
            if (isLesson) state.gems += 3;
        }

        save();
        if (storageProtected === null) checkStorage();
        var summary = {
            correct: session.correct,
            mistakes: session.mistakes,
            total: gradedItems(session).length,
            perfect: perfect,
            session: session
        };
        if (session.onFinish) {
            try { session.onFinish(summary); } catch (e) {
                if (window.console && console.error) console.error('[DailyGame] onFinish failed', e);
            }
        }
        emit('sessionFinish', summary);
        save();
        var newBadges = renderBadges();
        showResult(perfect, seconds, newBadges);
        showScreen('result');
    }

    function spawnConfetti() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var colors = ['#58cc02', '#ffc200', '#1cb0f6', '#ff4b4b', '#a560e8', '#ff9600'];
        for (var i = 0; i < 35; i++) {
            var piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = (Math.random() * 0.7) + 's';
            piece.style.animationDuration = (2 + Math.random() * 1.2) + 's';
            document.body.appendChild(piece);
            (function (p) {
                setTimeout(function () {
                    if (p.parentNode) p.parentNode.removeChild(p);
                }, 3500);
            })(piece);
        }
    }

    function animateCount(el, target, prefix) {
        if (!el) return;
        prefix = prefix || '';
        if (target <= 0) { el.textContent = prefix + '0'; return; }
        var current = 0;
        var step = Math.max(1, Math.ceil(target / 15));
        el.textContent = prefix + '0';
        var timer = setInterval(function () {
            current = Math.min(current + step, target);
            el.textContent = prefix + current;
            if (current >= target) clearInterval(timer);
        }, 40);
    }

    function showResult(perfect, seconds, newBadges) {
        var graded = gradedItems(session);
        var total = Math.max(1, graded.length);
        var acc = Math.round((session.correct / total) * 100);
        var xp = session.correct * XP_PER_SENTENCE;
        var isLesson = session.kind === 'lesson';

        $('result-burst').textContent = perfect ? '🏆' : session.correct > 0 ? '🎉' : '💪';
        if (isLesson) {
            $('result-title').textContent = perfect ? '¡Lección perfecta!' : session.correct > 0 ? '¡Lección completa!' : 'Lección terminada';
            $('result-sub').textContent = 'Lección ' + (session.index + 1) + ' de ' + TOTAL_LESSONS +
                (perfect ? ' · sin errores' : '');
        } else {
            $('result-title').textContent = perfect ? '¡Sin errores!' : '¡Terminado!';
            $('result-sub').textContent = session.title;
        }
        if (session.correct > 0) {
            spawnConfetti();
            animateCount($('res-xp'), xp, '+');
        } else {
            $('res-xp').textContent = '+' + xp;
        }
        $('res-acc').textContent = acc + '%';
        var m = Math.floor(seconds / 60);
        var sec = seconds % 60;
        $('res-time').textContent = m + ':' + (sec < 10 ? '0' : '') + sec;

        var review = $('result-review');
        review.innerHTML = '';
        var shown = [];
        graded.forEach(function (it) {
            var s = it.sentence;
            if (!s || shown.indexOf(s) >= 0) return;
            shown.push(s);
            var d = document.createElement('div');
            d.className = 'review-item' + (it.result === false ? ' review-missed' : '');

            /* built as elements rather than innerHTML so the language of each
               half can be stated: English with lang, Spanish on the default */
            var pEn = document.createElement('p');
            pEn.className = 'review-en';
            pEn.lang = 'en';
            pEn.textContent = s.en;
            var pEs = document.createElement('p');
            pEs.className = 'review-es';
            pEs.textContent = s.es;

            d.appendChild(pEn);
            d.appendChild(pEs);
            review.appendChild(d);
        });

        var nextBtn = $('result-next');
        if (isLesson) {
            nextBtn.hidden = false;
            nextBtn.textContent = (session.index + 1 >= TOTAL_LESSONS) ? 'Volver a empezar' : 'Siguiente lección';
            nextBtn.onclick = function () {
                var next = session.index + 1;
                if (next >= TOTAL_LESSONS) next = 0;
                showScreen('path');
                renderPath();
                startLesson(next);
            };
        } else {
            nextBtn.hidden = true;
            nextBtn.onclick = null;
        }

        $('result-back').onclick = backToPath;

        if (newBadges.length) {
            setTimeout(function () {
                toast('🏅 Logro: ' + newBadges.map(function (b) { return b.name; }).join(', '));
            }, 700);
        }
    }

    /* ================= toast ================= */

    var toastEl = null;
    function toast(msg) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = msg;
        requestAnimationFrame(function () { toastEl.classList.add('show'); });
        setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
    }

    /* ================= speech setup ================= */

    var speechVoice = null;

    /* Prefer a local en-US voice; fall back to any English voice. */
    function pickVoice() {
        var voices = window.speechSynthesis.getVoices() || [];
        var best = null;
        for (var i = 0; i < voices.length; i++) {
            var v = voices[i];
            var lang = (v.lang || '').replace('_', '-').toLowerCase();
            if (lang === 'en-us' && v.localService) { best = v; break; }
            if (!best && lang === 'en-us') best = v;
            if (!best && lang.indexOf('en') === 0) best = v;
        }
        if (best) speechVoice = best;
    }

    /*
     * iOS Safari refuses speechSynthesis until the first speak() call happens
     * inside a user gesture. The first tap anywhere speaks a silent utterance,
     * so the Listen button later works even when speak() runs outside a tap.
     */
    function initSpeech() {
        if (!('speechSynthesis' in window)) return;
        pickVoice();
        if (typeof window.speechSynthesis.addEventListener === 'function') {
            window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
        } else {
            window.speechSynthesis.onvoiceschanged = pickVoice;
        }

        var events = ['pointerdown', 'touchend', 'keydown'];
        function unlock() {
            events.forEach(function (name) {
                document.removeEventListener(name, unlock, true);
            });
            try {
                var u = new SpeechSynthesisUtterance(' ');
                u.volume = 0;
                window.speechSynthesis.speak(u);
            } catch (e) { /* nothing to unlock */ }
        }
        events.forEach(function (name) {
            document.addEventListener(name, unlock, true);
        });
    }

    /* ================= offline + storage ================= */

    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        var host = location.hostname;
        var secure = location.protocol === 'https:' || host === 'localhost' || host === '127.0.0.1';
        if (!secure) return;
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').catch(function () {
                /* offline support is optional; the app works without it */
            });
        });
    }

    function isStandalone() {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            window.navigator.standalone === true;
    }

    function isIOS() {
        var ua = navigator.userAgent || '';
        return /iPad|iPhone|iPod/.test(ua) ||
            (ua.indexOf('Macintosh') !== -1 && navigator.maxTouchPoints > 1);
    }

    var storageProtected = null;

    /*
     * Progress lives only in localStorage. Browsers may evict it (Safari after
     * 7 days without a visit unless the app is on the home screen). Ask for
     * persistent storage once the learner has real progress to lose, and warn
     * only when the browser says no.
     */
    function checkStorage() {
        if (state.lessonsDone < 1) return;
        var storage = navigator.storage;
        if (!storage || typeof storage.persist !== 'function') {
            storageProtected = false;
            renderStorageNotice();
            return;
        }
        storage.persisted()
            .then(function (already) { return already || storage.persist(); })
            .then(function (granted) {
                storageProtected = !!granted;
                renderStorageNotice();
            })
            .catch(function () {
                storageProtected = false;
                renderStorageNotice();
            });
    }

    function renderStorageNotice() {
        var box = $('storage-notice');
        if (!box) return;
        var show = storageProtected === false && !isStandalone() &&
            state.storageNoticeDismissed !== true && state.lessonsDone >= 1;
        box.hidden = !show;
        if (!show) return;

        var how = isIOS()
            ? 'En Safari toca <strong>Compartir</strong> y luego <strong>Agregar a inicio</strong>.'
            : 'Instálala desde el menú del navegador con <strong>Instalar app</strong>.';
        box.innerHTML =
            '<span class="storage-notice__icon" aria-hidden="true">💾</span>' +
            '<p class="storage-notice__text">Tu progreso se guarda solo en este navegador y ' +
            'podría borrarse si pasas días sin entrar. ' + how + '</p>' +
            '<button type="button" class="storage-notice__close" id="storage-notice-close">Entendido</button>';
        $('storage-notice-close').onclick = function () {
            state.storageNoticeDismissed = true;
            save();
            box.hidden = true;
        };
    }

    /* ================= shop modal ================= */

    function updateShop() {
        var gemsVal = $('shop-gems-val');
        if (gemsVal) gemsVal.textContent = state.gems;

        var freezes = state.streakFreeze || 0;
        var freezeStatus = $('freeze-status');
        if (freezeStatus) freezeStatus.textContent = freezes + ' / 2 equipados';

        var freezeBtn = $('buy-freeze-btn');
        if (freezeBtn) {
            if (freezes >= 2) {
                freezeBtn.disabled = true;
                freezeBtn.textContent = 'Lleno (2/2)';
            } else if (state.gems < 20) {
                freezeBtn.disabled = true;
                freezeBtn.textContent = '20 💎';
            } else {
                freezeBtn.disabled = false;
                freezeBtn.textContent = '20 💎';
            }
        }

        var h = heartsNow();
        var heartsStatus = $('hearts-refill-status');
        if (heartsStatus) heartsStatus.textContent = h + ' / ' + MAX_HEARTS + ' vidas';

        var heartsBtn = $('buy-hearts-btn');
        if (heartsBtn) {
            if (h >= MAX_HEARTS) {
                heartsBtn.disabled = true;
                heartsBtn.textContent = 'Lleno (5/5)';
            } else if (state.gems < 15) {
                heartsBtn.disabled = true;
                heartsBtn.textContent = '15 💎';
            } else {
                heartsBtn.disabled = false;
                heartsBtn.textContent = '15 💎';
            }
        }
    }

    var lastFocusedModalTrigger = null;

    function openShop() {
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            return;
        }
        lastFocusedModalTrigger = document.activeElement;
        updateShop();
        var modal = $('shop-modal');
        if (modal) {
            modal.hidden = false;
            var closeBtn = $('shop-close');
            if (closeBtn) closeBtn.focus();
        }
    }

    function closeShop() {
        var modal = $('shop-modal');
        if (modal) modal.hidden = true;
        if (lastFocusedModalTrigger && typeof lastFocusedModalTrigger.focus === 'function') {
            lastFocusedModalTrigger.focus();
            lastFocusedModalTrigger = null;
        }
    }

    function buyStreakFreeze() {
        var freezes = state.streakFreeze || 0;
        if (freezes >= 2) {
            toast('Ya tienes el máximo de congeladores equipados (2/2).');
            return;
        }
        if (state.gems < 20) {
            toast('Necesitas 20 gemas. Completa más lecciones para ganar gemas.');
            return;
        }
        state.gems -= 20;
        state.streakFreeze = freezes + 1;
        save();
        renderStats();
        updateShop();
        toast('¡Congelador de racha equipado! Protegerá tu racha si faltas un día.');
    }

    function buyHeartsRefill() {
        var h = heartsNow();
        if (h >= MAX_HEARTS) {
            toast('Tus vidas ya están al máximo (5/5).');
            return;
        }
        if (state.gems < 15) {
            toast('Necesitas 15 gemas. Completa más lecciones para ganar gemas.');
            return;
        }
        state.gems -= 15;
        state.hearts = MAX_HEARTS;
        state.heartsTs = Date.now();
        save();
        renderStats();
        updateShop();
        toast('¡Vidas recargadas al máximo (5/5)!');
    }

    function initShop() {
        var gemsBtn = $('gems-stat');
        if (gemsBtn) gemsBtn.addEventListener('click', openShop);

        var heartsBtn = $('hearts-stat');
        if (heartsBtn) heartsBtn.addEventListener('click', openShop);

        var closeBtn = $('shop-close');
        if (closeBtn) closeBtn.addEventListener('click', closeShop);

        var buyFreeze = $('buy-freeze-btn');
        if (buyFreeze) buyFreeze.addEventListener('click', buyStreakFreeze);

        var buyHearts = $('buy-hearts-btn');
        if (buyHearts) buyHearts.addEventListener('click', buyHeartsRefill);

        var modal = $('shop-modal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeShop();
            });
        }
    }

    /* ================= calendar modal ================= */

    var MONTH_NAMES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    function renderCalendar() {
        var streakCount = $('cal-streak-count');
        if (streakCount) streakCount.textContent = state.streak + (state.streak === 1 ? ' día' : ' días');

        var streakDesc = $('cal-streak-desc');
        var today = todayKey();
        var studiedToday = !!(state.studyHistory && state.studyHistory[today]);
        if (streakDesc) {
            streakDesc.textContent = studiedToday
                ? '¡Ya practicaste hoy! Tu racha está protegida.'
                : '¡Practica hoy para mantener encendida tu racha!';
        }

        var bestStreak = $('cal-best-streak');
        if (bestStreak) {
            var b = Math.max(state.bestStreak || 0, state.streak || 0);
            bestStreak.textContent = b + (b === 1 ? ' día' : ' días');
        }

        var freezeCount = $('cal-freeze-count');
        if (freezeCount) {
            var f = state.streakFreeze || 0;
            freezeCount.textContent = f + (f === 1 ? ' activo' : ' activos');
        }

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();

        var header = $('cal-month-header');
        if (header) header.textContent = MONTH_NAMES_ES[month] + ' ' + year;

        var grid = $('cal-days-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Monday-based: 0=Mon, 1=Tue, ..., 6=Sun
        var firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7;
        var totalDays = new Date(year, month + 1, 0).getDate();

        for (var i = 0; i < firstDayIdx; i++) {
            var empty = document.createElement('div');
            empty.className = 'cal-day cal-day--empty';
            grid.appendChild(empty);
        }

        for (var d = 1; d <= totalDays; d++) {
            var key = year + '-' + (month + 1) + '-' + d;
            var hist = state.studyHistory && state.studyHistory[key];
            var isToday = key === today;

            var cell = document.createElement('div');
            cell.className = 'cal-day';
            cell.textContent = String(d);

            if (hist === 'freeze') {
                cell.classList.add('frozen');
                cell.title = 'Racha protegida con congelador';
            } else if (hist) {
                cell.classList.add('active');
                cell.title = 'Día de práctica completado';
            }

            if (isToday) {
                cell.classList.add('today');
            }

            grid.appendChild(cell);
        }
    }

    function openCalendar() {
        if (!state.nickname || nicknameProblem(state.nickname)) {
            showNickModal(false);
            return;
        }
        lastFocusedModalTrigger = document.activeElement;
        renderCalendar();
        var modal = $('calendar-modal');
        if (modal) {
            modal.hidden = false;
            var closeBtn = $('cal-close');
            if (closeBtn) closeBtn.focus();
        }
    }

    function closeCalendar() {
        var modal = $('calendar-modal');
        if (modal) modal.hidden = true;
        if (lastFocusedModalTrigger && typeof lastFocusedModalTrigger.focus === 'function') {
            lastFocusedModalTrigger.focus();
            lastFocusedModalTrigger = null;
        }
    }

    function initCalendar() {
        var streakBtn = $('streak-stat');
        if (streakBtn) streakBtn.addEventListener('click', openCalendar);

        var closeBtn = $('cal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeCalendar);

        var modal = $('calendar-modal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeCalendar();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                var nick = $('nick-modal');
                if (nick && !nick.hidden) {
                    if (!state.nickname || nicknameProblem(state.nickname)) {
                        shakeNickModal();
                        return;
                    }
                    closeNickModal(true);
                    return;
                }
                var shop = $('shop-modal');
                if (shop && !shop.hidden) {
                    closeShop();
                    return;
                }
                var cal = $('calendar-modal');
                if (cal && !cal.hidden) {
                    closeCalendar();
                    return;
                }
            }
        });
    }

    /* ================= boot ================= */

    function init() {
        /*
         * Upgrade saved state before anything reads it. The migration may
         * clear a stale placement result so the test is offered once more;
         * it never touches progress, and it never re-offers the test to
         * someone who deliberately skipped it.
         */
        if (window.DailyMigrations && window.DailyMigrations.run) {
            if (window.DailyMigrations.run(state).length) save();
        }
        applyName();
        rollover();
        ensureRivals();
        renderStats();
        renderGoal();
        renderPath();
        renderLevel();
        renderRivals();
        renderBadges();

        initNickname();
        initPlacement();
        initSpeech();
        initShop();
        initCalendar();
        registerServiceWorker();
        checkStorage();

        var guideBtn = $('unit-guide-btn');
        if (guideBtn) {
            guideBtn.addEventListener('click', function () {
                var pb = $('pb-open');
                if (pb) {
                    pb.click();
                } else {
                    toast('Completa tu primera lección para desbloquear la guía de frases.');
                }
            });
        }

        $('quit-lesson').onclick = backToPath;

        // hearts tick
        setInterval(function () {
            renderStats();
            if (screenLesson.classList.contains('hidden') === false) renderHeartsLive();
        }, 30000);

        save();

        booted = true;
        readyCallbacks.splice(0).forEach(function (fn) {
            try { fn(api); } catch (e) {
                if (window.console && console.error) console.error('[DailyGame] ready callback failed', e);
            }
        });
    }

    /* ================= public API for features/*.js ================= */

    var api = {
        version: 1,

        /* data */
        lessons: LESSONS,
        totalLessons: TOTAL_LESSONS,
        xpPerSentence: XP_PER_SENTENCE,
        get state() { return state; },
        get session() { return session; },
        save: save,
        todayKey: todayKey,
        daysBetween: daysBetween,
        lessonOf: lessonOf,

        /* learner's first name; personalize() fills {name}/{other} in any text */
        firstName: learnerName,
        personalize: personalize,

        /* per-feature persisted storage inside the main save: state.features[name] */
        store: function (name) {
            if (typeof name !== 'string' || name === '__proto__' || name === 'constructor' || name === 'prototype') {
                throw new Error('Invalid feature store name');
            }
            if (!state.features || typeof state.features !== 'object') state.features = {};
            if (!Object.prototype.hasOwnProperty.call(state.features, name) || !state.features[name] || typeof state.features[name] !== 'object') {
                state.features[name] = {};
            }
            return state.features[name];
        },

        /* lesson DOM */
        get exerciseArea() { return exerciseArea; },
        get checkBtn() { return checkBtn; },
        get feedbackBox() { return feedbackBox; },

        /* exercise toolkit */
        prompt: prompt,
        speak: speak,
        speakButton: speakButton,
        choiceList: function (options, lang) { return choiceList(options, undefined, lang); },
        enableChoiceCheck: enableChoiceCheck,
        revealCorrect: revealCorrect,
        optionsFor: optionsFor,
        normalize: normalize,
        looseMatch: looseMatch,
        shuffle: shuffle,
        escapeHtml: escapeHtml,
        resolve: resolve,
        advance: advance,
        loseHeart: function () {
            var ok = loseHeart();
            renderHeartsLive();
            return ok;
        },

        /* UI */
        toast: toast,
        backToPath: backToPath,
        refresh: function () {
            renderStats();
            renderGoal();
            renderLevel();
            renderRivals();
        },
        openShop: openShop,
        openCalendar: openCalendar,
        slot: function (name) { return $('feature-slot-' + name); },

        /* sessions */
        startLesson: startLesson,
        startCustomSession: startCustomSession,

        /* registration */
        registerExercise: function (type, render) {
            if (typeof type === 'string' && typeof render === 'function') customBuilders[type] = render;
        },
        registerQueueTransform: function (fn) {
            if (typeof fn === 'function') queueTransforms.push(fn);
        },
        on: function (name, fn) {
            if (typeof fn !== 'function') return;
            (listeners[name] = listeners[name] || []).push(fn);
        },
        ready: function (fn) {
            if (typeof fn !== 'function') return;
            if (booted) fn(api);
            else readyCallbacks.push(fn);
        }
    };

    window.DailyGame = api;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
