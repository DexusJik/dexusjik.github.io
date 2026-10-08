/* Path helper for the tools.
   Every tool resolves paths from here instead of hardcoding an absolute path,
   so `npm test` works from any checkout and in CI. */
const path = require('path');
const fs = require('fs');

/* repo root = the parent of tools/ */
const REPO = path.resolve(__dirname, '..');
const APP = path.join(REPO, 'english-daily');

module.exports = {
    REPO,
    APP,

    /* repo-relative path -> absolute */
    p: function () { return path.join.apply(path, [REPO].concat([].slice.call(arguments))); },

    /* app-relative path -> absolute */
    ap: function () { return path.join.apply(path, [APP].concat([].slice.call(arguments))); },

    read: function (file) { return fs.readFileSync(file, 'utf8'); },

    exists: function (file) { return fs.existsSync(file); },
};