'use strict';

// utility functions

function isVowel(c) {
    var c2 = c.toLowerCase();
    return (c2 === 'a') || (c2 === 'e') || (c2 === 'i') || (c2 === 'o') || (c2 === 'u');
}

// modifiers

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

// useful if you wish to invoke a rule without displaying its text
function hide() {
  return '\0';
}

function lowercase(s) {
  return s.toLowerCase();
}

// useful for testing
function noop(s) {
  return s;
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

function sIfNeeded(s) {
  switch (s.charAt(s.length -1)) {
    case 's':
      return s;
    case 'h':
      return s + "es";
    case 'x':
       return s + "es";
    case 'y':
      if (!isVowel(s.charAt(s.length - 2))) {
        return s.substring(0, s.length - 1) + "ies";
      }
      return s + "s";
    default:
      return s + "s";
    }
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
  hide,
  hyphenate,
  noop,
  noPunctuation,
  noSpaces,
  sIfNeeded,
  stripLeadingText
};