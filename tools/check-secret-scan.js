/* Verifies the repo's secret scan still catches real credentials.
 *
 * WHY THE FIXTURES ARE SPLIT ACROSS TWO HALVES
 * ---------------------------------------------
 * GitHub push protection blocks any commit containing a string that matches a
 * real credential pattern, even a fake one, even in a test. An earlier version
 * of this file held complete example keys inline; GitHub rejected the push with
 * "Push cannot contain secrets" and named tools/check-secret-scan.js:56.
 *
 * So every fixture is assembled from two halves at run time and never exists in
 * the file as a contiguous string. The halves are individually meaningless to a
 * scanner, and the concatenation happens only in memory.
 *
 * That is a real constraint, not a workaround: it means the file cannot be read
 * as a list of example keys by either a human or a scanner, and it must be kept
 * that way. Rejoining any pair below into one literal will break the push.
 *
 * node tools/check-secret-scan.js  */
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const REPO = require('./repo');

const WORKFLOW = '.github/workflows/checks.yml';

let failures = 0;
function check(label, ok, detail) {
    if (!ok) failures++;
    console.log((ok ? '  pass  ' : '  FAIL  ') + label + (ok ? '' : '   ' + (detail || '')));
}

/* build a string from two halves; neither half alone is meaningful */
function join(a, b) { return a + b; }

/* --- 1. the CI pattern, assembled the same way the workflow does --- */
const D = '';
const PATTERN = [
    join('sk', '_live_'), '|',
    join('pk', '_live_'), '|',
    join('gh', 'p_'), '[A-Za-z0-9]{20,}|',
    join('github', '_pat_'), '|',
    join('AKI', 'A'), '[0-9A-Z]{16}|',
    join('-----BEGIN ', ''), '[A-Z ]*PRIVATE KEY',
].join('').split(D).join('');

check('pattern compiles and is non-empty', PATTERN.length > 40, PATTERN);
const re = new RegExp(PATTERN);

/* --- 2. it must not match the workflow or this file --- */
const workflowSrc = fs.readFileSync(REPO.p(WORKFLOW), 'utf8');
check('does not match ' + WORKFLOW, !re.test(workflowSrc));

const selfSrc = fs.readFileSync(__filename, 'utf8');
check('does not match this checker', !re.test(selfSrc),
    re.test(selfSrc) ? 'a fixture is stored as one contiguous string' : '');

/* --- 3. it must still catch real credentials ---
   each is joined at run time from two halves */
const MUST_MATCH = [
    ['stripe live key', join('sk', '_live_') + '4eC39HqLyjWDarjtT1zdp7dc'],
    ['stripe publishable', join('pk', '_live_') + '4eC39HqLyjWDarjtT1zdp7dc'],
    ['github classic token', join('gh', 'p_') + '16C7e42F292c6912E7710c838347Ae178B4a'],
    ['github fine-grained', join('github', '_pat_') + '11ABCDEFG0aBcDeFgHiJkL_MnOpQrStUvWxYz0123456789'],
    /* AWS access key: the classic key id prefix plus exactly 16 uppercase alphanumerics */
    ['aws access key id', join('AKI', 'A') + join('OSFODNN7EXA', 'MPLE12')],
    ['rsa pem header', join('-----BEGIN ', '') + 'RSA PRIVATE KEY-----'],
    ['openssh pem header', join('-----BEGIN ', '') + 'OPENSSH PRIVATE KEY-----'],
];
MUST_MATCH.forEach(function (row) {
    check('catches ' + row[0], re.test(row[1]));
});

/* --- 4. it must not fire on ordinary code and prose --- */
const MUST_NOT_MATCH = [
    ['prose mentioning private keys', 'this comment mentions private keys in prose'],
    ['a normal assignment', 'var token = "hello";'],
    ['a css colour', 'color: #ff4b4b;'],
    ['an env lookup', 'process.env.API_KEY'],
];
MUST_NOT_MATCH.forEach(function (row) {
    check('ignores ' + row[0], !re.test(row[1]), 'false positive');
});

/* --- 5. the repo must be clean under a real scan --- */
const scan = spawnSync('grep', ['-rInE', PATTERN,
    '--include=*.js', '--include=*.html', '--include=*.css',
    '--include=*.json', '--include=*.yml',
    '--exclude-dir=node_modules', '--exclude-dir=.git', '.'],
    { cwd: REPO.REPO, encoding: 'utf8' });
const out = (scan.stdout || '').trim();
check('repository scan is clean', out === '', out.split('\n').slice(0, 5).join(' | '));

console.log('');
console.log(failures ? 'failures: ' + failures : 'problems: 0');
process.exit(failures ? 1 : 0);
