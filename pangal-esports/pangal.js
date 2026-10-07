/* ============================================================
   pangal.js — Pangal e-sports
   Scrollspy, reveal on scroll, hero parallax. No dependencies.
   ============================================================ */

(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       nav: stuck state + scrollspy
       ============================================================ */

    function initNav() {
        var nav = document.getElementById('nav');
        var links = $$('.nav__links a[href^="#"]');
        var sections = links
            .map(function (a) { return document.querySelector(a.getAttribute('href')); })
            .filter(Boolean);

        function onScroll() {
            if (nav) nav.classList.toggle('is-stuck', window.pageYOffset > 12);

            var current = '';
            sections.forEach(function (section) {
                if (window.pageYOffset >= section.offsetTop - 160) current = section.id;
            });

            links.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var target = document.querySelector(link.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            });
        });
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

        var wide = window.matchMedia('(min-width: 62rem)');
        function onWide(e) { if (e.matches) close(); }
        if (wide.addEventListener) wide.addEventListener('change', onWide);
        else if (wide.addListener) wide.addListener(onWide);

        close();
    }

    /* ============================================================
       reveal on scroll
       ============================================================ */

    function initReveal() {
        var targets = $$('.reveal');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window) || reducedMotion) {
            targets.forEach(function (el) { el.classList.add('active'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

        targets.forEach(function (el) { io.observe(el); });
    }

    /* ============================================================
       hero background parallax
       ============================================================ */

    function initParallax() {
        var bg = document.getElementById('hero-bg');
        if (!bg || reducedMotion) return;
        if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

        var raf = null;
        window.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                var dx = e.clientX / window.innerWidth - 0.5;
                var dy = e.clientY / window.innerHeight - 0.5;
                bg.style.transform = 'translate3d(' + dx * -26 + 'px,' + dy * -26 + 'px,0)';
                raf = null;
            });
        }, { passive: true });
    }

    /* ============================================================
       meme videos: play only the one in view
       ============================================================ */

    function initVideos() {
        var videos = $$('.meme__frame video');
        if (!videos.length) return;

        if (!('IntersectionObserver' in window)) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                if (entry.isIntersecting) {
                    var p = video.play();
                    if (p && p.catch) p.catch(function () { /* autoplay blocked: user can press play */ });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.4 });

        videos.forEach(function (v) { io.observe(v); });
    }

    /* ============================================================
       boot
       ============================================================ */

    function init() {
        initNav();
        initDrawer();
        initReveal();
        initParallax();
        initVideos();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
