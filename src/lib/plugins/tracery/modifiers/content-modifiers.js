'use strict';

function dayOfWeekOccasion(random=false) {

  const descriptors = {
    'Monday'    : ['Magic', 'Modern', 'Midrange', 'Monocolored', 'Momir', 'Meloku', 'Minotaur', 'Madness', 'Morph', 'Magmaw'],
    'Tuesday'   : ['Tribal', 'Two-Headed', 'Tamiyo', 'Teferi', 'Tutor', 'TukTuk', 'Turtle', 'Trample', 'Takklemaggot', 'True-Name'],
    'Wednesday' : ['Weird','Whiskey', 'Wizard', 'Weird', 'Wither', 'Withengar', 'Wrexial'],
    'Thursday'  : ['Throwback', 'Thassa', 'Thalia', 'Tezzeret', 'Thopter', 'Thrull', 'Thragtusk'],
    'Friday'    : ['Flashback', 'Forgettable', 'Feldon', 'Faerie', 'Frog Tongue', 'Fatty', 'FatPants', 'FrenchVanilla'],
    'Saturday'  : ['Standard', 'Singleton', 'Squirrel', 'Sea Kings\''],
    'Sunday'    : ['Stompy', 'Suns\'s Zenith', 'Sundering']
  };

  return undefined;
}

function dayOfWeekQuantity(random=false) {

  const descriptors = {
    'Monday'    : ['Motivation'],
    'Tuesday'   : [''],
    'Wednesday' : ['Wisdom'],
    'Thursday'  : ['Thoughts'],
    'Friday'    : ['Feeling'],
    'Saturday'  : [],
    'Sunday'    : []
  };

  return undefined;
}

function dayOfWeek() {
  return new Date().toLocaleString('en-us', {  weekday: 'long' });
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

module.exports = { 
  dayOfWeekOccasion
};