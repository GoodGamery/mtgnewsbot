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
  return date.toLocaleString('en-us', {  month: 'long' }) + ' ' + getOrdinalNum(date.toLocaleString('en-us', {  day: 'numeric' }));
}

function getSeason(date) {
  var _date = date ? date : new Date();
  const month = _date.toLocaleString('en-us', {  month: 'numeric' });

  switch (month) {
    case '1':
    case '2':
    case '12':
      return 'winter';
    case '3':
    case '4':
    case '5':
      return 'spring';
    case '6':
    case '7':
    case '8':
      return 'winter';
    case '9':
    case '10':
    case '11':
      return 'fall';
    default:
      return 'summer';
  }
}

// MODIFIERS
function currentFullDate() {
  return getMonthDayOrdinal(new Date()) + ', ' + currentYear();
}

function currentMonth() {
  return new Date().toLocaleString('en-us', {  month: 'long' });
}

function currentMonthDay() {
  return getMonthDayOrdinal(new Date());
}

function currentYear() {
  return '' + new Date().getFullYear();
}

function currentSeason() {
  return getSeason(new Date());
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

// returns a random month / day other than today's date
function randomMonthDay() {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(1, 364)); // choose a day 7-60 days in future
  return getMonthDayOrdinal(date);
}

function randomUpcomingMonthDay() {
  const formats = {
    english: date => getMonthDayOrdinal(date),
    numeric: date => `${date.getMonth() + 1}/${date.getDate()}`
  };

  const date = new Date();
  date.setDate(date.getDate() + randomInt(7, 60)); // choose a day 7-60 days in future

  const monthString = date.toLocaleString('en-us', {  month: 'long' });
  const referenceRules = `[__randomMonth:${monthString}][__randomDate:${date.getDate()}][__randomMonthDayNumeric:${formats.numeric(date)}]`;

  return formats.english(date) + referenceRules;
}

function randomFutureDateObject(maxYears=10) {
  const date = new Date();
  const offset = 365 - date.getDate();
  const randomDays =  randomInt(0, 365);
  const randomYears = randomInt(0,maxYears - 1);

  date.setDate(date.getDate() + randomYears * 365 + randomDays);

  return date;
}

function randomFutureDate(s, params) {
  const date = randomFutureDateObject(params[0]); 
  return getMonthDayOrdinal(date) + ', ' + date.getFullYear();
}

function randomFutureYear(s, params) {
	const date = new Date();
  return '' + (date.getFullYear() + randomInt(params[0] === '1' ? 0 : 1,params[0]));
}

function randomGathererDates(s, params) {
  const num = params[0] || 1;
  const beginning = new Date('August 5, 1993');
  const range = new Date() - beginning;

  const dates = [];
  for (var i = 0; i < num; i++) {
    dates.push(new Date(beginning.getTime() + Math.floor(range * Math.random())));
  }

  return dates
    .sort((date1, date2) => date1.getTime() - date2.getTime())
    .reduce((dateString, date, i) => dateString += `[_randomGathererDate${i+1}:${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}]`, '');
}

module.exports = { 
  currentMonth,
  currentMonthDay,
  currentYear,
  currentFullDate,
  currentSeason,
  dayOfWeek,
  dayOfWeekOccasion,
  dayOfWeekMotivation,
  randomGathererDates,
  randomMonthDay,
  randomUpcomingMonthDay,
  randomFutureDate,
  randomFutureYear
};