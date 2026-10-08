/* Every local asset a page references must exist on disk.

   This is the check that catches "the favicon points at a file that was
   renamed" and "an icon derivative was never generated". It was originally a
   shell pipeline in CI, which cannot be run locally and broke on the exit
   status of a subshell; as a validator it runs in `npm test` too.

   node tools/check-asset-refs.js  */
'use strict';

const REPO = require('./repo');
const fs = require('fs');
const path = require('path');

const PAGES = [
    'index.html',
    '404.html',
    'english-daily/index.html',
    'english-daily/sw.js',
    'pangal-esports/index.html',
];

/* these are matched inside markup; CSS url() is handled separately */
const REF = /(?:src|href)\s*=\s*"([^"]+)"/g;
const CSS_URL = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;

const SKIP = /^(https?:|mailto:|tel:|data:|blob:|javascript:|#|\/\/)/i;

/* a page may legitimately reference a sibling it does not ship */
const notInRepo = [];

let missing = 0;
let checked = 0;

function report(file, ref, kind) {
    missing++;
    console.log('  MISSING  ' + file + ' -> ' + ref + '   (' + kind + ')');
}

function check(file, ref, kind) {
    if (!ref || SKIP.test(ref)) return;
    /* drop any query string or hash before touching the filesystem */
    const clean = ref.split('?')[0].split('#')[0];
    if (!clean) return;
    /* url(#gradient) and its percent-encoded form %23gradient are SVG fragment
       references, not files */
    if (/^%23/i.test(clean)) return;

    let target;
    if (clean.charAt(0) === '/') {
        /* root-absolute, which is how the published site resolves it */
        target = path.join(REPO.REPO, clean);
    } else {
        target = path.resolve(path.dirname(path.join(REPO.REPO, file)), clean);
    }
    checked++;

    if (fs.existsSync(target)) return;

    /* a directory link is fine if it contains an index.html */
    try {
        if (fs.statSync(target).isDirectory() && fs.existsSync(path.join(target, 'index.html'))) {
            return;
        }
    } catch (e) { /* fall through to the report */ }

    report(file, ref, kind);
}

PAGES.forEach(function (page) {
    const abs = REPO.p(page);
    if (!fs.existsSync(abs)) {
        console.log('  MISSING PAGE  ' + page);
        missing++;
        return;
    }
    const src = fs.readFileSync(abs, 'utf8');

    let m;
    REF.lastIndex = 0;
    while ((m = REF.exec(src)) !== null) {
        check(page, m[1], 'markup');
    }

    /* the service worker lists bare paths in its precache array */
    if (/\.js$/.test(page)) {
        const precache = src.match(/PRECACHE\s*=\s*\[([\s\S]*?)\]/);
        if (precache) {
            const entries = precache[1].match(/'([^']+)'/g) || [];
            entries.forEach(function (raw) {
                check(page, raw.replace(/'/g, ''), 'precache');
            });
        }
    }
});

/* CSS url() references */
REPO.p('style.css');
[ 'style.css', 'english-daily/daily.css',
    'english-daily/features/challenge.css', 'english-daily/features/fillblank.css',
    'english-daily/features/phrasebook.css', 'english-daily/features/review.css',
    'english-daily/features/tips.css' ].forEach(function (css) {
    const abs = REPO.p(css);
    if (!fs.existsSync(abs)) return;
    const src = fs.readFileSync(abs, 'utf8');
    let m;
    CSS_URL.lastIndex = 0;
    while ((m = CSS_URL.exec(src)) !== null) {
        check(css, m[1], 'css');
    }
});

console.log('');
console.log('checked ' + checked + ' local reference(s) across ' + PAGES.length + ' page(s)');
console.log(missing ? 'failures: ' + missing : 'problems: 0');
process.exit(missing ? 1 : 0);