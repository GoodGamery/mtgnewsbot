'use strict';

const buildGrammar = require(`./src/build-grammar.js`);
const fs = require(`fs`);

const inDir = `./src/grammar/`;
const outDir = `./out/`;
const outFileName = `grammar.json`;

// do some stuff

const logErrors = (err) => { if (err) console.error(err); };
const ignoreErrors = () => {};

const grammar = buildGrammar(inDir);

fs.mkdir(outDir, () => {
    fs.unlink(`${outDir}/${outFileName}`, ignoreErrors);
    fs.writeFile(`${outDir}/${outFileName}`, JSON.stringify(grammar), logErrors);
});
