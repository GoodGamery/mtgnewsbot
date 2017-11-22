'use strict';

function allCaps(s) {
  return s.toUpperCase();
}

function ed(s) {
  if (s.endsWith('e')) {
    return s + 'd';
  } else if (s.endsWith('y')) {
    return s.substring(0, s.length - 1) + 'ied';
  }
  return s + 'ed';
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

function stripLeadingText(s, params) {
  const leadingText = params[0];
  const ignoreCase = !!params[1];

  if (s.length === 0 || !leadingText || leadingText.length === 0) {
    return s;
  }

  if (ignoreCase) {
    return s.toLowerCase().startsWith(leadingText.toLowerCase()) ? s.replace(new RegExp(leadingText, 'i'), '') : s;
  }
  
  return s.startsWith(leadingText) ? s.replace(leadingText,'') : s;
}

module.exports = { 
  allCaps,
  ed,
  lowercase,
  hyphenate,
  noPunctuation,
  noSpaces,
  stripLeadingText
};