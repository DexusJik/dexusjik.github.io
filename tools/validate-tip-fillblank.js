'use strict';
const REPO = require('./repo');
/*
 * The global validator proves no tip example equals any corpus sentence.
 * This covers the remaining sub-case: fillBlank's answer is a SINGLE word, so
 * it can leak even when the sentence does not match. Checks the blank word
 * against the tip example for every lesson fillBlank would convert.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const APP = REPO.APP + '/';
global.window = {};
eval(fs.readFileSync(APP + 'sentences.js', 'utf8'));
const L = window.DAILY_LESSONS;

const sandbox = { module: { exports: {} }, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(APP + 'features/tips.js', 'utf8'), sandbox);
const TIPS = sandbox.module.exports;

/* fillBlank's eligibility logic, mirrored from features/fillblank.js */
const core = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/gi, '');
const splitToken = (t) => {
    const m = /^([^A-Za-z0-9]*)(\w+)([^A-Za-z0-9]*)$/.exec(t);
    return m ? { core: m[2], lead: m[1], trail: m[3] } : { core: t, lead: '', trail: '' };
};
const tokenize = (t) => String(t).trim().split(/\s+/);
function eligible(sentence) {
    const enT = tokenize(sentence.en);
    if (enT.length < 2) return null;
    const enP = enT.map(splitToken);
    const byPos = new Map();
    (sentence.we || []).forEach((v) => {
        const vt = tokenize(v);
        if (vt.length !== enT.length) return;
        for (let i = 0; i < enT.length; i++) {
            if (core(splitToken(vt[i]).core) !== core(enP[i].core)) {
                if (!byPos.has(i)) byPos.set(i, []);
                const w = splitToken(vt[i]).core;
                if (!byPos.get(i).some((x) => core(x) === core(w))) byPos.get(i).push(w);
            }
        }
    });
    let best = null;
    byPos.forEach((words, pos) => { if (!best || words.length > best.words.length) best = { pos, words }; });
    if (!best || best.words.length < 2) return null;
    return { pos: best.pos, correct: splitToken(enT[best.pos]).core, distractors: best.words };
}

/* preference order and eligibility must match features/fillblank.js exactly */
const PREFERENCE = [1, 4, 0, 3, 2];
/* skip sentences the queue transform will never convert, per fillblank.js */
function skippable(i) { return i === 3 || i === 2; }
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

let checked = 0;
let leaks = 0;
const rows = [];

L.forEach((lesson, li) => {
    const tip = TIPS[li];
    if (!tip || !tip.example) return;
    const tipText = norm(tip.example.en + ' ' + tip.example.es);

    // which sentence would fillBlank convert, per its own preference order?
    let target = null;
    for (const si of PREFERENCE) {
        if (skippable(si)) continue;
        const b = eligible(lesson.sentences[si]);
        if (b) { target = { si, b }; break; }
    }
    if (!target) return;
    checked++;

    const word = norm(target.b.correct);
    const words = tipText.split(/[^a-z0-9']+/).filter(Boolean);
    if (words.includes(word)) {
        leaks++;
        rows.push(`  LEAK L${li + 1} fillBlank answer "${target.b.correct}" (sentence ${target.si + 1}) appears in the tip example "${tip.example.en}"`);
    }
});

console.log('lessons where fillBlank converts: ' + checked);
console.log('fillBlank answer leaked in the tip example: ' + leaks);
rows.forEach((r) => console.log(r));
console.log(leaks === 0 ? 'RESULT: no fillBlank answer is visible on its tip card' : 'RESULT: ' + leaks + ' leak(s)');
