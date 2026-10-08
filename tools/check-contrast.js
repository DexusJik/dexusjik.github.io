/* Measures WCAG contrast for the token pairs that carry text.
 *
 * Reads the light and dark blocks straight out of the CSS so it cannot drift
 * from the stylesheet. Dark mode routinely exposes contrast failures that light
 * mode hides, which is why this is a gate and not a report.
 *
 * Thresholds: 4.5:1 body text, 3:1 for large text (>=24px, or >=18.66px bold).
 *
 * node tools/check-contrast.js  */
'use strict';

const fs = require('fs');
const REPO = require('./repo');

let failures = 0;
let checks = 0;

function hex(value) {
    if (typeof value !== 'string') return null;
    const v = value.trim();
    if (/^#/.test(v)) {
        let h = v.slice(1);
        if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
        return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; });
    }
    const m = v.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (m) return [1, 2, 3].map(function (i) { return parseFloat(m[i]) / 255; });
    return null;
}

function luminance(rgb) {
    const c = rgb.map(function (v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(fg, bg) {
    const a = hex(fg);
    const b = hex(bg);
    if (a === null || b === null) return null;
    const la = luminance(a);
    const lb = luminance(b);
    const hi = Math.max(la, lb);
    const lo = Math.min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
}

/* collect tokens, then resolve chains like --bg: var(--sand-100).
   A token may point at another token, so resolve repeatedly with a depth cap
   rather than giving up on the first indirection. */
/*
 * Tokens can point at other tokens (`--bg: var(--sand-100)`), and a dark block
 * can redefine what a light block pointed at. So resolution is a two-phase
 * lookup: parse the dark block, parse the light block, then chase references
 * through dark-first and fall back to light.
 */
function tokensIn(block) {
    const map = {};
    /* `[^;{}]` rather than `\S`: a value may contain spaces, as in
       `rgba(251, 249, 244, 0.82)` */
    const re = /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi;
    let m;
    while ((m = re.exec(block)) !== null) map[m[1]] = m[2].trim();
    return map;
}

function resolveToken(name, dark, light) {
    let value = dark[name] !== undefined ? dark[name] : light[name];
    let hops = 0;
    const seen = new Set([name]);

    while (typeof value === 'string' && hops < 8) {
        const ref = value.match(/^var\(\s*(--[a-z0-9-]+)/i);
        if (!ref) break;

        const next = ref[1];
        if (seen.has(next)) break;          /* cycle guard */
        seen.add(next);

        if (dark[next] !== undefined) value = dark[next];
        else if (light[next] !== undefined) value = light[next];
        else break;

        hops++;
    }
    return value;
}

/* light and dark are the parsed token MAPS for one stylesheet */
function check(label, fgTok, bgTok, light, dark, min) {
    checks++;
    [['light', light, min], ['dark', dark, min]].forEach(function (t) {
        const mode = t[0], threshold = t[2];
        const fg = resolveToken(fgTok, mode === 'dark' ? dark : {}, light);
        const bg = resolveToken(bgTok, mode === 'dark' ? dark : {}, light);
        if (!fg || !bg) {
            failures++;
            console.log('  FAIL  ' + label + ' [' + mode + ']  missing ' +
                (fg ? bgTok : fgTok));
            return;
        }
        const r = ratio(fg, bg);
        if (r === null) { failures++; console.log('  FAIL  ' + label + ' [' + mode + ']  unparseable colour'); return; }
        const ok = r >= threshold;
        if (!ok) failures++;
        console.log((ok ? '  pass  ' : '  FAIL  ') +
            label.padEnd(34) + mode.padEnd(6) +
            r.toFixed(2).padStart(6) + ':1  (needs ' + threshold + ')' +
            '   ' + fgTok + ' on ' + bgTok);
    });
}

/* ---- english app ---- */
const app = fs.readFileSync(REPO.p('english-daily/daily.css'), 'utf8');
const appLight = tokensIn((app.match(/:root\s*\{([\s\S]*?)\n\}/) || [])[1] || '');
const appDark = tokensIn((app.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/) || [])[1] || '');

console.log('english app\n');
check('body text', '--text', '--bg', appLight, appDark, 4.5);
check('card text', '--text', '--card', appLight, appDark, 4.5);
check('muted text on card', '--muted', '--card', appLight, appDark, 4.5);
check('muted text on page', '--muted', '--bg', appLight, appDark, 4.5);
check('heading on card', '--heading', '--card', appLight, appDark, 4.5);
check('heading on page', '--heading', '--bg', appLight, appDark, 4.5);
check('correct text on correct bg', '--correct-text', '--correct-bg', appLight, appDark, 4.5);
check('wrong text on wrong bg', '--wrong-text', '--wrong-bg', appLight, appDark, 4.5);
check('amber text on amber tint', '--amber-text', '--amber-tint', appLight, appDark, 4.5);
check('focus ring on card', '--focus-ring', '--card', appLight, appDark, 3);
check('focus ring on page', '--focus-ring', '--bg', appLight, appDark, 3);
check('locked text on locked bg', '--muted', '--locked-bg', appLight, appDark, 4.5);
check('CTA text on CTA green', '--on-cta', '--green-cta', appLight, appDark, 4.5);
check('CTA text on hover', '--on-cta', '--green-cta-hover', appLight, appDark, 4.5);
/* the goal button and completed nodes are dark bronze on gold */
check('gold-surface label', '--on-gold', '--gold', appLight, appDark, 4.5);
check('gold-surface label on hover', '--on-gold-hover', '--gold-hover', appLight, appDark, 4.5);
check('placement tag text', '--amber-text', '--amber-tint-3', appLight, appDark, 4.5);
/* --navy is a surface in dark mode; text sitting on it must stay legible */
check('text on navy surface', '--on-cta', '--navy', appLight, appDark, 4.5);

/* ---- main site ---- */
const main = fs.readFileSync(REPO.p('style.css'), 'utf8');
const mainLight = tokensIn((main.match(/:root\s*\{([\s\S]*?)\n\}/) || [])[1] || '');

const mainDark = tokensIn((main.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/) || [])[1] || '');

console.log('\nmain site\n');

check('body text', '--ink', '--bg', mainLight, mainDark, 4.5);
check('surface text', '--ink', '--surface', mainLight, mainDark, 4.5);
check('muted text on surface', '--ink-mute', '--surface', mainLight, mainDark, 4.5);
check('muted text on page', '--ink-mute', '--bg', mainLight, mainDark, 4.5);
check('gold text on page', '--gold-ink', '--bg', mainLight, mainDark, 4.5);
check('line on surface (3:1 UI)', '--line-strong', '--surface', mainLight, mainDark, 3);

console.log('');
console.log(checks + ' pair(s) checked');
console.log(failures ? 'failures: ' + failures : 'problems: 0');
process.exit(failures ? 1 : 0);