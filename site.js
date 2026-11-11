/* ============================================================
   site.js — Inglés Sin Guion
   Smooth scroll, quiz, form, and scroll motion.
   ============================================================ */

(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       helpers
       ============================================================ */

    /*
     * Move focus to the destination as well as scrolling to it. A keyboard CTA
     * that only scrolls leaves focus on an off-screen (or now-hidden) button,
     * so the next Tab starts from the wrong place. The heading is the useful
     * landing point; tabindex=-1 makes it focusable without adding a tab stop.
     */
    function focusLanding(el) {
        if (!el) return;
        var target = el.querySelector('h1, h2, h3, h4') || el;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        try {
            target.focus({ preventScroll: true });
        } catch (e) {
            target.focus();
        }
    }

    function scrollToId(id, moveFocus) {
        var el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        if (moveFocus) focusLanding(el);
    }

    function scrollToTop(moveFocus) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        if (moveFocus) focusLanding(document.getElementById('hero'));
    }

    /* ============================================================
       nav: scrollspy + stuck header
       ============================================================ */

    function initNav() {
        var header = document.getElementById('site-header');
        var links = $$('.nav-link[href^="#"]');
        var sections = links
            .map(function (l) { return document.querySelector(l.getAttribute('href')); })
            .filter(Boolean);

        function onScroll() {
            if (header) header.classList.toggle('is-stuck', window.pageYOffset > 8);

            /*
             * Pick the section with the GREATEST offsetTop that has already
             * been scrolled past. This is deliberately order-independent:
             * `sections` is built in NAV order (Metodología, Planes, Sobre mí)
             * but document order is different (Sobre mí, Metodología, Planes),
             * so taking "the last one that matched" kept handing the highlight
             * to Sobre mí for the whole lower page.
             */
            var current = '';
            var probe = window.pageYOffset + 140;
            var bestTop = -1;
            for (var i = 0; i < sections.length; i++) {
                var top = sections[i].offsetTop;
                if (top <= probe && top > bestTop) {
                    bestTop = top;
                    current = sections[i].id;
                }
            }

            links.forEach(function (link) {
                var on = link.getAttribute('href') === '#' + current;
                link.classList.toggle('active', on);
                if (on) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        var logo = document.getElementById('logo-link');
        if (logo) {
            logo.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToTop(true);
            });
        }

        $$('a[href^="#"]:not(.nav-link):not(#logo-link)').forEach(function (anchor) {
            /* The skip link must keep its native behaviour: the browser moves
               focus to <main tabindex="-1">, which is the whole point. */
            if (anchor.classList.contains('sr-only')) return;

            anchor.addEventListener('click', function (e) {
                var id = anchor.getAttribute('href');
                if (!id || id === '#') return;
                if (!document.querySelector(id)) return;
                e.preventDefault();

                /*
                 * A link inside the open drawer scrolls twice: once here, and
                 * again implicitly when initDrawer's own handler closes the
                 * drawer and the document shrinks by the drawer height. The
                 * target then ended up ~312px above the viewport. Close first,
                 * then scroll on the next tick, once layout has settled.
                 *
                 * setTimeout rather than requestAnimationFrame: rAF is paused in
                 * a backgrounded tab, which would leave the scroll unrun.
                 */
                if (anchor.closest('#mobile-nav')) {
                    var toggle = document.getElementById('nav-toggle');
                    if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
                        document.dispatchEvent(new CustomEvent('drawer:close'));
                    }
                    window.setTimeout(function () {
                        scrollToId(id.slice(1), true);
                    }, 0);
                    return;
                }

                scrollToId(id.slice(1), true);
            });
        });
    }

    /* ============================================================
       reveal on scroll
       ============================================================ */

    function initReveal() {
        var targets = $$('.reveal');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window) || prefersReducedMotion) {
            targets.forEach(function (el) { el.classList.add('active'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        targets.forEach(function (el) { io.observe(el); });
    }

    /* ============================================================
       hero: line reveal + parallax blobs (CSS-driven, no GSAP)
       ============================================================ */

    function initHero() {
        var lineWrap = $$('.line-wrap');
        if (lineWrap.length) {
            lineWrap.forEach(function (span, i) {
                span.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1) ' + (0.15 + i * 0.12) +
                    's, opacity 1s cubic-bezier(0.16,1,0.3,1) ' + (0.15 + i * 0.12) + 's';
                requestAnimationFrame(function () {
                    span.style.transform = 'translateY(0)';
                    span.style.opacity = '1';
                });
            });
        }
    }

    /* ============================================================
       mobile drawer
       ============================================================ */

    function initDrawer() {
        var toggle = document.getElementById('nav-toggle');
        var drawer = document.getElementById('mobile-nav');
        if (!toggle || !drawer) return;

        function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

        function open() {
            drawer.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            toggle.querySelector('.sr-only').textContent = 'Cerrar menú';
        }

        function close() {
            drawer.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            toggle.querySelector('.sr-only').textContent = 'Abrir menú';
        }

        toggle.addEventListener('click', function () {
            if (isOpen()) close(); else open();
        });

        drawer.addEventListener('click', function (e) {
            if (e.target.closest('a')) close();
        });

        /*
         * initNav needs to close the drawer BEFORE it scrolls to an anchor
         * inside it, otherwise the closing animation reflows the document and
         * leaves the target off-screen. It cannot call close() directly, so it
         * asks via this event.
         */
        document.addEventListener('drawer:close', function () {
            if (isOpen()) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen()) {
                close();
                toggle.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!isOpen()) return;
            if (e.target.closest('#nav-toggle') || e.target.closest('#mobile-nav')) return;
            close();
        });

        /* the desktop nav replaces the drawer, so never leave it open past the breakpoint */
        var wide = window.matchMedia('(min-width: 62rem)');
        function onWide(e) { if (e.matches) close(); }
        if (wide.addEventListener) wide.addEventListener('change', onWide);
        else if (wide.addListener) wide.addListener(onWide);

        close();
    }

    /* ============================================================
       anchor highlight: brief outline flash when jumping to a section
       ============================================================ */

    function initAnchorFlash() {
        $$('a[href^="#"]').forEach(function (anchor) {
            if (anchor.classList.contains('sr-only')) return;
            anchor.addEventListener('click', function () {
                var id = anchor.getAttribute('href');
                if (!id || id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;

                target.classList.add('flash-target');
                setTimeout(function () { target.classList.remove('flash-target'); }, 1100);
            });
        });
    }

    /* ============================================================
       whatsapp
       ============================================================ */

    /*
     * The number is held in split parts and assembled on click, so it never
     * appears as visible text, in an href, or as one searchable string in
     * the HTML. This raises the bar against naive scrapers that read page
     * text or link targets.
     *
     * It does NOT make the number secret: anyone reading this file can
     * reassemble it. Hiding it properly needs a server-side redirect.
     *
     * The leading "+" lives in the *display* helper, not in the URL. wa.me
     * wants digits only ("Omit any zeroes, brackets, or dashes", and the plus
     * is explicitly called out as not wanted), so keeping it here produced
     * wa.me/+5695... which is off-spec for every CTA on the site.
     */
    var WA_PARTS = ['56', '9521', '48204'];

    function waNumber() {
        return WA_PARTS.join('');
    }

    /* human-readable form, for any visible text */
    function waNumberDisplay() {
        return '+' + waNumber();
    }

    function waLink(message) {
        return 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(message);
    }

    /* open in a new tab on desktop, same tab on phones */
    function sendToWhatsApp(message, button) {
        var url = waLink(message);
        var isPhone = window.matchMedia('(max-width: 48rem)').matches;

        if (isPhone) {
            window.location.href = url;
            return;
        }

        var win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win) {
            // popup blocked: fall back to same-tab navigation
            window.location.href = url;
            return;
        }
        if (button) button.blur();
    }

    function initWhatsApp() {
        var buttons = [
            { id: 'wa-cta', msg: 'Hola Javier, me interesa una sesión de consultoría de inglés. Me gustaría saber disponibilidad y recibir una propuesta.' },
            { id: 'contact-btn', msg: 'Hola Javier, me gustaría consultar por disponibilidad y sesiones de consultoría de inglés.' }
        ];

        buttons.forEach(function (item) {
            var el = document.getElementById(item.id);
            if (el) {
                el.addEventListener('click', function () {
                    sendToWhatsApp(item.msg, el);
                });
            }
        });
    }

    /* ============================================================
       pricing: pick a plan and carry it into the WhatsApp message
       ============================================================ */

    function initPlans() {
        var map = {
            'pack-inicial-btn': 'Pack Inicial',
            'plan-consultoria-btn': 'Plan Consultoría',
            'clase-individual-btn': 'Clase Individual'
        };

        Object.keys(map).forEach(function (id) {
            var btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('click', function () {
                sendToWhatsApp(
                    'Hola Javier, me interesa el ' + map[id] +
                    '. Me gustaría agendar mi primera sesión de estudio.',
                    btn
                );
            });
        });
    }

    /* ============================================================
       level quiz
       ============================================================ */

    function initQuiz() {
        var container = document.getElementById('quiz-questions-container');
        var progressBar = document.getElementById('quiz-progress-bar');
        var nextBtn = document.getElementById('next-step-btn');
        var prevBtn = document.getElementById('prev-step-btn');
        var restartBtn = document.getElementById('quiz-restart-btn');
        var actions = document.getElementById('quiz-actions');
        var result = document.getElementById('quiz-result');
        var levelOut = document.getElementById('cefr-level');
        var descOut = document.getElementById('cefr-description');
        var cta = document.getElementById('whatsapp-redirect-btn');
        var error = document.getElementById('quiz-error');

        if (!container || !nextBtn || !result) return;

        var total = $$('.quiz-step', container).length;
        var step = 0;
        var answers = {};

        /* Native radio groups have one tab stop and arrow-key navigation. The
           buttons carry role=radio, so implement the same contract manually:
           selected (or first) option is tabindex=0, the rest are -1. */
        function setRoving(group, active) {
            if (!group) return;
            var buttons = $$('.quiz-option-button', group);
            buttons.forEach(function (b) {
                b.tabIndex = b === active ? 0 : -1;
            });
        }

        function selectOption(btn) {
            if (!btn) return;
            var qid = btn.dataset.questionId;
            var group = btn.closest('.quiz-options');

            $$('.quiz-option-button[data-question-id="' + qid + '"]', container)
                .forEach(function (b) {
                    b.classList.remove('selected');
                    b.setAttribute('aria-checked', 'false');
                });

            btn.classList.add('selected');
            btn.setAttribute('aria-checked', 'true');
            answers[qid] = btn.dataset.value;
            setRoving(group, btn);
            if (error) {
                error.hidden = true;
                error.textContent = '';
            }
        }

        function paintProgress() {
            var pct = ((step + 1) / total) * 100;
            progressBar.style.width = pct + '%';
            progressBar.setAttribute('aria-valuenow', String(step + 1));
            progressBar.setAttribute('aria-valuemax', String(total));
            progressBar.setAttribute('aria-label', 'Pregunta ' + (step + 1) + ' de ' + total);
        }

        function gotoStep(index, moveFocus) {
            var previous = container.querySelector('.quiz-step.active');
            var incoming = container.querySelector('#quiz-step-' + (index + 1));
            if (!incoming) return;

            if (previous && previous !== incoming) previous.classList.remove('active');
            incoming.classList.add('active');

            step = index;
            paintProgress();
            nextBtn.textContent = index === total - 1 ? 'Ver mi nivel' : 'Siguiente';
            if (prevBtn) prevBtn.hidden = index === 0;

            /* restore the choice already made for this question, so going back
               and forward does not silently lose the answer */
            var group = incoming.querySelector('.quiz-options');
            if (group) {
                var first = group.querySelector('.quiz-option-button');
                var qid = first ? first.dataset.questionId : '';
                var already = answers[qid];
                var chosen = null;

                $$('.quiz-option-button[data-question-id="' + qid + '"]', container)
                    .forEach(function (b) {
                        var on = b.dataset.value === already;
                        b.classList.toggle('selected', on);
                        b.setAttribute('aria-checked', on ? 'true' : 'false');
                        if (on) chosen = b;
                    });

                setRoving(group, chosen || first);
            }

            if (error) {
                error.hidden = true;
                error.textContent = '';
            }

            /*
             * Focus used to stay on "Siguiente", so Tab skipped the new
             * question's options entirely and keyboard users had to Shift+Tab
             * backwards to answer.
             */
            if (moveFocus) {
                var heading = incoming.querySelector('p');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus();
                }
            }
        }

        function currentStepEl() {
            return container.querySelector('.quiz-step.active');
        }

        container.addEventListener('click', function (e) {
            var btn = e.target.closest('.quiz-option-button');
            if (!btn) return;
            selectOption(btn);
        });

        /* radio-group keyboard contract: arrows move and select, Home/End jump */
        container.addEventListener('keydown', function (e) {
            var btn = e.target.closest('.quiz-option-button');
            if (!btn) return;
            var group = btn.closest('.quiz-options');
            if (!group) return;

            var buttons = $$('.quiz-option-button', group);
            var index = buttons.indexOf(btn);
            var next = null;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                next = buttons[(index + 1) % buttons.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                next = buttons[(index - 1 + buttons.length) % buttons.length];
            } else if (e.key === 'Home') {
                next = buttons[0];
            } else if (e.key === 'End') {
                next = buttons[buttons.length - 1];
            }

            if (!next) return;
            e.preventDefault();
            selectOption(next);
            next.focus();
        });

        /* roles are in the markup; this only seeds aria-checked and roving tabindex */
        $$('.quiz-options', container).forEach(function (group) {
            var selected = group.querySelector('.quiz-option-button.selected');
            setRoving(group, selected || group.querySelector('.quiz-option-button'));
        });
        $$('.quiz-option-button', container).forEach(function (b) {
            b.setAttribute('role', 'radio');
            if (!b.hasAttribute('aria-checked')) b.setAttribute('aria-checked', 'false');
        });

        function scoreProfile() {
            var score = 0;
            if (answers.grammar === 'find-attached') score += 3; else score += 1;
            if (answers.tense === 'had-started') score += 3; else score += 1;
            if (answers.vocab === 'discuss-later') score += 3; else score += 1;

            if (score <= 4) {
                return {
                    level: 'A1/A2',
                    desc: 'Tus habilidades son fundamentales. Enfócate en la base gramatical y el vocabulario esencial.'
                };
            }
            if (score <= 7) {
                return {
                    level: 'B1/B2',
                    desc: 'Manejas conceptos intermedios. Trabajaremos fluidez y precisión en contextos profesionales.'
                };
            }
            return {
                level: 'C1/C2',
                desc: 'Tienes un nivel avanzado. Nos enfocaremos en matices y vocabulario técnico especializado.'
            };
        }

        nextBtn.addEventListener('click', function () {
            var active = currentStepEl();
            var selected = active ? active.querySelector('.quiz-option-button.selected') : null;

            if (!selected) {
                if (error) {
                    error.textContent = 'Elige una opción para continuar.';
                    error.hidden = false;
                }
                var firstOption = active ? active.querySelector('.quiz-option-button') : null;
                if (firstOption) firstOption.focus();
                nextBtn.animate(
                    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
                     { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
                    { duration: 260 }
                );
                return;
            }

            if (step < total - 1) {
                gotoStep(step + 1, true);
                return;
            }

            var profile = scoreProfile();
            levelOut.textContent = profile.level;
            descOut.textContent = profile.desc;

            container.hidden = true;
            actions.hidden = true;
            result.hidden = false;
            paintProgress();

            /* the button that had focus is now hidden; land focus on the result
               so keyboard users do not restart from the top of the document */
            result.setAttribute('tabindex', '-1');
            try {
                result.focus({ preventScroll: true });
            } catch (e) {
                result.focus();
            }
            result.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        });

        if (cta) {
            cta.addEventListener('click', function () {
                var goalMap = {
                    'career': 'fines profesionales',
                    'academic': 'fines académicos',
                    'social': 'viajes y uso social'
                };
                var goalText = goalMap[answers.goal] || 'mis objetivos';
                sendToWhatsApp(
                    'Hola Javier Perez, hice el quiz y mi nivel estimado es ' +
                    levelOut.textContent + '. Me interesa la consultoría para ' +
                    goalText + '.',
                    cta
                );
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (step > 0) gotoStep(step - 1, true);
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', function () {
                answers = {};
                $$('.quiz-option-button', container).forEach(function (b) {
                    b.classList.remove('selected');
                    b.setAttribute('aria-checked', 'false');
                });
                result.hidden = true;
                container.hidden = false;
                if (actions) actions.hidden = false;
                if (error) {
                    error.hidden = true;
                    error.textContent = '';
                }
                gotoStep(0, true);
            });
        }

        gotoStep(0, false);
    }

    /* ============================================================
       cta buttons
       ============================================================ */

    function initCtas() {
        var pairs = {
            'quiz-button': 'quiz-section',
            'hero-primary': 'reserva',
            'hero-secondary': 'quiz-section'
        };

        Object.keys(pairs).forEach(function (id) {
            var btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', function () { scrollToId(pairs[id], true); });
        });
    }

    /* ============================================================
       boot
       ============================================================ */

    function init() {
        initNav();
        initDrawer();
        initReveal();
        initHero();
        initAnchorFlash();
        initWhatsApp();
        initPlans();
        initQuiz();
        initCtas();

        /* tell theme.js the reveal system booted; cancel its blank-page failsafe */
        window.__siteRevealReady = true;
        if (window.__siteRevealFallback) window.clearTimeout(window.__siteRevealFallback);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
