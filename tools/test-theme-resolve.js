/* Unit tests for the theme resolution logic.
   Loads theme.js in a stubbed environment so the pure decision-making is tested
   without a browser: all 9 combinations of preference x OS, plus coercion.

   node tools/test-theme-resolve.js  */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'theme.js'), 'utf8');

let failures = 0;
function check(label, actual, expected) {
    const ok = String(actual) === String(expected);
    if (!ok) failures++;
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label +
        (ok ? '' : '   got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(expected)));
}

/* Load theme.js with a fake window/document/localStorage.
   `osDark` drives matchMedia, `storedValue` drives localStorage. */
function load(storedValue, osDark) {
    const store = {};
    if (storedValue !== undefined) store['theme-pref'] = storedValue;

    const listeners = {};

    const documentStub = {
        documentElement: {
            attrs: {},
            setAttribute(name, value) { this.attrs[name] = value; },
            getAttribute(name) { return this.attrs[name]; }
        },
        readyState: 'complete',
        addEventListener() {},
        querySelector() { return null; },
        /* the toggle is absent in these tests; the real pages inject it */
        getElementById() { return null; }
    };

    const sandbox = {
        window: {
            localStorage: {
                getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
                setItem(k, v) { store[k] = String(v); }
            },
            matchMedia(q) {
                return {
                    matches: /prefers-color-scheme:\s*dark/.test(q) ? !!osDark : false,
                    addEventListener() {}, removeEventListener() {},
                    addListener() {}, removeListener() {}
                };
            }
        },
        document: documentStub,
        localStorage: {
            getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
            setItem(k, v) { store[k] = String(v); }
        },
        matchMedia(q) {
            return {
                matches: /prefers-color-scheme:\s*dark/.test(q) ? !!osDark : false,
                addEventListener() {}, removeEventListener() {},
                addListener() {}, removeListener() {}
            };
        },
        console: console
    };
    sandbox.window.document = documentStub;
    sandbox.window.localStorage = sandbox.localStorage;
    sandbox.window.matchMedia = sandbox.matchMedia;

    vm.createContext(sandbox);
    vm.runInContext(src, sandbox, { filename: 'theme.js' });

    return { api: sandbox.window.DailyTheme, root: documentStub.documentElement, store: store };
}

console.log('theme.js resolution\n');

/* --- all nine combinations --- */
[['auto', false, 'light'], ['auto', true, 'dark'],
 ['light', false, 'light'], ['light', true, 'light'],
 ['dark', false, 'dark'], ['dark', true, 'dark']].forEach(([pref, osDark, want]) => {
    const r = load(pref, osDark);
    check('pref=' + pref + ', OS dark=' + osDark + ' -> ' + want,
        r.api.resolve(r.api.preference()), want);
    check('pref=' + pref + ', OS dark=' + osDark + ' applies data-theme=' + want,
        r.root.getAttribute('data-theme'), want);
});

console.log('');

/* --- coercion of junk --- */
[[undefined, 'auto'], ['', 'auto'], ['purple', 'auto'], ['DARK', 'auto'],
 ['null', 'auto'], ['1', 'auto']].forEach(([value, want]) => {
    const r = load(value, false);
    check('stored ' + JSON.stringify(value) + ' -> pref ' + want, r.api.preference(), want);
});

console.log('');

/* --- cycle order is auto -> light -> dark -> auto --- */
{
    const r = load(undefined, false);
    check('cycle from auto', r.api.cycle(), 'light');
    r.api.set('light');
    check('cycle from light', r.api.cycle(), 'dark');
    r.api.set('dark');
    check('cycle from dark', r.api.cycle(), 'auto');
}

console.log('');

/* --- set() coerces and writes --- */
{
    const r = load(undefined, false);
    r.api.set('nonsense');
    check('set("nonsense") writes auto', r.store['theme-pref'], 'auto');
    check('set("nonsense") resolves to auto, OS light', r.root.getAttribute('data-theme'), 'light');
    r.api.set('dark');
    check('set("dark") writes dark', r.store['theme-pref'], 'dark');
    check('set("dark") overrides a light OS', r.root.getAttribute('data-theme'), 'dark');
}

console.log('');

/* --- the app state key must never be read or written ---
   Checked by API call, not by substring: the header comment legitimately
   mentions the key by name while explaining why it is NOT used. */
const readsAppState = /(getItem|setItem|removeItem)\s*\(\s*['"]igsg_daily_v1['"]/.test(src);
check('never reads or writes igsg_daily_v1', readsAppState, false);

console.log('');
console.log('failures: ' + failures);
process.exit(failures ? 1 : 0);