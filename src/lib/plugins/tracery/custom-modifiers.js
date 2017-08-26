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

async function allCapsAsyncTest(s) {
  return new Promise(resolve => {
    console.log('waiting 2000ms...');
    setTimeout(() => {
      resolve(s.toUpperCase());
    }, 2000);
  });
}

module.exports = { 
  allCaps: allCaps,
  allCapsAsyncTest: allCapsAsyncTest,
  noPunctuation: noPunctuation,
  noSpaces: noSpaces
};