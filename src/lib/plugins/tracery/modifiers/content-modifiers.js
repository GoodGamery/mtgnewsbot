'use strict';

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