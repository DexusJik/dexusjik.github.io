/*
 * features/fillblank.js — fill-in-the-blank exercise.
 * Options come only from the hand-authored `we` variants of the same sentence.
 */
(function () {
    'use strict';

    var G = window.DailyGame;
    if (!G) return;

    var TYPE = 'fillBlank';
    var MIN_DISTRACTORS = 2;
    var MAX_DISTRACTORS = 3;
    var NON_WORD = '[^A-Za-z0-9\\u00C0-\\u024F]*';
    var EDGE = new RegExp('^(' + NON_WORD + ')([\\s\\S]*?)(' + NON_WORD + ')$');

    function splitToken(tok) {
        var m = EDGE.exec(tok);
        return { lead: m[1], core: m[2], trail: m[3] };
    }

    function keyOf(core) {
        return core.replace(/[\u2019\u2018]/g, "'").toLowerCase();
    }

    function tokenize(text) {
        var raw = String(text || '').trim();
        return raw ? raw.split(/\s+/) : [];
    }

    /*
     * Returns { pos, correct, distractors[], before, after } or null.
     * A variant is usable when it has the same token count as `en` and differs
     * in exactly one token (compared without edge punctuation, case-insensitive).
     */
    function computeBlank(sentence) {
        if (!sentence || typeof sentence.en !== 'string' || !sentence.we || !sentence.we.length) return null;

        var enTokens = tokenize(sentence.en);
        if (enTokens.length < 2) return null;
        var enParts = enTokens.map(splitToken);

        var byPos = {};
        sentence.we.forEach(function (variant) {
            var vt = tokenize(variant);
            if (vt.length !== enTokens.length) return;
            var diffAt = -1;
            for (var i = 0; i < vt.length; i++) {
                if (keyOf(splitToken(vt[i]).core) !== keyOf(enParts[i].core)) {
                    if (diffAt >= 0) return;
                    diffAt = i;
                }
            }
            if (diffAt < 0 || !enParts[diffAt].core) return;
            var word = splitToken(vt[diffAt]).core;
            if (!word) return;
            var bucket = byPos[diffAt] = byPos[diffAt] || [];
            var key = keyOf(word);
            for (var j = 0; j < bucket.length; j++) {
                if (keyOf(bucket[j]) === key) return;
            }
            bucket.push(word);
        });

        var bestPos = -1;
        Object.keys(byPos).forEach(function (k) {
            var p = Number(k);
            if (bestPos < 0 || byPos[p].length > byPos[bestPos].length) bestPos = p;
        });
        if (bestPos < 0 || byPos[bestPos].length < MIN_DISTRACTORS) return null;

        var target = enParts[bestPos];
        var head = enTokens.slice(0, bestPos).join(' ');
        var tail = enTokens.slice(bestPos + 1).join(' ');
        return {
            pos: bestPos,
            correct: target.core,
            distractors: byPos[bestPos].slice(0, MAX_DISTRACTORS),
            before: (head ? head + ' ' : '') + target.lead,
            after: target.trail + (tail ? ' ' + tail : '')
        };
    }

    var PREFERENCE = ['multipleChoice', 'spanishToEnglish', 'listen'];

    function transform(queue) {
        for (var q = 0; q < queue.length; q++) {
            if (queue[q] && queue[q].type === TYPE) return queue;
        }
        for (var p = 0; p < PREFERENCE.length; p++) {
            for (var i = 0; i < queue.length; i++) {
                var item = queue[i];
                if (!item || item.type !== PREFERENCE[p] || item.graded === false) continue;
                if (item.tag || item.data) continue;
                var blank = computeBlank(item.sentence);
                if (!blank) continue;
                item.type = TYPE;
                item.data = blank;
                return queue;
            }
        }
        return queue;
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function render(sentence, item) {
        var blank = (item && item.data && item.data.correct) ? item.data : computeBlank(sentence);
        if (!blank) throw new Error('fillBlank: sentence not eligible');

        var area = G.exerciseArea;
        area.appendChild(G.prompt('Completa la oración'));

        var card = el('div', 'sentence-card fillblank-card');
        var line = el('p', 'sentence-en fillblank-line');
        var slot = el('span', 'fillblank-slot');
        slot.setAttribute('role', 'img');
        slot.setAttribute('aria-label', 'espacio en blanco');
        line.appendChild(document.createTextNode(blank.before));
        line.appendChild(slot);
        line.appendChild(document.createTextNode(blank.after));
        card.appendChild(line);

        var hint = el('p', 'sentence-es fillblank-hint', sentence.es);
        card.appendChild(hint);

        var audio = G.speakButton(sentence.en);
        audio.classList.add('fillblank-audio');
        audio.hidden = true;
        card.appendChild(audio);
        area.appendChild(card);

        var list = G.choiceList(G.shuffle([blank.correct].concat(blank.distractors)));
        area.appendChild(list);

        function fillSlot(word, state) {
            slot.textContent = word;
            slot.classList.toggle('filled', !!word);
            slot.classList.toggle('correct', state === 'correct');
            if (word) slot.setAttribute('aria-label', 'palabra elegida: ' + word);
            else slot.setAttribute('aria-label', 'espacio en blanco');
        }

        list.addEventListener('click', function (e) {
            var btn = e.target.closest ? e.target.closest('.choice') : null;
            if (!btn || btn.disabled || G.session.answered) return;
            fillSlot(btn.dataset.value, null);
        });

        G.enableChoiceCheck(blank.correct, null, 'Era: "' + sentence.en + '"');

        var grade = G.checkBtn.onclick;
        G.checkBtn.onclick = function () {
            grade.apply(this, arguments);
            if (!G.session || !G.session.answered) return;
            fillSlot(blank.correct, 'correct');
            audio.hidden = false;
            G.speak(sentence.en);
        };
    }

    G.registerExercise(TYPE, render);
    G.registerQueueTransform(transform);
})();
