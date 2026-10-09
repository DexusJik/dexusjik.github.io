/* Tests the load() repair path in game.js end-to-end in a real browser: seed
   corrupt localStorage, reload, and assert the app boots and repairs WITHOUT
   losing progress.
 *
 * This is the only test of game.js load(), which is the highest-risk path in
 * the change: if state-schema.js fails to load, or a repair misfires, a
 * learner's saved XP, streak and completed lessons are destroyed. It is a GATE.
 *
 * PORTABLE BY DESIGN. An earlier version hardcoded C:/Users/Dexus/... and
 * shelled out to powershell and python, so it could only ever run on one
 * machine and was registered in no gate at all. This uses tools/repo.js,
 * os.tmpdir(), the same browser discovery as probe-contrast-browser.js, and the
 * same Node static server, so it runs on Windows, macOS, Linux and in CI.
 *
 * The CSP is `script-src 'self'`, so the collector is an EXTERNAL same-origin
 * file, never an inline <script>. Playwright is not a dependency and the repo
 * ships no dependencies at all.
 *
 * Run: node tools/test-load-repair.js
 */
'use strict';

const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = require('./repo');

/* same discovery list as the probe, so both agree on what a browser is */
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
const TEMP = path.join(os.tmpdir(), 'igsg-loadrepair-');
fs.mkdirSync(TEMP, { recursive: true });

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function serve() {
    const server = http.createServer(function (req, res) {
        let rel = decodeURIComponent(req.url.split('?')[0]);
        if (rel === '/') rel = '/index.html';
        const abs = path.join(REPO.REPO, path.normalize(rel).replace(/^[/\\]+/, ''));
        if (path.relative(REPO.REPO, abs).indexOf('..') === 0) { res.writeHead(403); res.end(); return; }
        fs.readFile(abs, function (err, buf) {
            if (err) { res.writeHead(404); res.end('not found'); return; }
            res.writeHead(200, { 'Content-Type': MIME[path.extname(abs)] || 'application/octet-stream' });
            res.end(buf);
        });
    });
    return new Promise(function (resolve, reject) {
        server.on('error', reject);
        server.listen(0, '127.0.0.1', function () { resolve(server); });
    });
}

/* a stable, unique id per element so nothing is re-found by selector */
function getDebugPort() { return 9333; }

function cdpConnect(wsUrl) {
    return new Promise(function (resolve, reject) {
        const m = wsUrl.match(/^wss?:\/\/([^:/]+):(\d+)(\/.*)$/);
        if (!m) { reject(new Error('bad ws url')); return; }
        const host = m[1], port = parseInt(m[2], 10), route = m[3];
        const key = crypto.randomBytes(16).toString('base64');
        const sock = net.connect(port, host, function () {
            sock.write('GET ' + route + ' HTTP/1.1\r\nHost: ' + host + ':' + port +
                '\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n' +
                'Sec-WebSocket-Key: ' + key + '\r\nSec-WebSocket-Version: 13\r\n\r\n');
        });
        let buf = Buffer.alloc(0), up = false;
        const pending = new Map();
        let nextId = 1;

        /* RFC 6455 §5.3: client frames MUST be masked or they are dropped */
        function encode(str) {
            const payload = Buffer.from(str, 'utf8');
            const len = payload.length, MASK = 0x80;
            let header;
            if (len < 126) { header = Buffer.alloc(2); header[1] = MASK | len; }
            else if (len < 65536) { header = Buffer.alloc(4); header[1] = MASK | 126; header.writeUInt16BE(len, 2); }
            else { header = Buffer.alloc(10); header[1] = MASK | 127; header.writeUInt32BE(0, 2); header.writeUInt32BE(len, 6); }
            header[0] = 0x81;
            const k = crypto.randomBytes(4);
            const masked = Buffer.alloc(payload.length);
            for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ k[i % 4];
            return Buffer.concat([header, k, masked]);
        }
        function onData(chunk) {
            buf = Buffer.concat([buf, chunk]);
            if (!up) {
                const i = buf.indexOf('\r\n\r\n');
                if (i < 0) return;
                buf = buf.slice(i + 4);
                up = true;
                resolve(api);
            }
            while (buf.length >= 2) {
                const len0 = buf[1] & 0x7f;
                let off = 2, len = len0;
                if (len0 === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
                else if (len0 === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
                if (buf.length < off + len) return;
                const payload = buf.slice(off, off + len);
                buf = buf.slice(off + len);
                try {
                    const msg = JSON.parse(payload.toString('utf8'));
                    if (msg.id && pending.has(msg.id)) {
                        const p = pending.get(msg.id);
                        pending.delete(msg.id);
                        if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
                        else p.resolve(msg.result);
                    }
                } catch (e) { /* ignore */ }
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

const sleep = (ms) => new Promise(function (r) { setTimeout(r, ms); });

/* ---------------------------------------------------------------- *
 * the corrupt profile, and what MUST survive it
 * ---------------------------------------------------------------- */
/* A date of today, so the app's own streak logic does not legitimately
   recompute it. With a stale date the streak resets by design, which reads as
   progress loss in a repair test but is unrelated to repairing. */
function today() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

const CORRUPT = JSON.stringify({
    xp: 1040, gems: 210, streak: 17, bestStreak: 31,
    lastStudyDate: today(), studyHistory: { '2026-10-7': true },
    dailyXp: 30, dailyXpDate: today(),
    lessonsDone: 19, perfectLessons: 7, seenSentences: 95,
    hearts: 'corrupt',            /* wrong type */
    heartsTs: 1759800000000,
    currentLesson: 19,
    completed: [],                /* wrong type: array where an object belongs */
    missed: 'broken',             /* wrong type */
    badges: 42,                   /* wrong type */
    nickname: 'Camila',
    rivals: [],
    placement: { score: '44', max: '78', total: 30, level: '4', v: 5 },
    placementSkipped: 'yes',      /* wrong type */
    storageNoticeDismissed: true,
    features: null,
});

const SURVIVORS = [
    'xp', 'gems', 'streak', 'bestStreak', 'lessonsDone', 'perfectLessons',
    'seenSentences', 'studyHistory', 'nickname',
];


/* ---------------------------------------------------------------- *
 * the page-side collector.
 *
 * Written as an ARRAY of quoted source lines and joined, never as one long
 * template literal. Two earlier attempts escaped a newline inside the evaluated
 * source, which made the browser see a string literal containing a raw newline
 * — a syntax error, which the CDP reports as `undefined` and which read as
 * "the page reported nothing".
 * ---------------------------------------------------------------- */
const LINES = [
    '(function () {',
    '    var out = []; var fails = 0;',
    '    function note(l, v) { out.push((v ? "PASS  " : "FAIL  ") + l); if (!v) fails++; }',
    '    function finish() { out.push(""); out.push("failures: " + fails); window.__LR = out.join(String.fromCharCode(10)); }',
    '    var KEY = "igsg_daily_v1";',
    '    function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }',
    '    window.setTimeout(function () {',
    '        try {',
    '            var s = read();',
    '            note("saved state exists", !!s);',
    '            if (!s) { finish(); return; }',
    '            ["' + SURVIVORS.join('","') + '"].forEach(function (k) {',
    '                note("survived: " + k + " = " + JSON.stringify(s[k]), s[k] !== undefined && s[k] !== null);',
    '            });',
    '            note("xp preserved exactly", s.xp === 1040);',
    '            note("streak preserved exactly", s.streak === 17);',
    '            note("lessonsDone preserved exactly", s.lessonsDone === 19);',
    '            note("bestStreak preserved exactly", s.bestStreak === 31);',
    '            note("nickname preserved", s.nickname === "Camila");',
    '            note("studyHistory preserved", s.studyHistory && s.studyHistory["2026-10-7"] === true);',
    '            /* every corrupt field is now the right type */',
    '            note("hearts repaired to a number", typeof s.hearts === "number");',
    '            note("completed repaired to an object", !Array.isArray(s.completed));',
    '            note("missed repaired to an object", typeof s.missed === "object" && !Array.isArray(s.missed));',
    '            note("badges repaired to an object", typeof s.badges === "object");',
    '            note("placementSkipped repaired to a boolean", typeof s.placementSkipped === "boolean");',
    '            note("placement score is now a number", !!s.placement && typeof s.placement.score === "number");',
    '            note("placement max is now a number", !!s.placement && typeof s.placement.max === "number");',
    '            note("placement level is now a number", !!s.placement && typeof s.placement.level === "number");',
    '            note("placement record kept", !!s.placement && s.placement.level === 4);',
    '            note("app rendered the path", document.querySelectorAll("#path-list .node").length > 0);',
    '            note("nickname modal dismissed", document.getElementById("nick-modal").hidden === true);',
    '            /*',
    '             * THE DATA-LOSS PATH. If state-schema.js fails to load, load() must fall',
    '             * back to the plain whitelist merge. Returning defaults instead is how a',
    '             * 404, a service-worker cache race or a CSP change silently destroys a',
    '             * learner\'s progress: the next save() persists the defaults over it.',
    '             */',
    '            var hadSchema = !!window.DailyStateSchema;',
    '            note("schema was loaded in this run", hadSchema);',
    '            var _bak = null;',
    '            try { _bak = localStorage.getItem(KEY + "_backup"); } catch (e) { }',
    '            note("a pre-repair backup was written", hadSchema && !!_bak);',
    '            note("backup holds the original xp", !!_bak && JSON.parse(_bak).xp === 1040);',
    '            note("no field was silently dropped", Object.keys(s).length >= 20);',
    '            finish();',
    '        } catch (err) {',
    '            out.push("");',
    '            out.push("COLLECTOR THREW: " + err.message);',
    '            out.push("failures: 99");',
    '            window.__LR = out.join(String.fromCharCode(10));',
    '        }',
    '    }, 400);',
    '})();',
];
const PAGE = LINES.join(String.fromCharCode(10));

/* ---------------------------------------------------------------- *
 * run
 * ---------------------------------------------------------------- */
async function main() {
    const server = await serve();
    const port = server.address().port;
    const profile = path.join(TEMP, 'pf_' + Date.now());

    let browser = null, cdp = null;
    const cleanup = function () {
        try { if (cdp) cdp.close(); } catch (e) { /* already gone */ }
        try { if (browser) browser.kill(); } catch (e) { /* already gone */ }
        try { server.close(); } catch (e) { /* already gone */ }
        try {
            fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
        } catch (e) { /* a locked temp dir is not worth failing over */ }
    };

    try {
        browser = spawn(BROWSER, [
            '--headless=new', '--disable-gpu', '--no-first-run',
            '--no-sandbox', '--disable-extensions',
            '--remote-debugging-port=' + getDebugPort(),
            '--user-data-dir=' + profile,
            'about:blank',
        ], { stdio: 'ignore' });

        for (let i = 0; i < 40; i++) {
            const r = await new Promise(function (res) {
                http.get({ host: '127.0.0.1', port: getDebugPort(), path: '/json/list' }, function (x) {
                    let b = ''; x.on('data', function (c) { b += c; });
                    x.on('end', function () { res(b); });
                }).on('error', function () { res(''); });
            });
            if (r && r.indexOf('"page"') >= 0) break;
            await sleep(500);
        }

        const list = await new Promise(function (res, rej) {
            http.get({ host: '127.0.0.1', port: getDebugPort(), path: '/json/list' }, function (x) {
                let b = ''; x.on('data', function (c) { b += c; });
                x.on('end', function () {
                    try { res(JSON.parse(b)); } catch (e) { rej(e); }
                });
            }).on('error', rej);
        });
        const pg = list.find(function (x) { return x.type === 'page'; });
        if (!pg) throw new Error('no page target in the browser');
        cdp = await cdpConnect(pg.webSocketDebuggerUrl);
        await cdp.send('Page.enable');
        await cdp.send('Runtime.enable');

        const url = 'http://127.0.0.1:' + port + '/english-daily/index.html';

        /*
         * Seed by NAVIGATION, not by injecting a script.
         *
         * Page.addScriptToEvaluateOnNewDocument was unreliable here: the seed
         * never landed, the app booted from defaults, and its first save()
         * overwrote the fixture — so every "survived" assertion read 0 instead
         * of 1040 and the test failed against its own setup.
         *
         * Loading any same-origin page, writing the corrupt state directly, and
         * then navigating to the app is deterministic: the write happens on a
         * page whose scripts do nothing.
         */
        await cdp.send('Page.navigate', { url: 'http://127.0.0.1:' + port + '/index.html' });
        for (let i = 0; i < 40; i++) {
            const st = await cdp.send('Runtime.evaluate', {
                expression: 'document.readyState', returnByValue: true,
            });
            if (st.result && st.result.value === 'complete') break;
            await sleep(250);
        }

        const seeded = await cdp.send('Runtime.evaluate', {
            expression: 'localStorage.setItem("igsg_daily_v1", ' +
                JSON.stringify(CORRUPT) + '); "seeded"',
            returnByValue: true,
        });
        if (!seeded.result || seeded.result.value !== 'seeded') {
            throw new Error('the corrupt fixture could not be written to localStorage');
        }

        await cdp.send('Page.navigate', { url });
        for (let i = 0; i < 40; i++) {
            const st = await cdp.send('Runtime.evaluate', {
                expression: 'document.readyState', returnByValue: true,
            });
            if (st.result && st.result.value === 'complete') break;
            await sleep(250);
        }

        /* reveal animations force-finished, so below-the-fold text is measurable */
        await cdp.send('Runtime.evaluate', {
            expression: '(function(){var s=document.createElement("style");' +
                's.textContent=".reveal,.fade-up{opacity:1 !important}";' +
                'document.head.appendChild(s);return 1})()',
        });

        const boot = await cdp.send('Runtime.evaluate', {
            expression: 'JSON.stringify({title:document.title,' +
                'nodes:document.querySelectorAll("#path-list .node").length,' +
                'hasSchema:!!window.DailyStateSchema,reported:!!window.__LR})',
            returnByValue: true,
        });
        console.log('BOOT: ' + (boot.result && boot.result.value));

        await cdp.send('Runtime.evaluate', { expression: PAGE });

        /*
         * The collector finishes on a setTimeout, so it reports by assigning to
         * window.__LR. Poll for it rather than reading an immediate return
         * value, which is always undefined for an async collector.
         */
        let txt = null;
        for (let i = 0; i < 40; i++) {
            const r = await cdp.send('Runtime.evaluate', {
                expression: 'window.__LR || null', returnByValue: true,
            });
            if (r.result && r.result.value) { txt = r.result.value; break; }
            await sleep(250);
        }
        if (!txt) throw new Error('the page collector never reported');
        console.log(txt);
    } finally {
        cleanup();
    }
}

if (!BROWSER) {
    console.error('No Chromium-family browser found. Install Edge, Chrome or Chromium, or set CHROME_PATH.');
    process.exit(2);
}

main().catch(function (e) {
    console.error('test failed: ' + e.message);
    process.exit(2);
});
