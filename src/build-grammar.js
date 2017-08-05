// Combines grammar files together using a deep merge
'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const deepMerge = require(`./lib/util/deep-merge.js`);


// This is synchronous
function buildGrammar(directory) {

  const files = fs.readdirSync(directory);
  console.info(`Loading ${files.length} files:\n${files.join(', ')}`);

  const rightFileType = s => s.endsWith(`.json`) || s.endsWith(`.yaml`);

  let destObj = {};

  files
    .filter(rightFileType)
    .map(fileName => `${directory}/${fileName}`)
    .map(filePath => fs.readFileSync(filePath))
    .map(fileData => yaml.safeLoad(fileData))
    .forEach(doc => destObj = deepMerge(destObj, doc));

  return destObj;
}

module.exports = buildGrammar;
