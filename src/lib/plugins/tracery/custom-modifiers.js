'use strict';

function allCaps(s) {
  return s.toUpperCase();
}

function noPunctuation(s) {
  return s.replace(/[()',"-:[\].?!:;=+_&*%^`~{}\\/|]/g, '');
}

function noSpaces(s) {
  return s.replace(/\s+/g, '');
}

// TODO: replace this with a good example
async function allCapsAsyncTest(s) {
  return new Promise(resolve => {
    console.log('waiting 1000ms...');
    setTimeout(() => {
      resolve(s.toUpperCase());
    }, 1000);
  });
}

module.exports = { 
  allCaps: allCaps,
  noPunctuation: noPunctuation,
  noSpaces: noSpaces,
  allCapsAsyncTest: allCapsAsyncTest
};