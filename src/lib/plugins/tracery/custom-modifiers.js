'use strict';

function allCaps(s) {
  return s.toUpperCase();
}

function alphaOnly(s) {
  return s.replace(/\W+/g, '');
}

function noSpaces(s) {
  return s.replace(/\s+/g, '');
}

module.exports = { 
  allCaps: allCaps,
  alphaOnly: alphaOnly,
  noSpaces: noSpaces
};