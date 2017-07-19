// Combines grammar files together using a deep merge

const fs = require(`fs`);
const deepMerge = require(`./lib/util/deep-merge.js`);



function buildGrammar(directory, callback) {
  let numFilesToLoad = 0;
  let fileData = [];

  // Stores data and counts down until complete
  let handleFileRead = function(err, data) {
    if (err)
      throw new Error(err);
    fileData.push(JSON.parse(data));
    numFilesToLoad--;
    if (numFilesToLoad === 0)
      handleAllDataLoaded(fileData);
  };

  // Merge all data together and invoke callback
  let handleAllDataLoaded = function(dataArray) {
    let destObj = {};
    dataArray.forEach(data => {
      destObj = deepMerge(destObj, data);
    })
    callback(JSON.stringify(destObj));
  }

  fs.readdir(directory, (err, files) => {
    numFilesToLoad = files.length;
    console.log(`Loading ${numFilesToLoad} files:\n - ${files.join('\n - ')}`);
    files.forEach(fileName => {
      fs.readFile(`${directory}/${fileName}`, handleFileRead);
    })
  });
}

module.exports = buildGrammar;
