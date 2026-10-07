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

    function scrollToId(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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

            var current = '';
            sections.forEach(function (section) {
                if (window.pageYOffset >= section.offsetTop - 140) current = section.id;
            });

            links.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        var logo = document.getElementById('logo-link');
        if (logo) {
            logo.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToTop();
            });
        }

        $$('a[href^="#"]:not(.nav-link):not(#logo-link)').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var id = anchor.getAttribute('href');
                if (!id || id === '#') return;
                if (!document.querySelector(id)) return;
                e.preventDefault();
                scrollToId(id.slice(1));
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

        var blob1 = document.getElementById('blur-1');
        var blob2 = document.getElementById('blur-2');
        if (!blob1 || !blob2) return;
        if (window.matchMedia('(hover: none)').matches) return;

        var raf = null;
        window.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                var dx = (e.clientX / window.innerWidth - 0.5);
                var dy = (e.clientY / window.innerHeight - 0.5);
                blob1.style.transform = 'translate3d(' + dx * 28 + 'px,' + dy * 28 + 'px,0)';
                blob2.style.transform = 'translate3d(' + dx * -38 + 'px,' + dy * -38 + 'px,0)';
                raf = null;
            });
        }, { passive: true });
    }

    /* ============================================================
       custom cursor
       ============================================================ */

    function initCursor() {
        var wrap = document.getElementById('custom-cursor');
        var inner = $('.cursor-inner', wrap);
        if (!wrap || !inner) return;
        if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

        var raf = null;
        window.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                wrap.style.transform = 'translate3d(' + (e.clientX - 12) + 'px,' + (e.clientY - 12) + 'px,0)';
                wrap.style.opacity = '1';
                raf = null;
            });
        }, { passive: true });

        document.addEventListener('mouseleave', function () { wrap.style.opacity = '0'; });

        $$('a, button, summary, .quiz-option-button').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                inner.classList.add('cursor-hover');
                var label = el.getAttribute('data-cursor-text');
                if (label) {
                    inner.textContent = label;
                    inner.classList.add('cursor-text');
                }
            });
            el.addEventListener('mouseleave', function () {
                inner.classList.remove('cursor-hover', 'cursor-text');
                inner.textContent = '';
            });
        });
    }

    /* ============================================================
       magnetic buttons
       ============================================================ */

    function initMagnetic() {
        if (window.matchMedia('(hover: none)').matches) return;

        $$('.magnetic-btn').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var x = (e.clientX - r.left - r.width / 2) * 0.28;
                var y = (e.clientY - r.top - r.height / 2) * 0.28;
                btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            });
            btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
        });
    }

    /* ============================================================
       pricing: pick a plan, prefill the form
       ============================================================ */

    function initPlans() {
        var message = document.getElementById('message');
        if (!message) return;

        function selectPlan(name) {
            message.value = 'Hola Javier, me interesa el ' + name +
                '. Me gustaría agendar mi primera sesión de estudio.';
            scrollToId('reserva');
            message.focus({ preventScroll: true });
        }

        var map = {
            'pack-inicial-btn': 'Pack Inicial',
            'plan-consultoria-btn': 'Plan Consultoría',
            'clase-individual-btn': 'Clase Individual'
        };

        Object.keys(map).forEach(function (id) {
            var btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', function () { selectPlan(map[id]); });
        });
    }

    /* ============================================================
       level quiz
       ============================================================ */

    function initQuiz() {
        var container = document.getElementById('quiz-questions-container');
        var progressBar = document.getElementById('quiz-progress-bar');
        var nextBtn = document.getElementById('next-step-btn');
        var actions = document.getElementById('quiz-actions');
        var result = document.getElementById('quiz-result');
        var levelOut = document.getElementById('cefr-level');
        var descOut = document.getElementById('cefr-description');
        var cta = document.getElementById('whatsapp-redirect-btn');

        if (!container || !nextBtn || !result) return;

        var total = $$('.quiz-step', container).length;
        var step = 0;
        var answers = {};

        function paintProgress() {
            progressBar.style.width = ((step + 1) / total) * 100 + '%';
        }

        function gotoStep(index) {
            var previous = container.querySelector('.quiz-step.active');
            var incoming = container.querySelector('#quiz-step-' + (index + 1));
            if (!incoming) return;

            if (previous && previous !== incoming) previous.classList.remove('active');
            incoming.classList.add('active');

            step = index;
            paintProgress();
            nextBtn.textContent = index === total - 1 ? 'Ver mi nivel' : 'Siguiente';
        }

        function currentStepEl() {
            return container.querySelector('.quiz-step.active');
        }

        container.addEventListener('click', function (e) {
            var btn = e.target.closest('.quiz-option-button');
            if (!btn) return;

            var qid = btn.dataset.questionId;
            $$('.quiz-option-button[data-question-id="' + qid + '"]', container)
                .forEach(function (b) { b.classList.remove('selected'); });

            btn.classList.add('selected');
            answers[qid] = btn.dataset.value;
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
                nextBtn.animate(
                    [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
                     { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
                    { duration: 260 }
                );
                return;
            }

            if (step < total - 1) {
                gotoStep(step + 1);
                return;
            }

            var profile = scoreProfile();
            levelOut.textContent = profile.level;
            descOut.textContent = profile.desc;

            container.hidden = true;
            actions.hidden = true;
            result.hidden = false;
            paintProgress();
            result.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        });

        if (cta) {
            cta.addEventListener('click', function () {
                var message = document.getElementById('message');
                if (!message) return;
                message.value = 'Hola Javier Perez, hice el quiz y mi nivel estimado es ' +
                    levelOut.textContent + '. Me interesa la consultoría para ' +
                    (answers.goal || 'consultoría') + '.';
                scrollToId('reserva');
                message.focus({ preventScroll: true });
            });
        }

        gotoStep(0);
    }

    /* ============================================================
       booking form
       ============================================================ */

    function initForm() {
        var form = document.getElementById('strategy-session-form');
        if (!form) return;

        var levelOut = document.getElementById('cefr-level');

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // spam trap: real users never fill a hidden field
            if (document.getElementById('_gotcha').value) return;

            var submit = form.querySelector('button[type="submit"]');
            var originalLabel = submit.textContent;
            submit.disabled = true;
            submit.textContent = 'Enviando...';

            var payload = new FormData(form);
            payload.append('level', (levelOut && levelOut.textContent) || 'No realizado');
            payload.append('goal', payload.get('goal') || 'No especificado');

            try {
                var res = await fetch('https://formspree.io/f/xzdklrdv', {
                    method: 'POST',
                    body: payload,
                    headers: { Accept: 'application/json' }
                });
                if (!res.ok) throw new Error('Request failed');

                form.reset();
                alert('¡Gracias! Te responderé dentro de 24 horas hábiles.');
            } catch (err) {
                alert('No pude enviar el formulario. Revisa tu conexión e intenta de nuevo.');
            } finally {
                submit.disabled = false;
                submit.textContent = originalLabel;
            }
        });
    }

    /* ============================================================
       cta buttons
       ============================================================ */

    function initCtas() {
        var pairs = {
            'quiz-button': 'quiz-section',
            'strategy-button': 'reserva',
            'hero-primary': 'reserva',
            'hero-secondary': 'quiz-section'
        };

        Object.keys(pairs).forEach(function (id) {
            var btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', function () { scrollToId(pairs[id]); });
        });
    }

    /* ============================================================
       boot
       ============================================================ */

    function init() {
        initNav();
        initReveal();
        initHero();
        initCursor();
        initMagnetic();
        initPlans();
        initQuiz();
        initForm();
        initCtas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
