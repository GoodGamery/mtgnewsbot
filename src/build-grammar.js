// Combines grammar files together using a deep merge
'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const deepMerge = require(`./lib/util/deep-merge.js`);


// This is synchronous
function buildGrammar(directory) {

  const files = fs.readdirSync(directory);
  console.info(`Loading ${files.length} files:\n${files.join(', ')}`);

  const flatType = s => s.endsWith(`.txt`);
  const yamlType = s => s.endsWith(`.json`) || s.endsWith(`.yaml`);

  let destObj = {};

  files
    .filter(flatType)
    .map(fileName => {
      const fileData = fs.readFileSync(`${directory}/${fileName}`);
      const dataArray = fileData.toString()
        .split(/\r\n/)
        .filter(s => s !== ``);
      let doc = {};
      const key = fileName.slice(0, -4);
      doc[key] = dataArray;
      return doc;
    })
    .forEach(doc => destObj = deepMerge(destObj, doc));

  files
    .filter(yamlType)
    .map(fileName => fs.readFileSync(`${directory}/${fileName}`))
    .map(fileData => yaml.safeLoad(fileData))
    .forEach(doc => destObj = deepMerge(destObj, doc));

  return destObj;
}

module.exports = buildGrammar;
