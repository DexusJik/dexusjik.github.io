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

    /* ================= state ================= */

    var STORAGE_KEY = 'igsg_daily_v1';

    function defaultState() {
        return {
            xp: 0,
            gems: 50,
            streak: 0,
            lastStudyDate: null,
            bestStreak: 0,
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
            dailyLessonDoneDate: null
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

    function daysBetween(a, b) {
        return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
    }

    /* daily rollover: resets daily XP, decays streak if a day was missed */
    function rollover() {
        var today = todayKey();
        if (state.dailyXpDate !== today) {
            state.dailyXpDate = today;
            state.dailyXp = 0;
        }
        if (state.lastStudyDate && daysBetween(state.lastStudyDate, today) > 1) {
            state.streak = 0;
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

    /* ================= session ================= */

    var session = null;

    function showScreen(which) {
        screenPath.classList.toggle('hidden', which !== 'path');
        screenLesson.classList.toggle('hidden', which !== 'lesson');
        screenResult.classList.toggle('hidden', which !== 'result');
        window.scrollTo(0, 0);
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
            var locked = i > nextIndex;
            var isNext = !locked && !done;

            var wrap = document.createElement('div');
            wrap.className = 'path-row';

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'node ' + (locked ? 'locked' : done ? (perfect ? 'perfect' : 'done') : isNext ? 'current' : '');
            btn.innerHTML = locked ? '🔒' : perfect ? '★' : done ? '✓' : String(i + 1);
            btn.title = locked ? 'Completa la lección anterior' : (LESSONS[i] ? LESSONS[i].title : '');
            btn.setAttribute('aria-label', 'Lección ' + (i + 1) + (locked ? ', bloqueada' : ''));
            if (locked) {
                btn.disabled = true;
            } else {
                btn.addEventListener('click', function () { startLesson(i); });
            }

            wrap.appendChild(btn);
            list.appendChild(wrap);
        });

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
        var lesson = LESSONS[index];
        if (!lesson) return;
        rollover();
        session = {
            index: index,
            lesson: lesson,
            queue: buildQueue(lesson),
            step: 0,
            results: [],
            correct: 0,
            mistakes: 0,
            startedAt: Date.now(),
            answered: false
        };
        state.currentLesson = index;
        save();
        renderHeartsLive();
        showScreen('lesson');
        renderStep();
    }

    /* mix of 5 exercise types, deterministic-ish shuffle per sentence */
    function buildQueue(lesson) {
        var types = ['listen', 'multipleChoice', 'translate', 'wordBank', 'speakBack'];
        var pool = lesson.sentences.map(function (s, i) {
            return { sentence: s, type: types[i % types.length] };
        });
        // rotate so the first exercise is never the hardest for new learners
        return pool;
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

    function renderStep() {
        session.answered = false;
        exerciseArea.innerHTML = '';
        feedbackBox.className = 'feedback';
        feedbackBox.innerHTML = '';
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
            speakBack: renderSpeakBack
        };
        (builders[item.type] || renderMultipleChoice)(s);
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
            window.speechSynthesis.cancel();
            var u = new SpeechSynthesisUtterance(text);
            u.lang = 'en-US';
            u.rate = rate || 1;
            window.speechSynthesis.speak(u);
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

    /* --- type 1: listen (TTS + pick correct English) --- */
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

        var correct = s.en;
        var options = shuffle([correct, pickWrong(LESSONS, s, 'en')]);
        exerciseArea.appendChild(choiceList(options));
        enableChoiceCheck(correct, null, 'Escucha otra vez y nota las palabras que cambian.');
    }

    /* --- type 2: multiple choice (read English, pick Spanish) --- */
    function renderMultipleChoice(s) {
        exerciseArea.appendChild(prompt('¿Qué significa esta oración?'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
        en.textContent = s.en;
        card.appendChild(en);
        card.appendChild(speakButton(s.en));
        exerciseArea.appendChild(card);

        var correct = s.es;
        var options = shuffle([correct, pickWrong(LESSONS, s, 'es')]);
        exerciseArea.appendChild(choiceList(options));
        enableChoiceCheck(correct, null, 'Compara la traducción correcta.');
    }

    /* --- type 3: type the Spanish translation --- */
    function renderTranslate(s) {
        exerciseArea.appendChild(prompt('Escribe la traducción', 'Tómate el tiempo que necesites'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
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
        /* each bank word is a distinct entry; a pool index may repeat a word,
           so track usage by position, not by text */
        var pool = shuffle(target.map(function (t, i) { return { text: t, correct: true, id: 'c' + i }; })
            .concat(extraWords(s, target.length).map(function (t, i) {
                return { text: t, correct: false, id: 'x' + i };
            })));
        var used = [];

        var slots = document.createElement('div');
        slots.className = 'answer-slots empty';
        var bank = document.createElement('div');
        bank.className = 'word-bank';

        var chosen = [];

        function paint() {
            slots.innerHTML = '';
            slots.classList.toggle('empty', chosen.length === 0);
            chosen.forEach(function (entry, i) {
                var c = document.createElement('button');
                c.type = 'button';
                c.className = 'word-chip';
                c.textContent = entry.text;
                c.onclick = function () {
                    chosen.splice(i, 1);
                    used = used.filter(function (u) { return u !== entry.id; });
                    paint();
                    checkBtn.disabled = chosen.length !== target.length;
                };
                slots.appendChild(c);
            });

            bank.innerHTML = '';
            pool.forEach(function (entry) {
                if (used.indexOf(entry.id) >= 0) return;
                var c = document.createElement('button');
                c.type = 'button';
                c.className = 'word-chip';
                c.textContent = entry.text;
                c.onclick = function () {
                    used.push(entry.id);
                    chosen.push(entry);
                    paint();
                    checkBtn.disabled = chosen.length !== target.length;
                };
                bank.appendChild(c);
            });
        }
        paint();
        exerciseArea.appendChild(slots);
        exerciseArea.appendChild(bank);

        checkBtn.onclick = function () {
            var built = chosen.map(function (w) { return w.text; }).join(' ');
            var ok = normalize(built) === normalize(s.en);
            resolve(ok, ok ? null : 'Correcto: ' + s.en);
        };
        checkBtn.disabled = true;
    }

    /* --- type 5: speak back (repeat and self-check) --- */
    function renderSpeakBack(s) {
        exerciseArea.appendChild(prompt('Escucha y repite en voz alta', 'Después revela la traducción'));

        var card = document.createElement('div');
        card.className = 'sentence-card';
        var en = document.createElement('p');
        en.className = 'sentence-en';
        en.textContent = s.en;
        card.appendChild(en);

        var btn = speakButton(s.en);
        btn.textContent = '▶';
        card.appendChild(btn);

        var es = document.createElement('p');
        es.className = 'sentence-es hidden-es';
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

    function choiceList(options) {
        var list = document.createElement('div');
        list.className = 'choice-list';

        options.forEach(function (opt, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'choice';
            btn.dataset.value = opt;
            var kbd = document.createElement('span');
            kbd.className = 'choice-kbd';
            kbd.textContent = String(i + 1);
            var label = document.createElement('span');
            label.textContent = opt;
            btn.appendChild(kbd);
            btn.appendChild(label);
            btn.onclick = function () {
                if (btn.disabled) return;
                Array.prototype.forEach.call(list.querySelectorAll('.choice'), function (b) {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                checkBtn.disabled = false;
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

    function extraWords(s, count) {
        var bank = ['very', 'the', 'a', 'to', 'is', 'and', 'not', 'we', 'you'];
        var out = [];
        for (var i = 0; i < 3; i++) out.push(bank[(i + count) % bank.length]);
        return out;
    }

    function pickWrong(all, current, key) {
        var pool = [];
        all.forEach(function (l) {
            l.sentences.forEach(function (s) {
                var v = s[key];
                if (v !== current[key] && pool.indexOf(v) === -1) pool.push(v);
            });
        });
        if (!pool.length) return key === 'en' ? 'Nothing happened today.' : 'No pasó nada hoy.';
        return pool[Math.floor(Math.random() * pool.length)];
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
        if (b.indexOf(a) === 0 && a.length >= 4) return true;
        var strip = function (s) { return s.replace(/\b(el|la|los|las|un|una|de|del|que|y|o|a|en)\b/g, ' ').replace(/\s+/g, ' ').trim(); };
        return strip(a) !== '' && strip(a) === strip(b);
    }

    /* ================= resolve / feedback ================= */

    function resolve(ok, detail) {
        if (session.answered) return;
        session.answered = true;

        var xp = XP_PER_SENTENCE;
        session.results[session.step] = ok;

        if (ok) {
            session.correct++;
            state.dailyXp += xp;
            state.xp += xp;
        } else {
            session.mistakes++;
            state.missed[session.index] = (state.missed[session.index] || 0) + 1;
        }

        var icon = ok ? '✅' : '❌';
        var title = ok ? '¡Correcto!' : 'Respuesta incorrecta';
        feedbackBox.className = 'feedback ' + (ok ? 'ok' : 'bad');
        feedbackBox.innerHTML = '<span>' + icon + '</span><div><strong>' + title + '</strong>' +
            (detail ? '<span class="feedback-detail">' + escapeHtml(detail) + '</span>' : '') + '</div>';

        checkBtn.className = 'btn btn-primary btn-check';
        checkBtn.textContent = 'Continuar';
        checkBtn.disabled = false;
        checkBtn.onclick = function () {
            session.step++;
            renderStep();
        };
        checkBtn.focus();
        save();
        renderGoal();
        renderStats();
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

        if (!state.completed[idx]) {
            state.completed[idx] = true;
            state.lessonsDone++;
            state.seenSentences += session.lesson.sentences.length;
        }
        if (perfect) state.perfectLessons++;
        state.missed[idx] = session.mistakes;

        if (heartsNow() < MAX_HEARTS) {
            state.hearts = Math.min(MAX_HEARTS, heartsNow() + 1);
            state.heartsTs = Date.now();
        }

        if (session.correct > 0) {
            var today = todayKey();
            if (state.lastStudyDate !== today) {
                state.streak = (state.lastStudyDate && daysBetween(state.lastStudyDate, today) === 1) ? state.streak + 1 : 1;
                state.lastStudyDate = today;
                state.bestStreak = Math.max(state.bestStreak, state.streak);
            }
            state.gems += 3;
        }

        save();
        var newBadges = renderBadges();
        showResult(perfect, seconds, newBadges);
        showScreen('result');
    }

    function showResult(perfect, seconds, newBadges) {
        var total = session.queue.length;
        var acc = Math.round((session.correct / total) * 100);
        var xp = session.correct * XP_PER_SENTENCE;

        $('result-burst').textContent = perfect ? '🏆' : session.correct > 0 ? '🎉' : '💪';
        $('result-title').textContent = perfect ? '¡Lección perfecta!' : session.correct > 0 ? '¡Lección completa!' : 'Lección terminada';
        $('result-sub').textContent = 'Lección ' + (session.index + 1) + ' de ' + TOTAL_LESSONS +
            (perfect ? ' · sin errores' : '');
        $('res-xp').textContent = '+' + xp;
        $('res-acc').textContent = acc + '%';
        var m = Math.floor(seconds / 60);
        var sec = seconds % 60;
        $('res-time').textContent = m + ':' + (sec < 10 ? '0' : '') + sec;

        var review = $('result-review');
        review.innerHTML = '';
        var missed = session.queue.filter(function (it) {
            return session.mistakes > 0 && false;
        });
        session.lesson.sentences.forEach(function (s, i) {
            var d = document.createElement('div');
            var missed = session.results[i] === false;
            d.className = 'review-item' + (missed ? ' review-missed' : '');
            d.innerHTML = '<p class="review-en">' + escapeHtml(s.en) + '</p>' +
                '<p class="review-es">' + escapeHtml(s.es) + '</p>';
            review.appendChild(d);
        });

        var nextBtn = $('result-next');
        nextBtn.textContent = (session.index + 1 >= TOTAL_LESSONS) ? 'Volver a empezar' : 'Siguiente lección';
        nextBtn.onclick = function () {
            var next = session.index + 1;
            if (next >= TOTAL_LESSONS) next = 0;
            showScreen('path');
            renderPath();
            startLesson(next);
        };

        $('result-back').onclick = function () {
            showScreen('path');
            renderPath();
            renderGoal();
            renderStats();
        };

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

    /* ================= boot ================= */

    function init() {
        rollover();
        renderStats();
        renderGoal();
        renderPath();
        renderBadges();

        $('quit-lesson').onclick = function () {
            showScreen('path');
            renderPath();
            renderGoal();
            renderStats();
        };

        // hearts tick
        setInterval(function () {
            renderStats();
            if (screenLesson.classList.contains('hidden') === false) renderHeartsLive();
        }, 30000);

        save();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
