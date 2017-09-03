// Combines grammar files together using a deep merge
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const deepMerge = require(`./lib/util/deep-merge.js`);


// This is synchronous
function buildGrammar(directory) {

  const files = walk(directory);
  console.info(`Loading ${files.length} grammar files...`);

  const flatType = s => s.endsWith(`.txt`);
  const yamlType = s => s.endsWith(`.json`) || s.endsWith(`.yaml`) || s.endsWith(`.yml`);

  let destObj = {};

  files
    .filter(flatType)
    .map(fileName => {
      const fileData = fs.readFileSync(`${fileName}`);
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
    .map(fileName => fs.readFileSync(`${fileName}`))
    .map(fileData => yaml.safeLoad(fileData))
    .forEach(doc => destObj = deepMerge(destObj, doc));

  return destObj;
}

const walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory())
      results = results.concat(walk(file));
    else
      results.push(file);
  });
  return results;
};

module.exports = buildGrammar;
