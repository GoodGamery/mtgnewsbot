'use strict';

const deepMerge = require(`../../../util/deep-merge.js`);

let modifiers = {};

modifiers = deepMerge(modifiers, require('./basic-modifiers'));
modifiers = deepMerge(modifiers, require('./cardfinder-modifiers'));

module.exports = modifiers;