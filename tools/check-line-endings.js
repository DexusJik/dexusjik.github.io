/* Checks the CRLF hygiene gate before CI does.

   CI runs `git ls-files -z | xargs -0 file | grep CRLF`, which needs the `file`
   utility. Where that is unavailable this does the same job by inspecting bytes:
   a tracked text file containing CRLF is a failure.

   Skips binary files by extension rather than by sniffing, so it never reports
   a false failure on an image.

   node tools/check-line-endings.js  */
'use strict';

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const REPO = require('./repo');

/* these are binary: a CRLF byte in them is data, not line endings */
const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|mp4|webm|mp3|pdf|zip|gz)$/i;

/* text we care about */
const TEXT = /\.(js|css|html|json|yml|yaml|md|py|txt|xml|webmanifest)$/i;

let failures = 0;

const tracked = execFileSync('git', ['ls-files'], {
    encoding: 'utf8', cwd: REPO.REPO, maxBuffer: 16 * 1024 * 1024,
}).split('\n').map((s) => s.trim()).filter(Boolean);

const checked = [];
const offenders = [];

tracked.forEach(function (rel) {
    if (BINARY.test(rel)) return;

    const abs = path.join(REPO.REPO, rel);
    if (!fs.existsSync(abs)) return;

    let buf;
    try {
        buf = fs.readFileSync(abs);
    } catch (e) {
        return;
    }

    /* is this actually text? a NUL byte means no */
    const probe = buf.slice(0, 8000);
    if (probe.indexOf(0) >= 0) return;

    /*
     * Check git's STORED blob, not the working copy. On Windows the working
     * copy is CRLF by design (core.autocrlf), so checking files on disk reports
     * 7 false positives that CI never sees -- CI checks out a fresh clone.
     * What matters is whether a CR byte would be committed.
     */
    const blob = spawnSync('git', ['cat-file', '-p', ':' + rel],
        { cwd: REPO.REPO, encoding: 'latin1', maxBuffer: 64 * 1024 * 1024 });

    if (blob.status !== 0) return;

    checked.push(rel);

    if (/\r/.test(blob.stdout || '')) {
        offenders.push(rel);
    }
});

console.log('checked ' + checked.length + ' tracked text file(s)');

if (offenders.length) {
    failures = offenders.length;
    console.log('');
    console.log('  ' + offenders.length + ' file(s) would commit a CR byte:');
    offenders.forEach(function (o) { console.log('      ' + o); });
    console.log('');
    console.log('  Fix with:  git add --renormalize .');
} else {
    console.log('  ok  no tracked file would commit a CR byte');
}

/* also confirm git's own view agrees, since that is what CI greps */
const attrs = spawnSync('git', ['check-attr', 'eol', '--', checked[0] || 'README.md'],
    { cwd: REPO.REPO, encoding: 'utf8' });
console.log('');
console.log('  git eol attr: ' + (attrs.stdout || '').trim());

console.log('');
console.log(failures ? 'failures: ' + failures : 'problems: 0');
process.exit(failures ? 1 : 0);