'use strict';

function dayOfWeek() {
  return new Date().toLocaleString('en-us', {  weekday: 'long' });
}

function dayOfWeekOccasion() {
  const descriptors = {
    'monday'    : ['Magic', 'Modern', 'Midrange', 'Monocolored', 'Momir', 'Meloku', 'Minotaur', 'Madness', 'Morph', 'Magmaw'],
    'tuesday'   : ['Tribal', 'Two-Headed', 'Tamiyo', 'Teferi', 'Tutor', 'Tuktuk', 'Tap-Out', 'Trample', 'Takklemaggot', 'True-Name', '0-2'],
    'wednesday' : ['Weird', 'Whiskey', 'Wizard', 'Welkin', 'Werebear', 'Westvale', 'Wither', 'Withengar', 'Wrexial'],
    'thursday'  : ['Throwback', 'Thassa', 'Thalia', 'Tezzeret', 'Thopter', 'Thrull', 'Thragtusk', 'Thoughtseize'],
    'friday'    : ['Flashback', 'Forgettable', 'Feldon', 'Faerie', 'Frog Tongue', 'Fatty', 'Fat Pants', 'French Vanilla','Fat Pack'],
    'saturday'  : ['Standard', 'Singleton', 'Squirrel', 'Sea Kings\'', 'Satyr', 'Saprazzan', 'Standstill', 'Stasis', 'Storm Scale', 'Shuffler'],
    'sunday'    : ['Stompy', 'Suntail', 'Sun\'s Zenith', 'Sundering', 'Sulfuric', 'Sultai', 'Summoners', 'Spindown', 'Subreddit', 'Slow Play']
  };
  const todayDescriptors = descriptors[dayOfWeek().toLowerCase()];
  return todayDescriptors[Math.floor(Math.random() * todayDescriptors.length)];
}

module.exports = { 
  dayOfWeek,
  dayOfWeekOccasion
};