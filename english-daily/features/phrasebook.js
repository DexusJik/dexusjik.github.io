/*
 * phrasebook.js — "Mis frases": read-only review of every sentence from
 * completed lessons, with search, filters and audio.
 */
(function () {
    'use strict';

    var G = window.DailyGame;
    if (!G) return;

    var LEVEL_NAMES = { 1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2', 5: 'C1' };
    var SEARCH_DELAY = 120;

    var panel = null;
    var els = null;
    var entries = [];
    var groups = [];
    var chips = [];
    var filter = 'all';
    var query = '';
    var queryRaw = '';
    var searchTimer = null;
    var opener = null;
    var prevOverflow = '';
    var isOpen = false;

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function completedIndexes() {
        var done = (G.state && G.state.completed) || {};
        var out = [];
        for (var i = 0; i < G.lessons.length; i++) {
            if (done[i]) out.push(i);
        }
        return out;
    }

    function countSentences(indexes) {
        var n = 0;
        for (var i = 0; i < indexes.length; i++) n += G.lessons[indexes[i]].sentences.length;
        return n;
    }

    function pluralFrases(n) {
        return n === 1 ? '1 frase guardada' : n + ' frases guardadas';
    }

    /* ---------- entry card ---------- */

    function renderEntry() {
        var slot = G.slot('bottom');
        if (!slot) return;
        var card = document.getElementById('pb-entry');
        if (!card) {
            card = el('section', 'pb-entry');
            card.id = 'pb-entry';
            card.setAttribute('aria-label', 'Mis frases');
            slot.appendChild(card);
        }
        card.textContent = '';

        var indexes = completedIndexes();
        var total = countSentences(indexes);

        var icon = el('span', 'pb-entry__icon', '📖');
        icon.setAttribute('aria-hidden', 'true');
        var copy = el('div', 'pb-entry__copy');

        if (!total) {
            copy.appendChild(el('p', 'pb-entry__title', 'Mis frases'));
            copy.appendChild(el('p', 'pb-entry__sub', 'Completa tu primera lección para empezar tu libreta.'));
            card.appendChild(icon);
            card.appendChild(copy);
            return;
        }

        copy.appendChild(el('p', 'pb-entry__title', 'Mis frases'));
        copy.appendChild(el('p', 'pb-entry__sub', pluralFrases(total)));
        var btn = el('button', 'btn btn-primary', 'Abrir');
        btn.type = 'button';
        btn.id = 'pb-open';
        btn.addEventListener('click', function () { open(btn); });
        card.appendChild(icon);
        card.appendChild(copy);
        card.appendChild(btn);
    }

    /* ---------- panel ---------- */

    function buildPanel() {
        panel = el('div', 'pb-overlay');
        panel.id = 'pb-panel';
        panel.hidden = true;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'pb-title');

        var dialog = el('div', 'pb-dialog');

        var head = el('div', 'pb-head');
        var title = el('h2', 'pb-title', 'Mis frases');
        title.id = 'pb-title';
        var close = el('button', 'pb-close', '✕');
        close.type = 'button';
        close.setAttribute('aria-label', 'Cerrar');
        close.addEventListener('click', closePanel);
        head.appendChild(title);
        head.appendChild(close);

        var tools = el('div', 'pb-tools');
        var search = el('input', 'pb-search');
        search.type = 'search';
        search.id = 'pb-search';
        search.placeholder = 'Buscar en inglés o español';
        search.setAttribute('aria-label', 'Buscar en inglés o español');
        search.setAttribute('autocomplete', 'off');
        search.setAttribute('spellcheck', 'false');
        search.addEventListener('input', function () {
            if (searchTimer) clearTimeout(searchTimer);
            searchTimer = setTimeout(applyFilters, SEARCH_DELAY);
        });
        var chipBox = el('div', 'pb-chips');
        chipBox.setAttribute('role', 'group');
        chipBox.setAttribute('aria-label', 'Filtros');
        var count = el('p', 'pb-count');
        count.setAttribute('role', 'status');
        count.setAttribute('aria-live', 'polite');
        tools.appendChild(search);
        tools.appendChild(chipBox);
        tools.appendChild(count);

        var list = el('div', 'pb-list');
        list.id = 'pb-list';
        list.addEventListener('click', onListClick);
        var empty = el('p', 'pb-empty');
        empty.id = 'pb-empty';
        empty.setAttribute('role', 'status');
        empty.hidden = true;

        var foot = el('p', 'pb-foot', 'Tus frases se guardan solo en este dispositivo.');

        dialog.appendChild(head);
        dialog.appendChild(tools);
        dialog.appendChild(list);
        dialog.appendChild(foot);
        panel.appendChild(dialog);
        document.body.appendChild(panel);

        panel.addEventListener('keydown', onKeydown);
        panel.addEventListener('mousedown', function (e) {
            if (e.target === panel) closePanel();
        });

        els = { search: search, chips: chipBox, count: count, list: list, empty: empty, close: close };
    }

    function makeChip(key, label) {
        var b = el('button', 'pb-chip', label);
        b.type = 'button';
        b.setAttribute('aria-pressed', key === filter ? 'true' : 'false');
        b.addEventListener('click', function () {
            filter = key;
            for (var i = 0; i < chips.length; i++) {
                chips[i].node.setAttribute('aria-pressed', chips[i].key === filter ? 'true' : 'false');
            }
            applyFilters();
        });
        chips.push({ key: key, node: b });
        els.chips.appendChild(b);
    }

    function buildContent() {
        var indexes = completedIndexes();
        var missed = (G.state && G.state.missed) || {};
        var seenLevels = {};
        entries = [];
        groups = [];
        chips = [];
        filter = 'all';

        els.list.textContent = '';
        els.chips.textContent = '';
        els.search.value = '';
        query = '';
        queryRaw = '';

        var frag = document.createDocumentFragment();
        indexes.forEach(function (li) {
            var lesson = G.lessons[li];
            var group = el('section', 'pb-group');
            group.appendChild(el('h3', 'pb-group__head', 'Lección ' + (li + 1) + ' · ' + lesson.title));
            var hasErrors = missed[li] > 0;
            var info = { node: group, rows: [] };
            lesson.sentences.forEach(function (s, si) {
                var row = el('div', 'pb-row');
                var text = el('div', 'pb-row__text');
                var enLine = el('p', 'pb-row__en', s.en);
                enLine.lang = 'en';
                text.appendChild(enLine);
                text.appendChild(el('p', 'pb-row__es', s.es));
                var sp = el('button', 'pb-speak', '🔊');
                sp.type = 'button';
                sp.setAttribute('aria-label', 'Escuchar: ' + s.en);
                sp.setAttribute('data-i', String(entries.length));
                row.appendChild(text);
                row.appendChild(sp);
                group.appendChild(row);
                var entry = {
                    row: row,
                    group: info,
                    en: s.en,
                    nen: G.normalize(s.en),
                    nes: G.normalize(s.es),
                    lv: s.lv,
                    errors: hasErrors
                };
                entries.push(entry);
                info.rows.push(entry);
                seenLevels[s.lv] = true;
            });
            groups.push(info);
            frag.appendChild(group);
        });
        els.list.appendChild(frag);
        els.list.appendChild(els.empty);

        makeChip('all', 'Todas');
        makeChip('errors', 'Con errores');
        for (var lv = 1; lv <= 5; lv++) {
            if (seenLevels[lv]) makeChip('lv' + lv, LEVEL_NAMES[lv]);
        }
        applyFilters(true);
    }

    function matchesFilter(entry) {
        if (filter === 'all') return true;
        if (filter === 'errors') return entry.errors;
        return 'lv' + entry.lv === filter;
    }

    function applyFilters(fromBuild) {
        if (!els) return;
        if (!fromBuild) {
            queryRaw = els.search.value.replace(/^\s+|\s+$/g, '');
            query = G.normalize(els.search.value);
        }
        var shown = 0;
        for (var g = 0; g < groups.length; g++) {
            var visibleInGroup = 0;
            var rows = groups[g].rows;
            for (var i = 0; i < rows.length; i++) {
                var e = rows[i];
                var ok = matchesFilter(e) && (!query || e.nen.indexOf(query) >= 0 || e.nes.indexOf(query) >= 0);
                if (e.row.hidden === ok) e.row.hidden = !ok;
                if (ok) visibleInGroup++;
            }
            groups[g].node.hidden = visibleInGroup === 0;
            shown += visibleInGroup;
        }
        els.count.textContent = shown === 1 ? '1 frase' : shown + ' frases';
        if (shown) {
            els.empty.hidden = true;
            els.empty.textContent = '';
        } else {
            els.empty.hidden = false;
            if (queryRaw) els.empty.textContent = 'Sin resultados para "' + queryRaw + '"';
            else if (filter === 'errors') els.empty.textContent = 'Todavía no tienes frases con errores.';
            else els.empty.textContent = 'No hay frases en este filtro.';
        }
    }

    function onListClick(ev) {
        var node = ev.target;
        while (node && node !== els.list) {
            if (node.className === 'pb-speak' || (node.classList && node.classList.contains('pb-speak'))) {
                var entry = entries[Number(node.getAttribute('data-i'))];
                if (entry) {
                    G.speak(entry.en);
                    node.classList.add('playing');
                    setTimeout(function (n) { n.classList.remove('playing'); }.bind(null, node), 1200);
                }
                return;
            }
            node = node.parentNode;
        }
    }

    function focusables() {
        var all = panel.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])');
        var out = [];
        for (var i = 0; i < all.length; i++) {
            var n = all[i];
            if (n.disabled || n.getClientRects().length === 0) continue;
            out.push(n);
        }
        return out;
    }

    function onKeydown(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            e.stopPropagation();
            closePanel();
            return;
        }
        if (e.key !== 'Tab') return;
        var items = focusables();
        if (!items.length) {
            e.preventDefault();
            return;
        }
        var first = items[0];
        var last = items[items.length - 1];
        var active = document.activeElement;
        if (e.shiftKey && (active === first || !panel.contains(active))) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
            e.preventDefault();
            first.focus();
        }
    }

    function open(trigger) {
        if (isOpen) return;
        if (!panel) buildPanel();
        opener = trigger || document.activeElement;
        buildContent();
        prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panel.hidden = false;
        isOpen = true;
        els.list.scrollTop = 0;
        els.search.focus();
    }

    function closePanel() {
        if (!isOpen) return;
        isOpen = false;
        if (searchTimer) clearTimeout(searchTimer);
        panel.hidden = true;
        document.body.style.overflow = prevOverflow;
        var target = document.getElementById('pb-open');
        if (!target || !document.body.contains(opener)) opener = target;
        if (opener && opener.focus) opener.focus();
    }

    G.on('pathRender', function () {
        try { renderEntry(); } catch (e) {
            if (window.console && console.error) console.error('[phrasebook] render failed', e);
        }
    });
})();
