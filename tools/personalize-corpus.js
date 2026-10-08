/* Mirrors game.js personalize(): fills {name}/{other} in place so validators
 * check exactly what a learner with TEST_NAME sees. Reports any marker left. */
module.exports = function personalizeCorpus(lessons, name) {
    const OTHER_NAMES = ['Janina', 'Camila', 'Diego'];
    const key = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const other = OTHER_NAMES.find((n) => key(n) !== key(name)) || OTHER_NAMES[0];
    const fill = (t) => typeof t === 'string' ? t.split('{name}').join(name).split('{other}').join(other) : t;
    const leftovers = [];
    let marked = 0;
    lessons.forEach((lesson, li) => lesson.sentences.forEach((s, si) => {
        let hit = false;
        ['en', 'es', 'we', 'ws'].forEach((k) => {
            if (JSON.stringify(s[k] || '').indexOf('{') >= 0) hit = true;
            s[k] = Array.isArray(s[k]) ? s[k].map(fill) : fill(s[k]);
            if (JSON.stringify(s[k] || '').match(/\{[a-z]+\}/)) leftovers.push(`L${li + 1} s${si + 1} ${k}`);
        });
        if (hit) marked++;
    }));
    return { name, other, marked, leftovers };
};
