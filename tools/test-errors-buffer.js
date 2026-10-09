/* Tests errors.js: capture, cap, age-out, and hostile input.
   Run: node tools/test-errors-buffer.js  */
'use strict';

const fs = require('fs');
const vm = require('vm');

const REPO = require('./repo');
const path = require('path');
const ROOT = REPO.p('english-daily') + path.sep;
const src = fs.readFileSync(ROOT + 'errors.js', 'utf8');

let failures = 0;
function check(label, actual, expected) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    if (!ok) failures++;
    console.log((ok ? '  PASS  ' : '  FAIL  ') + label +
        (ok ? '' : '   got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(expected)));
}

/* load errors.js with a stub window whose storage we control */
function load(initialStore) {
    const store = Object.assign({}, initialStore || {});
    const listeners = {};

    const localStorageStub = {
        getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
        setItem(k, v) { store[k] = String(v); },
    };

    const win = {
        localStorage: localStorageStub,
        location: { pathname: '/english-daily/' },
        addEventListener(name, fn, capture) {
            (listeners[name] = listeners[name] || []).push(fn);
            if (capture === true) win.captureUsed = true;
        },
        alert() {},
        captureUsed: false,
    };

    const sandbox = { window: win, console: console };
    vm.createContext(sandbox);
    vm.runInContext(src, sandbox, { filename: 'errors.js' });

    return {
        api: win.DailyErrors,
        store: store,
        fire(name, event) { (listeners[name] || []).forEach((fn) => fn(event)); },
        listeners: listeners,
        captureUsed: win.captureUsed,
    };
}

console.log('errors.js: buffer\n');

/* --- 1. it registers both listeners --- */
{
    const e = load();
    check('registers window error', (e.listeners.error || []).length, 1);
    check('registers unhandledrejection', (e.listeners.unhandledrejection || []).length, 1);
    /* third argument is the capture flag; assert it was passed as true */
    check('uses capture phase for error', e.captureUsed, true);
    check('exposes the API', typeof e.api.record, 'function');
}

console.log('\nerrors.js: records a thrown error');
{
    const e = load();
    e.fire('error', {
        error: new Error('boom in the lesson'),
        filename: 'https://x/english-daily/game.js',
        lineno: 4211,
        colno: 9,
        message: 'boom in the lesson',
    });
    const list = e.api.read();
    check('one entry recorded', list.length, 1);
    check('message captured', list[0].msg, 'boom in the lesson');
    check('file reduced to its name', list[0].src, 'game.js');
    check('line captured', list[0].line, 4211);
    check('kind is error', list[0].kind, 'error');
    check('persisted to storage', typeof e.store['igsg_errors_v1'], 'string');
}

console.log('\nerrors.js: records an unhandled rejection');
{
    const e = load();
    e.fire('unhandledrejection', { reason: new Error('save failed') });
    const list = e.api.read();
    check('one entry recorded', list.length, 1);
    check('kind is rejection', list[0].kind, 'rejection');
    check('reason captured', list[0].msg, 'save failed');
}

console.log('\nerrors.js: the cap holds at 20');
{
    const e = load();
    for (let i = 0; i < 60; i++) {
        e.api.record({ t: Date.now(), kind: 'error', msg: 'error ' + i });
    }
    const list = e.api.read();
    check('buffer capped at 20', list.length, 20);
    check('the newest is kept', list[list.length - 1].msg, 'error 59');
    check('the oldest was dropped', list[0].msg, 'error 40');
}

console.log('\nerrors.js: stale entries age out on read as well as on write');
{
    const day = 24 * 60 * 60 * 1000;
    const old = Date.now() - 30 * day;
    const e = load({
        igsg_errors_v1: JSON.stringify([
            { t: old, kind: 'error', msg: 'ancient' },
            { t: old - day, kind: 'error', msg: 'older' },
            { t: Date.now(), kind: 'error', msg: 'recent' },
        ]),
    });
    /* reading alone filters, so a learner who never hits a new error does not
       see month-old noise in the panel */
    check('read drops stale entries', e.api.read().length, 1);
    check('the recent one survives', e.api.read()[0].msg, 'recent');

    /* and writing must not persist them back */
    const after = JSON.parse(e.store['igsg_errors_v1']);
    e.api.record({ t: Date.now(), kind: 'error', msg: 'new' });
    const stored = JSON.parse(e.store['igsg_errors_v1']);
    check('write drops stale entries too', stored.length, 2);
    check('and keeps only fresh ones',
        stored.every((x) => x.msg !== 'ancient' && x.msg !== 'older'), true);
    check('the new entry was kept', stored[stored.length - 1].msg, 'new');
}

console.log('\nerrors.js: hostile and corrupt storage');
{
    const cases = [
        ['not json', '{{{'],
        ['an array', '[1,2,3]'],
        ['a string', 'corrupt'],
        ['null', 'null'],
        ['entries missing fields', '[{"kind":"error"},null,7]'],
        ['empty string', ''],
    ];
    cases.forEach(([name, value]) => {
        const e = load({ igsg_errors_v1: value });
        let list;
        try {
            list = e.api.read();
        } catch (err) {
            check(name + ' does not throw on read', 'threw', '[]');
            return;
        }
        check(name + ' reads as an array', Array.isArray(list), true);

        let ok = true;
        try {
            e.api.record({ t: Date.now(), kind: 'error', msg: 'after ' + name });
        } catch (err) {
            ok = false;
        }
        check(name + ' still accepts a new entry', ok, true);
        check(name + ' and the new entry is readable',
            e.api.read().some((x) => x && x.msg === 'after ' + name), true);
    });
}

console.log('\nerrors.js: storage being unavailable must not break anything');
{
    const store = {};
    const win = {
        localStorage: {
            getItem() { throw new Error('SecurityError'); },
            setItem() { throw new Error('QuotaExceededError'); },
        },
        location: { pathname: '/english-daily/' },
        addEventListener(name, fn) { (win['_l'] = win['_l'] || {})[name] = fn; },
        alert() {},
    };
    const sandbox = { window: win, console: console };
    vm.createContext(sandbox);
    let threw = false;
    try {
        vm.runInContext(src, sandbox, { filename: 'errors.js' });
        win.DailyErrors.record({ t: Date.now(), kind: 'error', msg: 'x' });
        win._l.error({ error: new Error('y'), message: 'y' });
        win.DailyErrors.read();
        win.DailyErrors.panel();
        win.DailyErrors.clear();
    } catch (e) {
        threw = e.message;
    }
    check('nothing throws when storage is blocked', threw, false);
    check('read returns an array anyway', Array.isArray(win.DailyErrors.read()), true);
}

console.log('\nerrors.js: it never touches learner progress');
{
    const e = load({ igsg_daily_v1: JSON.stringify({ xp: 980 }) });
    const before = e.store['igsg_daily_v1'];
    e.fire('error', { error: new Error('x'), message: 'x' });
    e.api.record({ t: Date.now(), kind: 'error', msg: 'y' });
    check('igsg_daily_v1 is untouched', e.store['igsg_daily_v1'], before);
    check('and uses its own key', typeof e.store['igsg_errors_v1'], 'string');
}

console.log('\nerrors.js: odd error values are described without throwing');
{
    const e = load();
    const odd = [undefined, null, 0, false, '', 'a string reason', { noMessage: true }];
    odd.forEach((value) => {
        let ok = true;
        try {
            e.fire('error', { error: value, message: 'fallback' });
        } catch (err) {
            ok = false;
        }
        check('survives ' + JSON.stringify(value === undefined ? 'undefined' : value), ok, true);
    });
    check('all were recorded', e.api.read().length, odd.length);
}

console.log('');
console.log(failures ? 'failures: ' + failures : 'failures: 0');
process.exit(failures ? 1 : 0);