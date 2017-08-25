'use strict';

function allCaps(s) {
  return s.toUpperCase();
}

function noPunctuation(s) {
  return s.replace(/[()',"-:\[\].?!:;=+_&*%^`~{}\\/|]/g, '');
}

function noSpaces(s) {
  return s.replace(/\s+/g, '');
}

module.exports = { 
  allCaps: allCaps,
  noPunctuation: noPunctuation,
  noSpaces: noSpaces
};