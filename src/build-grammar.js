// Combines grammar files together using a deep merge
"use strict";

const fs = require(`fs`);
const deepMerge = require(`./lib/util/deep-merge.js`);


// This is synchronous
function buildGrammar(directory) {

  const files = fs.readdirSync(directory);
  console.log(`Loading ${files.length} files:\n${files.join(', ')}`);

  let fileData = [];
  files.forEach(fileName => {
    let data = fs.readFileSync(`${directory}/${fileName}`);
    fileData.push(JSON.parse(data));
  });

  let destObj = {};
  fileData.forEach(data => {
    destObj = deepMerge(destObj, data);
  });
  return destObj;
}

module.exports = buildGrammar;
