'use strict';
const request = require('request');
const config = global.mtgnewsbot.config;

function allCaps(s) {
  return s.toUpperCase();
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

async function cardSearchBySet(s) {
  const query = { 
    q: 'set:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);    
}

async function cardSearchByText(s) {
  const query = { 
    q: 'text:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);  
}

async function cardSearchByType(s) {  
  const query = { 
    q: 't:' + s,
    limit: 1,
    sort: 'random'
  };
  return cardFinderSearch(query);
}

function getColorDescription(colorIdentity) {
  const colorNames = {
    W: 'white',
    U: 'blue',
    B: 'black',
    R: 'red',
    G: 'green',
    WU: 'UW',
    WR: 'RW',
    WG: 'GW',
    BR: 'RB',
    UBG: 'BUG',
    URG: 'RUG'
  };

  if (!colorIdentity) {
    return 'colorless';
  }

  const colorDescription = colorIdentity.join('');
  return colorNames[colorDescription] || colorDescription;
}

async function cardFinderSearch(query) {
  const SEARCH_API_JSON_URL = 'https://goodgamery.com/api/mtg/card/json';
  return new Promise(resolve => {
    request.get({ url: SEARCH_API_JSON_URL, qs: query }, (err, data, body) => {
      if (err) {
        console.warn('Error fetching card data: ' + err);        
        resolve('NO RESULTS');
      }

      const logger = config.loggers.cardfinder;

      try {
        logger.log('[cardFinderSearch] data:\n' + JSON.stringify(data));
        logger.log('[cardFinderSearch] result:\n' + JSON.stringify(JSON.parse(body)[0], null, '\t'));
        const result = JSON.parse(body);
        const name = result[0].name;
        const imgUrl = result[0].imageUrl.replace(/:/g,'#colon#');
        const color = getColorDescription(result[0].colorIdentity);

        resolve(`[_cardName1:${name}][_cardImgUrl1:${imgUrl}][_cardColor1:${color}]`);
      } catch (e) {
        console.warn('Error parsing card data: ' + e);
        resolve('NO RESULTS');
      }
    });
  });  
}

module.exports = { 
  allCaps: allCaps,
  hyphenate: hyphenate,
  noPunctuation: noPunctuation,
  noSpaces: noSpaces,
  cardSearchBySet: cardSearchBySet,  
  cardSearchByText: cardSearchByText,
  cardSearchByType: cardSearchByType  
};