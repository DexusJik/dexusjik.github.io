/*
 * sw.js — offline support for 1 Oración al Día.
 *
 * Scope is /english-daily/ only (the file lives there), so the main site
 * and Pangal are never intercepted.
 *
 * One precache entry sits outside that scope: `../theme.js`, the shared theme
 * resolver that lives at the site root. A service worker CAN cache a URL outside
 * its own scope, it just never receives fetch events for it, so this is safe:
 * the app always loads theme.js over the network like any other document
 * script, and the precache copy only serves the offline case.
 *
 * Strategy: network first, cache fallback. Online users always get the
 * latest deploy without anyone remembering to bump a version; offline
 * users get the last copy they loaded. A slow network falls back to the
 * cache after NETWORK_TIMEOUT_MS instead of hanging the lesson.
 *
 * Bump CACHE_VERSION only when the PRECACHE list changes.
 */
var CACHE_VERSION = 'daily-v8';
var NETWORK_TIMEOUT_MS = 4000;

var PRECACHE = [
    './',
    './index.html',
    './daily.css',
    /* theme.js lives at the site root and is shared with the main page. It must
       be precached: it runs before paint, so offline it has to come from cache
       or the app flashes light before discovering there is no network. */
    '../theme.js',
    './sentences.js',
    './placement.js',
    './errors.js',
    './errors-ui.js',
    './state-schema.js',
    './migrations.js',
    './game.js',
    './features/tips.js',
    './features/tips.css',
    './features/fillblank.js',
    './features/fillblank.css',
    './features/challenge.js',
    './features/challenge.css',
    './features/review.js',
    './features/review.css',
    './features/phrasebook.js',
    './features/phrasebook.css',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-32.png',
    '../assets/images/avatar-96.webp'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(function (cache) { return cache.addAll(PRECACHE); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== CACHE_VERSION) return caches.delete(key);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
        promise.then(function (value) {
            clearTimeout(timer);
            resolve(value);
        }, function (err) {
            clearTimeout(timer);
            reject(err);
        });
    });
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url = new URL(request.url);
    // Fonts and anything else cross-origin: leave to the browser.
    if (url.origin !== self.location.origin) return;

    var isPage = request.mode === 'navigate';

    var network = fetch(request).then(function (response) {
        if (response && response.ok && response.type === 'basic') {
            var copy = response.clone();
            caches.open(CACHE_VERSION).then(function (cache) {
                cache.put(request, copy);
            });
        }
        return response;
    });

    function offlineFallback() {
        if (isPage) return caches.match('./index.html');
        return Response.error();
    }

    event.respondWith(
        withTimeout(network, NETWORK_TIMEOUT_MS).catch(function () {
            return caches.match(request, { ignoreSearch: isPage }).then(function (hit) {
                if (hit) return hit;
                // Nothing cached yet (first visit on a slow link): keep
                // waiting for the real response instead of failing.
                return network.catch(offlineFallback);
            });
        })
    );
});
