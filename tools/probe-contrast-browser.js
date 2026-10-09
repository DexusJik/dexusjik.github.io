/* Measures real rendered contrast on every visible text element, in both
 * themes, across every screen and viewport.
 *
 * WHY A BROWSER IS REQUIRED
 * -------------------------
 * The static gates compare token pairs a human chose. A rule that paints text
 * with a RAW palette step instead of a token is invisible to them by
 * construction: the bug IS that the token is not used. Every gate was green
 * while 19 dark-mode elements sat below AA, several at 1.00:1, because
 * `h1,h2,h3,h4` set `color: var(--navy-800)` and `--surface` becomes that same
 * navy in dark mode. The headings were invisible, not merely faint.
 *
 * WHAT IT COVERS, AND WHY EACH PIECE IS HERE
 * ------------------------------------------
 * Every item below exists because its absence hid a real defect:
 *
 *  - MOBILE (390px). The nav drawer is `display: none` above 62rem. A desktop-
 *    only sweep reported the drawer's dark links as PASSING at 1280px, while
 *    at 390px they were navy on navy at 1.00:1. Invisible, and missed twice.
 *  - OPEN MENUS. Anything hidden until interaction is unmeasured by default.
 *  - HOVER AND FOCUS. These are where colour bugs hide, because the background
 *    changes under text that was chosen for a different background. No
 *    pointer input was dispatched in the earlier census, so none were seen.
 *  - EVERY SCREEN AND MODAL. The census showed 17 states across 7 site scenes
 *    and 10 app states; a landing-state-only sweep sees the path and nothing else.
 *  - PRE- AND POST-ANIMATION. `.reveal` elements must be force-finished or an
 *    ancestor's opacity multiplies the text alpha and reports ~1:1 for the whole
 *    page (51 false failures). But force-finishing them HIDES a genuine opacity
 *    bug: the locked badge reads 1.96:1 and looks fine once animated in. So
 *    each scene is measured twice, and anything that only passes post-animation
 *    is reported as an opacity suspect.
 *  - PIXEL SAMPLING. 16 elements sit over a photograph or a gradient, which the
 *    DOM genuinely cannot resolve. Those get the text hidden and the real
 *    rendered pixel behind it sampled from a screenshot.
 *
 * HOW IT DRIVES THE PAGE
 * ---------------------
 * The pages set CSP `script-src 'self'`, so an injected inline script is
 * blocked. Rather than copy the pages, this speaks the DevTools Protocol over
 * HTTP + WebSocket and evaluates the collector directly. Nothing in the repo is
 * written.
 *
 * Run: node tools/probe-contrast-browser.js [--json]
 */
'use strict';

const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const net = require('net');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const REPO = require('./repo');
const AS_JSON = process.argv.indexOf('--json') >= 0;
const PORT_DEBUG = 9222;

/* ------------------------------------------------------------------ *
 * portability: any Chromium-family browser, any OS
 * ------------------------------------------------------------------ */
function findBrowser() {
    const CANDIDATES = [
        process.env.CHROME_PATH,
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/microsoft-edge',
        '/usr/bin/microsoft-edge-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/snap/bin/chromium',
    ].filter(Boolean);

    for (const p of CANDIDATES) {
        try { if (fs.existsSync(p)) return p; } catch (e) { /* keep looking */ }
    }
    return null;
}

const BROWSER = findBrowser();

/* a scratch dir that is writable on every platform */
const TEMP = path.join(require('os').tmpdir(), 'igsg-probe-');
fs.mkdirSync(TEMP, { recursive: true });

if (!BROWSER) {
    console.error('No Chromium-family browser found.');
    console.error('Install Edge, Chrome or Chromium, or set CHROME_PATH.');
    process.exit(2);
}

/* ------------------------------------------------------------------ *
 * a static file server in node, so the probe has no python dependency
 * ------------------------------------------------------------------ */
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
};

function serve() {
    const server = http.createServer(function (req, res) {
        let rel = decodeURIComponent(req.url.split('?')[0]);
        if (rel === '/') rel = '/index.html';
        const abs = path.join(REPO.REPO, path.normalize(rel).replace(/^([/\\])+/, ''));
        if (!abs.startsWith(REPO.REPO)) { res.writeHead(403); res.end(); return; }
        fs.readFile(abs, function (err, buf) {
            if (err) { res.writeHead(404); res.end('not found'); return; }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
            res.end(buf);
        });
    });

    return new Promise(function (resolve, reject) {
        /*
         * listen(0) asks the OS for a free port, so two concurrent probes do not
         * collide. The 'error' listener makes EADDRINUSE reject, so a bind failure
         * reports itself instead of hanging with no output.
         *
         * A previous version nested one promise inside another whose callback
         * never fired, so the probe hung before printing a single scene. The
         * watchdog now catches that class of hang; this is the fix.
         */
        server.on('error', reject);
        server.listen(0, '127.0.0.1', function () { resolve(server); });
    });
}

/* ------------------------------------------------------------------ *
 * minimal PNG decoder, so pixel sampling needs no dependency
 * ------------------------------------------------------------------ */
function decodePng(buf) {
    if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a png');
    let pos = 8;
    let width = 0, height = 0, bitDepth = 0, colorType = 0;
    const idat = [];

    while (pos < buf.length) {
        const len = buf.readUInt32BE(pos);
        const type = buf.toString('ascii', pos + 4, pos + 8);
        const data = buf.slice(pos + 8, pos + 8 + len);
        if (type === 'IHDR') {
            width = data.readUInt32BE(0);
            height = data.readUInt32BE(4);
            bitDepth = data[8];
            colorType = data[9];
        } else if (type === 'IDAT') {
            idat.push(data);
        } else if (type === 'IEND') {
            break;
        }
        pos += 12 + len;
    }

    if (bitDepth !== 8) throw new Error('unsupported bit depth ' + bitDepth);
    const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
    if (!channels) throw new Error('unsupported colour type ' + colorType);

    const raw = zlib.inflateSync(Buffer.concat(idat));
    const stride = width * channels;
    const out = Buffer.alloc(height * stride);

    let rp = 0;
    for (let y = 0; y < height; y++) {
        const filter = raw[rp++];
        const line = raw.slice(rp, rp + stride);
        rp += stride;
        const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : null;
        const cur = out.slice(y * stride, (y + 1) * stride);

        for (let x = 0; x < stride; x++) {
            const a = x >= channels ? cur[x - channels] : 0;
            const b = prev ? prev[x] : 0;
            const c = prev && x >= channels ? prev[x - channels] : 0;
            let v = line[x];
            /* the five PNG filters, per the spec */
            if (filter === 1) v += a;
            else if (filter === 2) v += b;
            else if (filter === 3) v += Math.floor((a + b) / 2);
            else if (filter === 4) {
                const p = a + b - c;
                const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
                v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
            }
            cur[x] = v & 0xff;
        }
    }

    return { width: width, height: height, channels: channels, data: out };
}

/* shared luminance, so the sampler and the ratio use identical maths */
function lum(rgb) {
    const c = rgb.map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/* average a small box of pixels, which is what a glyph-free sample needs */
function samplePixel(img, x, y, radius) {
    const r = radius || 2;
    let tr = 0, tg = 0, tb = 0, n = 0;
    for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
            const px = Math.round(x) + dx;
            const py = Math.round(y) + dy;
            if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;
            const i = (py * img.width + px) * img.channels;
            tr += img.data[i];
            tg += img.data[i + 1];
            tb += img.data[i + 2];
            n++;
        }
    }
    return n ? [tr / n, tg / n, tb / n] : null;
}

/* ------------------------------------------------------------------ *
 * the collector, evaluated in the page
 * ------------------------------------------------------------------ */
const COLLECTOR = `
(function () {
    'use strict';
    function px(s) {
        var m = String(s || '').match(/-?[\\d.]+/g);
        return m ? m.map(Number) : null;
    }
    function lum(rgb) {
        var c = rgb.map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }
    function over(fg, bg) {
        var a = fg[3];
        return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
    }

    var results = [];
    var all = document.body.querySelectorAll('*');

    for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'IMG', 'SVG', 'PATH', 'CANVAS', 'VIDEO'].indexOf(el.tagName) >= 0) continue;

        var text = '';
        for (var j = 0; j < el.childNodes.length; j++) {
            var n = el.childNodes[j];
            if (n.nodeType === 3) text += n.nodeValue;
        }
        text = text.replace(/\\s+/g, ' ').trim();
        if (!text) continue;

        var cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || '';
        if (/\\bsr-only\\b/.test(cls)) continue;

        var cs = getComputedStyle(el);
        var r = el.getBoundingClientRect();
        /* measured BEFORE the animation sweep, so a genuine opacity bug is visible */
        var ownOpacity = parseFloat(cs.opacity);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (ownOpacity === 0) continue;
        if (r.width === 0 || r.height === 0) continue;

        var fgRaw = px(cs.color);
        if (!fgRaw) continue;

        /* the effective background: every ancestor composited down to <html> */
        var bg = null, hasImage = false, layerFor = null;
        var node = el, nodeAlpha = 1, bgAlphaUsed = 0;
        while (node && node !== document.documentElement.parentNode) {
            var s2 = getComputedStyle(node);
            if (s2.backgroundImage && s2.backgroundImage !== 'none') { hasImage = true; layerFor = node; }

            /*
             * Both full-bleed sections paint their backdrop as a POSITIONED
             * LAYER rather than an ancestor background:
             *   .quote-band -> an <img> at z-index -2 under a ::after gradient
             *   .promo      -> a linear-gradient on a positioned ::before
             * Walking ancestors alone sees only the page colour and reports a
             * confident, meaningless number: white text measured 1.05:1 on
             * "sand" when it is in fact white on a dark photograph.
             */
            var kids = node.children;
            for (var k = 0; k < kids.length; k++) {
                var kk = kids[k], ks = getComputedStyle(kk);
                if (ks.position !== 'absolute' && ks.position !== 'fixed') continue;
                var kr = kk.getBoundingClientRect(), nr = node.getBoundingClientRect();
                if (nr.width <= 0) continue;
                if (kr.width < nr.width * 0.7 || kr.height < nr.height * 0.7) continue;
                var tag = kk.tagName;
                if (tag === 'IMG' || tag === 'PICTURE' || tag === 'VIDEO' ||
                    tag === 'CANVAS' || tag === 'SVG') { hasImage = true; layerFor = node; break; }
                if (ks.backgroundImage && ks.backgroundImage !== 'none') { hasImage = true; layerFor = node; break; }
            }

            var b = px(s2.backgroundColor);
            if (b) {
                var alpha = b.length > 3 ? b[3] : 1;
                if (alpha > 0) { bg = over([b[0], b[1], b[2], 1], bg || [255, 255, 255]); bgAlphaUsed = alpha; }
            }
            var na = parseFloat(s2.opacity);
            if (!isNaN(na) && na < 1) nodeAlpha *= na;
            if (bg && bgAlphaUsed >= 1) break;
            node = node.parentElement;
        }
        if (!bg) bg = [255, 255, 255];

        /* ancestor opacity multiplies the text's own alpha */
        var fgAlpha = (fgRaw.length > 3 ? fgRaw[3] : 1) * nodeAlpha;
        var fgEff = [0, 1, 2].map(function (k) {
            return fgRaw[k] * fgAlpha + bg[k] * (1 - fgAlpha);
        });

        var la = lum(fgEff), lb = lum(bg);
        var ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);

        var size = parseFloat(cs.fontSize);
        var weight = parseInt(cs.fontWeight, 10) || 400;
        var large = size >= 24 || (size >= 18.66 && weight >= 700);

        var disabled = el.disabled === true || el.getAttribute('aria-disabled') === 'true';
        /*
         * Emoji are NOT decorative. They are reported in their own bucket for a
         * real reason: an emoji renders from a colour font that ignores the CSS
         * colour property, so no token change can fix its contrast. But they are
         * still output, still counted, and still shown.
         *
         * The earlier regex was \u2600-\u27BF, which also matched U+2713 and
         * U+2605. game.js writes those as a lesson node's ONLY content, meaning
         * "done" and "perfect", so 40 of the 73 path nodes were silently dropped
         * from every scene in both themes.
         */
        var emoji = /[\u{1F000}-\u{1FAFF}\u{2700}\u{FE0F}]/u.test(text);
        var decorative = el.getAttribute('aria-hidden') === 'true' ||
            cls.indexOf('__mark') >= 0;

        results.push({
            /* idx is the element's position in the same traversal the collector
               used. Re-finding it later by selector is NOT safe: a selector
               like p.eyebrow matches the FIRST eyebrow on the page, which is in
               a different, light-coloured section, so the sampler scrolled there
               and read the wrong background. The index is exact. */
            idx: i,
            sel: (el.tagName.toLowerCase() + (cls ? '.' + String(cls).trim().split(/\\s+/).join('.') : '')).slice(0, 90),
            id: el.id || '',
            ratio: Math.round(ratio * 100) / 100,
            need: large ? 3 : 4.5,
            size: size,
            weight: weight,
            fg: [Math.round(fgEff[0]), Math.round(fgEff[1]), Math.round(fgEff[2])],
            ownOpacity: ownOpacity,
            /* the ancestor-opacity product, so the pixel sampler can build the
               same foreground the DOM walk would have, rather than a blend
               against the wrong background */
            nodeAlpha: nodeAlpha,
            hasAncestorOpacity: nodeAlpha < 1,
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + r.height / 2),
            text: text.slice(0, 40),
            disabled: disabled,
            overImage: hasImage,
            decorative: decorative,
            emoji: emoji,
        });
    }
    return JSON.stringify({ theme: document.documentElement.getAttribute('data-theme'), results: results });
})()
`;

/* ------------------------------------------------------------------ *
 * a tiny CDP client
 * ------------------------------------------------------------------ */
function get(p) {
    return new Promise((resolve, reject) => {
        http.get({ host: '127.0.0.1', port: PORT_DEBUG, path: p }, function (res) {
            let body = '';
            res.on('data', function (c) { body += c; });
            res.on('end', function () {
                try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

/*
 * A HARD WATCHDOG.
 *
 * The probe hung past 25 minutes, producing zero bytes because stdout is
 * buffered when piped — no way to see where it stopped. Whatever the cause, a
 * gate that can hang forever is worse than one that fails: CI would sit on its
 * default timeout with nothing to show. This forces an exit with a message.
 */
const WATCHDOG_MS = 10 * 60 * 1000;
const watchdog = setTimeout(function () {
    console.error('');
    console.error('WATCHDOG: the probe exceeded ' + (WATCHDOG_MS / 60000) +
        ' minutes and has been killed.');
    console.error('This is a defect, not a slow machine. A contrast gate that hangs is worse than one that fails.');
    process.exit(3);
}, WATCHDOG_MS);
if (watchdog.unref) watchdog.unref();

function cdpConnect(wsUrl) {
    return new Promise(function (resolve, reject) {
        const m = wsUrl.match(/^wss?:\/\/([^:/]+):(\d+)(\/.*)$/);
        if (!m) { reject(new Error('bad ws url: ' + wsUrl)); return; }
        const host = m[1], port = parseInt(m[2], 10), route = m[3];
        const secure = wsUrl.indexOf('wss://') === 0;
        const key = crypto.randomBytes(16).toString('base64');

        const sock = secure
            ? tlsConnect(host, port)
            : net.connect(port, host, function () {
                sock.write(
                    'GET ' + route + ' HTTP/1.1\r\n' +
                    'Host: ' + host + ':' + port + '\r\n' +
                    'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
                    'Sec-WebSocket-Key: ' + key + '\r\nSec-WebSocket-Version: 13\r\n\r\n'
                );
            });

        let buf = Buffer.alloc(0), upgraded = false;
        const pending = new Map();
        let nextId = 1;

        function tlsConnect() { throw new Error('wss is not used by local CDP'); }

        /*
         * Client-to-server frames MUST be masked (RFC 6455 §5.3). An unmasked
         * frame is silently dropped by a conforming server, so omitting this
         * does not error: it just hangs forever on the first command. Verified
         * by evaluating 1+1 and getting 2 back.
         */
        function encode(str) {
            const payload = Buffer.from(str, 'utf8');
            const len = payload.length;
            const MASK = 0x80;
            let header;
            if (len < 126) {
                header = Buffer.alloc(2);
                header[1] = MASK | len;
            } else if (len < 65536) {
                header = Buffer.alloc(4);
                header[1] = MASK | 126;
                header.writeUInt16BE(len, 2);
            } else {
                header = Buffer.alloc(10);
                header[1] = MASK | 127;
                header.writeUInt32BE(0, 2);
                header.writeUInt32BE(len, 6);
            }
            header[0] = 0x81;

            const maskKey = crypto.randomBytes(4);
            const masked = Buffer.alloc(payload.length);
            for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ maskKey[i % 4];
            return Buffer.concat([header, maskKey, masked]);
        }

        function onData(chunk) {
            buf = Buffer.concat([buf, chunk]);
            if (!upgraded) {
                const idx = buf.indexOf('\r\n\r\n');
                if (idx < 0) return;
                buf = buf.slice(idx + 4);
                upgraded = true;
                resolve(api);
            }
            while (buf.length >= 2) {
                const op = buf[0] & 0x0f;
                const len0 = buf[1] & 0x7f;
                let offset = 2, len = len0;
                if (len0 === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); offset = 4; }
                else if (len0 === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); offset = 10; }
                if (buf.length < offset + len) return;
                const payload = buf.slice(offset, offset + len);
                buf = buf.slice(offset + len);
                if (op !== 1) continue;
                try {
                    const msg = JSON.parse(payload.toString('utf8'));
                    if (msg.id && pending.has(msg.id)) {
                        const p = pending.get(msg.id);
                        pending.delete(msg.id);
                        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
                        else p.resolve(msg.result);
                    }
                } catch (e) { /* ignore non-JSON frames */ }
            }
        }

        sock.on('data', onData);
        sock.on('error', reject);

        const api = {
            send(method, params) {
                const id = nextId++;
                return new Promise(function (res, rej) {
                    pending.set(id, { resolve: res, reject: rej });
                    sock.write(encode(JSON.stringify({ id: id, method: method, params: params || {} })));
                });
            },
            close() { sock.destroy(); },
        };
    });
}

/* ------------------------------------------------------------------ *
 * scenarios: every screen, every viewport, every theme
 * ------------------------------------------------------------------ */
const SCENES = [
    /* ---- main site: desktop and mobile ---- */
    { page: 'index.html', group: 'site', name: 'site desktop', width: 1280, height: 1000 },
    { page: 'index.html', group: 'site', name: 'site mobile', width: 390, height: 844 },

    /* the drawer is display:none above 62rem. Measuring only at desktop is how
       navy-on-navy drawer links passed at 1.00:1 twice over. */
    {
        page: 'index.html', group: 'site', name: 'site mobile + drawer', width: 390, height: 844,
        open: 'var t=document.querySelector(".nav-toggle");if(!t)return null;t.click();',
    },

    /* the quiz: the entry point is #quiz-button, which smooth-scrolls to
       #quiz-section. An earlier scene used #quiz-start, which does not exist,
       so it measured the landing page again and nothing noticed. */
    {
        page: 'index.html', group: 'site', name: 'site quiz step 1', width: 1280, height: 1000,
        open: 'var b=document.getElementById("quiz-button");if(!b)return null;b.click();',
    },
    /* walk the steps: answer, then Siguiente. Steps 2-4 were never reached by
       any scene, so three quarters of the quiz went unmeasured. */
    {
        page: 'index.html', group: 'site', name: 'site quiz step 2', width: 1280, height: 1000,
        open: '(function(){var b=document.getElementById("quiz-button");if(b)b.click();' +
            'var n=document.getElementById("next-step-btn");if(!n)return null;n.click();n.click();return 1;})()',
    },
    {
        page: 'index.html', group: 'site', name: 'site quiz step 4', width: 1280, height: 1000,
        open: '(function(){var b=document.getElementById("quiz-button");if(b)b.click();' +
            'var n=document.getElementById("next-step-btn");if(!n)return null;' +
            'n.click();n.click();n.click();n.click();return 1;})()',
    },
    /* the result screen starts hidden and is the only place #cefr-level renders */
    {
        page: 'index.html', group: 'site', name: 'site quiz result', width: 1280, height: 1000,
        open: '(function(){var b=document.getElementById("quiz-button");if(b)b.click();' +
            'var s=document.getElementById("quiz-step-1");if(!s)return null;' +
            's.querySelector(".quiz-option-button").click();' +
            'var n=document.getElementById("next-step-btn");if(!n)return null;n.click();' +
            'var s2=document.getElementById("quiz-step-2");if(!s2)return null;' +
            's2.querySelector(".quiz-option-button").click();n.click();' +
            'var s3=document.getElementById("quiz-step-3");if(!s3)return null;' +
            's3.querySelector(".quiz-option-button").click();n.click();' +
            'var s4=document.getElementById("quiz-step-4");if(!s4)return null;' +
            's4.querySelector(".quiz-option-button").click();n.click();return 1;})()',
    },

    /* hover states: the background changes under text chosen for another
       background, which is exactly where these bugs live. .btn--secondary is
       here because a previous sweep measured its hover as invisible in dark. */
    { page: 'index.html', group: 'site', name: 'site secondary btn hover', width: 1280, height: 1000, hover: '.btn--secondary' },
    { page: 'index.html', group: 'site', name: 'site quiz button hover', width: 1280, height: 1000, hover: '#quiz-button' },
    { page: 'index.html', group: 'site', name: 'site theme-toggle hover', width: 1280, height: 1000, hover: '.theme-toggle' },
    { page: 'index.html', group: 'site', name: 'site nav-link hover', width: 1280, height: 1000, hover: '.nav-link' },
    { page: 'index.html', group: 'site', name: 'site ghost btn hover', width: 1280, height: 1000, hover: '.btn--ghost' },
    { page: 'index.html', group: 'site', name: 'site gold btn hover', width: 1280, height: 1000, hover: '.btn--gold' },
    /* an option must be selected before its :hover, and the hover itself is
       what makes the selected/border state visible */
    {
        page: 'index.html', group: 'site', name: 'site quiz option hover', width: 1280, height: 1000,
        open: 'var b=document.getElementById("quiz-button");if(b)b.click();' +
            'var o=document.querySelector(".quiz-option-button");if(!o)return null;o.click();',
        hover: '.quiz-option-button',
    },

    /*
     * FOCUS. 21 :focus-visible rules existed and none were ever measured,
     * because the only interaction the driver dispatched anywhere was a mouse
     * move. These are keyboard-only states.
     */
    { page: 'index.html', group: 'site', name: 'site nav-link focus', width: 1280, height: 1000, focus: '.nav-link' },
    { page: 'index.html', group: 'site', name: 'site secondary btn focus', width: 1280, height: 1000, focus: '.btn--secondary' },
    { page: 'index.html', group: 'site', name: 'site ghost btn focus', width: 1280, height: 1000, focus: '.btn--ghost' },
    { page: 'index.html', group: 'site', name: 'site theme-toggle focus', width: 1280, height: 1000, focus: '.theme-toggle' },
    {
        page: 'index.html', group: 'site', name: 'site quiz option focus', width: 1280, height: 1000,
        open: 'var b=document.getElementById("quiz-button");if(b)b.click();',
        focus: '.quiz-option-button',
    },

    /* FAQ details open a body that is display:none until toggled */
    {
        page: 'index.html', group: 'site', name: 'site faq open', width: 1280, height: 1000,
        open: 'var d=document.querySelector(".faq details");if(!d)return null;d.open=true;',
    },

    /*
     * 404.html loads no theme.js, so DailyTheme is undefined and
     * set("dark") is a silent no-op. The scene asserts the theme actually
     * applied and reports a SETUP ERROR if it did not.
     */
    /*
     * 404.html is EXCLUDED, and the reason is printed rather than buried.
     *
     * It deliberately ships `script-src 'none'` and contains no script at all, so
     * theme.js cannot run there and it has no dark mode. That is a security
     * decision, not a defect: a static error page has nothing to execute.
     *
     * An earlier version of this probe asserted the theme had applied on every
     * scene, which produced four SETUP ERRORS for the 404 — correct reporting of
     * a real inconsistency, but one the owner decided to accept. Those rows are
     * therefore measured in LIGHT ONLY and labelled as such, instead of either
     * failing CI or being dropped without explanation.
     */
    { page: '404.html', group: 'site', name: '404 desktop', width: 1280, height: 800, noTheme: true },
    { page: '404.html', group: 'site', name: '404 mobile', width: 390, height: 844, noTheme: true },

    /* ---- app ---- */
    { page: 'english-daily/index.html', group: 'app', name: 'app desktop path', width: 1280, height: 1000, seed: true },
    { page: 'english-daily/index.html', group: 'app', name: 'app mobile path', width: 390, height: 844, seed: true },

    /* the entry point is #lesson-cta */
    {
        page: 'english-daily/index.html', group: 'app', name: 'app lesson', width: 390, height: 844, seed: true,
        open: 'var b=document.getElementById("lesson-cta");if(!b)return null;b.click();',
    },

    /*
     * The shop opens from #gems-stat. An earlier scene used #shop-open, which
     * does not exist, so "app shop" measured the path screen a second time and
     * the shop's contrast was never gated at all.
     */
    {
        page: 'english-daily/index.html', group: 'app', name: 'app shop modal', width: 390, height: 844, seed: true,
        open: 'var b=document.getElementById("gems-stat");if(!b)return null;b.click();',
    },

    /* the calendar. Find its real trigger before assuming one. */
    {
        page: 'english-daily/index.html', group: 'app', name: 'app calendar modal', width: 390, height: 844, seed: true,
        open: 'var b=document.getElementById("streak-stat")||document.querySelector("[data-cal]");' +
            'if(!b)return null;b.click();',
    },

    /* the placement test is the app's largest interactive surface and no scene
       reached it: the blanket #placement-prompt dismissal hid it from all of
       them. skipPlacement must therefore seed placementSkipped:false. */
    {
        page: 'english-daily/index.html', group: 'app', name: 'app placement prompt', width: 390, height: 844,
        seed: true, skipPlacement: true,
        open: '(function(){var p=document.getElementById("placement-prompt");' +
            'if(p)p.hidden=false;var b=document.getElementById("placement-start");' +
            'if(!b)return null;b.click();return 1;})()',
    },

    /* hover, with the target scrolled into view first. .node.current sits
       around y=5300 in an 844px viewport, so an unscrolled dispatch never
       applied the hover at all. */
    {
        page: 'english-daily/index.html', group: 'app', name: 'app node hover', width: 390, height: 844, seed: true,
        hover: '.node.available',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app current node hover', width: 390, height: 844, seed: true,
        hover: '.node.current',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app locked node hover', width: 390, height: 844, seed: true,
        hover: '.node.locked',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app lesson cta hover', width: 390, height: 844, seed: true,
        hover: '#lesson-cta',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app node focus', width: 390, height: 844, seed: true,
        focus: '.node.current',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app lesson cta focus', width: 390, height: 844, seed: true,
        focus: '#lesson-cta',
    },
    {
        page: 'english-daily/index.html', group: 'app', name: 'app goal button focus', width: 390, height: 844, seed: true,
        focus: '#unit-guide-btn',
    },
];

const SEED = `
(function () {
    try {
        localStorage.setItem('igsg_daily_v1', JSON.stringify({
            nickname: 'Camila', gems: 210, xp: 980, streak: 17, bestStreak: 31,
            lastStudyDate: '2026-10-7', studyHistory: { '2026-10-7': true },
            dailyXp: 30, dailyXpDate: '2026-10-7',
            lessonsDone: 19, perfectLessons: 7, seenSentences: 95,
            hearts: 5, heartsTs: Date.now(), currentLesson: 19,
            completed: { 0: true, 1: true, 2: true, 3: true, 4: true },
            missed: {}, badges: {}, rivals: [],
            placement: { score: 44, max: 78, total: 30, level: 4, v: 5 },
            placementSkipped: true, storageNoticeDismissed: true, features: {}
        }));
    } catch (e) {}
})();
`;

const FINISH_ANIMATIONS =
    '.reveal,.fade-up,.delay-1,.delay-2,.delay-3,.line-wrap,' +
    '.text-reveal-container{opacity:1 !important;transform:none !important;' +
    'animation:none !important;transition:none !important}';

async function main() {
    let browser = null;
    let server = null;
    let cdp = null;

    /*
     * Teardown. Without this, any throw inside the scene loop took the
     * main().catch path and exited 2 leaving an orphaned headless browser
     * holding a temp profile, and the port still bound — on a developer
     * machine and in CI alike.
     */
    function finish() {
        try { if (cdp) cdp.close(); } catch (e) { /* already gone */ }
        try { if (browser) browser.kill(); } catch (e) { /* already gone */ }
        try { if (server) server.close(); } catch (e) { /* already gone */ }
        try {
            fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
        } catch (e) { /* a locked temp dir is not worth failing over */ }
    }

    /*
     * A free ephemeral port, not a fixed one. Port 8177 and 9222 were both fixed
     * in earlier versions, and 9222 in particular is the developer's own default
     * debugging port: the run would attach to and drive an unrelated browser
     * while its own failed to bind and was killed as if nothing were wrong.
     */
    server = await serve();
    const httpPort = server.address().port;

    /* a unique profile per run, so a locked temp dir from a killed run cannot
       collide with the next one */
    const profile = path.join(TEMP, 'pf_' + Date.now());

    /*
     * The browser must be launched BEFORE polling for its debug port. An
     * earlier ordering polled first, which can never succeed: nothing is
     * listening yet, so it always failed with "the debug port never came up".
     */
    browser = spawn(BROWSER, [
        '--headless=new', '--disable-gpu', '--no-first-run', '--disable-extensions',
        /* required on any runner that executes as root: Chrome refuses to start
           otherwise and the run dies claiming it could not attach */
        '--no-sandbox',
        '--remote-debugging-port=' + PORT_DEBUG,
        '--user-data-dir=' + profile,
        'about:blank',
    ], { stdio: 'ignore' });

    /* the browser is launched above so the debug port exists; wait for it */
    for (let i = 0; i < 40; i++) {
        try {
            const t = await get('/json/list');
            const pg = t && t.find(function (x) { return x.type === 'page'; });
            if (pg) { cdp = await cdpConnect(pg.webSocketDebuggerUrl); break; }
        } catch (e) { /* retry */ }
        await sleep(500);
    }
    if (!cdp) { finish(); throw new Error('could not attach to the browser'); }

        await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const report = [];
    let seeded = false;

    /*
     * Pixel-sampling cache, keyed by page + theme.
     *
     * Without it, each of the 35 scenes screenshotted its own copy of the same
     * 16 over-image elements — over a thousand captures per run, and the probe
     * stopped finishing at all. The elements are the same DOM objects regardless
     * of which scene opened the page, so each combination is measured once and
     * reused. This is both a speed fix and a correctness fix: the two passes now
     * agree because they share one measurement.
     */
    const sampleCache = new Map();

    /*
     * Truthfulness helpers. A gate that measures the wrong thing and reports
     * zero failures is worse than no gate, so every scene must prove it set up
     * correctly or be recorded as a failure. Each check below exists because a
     * scene silently measured the wrong screen at least once.
     */
    async function evaluate(expression, returnByValue) {
        const r = await cdp.send('Runtime.evaluate', {
            expression: expression, returnByValue: !!returnByValue,
        });
        if (r.exceptionDetails) {
            throw new Error('page eval threw: ' +
                (r.exceptionDetails.exception && r.exceptionDetails.exception.description ||
                    r.exceptionDetails.text));
        }
        return returnByValue ? r.result.value : undefined;
    }

    /* a stylesheet that neuters every transition and animation, so a theme flip
       or a hover is measured settled rather than mid-blend */
    const SETTLE_CSS =
        '*{transition:none !important;animation:none !important;scroll-behavior:auto !important}';

    /*
     * try/finally so the browser and server are released even if a scene throws.
     * Previously a late rejection exited 2 with Chrome still running and the
     * port still bound.
     */
    try {
        for (const scene of SCENES) {
            const themesFor = function (scene) {
                return scene.noTheme ? ['light'] : ['light', 'dark'];
            };

            for (const theme of themesFor(scene)) {
                /* printed BEFORE the scene runs, so a hang is visible rather
                   than silent. The probe hung past 30 minutes once with no
                   output at all, which is indistinguishable from slow. */
                console.log('… ' + scene.name + ' [' + theme + ']');
                const sceneStarted = Date.now();
            const setupErrors = [];
            const url = 'http://127.0.0.1:' + httpPort + '/' + scene.page;

            await cdp.send('Emulation.setDeviceMetricsOverride', {
                width: scene.width, height: scene.height, deviceScaleFactor: 1, mobile: false,
            });

            if (scene.seed && !seeded) {
                await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: SEED });
                seeded = true;
            }

            /*
             * Wait for the load event rather than sleeping a fixed time.
             * A cold runner with web fonts and a service worker registered can
             * take far longer than any constant, and measuring mid-load makes
             * the gate's verdict depend on machine speed.
             */
            const nav = await cdp.send('Page.navigate', { url });
            if (nav.errorText) setupErrors.push('navigation failed: ' + nav.errorText);
            for (let i = 0; i < 60; i++) {
                const st = await evaluate('document.readyState', true);
                if (st === 'complete') break;
                if (i === 59) setupErrors.push('page never reached readyState=complete');
                await sleep(250);
            }
            try {
                await evaluate('(window.fonts ? window.fonts.ready : Promise.resolve()).then(function(){return 1})', true);
            } catch (e) { /* fonts not loadable: carry on, sizes still resolve */ }

            /* settle all motion BEFORE measuring anything */
            await evaluate('(function(){var s=document.createElement("style");s.id="zz-settle";' +
                's.textContent=' + JSON.stringify(SETTLE_CSS) + ';document.head.appendChild(s);return 1;})()');

            /* dismiss first-run modals so the page beneath is measurable */
            await evaluate('(function(){var m=document.getElementById("nick-modal");if(m)m.hidden=true;' +
                'var p=document.getElementById("placement-prompt");if(p)p.hidden=true;return 1;})()');

            /*
             * The theme must be ASSERTED, not assumed. 404.html loads no
             * theme.js, so DailyTheme is undefined there and set("dark") is a
             * silent no-op: both 404 rows measured the same light rendering
             * while the report labelled the second one theme:"dark".
             */
            await evaluate(
                '(function(){' +
                'if(window.DailyTheme&&window.DailyTheme.set){' +
                'window.DailyTheme.set("' + theme + '");}' +
                'return 1;})()', true);
            await sleep(60);

            /*
             * Read the data-theme ATTRIBUTE, in a second step, rather than
             * returning it from the same expression. theme.js exposes no
             * `current()` method, so reading it that way returned undefined; and
             * reading it from the same evaluate that called set() returned the
             * previous theme. The attribute is what the browser actually renders.
             */
            const applied = await evaluate(
                'document.documentElement.getAttribute("data-theme")', true);
            /*
             * A page that has no script cannot have a theme applied, and saying
             * so is not the same as saying it failed.
             */
            if (applied !== theme && !scene.noTheme) {
                setupErrors.push('theme "' + theme + '" was not applied (got ' + applied + ')');
            }

            /* open whatever this scene needs open, and require it to match */
            /*
             * Note the trailing semicolon before `return 1`. Without it, a scene
             * whose `open` is itself an IIFE evaluates to
             * `(function(){...})()return 1;` — a syntax error, which the browser
             * reports as `undefined`, which read as "the scene never opened".
             */
            if (scene.open) {
                const ok = await evaluate('(function(){' + scene.open + ';return 1;})()', true);
                if (ok !== 1) {
                    setupErrors.push('scene.open matched nothing: the screen was never opened');
                }
            }

            /*
             * Focus pass. 21 :focus-visible rules existed and none were ever
             * measured, because the only interaction the driver dispatched
             * anywhere was a mouse move.
             */
            if (scene.focus) {
                const box = await evaluate('(function(){var e=document.querySelector(' +
                    JSON.stringify(scene.focus) + ');if(!e)return null;' +
                    'if(e.scrollIntoView)e.scrollIntoView({block:"center",behavior:"instant"});' +
                    'e.focus();var r=e.getBoundingClientRect();' +
                    'return JSON.stringify({x:Math.round(r.left+r.width/2),' +
                    'y:Math.round(r.top+r.height/2)});})()', true);
                if (box === null) {
                    setupErrors.push('scene.focus matched nothing: ' + scene.focus);
                } else {
                    const p = JSON.parse(box);
                    if (p.x < 0 || p.y < 0 || p.x > scene.width || p.y > scene.height) {
                        setupErrors.push('scene.focus target stayed off-screen at ' + p.x + ',' + p.y);
                    } else {
                        await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
                        await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
                        await sleep(250);
                    }
                }
            }

            /*
             * Real pointer hover. Colour bugs live in hover states because the
             * background changes under text chosen for a different background.
             * The target must be scrolled into view first, or the dispatch lands
             * at document coordinates while the element is off-screen and the
             * hover never applies at all.
             */
            if (scene.hover) {
                const box = await evaluate('(function(){var e=document.querySelector(' +
                    JSON.stringify(scene.hover) + ');if(!e)return null;' +
                    'if(e.scrollIntoView)e.scrollIntoView({block:"center",behavior:"instant"});' +
                    'var r=e.getBoundingClientRect();' +
                    'return JSON.stringify({x:Math.round(r.left+r.width/2),' +
                    'y:Math.round(r.top+r.height/2)});})()', true);
                if (box === null) {
                    setupErrors.push('scene.hover matched nothing: ' + scene.hover);
                } else {
                    const p = JSON.parse(box);
                    if (p.x < 0 || p.y < 0 || p.x > scene.width || p.y > scene.height) {
                        setupErrors.push('scene.hover target off-screen at ' + p.x + ',' + p.y +
                            ': the hover never applied');
                    } else {
                        await cdp.send('Input.dispatchMouseEvent', {
                            type: 'mouseMoved', x: p.x, y: p.y, buttons: 0,
                        });
                        await sleep(250);
                    }
                }
            }

            /* PASS 1: as rendered, animations untouched. Catches a real
               opacity bug, which force-finishing would hide. */
            const pass1 = await cdp.send('Runtime.evaluate', { expression: COLLECTOR, returnByValue: true });
            /* PASS 2: animations force-finished, so below-the-fold text is
               measurable at all. */
            await cdp.send('Runtime.evaluate', {
                expression: '(function(){var s=document.createElement("style");s.id="zz-finish";' +
                    's.textContent=' + JSON.stringify(FINISH_ANIMATIONS) + ';document.head.appendChild(s);return 1;})()',
            });
            await sleep(200);
            const pass2 = await cdp.send('Runtime.evaluate', { expression: COLLECTOR, returnByValue: true });

            if (!pass1.result || pass1.result.value === undefined || !pass2.result || pass2.result.value === undefined) {
                report.push({ scene: scene.name, theme: theme, error: 'collector returned nothing' });
                continue;
            }

            const a = JSON.parse(pass1.result.value);
            const b = JSON.parse(pass2.result.value);

            /*
             * A real DOM-walk failure is: below threshold, not disabled (WCAG
             * 1.4.3 exempts inactive controls), not a decorative glyph, and not
             * sitting over an image. Over-image elements are excluded HERE
             * because their DOM-walk number is meaningless, and they are judged
             * instead by the pixel sampled from a screenshot below.
             */
            const isFail = function (x) {
                return x.ratio < x.need && !x.disabled && !x.decorative && !x.overImage;
            };

            /*
             * Pass 1 is matched to pass 2 by IDX, never by selector.
             * Matching on `sel + text` was wrong: index.html has bare <a> drawer
             * links and bare <a> footer links with identical copy, and two
             * "Elegir plan" buttons. One passing twin suppressed a genuinely
             * failing sibling, so an invisible drawer link was reported as
             * "passes when animated in". `idx` is unique by construction.
             */
            const bFail = b.results.filter(isFail);
            const passedInPass1 = new Set(a.results.filter(function (x) {
                return !isFail(x);
            }).map(function (x) { return x.idx; }));

            const opacitySuspect = bFail.filter(function (x) {
                return passedInPass1.has(x.idx);
            });
            const fails = bFail.filter(function (x) { return !passedInPass1.has(x.idx); });

            /*
             * The pixel sampler gets the SAME filter as the DOM walk. It had
             * none, so a control that was both over-image and disabled was
             * excluded from the walk and then pixel-sampled anyway, letting a
             * WCAG-exempt state fail CI.
             */
            const overImage = b.results.filter(function (x) {
                return x.overImage && !x.disabled && !x.decorative;
            });
            const sampled = [];
            let decodeError = null;

            /*
             * Reuse a previous pass's measurements for the same page and theme.
             * Each combination is a distinct key, so a light and a dark pass are
             * always measured separately.
             */
            const cacheKey = scene.page + '|' + theme;
            const cached = sampleCache.get(cacheKey);
            if (cached) {
                cached.sampled.forEach(function (s) { sampled.push(s); });
                decodeError = cached.decodeError;
            } else if (overImage.length) {
                /*
                 * Each element is scrolled into view, then sampled from its own
                 * screenshot. A single full-page capture does not work:
                 * `Page.captureScreenshot` only covers the viewport, and these
                 * elements sit far below it -- `.promo` is at y=3711 in a
                 * 1000px window. Sampling the one screenshot silently returned
                 * nothing for all 16, and the run reported "pixel-sampled 0"
                 * while claiming the check had run.
                 */
                await cdp.send('Runtime.evaluate', {
                    expression: '(function(){var s=document.createElement("style");s.id="zz-hide-text";' +
                        's.textContent="*{color:transparent !important;text-shadow:none !important}";' +
                        'document.head.appendChild(s);return 1;})()',
                });
                await sleep(150);

                const dprInfo = await cdp.send('Runtime.evaluate', {
                    expression: 'JSON.stringify({dpr:window.devicePixelRatio||1})',
                    returnByValue: true,
                });
                const dpr = JSON.parse(dprInfo.result.value).dpr || 1;

                for (const target of overImage) {
                    /*
                     * The element is found BY INDEX, using the same traversal
                     * the collector used. Re-finding it by selector was wrong:
                     * `p.eyebrow` matches the first eyebrow on the page, which
                     * lives in a different light section, so the sampler scrolled
                     * there and read a sand background. That produced confident
                     * nonsense - a "1.36:1 failure" for white text that was
                     * actually fine on navy.
                     */
                    const findEl =
                        'var all=document.body.querySelectorAll("*");' +
                        'var el=all[INDEX];';

                    const scrollExpr = ('(function(){' + findEl +
                        'if(!el)return null;' +
                        'el.scrollIntoView({block:"center",behavior:"instant"});return 1;})()')
                        .replace('INDEX', String(target.idx));
                    await cdp.send('Runtime.evaluate', { expression: scrollExpr });
                    await sleep(250);

                    /* re-read the position AFTER scrolling, since scrolling moves it */
                    const xyExpr = ('(function(){' + findEl +
                        'if(!el)return null;var r=el.getBoundingClientRect();' +
                        'return JSON.stringify({x:Math.round(r.left+r.width/2),' +
                        'y:Math.round(r.top+r.height/2)});})()')
                        .replace('INDEX', String(target.idx));

                    const xy = await cdp.send('Runtime.evaluate', {
                        expression: xyExpr, returnByValue: true,
                    });
                    if (!xy.result || !xy.result.value) {
                        decodeError = decodeError ||
                            ('could not locate ' + target.sel + ' after scrolling to it');
                        continue;
                    }
                    const pt = JSON.parse(xy.result.value);

                    let img = null;
                    try {
                        const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
                        if (!shot || !shot.data) throw new Error('captureScreenshot returned no data');
                        img = decodePng(Buffer.from(shot.data, 'base64'));
                    } catch (e) {
                        decodeError = decodeError || e.message;
                    }
                    if (!img) continue;

                    const px = samplePixel(img, pt.x * dpr, pt.y * dpr, Math.round(3 * dpr));
                    if (!px) {
                        decodeError = decodeError ||
                            ('could not sample ' + target.sel + ' at ' + pt.x + ',' + pt.y +
                                ' in a ' + img.width + 'x' + img.height + ' image');
                        continue;
                    }
                    /*
                     * `target.fg` is the DOM walk's foreground, already blended by
                     * the ancestor opacity chain against whatever opaque
                     * ancestor it found. For an over-image element that ancestor
                     * is usually white, so a translucent label was lightened and
                     * then compared against a photograph — a flattering ratio.
                     *
                     * The element's own computed colour, with its own alpha
                     * applied over the SAMPLED background, is what is actually
                     * painted. That is the honest foreground.
                     */
                    const own = await cdp.send('Runtime.evaluate', {
                        expression: '(function(){' +
                            'var all=document.body.querySelectorAll("*");' +
                            'var el=all[IDX];' +
                            'if(!el)return null;' +
                            'var cs=getComputedStyle(el);' +
                            'var m=cs.color.match(/[\\d.]+/g);' +
                            'if(!m)return null;' +
                            'return JSON.stringify({r:+m[0],g:+m[1],b:+m[2],a:m[3]===undefined?1:+m[3]});' +
                            '})()'.replace('IDX', String(target.idx)),
                        returnByValue: true,
                    });
                    let fg = target.fg;
                    if (own.result && own.result.value) {
                        const o = JSON.parse(own.result.value);
                        /*
                     * `nodeAlpha` is the product of every ancestor's opacity, which
                     * the collector already computed; reusing it keeps the two passes
                     * consistent rather than recomputing it differently here.
                     */
                    const eff = o.a * (target.nodeAlpha === undefined ? 1 : target.nodeAlpha);
                    const blended = [o.r, o.g, o.b].map(function (v, i) {
                        return v * eff + px[i] * (1 - eff);
                    });
                    fg = blended;
                    }
                    const la = lum(fg);
                    const lb = lum(px);
                    const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
                    sampled.push({
                        sel: target.sel, text: target.text, size: target.size,
                        weight: target.weight, need: target.need,
                        ratio: Math.round(ratio * 100) / 100,
                        fg: fg.map(function (v) { return Math.round(v); }),
                        bg: px.map(Math.round),
                    });
                }

                await cdp.send('Runtime.evaluate', {
                    expression: '(function(){var s=document.getElementById("zz-hide-text");if(s)s.remove();' +
                        'window.scrollTo(0,0);return 1;})()',
                });
            }

                /* a scene that takes over three minutes has hung. Record it and
                   move on rather than blocking the whole gate forever. */
                const sceneSecs = (Date.now() - sceneStarted) / 1000;
                if (sceneSecs > 180) {
                    setupErrors.push('scene took ' + Math.round(sceneSecs) +
                        's and is probably hung');
                }                sampleCache.set(cacheKey, { sampled: sampled, decodeError: decodeError });


            report.push({
                scene: scene.name, theme: theme, width: scene.width,
                measured: b.results.length,
                fails: fails,
                opacitySuspect: opacitySuspect,
                sampled: sampled,
                pixelError: decodeError,
                setupErrors: setupErrors,
                noTheme: !!scene.noTheme,
                disabled: b.results.filter(function (x) { return x.ratio < x.need && x.disabled; }),
                emoji: b.results.filter(function (x) { return x.emoji; }),
            });
            }
        }
    } finally {
        finish();
    }

    /* ---------- output ---------- */
    let totalFails = 0;
    let totalSuspect = 0;
    let totalSampled = 0;
    let totalSetupErrors = 0;

    /*
     * A scene that measured 0 elements is a failure, not a pass. It means the
     * page did not render, or the theme never applied, or nothing was
     * reachable — and the previous exit code took none of that into account,
     * so a run of entirely empty scenes printed "total failures: 0".
     */
    const allScenes = report.length;
    const emptyScenes = report.filter(function (r) { return !r.error && r.measured === 0; }).length;

    report.forEach(function (r) {
        if (r.error) {
            console.log(r.scene + ' [' + r.theme + '] ERROR: ' + r.error);
            totalFails++;
            return;
        }
        const setupFail = r.setupErrors && r.setupErrors.length;
        if (setupFail) totalSetupErrors += r.setupErrors.length;

        const sampledFail = r.sampled.filter(function (x) { return x.ratio < x.need; });
        totalFails += r.fails.length + sampledFail.length + (setupFail ? 1 : 0);
        totalSuspect += r.opacitySuspect.length;
        totalSampled += r.sampled.length;

        console.log('');
        console.log('=== ' + r.scene + ' [' + r.theme + '] ' + r.width + 'px ===');
        console.log('  measured ' + r.measured + '   failing ' + r.fails.length +
            '   opacity-suspect ' + r.opacitySuspect.length +
            '   pixel-sampled ' + r.sampled.length +
            (r.pixelError ? '   PIXEL ERROR: ' + r.pixelError : ''));
        if (r.measured === 0) console.log('  SETUP ERROR: measured nothing at all');
        if (r.noTheme) {
            console.log('  note: light only — this page ships script-src \'none\', so it has no dark mode');
        }
        (r.setupErrors || []).forEach(function (e) {
            console.log('  SETUP ERROR: ' + e);
        });

        r.fails.forEach(function (f) {
            console.log('  FAIL  ' + f.ratio + ':1 (needs ' + f.need + ')  ' +
                f.size + 'px/' + f.weight + '  ' + f.sel);
            console.log('        rgb(' + f.fg.join(',') + ') on the composited background  "' + f.text + '"');
        });
        r.opacitySuspect.forEach(function (f) {
            console.log('  OPACITY  ' + f.ratio + ':1 (needs ' + f.need + ')  ' +
                f.size + 'px/' + f.weight + '  ' + f.sel + '   passes when animated in');
        });
        sampledFail.forEach(function (f) {
            console.log('  PIXEL  ' + f.ratio + ':1 (needs ' + f.need + ')  ' +
                f.size + 'px/' + f.weight + '  ' + f.sel);
            console.log('        sampled real pixel rgb(' + f.bg.join(',') + ') behind  "' + f.text + '"');
        });
        if (r.disabled.length) {
            console.log('  excluded (disabled control, WCAG-exempt): ' +
                [...new Set(r.disabled.map(function (x) { return x.sel; }))].slice(0, 5).join(', '));
        }
        if (r.emoji.length) {
            /* shown, not excluded silently: these are counted and named */
            console.log('  colour-font glyphs (CSS colour does not apply): ' +
                [...new Set(r.emoji.map(function (x) { return x.sel; }))].slice(0, 5).join(', '));
        }
    });

    if (AS_JSON) {
        fs.writeFileSync(path.join(TEMP, 'wcag-report.json'), JSON.stringify(report, null, 2));
        console.log('\njson: ' + path.join(TEMP, 'wcag-report.json'));
    }

    console.log('');
    console.log('total failures: ' + totalFails +
        '   opacity suspects: ' + totalSuspect +
        '   pixel-sampled: ' + totalSampled);
    if (totalSetupErrors) {
        console.log('SETUP ERRORS: ' + totalSetupErrors +
            ' — scenes that did not measure what they claim');
    }
    console.log('scenes: ' + allScenes + '   measuring nothing: ' + emptyScenes);

    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); }
    catch (e) { /* a locked temp dir is not worth failing the run over */ }

    process.exit(totalFails ? 1 : 0);
}

main().catch(function (e) {
    console.error('probe failed: ' + e.message);
    process.exit(2);
});
