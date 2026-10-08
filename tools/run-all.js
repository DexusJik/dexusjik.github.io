/* Runs every validator and reports one summary.
   Exits non-zero if anything fails, so CI fails the build.

   node tools/run-all.js            run everything
   node tools/run-all.js --quiet    only show failures and the summary

   audit-dark-risk is a GATE now that dark mode ships: a light literal used as a
   background, or a --navy used as text colour, is a real defect rather than a
   known-and-accepted finding. */
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const TOOLS = __dirname;

const GATES = [
    ['check-tokens', 'every var() token reference resolves'],
    ['check-contrast', 'WCAG contrast met in both themes'],
    ['test-theme-resolve', 'theme preference resolution is correct'],
    ['validate-sentences', 'sentence corpus is well formed'],
    ['check-options', 'no answer identical to a distractor'],
    ['validate-placement', 'placement items are structurally sound'],
    ['test-placement-bands', 'band cutoffs match the documented points'],
    ['check-cuts-in-sync', 'cuts agree between placement.js and game.js'],
    ['validate-tip-examples', 'tip examples do not leak whole answers'],
    ['validate-tip-fillblank', 'tip words do not collide with blanks'],
    ['validate-placement-count', 'advertised counts match placement.js'],
    ['check-jsonld', 'JSON-LD parses and claims are accurate'],
    ['check-asset-refs', 'every local asset reference resolves'],
    ['check-secret-scan', 'the CI secret scan still catches real credentials'],
    ['check-line-endings', 'no file would commit a CRLF line ending'],
    ['check-light-unchanged', 'light theme still renders as it did before'],
    ['audit-dark-risk', 'no colour that breaks in dark mode'],
    ['test-migration', 'state migrations preserve progress'],
];

/* audit-dark-risk is now a gate, not a report: dark mode ships, so a light
   literal used as a background or a --navy-as-text is a real defect */
const REPORTS = [];

const quiet = process.argv.indexOf('--quiet') >= 0;
const runAll = process.argv.indexOf('--all') >= 0;

const list = runAll ? GATES.concat(REPORTS) : GATES;

let failed = 0;
const rows = [];

list.forEach(function (entry) {
    const name = entry[0];
    const purpose = entry[1];
    let out = '';
    let code = 0;
    try {
        out = execFileSync(process.execPath, [path.join(TOOLS, name + '.js')], {
            encoding: 'utf8',
            maxBuffer: 32 * 1024 * 1024,
        });
    } catch (e) {
        out = (e.stdout || '') + (e.stderr || '');
        code = e.status === undefined ? 1 : e.status;
    }

    /* a validator that prints FAIL is failing even if it exits 0 */
    const printedFail = /\bFAIL\b/.test(out);
    const ok = code === 0 && !printedFail;
    if (!ok) failed++;

    rows.push({ name: name, purpose: purpose, ok: ok, out: out });

    if (!ok) {
        console.log('\n=== ' + name + ' FAILED ===');
        out.split('\n').filter(function (l) {
            return /\bFAIL\b|Error|ENOENT|assert/i.test(l);
        }).slice(0, 25).forEach(function (l) { console.log('  ' + l.trim()); });
    } else if (!quiet) {
        console.log('  pass  ' + name);
    }
});

console.log('');
rows.forEach(function (r) {
    console.log((r.ok ? '  PASS  ' : '  FAIL  ') + r.name.padEnd(26) + ' ' + r.purpose);
});

if (!runAll && REPORTS.length) {
    console.log('');
    console.log('  note: ' + REPORTS.length + ' report-only tool(s) skipped: ' +
        REPORTS.map(function (r) { return r[0]; }).join(', ') +
        '  (use --all to include)');
}

console.log('');
console.log(failed ? failed + ' of ' + list.length + ' FAILED' : 'all ' + list.length + ' checks passed');

process.exit(failed ? 1 : 0);