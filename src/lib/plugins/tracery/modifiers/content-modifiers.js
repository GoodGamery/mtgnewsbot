'use strict';

// UTILITY FUNCTIONS

function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

// returns a random integer between minOrMaxArg and maxArg, or between 1 and minOrMaxArg if maxArg is not defined
function randomInt(minOrMaxArg, maxArg) {
  const min = (maxArg !== undefined) ? minOrMaxArg : 1;
  const max = (maxArg !== undefined) ? maxArg : minOrMaxArg;
  return Math.floor(Math.random() * (max - min  + 1)) + min;
}

// returns a string representation of a date in "Month Day" format with ordinal day, e.g. November 18th
function getMonthDayOrdinal(date) {
  return date.toLocaleString('en-us', {  month: 'long' }) + ' ' + getOrdinalNum(date.toLocaleString('en-us', {  day: 'numeric' }))
}

// MODIFIERS

function currentYear() {
  return '' + new Date().getFullYear();
}

function dayOfWeek() {
  return '' + new Date().toLocaleString('en-us', {  weekday: 'long' });
}

function dayOfWeekOccasion() {
  const descriptors = {
    'monday'    : ['Magic', 'Modern', 'Midrange', 'Monocolored', 'Momir', 'Meloku', 'Minotaur', 'Madness', 'Morph', 'Magmaw'],
    'tuesday'   : ['Tribal', 'Two-Headed', 'Tamiyo', 'Teferi', 'Tezzeret', 'Tutor', 'Tuktuk', 'Tap-Out', 'Trample', 'Takklemaggot', 'True-Name', '0-2'],
    'wednesday' : ['Weird', 'Whiskey', 'Wizard', 'Welkin', 'Werebear', 'Westvale', 'Wither', 'Withengar', 'Wrexial'],
    'thursday'  : ['Throwback', 'Thassa', 'Thalia', 'Thopter', 'Thrull', 'Thragtusk', 'Thoughtseize'],
    'friday'    : ['Flashback', 'Forgettable', 'Feldon', 'Faerie', 'Frog Tongue', 'Fatty', 'Fat Pants', 'French Vanilla','Fat Pack', 'Finance'],
    'saturday'  : ['Standard', 'Singleton', 'Squirrel', 'Sea Kings\'', 'Satyr', 'Saprazzan', 'Standstill', 'Stasis', 'Storm Scale', 'Shuffler'],
    'sunday'    : ['Stompy', 'Suntail', 'Sun\'s Zenith', 'Sundering', 'Sulfuric', 'Sultai', 'Summoners', 'Spindown', 'Subreddit', 'Slow Play']
  };
  const todayDescriptors = descriptors[dayOfWeek().toLowerCase()];
  return '' + todayDescriptors[Math.floor(Math.random() * todayDescriptors.length)];
}


// returns a random month / day other than today's date
function randomMonthDay() {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(1, 364)); // choose a day 7-60 days in future
  return getMonthDayOrdinal(date);
}

function randomUpcomingMonthDay() {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(7, 60)); // choose a day 7-60 days in future
  return getMonthDayOrdinal(date);
}

function dayOfWeekMotivation() {
  const descriptors = {
    'monday'    : ['Motivation', 'Mottos', 'Misconceptions', 'Madness', 'Malarkey', 'Mumbo Jumbo', 'Messages'],
    'tuesday'   : ['Teachings', 'Talk', 'Tripe', 'Trifles', 'Testimony'],
    'wednesday' : ['Wisdom', 'Wit', 'Wizardry', 'Wordplay', 'Words'],
    'thursday'  : ['Thoughts', 'Thinkers'],
    'friday'    : ['Flavor', 'Fun', 'Faux Pas', 'Foolishness'],
    'saturday'  : ['Sarcasm', 'Strategy', 'Silliness', 'Sincerity'],
    'sunday'    : ['Sayings', 'Sophistry', 'Stupidity', 'Stories']
  };
  const todayDescriptors = descriptors[dayOfWeek().toLowerCase()];
  return '' + todayDescriptors[Math.floor(Math.random() * todayDescriptors.length)];
}

module.exports = { 
  currentYear,
  dayOfWeek,
  dayOfWeekOccasion,
  dayOfWeekMotivation
};