'use strict';

const fs = require('fs');

function readJsonFile(filePath) {
  const rawJson = fs.readFileSync(filePath);
  return JSON.parse(rawJson);
}

module.exports = readJsonFile;