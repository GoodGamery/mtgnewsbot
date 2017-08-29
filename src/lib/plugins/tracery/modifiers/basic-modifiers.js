'use strict';

function allCaps(s) {
  return s.toUpperCase();
}

function lowercase(s) {
  return s.toLowerCase();
}

function noPunctuation(s) {
  return s.replace(/[()',"-:[\].?!:;=+_&*%^`~{}\\/|]/g, '');
}

function noSpaces(s) {
  return s.replace(/\s+/g, '');
}

function hyphenate(s) {
  return s.replace(/\s+/g, '-');
}

module.exports = { 
  allCaps,
  lowercase,
  hyphenate,
  noPunctuation,
  noSpaces
};